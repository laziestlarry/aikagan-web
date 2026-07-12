import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { fulfillPurchase } from "@/lib/fulfillment";
import { verifyOsb, parseOsbPayload } from "@nopeion/shopier/osb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    // 3. Map price to product slug
    // Prices: Starter ($29), Pro ($79), Commander ($149)
    let slug = "masterclass-starter";
    const priceVal = payload.price ?? 0;
    
    if (priceVal >= 130) {
      slug = "masterclass-commander";
    } else if (priceVal >= 60) {
      slug = "masterclass-pro";
    } else {
      slug = "masterclass-starter";
    }

    const product = getProduct(slug);
    if (!product) {
      console.warn("⚠️ Shopier mapped product not found in catalog for slug:", slug);
      return NextResponse.json({ error: "Product not in catalog" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";
    const downloadUrl = product.zipFilename
      ? `${siteUrl}/api/download/sp-${payload.orderId}`
      : siteUrl;

    const buyerName = payload.buyerName || buyerEmail.split("@")[0] || "Valued Customer";

    // 4. Trigger fulfillment
    await fulfillPurchase({
      email: buyerEmail,
      name: buyerName,
      productName: product.name,
      productSlug: slug,
      orderId: `sp-${payload.orderId}`,
      value: priceVal,
      provider: "shopier",
      downloadUrl,
    });

    console.log("✅ Shopier OSB fulfillment successful:", { orderId: payload.orderId, slug });
    return NextResponse.json({ ok: true, orderId: payload.orderId, slug });
  } catch (err: any) {
    console.error("❌ Shopier OSB webhook processing failed:", err);
    return NextResponse.json({ error: err?.message ?? "unknown" }, { status: 500 });
  }
}
