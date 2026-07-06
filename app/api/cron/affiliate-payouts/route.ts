/**
 * GET/POST /api/cron/affiliate-payouts
 *
 * Weekly payout summary for the affiliate program. Reports who has
 * pending commission >= $50 (configurable) and emails the admin a digest.
 *
 * Schedule (vercel.json):
 *   { "path": "/api/cron/affiliate-payouts", "schedule": "0 9 * * 1" }
 *
 * Auth: requires `Authorization: Bearer ${CRON_SECRET}` header.
 */

import { NextRequest, NextResponse } from "next/server";
import { listAffiliates } from "@/lib/referral";
import { requireCronAuth } from "@/lib/cron-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAYOUT_THRESHOLD = 50; // USD

export async function GET(req: NextRequest) {
  const auth = requireCronAuth(req);
  if (!auth.ok) return auth.response!;

  const list = await listAffiliates();
  const eligible = list
    .filter((a) => a.pendingCommission >= PAYOUT_THRESHOLD)
    .map((a) => ({
      code: a.code,
      name: a.name,
      email: a.email,
      amount: a.pendingCommission,
    }));

  const totalDue = eligible.reduce((sum, a) => sum + a.amount, 0);

  // Future: email the admin a digest here
  console.log(JSON.stringify({
    event: "affiliate_payout_digest",
    eligible_count: eligible.length,
    total_due: totalDue,
    timestamp: new Date().toISOString(),
  }));

  return NextResponse.json({
    ok: true,
    threshold: PAYOUT_THRESHOLD,
    eligible_count: eligible.length,
    total_due: totalDue,
    eligible,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
