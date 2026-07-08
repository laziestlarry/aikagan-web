/**
 * POST /api/webhooks/paddle
 *
 * Paddle Billing webhook handler.
 *
 * Events processed:
 *   transaction.completed  → issues download token, fires CAPI Purchase,
 *                            records affiliate commission, logs to FastAPI
 *
 * Reliability:
 *   - Idempotency: skips duplicate event_id (Paddle retries on non-2xx)
 *   - Webhook receipt audit log
 *   - All side effects are non-blocking except token issuance
 *
 * Configure in Paddle Dashboard → Developer Tools → Webhooks:
 *   Endpoint URL: https://aikagan.com/api/webhooks/paddle
 *   Events:       transaction.completed (and optionally transaction.paid)
 *   Secret key:   psk_...
 */

import { NextRequest, NextResponse } from "next/server";
import { WebhooksValidator } from "@paddle/paddle-node-sdk";
import { generateDownloadToken } from "@/lib/download-token";
import { getProduct } from "@/lib/products";
import { tokenStore } from "@/lib/token-store";
import { fireCapi as fireCapiEvent } from "@/lib/capi-fire";
import { getPaddleClient, getPaddleEnvironment } from "@/lib/paddle-client";
import { markEventIfNew } from "@/lib/webhook-idempotency";
import { recordWebhookCommission } from "@/lib/commissions";
import { recordTransaction, getCommissionRate } from "@/lib/income-ledger";
import { fulfillPurchase } from "@/lib/fulfillment";

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Log a completed purchase to the FastAPI backend (non-blocking).
 */
async function logPurchaseToFastAPI(
  transactionId: string,
  slug: string,
  email: string,
  value: number,
  refCode: string | null
) {
  const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL;
  if (!fastApiUrl) return;
  try {
    await fetch(`${fastApiUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: "paddle_webhook",
        slug,
        transaction_id: transactionId,
        value,
        ref_code: refCode,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Non-blocking
  }
}

export async function POST(req: NextRequest) {
  // ── 1. Read raw body ──────────────────────────────────────────────────
  const rawBody = await req.text();

  // ── 2. Extract Paddle signature header ────────────────────────────────
  const signature = req.headers.get("p-pl") ?? "";

  if (!signature) {
    console.warn("[paddle-webhook] Missing p-pl header");
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // ── 3. Validate signature ─────────────────────────────────────────────
  let isValid = false;
  try {
    const validator = new WebhooksValidator();
    isValid = await validator.isValidSignature(rawBody, PADDLE_WEBHOOK_SECRET, signature);
  } catch (err: any) {
    console.error("[paddle-webhook] Signature validation threw:", err.message);
    return NextResponse.json({ error: "Validation error" }, { status: 500 });
  }

  if (!isValid) {
    console.warn("[paddle-webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // ── 4. Parse event ───────────────────────────────────────────────────
  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType: string = event.event_type ?? "";
  const eventId: string = event.event_id ?? "";
  const transactionId: string = event.data?.id ?? "";

  // Log receipt for audit trail
  console.log(JSON.stringify({
    event: "paddle_webhook_received",
    event_type: eventType,
    event_id: eventId,
    transaction_id: transactionId,
    timestamp: new Date().toISOString(),
  }));

  // ── 5. Idempotency check (skip if event already processed) ────────────
  const isNew = await markEventIfNew("paddle", eventId);
  if (!isNew) {
    console.log(JSON.stringify({
      event: "paddle_webhook_dedup",
      event_id: eventId,
      transaction_id: transactionId,
    }));
    return NextResponse.json({ ok: true, dedup: true });
  }

  // ── 6. Handle transaction.completed ──────────────────────────────────
  const paddle = getPaddleClient();
  const isSandbox = getPaddleEnvironment() !== "production";

  if (eventType === "transaction.completed") {
    const data = event.data ?? {};
    const customData = data.custom_data ?? {};
    const slug: string | undefined = customData.product_slug;
    const refCode: string | null = customData.ref_code || null;
    const email: string = data.customer?.email ?? "unknown@checkout";
    const customerName: string = data.customer?.name ?? email.split("@")[0] ?? "Valued Customer";
    const value: number =
      (data.details?.line_items?.[0]?.unit_price?.amount
        ? parseInt(data.details.line_items[0].unit_price.amount) / 100
        : 0);

    if (!transactionId || !slug) {
      console.error("[paddle-webhook] Missing transaction ID or product slug", { transactionId, slug });
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const product = getProduct(slug);
    if (!product) {
      console.error(`[paddle-webhook] Unknown product: ${slug}`);
      return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 400 });
    }

    // ── 6a. Generate download token ────────────────────────────────────
    const token = generateDownloadToken(slug, transactionId, email);

    // Store in persistent token store
    await tokenStore.set(transactionId, {
      token,
      slug,
      email,
      exp: Date.now() + 48 * 60 * 60 * 1000,
    });

    console.log(JSON.stringify({
      event: "paddle_webhook_token_issued",
      transactionId,
      slug,
      email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
      ref: refCode,
      sandbox: isSandbox,
    }));

    // ── 6b. Fire CAPI Purchase event (non-blocking) ────────────────────
    let capiFired = false;
    if (!isSandbox) {
      const capiRes = await fireCapiEvent(
        {
          event_name: "Purchase",
          event_id: transactionId,
          email,
          value,
          currency: "USD",
          content_ids: [slug],
          content_name: product.name,
          utm: { product_slug: slug, ref_code: refCode ?? "" },
        },
        { req: { headers: req.headers }, source: "paddle_webhook" },
      );
      capiFired = capiRes.ok || capiRes.attempted;
    }

    // ── 6b-extra. Persist to durable income ledger (zero-gap evidence) ──
    try {
      const commission = refCode
        ? (value * getCommissionRate(slug)) / 100
        : 0;
      await recordTransaction({
        orderId: transactionId,
        provider: "paddle",
        slug,
        email,
        value,
        currency: "USD",
        refCode: refCode ?? null,
        utm: { product_slug: slug },
        capturedAt: Date.now(),
        eventId,
        commission,
        capiFired,
      });
    } catch (err) {
      console.error("[paddle-webhook] ledger write failed:", err);
    }

    // ── 6c. Record affiliate commission (non-blocking) ─────────────────
    if (refCode) {
      recordWebhookCommission({
        refCode,
        orderId: transactionId,
        productSlug: slug,
        amount: value,
        provider: "paddle",
      });
    }

    // ── 6d. Fulfillment: send confirmation email + social proof (non-blocking) ─
    fulfillPurchase({
      orderId: transactionId,
      provider: "paddle",
      email,
      name: customerName,
      productName: product.name,
      productSlug: slug,
      value,
      downloadUrl: `${SITE_URL}/checkout-success?transaction_id=${transactionId}`,
    });

    // ── 6e. Log purchase to FastAPI backend (non-blocking) ──────────────
    logPurchaseToFastAPI(transactionId, slug, email, value, refCode);

    return NextResponse.json({ ok: true });
  }

  // Acknowledge other event types silently
  return NextResponse.json({ ok: true });
}
