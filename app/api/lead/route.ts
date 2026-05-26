import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Lead Capture API Route
//
// Receives email opt-ins from lead magnet pages (/free/[slug]).
// Logs the lead and triggers attribution event via the revenue ops backend.
// Returns the lead magnet asset path for immediate client-side delivery.
// ─────────────────────────────────────────────────────────────────────────────

import { getProduct } from "@/lib/products";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const {
    email,
    slug,
    website,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    click_id,
    fbclid,
    igshid,
    ref,
  } = body;

  // Bot honeypot check - if filled out, silently ignore but return success
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

  // Fire-and-forget: log lead to autonomax revenue ops backend
  const autonomaxUrl = process.env.NEXT_PUBLIC_AUTONOMAX_API_URL;
  const apiKey = process.env.AUTONOMAX_API_KEY;
  if (autonomaxUrl && apiKey) {
    fetch(`${autonomaxUrl}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        source: "aikagan-lead-form",
        slug: slug ?? null,
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
    }).catch(() => {}); // non-blocking
  }

  console.log(JSON.stringify({
    event: "lead_captured",
    email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    slug: slug ?? null,
    timestamp: new Date().toISOString(),
  }));

  return NextResponse.json({
    ok: true,
    assetPath: product?.leadMagnetPath ?? null,
    nextSlug: product?.nextSlug ?? "masterclass-starter",
  });
}
