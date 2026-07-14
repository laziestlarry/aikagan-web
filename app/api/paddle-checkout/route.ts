// ─────────────────────────────────────────────────────────────────────────────
// POST /api/paddle-checkout
//
// Creates a Paddle Billing transaction using catalog prices and returns the
// hosted Checkout URL. Uses catalog price IDs for reliable checkout rendering.
// Falls back to inline pricing for coupon/test scenarios.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getPaddleClient } from "@/lib/paddle-client";
import { getProduct } from "@/lib/products";
import { tokenStore } from "@/lib/token-store";
import { resolveCouponPrice } from "@/lib/coupons";
import { getGumroadProduct } from "@/lib/gumroad-products";
import { ShopierPaymentFlow } from "@nopeion/shopier";

// Price IDs created in Paddle Catalog (via POST /api/admin/paddle-create-products)
const CATALOG_PRICE_IDS: Record<string, string> = {
  "masterclass-starter": "pri_01kx0rg4hmnpbdpsnx3d7j8h5q",
  "masterclass-pro": "pri_01kx0rg4q1ed110tw5cc4xqfs3",
  "masterclass-commander": "pri_01kx0rg4w962z7vmn53c8pq7n3",
  // "ai-venture-launch-blueprint" uses inline pricing until the Paddle
  // catalog price is created and approved.
};

export async function POST(req: NextRequest) {
  try {
    const { slug, coupon } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Missing or invalid slug" }, { status: 400 });
    }

    const product = getProduct(slug);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 404 });
    }

    if (!product.price || product.priceModel === "free") {
      return NextResponse.json({ error: "Free products do not need checkout" }, { status: 400 });
    }

    // Kill-switch: while the Paddle account/domain is pending re-approval,
    // route straight to a Shopier or Gumroad checkout instead of a broken Paddle one.
    if (process.env.PADDLE_CHECKOUT_DISABLED === "true") {
      // 1. Try Shopier first if configured
      const pat = process.env.SHOPIER_PAT || process.env.AUTONOMAX_SHOPIER_PAT;
      if (pat) {
        try {
          const paymentFlow = new ShopierPaymentFlow({ api: { pat } });
          if (product && product.price) {
            const platformOrderId = `sp_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
            const result = await paymentFlow.create({
              title: product.name,
              amount: product.price,
              currency: "USD",
              orderId: platformOrderId,
            });
            if (result && result.paymentUrl) {
              return NextResponse.json({ url: result.paymentUrl, transactionId: result.productId || platformOrderId, provider: "shopier" });
            }
          }
        } catch (err) {
          console.error("❌ Shopier checkout fallback error:", err);
        }
      }
      // 2. Or fallback to generic shopier link if set
      const suffix = slug.replace(/-/g, "_").toUpperCase();
      const variantUrl = process.env[`SHOPIER_PRODUCT_URL_${suffix}`] || process.env[`AUTONOMAX_SHOPIER_PRODUCT_URL_${suffix}`];
      if (variantUrl) {
         return NextResponse.json({ url: variantUrl, transactionId: `sp-intent-${Date.now()}`, provider: "shopier" });
      }

      // 3. Fallback to Gumroad
      const gumroadProduct = getGumroadProduct(slug);
      if (gumroadProduct) {
        let url = gumroadProduct.url;
        if (coupon) url += `?coupon=${encodeURIComponent(coupon)}`;
        return NextResponse.json({ url, transactionId: gumroadProduct.id, provider: "gumroad" });
      }
    }

    const paddle = getPaddleClient();
    if (!paddle) {
      console.error("❌ Paddle client not initialized — PADDLE_API_KEY missing");
      return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
    }

    // Apply coupon (admin test coupon overrides price to $1)
    const priceInfo = resolveCouponPrice(slug, coupon);
    const priceId = CATALOG_PRICE_IDS[slug];

    // Use catalog price ID for standard checkout (no coupon)
    // Fall back to inline pricing for coupon/test scenarios
    let transaction;
    if (priceInfo.applied || !priceId) {
      transaction = await paddle.transactions.create({
        items: [{
          quantity: 1,
          price: {
            description: product.description,
            name: `${product.tier} — ${product.name}${priceInfo.applied ? ' (TEST $1)' : ''}`,
            unitPrice: {
              amount: String(priceInfo.effectivePriceCents),
              currencyCode: "USD",
            },
            product: {
              name: `${product.tier} — ${product.name}${priceInfo.applied ? ' (TEST $1)' : ''}`,
              taxCategory: "saas",
              description: product.description,
            },
          },
        }],
        customData: {
          product_slug: slug,
          ...(priceInfo.applied ? { coupon: coupon ?? "", test_price: "1" } : {}),
        },
      });
    } else {
      transaction = await paddle.transactions.create({
        items: [{ quantity: 1, priceId }],
        customData: { product_slug: slug },
      });
    }

    // Pre‑register the transaction so the session-token endpoint can find it
    // before the webhook fires.
    tokenStore.set(transaction.id, {
      token: null,           // will be set by webhook
      slug,
      email: null,           // will be set by webhook
      exp: Date.now() + 48 * 60 * 60 * 1000,
    });

    console.log("✅ Paddle transaction created:", {
      transactionId: transaction.id,
      slug,
      price: product.price,
    });

    // NOTE: `checkout-service.paddle.com/create/checkout/{id}` is an internal
    // path only reachable after Paddle's own pay.paddle.com session redirect —
    // hitting it directly returns Paddle's generic error page. Route through
    // our own `/checkout?_ptxn=` page instead, which opens the Paddle.js
    // overlay (Paddle.Checkout.open) — the officially supported integration.
    const base =
      process.env.NEXT_PUBLIC_PADDLE_CHECKOUT_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.nextUrl.origin;
    const overlayUrl = transaction.id
      ? new URL(`/checkout?_ptxn=${encodeURIComponent(transaction.id)}`, base).toString()
      : null;

    return NextResponse.json({
      url: overlayUrl,
      transactionId: transaction.id,
    });
  } catch (err: any) {
    const detail = err.errors?.[0]?.detail ?? err.message ?? String(err);
    console.error("❌ Paddle checkout error:", detail);

    // Return the actual error for debugging
    return NextResponse.json({ error: "Failed to create checkout session", detail }, { status: 500 });
  }
}
