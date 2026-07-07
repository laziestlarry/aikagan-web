/**
 * GET /api/admin/affiliates
 *
 * List all affiliates (admin only).
 *
 * Auth: requires `x-admin-secret` header matching ADMIN_SECRET env var.
 */

import { NextRequest, NextResponse } from "next/server";
import { listAffiliates } from "@/lib/referral";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || req.headers.get("x-admin-secret") !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit admin read: 30 / min
  const limit = rateLimit({
    key: clientKey(req, "admin-affiliates"),
    max: 30,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return rateLimitResponse(limit);
  }

  const list = await listAffiliates();
  // Redact PII
  const safe = list.map((a) => ({
    code: a.code,
    name: a.name,
    email: a.email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    totalClicks: a.totalClicks,
    totalConversions: a.totalConversions,
    totalCommission: a.totalCommission,
    pendingCommission: a.pendingCommission,
    paidCommission: a.paidCommission,
    createdAt: a.createdAt,
  }));

  const totals = safe.reduce(
    (acc, a) => ({
      pending: acc.pending + a.pendingCommission,
      paid: acc.paid + a.paidCommission,
      conversions: acc.conversions + a.totalConversions,
      clicks: acc.clicks + a.totalClicks,
    }),
    { pending: 0, paid: 0, conversions: 0, clicks: 0 }
  );

  return NextResponse.json({
    ok: true,
    count: safe.length,
    totals,
    affiliates: safe,
  });
}
