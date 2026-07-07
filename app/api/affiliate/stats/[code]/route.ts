/**
 * GET /api/affiliate/stats/[code]
 *
 * Read affiliate stats by code.
 *
 * Auth: stats are public but redacted. If the requester provides the matching
 * affiliate email via `?email=` query, or an admin secret via the
 * `x-admin-secret` header, the full profile is returned (including email
 * and payout log). Otherwise commission is hidden.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAffiliateByCode } from "@/lib/referral";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  if (!code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }
  const profile = await getAffiliateByCode(code.toLowerCase());
  if (!profile) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const email = req.nextUrl.searchParams.get("email")?.toLowerCase();
  const isOwner = email && email === profile.email.toLowerCase();
  const isAdmin =
    process.env.ADMIN_SECRET &&
    req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
  const fullView = isOwner || isAdmin;

  return NextResponse.json({
    code: profile.code,
    name: fullView ? profile.name : profile.name.split(" ")[0],
    totalClicks: profile.totalClicks,
    totalConversions: profile.totalConversions,
    conversionRate:
      profile.totalClicks > 0
        ? profile.totalConversions / profile.totalClicks
        : 0,
    totalCommission: fullView ? profile.totalCommission : null,
    pendingCommission: fullView ? profile.pendingCommission : null,
    paidCommission: fullView ? profile.paidCommission : null,
    payoutLog: fullView ? profile.payoutLog ?? [] : undefined,
    email: fullView ? profile.email : undefined,
    createdAt: fullView ? profile.createdAt : undefined,
    isOwner,
  });
}
