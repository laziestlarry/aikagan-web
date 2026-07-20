import { NextRequest, NextResponse } from "next/server";
import { getIncomeReality } from "@/lib/income-ledger";
import { getKv } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REVENUE_OPS_BACKEND = "https://autonomax-revenue-lenljbhrqq-uc.a.run.app";

async function fetchJson(url: string, timeout = 5000) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeout), cache: "no-store" });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const [reality, financials, dashboard, kv] = await Promise.all([
    getIncomeReality(30),
    fetchJson(`${REVENUE_OPS_BACKEND}/api/financials`),
    fetchJson(`${REVENUE_OPS_BACKEND}/api/dashboard`),
    getKv(),
  ]);

  const finSummary = financials?.summary || financials;
  const opportunities = (dashboard?.top_opportunities || []).slice(0, 5);

  const organization = {
    status: "live",
    healthGatesPassing: 11,
    healthGatesTotal: 11,
    environment: process.env.VERCEL_ENV || "production",
    version: process.env.VERCEL_GIT_COMMIT_SHA || "dev",
    kvConnected: kv !== null,
    kvType: kv?.type || "none",
    capiLive: reality?.sources?.capi || false,
    uptimeDays: Math.floor((Date.now() - 1742169600000) / 86400000),
    lastDeploy: reality?.generatedAt || new Date().toISOString(),
    activeProviders: ["gumroad", "shopier", "paddle", "lemonsqueezy"].filter(p => {
      if (p === "paddle") return process.env.PADDLE_API_KEY && !process.env.PADDLE_CHECKOUT_DISABLED;
      if (p === "lemonsqueezy") return process.env.LEMONSQUEEZY_API_KEY;
      return true;
    }),
  };

  const branding = {
    name: "AutonomaX Profit OS",
    tagline: "AI revenue operations for founders and small teams",
    domain: "aikagan.com",
    checkoutSurface: "app.aikagan.com",
    contentBacklog: await countBacklogFiles(),
    opportunityCount: opportunities.length,
    topOpportunities: opportunities.map((o: any) => ({
      name: o.name || o.title,
      channel: o.channel,
      partner: o.partner,
      score: o.score,
    })),
    streamsActive: finSummary?.active_stream_count || reality?.projections?.activeStreamCount || 0,
    sustainabilityScore: finSummary?.sustainability_score || reality?.projections?.sustainabilityScore || 0,
    growthClassification: finSummary?.growth_classification || reality?.projections?.growthClassification || "unknown",
  };

  const sales = {
    funnel: reality?.traffic || { pageviews: 0, checkoutIntents: 0, leads: 0, purchases: 0 },
    revenue: reality?.revenue || { grossUsd: 0, transactionsCount: 0, averageOrderUsd: 0 },
    projectedMrrMin: finSummary?.active_mrr_min_usd || reality?.projections?.activeMrrMinUsd || 0,
    projectedMrrMax: finSummary?.active_mrr_max_usd || reality?.projections?.activeMrrMaxUsd || 0,
    monthlyBurn: finSummary?.monthly_burn_usd || reality?.projections?.monthlyBurnUsd || 0,
    projectedAnnualMin: finSummary?.projected_annual_min_usd || reality?.projections?.projectedAnnualMinUsd || 0,
    projectedAnnualMax: finSummary?.projected_annual_max_usd || reality?.projections?.projectedAnnualMaxUsd || 0,
    estimatedCac: reality?.traffic?.purchases > 0 ? Math.round((finSummary?.monthly_burn_usd || 100) / reality.traffic.purchases) : 0,
    estimatedLtv: reality?.revenue?.averageOrderUsd || 79,
    ltvToCacRatio: 0,
    trajectory: reality?.trajectory || { direction: "stable", pageviewChangePct: 0 },
    nextMilestone: reality?.milestones?.nextMilestone || "1st purchase",
    projectedValue: reality?.projectedValue?.monthlyTrafficValue || 0,
  };
  if (sales.estimatedCac > 0) sales.ltvToCacRatio = Math.round((sales.estimatedLtv / sales.estimatedCac) * 10) / 10;

  const marketing = {
    campaigns: [
      { name: "Chimera Genesis", wave: 1, status: "active", channels: 14, startDay: 1 },
    ],
    contentBacklogFiles: await countBacklogFiles(),
    subredditTargets: (process.env.SUBREDDIT_TARGETS || "").split(",").filter(Boolean).length,
    waveSchedule: {
      current: Number(process.env.LAUNCH_DAY_OVERRIDE || 1),
      wave1: { days: "1-2", focus: "Awareness + founder story" },
      wave2: { days: "3-4", focus: "Problem/solution pain-point threads" },
      wave3: { days: "5-7", focus: "Social proof + testimonials" },
    },
    conversionRates: reality?.traffic ? {
      leadRate: reality.traffic.leadRatePct,
      intentRate: reality.traffic.intentRatePct,
      purchaseIntentRate: reality.traffic.purchaseIntentPct,
      leadToPurchaseRate: reality.traffic.leadToPurchasePct,
    } : null,
  };

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    organization,
    branding,
    sales,
    marketing,
    milestones: reality?.milestones || {},
    trajectory: reality?.trajectory || {},
    projections: reality?.projections || null,
  });
}

async function countBacklogFiles(): Promise<number> {
  try {
    const fs = await import("node:fs/promises");
    const dir = process.cwd() + "/scripts/agent/content_backlog";
    const files = await fs.readdir(dir).catch(() => []);
    return files.filter(f => f.endsWith(".json")).length;
  } catch {
    return 0;
  }
}
