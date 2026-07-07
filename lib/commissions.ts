/**
 * Webhook → Affiliate Commission Bridge
 *
 * Called by Paddle and LemonSqueezy webhooks after a successful payment.
 * Extracts ref_code from the event custom_data, computes commission, and
 * records it on the affiliate profile.
 *
 * All non-blocking — returns silently on errors so a missing affiliate
 * record does not fail the webhook (which would cause provider retries).
 */

import { recordConversion, getCommissionRate } from "./referral";

export interface CommissionInput {
  /** Affiliate ref code from custom_data (e.g. "a3b7c9d2"). */
  refCode: string | undefined | null;
  /** Provider transaction / order id (for logging). */
  orderId: string;
  /** Product slug (drives commission rate). */
  productSlug: string;
  /** Order total in major units (dollars). */
  amount: number;
  /** Provider name for logging. */
  provider: "paddle" | "lemonsqueezy";
}

/** Record a commission from a webhook event. Non-blocking. */
export async function recordWebhookCommission(input: CommissionInput): Promise<void> {
  if (!input.refCode) {
    console.log(
      JSON.stringify({
        event: "commission_skipped_no_ref",
        provider: input.provider,
        orderId: input.orderId,
        slug: input.productSlug,
      })
    );
    return;
  }

  const code = input.refCode.toLowerCase().trim();
  const rate = getCommissionRate(input.productSlug);
  const commission = (input.amount * rate) / 100;

  try {
    const ok = await recordConversion({
      code,
      orderId: input.orderId,
      amount: input.amount,
      productSlug: input.productSlug,
      commissionRate: rate,
    });
    if (ok) {
      console.log(
        JSON.stringify({
          event: "commission_recorded",
          provider: input.provider,
          orderId: input.orderId,
          slug: input.productSlug,
          code,
          rate,
          amount: input.amount,
          commission,
        })
      );
    } else {
      console.log(
        JSON.stringify({
          event: "commission_unknown_code",
          provider: input.provider,
          orderId: input.orderId,
          code,
        })
      );
    }
  } catch (err) {
    console.error("[commissions] Failed to record conversion:", err);
  }
}
