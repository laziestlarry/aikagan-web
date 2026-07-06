/**
 * GET/POST /api/cron/weekly-intelligence
 *
 * Triggers the weekly intelligence roll-up. Falls back to running a
 * local roll-up of the income ledger when no AutonomaX backend is
 * configured, so the cron is useful even on the Hobby plan.
 *
 * Schedule (vercel.json):
 *   { "path": "/api/cron/weekly-intelligence", "schedule": "0 8 * * 1" }
 *
 * Auth: requires `Authorization: Bearer ${CRON_SECRET}` header.
 */

import { NextRequest, NextResponse } from "next/server";
import { proxyRequest } from "@/lib/proxy-utils";
import { requireCronAuth } from "@/lib/cron-auth";
import { getIncomeReality } from "@/lib/income-ledger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REVENUE_OPS_URL = process.env.NEXT_PUBLIC_AUTONOMAX_API_URL ?? "";

async function handle(req: NextRequest) {
  const auth = requireCronAuth(req);
  if (!auth.ok) return auth.response!;

  if (REVENUE_OPS_URL) {
    // Forward to the AutonomaX backend
    return proxyRequest(req, ["api", "weekly-intelligence", "tick"], {
      backendUrl: REVENUE_OPS_URL,
      apiKey: process.env.AUTONOMAX_API_KEY ?? "",
      timeoutMs: 30_000,
      forwarderName: "aikagan-cron",
    });
  }

  // Local roll-up from the income ledger
  const reality = await getIncomeReality(7);
  console.log(JSON.stringify({
    event: "weekly_intelligence_rollup",
    windowDays: reality.windowDays,
    purchases: reality.traffic.purchases,
    revenueUsd: reality.revenue.grossUsd,
    leads: reality.traffic.leads,
    intents: reality.traffic.checkoutIntents,
    pageviews: reality.traffic.pageviews,
    timestamp: new Date().toISOString(),
  }));

  return NextResponse.json({
    ok: true,
    source: "local_ledger",
    rollup: {
      weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      weekEnd: new Date().toISOString(),
      purchases: reality.traffic.purchases,
      revenueUsd: reality.revenue.grossUsd,
      leads: reality.traffic.leads,
      intents: reality.traffic.checkoutIntents,
      pageviews: reality.traffic.pageviews,
    },
  });
}

export async function GET(req: NextRequest) {
  return handle(req);
}
export async function POST(req: NextRequest) {
  return handle(req);
}
