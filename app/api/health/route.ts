import { NextResponse } from "next/server";
import { getKv } from "@/lib/kv";
import { getPaidProducts } from "@/lib/products";
import { isGumroadApiConfigured } from "@/lib/gumroad-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckResult {
  status: "ok" | "degraded" | "error";
  latency_ms: number;
  detail?: string;
}

const START_TIME = Date.now();

function configured(name: string): boolean {
  const value = process.env[name];
  return Boolean(value && value.trim() && !/^(replace|your_|changeme|placeholder)/i.test(value.trim()));
}
function configuredAny(...names: string[]): boolean {
  return names.some(configured);
}
function configCheck(ok: boolean, detail: string): CheckResult {
  return ok ? { status: "ok", latency_ms: 0 } : { status: "degraded", latency_ms: 0, detail };
}
async function checkUrl(url: string, timeout = 5000): Promise<CheckResult> {
  const start = performance.now();
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeout), cache: "no-store" });
    const latency = Math.round(performance.now() - start);
    return response.ok
      ? { status: "ok", latency_ms: latency }
      : { status: "degraded", latency_ms: latency, detail: `HTTP ${response.status}` };
  } catch (cause) {
    return {
      status: "error",
      latency_ms: Math.round(performance.now() - start),
      detail: cause instanceof Error ? cause.message : String(cause),
    };
  }
}

export async function GET() {
  const checks: Record<string, CheckResult> = {};
  const paidProducts = getPaidProducts();
  const hasLemonVariant = paidProducts.some((product) =>
    configured(`LEMONSQUEEZY_VARIANT_${product.slug.replace(/-/g, "_").toUpperCase()}`),
  );

  const providers = {
    gumroad: isGumroadApiConfigured(),
    shopier:
      configuredAny("SHOPIER_PAT", "AUTONOMAX_SHOPIER_PAT") &&
      configuredAny("SHOPIER_OSB_USERNAME", "AUTONOMAX_SHOPIER_OSB_USERNAME") &&
      configuredAny("SHOPIER_OSB_PASSWORD", "AUTONOMAX_SHOPIER_OSB_KEY", "AUTONOMAX_SHOPIER_OSB_PASSWORD"),
    paddle:
      process.env.PADDLE_CHECKOUT_DISABLED !== "true" &&
      configured("PADDLE_API_KEY") &&
      configured("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN") &&
      configured("PADDLE_WEBHOOK_SECRET"),
    lemonsqueezy:
      process.env.LEMONSQUEEZY_CHECKOUT_ENABLED === "true" &&
      configured("LEMONSQUEEZY_API_KEY") &&
      configured("LEMONSQUEEZY_STORE_ID") &&
      configured("LEMONSQUEEZY_WEBHOOK_SECRET") &&
      hasLemonVariant,
  };

  checks.catalog = configCheck(paidProducts.length > 0, "No paid products are registered");
  checks.checkout_provider = configCheck(Object.values(providers).some(Boolean), "No complete payment provider configuration is available");
  checks.download_token_config = configCheck(configured("DOWNLOAD_TOKEN_SECRET"), "DOWNLOAD_TOKEN_SECRET not set");
  checks.fulfillment_webhook = configCheck(
    configuredAny("MAKE_PURCHASE_WEBHOOK_URL", "MAKE_CUSTOMER_SERVICE_WEBHOOK_URL"),
    "MAKE_PURCHASE_WEBHOOK_URL or MAKE_CUSTOMER_SERVICE_WEBHOOK_URL not set",
  );

  let kvConnected = false;
  const kv = await getKv();
  if (kv) {
    const pingStart = performance.now();
    try {
      if (kv.type === "upstash") await (kv as unknown as { ping: () => Promise<boolean> }).ping();
      kvConnected = true;
      checks.durable_queue = {
        status: "ok",
        latency_ms: Math.round(performance.now() - pingStart),
        detail: `Connected via ${kv.type}`,
      };
    } catch (cause) {
      checks.durable_queue = {
        status: "error",
        latency_ms: Math.round(performance.now() - pingStart),
        detail: cause instanceof Error ? cause.message : String(cause),
      };
    }
  } else {
    checks.durable_queue = { status: "degraded", latency_ms: 0, detail: "KV_REST_API_URL / KV_REST_API_TOKEN not set" };
  }

  const pixelId = configuredAny("NEXT_PUBLIC_META_PIXEL_ID", "META_PIXEL_ID");
  const capiToken = configured("META_CAPI_ACCESS_TOKEN");
  checks.meta_capi_config = configCheck(pixelId && capiToken, "Meta Pixel ID or META_CAPI_ACCESS_TOKEN not set");
  checks.analytics_config = configCheck(
    configuredAny("NEXT_PUBLIC_GA_ID", "NEXT_PUBLIC_GA_MEASUREMENT_ID", "NEXT_PUBLIC_META_PIXEL_ID"),
    "No GA4 or Meta browser analytics identifier is configured",
  );
  checks.admin_secret = configCheck(configured("ADMIN_SECRET"), "ADMIN_SECRET not set");
  checks.cron_secret = configCheck(configured("CRON_SECRET"), "CRON_SECRET not set");

  const REVENUE_OPS_BACKEND = "https://autonomax-revenue-lenljbhrqq-uc.a.run.app";
  const revenueOpsUrl = process.env.NEXT_PUBLIC_AUTONOMAX_API_URL ?? REVENUE_OPS_BACKEND;
  checks.revenue_ops_backend = revenueOpsUrl
    ? await checkUrl(`${revenueOpsUrl.replace(/\/+$/, "")}/api/dashboard`)
    : { status: "degraded", latency_ms: 0, detail: "NEXT_PUBLIC_AUTONOMAX_API_URL not set" };
  const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL ?? REVENUE_OPS_BACKEND;
  checks.fastapi_backend = fastApiUrl
    ? await checkUrl(`${fastApiUrl.replace(/\/+$/, "")}/api/intelligence/weekly`)
    : { status: "degraded", latency_ms: 0, detail: "NEXT_PUBLIC_FASTAPI_URL not set" };

  const criticalNames = ["catalog", "checkout_provider", "download_token_config", "fulfillment_webhook", "durable_queue"];
  const criticalDegraded = criticalNames.filter((name) => checks[name]?.status !== "ok");
  const degraded = Object.entries(checks).filter(([, result]) => result.status !== "ok").map(([name]) => name);
  const ok = criticalDegraded.length === 0;

  return NextResponse.json(
    {
      ok,
      simulated: false,
      version: process.env.VERCEL_GIT_COMMIT_SHA || "dev",
      uptime_seconds: Math.floor((Date.now() - START_TIME) / 1000),
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
      providers,
      checks,
      degraded: degraded.length ? degraded : undefined,
      critical_degraded: criticalDegraded.length ? criticalDegraded : undefined,
      income_sources: {
        kv: kvConnected,
        provider: Object.values(providers).some(Boolean),
        capi: pixelId && capiToken,
        analytics: checks.analytics_config.status === "ok",
      },
      audit_endpoints: {
        readiness: "/api/ops/status",
        setup: "/api/income/setup",
        reality: "/api/income/reality",
        funnel: "/api/income/funnel",
        transactions: "/api/income/transactions",
        track: "/api/income/track",
        checkout: "/api/income/checkout",
      },
    },
    { status: ok ? 200 : 503 },
  );
}
