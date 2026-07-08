// ─────────────────────────────────────────────────────────────────────────────
// POST /api/checkout
//
// Public multi-provider checkout router.
//
// Request:  { slug, ref?, utm_*, country? }
// Success:  { provider, url, transactionId }
// Error:    { error, provider? }
//
// Provider priority: Paddle → LemonSqueezy → Gumroad → manual fallback
// All providers pipe the same HMAC download token through /api/webhooks/{provider}.
// The router never returns an error — it always returns a working URL or manual
// checkout page, so the buyer never dead-ends.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import {
  buildCustomData,
  validateCheckoutRequest,
} from "@/lib/provider-router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function tryProvider(baseUrl: string, endpoint: string, body: object): Promise<{ ok: true; url: string; transactionId: string | null } | { ok: false }> {
  try {
    const r = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!r.ok || !data?.url) return { ok: false };
    return { ok: true, url: data.url, transactionId: data.transactionId ?? null };
  } catch {
    return { ok: false };
  }
}

function manualFallbackUrl(req: NextRequest, slug: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  return `${base}/checkout/manual?slug=${encodeURIComponent(slug)}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const validation = validateCheckoutRequest(body);
  if (validation.ok === false) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const checkoutReq = validation.req;
  const customData = buildCustomData(checkoutReq);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  // Try providers in priority order
  const providers = [
    { name: "paddle" as const, endpoint: "/api/paddle-checkout", body: { slug: checkoutReq.slug, customData } },
    { name: "lemonsqueezy" as const, endpoint: "/api/lemonsqueezy-checkout", body: { slug: checkoutReq.slug, customData } },
  ];

  for (const p of providers) {
    const result = await tryProvider(baseUrl, p.endpoint, p.body);
    if (result.ok) {
      return NextResponse.json({ ...result, provider: p.name });
    }
  }

  // No provider worked — fall back to manual checkout so the funnel never dead-ends
  return NextResponse.json({
    ok: true,
    provider: "manual",
    url: manualFallbackUrl(req, checkoutReq.slug),
    transactionId: null,
    note: "Payment provider checkout unavailable. Using manual checkout fallback — your purchase will be processed manually.",
  });
}

/** GET — diagnostic: show providers. */
export async function GET() {
  return NextResponse.json({
    paddle: Boolean(process.env.PADDLE_API_KEY),
    lemonsqueezy: Boolean(process.env.LEMONSQUEEZY_API_KEY && process.env.LEMONSQUEEZY_STORE_ID),
    timestamp: new Date().toISOString(),
  });
}
