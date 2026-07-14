/**
 * GET /api/session-token
 *
 * Returns a download token for a completed Paddle transaction.
 * The success page polls this endpoint until the webhook has processed the
 * transaction, or — as a faster path — verifies the transaction directly via
 * Paddle API and generates a token on-the-fly.
 *
 * Query params:
 *   transaction_id  — Paddle transaction ID (txn_...)
 *
 * Responses:
 *   200 { token: string, slug: string }  — ready to download
 *   202 { status: "processing" }         — payment not yet confirmed
 *   400 { error: string }                 — missing parameter
 *   404 { error: string }                 — transaction not found
 *
 * Storage: Uses token-store (Vercel KV + in-memory fallback) so tokens survive
 *          serverless instance recycling across successive polling calls.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPaddleClient } from "@/lib/paddle-client";
import { generateDownloadToken } from "@/lib/download-token";
import { getProduct } from "@/lib/products";
import { tokenStore } from "@/lib/token-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const transactionId = req.nextUrl.searchParams.get("transaction_id");

  if (!transactionId) {
    return NextResponse.json({ error: "Missing transaction_id parameter" }, { status: 400 });
  }

  // 1. Check token store (populated by webhook or pre-registered)
  const cached = await tokenStore.get(transactionId);
  if (cached?.token) {
    return NextResponse.json({
      token: cached.token,
      slug: cached.slug,
      email: cached.email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    });
  }

  // 2. Fallback: verify directly with Paddle API
  const paddle = getPaddleClient();
  if (!paddle) {
    // No Paddle key configured — return "processing" so the client keeps polling
    return NextResponse.json({ status: "processing" }, { status: 202 });
  }

  try {
    const transaction = await paddle.transactions.get(transactionId);

    const status = transaction.status;
    if (status !== "completed" && status !== "paid") {
      return NextResponse.json({ status: "processing" }, { status: 202 });
    }

    // Extract slug from custom_data
    const slug: string | undefined = (transaction.customData as any)?.product_slug;
    if (!slug) {
      return NextResponse.json({ error: "Transaction missing product_slug" }, { status: 404 });
    }

    const product = getProduct(slug);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 404 });
    }

    // Extract email
    const email: string = transaction.customer?.email ?? "unknown@checkout";

    if (product.deliveryMode === "service" || !product.zipFilename) {
      await tokenStore.set(transactionId, {
        token: null,
        slug,
        email,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });

      return NextResponse.json({
        token: null,
        slug,
        service: true,
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
      });
    }

    // Transaction is completed/paid — generate token on-the-fly
    const token = generateDownloadToken(slug, transactionId, email);

    // Cache it for subsequent calls
    await tokenStore.set(transactionId, {
      token,
      slug,
      email,
      exp: Date.now() + 48 * 60 * 60 * 1000,
    });

    return NextResponse.json({
      token,
      slug,
      email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    });
  } catch (err: any) {
    // Transaction might not exist yet or Paddle API error
    console.error("❌ Session-token lookup error:", err.message);
    return NextResponse.json({ status: "processing" }, { status: 202 });
  }
}
