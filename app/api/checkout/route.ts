/**
 * POST /api/checkout
 *
 * Backward-compatible alias for /api/income/checkout.
 * Existing clients that still call /api/checkout are forwarded to the live
 * income checkout router so Paddle remains the primary provider in production.
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildForwardUrl(req: NextRequest, pathname: string): string {
  const u = new URL(req.url);
  u.pathname = pathname;
  u.search = "";
  return u.toString();
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const forwardUrl = buildForwardUrl(req, "/api/income/checkout");

  try {
    const upstream = await fetch(forwardUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store",
    });

    const payload = await upstream.text();
    return new NextResponse(payload, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" },
    });
  } catch (err) {
    console.error("[checkout-alias] forward failed:", err);
    return NextResponse.json(
      { error: "checkout_unavailable", detail: "Checkout service is temporarily unavailable." },
      { status: 502 },
    );
  }
}

export async function GET(req: NextRequest) {
  const forwardUrl = buildForwardUrl(req, "/api/income/checkout");

  try {
    const upstream = await fetch(forwardUrl, { method: "GET", cache: "no-store" });
    const payload = await upstream.text();
    return new NextResponse(payload, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" },
    });
  } catch (err) {
    console.error("[checkout-alias] health forward failed:", err);
    return NextResponse.json(
      {
        ok: false,
        providers: { paddle: false, lemonsqueezy: false },
      },
      { status: 503 },
    );
  }
}
