import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { products } from "@/lib/products";

// ─────────────────────────────────────────────────────────────────────────────
// LemonSqueezy Webhook Handler
// Docs: https://docs.lemonsqueezy.com/help/webhooks
//
// Registered events consumed: order_created
//
// Flow:
//   1. Verify HMAC-SHA256 signature from X-Signature header
//   2. Extract order data
//   3. Map purchased product → slug via lib/products.ts
//   4. Generate a signed, expiring download token (HMAC-SHA256 JWT-like)
//   5. Redirect LemonSqueezy to /checkout-success?token=<token>
//
// The token itself is self-contained — no external DB required.
// Format: base64url( JSON payload ) . base64url( HMAC-SHA256 signature )
// ─────────────────────────────────────────────────────────────────────────────

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "";
const TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET ?? "";

// Token TTL: 48 hours
const TOKEN_TTL_MS = 48 * 60 * 60 * 1000;

function verifySignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function generateDownloadToken(slug: string, orderId: string, email: string): string {
  if (!TOKEN_SECRET) throw new Error("DOWNLOAD_TOKEN_SECRET is not set");
  const payload = {
    slug,
    orderId,
    email,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${sig}`;
}

/**
 * Map LemonSqueezy order to an internal product slug.
 * Priority: custom_data.product_slug (set by CheckoutButton) → product name match → tier keyword.
 * The custom_data field is the most reliable since it's set explicitly at checkout time.
 */
function resolveSlug(productName: string, variantName: string, customSlug?: string): string {
  // 1. Trust explicit slug passed via checkout custom data
  if (customSlug) {
    const match = products.find((p) => p.slug === customSlug);
    if (match) return match.slug;
  }
  // 2. Fuzzy match against product name / slug / tier
  const name = `${productName} ${variantName}`.toLowerCase();
  for (const product of products) {
    if (name.includes(product.slug.toLowerCase())) return product.slug;
    if (name.includes(product.name.toLowerCase())) return product.slug;
    if (name.includes(product.tier.toLowerCase())) return product.slug;
  }
  // 3. Keyword fallback: commander > pro > starter
  if (name.includes("commander")) return "golden-delivery-commander";
  if (name.includes("pro")) return "golden-delivery-pro";
  if (name.includes("starter")) return "golden-delivery-starter";
  return products[0].slug;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = (event as { meta?: { event_name?: string } }).meta?.event_name;

  // Only process order_created events
  if (eventName !== "order_created") {
    return NextResponse.json({ received: true, skipped: true });
  }

  const data = (event as { data?: { attributes?: Record<string, unknown> } }).data?.attributes ?? {};
  const orderId = String((event as { data?: { id?: unknown } }).data?.id ?? "");
  const email = String(data.user_email ?? data.email ?? "");
  const productName = String(data.first_order_item?.product_name ?? "");
  const variantName = String(data.first_order_item?.variant_name ?? "");
  // custom_data is set by CheckoutButton as checkout[custom][product_slug]
  const customSlug = String((event as { meta?: { custom_data?: { product_slug?: unknown } } }).meta?.custom_data?.product_slug ?? "");

  const slug = resolveSlug(productName, variantName, customSlug || undefined);
  const token = generateDownloadToken(slug, orderId, email);

  // Log for evidence trail (non-blocking)
  console.log(JSON.stringify({
    event: "webhook_order_created",
    orderId,
    email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    slug,
    timestamp: new Date().toISOString(),
  }));

  return NextResponse.json({ received: true, token });
}
