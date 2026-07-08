// ─────────────────────────────────────────────────────────────────────────────
// GET /api/rails
//
// Returns all payment rails with current status.
// Buyer-facing: shows which payment methods are available.
// Admin-facing: shows what needs setup to reach full-active status.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { paymentRails } from "@/lib/checkout-alternatives";
import {
  isAdminCoupon,
  getAdminCouponCode,
} from "@/lib/coupons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rails = paymentRails.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    status: r.status,
    isMoR: r.isMoR,
    methods: r.methods,
    payoutTo: r.payoutTo,
    hasCheckoutLink: r.checkoutLink !== null || r.status === "active",
    needsSetup: r.status === "onboarding" || r.status === "needs_setup",
  }));

  return NextResponse.json({
    rails,
    adminCoupon: {
      configured: getAdminCouponCode().length > 0,
      /** The test coupon code — only returned here because this is a server-only endpoint */
      code: process.env.ADMIN_TEST_COUPON || null,
      testPrice: "$1.00",
    },
    summary: {
      total: rails.length,
      active: rails.filter((r) => r.status === "active").length,
      onboarding: rails.filter((r) => r.status === "onboarding").length,
      needsSetup: rails.filter((r) => r.status === "needs_setup").length,
      manual: rails.filter((r) => r.status === "manual").length,
    },
    timestamp: new Date().toISOString(),
  });
}
