// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/paddle-fix
//
// Admin-only tool to fix Paddle configuration:
//   1. Activate the webhook (notification settings)
//   2. Configure default payment link for checkout
//
// Requires ADMIN_SECRET header.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getPaddleEnvironment } from "@/lib/paddle-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret") || req.nextUrl.searchParams.get("secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.PADDLE_API_KEY;
  const env = getPaddleEnvironment();
  const baseUrl = env === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";

  const results: Record<string, any> = {};
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  // 1. Activate webhook
  try {
    const whResp = await fetch(`${baseUrl}/notification-settings`, { headers });
    const whData = await whResp.json();
    const webhooks = whData.data || [];
    
    // Log raw webhook data for debugging
    results._raw_webhooks = webhooks.map((ns: any) => ({
      id: ns.id,
      description: ns.description,
      destination: ns.destination,
      type: ns.type,
      active: ns.active,
    }));

    // Find existing webhook by destination URL
    const webhook = webhooks.find(
      (ns: any) => ns.destination?.includes("aikagan.com") || ns.description?.includes("AIKAGAN")
    );

    if (webhook) {
      if (!webhook.active) {
        // Paddle PATCH requires the full notification setting object
        const activateResp = await fetch(`${baseUrl}/notification-settings/${webhook.id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            type: webhook.type || "webhook",
            destination: webhook.destination,
            description: webhook.description,
            active: true,
            subscribed_events: webhook.subscribed_events || ["transaction.completed", "transaction.payment_failed"],
          }),
        });
        const activateData = await activateResp.json();
        results.webhook = activateResp.ok
          ? "✅ Webhook activated"
          : `❌ PATCH failed: ${JSON.stringify(activateData)}`;
        results.webhook_id = webhook.id;
      } else {
        results.webhook = "✅ Webhook already active";
        results.webhook_id = webhook.id;
      }
    } else {
      // Create the webhook
      const createResp = await fetch(`${baseUrl}/notification-settings`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          type: "webhook",
          destination: "https://aikagan.com/api/webhooks/paddle",
          description: "AIKAGAN Webhook",
          subscribed_events: ["transaction.completed", "transaction.payment_failed"],
          active: true,
        }),
      });
      const createData = await createResp.json();
      results.webhook = createResp.ok
        ? "✅ Webhook created and activated"
        : `❌ Create failed: ${JSON.stringify(createData)}`;
      if (createResp.ok) {
        results.webhook_id = createData.data?.id;
      }
    }
  } catch (e: any) {
    results.webhook_error = e.message;
  }

  // 2. Configure default payment link via checkout settings
  try {
    // Paddle Billing API - checkout settings
    // First check what settings exist
    const settingsResp = await fetch(`${baseUrl}/checkout-settings`, {
      method: "GET",
      headers,
    });

    if (settingsResp.ok) {
      const settingsData = await settingsResp.json();
      const currentSettings = settingsData.data || settingsData;

      // Update default payment link
      const updateResp = await fetch(`${baseUrl}/checkout-settings`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          default_checkout_url: "https://aikagan.com/checkout-success",
          ...(currentSettings.id ? {} : {}),
        }),
      });

      if (updateResp.ok) {
        results.checkout_settings = "✅ Default payment link configured";
      } else {
        const errData = await updateResp.json().catch(() => ({}));
        // If checkout-settings endpoint doesn't exist, try alternative approach
        if (updateResp.status === 404) {
          results.checkout_settings = {
            note: "checkout-settings endpoint not available via API. Manual setup required.",
            manual_steps: [
              "1. Go to https://vendors.paddle.com",
              "2. Settings → Checkout → Default Payment Link",
              "3. Set to: https://aikagan.com/checkout-success",
              "4. Save",
            ],
          };
        } else {
          results.checkout_settings = `❌ ${JSON.stringify(errData)}`;
        }
      }
    } else {
      results.checkout_settings = {
        note: "checkout-settings endpoint not available via API. Manual setup required.",
        manual_steps: [
          "1. Go to https://vendors.paddle.com",
          "2. Settings → Checkout → Default Payment Link",
          "3. Set to: https://aikagan.com/checkout-success",
          "4. Save",
        ],
      };
    }
  } catch (e: any) {
    results.checkout_settings_error = e.message;
  }

  return NextResponse.json(results);
}
