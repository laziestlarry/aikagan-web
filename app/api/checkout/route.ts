// ─────────────────────────────────────────────────────────────────────────────
// POST /api/checkout
//
// Public multi-provider checkout router.
//
// Request:  { slug, ref?, utm_*, country? }
// Success:  { provider, url, transactionId }
// Error:    { error, provider? }
//
// Provider priority: Paddle → LemonSqueezy → Gumroad
// All providers pipe the same HMAC download token through /api/webhooks/{provider}.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import {
  buildCustomData,
  selectProvider,
  validateCheckoutRequest,
} from "@/lib/provider-router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const validation = validateCheckoutRequest(body);
  if (validation.ok === false) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const checkoutReq = validation.req;
  const customData = buildCustomData(checkoutReq);

  // Pick provider by env-var availability
  const provider = selectProvider();
  if (!provider) {
    return NextResponse.json(
      {
        error:
          "No payment provider configured. Set PADDLE_API_KEY, LEMONSQUEEZY_API_KEY, or GUMROAD_ACCESS_TOKEN.",
      },
      { status: 503 }
    );
  }

  // Forward to the provider-specific endpoint
  try {
    if (provider === "paddle") {
      const r = await fetch(`${getBaseUrl(req)}/api/paddle-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: checkoutReq.slug,
          customData,
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        return NextResponse.json(
          { error: data?.error ?? "Paddle checkout failed", provider },
          { status: r.status }
        );
      }
      return NextResponse.json({ ...data, provider });
    }

    if (provider === "lemonsqueezy") {
      const r = await fetch(`${getBaseUrl(req)}/api/lemonsqueezy-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: checkoutReq.slug,
          ref: checkoutReq.ref,
          customData,
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        return NextResponse.json(
          { error: data?.error ?? "LemonSqueezy checkout failed", provider },
          { status: r.status }
        );
      }
      return NextResponse.json({ ...data, provider });
    }

    if (provider === "gumroad") {
      const r = await fetch(`${getBaseUrl(req)}/api/gumroad-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: checkoutReq.slug,
          ref: checkoutReq.ref,
          customData,
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        return NextResponse.json(
          { error: data?.error ?? "Gumroad checkout failed", provider },
          { status: r.status }
        );
      }
      return NextResponse.json({ ...data, provider });
    }

    return NextResponse.json({ error: "Unknown provider" }, { status: 500 });
  } catch (err: any) {
    console.error("❌ Checkout router error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Checkout router failed" },
      { status: 500 }
    );
  }
}

/** GET — diagnostic: show which provider is active. */
export async function GET() {
  return NextResponse.json({
    active: selectProvider(),
    timestamp: new Date().toISOString(),
  });
}

function getBaseUrl(req: NextRequest): string {
  // Internal call — use the same host
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Fallback — derive from request
  return req.nextUrl.origin;
}
