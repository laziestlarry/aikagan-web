// ─────────────────────────────────────────────────────────────────────────────
// POST /api/webhooks/paddle
//
// Paddle Billing webhook handler.
// Listens for transaction.completed events and issues download tokens.
//
// Configure in Paddle Dashboard → Developer Tools → Webhooks:
//   Endpoint URL: https://aikagan.com/api/webhooks/paddle
//   Events:       transaction.completed (and optionally transaction.paid)
//   Secret key:   psk_...
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { WebhooksValidator } from "@paddle/paddle-node-sdk";
import { generateDownloadToken } from "@/lib/download-token";
import { getProduct } from "@/lib/products";
import { tokenStore } from "@/lib/token-store";

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
  // 1. Read raw body as text (required for signature validation)
  const rawBody = await req.text();

  // 2. Extract the Paddle signature header
  const signature = req.headers.get("p-pl") ?? "";

  if (!signature) {
    console.warn("⚠️ Paddle webhook: missing p-pl header");
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // 3. Validate signature
  let isValid = false;
  try {
    const validator = new WebhooksValidator();
    isValid = await validator.isValidSignature(rawBody, PADDLE_WEBHOOK_SECRET, signature);
  } catch (err: any) {
    console.error("❌ Paddle webhook signature validation threw:", err.message);
    return NextResponse.json({ error: "Validation error" }, { status: 500 });
  }

  if (!isValid) {
    console.warn("⚠️ Paddle webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 4. Parse the event payload
  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType: string = event.event_type ?? "";

  // 5. Handle transaction.completed
  if (eventType === "transaction.completed") {
    const data = event.data ?? {};
    const transactionId: string = data.id ?? "";
    const customData = data.custom_data ?? {};
    const slug: string | undefined = customData.product_slug;

    // Extract customer email
    const email: string = data.customer?.email ?? "unknown@checkout";

    if (!transactionId || !slug) {
      console.error("❌ Paddle webhook: missing transaction ID or product slug", {
        transactionId,
        slug,
      });
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const product = getProduct(slug);
    if (!product) {
      console.error(`❌ Paddle webhook: unknown product: ${slug}`);
      return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 400 });
    }

    // Generate download token
    const token = generateDownloadToken(slug, transactionId, email);

    // Store in shared token store (keyed by transaction ID)
    tokenStore.set(transactionId, {
      token,
      slug,
      email,
      exp: Date.now() + 48 * 60 * 60 * 1000,
    });

    console.log("✅ Paddle webhook — token issued:", {
      transactionId,
      slug,
      email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    });

    // Return 200 to acknowledge the webhook
    return NextResponse.json({ ok: true });
  }

  // Acknowledge other event types silently
  return NextResponse.json({ ok: true });
}
