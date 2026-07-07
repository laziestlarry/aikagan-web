/**
 * AIKAGAN — Meta Conversions API (CAPI) Shared Helper
 *
 * Server-to-server events. iOS 14+ and privacy browsers eat browser-side Pixel
 * events; CAPI keeps attribution intact and this module:
 *   - Deduplicates with browser-side events via event_id
 *   - Hashes PII server-side (SHA-256) before sending
 *   - Accepts raw request headers for IP/UA extraction
 *   - Returns { ok, meta } or { error, detail }
 *
 * Call from:
 *   /api/lead                → event_name: "Lead"
 *   /api/webhooks/paddle     → event_name: "Purchase"
 *   /api/webhooks/lemonsqueezy → event_name: "Purchase"
 *
 * Required env (set in Vercel project settings):
 *   META_PIXEL_ID              — numeric Pixel ID
 *   META_CAPI_ACCESS_TOKEN     — long-lived token from Events Manager
 *   META_PIXEL_TEST_EVENT_CODE — optional; only set when validating
 */

import { createHash } from "node:crypto";

const PIXEL_ID = process.env.META_PIXEL_ID || "";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
const TEST_EVENT_CODE = process.env.META_PIXEL_TEST_EVENT_CODE || "";
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v20.0";

const sha256 = (s: string) =>
  createHash("sha256").update(s.trim().toLowerCase()).digest("hex");

export type CapiEventName = "Lead" | "Purchase" | "ViewContent" | "InitiateCheckout";

export interface CapiEvent {
  event_name: CapiEventName;
  event_id?: string;
  event_source_url?: string;
  email?: string | null;
  phone?: string | null;
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  /** Raw headers from the incoming request for IP/UA extraction */
  headers?: Headers | Record<string, string>;
  fbp?: string;
  fbc?: string;
  /** UTM params as a flat object */
  utm?: Record<string, string>;
}

export interface CapiResult {
  ok: boolean;
  meta?: unknown;
  error?: string;
  detail?: string;
}

/**
 * Fire a CAPI event to Meta. Non-blocking — returns immediately.
 * Logs errors but never throws.
 *
 * Usage:
 *   await fireCapiEvent({
 *     event_name: "Purchase",
 *     email: "customer@example.com",
 *     value: 29,
 *     currency: "USD",
 *     headers: req.headers,
 *   });
 */
export async function fireCapiEvent(event: CapiEvent): Promise<CapiResult> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    if (process.env.NODE_ENV === "development") {
      console.log("[capi] Skipping — META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not set");
    }
    return { ok: false, error: "not_configured" };
  }

  // Build user_data
  const userData: Record<string, string | string[]> = {};
  if (event.email) userData.em = [sha256(event.email)];
  if (event.phone) userData.ph = [sha256(event.phone)];

  // Extract IP
  let ip = "";
  if (event.headers) {
    const get = (k: string): string => {
      if (event.headers instanceof Headers) return event.headers.get(k) || "";
      return (event.headers as Record<string, string>)[k] || "";
    };
    const forwarded = get("x-forwarded-for");
    if (forwarded) ip = forwarded.split(",")[0].trim();
    if (!ip) ip = get("x-real-ip");
    if (ip) userData.client_ip_address = ip;
    const ua = get("user-agent");
    if (ua) userData.client_user_agent = ua;
  }

  if (event.fbp) userData.fbp = event.fbp;
  if (event.fbc) userData.fbc = event.fbc;

  // Build custom_data
  const customData: Record<string, unknown> = {};
  if (typeof event.value === "number") customData.value = event.value;
  if (event.currency) customData.currency = event.currency;
  if (event.content_ids?.length) customData.content_ids = event.content_ids;
  if (event.content_name) customData.content_name = event.content_name;
  if (event.utm) customData.utm = event.utm;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: event.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.event_id,
        event_source_url: event.event_source_url,
        action_source: "website",
        user_data: userData,
        custom_data: customData,
      },
    ],
  };
  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events` +
    `?access_token=${encodeURIComponent(ACCESS_TOKEN)}`;

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("[capi] Meta API error:", r.status, JSON.stringify(out));
      return { ok: false, error: "meta_api_error", detail: JSON.stringify(out) };
    }
    return { ok: true, meta: out };
  } catch (err) {
    console.error("[capi] Request failed:", String(err));
    return { ok: false, error: "request_failed", detail: String(err) };
  }
}
