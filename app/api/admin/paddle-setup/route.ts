// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/paddle-setup
//
// Admin-only diagnostic & fix tool for Paddle checkout configuration.
// Helps resolve "Default Payment Link not defined" error.
//
// Requires ADMIN_SECRET header to prevent abuse.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getPaddleEnvironment } from "@/lib/paddle-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret") || req.nextUrl.searchParams.get("secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized — provide ADMIN_SECRET via x-admin-secret header or ?secret=" }, { status: 401 });
  }

  const env = getPaddleEnvironment();
  const results: Record<string, any> = {
    environment: env,
    api_base: env === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com",
    checks: {},
  };

  const apiKey = process.env.PADDLE_API_KEY;
  const baseUrl = env === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";

  // 1. Check API key prefix to confirm environment
  results.key_type = apiKey?.startsWith("pdl_live_") ? "production" : "sandbox";
  results.env_match = results.key_type === env;

  // 2. Try to get account info via direct API
  try {
    const resp = await fetch(`${baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (resp.ok) {
      const data = await resp.json();
      results.account = data.data;
    } else {
      const text = await resp.text().catch(() => "unknown");
      results.account_error = `HTTP ${resp.status}: ${text.substring(0, 200)}`;
    }
  } catch (e: any) {
    results.account_error = e.message;
  }

  // 3. Check notification settings (webhooks)
  try {
    const resp = await fetch(`${baseUrl}/notification-settings`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (resp.ok) {
      const data = await resp.json();
      results.webhooks = (data.data || []).map((ns: any) => ({
        id: ns.id,
        endpoint: ns.endpoint,
        description: ns.description,
        active: ns.active_status === "active",
        events: ns.subscribed_events,
      }));
    } else {
      results.webhooks_error = `HTTP ${resp.status}`;
    }
  } catch (e: any) {
    results.webhooks_error = e.message;
  }

  // 4. Try a minimal transaction to check checkout settings
  try {
    const txResp = await fetch(`${baseUrl}/transactions`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{
          quantity: 1,
          price: {
            description: "Diagnostic test — will not be charged",
            name: "Diagnostic",
            unit_price: { amount: "1", currency_code: "USD" },
            product: {
              name: "Diagnostic Product",
              tax_category: "digital-goods",
              description: "Temporary product for checkout settings test",
            },
          },
        }],
        custom_data: { diagnostic: "true" },
      }),
    });

    const txData = await txResp.json();
    if (txResp.ok && txData?.data?.id) {
      results.checkout_test = "✅ PASSED — checkout settings are configured";
      results.transaction_id = txData.data.id;
      results.checkout_url = txData.data?.checkout?.url;
    } else {
      results.checkout_test = txData;
    }
  } catch (e: any) {
    results.checkout_error = e.message;
  }

  // 5. Provide fix instructions if checkout failed
  if (results.checkout_test?.error) {
    const dashboard = env === "production"
      ? "https://vendors.paddle.com"
      : "https://sandbox-vendors.paddle.com";

    results.fix_instructions = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  PADDLE SETUP — 2 MINUTE FIX",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      `1. Open: ${dashboard}`,
      "   (Log in with your Paddle account)",
      "",
      "2. Navigate to:",
      "   Settings → Checkout → Default Payment Link",
      "",
      "3. Set to:",
      "   https://aikagan.com/checkout-success",
      "",
      "4. Click Save",
      "",
      "5. Verify: after saving, run:",
      "   curl -s 'https://aikagan.com/api/admin/paddle-setup",
      `     ?secret=${adminSecret.substring(0, 8)}...'`,
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ];
  }

  return NextResponse.json(results);
}
