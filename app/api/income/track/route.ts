/**
 * POST /api/income/track
 *
 * Server-side event ingestion from the browser (web-vitals, pageview, etc.)
 * Writes a small, privacy-respecting counter to the income ledger. Used by
 * the WebVitalsReporter and a future pageview beacon.
 *
 * Body: { kind: "pageview" | "vital" | "intent", path?, slug?, name?, value? }
 */

import { NextRequest, NextResponse } from "next/server";
import { recordPageview, recordIntent } from "@/lib/income-ledger";
import { kvIncrBy } from "@/lib/kv";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const limit = rateLimit({ key: clientKey(req, "income-track"), max: 600, windowMs: 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  const b = body as { kind?: string; path?: string; slug?: string; name?: string; value?: number };

  switch (b.kind) {
    case "pageview": {
      if (typeof b.path === "string") {
        await recordPageview(b.path);
      } else {
        await kvIncrBy(`pv:__missing_path__`, 1, 24 * 60 * 60);
      }
      return NextResponse.json({ ok: true });
    }
    case "intent": {
      if (typeof b.slug !== "string") {
        return NextResponse.json({ error: "slug required" }, { status: 400 });
      }
      const sid = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 8)}`;
      await recordIntent(
        {
          slug: b.slug,
          price: typeof b.value === "number" ? b.value : 0,
          capturedAt: Date.now(),
          utm: {},
          ref: null,
          source: "client_beacon",
        },
        sid,
      );
      return NextResponse.json({ ok: true, intentId: sid });
    }
    case "vital": {
      // Lightweight aggregate: just count vital reports per name per day.
      if (typeof b.name === "string") {
        const day = new Date().toISOString().slice(0, 10);
        await kvIncrBy(`vital:${day}:${b.name}`, 1, 7 * 24 * 60 * 60);
      }
      return NextResponse.json({ ok: true });
    }
    default:
      return NextResponse.json({ error: "unknown kind" }, { status: 400 });
  }
}
