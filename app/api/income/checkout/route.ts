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
 *        c) Manual / instructions        — never reached if Paddle is set
 *   4. If every real provider is down, returns a self-hosted checkout URL
 *      (`/checkout/manual?slug=...&intent=...`) that captures the buyer's
 *      email and can be reconciled manually. We never want a "button doesn't
 *      work" failure on a live funnel.
 *
 * Response: { ok, provider, url, transactionId, intentId, intent: { recorded, ... } }
 */

import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { recordIntent, type IntentRecord } from "@/lib/income-ledger";
import { getPaddleClient } from "@/lib/paddle-client";
import { tokenStore } from "@/lib/token-store";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";
import { resolveCouponPrice } from "@/lib/coupons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckoutBody {
  slug: string;
  ref?: string | null;
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
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const u = new URL("/checkout/manual", base);
  u.searchParams.set("slug", slug);
  u.searchParams.set("intent", intentId);
  return u.toString();
}

async function tryPaddle(req: NextRequest, body: CheckoutBody, intent: IntentRecord) {
  const paddle = getPaddleClient();
  if (!paddle) return null;
  const product = getProduct(body.slug);
  if (!product || !product.price) return null;
  try {
    const priceInfo = resolveCouponPrice(body.slug, body.coupon);
    const unitAmount = String(priceInfo.effectivePriceCents);
    const customData: Record<string, string> = {
      product_slug: body.slug,
      ref_code: body.ref ?? "",
      utm_source: body.utm_source ?? "",
      utm_medium: body.utm_medium ?? "",
      utm_campaign: body.utm_campaign ?? "",
      ...(priceInfo.applied ? { coupon: body.coupon ?? "", test_price: "1" } : {}),
    };
    const tx = await paddle.transactions.create({
      items: [
        {
          quantity: 1,
          price: {
            description: product.description,
            name: `${product.tier} — ${product.name}`,
            unitPrice: { amount: unitAmount, currencyCode: "USD" },
            product: {
              name: `${product.tier} — ${product.name}`,
              taxCategory: "digital-goods",
              description: product.description,
            },
          },
        },
      ],
      customData,
    });
    if (tx.id) {
      await tokenStore.set(tx.id, {
        token: null,
        slug: body.slug,
        email: body.email ?? null,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });
    }
    return {
      provider: "paddle" as const,
      url: tx.checkout?.url ?? manualFallbackUrl(req, body.slug, intent.capturedAt.toString()),
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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
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
    if (!r.ok) return null;
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

export async function POST(req: NextRequest) {
  const limit = rateLimit({ key: clientKey(req, "income-checkout"), max: 30, windowMs: 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit);

  const body = (await req.json().catch(() => null)) as CheckoutBody | null;
  if (!body || !body.slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  const product = getProduct(body.slug);
  if (!product) {
    return NextResponse.json({ error: `Unknown product: ${body.slug}` }, { status: 404 });
  }
  if (!product.price || product.priceModel === "free") {
    return NextResponse.json({ error: "Free products do not need checkout" }, { status: 400 });
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
  let result: { provider: "paddle" | "lemonsqueezy"; url: string; transactionId: string | null } | null = await tryPaddle(req, body, intent);
  if (!result) result = await tryLemonSqueezy(req, body, intent);

  if (result) {
    return NextResponse.json({
      ok: true,
      ...result,
      intentId: sessionId,
      intent: { recorded: true, at: new Date(intent.capturedAt).toISOString() },
    });
  }

  // No provider — fall back to manual checkout page so the funnel never dead-ends
  return NextResponse.json({
    ok: true,
    provider: "manual",
    url: manualFallbackUrl(req, body.slug, sessionId),
    transactionId: null,
    intentId: sessionId,
    intent: { recorded: true, at: new Date(intent.capturedAt).toISOString() },
    note: "No payment provider configured. Using manual checkout fallback.",
  });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    ok: true,
    providers: {
      paddle: Boolean(process.env.PADDLE_API_KEY),
      lemonsqueezy: Boolean(process.env.LEMONSQUEEZY_API_KEY && process.env.LEMONSQUEEZY_STORE_ID),
    },
  });
}
