/**
 * POST /api/lead
 *
 * Lead capture endpoint for lead magnet opt-ins (/free/[slug]).
 *
 * Flow:
 *   1. Validates email + honeypot
 *   2. Logs lead to revenue-ops backend (fire-and-forget)
 *   3. Fires Meta CAPI Lead event (server-side)
 *   4. Logs lead to FastAPI backend (fire-and-forget)
 *   5. Returns lead magnet asset path for immediate client-side delivery
 *
 * Backend integrations (all non-blocking):
 *   - Revenue Ops (Cloud Run)
 *   - Meta Conversions API (CAPI)
 *   - FastAPI services backend
 */

import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { fireCapi as fireCapiEvent } from "@/lib/capi-fire";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";
import { fetchWithTimeout } from "@/lib/proxy-utils";
import { recordLead } from "@/lib/income-ledger";
import { fulfillLeadMagnet } from "@/lib/fulfillment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Rate limit: 10 captures / 60s per IP
  const limit = rateLimit({
    key: clientKey(req, "lead"),
    max: 10,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return rateLimitResponse(limit);
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const {
    email,
    slug,
    website,  // honeypot
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    click_id,
    fbclid,
    igshid,
    ref,
    fbp,     // _fbp cookie
    fbc,     // _fbc cookie
  } = body;

  // Bot honeypot check — silently return success
  if (website) {
    const product = slug ? getProduct(slug) : null;
    return NextResponse.json({
      ok: true,
      assetPath: product?.leadMagnetPath ?? null,
      nextSlug: product?.nextSlug ?? "masterclass-starter",
    });
  }

  // Validate email
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const product = slug ? getProduct(slug) : null;

  // ── 1. Log lead to revenue-ops backend ─────────────────────────────────
  const autonomaxUrl = process.env.NEXT_PUBLIC_AUTONOMAX_API_URL;
  const apiKey = process.env.AUTONOMAX_API_KEY;
  if (autonomaxUrl && apiKey) {
    fetchWithTimeout(
      `${autonomaxUrl}/api/leads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          source: "aikagan-lead-form",
          slug: slug ?? null,
          name: body.name ?? null,
          company: body.company ?? null,
          interest: body.interest ?? null,
          message: body.message ?? null,
          idea: body.idea ?? null,
          niche: body.niche ?? null,
          project_stage: body.project_stage ?? null,
          desired_outcome: body.desired_outcome ?? null,
          constraints: body.constraints ?? null,
          utm_source: utm_source ?? null,
          utm_medium: utm_medium ?? null,
          utm_campaign: utm_campaign ?? null,
          utm_term: utm_term ?? null,
          utm_content: utm_content ?? null,
          click_id: click_id ?? null,
          fbclid: fbclid ?? null,
          igshid: igshid ?? null,
          ref: ref ?? null,
          timestamp: new Date().toISOString(),
        }),
      },
      5000,
    ).catch((err) => console.error("[lead] revenue-ops log failed:", err));
  }

  // ── 2. Log lead to FastAPI backend (non-blocking) ─────────────────────
  const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL;
  if (fastApiUrl) {
    fetchWithTimeout(
      `${fastApiUrl}/api/leads`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "aikagan-lead-form",
          slug: slug ?? null,
          name: body.name ?? null,
          company: body.company ?? null,
          interest: body.interest ?? null,
          message: body.message ?? null,
          idea: body.idea ?? null,
          niche: body.niche ?? null,
          project_stage: body.project_stage ?? null,
          desired_outcome: body.desired_outcome ?? null,
          constraints: body.constraints ?? null,
          utm_source: utm_source ?? null,
          utm_medium: utm_medium ?? null,
          utm_campaign: utm_campaign ?? null,
          timestamp: new Date().toISOString(),
        }),
      },
      5000,
    ).catch((err) => console.error("[lead] fastapi log failed:", err));
  }

  // ── 3. Fire Meta CAPI Lead event (server-side) ────────────────────────
  //     This ensures attribution survives iOS 14+ and ad-blockers.
  const fbpCookie = fbp || undefined;
  const fbcCookie = fbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  const capiRes = await fireCapiEvent(
    {
      event_name: "Lead",
      email,
      content_ids: slug ? [slug] : undefined,
      content_name: slug ?? undefined,
      fbp: fbpCookie,
      fbc: fbcCookie,
      utm: {
        ...(utm_source ? { utm_source } : {}),
        ...(utm_medium ? { utm_medium } : {}),
        ...(utm_campaign ? { utm_campaign } : {}),
      },
    },
    { req: { headers: req.headers }, source: "lead_capture" },
  );
  const capiFired = capiRes.ok || capiRes.attempted;

  // ── 3b. Persist to durable income ledger ──────────────────────────────
  try {
    await recordLead({
      email,
      slug: slug ?? "(none)",
      capturedAt: Date.now(),
      utm: {
        ...(utm_source ? { utm_source } : {}),
        ...(utm_medium ? { utm_medium } : {}),
        ...(utm_campaign ? { utm_campaign } : {}),
      },
      ref: typeof ref === "string" ? ref : null,
      capiFired,
    });
    // Pageview is recorded separately; not on the lead form
  } catch (err) {
    console.error("[lead] ledger write failed:", err);
  }

  // ── 3c. Fulfillment: send lead magnet delivery email (non-blocking) ─────
  if (product) {
    fulfillLeadMagnet({
      email,
      slug: slug ?? "",
      productName: product.name,
      assetPath: product.leadMagnetPath ?? "",
    });
  }

  // Log for evidence trail
  console.log(JSON.stringify({
    event: "lead_captured",
    email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    slug: slug ?? null,
    has_capi: Boolean(process.env.META_CAPI_ACCESS_TOKEN),
    timestamp: new Date().toISOString(),
  }));

  return NextResponse.json({
    ok: true,
    assetPath: product?.leadMagnetPath ?? null,
    nextSlug: product?.nextSlug ?? "masterclass-starter",
  });
}
