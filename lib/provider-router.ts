// ─────────────────────────────────────────────────────────────────────────────
// Provider Router — picks the right payment provider per request.
//
// Priority:
//   1. Paddle  (primary — Merchant of Record, best global coverage)
//   2. LemonSqueezy (fallback — also MoR, similar Turkey support)
//   3. Gumroad (last-resort — simple MoR, fewer features)
//
// All three pipe the same HMAC download token through /api/download/[token].
// Custom data carries:
//   - product_slug  → maps to ZIP
//   - ref_code      → affiliate attribution
//   - utm_*         → marketing attribution
// ─────────────────────────────────────────────────────────────────────────────

import { getProduct } from "./products";

export type Provider = "paddle" | "lemonsqueezy" | "gumroad";

export interface CheckoutRequest {
  slug: string;
  ref?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  /** ISO country code, e.g. "TR", "US" — for future geo-routing */
  country?: string | null;
}

export interface ProviderStatus {
  provider: Provider;
  available: boolean;
  reason?: string;
}

/** Which providers are configured and ready. */
export function getProviderStatus(): Record<Provider, ProviderStatus> {
  return {
    paddle: {
      provider: "paddle",
      available: Boolean(process.env.PADDLE_API_KEY),
      reason: process.env.PADDLE_API_KEY ? undefined : "PADDLE_API_KEY not set",
    },
    lemonsqueezy: {
      provider: "lemonsqueezy",
      available: Boolean(
        process.env.LEMONSQUEEZY_API_KEY && process.env.LEMONSQUEEZY_STORE_ID
      ),
      reason:
        process.env.LEMONSQUEEZY_API_KEY && process.env.LEMONSQUEEZY_STORE_ID
          ? undefined
          : "LEMONSQUEEZY_API_KEY or LEMONSQUEEZY_STORE_ID not set",
    },
    gumroad: {
      provider: "gumroad",
      available: Boolean(process.env.GUMROAD_ACCESS_TOKEN),
      reason: process.env.GUMROAD_ACCESS_TOKEN
        ? undefined
        : "GUMROAD_ACCESS_TOKEN not set",
    },
  };
}

/** Pick the first available provider, in priority order. */
export function selectProvider(): Provider | null {
  const status = getProviderStatus();
  if (status.paddle.available) return "paddle";
  if (status.lemonsqueezy.available) return "lemonsqueezy";
  if (status.gumroad.available) return "gumroad";
  return null;
}

/** Build the custom_data payload that all providers can carry. */
export function buildCustomData(req: CheckoutRequest): Record<string, string> {
  return {
    product_slug: req.slug,
    ref_code: req.ref ?? "",
    utm_source: req.utm_source ?? "",
    utm_medium: req.utm_medium ?? "",
    utm_campaign: req.utm_campaign ?? "",
    utm_term: req.utm_term ?? "",
    utm_content: req.utm_content ?? "",
  };
}

/** Validate the checkout request. */
export function validateCheckoutRequest(
  body: unknown
): { ok: true; req: CheckoutRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" };
  }
  const b = body as Record<string, unknown>;
  if (typeof b.slug !== "string" || !b.slug) {
    return { ok: false, error: "Missing or invalid slug" };
  }
  const product = getProduct(b.slug);
  if (!product) {
    return { ok: false, error: `Unknown product: ${b.slug}` };
  }
  if (!product.price || product.priceModel === "free") {
    return { ok: false, error: "Free products do not need checkout" };
  }
  return {
    ok: true,
    req: {
      slug: b.slug,
      ref: typeof b.ref === "string" ? b.ref : null,
      utm_source: typeof b.utm_source === "string" ? b.utm_source : null,
      utm_medium: typeof b.utm_medium === "string" ? b.utm_medium : null,
      utm_campaign: typeof b.utm_campaign === "string" ? b.utm_campaign : null,
      utm_term: typeof b.utm_term === "string" ? b.utm_term : null,
      utm_content: typeof b.utm_content === "string" ? b.utm_content : null,
      country: typeof b.country === "string" ? b.country : null,
    },
  };
}
