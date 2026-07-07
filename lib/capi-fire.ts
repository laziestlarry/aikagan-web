/**
 * Unified Meta Conversions API helper.
 *
 * Single source of truth for sending events to Meta. Used by:
 *   - /api/lead
 *   - /api/webhooks/paddle  (Purchase)
 *   - /api/webhooks/lemonsqueezy (Purchase)
 *   - /api/income/checkout (InitiateCheckout)
 *   - any other server-side funnel event
 *
 * - Server-side SHA-256 of PII before send.
 * - `event_id` deduplicates with browser-side Pixel events.
 * - When CAPI is not configured the call is a no-op and we record the
 *   "dropped" status to the income ledger so the audit trail is honest.
 * - Returns a structured result so callers can log + persist it.
 */

import { createHash } from "node:crypto";
import { recordCapiAttempt } from "./income-ledger";

export type CapiEventName =
  | "Lead"
  | "Purchase"
  | "InitiateCheckout"
  | "ViewContent"
  | "AddToCart"
  | "CompleteRegistration";

export interface CapiEvent {
  event_name: CapiEventName;
  event_id?: string;
  event_source_url?: string;
  email?: string | null;
  phone?: string | null;
  external_id?: string | null;
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  /** IP from request headers (will be extracted automatically if omitted). */
  client_ip?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  utm?: Record<string, string>;
  /** Extra Meta custom_data fields. */
  custom_data?: Record<string, unknown>;
}

export interface CapiResult {
  ok: boolean;
  status?: number;
  response?: unknown;
  error?: string;
  detail?: string;
  /** True iff CAPI is configured AND the call was attempted. */
  attempted: boolean;
  /** Always populated for the audit trail. */
  event_id: string;
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || "";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
const TEST_EVENT_CODE = process.env.META_PIXEL_TEST_EVENT_CODE || "";
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v22.0";

function sha256(s: string): string {
  return createHash("sha256").update(String(s).trim().toLowerCase()).digest("hex");
}

function isConfigured(): boolean {
  return Boolean(PIXEL_ID && ACCESS_TOKEN);
}

function newEventId(): string {
  return `${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;
}

export function capiConfigured(): boolean {
  return isConfigured();
}

/**
 * Fire a CAPI event. Always returns a structured result and always records
 * an audit row (attempted, ok, status) to the income ledger.
 */
export async function fireCapi(
  event: CapiEvent,
  context?: {
    /** Incoming request — used to extract IP / UA. */
    req?: { headers: { get: (k: string) => string | null } };
    /** Origin tag for the audit row. */
    source?: string;
  },
): Promise<CapiResult> {
  const eventId = event.event_id || newEventId();
  const source = context?.source ?? "capi";

  if (!isConfigured()) {
    const result: CapiResult = {
      ok: false,
      error: "capi_not_configured",
      attempted: false,
      event_id: eventId,
    };
    await recordCapiAttempt({
      event_name: event.event_name,
      event_id: eventId,
      attempted: false,
      ok: false,
      status: undefined,
      error: result.error,
      source,
      timestamp: Date.now(),
    });
    return result;
  }

  const userData: Record<string, string | string[]> = {};
  if (event.email) userData.em = [sha256(event.email)];
  if (event.phone) userData.ph = [sha256(event.phone)];
  if (event.external_id) userData.external_id = [sha256(event.external_id)];

  // IP / UA
  let ip = event.client_ip || "";
  let ua = event.client_user_agent || "";
  if (context?.req) {
    if (!ip) {
      const fwd = context.req.headers.get("x-forwarded-for") || "";
      ip = fwd.split(",")[0].trim();
      if (!ip) ip = context.req.headers.get("x-real-ip") || "";
    }
    if (!ua) ua = context.req.headers.get("user-agent") || "";
  }
  if (ip) userData.client_ip_address = ip;
  if (ua) userData.client_user_agent = ua;
  if (event.fbp) userData.fbp = event.fbp;
  if (event.fbc) userData.fbc = event.fbc;

  const customData: Record<string, unknown> = { ...(event.custom_data ?? {}) };
  if (typeof event.value === "number") customData.value = event.value;
  if (event.currency) customData.currency = event.currency;
  if (event.content_ids?.length) customData.content_ids = event.content_ids;
  if (event.content_name) customData.content_name = event.content_name;
  if (event.content_type) customData.content_type = event.content_type;
  if (event.utm) customData.utm = event.utm;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: event.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
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

  let result: CapiResult;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const out = await r.json().catch(() => ({}));
    if (r.ok) {
      result = { ok: true, status: r.status, response: out, attempted: true, event_id: eventId };
    } else {
      result = {
        ok: false,
        status: r.status,
        response: out,
        error: "meta_capi_error",
        attempted: true,
        event_id: eventId,
      };
    }
  } catch (err) {
    result = {
      ok: false,
      error: "capi_request_failed",
      detail: String(err),
      attempted: true,
      event_id: eventId,
    };
  }

  await recordCapiAttempt({
    event_name: event.event_name,
    event_id: eventId,
    attempted: result.attempted,
    ok: result.ok,
    status: result.status,
    error: result.error,
    source,
    timestamp: Date.now(),
  });

  return result;
}
