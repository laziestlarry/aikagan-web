/**
 * GET /api/affiliate/stats/aggregate
 *
 * Public aggregate stats across all affiliates (no PII).
 * Used by the affiliate landing page to show program totals.
 */

import { NextResponse } from "next/server";
import { listAffiliates } from "@/lib/referral";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Rate limit: 30 / min per IP
  const limit = rateLimit({
    key: clientKey(req, "affiliate-aggregate"),
    max: 30,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return rateLimitResponse(limit);
  }

  const list = await listAffiliates();
  const totals = list.reduce(
    (acc, a) => ({
      total_paid: acc.total_paid + a.paidCommission,
      total_pending: acc.total_pending + a.pendingCommission,
      total_conversions: acc.total_conversions + a.totalConversions,
      total_clicks: acc.total_clicks + a.totalClicks,
    }),
    { total_paid: 0, total_pending: 0, total_conversions: 0, total_clicks: 0 }
  );

  return NextResponse.json({
    total_affiliates: list.length,
    ...totals,
  });
}
