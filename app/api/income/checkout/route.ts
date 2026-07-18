import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { recordIntent, type IntentRecord } from "@/lib/income-ledger";
import { getPaddleClient } from "@/lib/paddle-client";
import { tokenStore } from "@/lib/token-store";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";
import { resolveCouponPrice } from "@/lib/coupons";
import { getGumroadProduct } from "@/lib/gumroad-products";
import { ensureGumroadSaleSubscription, isGumroadApiConfigured } from "@/lib/gumroad-api";
import { ShopierPaymentFlow } from "@nopeion/shopier";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckoutBody {
  slug: string;
  ref?: string | null;
  provider?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  country?: string | null;
  email?: string | null;
  sessionId?: string | null;
  coupon?: string | null;
}

type CheckoutResult = {
  provider: "paddle" | "lemonsqueezy" | "gumroad" | "shopier";
  url: string;
  transactionId: string | null;
};

function newSessionId(): string {
  return `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 10)}`;
}

function manualFallbackUrl(req: NextRequest, slug: string, intentId: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const url = new URL("/checkout/manual", base);
  url.searchParams.set("slug", slug);
  url.searchParams.set("intent", intentId);
  return url.toString();
}

const CATALOG_PRICE_IDS: Record<string, string> = {
  "masterclass-starter": "pri_01kx0rg4hmnpbdpsnx3d7j8h5q",
  "masterclass-pro": "pri_01kx0rg4q1ed110tw5cc4xqfs3",
  "masterclass-commander": "pri_01kx0rg4w962z7vmn53c8pq7n3",
};

async function tryPaddle(req: NextRequest, body: CheckoutBody, intent: IntentRecord, requestHostname?: string): Promise<CheckoutResult | null> {
  if (process.env.PADDLE_CHECKOUT_DISABLED === "true") return null;
  const paddle = getPaddleClient();
  if (!paddle) return null;
  const product = getProduct(body.slug);
  if (!product || !product.price) return null;

  try {
    const priceInfo = resolveCouponPrice(body.slug, body.coupon);
    const customData: Record<string, string> = {
      product_slug: body.slug,
      ref_code: body.ref ?? "",
      utm_source: body.utm_source ?? "",
      utm_medium: body.utm_medium ?? "",
      utm_campaign: body.utm_campaign ?? "",
      ...(priceInfo.applied ? { coupon: body.coupon ?? "", test_price: "1" } : {}),
    };
    const priceId = CATALOG_PRICE_IDS[body.slug];
    const tx = priceInfo.applied || !priceId
      ? await paddle.transactions.create({
          items: [{
            quantity: 1,
            price: {
              description: product.description,
              name: `${product.tier} — ${product.name}${priceInfo.applied ? " (TEST $1)" : ""}`,
              unitPrice: { amount: String(priceInfo.effectivePriceCents), currencyCode: "USD" },
              product: {
                name: `${product.tier} — ${product.name}${priceInfo.applied ? " (TEST $1)" : ""}`,
                taxCategory: "saas",
                description: product.description,
              },
            },
          }],
          customData,
        })
      : await paddle.transactions.create({ items: [{ quantity: 1, priceId }], customData });

    if (tx.id) {
      await tokenStore.set(tx.id, {
        token: null,
        slug: body.slug,
        email: body.email ?? null,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });
    }

    const base = process.env.NEXT_PUBLIC_PADDLE_CHECKOUT_BASE_URL ||
      (requestHostname === "aikagan.com" ? "https://app.aikagan.com" : req.nextUrl.origin);
    return {
      provider: "paddle",
      url: tx.id
        ? new URL(`/checkout?_ptxn=${encodeURIComponent(tx.id)}`, base).toString()
        : manualFallbackUrl(req, body.slug, intent.capturedAt.toString()),
      transactionId: tx.id,
    };
  } catch (error) {
    console.error("[income-checkout] Paddle failed", String(error));
    return null;
  }
}

async function tryLemonSqueezy(req: NextRequest, body: CheckoutBody, intent: IntentRecord): Promise<CheckoutResult | null> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env[`LEMONSQUEEZY_VARIANT_${body.slug.replace(/-/g, "_").toUpperCase()}`];
  if (!apiKey || !storeId || !variantId) return null;

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_options: { embed: false, media: false, logo: true },
            checkout_data: {
              custom: {
                product_slug: body.slug,
                ref_code: body.ref ?? "",
                utm_source: body.utm_source ?? "",
                utm_medium: body.utm_medium ?? "",
                utm_campaign: body.utm_campaign ?? "",
              },
            },
            product_options: {
              redirect_url: `${siteUrl}/checkout-success?provider=lemonsqueezy&ref=${encodeURIComponent(body.ref ?? "")}`,
              receipt_button_text: "Download your files",
              receipt_thank_you_note: "Thank you — your digital toolkit is ready.",
            },
          },
          relationships: {
            store: { data: { type: "stores", id: storeId } },
            variant: { data: { type: "variants", id: variantId } },
          },
        },
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const output = await response.json().catch(() => null);
    if (!response.ok) {
      console.error("[income-checkout] Lemon Squeezy rejected checkout", response.status);
      return null;
    }
    const id = output?.data?.id ?? null;
    if (id) {
      await tokenStore.set(`ls:${id}`, {
        token: null,
        slug: body.slug,
        email: body.email ?? null,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });
    }
    return {
      provider: "lemonsqueezy",
      url: output?.data?.attributes?.url ?? manualFallbackUrl(req, body.slug, intent.capturedAt.toString()),
      transactionId: id,
    };
  } catch (error) {
    console.error("[income-checkout] Lemon Squeezy failed", String(error));
    return null;
  }
}

async function tryGumroad(req: NextRequest, body: CheckoutBody): Promise<CheckoutResult | null> {
  const gumroadProduct = getGumroadProduct(body.slug);
  if (!gumroadProduct || !isGumroadApiConfigured()) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const postUrl = new URL("/api/webhooks/gumroad", siteUrl).toString();
  const subscription = await ensureGumroadSaleSubscription(postUrl);
  if (!subscription.ready) {
    console.error("[income-checkout] Gumroad sale subscription is not ready", subscription.detail);
    return null;
  }

  const url = new URL(gumroadProduct.url);
  if (body.ref) url.searchParams.set("ref", body.ref);
  if (body.coupon) url.searchParams.set("coupon", body.coupon);
  return {
    provider: "gumroad",
    url: url.toString(),
    transactionId: gumroadProduct.id,
  };
}

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

function getProductImageUrl(slug: string): string {
  if (slug.includes("starter")) return "https://aikagan.com/thumb-starter.png";
  if (slug.includes("pro")) return "https://aikagan.com/thumb-pro.png";
  if (slug.includes("commander")) return "https://aikagan.com/thumb-commander.png";
  return "https://aikagan.com/og.png";
}

async function tryShopier(body: CheckoutBody): Promise<CheckoutResult | null> {
  const pat = process.env.SHOPIER_PAT || process.env.AUTONOMAX_SHOPIER_PAT;
  const product = getProduct(body.slug);

  if (pat && product?.price) {
    try {
      const platformOrderId = `sp_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      await tokenStore.set(platformOrderId, {
        token: null,
        slug: body.slug,
        email: body.email ?? null,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });
      const usdRate = await getUsdToTryRate();
      const tryPrice = Math.round(product.price * usdRate);

      const result = await new ShopierPaymentFlow({ api: { pat } }).create({
        title: product.name,
        amount: tryPrice,
        currency: "TRY",
        orderId: platformOrderId,
        imageUrl: getProductImageUrl(body.slug),
      });
      if (result?.paymentUrl) {
        return {
          provider: "shopier",
          url: result.paymentUrl,
          transactionId: result.productId || platformOrderId,
        };
      }
    } catch (error) {
      console.error("[income-checkout] Shopier API creation failed", String(error));
    }
  }

  const suffix = body.slug.replace(/-/g, "_").toUpperCase();
  const variantUrl = process.env[`SHOPIER_PRODUCT_URL_${suffix}`] || process.env[`AUTONOMAX_SHOPIER_PRODUCT_URL_${suffix}`];
  return variantUrl
    ? { provider: "shopier", url: variantUrl, transactionId: `sp-hosted-${Date.now()}` }
    : null;
}

async function createCheckoutSession(req: NextRequest, body: CheckoutBody): Promise<{ status: number; data: any }> {
  const product = getProduct(body.slug);
  if (!product) return { status: 404, data: { error: `Unknown product: ${body.slug}` } };
  if (!product.price || product.priceModel === "free") {
    return { status: 400, data: { error: "Free products do not need checkout" } };
  }

  const sessionId = body.sessionId || newSessionId();
  const intent: IntentRecord = {
    slug: body.slug,
    price: product.price,
    capturedAt: Date.now(),
    utm: {
      ...(body.utm_source ? { utm_source: body.utm_source } : {}),
      ...(body.utm_medium ? { utm_medium: body.utm_medium } : {}),
      ...(body.utm_campaign ? { utm_campaign: body.utm_campaign } : {}),
      ...(body.utm_term ? { utm_term: body.utm_term } : {}),
      ...(body.utm_content ? { utm_content: body.utm_content } : {}),
    },
    ref: body.ref ?? null,
    source: "income_checkout",
  };
  await recordIntent(intent, sessionId);

  let result: CheckoutResult | null = null;
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();
  const isApprovedPaddleSurface =
    hostname === "aikagan.com" ||
    hostname === "app.aikagan.com" ||
    hostname === "propulse-autonomax.web.app" ||
    hostname === "autonomax-revenue-lenljbhrqq-uc.a.run.app" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1";

  if (body.provider === "paddle") result = isApprovedPaddleSurface ? await tryPaddle(req, body, intent, hostname) : null;
  else if (body.provider === "gumroad") result = await tryGumroad(req, body);
  else if (body.provider === "shopier") result = await tryShopier(body);
  else if (body.provider === "lemonsqueezy") result = await tryLemonSqueezy(req, body, intent);
  else {
    if (isApprovedPaddleSurface) result = await tryPaddle(req, body, intent, hostname);
    if (!result) {
      if (hostname === "aikagan.com") {
        result = await tryGumroad(req, body);
        if (!result) result = await tryLemonSqueezy(req, body, intent);
        if (!result) result = await tryShopier(body);
      } else {
        result = await tryLemonSqueezy(req, body, intent);
        if (!result) result = await tryGumroad(req, body);
        if (!result) result = await tryShopier(body);
      }
    }
  }

  if (result) {
    return {
      status: 200,
      data: {
        ok: true,
        ...result,
        intentId: sessionId,
        intent: { recorded: true, at: new Date(intent.capturedAt).toISOString() },
      },
    };
  }

  return {
    status: 503,
    data: {
      ok: false,
      error: "checkout_unavailable",
      provider: null,
      detail: "No verified payment and fulfillment rail is currently available for this product.",
      manualUrl: manualFallbackUrl(req, body.slug, sessionId),
      intentId: sessionId,
      intent: { recorded: true, at: new Date(intent.capturedAt).toISOString() },
    },
  };
}

export async function POST(req: NextRequest) {
  const limit = rateLimit({ key: clientKey(req, "income-checkout"), max: 30, windowMs: 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit);
  const body = (await req.json().catch(() => null)) as CheckoutBody | null;
  if (!body?.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const result = await createCheckoutSession(req, body);
  return NextResponse.json(result.data, { status: result.status });
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (slug) {
    const body: CheckoutBody = {
      slug,
      ref: req.nextUrl.searchParams.get("ref"),
      provider: req.nextUrl.searchParams.get("provider"),
      utm_source: req.nextUrl.searchParams.get("utm_source"),
      utm_medium: req.nextUrl.searchParams.get("utm_medium"),
      utm_campaign: req.nextUrl.searchParams.get("utm_campaign"),
      utm_term: req.nextUrl.searchParams.get("utm_term"),
      utm_content: req.nextUrl.searchParams.get("utm_content"),
      country: req.nextUrl.searchParams.get("country"),
      email: req.nextUrl.searchParams.get("email"),
      sessionId: req.nextUrl.searchParams.get("sessionId") || req.nextUrl.searchParams.get("session_id"),
      coupon: req.nextUrl.searchParams.get("coupon"),
    };
    const result = await createCheckoutSession(req, body);
    if (result.data?.url) return NextResponse.redirect(result.data.url, 303);
    return NextResponse.json(result.data, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    providers: {
      paddle: Boolean(process.env.PADDLE_API_KEY && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN),
      gumroad: isGumroadApiConfigured(),
      shopier: Boolean(process.env.SHOPIER_PAT || process.env.AUTONOMAX_SHOPIER_PAT),
      lemonsqueezy: Boolean(process.env.LEMONSQUEEZY_API_KEY && process.env.LEMONSQUEEZY_STORE_ID),
    },
  });
}
