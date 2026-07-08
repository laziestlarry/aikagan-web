// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/paddle-test-checkout
//
// Tests Paddle checkout and returns the full transaction response.
// Uses the same approach as the live checkout route.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getPaddleClient } from "@/lib/paddle-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret") || req.nextUrl.searchParams.get("secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paddle = getPaddleClient();
  if (!paddle) {
    return NextResponse.json({ error: "Paddle not configured" }, { status: 503 });
  }

  try {
    // Use $1.00 to meet minimum payment amount ($0.70 USD)
    const transaction = await paddle.transactions.create({
      items: [{
        quantity: 1,
        price: {
          description: "Diagnostic test — will not be charged",
          name: "Diagnostic",
          unitPrice: { amount: "100", currencyCode: "USD" },
          product: {
            name: "Diagnostic Product",
            taxCategory: "saas",
            description: "Diagnostic test for checkout URL inspection",
          },
        },
      }],
      customData: { diagnostic: "true" },
    });

    return NextResponse.json({
      transaction_id: transaction.id,
      status: transaction.status,
      checkout_url: transaction.checkout?.url ?? null,
      checkout: transaction.checkout,
      full: JSON.parse(JSON.stringify(transaction)),
    });
  } catch (e: any) {
    return NextResponse.json({
      error: e.message,
      detail: e.errors?.[0]?.detail ?? null,
      code: e.errors?.[0]?.code ?? null,
      raw: JSON.stringify(e),
    }, { status: 500 });
  }
}
