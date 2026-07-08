// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/paddle-brand
//
// Configures Paddle checkout brand settings: logo, colors, business profile.
// Also attempts to set the default payment link.
//
// Requires ADMIN_SECRET header.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getPaddleEnvironment } from "@/lib/paddle-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BRAND = {
  name: "AIKAGAN",
  tagline: "Autonomous AI agents for modern business",
  colors: {
    primary: "#D4AF37",      // gold — our accent
    secondary: "#0B0F19",    // dark background
    text: "#F8FAFC",         // white text
    background: "#08080A",   // page background
    button: "#D4AF37",       // CTA buttons gold
    button_text: "#000000",  // black text on gold
  },
  checkout_url: "https://aikagan.com/checkout-success",
  logo_url: "https://aikagan.com/favicon.svg",
};

export async function GET(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret") || req.nextUrl.searchParams.get("secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const env = getPaddleEnvironment();
  const apiKey = process.env.PADDLE_API_KEY;
  const baseUrl = env === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };

  const results: Record<string, any> = {
    environment: env,
    proposed_brand: BRAND,
  };

  // 1. Check current brand settings
  try {
    const resp = await fetch(`${baseUrl}/brand`, { headers });
    if (resp.ok) {
      const data = await resp.json();
      results.current_brand = data.data || data;
    } else {
      results.brand_error = `GET /brand → HTTP ${resp.status}`;
    }
  } catch (e: any) {
    results.brand_error = e.message;
  }

  // 2. Check current business settings
  try {
    const resp = await fetch(`${baseUrl}/business`, { headers });
    if (resp.ok) {
      const data = await resp.json();
      results.current_business = data.data || data;
    } else {
      results.business_error = `GET /business → HTTP ${resp.status}`;
    }
  } catch (e: any) {
    results.business_error = e.message;
  }

  // 3. Check notification/webhook settings
  try {
    const resp = await fetch(`${baseUrl}/notification-settings`, { headers });
    if (resp.ok) {
      const data = await resp.json();
      results.webhooks = (data.data || []).map((ns: any) => ({
        id: ns.id,
        destination: ns.destination,
        description: ns.description,
        active: ns.active,
      }));
    }
  } catch (e: any) {
    results.webhooks_error = e.message;
  }

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret") || req.nextUrl.searchParams.get("secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const env = getPaddleEnvironment();
  const apiKey = process.env.PADDLE_API_KEY;
  const baseUrl = env === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const body = await req.json().catch(() => ({}));

  const results: Record<string, any> = { environment: env };

  // 1. Update brand settings (colors, logo URL)
  if (body.apply_brand !== false) {
    try {
      const brandPayload: any = {
        name: BRAND.name,
        settings: {
          colors: {
            primary: BRAND.colors.primary,
            background: BRAND.colors.background,
            text: BRAND.colors.text,
            button: BRAND.colors.button,
            button_text: BRAND.colors.button_text,
          },
          logo_url: BRAND.logo_url,
          checkout: {
            default_checkout_url: BRAND.checkout_url,
          },
        },
      };

      const resp = await fetch(`${baseUrl}/brand`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(brandPayload),
      });

      if (resp.ok) {
        const data = await resp.json();
        results.brand = { status: "✅ Brand settings applied", data: data.data || data };
      } else {
        const errText = await resp.text().catch(() => "unknown");
        results.brand = { status: `❌ HTTP ${resp.status}`, detail: errText.substring(0, 400) };
      }
    } catch (e: any) {
      results.brand_error = e.message;
    }
  }

  // 2. Update business info
  if (body.apply_business !== false) {
    try {
      const bizPayload = {
        name: BRAND.name,
        about: BRAND.tagline,
        support_email: "support@aikagan.com",
        support_phone: null,
      };

      const resp = await fetch(`${baseUrl}/business`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(bizPayload),
      });

      if (resp.ok) {
        const data = await resp.json();
        results.business = { status: "✅ Business info updated", data: data.data || data };
      } else {
        const errText = await resp.text().catch(() => "unknown");
        results.business = { status: `❌ HTTP ${resp.status}`, detail: errText.substring(0, 400) };
      }
    } catch (e: any) {
      results.business_error = e.message;
    }
  }

  // 3. Try setting default payment link (Dashboard setting or API)
  if (body.apply_checkout !== false) {
    try {
      // Try the checkout-settings endpoint first
      const checkoutPayload = {
        default_checkout_url: BRAND.checkout_url,
        allowed_origins: ["https://aikagan.com", "https://www.aikagan.com"],
      };

      const resp = await fetch(`${baseUrl}/checkout-settings`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(checkoutPayload),
      });

      if (resp.ok) {
        const data = await resp.json();
        results.checkout = { status: "✅ Checkout settings applied", data: data.data || data };
      } else {
        const errText = await resp.text().catch(() => "unknown");
        results.checkout = { status: `⚠️ API not available`, detail: errText.substring(0, 400) };
        results.checkout_manual = [
          "Set the Default Payment Link in Paddle Dashboard:",
          "1. Go to https://vendors.paddle.com",
          "2. Settings → Checkout → Default Payment Link",
          `3. Set to: ${BRAND.checkout_url}`,
          "4. Save",
        ];
      }
    } catch (e: any) {
      results.checkout_error = e.message;
    }
  }

  // 4. Summary of what was done
  results.brand_profile = BRAND;

  return NextResponse.json(results);
}
