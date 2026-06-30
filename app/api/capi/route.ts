/**
 * AIKAGAN — Meta Conversions API (CAPI) forwarder
 *
 * Server-side mirror of the Pixel events fired in the browser. iOS 14+ and
 * privacy-focused browsers eat browser-side events; CAPI keeps attribution
 * intact end-to-end.
 *
 * Call from:
 *   - /api/lead handler          → event_name: "Lead"
 *   - /api/webhooks/lemonsqueezy → event_name: "Purchase" (with value)
 *   - Marketing Commander archive POSTs (optional) → "ViewContent"
 *
 * Required env (set in Vercel project settings):
 *   META_PIXEL_ID                 — numeric Pixel ID
 *   META_CAPI_ACCESS_TOKEN        — long-lived token from Events Manager
 *   META_PIXEL_TEST_EVENT_CODE    — optional; only set when validating
 */
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PIXEL_ID = process.env.META_PIXEL_ID || "";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
const TEST_EVENT_CODE = process.env.META_PIXEL_TEST_EVENT_CODE || "";
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v20.0";
const SHARED_SECRET = process.env.AIKAGAN_CAPI_SHARED_SECRET || "";

type CapiInput = {
  event_name: "Lead" | "Purchase" | "ViewContent" | "InitiateCheckout";
  event_id?: string;        // dedupe with the Pixel-side event
  event_source_url?: string;
  email?: string | null;
  phone?: string | null;
  external_id?: string | null;
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  client_ip?: string;
  client_user_agent?: string;
  fbp?: string;             // _fbp cookie
  fbc?: string;             // _fbc cookie
  utm?: Record<string, string>;
};

const sha256 = (s: string) =>
  createHash("sha256").update(s.trim().toLowerCase()).digest("hex");

function safeJsonParse<T>(req: NextRequest): Promise<T | null> {
  return req.json().catch(() => null);
}

export async function POST(req: NextRequest) {
  // Lightweight shared-secret guard so random callers can't pump our Pixel.
  if (SHARED_SECRET) {
    const provided = req.headers.get("x-aikagan-capi-secret") || "";
    if (provided !== SHARED_SECRET) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "CAPI not configured (META_PIXEL_ID or META_CAPI_ACCESS_TOKEN missing)" },
      { status: 503 },
    );
  }

  const input = await safeJsonParse<CapiInput>(req);
  if (!input || !input.event_name) {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  const userData: Record<string, string | string[]> = {};
  if (input.email) userData.em = [sha256(input.email)];
  if (input.phone) userData.ph = [sha256(input.phone)];
  if (input.external_id) userData.external_id = [sha256(input.external_id)];
  const ipHeader = req.headers.get("x-forwarded-for") || "";
  const ip = input.client_ip || ipHeader.split(",")[0].trim();
  if (ip) userData.client_ip_address = ip;
  const ua = input.client_user_agent || req.headers.get("user-agent") || "";
  if (ua) userData.client_user_agent = ua;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const customData: Record<string, unknown> = {};
  if (typeof input.value === "number") customData.value = input.value;
  if (input.currency) customData.currency = input.currency;
  if (input.content_ids?.length) customData.content_ids = input.content_ids;
  if (input.content_name) customData.content_name = input.content_name;
  if (input.utm) customData.utm = input.utm;

  const event = {
    event_name: input.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.event_id,
    event_source_url: input.event_source_url,
    action_source: "website",
    user_data: userData,
    custom_data: customData,
  };

  const body: Record<string, unknown> = { data: [event] };
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
      return NextResponse.json(
        { error: "meta_capi_error", status: r.status, response: out },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, meta: out });
  } catch (err) {
    return NextResponse.json(
      { error: "meta_capi_request_failed", detail: String(err) },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(PIXEL_ID && ACCESS_TOKEN),
    test_mode: Boolean(TEST_EVENT_CODE),
  });
}
