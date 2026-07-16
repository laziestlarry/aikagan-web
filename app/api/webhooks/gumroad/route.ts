// ─────────────────────────────────────────────────────────────────────────────
// POST /api/webhooks/gumroad
//
// Receives Gumroad sale notifications (Ping), verifies the sale against the
// authenticated Gumroad API, then records and fulfills the order exactly once.
// ─────────────────────────────────────────────────────────────────────────────

import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { GUMROAD_PRODUCTS } from "@/lib/gumroad-products";
import { verifyGumroadSale } from "@/lib/gumroad-api";
import { fulfillPurchase } from "@/lib/fulfillment";
import { generateDownloadToken } from "@/lib/download-token";
import { tokenStore } from "@/lib/token-store";
import { markEventIfNew } from "@/lib/webhook-idempotency";
import { recordTransaction } from "@/lib/income-ledger";
import { fireCapi as fireCapiEvent } from "@/lib/capi-fire";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function slugFromEvidence(permalink: string, productId: string): string | null {
  const match = Object.entries(GUMROAD_PRODUCTS).find(([, product]) =>
    product.id === productId || product.permalink === permalink,
  );
  return match?.[0] ?? null;
}

function normalizedEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const saleId = String(formData.get("sale_id") ?? "").trim();
    const pingEmail = normalizedEmail(formData.get("email"));
    const pingPermalink = String(
      formData.get("product_permalink") ?? formData.get("permalink") ?? "",
    ).trim();
    const pingProductId = String(formData.get("product_id") ?? "").trim();

    if (!saleId) {
      return NextResponse.json({ error: "Missing sale_id" }, { status: 400 });
    }

    // Optional defense-in-depth shared token. When configured, reject requests
    // that do not carry it. API sale verification remains mandatory either way.
    const expectedToken = process.env.GUMROAD_WEBHOOK_TOKEN?.trim() ?? "";
    if (expectedToken) {
      const suppliedToken =
        req.nextUrl.searchParams.get("token") ??
        req.headers.get("x-gumroad-webhook-token") ??
        "";
      if (!suppliedToken || !safeEqual(expectedToken, suppliedToken)) {
        return NextResponse.json({ error: "Invalid webhook token" }, { status: 401 });
      }
    }

    const verification = await verifyGumroadSale(saleId);
    if (!verification.verified || !verification.sale) {
      console.warn("[gumroad-webhook] Sale verification failed", {
        saleId,
        detail: verification.detail,
      });
      return NextResponse.json({ error: "Sale verification failed" }, { status: 401 });
    }

    const sale = verification.sale;
    const verifiedEmail = normalizedEmail(sale.email ?? sale.purchaser_email);
    const verifiedPermalink = String(sale.product_permalink ?? sale.permalink ?? pingPermalink).trim();
    const verifiedProductId = String(sale.product_id ?? pingProductId).trim();

    if (!verifiedEmail) {
      return NextResponse.json({ error: "Verified sale has no buyer email" }, { status: 400 });
    }
    if (pingEmail && pingEmail !== verifiedEmail) {
      return NextResponse.json({ error: "Buyer email mismatch" }, { status: 401 });
    }

    const slug = slugFromEvidence(verifiedPermalink, verifiedProductId);
    if (!slug) {
      console.warn("[gumroad-webhook] Sale does not map to a catalog product", {
        saleId,
        verifiedPermalink,
        verifiedProductId,
      });
      return NextResponse.json({ ok: true, ignored: true, reason: "unmapped product" });
    }

    const product = getProduct(slug);
    const gumroadProduct = GUMROAD_PRODUCTS[slug];
    if (!product || !gumroadProduct) {
      return NextResponse.json({ error: "Product not in catalog" }, { status: 404 });
    }

    const isNew = await markEventIfNew("gumroad", saleId);
    if (!isNew) {
      return NextResponse.json({ ok: true, dedup: true, saleId });
    }

    const orderId = `gr-${saleId}`;
    const value = gumroadProduct.priceCents / 100;
    const currency = String(sale.currency ?? formData.get("currency") ?? "USD").toUpperCase();
    const name = String(
      sale.full_name ?? sale.purchaser_name ?? formData.get("full_name") ?? verifiedEmail.split("@")[0],
    );
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";

    let downloadUrl = siteUrl;
    if (product.zipFilename) {
      const hmacToken = generateDownloadToken(slug, orderId, verifiedEmail);
      downloadUrl = `${siteUrl}/api/download/${hmacToken}`;
      await tokenStore.set(orderId, {
        token: hmacToken,
        slug,
        email: verifiedEmail,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });
    }

    const capiResult = await fireCapiEvent(
      {
        event_name: "Purchase",
        event_id: orderId,
        email: verifiedEmail,
        value,
        currency,
        content_ids: [slug],
        content_name: product.name,
        utm: { product_slug: slug, provider: "gumroad" },
      },
      { req: { headers: req.headers }, source: "gumroad_webhook" },
    );

    await recordTransaction({
      orderId,
      provider: "gumroad",
      slug,
      email: verifiedEmail,
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
      email: verifiedEmail,
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
      saleId,
      orderId,
      slug,
      email: verifiedEmail.replace(/(.{2}).*(@.*)/, "$1***$2"),
    }));

    return NextResponse.json({ ok: true, saleId, orderId, slug });
  } catch (error) {
    console.error("[gumroad-webhook] Processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
