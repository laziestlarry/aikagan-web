/**
 * POST /api/webhooks/paddle
 *
 * Paddle Billing webhook handler.
 *
 * Events processed:
 *   transaction.completed  → resolves buyer identity, issues download token,
 *                            writes the income ledger, queues fulfillment,
 *                            then marks the provider event complete.
 *
 * Reliability:
 *   - Provider retries remain retryable until the critical order path succeeds.
 *   - Duplicate completed events are ignored after successful processing.
 *   - Token issuance, ledger persistence, and fulfillment queueing are awaited
 *     before acknowledging transaction.completed.
 *   - Analytics/affiliate/FastAPI side effects remain non-critical.
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
import { hasProcessedEvent, markEventProcessed } from "@/lib/webhook-idempotency";
import { recordWebhookCommission } from "@/lib/commissions";
import { recordTransaction, getCommissionRate } from "@/lib/income-ledger";
import { fulfillPurchase } from "@/lib/fulfillment";

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Log a completed purchase to the FastAPI backend (non-critical). */
async function logPurchaseToFastAPI(
  transactionId: string,
  slug: string,
  email: string,
  value: number,
  refCode: string | null,
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
    // Non-critical telemetry path.
  }
}

function parseAmountUsd(data: any): number {
  const raw =
    data.details?.totals?.grand_total ??
    data.details?.line_items?.[0]?.totals?.total ??
    data.details?.line_items?.[0]?.unit_price?.amount ??
    "0";
  const cents = Number.parseInt(String(raw), 10);
  return Number.isFinite(cents) ? cents / 100 : 0;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("p-pl") ?? "";

  if (!signature) {
    console.warn("[paddle-webhook] Missing p-pl header");
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

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

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType: string = event.event_type ?? "";
  const eventId: string = event.event_id ?? "";
  const transactionId: string = event.data?.id ?? "";

  console.log(JSON.stringify({
    event: "paddle_webhook_received",
    event_type: eventType,
    event_id: eventId,
    transaction_id: transactionId,
    timestamp: new Date().toISOString(),
  }));

  // Read-only duplicate check. Do not consume Paddle's retry until the critical
  // transaction path has completed successfully.
  if (await hasProcessedEvent("paddle", eventId)) {
    console.log(JSON.stringify({
      event: "paddle_webhook_dedup",
      event_id: eventId,
      transaction_id: transactionId,
    }));
    return NextResponse.json({ ok: true, dedup: true });
  }

  const paddle = getPaddleClient();
  const isSandbox = getPaddleEnvironment() !== "production";

  if (eventType !== "transaction.completed") {
    await markEventProcessed("paddle", eventId);
    return NextResponse.json({ ok: true, ignored: eventType || "unknown" });
  }

  const data = event.data ?? {};
  const customData = data.custom_data ?? {};
  const slug: string | undefined = customData.product_slug;
  const refCode: string | null = customData.ref_code || null;

  if (!transactionId || !slug) {
    console.error("[paddle-webhook] Missing transaction ID or product slug", { transactionId, slug });
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const product = getProduct(slug);
  if (!product) {
    console.error(`[paddle-webhook] Unknown product: ${slug}`);
    return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 400 });
  }

  // Paddle transaction webhooks normally carry customer_id, not an embedded
  // customer email. Resolve the customer through Paddle before fulfillment.
  let email: string = data.customer?.email ?? "";
  let customerName: string = data.customer?.name ?? "";
  const customerId: string | undefined = data.customer_id ?? data.customer?.id;

  if ((!email || !customerName) && paddle && customerId) {
    try {
      const customer = await paddle.customers.get(customerId);
      email = email || customer?.email || "";
      customerName = customerName || customer?.name || "";
    } catch (err) {
      console.error("[paddle-webhook] Failed to resolve Paddle customer", String(err));
      // Return 5xx so Paddle retries rather than acknowledging an order that
      // cannot yet be delivered to a verified buyer address.
      return NextResponse.json({ error: "Customer resolution failed" }, { status: 503 });
    }
  }

  if (!email || !email.includes("@")) {
    console.error("[paddle-webhook] Missing valid buyer email", { transactionId, customerId });
    return NextResponse.json({ error: "Buyer email unavailable" }, { status: 503 });
  }

  if (!customerName) customerName = email.split("@")[0] || "Valued Customer";
  const value = parseAmountUsd(data);

  // 1) Issue customer access token.
  const token = generateDownloadToken(slug, transactionId, email);
  try {
    await tokenStore.set(transactionId, {
      token,
      slug,
      email,
      exp: Date.now() + 48 * 60 * 60 * 1000,
    });
  } catch (err) {
    console.error("[paddle-webhook] token store failed:", err);
    return NextResponse.json({ error: "Access issuance failed" }, { status: 503 });
  }

  console.log(JSON.stringify({
    event: "paddle_webhook_token_issued",
    transactionId,
    slug,
    email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    ref: refCode,
    sandbox: isSandbox,
  }));

  // 2) Analytics is useful but never allowed to block delivery.
  let capiFired = false;
  if (!isSandbox) {
    try {
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
    } catch (err) {
      console.warn("[paddle-webhook] CAPI failed non-critically:", String(err));
    }
  }

  // 3) Ledger evidence is critical. Never acknowledge a completed payment if
  // the order cannot be written to the revenue source of truth.
  const commission = refCode ? (value * getCommissionRate(slug)) / 100 : 0;
  try {
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
    return NextResponse.json({ error: "Ledger persistence failed" }, { status: 503 });
  }

  // 4) Fulfillment is critical. Await it so the retryable queue is created
  // before the webhook is acknowledged.
  try {
    await fulfillPurchase({
      orderId: transactionId,
      provider: "paddle",
      email,
      name: customerName,
      productName: product.name,
      productSlug: slug,
      value,
      downloadUrl: `${SITE_URL}/checkout-success?transaction_id=${transactionId}`,
    });
  } catch (err) {
    console.error("[paddle-webhook] fulfillment failed:", err);
    return NextResponse.json({ error: "Fulfillment queue failed" }, { status: 503 });
  }

  // Non-critical post-commit effects.
  if (refCode) {
    try {
      recordWebhookCommission({
        refCode,
        orderId: transactionId,
        productSlug: slug,
        amount: value,
        provider: "paddle",
      });
    } catch (err) {
      console.warn("[paddle-webhook] commission side effect failed:", String(err));
    }
  }
  void logPurchaseToFastAPI(transactionId, slug, email, value, refCode);

  // Mark complete only after access, ledger, and fulfillment are committed.
  await markEventProcessed("paddle", eventId);

  console.log(JSON.stringify({
    event: "paddle_webhook_committed",
    event_id: eventId,
    transaction_id: transactionId,
    slug,
    value,
    sandbox: isSandbox,
  }));

  return NextResponse.json({ ok: true });
}
