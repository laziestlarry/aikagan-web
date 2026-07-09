// ─────────────────────────────────────────────────────────────────────────────
// POST /api/affiliate/signup
//
// Register a new affiliate. Returns the unique 8-char referral code
// and the public referral link.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import {
  registerAffiliate,
  buildReferralLink,
  type AffiliateProfile,
} from "@/lib/referral";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Rate limit: 3 signups / 10 min per IP
  const limit = rateLimit({
    key: clientKey(req, "affiliate-signup"),
    max: 3,
    windowMs: 10 * 60_000,
  });
  if (!limit.allowed) {
    return rateLimitResponse(limit);
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { name, email } = body as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }

  try {
    const profile: AffiliateProfile = await registerAffiliate(
      name.trim(),
      email.trim()
    );
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";
    const referralLink = buildReferralLink(profile.code, baseUrl);
    return NextResponse.json({
      ok: true,
      code: profile.code,
      referralLink,
      name: profile.name,
      email: profile.email,
    });
  } catch (err: any) {
    console.error("❌ Affiliate signup error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Registration failed" },
      { status: 500 }
    );
  }
}
