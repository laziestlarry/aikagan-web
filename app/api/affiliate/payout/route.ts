/**
 * POST /api/affiliate/payout
 *
 * Mark affiliate commission as paid (admin operation).
 *
 * Auth: requires `x-admin-secret` header matching ADMIN_SECRET env var.
 * If ADMIN_SECRET is not set, the endpoint is disabled (returns 503).
 *
 * Body: { code: string, amount: number, note?: string }
 *
 * Response: { ok, paid, remaining } or { error }
 */

import { NextRequest, NextResponse } from "next/server";
import { markCommissionPaid } from "@/lib/referral";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Auth check
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json(
      { error: "Payout endpoint disabled — set ADMIN_SECRET env var" },
      { status: 503 }
    );
  }
  if (req.headers.get("x-admin-secret") !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 20 payout ops / min per IP (admin-only, generous)
  const limit = rateLimit({
    key: clientKey(req, "affiliate-payout"),
    max: 20,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return rateLimitResponse(limit);
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { code, amount, note } = body as Record<string, unknown>;
  if (typeof code !== "string" || !code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "positive amount required" }, { status: 400 });
  }

  const result = await markCommissionPaid(
    code.toLowerCase(),
    amount,
    typeof note === "string" ? note : undefined
  );
  if (!result) {
    return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
  }

  console.log(JSON.stringify({
    event: "affiliate_payout",
    code: code.toLowerCase(),
    amount: result.paid,
    note,
    timestamp: new Date().toISOString(),
  }));

  return NextResponse.json({
    ok: true,
    paid: result.paid,
    remaining: result.remaining,
  });
}
