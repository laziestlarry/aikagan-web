// ─────────────────────────────────────────────────────────────────────────────
// POST /api/webhooks/gumroad
//
// Receives Gumroad sale notifications (Ping) and fires the fulfillment pipeline.
// Gumroad Ping does not provide a general-purpose request signature, so this
// endpoint requires a private shared token in the configured Ping URL:
//   https://aikagan.com/api/webhooks/gumroad?token=<GUMROAD_WEBHOOK_TOKEN>
// ─────────────────────────────────────────────────────────────────────────────

import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { fulfillPurchase } from "@/lib/fulfillment";
import { generateDownloadToken } from "@/lib/download-token";
import { tokenStore } from "@/lib/token-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PERMALINK_TO_SLUG: Record<string, string> = {
  "autonomax-starter": "masterclass-starter",
  "autonomax-starter-29": "masterclass-starter",
  "autonomax-pro": "masterclass-pro",
  "autonomax-pro-79": "masterclass-pro",
  "autonomax-commander": "masterclass-commander",
  "autonomax-commander-149": "masterclass-commander",
};

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  try {
    const expectedToken = process.env.GUMROAD_WEBHOOK_TOKEN ?? "";
    const suppliedToken =
      req.nextUrl.searchParams.get("token") ??
      req.headers.get("x-gumroad-webhook-token") ??
      "";

    if (!expectedToken) {
      console.error("[gumroad-webhook] GUMROAD_WEBHOOK_TOKEN is not configured");
      return NextResponse.json(
        { error: "Webhook authentication is not configured" },
        { status: 503 },
      );
    }

    if (!suppliedToken || !safeEqual(expectedToken, suppliedToken)) {
      console.warn("[gumroad-webhook] Invalid shared token");
      return NextResponse.json({ error: "Invalid webhook token" }, { status: 401 });
    }

    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const saleId = String(formData.get("sale_id") ?? "");
    const productName = String(formData.get("product_name") ?? "");
    const productPermalink = String(formData.get("permalink") ?? "");
    const email = String(formData.get("email") ?? "");
    const fullName = String(formData.get("full_name") ?? "");
    const price = parseFloat(String(formData.get("price") ?? "0"));
    const currency = String(formData.get("currency") ?? "usd");

    if (!saleId || !productPermalink || !email) {
      return NextResponse.json(
        { error: "Missing sale_id, permalink, or email" },
        { status: 400 },
      );
    }

    console.log("[gumroad-webhook] Sale received", {
      saleId,
      productName,
      productPermalink,
      email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
      price,
      currency,
    });

    const slug = PERMALINK_TO_SLUG[productPermalink];
    if (!slug) {
      console.warn("[gumroad-webhook] Unknown product permalink", productPermalink);
      return NextResponse.json({ ok: true, note: "unknown product" });
    }

    const product = getProduct(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not in catalog" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";
    let downloadUrl = siteUrl;
    if (product.zipFilename) {
      const orderId = `gr-${saleId}`;
      const hmacToken = generateDownloadToken(slug, orderId, email);
      downloadUrl = `${siteUrl}/api/download/${hmacToken}`;
      await tokenStore.set(orderId, {
        token: hmacToken,
        slug,
        email,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });
    }

    await fulfillPurchase({
      email,
      name: fullName || email.split("@")[0] || "Valued Customer",
      productName: product.name,
      productSlug: slug,
      orderId: `gr-${saleId}`,
      value: Number.isFinite(price) ? price : 0,
      provider: "gumroad",
      downloadUrl,
    });

    console.log("[gumroad-webhook] Fulfillment complete", { saleId, slug });
    return NextResponse.json({ ok: true, saleId, slug });
  } catch (err) {
    console.error("[gumroad-webhook] Processing failed", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
