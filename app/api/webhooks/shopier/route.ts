import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { fulfillPurchase } from "@/lib/fulfillment";
import { verifyOsb, parseOsbPayload } from "@nopeion/shopier/osb";
import { generateDownloadToken } from "@/lib/download-token";
import { tokenStore } from "@/lib/token-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getUsdToTryRate(): Promise<number> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (res.ok) {
      const data = await res.json();
      const rate = data.rates?.TRY;
      if (typeof rate === "number" && rate > 0) return rate;
    }
  } catch (e) {
    console.error("[currency-converter] Failed to fetch USD/TRY exchange rate", e);
  }
  return 34.2;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const resVal = (formData.get("res") as string) ?? "";
    const hashVal = (formData.get("hash") as string) ?? "";

    console.log("📥 Shopier OSB webhook received POST data:", { res: resVal, hash: hashVal });

    const username = process.env.SHOPIER_OSB_USERNAME || process.env.AUTONOMAX_SHOPIER_OSB_USERNAME;
    const password = process.env.SHOPIER_OSB_PASSWORD || process.env.AUTONOMAX_SHOPIER_OSB_KEY || process.env.AUTONOMAX_SHOPIER_OSB_PASSWORD;
    if (!username || !password) {
      console.error("❌ Shopier OSB credentials (username/password) not configured in env");
      return NextResponse.json({ error: "OSB credentials not configured" }, { status: 500 });
    }

    // 1. Verify OSB HMAC signature
    const verifyResult = verifyOsb({
      res: resVal,
      hash: hashVal,
      username,
      password,
    });

    if (!verifyResult.verified) {
      console.warn("⚠️ Shopier OSB invalid webhook signature:", verifyResult.error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Parse OSB base64 payload
    const payload = parseOsbPayload(resVal);
    console.log("✅ Shopier OSB verified payload:", payload);

    const buyerEmail = payload.email;
    if (!buyerEmail) {
      console.error("❌ Shopier OSB buyer email missing from payload");
      return NextResponse.json({ error: "Email missing" }, { status: 400 });
    }

    // 3. Map to product slug
    // Try to get slug from pre-registered token store
    let slug = "masterclass-starter";
    const rawOrderId = String(payload.orderId || "");
    const cached = await tokenStore.get(rawOrderId);
    const priceVal = payload.price ?? 0;

    if (cached?.slug) {
      slug = cached.slug;
      console.log(`🎯 Shopier OSB webhook: found pre-registered slug in token store: ${slug}`);
    } else {
      // Fallback: price-based mapping (convert TRY to USD first since Shopier processes in TRY)
      let usdPrice = priceVal;
      if (priceVal > 200) {
        const usdRate = await getUsdToTryRate().catch(() => 34.2);
        usdPrice = priceVal / usdRate;
      }

      if (usdPrice >= 130) {
        slug = "masterclass-commander";
      } else if (usdPrice >= 60) {
        slug = "masterclass-pro";
      } else {
        slug = "masterclass-starter";
      }
      console.log(`⚠️ Shopier OSB webhook fallback: mapped price ${priceVal} TRY (~$${usdPrice.toFixed(2)} USD) to slug: ${slug}`);
    }

    const product = getProduct(slug);
    if (!product) {
      console.warn("⚠️ Shopier mapped product not found in catalog for slug:", slug);
      return NextResponse.json({ error: "Product not in catalog" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";
    const orderId = rawOrderId.startsWith("sp") ? rawOrderId : `sp-${rawOrderId}`;
    
    // Generate secure download token and store it
    const token = generateDownloadToken(slug, orderId, buyerEmail);
    await tokenStore.set(orderId, {
      token,
      slug,
      email: buyerEmail,
      exp: Date.now() + 48 * 60 * 60 * 1000,
    });

    const downloadUrl = product.zipFilename
      ? `${siteUrl}/checkout-success?transaction_id=${orderId}`
      : siteUrl;

    const buyerName = payload.buyerName || buyerEmail.split("@")[0] || "Valued Customer";

    // 4. Trigger fulfillment
    await fulfillPurchase({
      email: buyerEmail,
      name: buyerName,
      productName: product.name,
      productSlug: slug,
      orderId,
      value: priceVal,
      provider: "shopier",
      downloadUrl,
    });

    console.log("✅ Shopier OSB fulfillment successful:", { orderId, slug });
    return NextResponse.json({ ok: true, orderId, slug });
  } catch (err: any) {
    console.error("❌ Shopier OSB webhook processing failed:", err);
    return NextResponse.json({ error: err?.message ?? "unknown" }, { status: 500 });
  }
}
