import { NextResponse } from "next/server";
import { getPaidProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

function configured(name: string): boolean {
  const value = process.env[name];
  return Boolean(
    value &&
      value.trim() &&
      !/^(replace|your_|changeme|placeholder)/i.test(value.trim()),
  );
}

function configuredAny(...names: string[]): boolean {
  return names.some(configured);
}

export async function GET() {
  const paidProducts = getPaidProducts();
  const hasLemonVariant = paidProducts.some((product) =>
    configured(
      `LEMONSQUEEZY_VARIANT_${product.slug.replace(/-/g, "_").toUpperCase()}`,
    ),
  );

  const providers = {
    paddle:
      process.env.PADDLE_CHECKOUT_DISABLED !== "true" &&
      configured("PADDLE_API_KEY") &&
      configured("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN") &&
      configured("PADDLE_WEBHOOK_SECRET"),
    lemonsqueezy:
      configured("LEMONSQUEEZY_API_KEY") &&
      configured("LEMONSQUEEZY_STORE_ID") &&
      configured("LEMONSQUEEZY_WEBHOOK_SECRET") &&
      hasLemonVariant,
    shopier:
      configuredAny("SHOPIER_PAT", "AUTONOMAX_SHOPIER_PAT") &&
      configuredAny("SHOPIER_OSB_USERNAME", "AUTONOMAX_SHOPIER_OSB_USERNAME") &&
      configuredAny(
        "SHOPIER_OSB_PASSWORD",
        "AUTONOMAX_SHOPIER_OSB_KEY",
        "AUTONOMAX_SHOPIER_OSB_PASSWORD",
      ),
    gumroad: configured("GUMROAD_WEBHOOK_TOKEN"),
  };

  const checks = {
    deployment: true,
    catalog: paidProducts.length > 0,
    checkoutProvider: Object.values(providers).some(Boolean),
    downloadTokens: configured("DOWNLOAD_TOKEN_SECRET"),
    fulfillmentWebhook: configuredAny(
      "MAKE_PURCHASE_WEBHOOK_URL",
      "MAKE_CUSTOMER_SERVICE_WEBHOOK_URL",
    ),
    durableQueue:
      configured("KV_REST_API_URL") && configured("KV_REST_API_TOKEN"),
  };

  const warnings = {
    analytics:
      configured("NEXT_PUBLIC_GA_MEASUREMENT_ID") ||
      configured("NEXT_PUBLIC_META_PIXEL_ID"),
    capi:
      configured("META_CAPI_ACCESS_TOKEN") &&
      configured("NEXT_PUBLIC_META_PIXEL_ID"),
    omnichannel: configured("MAKE_OMNICHANNEL_WEBHOOK_URL"),
  };

  const ready = Object.values(checks).every(Boolean);

  return NextResponse.json(
    {
      service: "AIKAGAN ProfitOS Commerce",
      mode: ready ? "live" : "blocked",
      ready,
      simulated: false,
      checkedAt: new Date().toISOString(),
      products: {
        paid: paidProducts.length,
        slugs: paidProducts.map((product) => product.slug),
      },
      providers,
      checks,
      warnings,
      blockers: Object.entries(checks)
        .filter(([, ok]) => !ok)
        .map(([name]) => name),
      advisories: Object.entries(warnings)
        .filter(([, ok]) => !ok)
        .map(([name]) => name),
    },
    { status: ready ? 200 : 503 },
  );
}
