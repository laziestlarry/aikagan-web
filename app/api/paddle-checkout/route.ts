// ─────────────────────────────────────────────────────────────────────────────
// POST /api/paddle-checkout
//
// Creates a Paddle Billing transaction with an inline (non-catalog) price and
// returns the hosted Checkout URL for the client to redirect to.
//
// Request:  { slug: string }
// Success:  { url: string, transactionId: string }
// Error:    { error: string }
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getPaddleClient } from "@/lib/paddle-client";
import { getProduct } from "@/lib/products";
import { tokenStore } from "@/lib/token-store";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
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

    const paddle = getPaddleClient();
    if (!paddle) {
      console.error("❌ Paddle client not initialized — PADDLE_API_KEY missing");
      return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
    }

    const unitAmount = String(product.price * 100); // Paddle uses cents (smallest unit)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aikagan.com";

    const transaction = await paddle.transactions.create({
      items: [
        {
          quantity: 1,
          price: {
            description: product.description,
            name: `${product.tier} — ${product.name}`,
            unitPrice: {
              amount: unitAmount,
              currencyCode: "USD",
            },
            product: {
              name: `${product.tier} — ${product.name}`,
              taxCategory: "digital-goods",
              description: product.description,
            },
          },
        },
      ],
      customData: {
        product_slug: slug,
      },
    });

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

    return NextResponse.json({
      url: transaction.checkout?.url ?? null,
      transactionId: transaction.id,
    });
  } catch (err: any) {
    const detail = err.errors?.[0]?.detail ?? err.message;
    console.error("❌ Paddle checkout error:", detail);

    const message = "Failed to create checkout session";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
