import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { fulfillPurchase } from "@/lib/fulfillment";
import { verifyOsb, parseOsbPayload } from "@nopeion/shopier/osb";
import { generateDownloadToken } from "@/lib/download-token";
import { tokenStore } from "@/lib/token-store";
import { hasProcessedEvent, markEventProcessed } from "@/lib/webhook-idempotency";
import { recordTransaction } from "@/lib/income-ledger";
import { fireCapi as fireCapiEvent } from "@/lib/capi-fire";
import { customerStore } from "@/lib/customer-store";
import { customerIdForEmail } from "@/lib/customer-session";
import { canonicalSiteOrigin } from "@/lib/site-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getUsdToTryRate(): Promise<number> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      const rate = data.rates?.TRY;
      if (typeof rate === "number" && rate > 0) return rate;
    }
  } catch (e) {
    console.warn("[shopier-webhook] USD/TRY lookup unavailable", String(e));
  }
  return 34.2;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);
    if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

    const resVal = String(formData.get("res") ?? "");
    const hashVal = String(formData.get("hash") ?? "");
    const username = process.env.SHOPIER_OSB_USERNAME || process.env.AUTONOMAX_SHOPIER_OSB_USERNAME;
    const password = process.env.SHOPIER_OSB_PASSWORD || process.env.AUTONOMAX_SHOPIER_OSB_KEY || process.env.AUTONOMAX_SHOPIER_OSB_PASSWORD;
    if (!username || !password) {
      return NextResponse.json({ error: "OSB credentials not configured" }, { status: 500 });
    }

    const verifyResult = verifyOsb({ res: resVal, hash: hashVal, username, password });
    if (!verifyResult.verified) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = parseOsbPayload(resVal);
    const buyerEmail = String(payload.email ?? "").trim().toLowerCase();
    if (!buyerEmail || !buyerEmail.includes("@")) {
      return NextResponse.json({ error: "Email missing" }, { status: 400 });
    }

    const rawOrderId = String(payload.orderId || "");
    if (!rawOrderId) return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
    const orderId = rawOrderId.startsWith("sp") ? rawOrderId : `sp-${rawOrderId}`;
    if (await hasProcessedEvent("shopier", orderId)) {
      return NextResponse.json({ ok: true, dedup: true, orderId });
    }

    const cached = await tokenStore.get(rawOrderId);
    const priceTry = Number(payload.price ?? 0);
    const usdToTry = await getUsdToTryRate();
    const estimatedUsd = priceTry > 0 && usdToTry > 0 ? priceTry / usdToTry : 0;

    let slug = cached?.slug || "masterclass-starter";
    if (!cached?.slug) {
      if (estimatedUsd >= 130) slug = "masterclass-commander";
      else if (estimatedUsd >= 60) slug = "masterclass-pro";
    }

    const product = getProduct(slug);
    if (!product) return NextResponse.json({ error: "Product not in catalog" }, { status: 404 });
    const valueUsd = estimatedUsd > 0 ? estimatedUsd : product.price;

    const token = product.zipFilename ? generateDownloadToken(slug, orderId, buyerEmail) : null;
    await tokenStore.set(orderId, {
      token,
      slug,
      email: buyerEmail,
      exp: Date.now() + 48 * 60 * 60 * 1000,
    });

    let capiFired = false;
    try {
      const capi = await fireCapiEvent(
        {
          event_name: "Purchase",
          event_id: orderId,
          email: buyerEmail,
          value: valueUsd,
          currency: "USD",
          content_ids: [slug],
          content_name: product.name,
          utm: { product_slug: slug, provider: "shopier", original_currency: "TRY" },
        },
        { req: { headers: req.headers }, source: "shopier_webhook" },
      );
      capiFired = capi.ok || capi.attempted;
    } catch (err) {
      console.warn("[shopier-webhook] CAPI failed non-critically", String(err));
    }

    try {
      await recordTransaction({
        orderId,
        provider: "shopier",
        slug,
        email: buyerEmail,
        value: valueUsd,
        currency: "USD",
        refCode: null,
        utm: {
          product_slug: slug,
          original_currency: "TRY",
          original_value: String(priceTry),
          usd_to_try: String(usdToTry),
        },
        capturedAt: Date.now(),
        eventId: orderId,
        commission: 0,
        capiFired,
      });
    } catch (err) {
      console.error("[shopier-webhook] ledger write failed", err);
      return NextResponse.json({ error: "Ledger persistence failed" }, { status: 503 });
    }

    try {
      await customerStore.grantEntitlement(
        customerIdForEmail(buyerEmail),
        buyerEmail,
        slug,
        orderId,
        token ? `/api/download/${token}` : null,
      );
    } catch (err) {
      console.error("[shopier-webhook] entitlement provisioning failed", err);
      return NextResponse.json({ error: "Entitlement provisioning failed" }, { status: 503 });
    }

    const buyerName = String(payload.buyerName || buyerEmail.split("@")[0] || "Valued Customer");
    const accessUrl = `${canonicalSiteOrigin(req.nextUrl.origin)}/checkout-success?transaction_id=${encodeURIComponent(orderId)}`;
    try {
      await fulfillPurchase({
        email: buyerEmail,
        name: buyerName,
        productName: product.name,
        productSlug: slug,
        orderId,
        value: valueUsd,
        provider: "shopier",
        downloadUrl: accessUrl,
      });
    } catch (err) {
      console.error("[shopier-webhook] fulfillment failed", err);
      return NextResponse.json({ error: "Fulfillment queue failed" }, { status: 503 });
    }

    await markEventProcessed("shopier", orderId);
    console.log(JSON.stringify({ event: "shopier_webhook_committed", orderId, slug, valueUsd, priceTry }));
    return NextResponse.json({ ok: true, orderId, slug });
  } catch (err: any) {
    console.error("[shopier-webhook] processing failed", err);
    return NextResponse.json({ error: err?.message ?? "unknown" }, { status: 500 });
  }
}
