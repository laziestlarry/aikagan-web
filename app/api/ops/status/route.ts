import { NextResponse } from "next/server";
import { getPaidProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

function configured(name: string): boolean {
  const value = process.env[name];
  return Boolean(value && value.trim() && !/^(replace|your_|changeme|placeholder)/i.test(value.trim()));
}

export async function GET() {
  const paidProducts = getPaidProducts();
  const checks = {
    deployment: true,
    catalog: paidProducts.length > 0,
    paddleApi: configured("PADDLE_API_KEY"),
    paddleClient: configured("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN"),
    paddleWebhook: configured("PADDLE_WEBHOOK_SECRET"),
    fulfillmentSecret: configured("DOWNLOAD_SECRET") || configured("FULFILLMENT_SECRET"),
    analytics: configured("NEXT_PUBLIC_GA_MEASUREMENT_ID") || configured("NEXT_PUBLIC_META_PIXEL_ID"),
    kv: configured("KV_REST_API_URL") && configured("KV_REST_API_TOKEN"),
  };

  const critical = [checks.deployment, checks.catalog, checks.paddleApi, checks.paddleClient, checks.paddleWebhook, checks.fulfillmentSecret];
  const ready = critical.every(Boolean);

  return NextResponse.json({
    service: "AIKAGAN ProfitOS Commerce",
    mode: ready ? "live" : "blocked",
    ready,
    simulated: false,
    checkedAt: new Date().toISOString(),
    products: { paid: paidProducts.length, slugs: paidProducts.map((product) => product.slug) },
    checks,
    blockers: Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name),
  }, { status: ready ? 200 : 503 });
}
