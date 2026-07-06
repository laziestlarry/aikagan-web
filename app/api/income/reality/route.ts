/**
 * GET /api/income/reality
 *
 * Single endpoint that returns the zero-gap income evidence feed.
 * Sourced from Vercel KV (durable) + the live Paddle API (when configured)
 * + the CAPI audit log (always present, even if just "dropped" entries).
 *
 * This is the ground truth that powers the income dashboard.
 */

import { NextResponse } from "next/server";
import { getIncomeReality } from "@/lib/income-ledger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 7)));
  const reality = await getIncomeReality(days);
  return NextResponse.json(reality, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
