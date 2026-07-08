/**
 * POST /api/webhooks/lemonsqueezy
 *
 * LemonSqueezy webhook handler — fallback payment provider.
 *
 * Registered events consumed: order_created
 *
 * Flow:
 *   1. Verify HMAC-SHA256 signature from X-Signature header
 *   2. Idempotency check (event_id dedup)
 *   3. Extract order data
 *   4. Map purchased product → slug via lib/products.ts
 *   5. Generate a signed, expiring download token
 *   6. Record affiliate commission (if ref_code present)
 *   7. Fire CAPI Purchase event
 *
 * The token itself is self-contained — no external DB required.
 * Format: base64url( JSON payload ) . base64url( HMAC-SHA256 signature )
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { products } from "@/lib/products";
import { generateDownloadToken } from "@/lib/download-token";
import { getProduct } from "@/lib/products";
import { markEventIfNew } from "@/lib/webhook-idempotency";
import { recordWebhookCommission } from "@/lib/commissions";
import { fireCapi as fireCapiEvent } from "@/lib/capi-fire";
import { recordTransaction, getCommissionRate } from "@/lib/income-ledger";
import { fulfillPurchase } from "@/lib/fulfillment";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifySignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/** Map LemonSqueezy order to an internal product slug. */
function resolveSlug(productName: string, variantName: string, customSlug?: string): string {
  const fallbackPaidSlug =
    products.find((p) => p.priceModel === "one_time")?.slug ?? products[0].slug;
  if (customSlug) {
    const match = products.find((p) => p.slug === customSlug);
    if (match) return match.slug;
  }
  const name = `${productName} ${variantName}`.toLowerCase();
  for (const product of products) {
    if (name.includes(product.slug.toLowerCase())) return product.slug;
    if (name.includes(product.name.toLowerCase())) return product.slug;
    if (name.includes(product.tier.toLowerCase())) return product.slug;
  }
  if (name.includes("commander")) return "masterclass-commander";
  if (name.includes("pro")) return "masterclass-pro";
  if (name.includes("starter")) return "masterclass-starter";
  return fallbackPaidSlug;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Idempotency: LemonSqueezy uses meta.event_id
  const eventId: string = event?.meta?.event_id ?? "";
  const isNew = await markEventIfNew("lemonsqueezy", eventId);
  if (!isNew) {
    return NextResponse.json({ received: true, dedup: true });
  }

  const eventName = event?.meta?.event_name;

  // Only process order_created events
  if (eventName !== "order_created") {
    return NextResponse.json({ received: true, skipped: true });
  }

  const data = ((event as { data?: { attributes?: Record<string, unknown> } }).data?.attributes ?? {}) as Record<string, unknown>;
  const orderId = String(event?.data?.id ?? "");
  const email = String((data.user_email as unknown) ?? (data.email as unknown) ?? "");
  const customerName = String((data.user_name as unknown) ?? email.split("@")[0] ?? "Valued Customer");
  const firstItem = (data.first_order_item ?? {}) as Record<string, unknown>;
  const productName = String(firstItem.product_name ?? "");
  const variantName = String(firstItem.variant_name ?? "");
  const customSlug = String(event?.meta?.custom_data?.product_slug ?? "");
  const refCode: string | null =
    (event?.meta?.custom_data?.ref_code as string) || null;
  // Total in dollars (LemonSqueezy stores cents in subtotal)
  const subtotalCents = parseInt(String(data.subtotal ?? "0"), 10) || 0;
  const amount = subtotalCents / 100;

  const slug = resolveSlug(productName, variantName, customSlug || undefined);
  const product = getProduct(slug);
  const token = generateDownloadToken(slug, orderId, email);

  // Record affiliate commission (non-blocking)
  if (refCode) {
    recordWebhookCommission({
      refCode,
      orderId,
      productSlug: slug,
      amount,
      provider: "lemonsqueezy",
    });
  }

  // ── Fulfillment: send confirmation email + social proof (non-blocking) ──
  const downloadUrl = `${SITE_URL}/checkout-success?transaction_id=${orderId}`;
  fulfillPurchase({
    orderId,
    provider: "lemonsqueezy",
    email,
    name: customerName,
    productName: product?.name ?? slug,
    productSlug: slug,
    value: amount,
    downloadUrl,
  });

  // Fire CAPI Purchase event (non-blocking) — now also returns success
  const capiRes = await fireCapiEvent(
    {
      event_name: "Purchase",
      event_id: orderId,
      email,
      value: amount,
      currency: "USD",
      content_ids: [slug],
      content_name: product?.name,
      utm: { product_slug: slug, ref_code: refCode ?? "" },
    },
    { req: { headers: req.headers }, source: "ls_webhook" },
  );
  const capiFired = capiRes.ok || capiRes.attempted;

  // Persist to durable income ledger
  try {
    const commission = refCode ? (amount * getCommissionRate(slug)) / 100 : 0;
    await recordTransaction({
      orderId,
      provider: "lemonsqueezy",
      slug,
      email,
      value: amount,
      currency: "USD",
      refCode: refCode ?? null,
      utm: { product_slug: slug },
      capturedAt: Date.now(),
      eventId,
      commission,
      capiFired,
    });
  } catch (err) {
    console.error("[ls-webhook] ledger write failed:", err);
  }

  console.log(JSON.stringify({
    event: "ls_webhook_processed",
    orderId,
    slug,
    ref: refCode,
    email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    amount,
    timestamp: new Date().toISOString(),
  }));

  return NextResponse.json({ received: true, token });
}
