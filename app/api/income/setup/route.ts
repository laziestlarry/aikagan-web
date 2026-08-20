import { NextResponse } from "next/server";
import { CHECKOUT_SENTINEL, getPaidProducts } from "@/lib/products";
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
  const managedProducts = getPaidProducts().filter((product) => product.checkoutUrl === CHECKOUT_SENTINEL);
  const hasLemonVariant = managedProducts.some((product) =>
    configured(`LEMONSQUEEZY_VARIANT_${product.slug.replace(/-/g, "_").toUpperCase()}`),
  );
  const lemonMerchantApproved = process.env.LEMONSQUEEZY_MERCHANT_APPROVED === "true";

  const providers = {
    gumroad: {
      ready: configured("GUMROAD_ACCESS_TOKEN"),
      mappedProducts: Object.keys(GUMROAD_PRODUCTS),
      note: "The access token is used to confirm the sale subscription and verify every provider event before fulfillment.",
    },
    shopier: {
      ready:
        any("SHOPIER_PAT", "AUTONOMAX_SHOPIER_PAT") &&
        any("SHOPIER_OSB_USERNAME", "AUTONOMAX_SHOPIER_OSB_USERNAME") &&
        any("SHOPIER_OSB_PASSWORD", "AUTONOMAX_SHOPIER_OSB_KEY", "AUTONOMAX_SHOPIER_OSB_PASSWORD"),
      note: "PAT plus callback credentials are required for product-specific checkout and verified fulfillment.",
    },
    paddle: {
      ready:
        process.env.PADDLE_CHECKOUT_DISABLED !== "true" &&
        configured("PADDLE_API_KEY") &&
        configured("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN") &&
        configured("PADDLE_WEBHOOK_SECRET"),
      approvedSurfaces: [
        "app.aikagan.com",
        "propulse-autonomax.web.app",
        "autonomax-revenue-lenljbhrqq-uc.a.run.app",
      ],
      note: "Paddle may be used only on an approved surface. aikagan.com and checkout.aikagan.com are not treated as approved Paddle surfaces.",
    },
    lemonsqueezy: {
      ready:
        lemonMerchantApproved &&
        process.env.LEMONSQUEEZY_CHECKOUT_ENABLED === "true" &&
        configured("LEMONSQUEEZY_API_KEY") &&
        configured("LEMONSQUEEZY_STORE_ID") &&
        configured("LEMONSQUEEZY_WEBHOOK_SECRET") &&
        hasLemonVariant,
      merchantApproved: lemonMerchantApproved,
      note: "Disabled unless a future merchant approval is explicitly recorded. Existing credentials alone never imply approval.",
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
      key: "KV_REST_API_URL + KV_REST_API_TOKEN",
      required: true,
      status: configured("KV_REST_API_URL") && configured("KV_REST_API_TOKEN") ? "set" : "missing",
      where: "Vercel → aikagan-web → Settings → Environment Variables",
      how: "Use the matching Upstash Redis REST URL and token.",
    },
    {
      key: "MAKE_PURCHASE_WEBHOOK_URL or MAKE_CUSTOMER_SERVICE_WEBHOOK_URL",
      required: true,
      status: any("MAKE_PURCHASE_WEBHOOK_URL", "MAKE_CUSTOMER_SERVICE_WEBHOOK_URL") ? "set" : "missing",
      where: "Vercel → aikagan-web → Settings → Environment Variables",
      how: "Use the active purchase-delivery or customer-success webhook URL.",
      notes: "This is the customer-delivery handoff. KV preserves retry state but does not send customer email by itself.",
    },
    {
      key: "At least one complete checkout provider",
      required: true,
      status: Object.values(providers).some((provider) => provider.ready) ? "set" : "missing",
      where: "Gumroad, Shopier, Paddle, or a future approved processor plus Vercel variables",
      how: "Use API-verified Gumroad or Shopier on the root storefront. Use Paddle only on an approved Paddle surface with the complete credential set.",
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
      status: any("NEXT_PUBLIC_META_PIXEL_ID", "META_PIXEL_ID") && configured("META_CAPI_ACCESS_TOKEN") ? "set" : "missing",
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
      catalog: {
        managedCheckoutCount: managedProducts.length,
        managedCheckoutSlugs: managedProducts.map((product) => product.slug),
      },
      providers,
      required_now: missingRequired,
      all: entries,
      next_step: ready
        ? "Confirm /api/ops/status on the customer-facing host, then execute one independent real purchase and verify provider event, ledger, delivery, secure access, and payout review."
        : "Set the missing required configuration, redeploy, and re-check /api/ops/status. Do not claim live fulfillment while blocked.",
    },
    { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
