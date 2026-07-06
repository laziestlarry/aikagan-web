/**
 * Shared auth helper for Vercel Cron routes.
 *
 * Vercel Cron sends a request with `Authorization: Bearer ${CRON_SECRET}` when
 * the project env has CRON_SECRET set. We honor that pattern exactly.
 *
 * Returns:
 *   - { ok: true }                      when authorized
 *   - { ok: false, response: NextResponse } when not — caller just `return`s it
 */

import { NextRequest, NextResponse } from "next/server";

export interface CronAuthResult {
  ok: boolean;
  reason?: string;
  response?: NextResponse;
}

export function requireCronAuth(req: NextRequest): CronAuthResult {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return {
      ok: false,
      reason: "CRON_SECRET not configured",
      response: NextResponse.json(
        { error: "CRON_SECRET not configured — set it in Vercel project env" },
        { status: 503 },
      ),
    };
  }
  const header = req.headers.get("authorization") || "";
  if (header !== `Bearer ${secret}`) {
    return {
      ok: false,
      reason: "bad or missing Authorization header",
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true };
}
