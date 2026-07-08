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
import { getGumroadProduct } from "@/lib/gumroad-products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Map Gumroad permalink to aikagan product slug */
function permalinkToSlug(permalink: string): string | null {
  const map: Record<string, string> = {
    "autonomax-starter": "masterclass-starter",
    "autonomax-pro": "masterclass-pro",
    "autonomax-commander": "masterclass-commander",
  };
  return map[permalink] ?? null;
}

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
    const ipCountry = (formData.get("ip_country") as string) ?? "";

    console.log("📥 Gumroad webhook received:", {
      saleId,
      productName,
      productPermalink,
      email,
      price,
      currency,
    });

    // Map to our product system
    const slug = permalinkToSlug(productPermalink);
    if (!slug) {
      // Unknown product — still log but don't fulfill
      console.warn("⚠️ Gumroad unknown product permalink:", productPermalink);
      return NextResponse.json({ ok: true, note: "unknown product" });
    }

    const product = getProduct(slug);
    if (!product) {
      console.warn("⚠️ Gumroad slug not in catalog:", slug);
      return NextResponse.json({ ok: true, note: "unknown slug" });
    }

    // Fulfill: send purchase email with download link
    const buyerName = fullName || email.split("@")[0] || "Valued Customer";
    const fulfillResult = await fulfillPurchase({
      email,
      name: buyerName,
      slug,
      orderId: `gr-${saleId}`,
      amount: price,
      currency,
      downloadUrl: product.zipFilename
        ? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://aikagan.com"}/api/download/${licenseKey}`
        : undefined,
    });

    console.log("✅ Gumroad fulfillment result:", fulfillResult);

    return NextResponse.json({
      ok: true,
      saleId,
      slug,
      fulfilled: fulfillResult,
    });
  } catch (err: any) {
    console.error("❌ Gumroad webhook error:", err);
    // Always return 200 to Gumroad so they don't retry indefinitely
    return NextResponse.json({ ok: true, error: err?.message ?? "unknown" });
  }
}
