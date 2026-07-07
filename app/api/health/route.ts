/**
 * GET /api/health
 *
 * Live operations health check. Returns reachability of all backend
 * dependencies, configuration sanity, and the new income ledger source
 * status. Designed for:
 *   - Vercel Cron Jobs (monitoring)
 *   - Uptime Robot / Better Uptime ping targets
 *   - Manual debugging of deployed env
 *
 * Response (200):
 *   { ok: true, version, uptime, checks: { ... }, income: { sources } }
 *
 * Response (503 — partial outage):
 *   { ok: false, version, uptime, checks: { degraded: [...] } }
 */

import { NextResponse } from "next/server";
import { getKv } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckResult {
  status: "ok" | "degraded" | "error";
  latency_ms: number;
  detail?: string;
}

const START_TIME = Date.now();

async function checkUrl(label: string, url: string, timeout = 5000): Promise<CheckResult> {
  const start = performance.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeout), cache: "no-store" });
    const latency = Math.round(performance.now() - start);
    if (res.ok) return { status: "ok", latency_ms: latency };
    return { status: "degraded", latency_ms: latency, detail: `HTTP ${res.status}` };
  } catch (err: unknown) {
    const latency = Math.round(performance.now() - start);
    const detail = err instanceof Error ? err.message : String(err);
    return { status: "error", latency_ms: latency, detail };
  }
}

export async function GET() {
  const checks: Record<string, CheckResult> = {};
  const degraded: string[] = [];

  // 1. Paddle API key configured?
  const paddleKey = process.env.PADDLE_API_KEY || "";
  checks["paddle_config"] = paddleKey
    ? { status: "ok", latency_ms: 0 }
    : { status: "degraded", latency_ms: 0, detail: "PADDLE_API_KEY not set" };

  // 2. Download token secret configured?
  const tokenKey = process.env.DOWNLOAD_TOKEN_SECRET || "";
  checks["download_token_config"] = tokenKey
    ? { status: "ok", latency_ms: 0 }
    : { status: "degraded", latency_ms: 0, detail: "DOWNLOAD_TOKEN_SECRET not set" };

  // 3. Meta CAPI configured?
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || "";
  const capiToken = process.env.META_CAPI_ACCESS_TOKEN || "";
  checks["meta_capi_config"] = pixelId && capiToken
    ? { status: "ok", latency_ms: 0 }
    : { status: "degraded", latency_ms: 0, detail: "META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not set" };

  // 4. Vercel KV (income ledger) — also pings the actual client
  let kvPingLatency = 0;
  let kvError: string | undefined;
  const kv = await getKv();
  if (kv) {
    const pingStart = performance.now();
    try {
      if (kv.type === "upstash") {
        await (kv as unknown as { ping: () => Promise<boolean> }).ping();
      }
      kvPingLatency = Math.round(performance.now() - pingStart);
      checks["vercel_kv"] = {
        status: "ok",
        latency_ms: kvPingLatency,
        detail: `Connected via ${kv.type} REST client`,
      };
    } catch (err) {
      kvError = err instanceof Error ? err.message : String(err);
      checks["vercel_kv"] = {
        status: "degraded",
        latency_ms: Math.round(performance.now() - pingStart),
        detail: `KV client present but ping failed: ${kvError}`,
      };
    }
  } else {
    checks["vercel_kv"] = {
      status: "degraded",
      latency_ms: 0,
      detail:
        "KV_REST_API_URL / KV_REST_API_TOKEN not set — income ledger is using in-memory fallback only",
    };
  }

  // 5. Revenue Ops backend reachability (Cloud Run) — try a known dashboard route
  const revenueOpsUrl = process.env.NEXT_PUBLIC_AUTONOMAX_API_URL || "";
  if (revenueOpsUrl) {
    checks["revenue_ops_backend"] = await checkUrl(
      "revenue-ops",
      `${revenueOpsUrl.replace(/\/+$/, "")}/api/dashboard`,
      5000,
    );
  } else {
    checks["revenue_ops_backend"] = { status: "degraded", latency_ms: 0, detail: "NEXT_PUBLIC_AUTONOMAX_API_URL not set" };
  }

  // 6. FastAPI backend reachability (same Fly.io backend) — try income-proxy
  const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "";
  if (fastApiUrl) {
    checks["fastapi_backend"] = await checkUrl("fastapi", `${fastApiUrl.replace(/\/+$/, "")}/api/intelligence/weekly`, 5000);
  } else {
    checks["fastapi_backend"] = { status: "degraded", latency_ms: 0, detail: "NEXT_PUBLIC_FASTAPI_URL not set" };
  }

  // 7. Paddle webhook secret configured
  const paddleWebhook = process.env.PADDLE_WEBHOOK_SECRET || "";
  checks["paddle_webhook_config"] = paddleWebhook
    ? { status: "ok", latency_ms: 0 }
    : { status: "degraded", latency_ms: 0, detail: "PADDLE_WEBHOOK_SECRET not set" };

  // 8. GA4 configured (server-side flag)
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "";
  checks["ga4_config"] = gaId
    ? { status: "ok", latency_ms: 0 }
    : { status: "degraded", latency_ms: 0, detail: "NEXT_PUBLIC_GA_ID not set" };

  // 9. Admin secret configured
  const adminSecret = process.env.ADMIN_SECRET || "";
  checks["admin_secret"] = adminSecret
    ? { status: "ok", latency_ms: 0 }
    : { status: "degraded", latency_ms: 0, detail: "ADMIN_SECRET not set" };

  // 10. CRON secret configured
  const cronSecret = process.env.CRON_SECRET || "";
  checks["cron_secret"] = cronSecret
    ? { status: "ok", latency_ms: 0 }
    : { status: "degraded", latency_ms: 0, detail: "CRON_SECRET not set — /api/cron/* will refuse" };

  // Collect degraded/error checks
  for (const [name, result] of Object.entries(checks)) {
    if (result.status !== "ok") degraded.push(name);
  }

  // Required for "ok": true → only paddle, KV, CAPI, GA4 must be live. Other
  // deps are "operational extras" — the funnel still works without them.
  const critical = ["paddle_config", "paddle_webhook_config", "download_token_config", "vercel_kv"];
  const criticalDegraded = critical.filter((c) => checks[c]?.status !== "ok");
  const overall = criticalDegraded.length === 0;

  return NextResponse.json(
    {
      ok: overall,
      version: process.env.VERCEL_GIT_COMMIT_SHA || "dev",
      uptime_seconds: Math.floor((Date.now() - START_TIME) / 1000),
      environment: process.env.NODE_ENV,
      checks,
      degraded: degraded.length > 0 ? degraded : undefined,
      critical_degraded: criticalDegraded.length > 0 ? criticalDegraded : undefined,
      income_sources: {
        kv: Boolean(kv),
        paddle: Boolean(paddleKey),
        capi: Boolean(pixelId && capiToken),
        ga4: Boolean(gaId),
      },
      audit_endpoints: {
        reality: "/api/income/reality",
        funnel: "/api/income/funnel",
        transactions: "/api/income/transactions",
        track: "/api/income/track",
        checkout: "/api/income/checkout",
      },
    },
    { status: overall ? 200 : 503 }
  );
}
