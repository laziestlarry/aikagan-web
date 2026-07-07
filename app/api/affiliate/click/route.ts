// ─────────────────────────────────────────────────────────────────────────────
// POST /api/affiliate/click
//
// Records a click for an affiliate (called when ?ref=CODE on any page).
// Non-blocking — returns 204 quickly.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { recordClick } from "@/lib/referral";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Rate limit: 30 click records / 60s per IP — generous for legit users
  const limit = rateLimit({
    key: clientKey(req, "affiliate-click"),
    max: 30,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return rateLimitResponse(limit);
  }

  const body = await req.json().catch(() => null);
  const code = body?.code;
  if (typeof code !== "string" || !code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }
  // Don't await — fire and forget to keep page render fast
  recordClick(code.toLowerCase()).catch(() => {});
  return NextResponse.json({ ok: true });
}
