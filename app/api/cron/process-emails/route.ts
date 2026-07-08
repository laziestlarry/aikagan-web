/**
 * POST /api/cron/process-emails
 *
 * Cron endpoint that drains the fulfillment queue.
 * Protected by CRON_SECRET — must pass ?secret=<CRON_SECRET> query param.
 *
 * Trigger from Vercel Cron Jobs:
 *   https://aikagan.com/api/cron/process-emails?secret=<CRON_SECRET>
 *
 * Or set via vercel.json "crons":
 *   { "path": "/api/cron/process-emails", "schedule": "every 30 minutes" }
 */

import { NextRequest, NextResponse } from "next/server";
import { drainFulfillmentQueue } from "@/lib/fulfillment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const processed = await drainFulfillmentQueue();

  return NextResponse.json({
    ok: true,
    processed,
    timestamp: new Date().toISOString(),
  });
}

// Allow GET for manual health check
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    message: "Fulfillment queue cron endpoint ready",
  });
}
