/**
 * /api/vitals — receives Web Vitals metric reports from the browser.
 *
 * The browser-side `web-vitals` library reports CLS, FID, LCP, etc. We
 * forward them to the FastAPI backend for monitoring.
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const limit = rateLimit({
    key: clientKey(req, "vitals"),
    max: 60,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return rateLimitResponse(limit);
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.name) {
    return NextResponse.json({ error: "metric required" }, { status: 400 });
  }

  // Forward to FastAPI backend (fire-and-forget)
  const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL;
  if (fastApiUrl) {
    fetch(`${fastApiUrl}/api/track/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: `vital:${body.name}`,
        value: body.value,
        id: body.id,
        rating: body.rating,
        delta: body.delta,
        navigationType: body.navigationType,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(3000),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
