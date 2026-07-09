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

  const category = req.nextUrl.searchParams.get("category") || "saas";

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
            taxCategory: category as any,
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
      tax_category_tested: category,
      // Replicate the browser's transaction-checkout call server-side so we
      // can validate the tax category / checkout eligibility without a
      // browser round-trip.
      checkout_probe: await (async () => {
        const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (!clientToken) return { skipped: "no client token" };
        try {
          const r = await fetch("https://checkout-service.paddle.com/transaction-checkout", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "paddle-clienttoken": clientToken,
              origin: "https://aikagan.com",
              referer: "https://aikagan.com/checkout",
            },
            body: JSON.stringify({
              data: {
                transaction_id: transaction.id,
                settings: { locale: "en" },
              },
            }),
          });
          const text = await r.text();
          return { status: r.status, body: text.slice(0, 2000) };
        } catch (probeErr) {
          return { probe_error: String(probeErr) };
        }
      })(),
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
