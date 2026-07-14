/**
 * POST /api/income/checkout
 *
 * Self-healing checkout that always returns a working URL.
 *
 *   1. Looks up the product by slug.
 *   2. Records the checkout-intent in the income ledger.
 *   3. Tries the configured provider in priority order:
 *        a) Paddle (Merchant of Record)  — uses paddle-node-sdk
 *        b) LemonSqueezy                  — uses REST API
 *   4. If Paddle is configured but the transaction fails, returns a 502
 *      with a clear `error: "checkout_unavailable"` and `provider: "paddle"`
 *      so the client can show a real error state — NOT silently redirect
 *      to /checkout/manual. The manual page is a true last-resort fallback
 *      used only when no payment provider is configured at all.
 *
 * Response: { ok, provider, url, transactionId, intentId, intent: { recorded, ... } }
 * Error:    { error: "checkout_unavailable", provider, detail }
 */

import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { recordIntent, type IntentRecord } from "@/lib/income-ledger";
import { getPaddleClient } from "@/lib/paddle-client";
import { tokenStore } from "@/lib/token-store";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";
import { resolveCouponPrice } from "@/lib/coupons";
import { getGumroadProduct } from "@/lib/gumroad-products";
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

function newSessionId(): string {
  return `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 10)}`;
}

function manualFallbackUrl(req: NextRequest, slug: string, intentId: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const u = new URL("/checkout/manual", base);
  u.searchParams.set("slug", slug);
  u.searchParams.set("intent", intentId);
  return u.toString();
}

// Price IDs created in Paddle Catalog
const CATALOG_PRICE_IDS: Record<string, string> = {
  "masterclass-starter": "pri_01kx0rg4hmnpbdpsnx3d7j8h5q",
  "masterclass-pro": "pri_01kx0rg4q1ed110tw5cc4xqfs3",
  "masterclass-commander": "pri_01kx0rg4w962z7vmn53c8pq7n3",
  // "ai-venture-launch-blueprint" intentionally falls back to inline pricing
  // until the Paddle catalog price is created and approved.
};

async function tryPaddle(req: NextRequest, body: CheckoutBody, intent: IntentRecord) {
  // Kill-switch: set PADDLE_CHECKOUT_DISABLED=true in Vercel env to force
  // fallback to LemonSqueezy/Gumroad — used while the Paddle account/domain
  // is pending re-approval (checkout-open calls return 403 "blocked for
  // this vendor" even though transaction creation itself still succeeds).
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
    let tx;
    if (priceInfo.applied || !priceId) {
      tx = await paddle.transactions.create({
        items: [{
          quantity: 1,
          price: {
            description: product.description,
            name: `${product.tier} — ${product.name}${priceInfo.applied ? ' (TEST $1)' : ''}`,
            unitPrice: { amount: String(priceInfo.effectivePriceCents), currencyCode: "USD" },
            product: {
              name: `${product.tier} — ${product.name}${priceInfo.applied ? ' (TEST $1)' : ''}`,
              taxCategory: "saas",
              description: product.description,
            },
          },
        }],
        customData,
      });
    } else {
      tx = await paddle.transactions.create({
        items: [{ quantity: 1, priceId }],
        customData,
      });
    }
    if (tx.id) {
      await tokenStore.set(tx.id, {
        token: null,
        slug: body.slug,
        email: body.email ?? null,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });
    }
    // NOTE: manually constructing a "hosted checkout" URL such as
    // `checkout-service.paddle.com/create/checkout/{id}` is NOT a supported
    // public entry point — Paddle only serves that path after an internal
    // session redirect from pay.paddle.com, and hitting it directly returns
    // Paddle's generic `buy.paddle.com/checkout/error` page. The supported
    // integration is the Paddle.js overlay (`Paddle.Checkout.open`), which
    // our own `/checkout` route already implements correctly. Route every
    // buy button through that same-origin page so the overlay opens once
    // Paddle.js + Paddle.Initialize (loaded globally in the root layout)
    // are ready.
    const base =
      process.env.NEXT_PUBLIC_PADDLE_CHECKOUT_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.nextUrl.origin;
    const overlayUrl = tx.id
      ? new URL(`/checkout?_ptxn=${encodeURIComponent(tx.id)}`, base).toString()
      : null;

    return {
      provider: "paddle" as const,
      url: overlayUrl ?? manualFallbackUrl(req, body.slug, intent.capturedAt.toString()),
      transactionId: tx.id,
    };
  } catch (err) {
    console.error("[income-checkout] paddle failed:", String(err));
    return null;
  }
}

async function tryLemonSqueezy(req: NextRequest, body: CheckoutBody, intent: IntentRecord) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!apiKey || !storeId) return null;
  const variantId =
    process.env[
      `LEMONSQUEEZY_VARIANT_${body.slug.replace(/-/g, "_").toUpperCase()}`
    ];
  if (!variantId) return null;
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const r = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
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
    });
    const out = await r.json();
    if (!r.ok) {
      console.error("[income-checkout] lemonsqueezy API error response:", out);
      return null;
    }
    const id = out?.data?.id;
    if (id) {
      await tokenStore.set(`ls:${id}`, {
        token: null,
        slug: body.slug,
        email: body.email ?? null,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });
    }
    return {
      provider: "lemonsqueezy" as const,
      url: out?.data?.attributes?.url ?? manualFallbackUrl(req, body.slug, intent.capturedAt.toString()),
      transactionId: id,
    };
  } catch (err) {
    console.error("[income-checkout] lemonsqueezy failed:", String(err));
    return null;
  }
}

function tryGumroad(body: CheckoutBody, intent: IntentRecord) {
  const gumroadProduct = getGumroadProduct(body.slug);
  if (!gumroadProduct) return null;
  // Gumroad checkout pages are pre-created hosted permalinks — no API call
  // (and no GUMROAD_ACCESS_TOKEN, which is only needed for webhook/license
  // verification) is required to send a buyer to a working checkout.
  let url = gumroadProduct.url;
  const params = new URLSearchParams();
  if (body.ref) params.set("ref", body.ref);
  if (body.coupon) params.set("coupon", body.coupon);
  const qs = params.toString();
  if (qs) url += `?${qs}`;
  return {
    provider: "gumroad" as const,
    url,
    transactionId: gumroadProduct.id,
  };
}

async function tryShopier(req: NextRequest, body: CheckoutBody, intent: IntentRecord) {
  const pat = process.env.SHOPIER_PAT || process.env.AUTONOMAX_SHOPIER_PAT;
  if (pat) {
    try {
      const paymentFlow = new ShopierPaymentFlow({ api: { pat } });
      const product = getProduct(body.slug);
      if (product && product.price) {
        // Build the unique order/intent ID
        const platformOrderId = `sp_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Save checkout intent details to tokenStore
        await tokenStore.set(platformOrderId, {
          token: null,
          slug: body.slug,
          email: body.email ?? null,
          exp: Date.now() + 48 * 60 * 60 * 1000,
        });

        const result = await paymentFlow.create({
          title: product.name,
          amount: product.price,
          currency: "USD",
          orderId: platformOrderId,
        });

        if (result && result.paymentUrl) {
          return {
            provider: "shopier" as const,
            url: result.paymentUrl,
            transactionId: result.productId || platformOrderId,
          };
        }
      }
    } catch (err) {
      console.error("[income-checkout] shopier API creation failed:", String(err));
    }
  }

  // Fallback to storefront redirect if PAT not configured/fails
  const suffix = body.slug.replace(/-/g, "_").toUpperCase();
  const variantUrl = process.env[`SHOPIER_PRODUCT_URL_${suffix}`] || process.env[`AUTONOMAX_SHOPIER_PRODUCT_URL_${suffix}`];
  const url = variantUrl || "https://autonomax.shopier.com";

  return {
    provider: "shopier" as const,
    url,
    transactionId: `sp-intent-${intent.capturedAt}`,
  };
}

async function createCheckoutSession(
  req: NextRequest,
  body: CheckoutBody
): Promise<{ status: number; data: any }> {
  const product = getProduct(body.slug);
  if (!product) {
    return { status: 404, data: { error: `Unknown product: ${body.slug}` } };
  }
  if (!product.price || product.priceModel === "free") {
    return { status: 400, data: { error: "Free products do not need checkout" } };
  }

  // Record the intent BEFORE creating the checkout so we have evidence even
  // if the provider call fails and we fall back to manual.
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

  // Try real providers in priority order
  let result: { provider: "paddle" | "lemonsqueezy" | "gumroad" | "shopier"; url: string; transactionId: string | null } | null = null;

  const host = req.headers.get("host") || "";
  const isAppSubdomain = host.includes("app.aikagan.com");

  if (body.provider === "shopier") {
    result = await tryShopier(req, body, intent);
  } else if (body.provider === "paddle") {
    result = await tryPaddle(req, body, intent);
  } else if (body.provider === "gumroad") {
    result = tryGumroad(body, intent);
  } else {
    // If request originates from app.aikagan.com (approved subdomain), prioritize Paddle.
    // Otherwise, bypass Paddle (due to pending domain approval errors on aikagan.com)
    if (isAppSubdomain) {
      result = await tryPaddle(req, body, intent);
    }
    if (!result) result = await tryLemonSqueezy(req, body, intent);
    if (!result) result = tryGumroad(body, intent);
    if (!result) result = await tryShopier(req, body, intent);
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

  // No provider succeeded. If Paddle is configured, this is a real outage
  // — return a 502 so the client surfaces a genuine error state.
  const paddleConfigured =
    Boolean(process.env.PADDLE_API_KEY) && process.env.PADDLE_CHECKOUT_DISABLED !== "true";
  if (paddleConfigured) {
    console.error("[income-checkout] Paddle configured but transaction creation failed", {
      slug: body.slug,
      intentId: sessionId,
    });
    return {
      status: 502,
      data: {
        ok: false,
        error: "checkout_unavailable",
        provider: "paddle",
        detail: "Payment provider is temporarily unavailable. Please try again in a moment.",
        intentId: sessionId,
        intent: { recorded: true, at: new Date(intent.capturedAt).toISOString() },
      },
    };
  }

  // No payment provider configured at all — last-resort manual fallback.
  return {
    status: 200,
    data: {
      ok: true,
      provider: "manual",
      url: manualFallbackUrl(req, body.slug, sessionId),
      transactionId: null,
      intentId: sessionId,
      intent: { recorded: true, at: new Date(intent.capturedAt).toISOString() },
      note: "No payment provider configured. Using manual checkout fallback.",
    },
  };
}

export async function POST(req: NextRequest) {
  const limit = rateLimit({ key: clientKey(req, "income-checkout"), max: 30, windowMs: 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit);

  const body = (await req.json().catch(() => null)) as CheckoutBody | null;
  if (!body || !body.slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const res = await createCheckoutSession(req, body);
  return NextResponse.json(res.data, { status: res.status });
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

    const res = await createCheckoutSession(req, body);
    if (res.data?.url) {
      return NextResponse.redirect(res.data.url, 303);
    }
    return NextResponse.json(res.data, { status: res.status });
  }

  return NextResponse.json({
    ok: true,
    providers: {
      paddle: Boolean(process.env.PADDLE_API_KEY),
      lemonsqueezy: Boolean(process.env.LEMONSQUEEZY_API_KEY && process.env.LEMONSQUEEZY_STORE_ID),
      gumroad: true,
      shopier: Boolean(
        process.env.SHOPIER_PAT ||
        process.env.AUTONOMAX_SHOPIER_PAT ||
        process.env.AUTONOMAX_SHOPIER_STORE_URL
      ),
    },
  });
}
