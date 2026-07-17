import { NextRequest, NextResponse } from "next/server";
import { getPaidProducts } from "@/lib/products";
import { ensureGumroadSaleSubscription, isGumroadApiConfigured } from "@/lib/gumroad-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function configured(name: string): boolean {
  const value = process.env[name];
  return Boolean(value && value.trim() && !/^(replace|your_|changeme|placeholder)/i.test(value.trim()));
}

function configuredAny(...names: string[]): boolean {
  return names.some(configured);
}

export async function GET(req: NextRequest) {
  const paidProducts = getPaidProducts();
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();
  const approvedPaddleSurface =
    hostname === "app.aikagan.com" ||
    hostname === "propulse-autonomax.web.app" ||
    hostname === "autonomax-revenue-lenljbhrqq-uc.a.run.app" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  const gumroadSubscription = isGumroadApiConfigured()
    ? await ensureGumroadSaleSubscription(new URL("/api/webhooks/gumroad", siteUrl).toString())
    : { ready: false, created: false, detail: "GUMROAD_ACCESS_TOKEN missing" };

  const providers = {
    gumroad: gumroadSubscription.ready,
    shopier:
      configuredAny("SHOPIER_PAT", "AUTONOMAX_SHOPIER_PAT") &&
      configuredAny("SHOPIER_OSB_USERNAME", "AUTONOMAX_SHOPIER_OSB_USERNAME") &&
      configuredAny("SHOPIER_OSB_PASSWORD", "AUTONOMAX_SHOPIER_OSB_KEY", "AUTONOMAX_SHOPIER_OSB_PASSWORD"),
    paddle:
      approvedPaddleSurface &&
      process.env.PADDLE_CHECKOUT_DISABLED !== "true" &&
      configured("PADDLE_API_KEY") &&
      configured("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN") &&
      configured("PADDLE_WEBHOOK_SECRET"),
    lemonsqueezy:
      process.env.LEMONSQUEEZY_CHECKOUT_ENABLED === "true" &&
      configured("LEMONSQUEEZY_API_KEY") &&
      configured("LEMONSQUEEZY_STORE_ID") &&
      configured("LEMONSQUEEZY_WEBHOOK_SECRET"),
  };

  const checks = {
    deployment: true,
    catalog: paidProducts.length > 0,
    checkoutProvider: Object.values(providers).some(Boolean),
    downloadTokens: configured("DOWNLOAD_TOKEN_SECRET"),
    fulfillmentWebhook: configuredAny("MAKE_PURCHASE_WEBHOOK_URL", "MAKE_CUSTOMER_SERVICE_WEBHOOK_URL"),
    durableQueue: configured("KV_REST_API_URL") && configured("KV_REST_API_TOKEN"),
  };

  const warnings = {
    analytics: configuredAny("NEXT_PUBLIC_GA_ID", "NEXT_PUBLIC_GA_MEASUREMENT_ID", "NEXT_PUBLIC_META_PIXEL_ID"),
    capi: configured("META_CAPI_ACCESS_TOKEN") && configuredAny("NEXT_PUBLIC_META_PIXEL_ID", "META_PIXEL_ID"),
    omnichannel: configured("MAKE_OMNICHANNEL_WEBHOOK_URL"),
    gumroadSubscriptionCreated: gumroadSubscription.ready && gumroadSubscription.created,
  };

  const ready = Object.values(checks).every(Boolean);

  return NextResponse.json(
    {
      service: "AIKAGAN ProfitOS Commerce",
      mode: ready ? "live" : "blocked",
      ready,
      simulated: false,
      checkedAt: new Date().toISOString(),
      products: { paid: paidProducts.length, slugs: paidProducts.map((product) => product.slug) },
      providers,
      providerEvidence: {
        gumroad: {
          apiConfigured: isGumroadApiConfigured(),
          subscriptionReady: gumroadSubscription.ready,
          subscriptionCreatedNow: gumroadSubscription.created,
          detail: gumroadSubscription.detail,
        },
        paddle: { approvedSurface: approvedPaddleSurface },
      },
      checks,
      warnings,
      blockers: Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name),
      advisories: Object.entries(warnings).filter(([, ok]) => !ok).map(([name]) => name),
    },
    { status: ready ? 200 : 503 },
  );
}
