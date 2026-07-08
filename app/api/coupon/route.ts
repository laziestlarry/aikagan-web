// ─────────────────────────────────────────────────────────────────────────────
// GET /api/coupon
//
// Diagnostic: shows whether the admin test coupon is configured.
// Never reveals the actual coupon code.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { getAdminCouponCode } from "@/lib/coupons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const code = getAdminCouponCode();
  return NextResponse.json({
    configured: code.length > 0,
    /** How many characters — enough to verify it's set without leaking */
    codeLength: code.length,
    /** Instructions */
    usage: "Pass ?coupon=<code> to any checkout endpoint for $1 test pricing",
  });
}
