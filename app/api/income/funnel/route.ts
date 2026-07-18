/**
 * GET /api/income/funnel
 *
 * Funnel-shape data for the income dashboard: pageviews → checkout intents
 * → leads → purchases. Each stage is the KV-backed count for the requested
 * window. Conversion rates are computed server-side.
 */

import { NextResponse } from "next/server";
import {
  countPageviewsSince,
  countIntentsSince,
  countLeadsSince,
  countTransactionsSince,
  fetchProjections,
} from "@/lib/income-ledger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 7)));
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  const [pv, intents, leads, purchases, projections] = await Promise.all([
    countPageviewsSince(since),
    countIntentsSince(since),
    countLeadsSince(since),
    countTransactionsSince(since),
    fetchProjections(),
  ]);

  const safe = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : 0);

  return NextResponse.json(
    {
      windowDays: days,
      funnel: {
        pageviews: pv,
        checkoutIntents: intents,
        leads: leads,
        purchases: purchases.count,
      },
      conversion: {
        leadRatePct: safe(leads, pv),
        intentRatePct: safe(intents, pv),
        purchaseIntentPct: safe(purchases.count, intents),
        purchaseLeadPct: safe(purchases.count, leads),
      },
      revenue: {
        grossUsd: Math.round(purchases.revenueCents) / 100,
        transactionsCount: purchases.count,
        averageOrderUsd:
          purchases.count > 0
            ? Math.round((purchases.revenueCents / purchases.count)) / 100
            : 0,
      },
      projections: projections ?? undefined,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
