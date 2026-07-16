import { getProduct } from "./products";
import { GUMROAD_PRODUCTS } from "./gumroad-products";
import type { GumroadSale } from "./gumroad-api";
import { fulfillPurchase } from "./fulfillment";
import { generateDownloadToken } from "./download-token";
import { tokenStore } from "./token-store";
import { markEventIfNew } from "./webhook-idempotency";
import { recordTransaction } from "./income-ledger";
import { fireCapi as fireCapiEvent } from "./capi-fire";

function normalizedEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function saleIdOf(sale: GumroadSale): string {
  return String(sale.id ?? sale.sale_id ?? "").trim();
}

function slugFromSale(sale: GumroadSale): string | null {
  const permalink = String(sale.product_permalink ?? sale.permalink ?? "").trim();
  const productId = String(sale.product_id ?? "").trim();
  const match = Object.entries(GUMROAD_PRODUCTS).find(([, product]) =>
    product.id === productId || product.permalink === permalink,
  );
  return match?.[0] ?? null;
}

export async function processVerifiedGumroadSale(
  sale: GumroadSale,
  options: { source: "gumroad_webhook" | "gumroad_reconcile"; headers?: Headers },
): Promise<{
  ok: boolean;
  dedup?: boolean;
  ignored?: boolean;
  saleId?: string;
  orderId?: string;
  slug?: string;
  detail?: string;
}> {
  const saleId = saleIdOf(sale);
  if (!saleId) return { ok: false, detail: "Verified sale has no ID" };
  if (sale.refunded || sale.disputed || sale.chargebacked || sale.chargebacked_at) {
    return { ok: false, saleId, detail: "Sale is refunded or disputed" };
  }

  const email = normalizedEmail(sale.email ?? sale.purchaser_email);
  if (!email) return { ok: false, saleId, detail: "Verified sale has no buyer email" };

  const slug = slugFromSale(sale);
  if (!slug) return { ok: true, ignored: true, saleId, detail: "Unmapped Gumroad product" };

  const product = getProduct(slug);
  const gumroadProduct = GUMROAD_PRODUCTS[slug];
  if (!product || !gumroadProduct) return { ok: false, saleId, slug, detail: "Product not in catalog" };

  const isNew = await markEventIfNew("gumroad", saleId);
  if (!isNew) return { ok: true, dedup: true, saleId, slug };

  const orderId = `gr-${saleId}`;
  const value = gumroadProduct.priceCents / 100;
  const currency = String(sale.currency ?? "USD").toUpperCase();
  const name = String(sale.full_name ?? sale.purchaser_name ?? email.split("@")[0] ?? "Valued Customer");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";

  let downloadUrl = siteUrl;
  if (product.zipFilename) {
    const token = generateDownloadToken(slug, orderId, email);
    downloadUrl = `${siteUrl}/api/download/${token}`;
    await tokenStore.set(orderId, {
      token,
      slug,
      email,
      exp: Date.now() + 48 * 60 * 60 * 1000,
    });
  }

  const capiResult = await fireCapiEvent(
    {
      event_name: "Purchase",
      event_id: orderId,
      email,
      value,
      currency,
      content_ids: [slug],
      content_name: product.name,
      utm: { product_slug: slug, provider: "gumroad" },
    },
    {
      req: { headers: options.headers ?? new Headers() },
      source: options.source,
    },
  );

  await recordTransaction({
    orderId,
    provider: "gumroad",
    slug,
    email,
    value,
    currency,
    refCode: null,
    utm: { product_slug: slug },
    capturedAt: Date.now(),
    eventId: saleId,
    commission: 0,
    capiFired: capiResult.ok || capiResult.attempted,
  });

  await fulfillPurchase({
    email,
    name: name || "Valued Customer",
    productName: product.name,
    productSlug: slug,
    orderId,
    value,
    provider: "gumroad",
    downloadUrl,
  });

  console.log(JSON.stringify({
    event: "gumroad_fulfillment_complete",
    source: options.source,
    saleId,
    orderId,
    slug,
    email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
  }));

  return { ok: true, saleId, orderId, slug };
}
