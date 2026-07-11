/**
 * AIKAGAN — Fulfillment Engine
 *
 * Transactional email + social proof delivery for purchases and lead magnets.
 *
 * Three-layer delivery:
 *   1. Make.com Purchase Webhook → Outlook SMTP sends download link email
 *   2. Make.com Lead Magnet Webhook → Outlook SMTP sends free gift email
 *   3. KV queue fallback for durability + retry via /api/cron/process-emails
 *
 * Neither path blocks the webhook response.
 */

import { kvSet, kvGet, kvDel, kvExpire, kvScan } from "./kv";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PurchaseFulfillment {
  type: "purchase_confirmation";
  orderId: string;
  provider: "paddle" | "lemonsqueezy" | "gumroad" | "shopier" | "manual";
  email: string;
  name: string;
  productName: string;
  productSlug: string;
  value: number;
  downloadUrl: string;
  capturedAt: number;
}

export interface LeadMagnetFulfillment {
  type: "lead_magnet_delivery";
  email: string;
  slug: string;
  productName: string;
  assetPath: string;
  capturedAt: number;
}

export type FulfillmentJob = PurchaseFulfillment | LeadMagnetFulfillment;

// ─── Make.com webhook URLs ──────────────────────────────────────────────────

const PURCHASE_WEBHOOK = process.env.MAKE_PURCHASE_WEBHOOK_URL || "";
const LEAD_MAGNET_WEBHOOK = process.env.MAKE_LEAD_MAGNET_WEBHOOK_URL || "";
const OMNI_WEBHOOK = process.env.MAKE_OMNICHANNEL_WEBHOOK_URL || "";
const CS_WEBHOOK = process.env.MAKE_CUSTOMER_SERVICE_WEBHOOK_URL || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Send a purchase confirmation email and broadcast social proof.
 * Called from webhook handlers (Paddle, LemonSqueezy, manual) after
 * the transaction is recorded in the income ledger.
 */
export async function fulfillPurchase(
  params: Omit<PurchaseFulfillment, "type" | "capturedAt">,
): Promise<void> {
  const job: PurchaseFulfillment = {
    ...params,
    type: "purchase_confirmation",
    capturedAt: Date.now(),
  };

  // Path 1: Make.com purchase webhook → Outlook SMTP email
  await Promise.allSettled([
    postToMake(PURCHASE_WEBHOOK, {
      email: job.email,
      name: job.name || "Valued Customer",
      download_url: job.downloadUrl,
      product: job.productName,
      order_id: job.orderId,
    }),
    // Also try the customer-service webhook (if full scenario is built)
    postToMake(CS_WEBHOOK, buildCSPurchasePayload(job)),
    // Social proof broadcast
    postToMake(OMNI_WEBHOOK, buildSocialProofPayload(job)),
  ]);

  // Path 2: KV queue (durable fallback)
  await queueJob(job);
}

/**
 * Send a lead magnet delivery email.
 * Called from /api/lead after lead capture.
 */
export async function fulfillLeadMagnet(
  params: Omit<LeadMagnetFulfillment, "type" | "capturedAt">,
): Promise<void> {
  const job: LeadMagnetFulfillment = {
    ...params,
    type: "lead_magnet_delivery",
    capturedAt: Date.now(),
  };

  // Path 1: Make.com lead magnet webhook → Outlook SMTP email
  const assetUrl = job.assetPath.startsWith("http")
    ? job.assetPath
    : `${SITE_URL}${job.assetPath}`;

  await Promise.allSettled([
    postToMake(LEAD_MAGNET_WEBHOOK, {
      email: job.email,
      subject: `Your free ${job.productName} is ready — AutonomaX`,
      body: [
        `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:20px;">`,
        `<h2 style="color:#D4AF37;">Your Free ${job.productName}</h2>`,
        `<p>Thanks for grabbing your free ${job.productName}!</p>`,
        `<p><a href="${assetUrl}" style="display:inline-block;background:#D4AF37;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Download Now</a></p>`,
        `<p style="color:#666;font-size:12px;">Link expires in 7 days. If the button doesn't work, copy and paste this URL: ${assetUrl}</p>`,
        `<hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>`,
        `<p style="color:#999;font-size:12px;">Want the full system? <a href="${SITE_URL}/products/masterclass-starter" style="color:#D4AF37;">Check out AutonomaX Masterclass →</a></p>`,
        `</div>`,
      ].join("\n"),
      product: job.productName,
      slug: job.slug,
    }),
    postToMake(CS_WEBHOOK, buildCSLeadPayload(job, assetUrl)),
  ]);

  // Path 2: KV queue (durable fallback)
  await queueJob(job);
}

// ─── Payload builders ───────────────────────────────────────────────────────

function buildCSPurchasePayload(job: PurchaseFulfillment): Record<string, unknown> {
  return {
    type: "purchase_confirmation",
    to: job.email,
    reply_email_address: job.email,
    reply_from: "hello@aikagan.com",
    subject: `Your ${job.productName} download is ready — AutonomaX`,
    ai_generated_reply: [
      `Hi ${job.name || "there"},`,
      ``,
      `Thank you for your purchase of ${job.productName}!`,
      `Order: ${job.orderId}`,
      `Amount: $${job.value.toFixed(2)} USD`,
      ``,
      `Your secure download link (valid 48 hours):`,
      `${job.downloadUrl}`,
      ``,
      `Questions? Reply to this email or contact hello@aikagan.com`,
      ``,
      `— AutonomaX Team`,
    ].join("\n"),
    objection_category: "purchase",
    recommended_offer_tier: "none",
  };
}

function buildCSLeadPayload(job: LeadMagnetFulfillment, assetUrl: string): Record<string, unknown> {
  return {
    type: "lead_magnet_delivery",
    to: job.email,
    reply_email_address: job.email,
    reply_from: "hello@aikagan.com",
    subject: `Your free ${job.productName} is ready — AutonomaX`,
    ai_generated_reply: [
      `Here is your free ${job.productName}!`,
      ``,
      `Download: ${assetUrl}`,
      ``,
      `If the link doesn't work, copy and paste it into your browser.`,
      ``,
      `Want to go deeper? Check out the full AutonomaX Masterclass:`,
      `${SITE_URL}/products/masterclass-starter`,
      ``,
      `— AutonomaX Team`,
    ].join("\n"),
    objection_category: "lead_magnet",
    recommended_offer_tier: "free",
  };
}

function buildSocialProofPayload(job: PurchaseFulfillment): Record<string, unknown> {
  return {
    event: "purchase",
    campaign: "aikagan-genesis",
    generated_at_utc: new Date(job.capturedAt).toISOString(),
    site_url: SITE_URL,
    product: job.productName,
    product_slug: job.productSlug,
    value: job.value,
    order_id: job.orderId,
    provider: job.provider,
    customer_email: job.email.replace(/(.{2}).*(@.*)/, "$1***$2"),
  };
}

// ─── HTTP helper ────────────────────────────────────────────────────────────

async function postToMake(
  url: string,
  payload: Record<string, unknown>,
): Promise<void> {
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.warn(
        `[fulfillment] Make webhook returned ${res.status} for ${url.slice(0, 50)}...`,
      );
    } else {
      console.log("[fulfillment] Make webhook POST succeeded for", url.slice(0, 50));
    }
  } catch (err) {
    console.warn("[fulfillment] Make webhook POST failed:", (err as Error).message);
  }
}

// ─── KV queue (durable fallback) ────────────────────────────────────────────

const QUEUE_TTL_S = 30 * 24 * 60 * 60; // 30 days

async function queueJob(job: FulfillmentJob): Promise<void> {
  const key = `email:queue:pending:${job.type}:${job.capturedAt}.${Math.random().toString(36).slice(2, 6)}`;
  await kvSet(key, job, QUEUE_TTL_S).catch((err: Error) =>
    console.warn("[fulfillment] KV queue write failed:", err.message),
  );
}

// ─── Queue processor (for cron) ─────────────────────────────────────────────

export async function drainFulfillmentQueue(): Promise<number> {
  const keys = await kvScan("email:queue:pending:*", 20).catch(() => [] as string[]);
  let processed = 0;

  for (const key of keys) {
    try {
      const job = await kvGet<FulfillmentJob>(key);
      if (!job) continue;

      if (job.type === "purchase_confirmation") {
        await Promise.allSettled([
          postToMake(PURCHASE_WEBHOOK, {
            email: job.email,
            name: job.name || "Valued Customer",
            download_url: job.downloadUrl,
            product: job.productName,
            order_id: job.orderId,
          }),
          postToMake(CS_WEBHOOK, buildCSPurchasePayload(job)),
          postToMake(OMNI_WEBHOOK, buildSocialProofPayload(job)),
        ]);
      } else if (job.type === "lead_magnet_delivery") {
        const assetUrl = job.assetPath.startsWith("http")
          ? job.assetPath
          : `${SITE_URL}${job.assetPath}`;
        await Promise.allSettled([
          postToMake(LEAD_MAGNET_WEBHOOK, {
            email: job.email,
            subject: `Your free ${job.productName} is ready — AutonomaX`,
            body: `<p>Download: <a href="${assetUrl}">${assetUrl}</a></p>`,
            product: job.productName,
            slug: job.slug,
          }),
          postToMake(CS_WEBHOOK, buildCSLeadPayload(job, assetUrl)),
        ]);
      }

      // Archive: re-set under processed key, then delete original
      const archiveKey = key.replace("email:queue:pending", "email:queue:processed");
      await kvSet(archiveKey, job, 7 * 24 * 60 * 60).catch(() => {});
      await kvDel(key).catch(() => {});
      processed++;
    } catch (err) {
      console.warn(`[fulfillment] drain: error on ${key}:`, (err as Error).message);
    }
  }

  return processed;
}

export async function countPendingJobs(): Promise<number> {
  const keys = await kvScan("email:queue:pending:*", 100).catch(() => [] as string[]);
  return keys.length;
}
