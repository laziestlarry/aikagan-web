/**
 * Lemon Squeezy fallback payment webhook.
 * Critical processing is retry-safe: access, ledger, customer entitlement and
 * fulfillment must complete before the event is marked processed.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { products, getProduct } from "@/lib/products";
import { generateDownloadToken } from "@/lib/download-token";
import { tokenStore } from "@/lib/token-store";
import { hasProcessedEvent, markEventProcessed } from "@/lib/webhook-idempotency";
import { recordWebhookCommission } from "@/lib/commissions";
import { fireCapi as fireCapiEvent } from "@/lib/capi-fire";
import { recordTransaction, getCommissionRate } from "@/lib/income-ledger";
import { fulfillPurchase } from "@/lib/fulfillment";
import { customerStore } from "@/lib/customer-store";
import { customerIdForEmail } from "@/lib/customer-session";
import { canonicalSiteOrigin } from "@/lib/site-origin";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifySignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

function resolveSlug(productName: string, variantName: string, customSlug?: string): string {
  const fallbackPaidSlug = products.find((p) => p.priceModel === "one_time")?.slug ?? products[0].slug;
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

  const eventId: string = event?.meta?.event_id ?? "";
  if (await hasProcessedEvent("lemonsqueezy", eventId)) {
    return NextResponse.json({ received: true, dedup: true });
  }

  const eventName = event?.meta?.event_name;
  if (eventName !== "order_created") {
    await markEventProcessed("lemonsqueezy", eventId);
    return NextResponse.json({ received: true, skipped: true });
  }

  const data = ((event as { data?: { attributes?: Record<string, unknown> } }).data?.attributes ?? {}) as Record<string, unknown>;
  const orderId = String(event?.data?.id ?? "");
  const email = String((data.user_email as unknown) ?? (data.email as unknown) ?? "").trim().toLowerCase();
  if (!orderId || !email || !email.includes("@")) {
    return NextResponse.json({ error: "Order ID or buyer email missing" }, { status: 400 });
  }

  const customerName = String((data.user_name as unknown) ?? email.split("@")[0] ?? "Valued Customer");
  const firstItem = (data.first_order_item ?? {}) as Record<string, unknown>;
  const productName = String(firstItem.product_name ?? "");
  const variantName = String(firstItem.variant_name ?? "");
  const customSlug = String(event?.meta?.custom_data?.product_slug ?? "");
  const refCode: string | null = (event?.meta?.custom_data?.ref_code as string) || null;
  const subtotalCents = parseInt(String(data.subtotal ?? "0"), 10) || 0;
  const amount = subtotalCents / 100;

  const slug = resolveSlug(productName, variantName, customSlug || undefined);
  const product = getProduct(slug);
  if (!product) return NextResponse.json({ error: "Product not in catalog" }, { status: 400 });

  const token = product.zipFilename ? generateDownloadToken(slug, orderId, email) : null;
  await tokenStore.set(orderId, {
    token,
    slug,
    email,
    exp: Date.now() + 48 * 60 * 60 * 1000,
  });
  // Checkout creation may pre-register ls:<checkoutId>; the order ID is the
  // authoritative post-payment key used by the fulfillment access link.

  let capiFired = false;
  try {
    const capiRes = await fireCapiEvent(
      {
        event_name: "Purchase",
        event_id: orderId,
        email,
        value: amount,
        currency: "USD",
        content_ids: [slug],
        content_name: product.name,
        utm: { product_slug: slug, ref_code: refCode ?? "" },
      },
      { req: { headers: req.headers }, source: "ls_webhook" },
    );
    capiFired = capiRes.ok || capiRes.attempted;
  } catch (err) {
    console.warn("[ls-webhook] CAPI failed non-critically", String(err));
  }

  const commission = refCode ? (amount * getCommissionRate(slug)) / 100 : 0;
  try {
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
    console.error("[ls-webhook] ledger write failed", err);
    return NextResponse.json({ error: "Ledger persistence failed" }, { status: 503 });
  }

  try {
    await customerStore.grantEntitlement(
      customerIdForEmail(email),
      email,
      slug,
      orderId,
      token ? `/api/download/${token}` : null,
    );
  } catch (err) {
    console.error("[ls-webhook] entitlement provisioning failed", err);
    return NextResponse.json({ error: "Entitlement provisioning failed" }, { status: 503 });
  }

  const accessUrl = `${canonicalSiteOrigin(req.nextUrl.origin)}/checkout-success?transaction_id=${encodeURIComponent(orderId)}`;
  try {
    await fulfillPurchase({
      orderId,
      provider: "lemonsqueezy",
      email,
      name: customerName,
      productName: product.name,
      productSlug: slug,
      value: amount,
      downloadUrl: accessUrl,
    });
  } catch (err) {
    console.error("[ls-webhook] fulfillment failed", err);
    return NextResponse.json({ error: "Fulfillment queue failed" }, { status: 503 });
  }

  if (refCode) {
    try {
      recordWebhookCommission({
        refCode,
        orderId,
        productSlug: slug,
        amount,
        provider: "lemonsqueezy",
      });
    } catch (err) {
      console.warn("[ls-webhook] commission side effect failed", String(err));
    }
  }

  await markEventProcessed("lemonsqueezy", eventId);

  console.log(JSON.stringify({
    event: "ls_webhook_committed",
    orderId,
    slug,
    ref: refCode,
    email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    amount,
    timestamp: new Date().toISOString(),
  }));

  return NextResponse.json({ received: true, orderId, slug });
}
