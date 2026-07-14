// ─────────────────────────────────────────────────────────────────────────────
// POST /api/webhooks/gumroad
//
// Receives Gumroad sale notifications (ping) and fires the fulfillment
// pipeline — same as Paddle and LemonSqueezy webhooks.
//
// Gumroad sends a POST with form-encoded body on every sale.
// We verify via the signed license key and map it to a product slug,
// then call fulfillPurchase() to send the email + CAPI + ledger.
//
// Set up in Gumroad dashboard: Settings → Advanced → Ping
// URL: https://aikagan.com/api/webhooks/gumroad
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { fulfillPurchase } from "@/lib/fulfillment";
import { generateDownloadToken } from "@/lib/download-token";
import { tokenStore } from "@/lib/token-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Map Gumroad permalink to aikagan product slug */
/** Full permalinks match Gumroad product URLs (e.g. autonomax-starter-29) */
const PERMALINK_TO_SLUG: Record<string, string> = {
  "autonomax-starter": "masterclass-starter",
  "autonomax-starter-29": "masterclass-starter",
  "autonomax-pro": "masterclass-pro",
  "autonomax-pro-79": "masterclass-pro",
  "autonomax-commander": "masterclass-commander",
  "autonomax-commander-149": "masterclass-commander",
};

export async function POST(req: NextRequest) {
  try {
    // Gumroad sends application/x-www-form-urlencoded
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const saleId = (formData.get("sale_id") as string) ?? "";
    const productName = (formData.get("product_name") as string) ?? "";
    const productPermalink = (formData.get("permalink") as string) ?? "";
    const email = (formData.get("email") as string) ?? "";
    const fullName = (formData.get("full_name") as string) ?? "";
    const price = parseFloat((formData.get("price") as string) ?? "0");
    const currency = (formData.get("currency") as string) ?? "usd";
    const licenseKey = (formData.get("license_key") as string) ?? "";

    console.log("📥 Gumroad webhook received:", {
      saleId,
      productName,
      productPermalink,
      email,
      price,
      currency,
    });

    // Map to our product system
    const slug = PERMALINK_TO_SLUG[productPermalink];
    if (!slug) {
      console.warn("⚠️ Gumroad unknown product permalink:", productPermalink);
      return NextResponse.json({ ok: true, note: "unknown product" });
    }

    const product = getProduct(slug);
    if (!product) {
      console.warn("⚠️ Gumroad slug not in catalog:", slug);
      return NextResponse.json({ ok: true, note: "unknown slug" });
    }

    // Build download URL using a real, signed HMAC token
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";
    let downloadUrl = siteUrl;
    if (product.zipFilename) {
      const hmacToken = generateDownloadToken(slug, `gr-${saleId}`, email);
      downloadUrl = `${siteUrl}/api/download/${hmacToken}`;

      // Cache the token in the tokenStore under the Gumroad transaction ID
      await tokenStore.set(`gr-${saleId}`, {
        token: hmacToken,
        slug,
        email,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });
      console.log(`[gumroad-webhook] Cached Gumroad token in store for gr-${saleId}`);
    }

    // Fulfill: send purchase confirmation email with download link
    const buyerName = fullName || email.split("@")[0] || "Valued Customer";
    await fulfillPurchase({
      email,
      name: buyerName,
      productName: product.name,
      productSlug: slug,
      orderId: `gr-${saleId}`,
      value: price,
      provider: "gumroad",
      downloadUrl,
    });

    console.log("✅ Gumroad fulfillment complete:", { saleId, slug });

    return NextResponse.json({ ok: true, saleId, slug });
  } catch (err: any) {
    console.error("❌ Gumroad webhook error:", err);
    // Always return 200 to Gumroad so they don't retry indefinitely
    return NextResponse.json({ ok: true, error: err?.message ?? "unknown" });
  }
}
