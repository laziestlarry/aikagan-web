import { NextResponse } from "next/server";
import { getPaidProducts } from "@/lib/products";
import { GUMROAD_PRODUCTS } from "@/lib/gumroad-products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Status = "set" | "missing";

interface EnvEntry {
  key: string;
  required: boolean;
  status: Status;
  where: string;
  how: string;
  notes?: string;
}

function configured(key: string): boolean {
  const value = process.env[key];
  return Boolean(value && value.trim() && !/^(replace|your_|changeme|placeholder)/i.test(value.trim()));
}

function status(key: string): Status {
  return configured(key) ? "set" : "missing";
}

function any(...keys: string[]): boolean {
  return keys.some(configured);
}

export async function GET() {
  const paidProducts = getPaidProducts();
  const hasLemonVariant = paidProducts.some((product) =>
    configured(`LEMONSQUEEZY_VARIANT_${product.slug.replace(/-/g, "_").toUpperCase()}`),
  );

  const providers = {
    paddle: {
      ready:
        process.env.PADDLE_CHECKOUT_DISABLED !== "true" &&
        configured("PADDLE_API_KEY") &&
        configured("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN") &&
        configured("PADDLE_WEBHOOK_SECRET"),
      approvedSurface: "app.aikagan.com or propulse-autonomax.web.app",
      note: "Paddle approved the app and Firebase surfaces, not aikagan.com. Do not force Paddle on the main storefront.",
    },
    lemonsqueezy: {
      ready:
        configured("LEMONSQUEEZY_API_KEY") &&
        configured("LEMONSQUEEZY_STORE_ID") &&
        configured("LEMONSQUEEZY_WEBHOOK_SECRET") &&
        hasLemonVariant,
      note: "Keep disabled unless the merchant store is approved and at least one live variant is configured.",
    },
    gumroad: {
      ready: configured("GUMROAD_WEBHOOK_TOKEN"),
      mappedProducts: Object.keys(GUMROAD_PRODUCTS),
      note: "Starter, Pro, Commander, and Revenue Audit have hosted product mappings. Configure the Ping URL with the shared token before treating fulfillment as live.",
    },
    shopier: {
      ready:
        any("SHOPIER_PAT", "AUTONOMAX_SHOPIER_PAT") &&
        any("SHOPIER_OSB_USERNAME", "AUTONOMAX_SHOPIER_OSB_USERNAME") &&
        any("SHOPIER_OSB_PASSWORD", "AUTONOMAX_SHOPIER_OSB_KEY", "AUTONOMAX_SHOPIER_OSB_PASSWORD"),
      note: "The merchant account has historical paid-order evidence. PAT and OSB credentials must be available in this Vercel environment.",
    },
  };

  const entries: EnvEntry[] = [
    {
      key: "DOWNLOAD_TOKEN_SECRET",
      required: true,
      status: status("DOWNLOAD_TOKEN_SECRET"),
      where: "Vercel → aikagan-web → Settings → Environment Variables",
      how: "Generate with `openssl rand -hex 32` and apply to production and preview.",
    },
    {
      key: "KV_REST_API_URL",
      required: true,
      status: status("KV_REST_API_URL"),
      where: "Vercel → aikagan-web → Settings → Environment Variables",
      how: "Copy the Upstash Redis REST URL.",
    },
    {
      key: "KV_REST_API_TOKEN",
      required: true,
      status: status("KV_REST_API_TOKEN"),
      where: "Vercel → aikagan-web → Settings → Environment Variables",
      how: "Copy the matching Upstash Redis REST token.",
    },
    {
      key: "MAKE_PURCHASE_WEBHOOK_URL or MAKE_CUSTOMER_SERVICE_WEBHOOK_URL",
      required: true,
      status: any("MAKE_PURCHASE_WEBHOOK_URL", "MAKE_CUSTOMER_SERVICE_WEBHOOK_URL") ? "set" : "missing",
      where: "Vercel → aikagan-web → Settings → Environment Variables",
      how: "Use the active Make Purchase Delivery Router or Customer Success Router webhook URL.",
      notes: "This is the delivery-email handoff. KV preserves the job but does not send the customer email by itself.",
    },
    {
      key: "At least one complete checkout provider",
      required: true,
      status: Object.values(providers).some((provider) => provider.ready) ? "set" : "missing",
      where: "Paddle, Gumroad, Shopier, or Lemon Squeezy plus Vercel environment variables",
      how: "For the main storefront, prioritize secured Gumroad Ping or Shopier OSB. Use Paddle only on an approved surface.",
    },
    {
      key: "NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GA_MEASUREMENT_ID",
      required: false,
      status: any("NEXT_PUBLIC_GA_ID", "NEXT_PUBLIC_GA_MEASUREMENT_ID") ? "set" : "missing",
      where: "Vercel → aikagan-web → Settings → Environment Variables",
      how: "Use the GA4 web-stream Measurement ID.",
    },
    {
      key: "NEXT_PUBLIC_META_PIXEL_ID + META_CAPI_ACCESS_TOKEN",
      required: false,
      status: configured("NEXT_PUBLIC_META_PIXEL_ID") && configured("META_CAPI_ACCESS_TOKEN") ? "set" : "missing",
      where: "Vercel → aikagan-web → Settings → Environment Variables",
      how: "Copy the Pixel ID and long-lived CAPI token from Meta Events Manager.",
    },
  ];

  const missingRequired = entries.filter((entry) => entry.required && entry.status === "missing");
  const ready = missingRequired.length === 0;

  return NextResponse.json(
    {
      ok: ready,
      simulated: false,
      summary: {
        total: entries.length,
        required: entries.filter((entry) => entry.required).length,
        missing_required: missingRequired.length,
        ready,
      },
      providers,
      required_now: missingRequired,
      all: entries,
      next_step: ready
        ? "Configuration gates pass. Execute one low-value real purchase and verify the provider event, ledger entry, email handoff, and secure download before merging."
        : "Set the missing required configuration, redeploy, and re-check /api/ops/status. Do not claim live fulfillment while this endpoint is blocked.",
    },
    { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
