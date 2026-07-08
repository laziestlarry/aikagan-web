// ─────────────────────────────────────────────────────────────────────────────
// Coupon / Discount System
//
// Currently supports a single admin test coupon that overrides any product
// price to $1.00 (100¢) for end-to-end purchase testing.
//
// Usage: pass ?coupon=<code> to any checkout endpoint.
// ─────────────────────────────────────────────────────────────────────────────

import { getProduct } from "./products";

const ADMIN_COUPON_ENV = "ADMIN_TEST_COUPON";

/**
 * Return the admin coupon code from environment, or a fallback dev value.
 * In production, set ADMIN_TEST_COUPON in Vercel.
 */
export function getAdminCouponCode(): string {
  return process.env.ADMIN_TEST_COUPON ?? "";
}

/**
 * Check whether a given code matches the admin test coupon.
 * Uses constant-time-ish comparison to avoid leaking the code.
 */
export function isAdminCoupon(code: string | null | undefined): boolean {
  if (!code) return false;
  const expected = getAdminCouponCode();
  if (!expected) return false;
  if (code.length !== expected.length) return false;
  let ok = 0;
  for (let i = 0; i < code.length; i++) {
    ok |= code.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return ok === 0;
}

export const TEST_PRICE_CENTS = 100; // $1.00 in cents

export const TEST_PRICE_DOLLARS = 1; // $1.00

export interface CouponResult {
  applied: boolean;
  code: string | null;
  /** Price in dollars AFTER coupon */
  effectivePrice: number;
  /** Price in cents AFTER coupon */
  effectivePriceCents: number;
}

/**
 * Resolve the effective price for a product given an optional coupon.
 * 
 * @param slug Product slug
 * @param coupon Coupon code (or null)
 * @returns CouponResult with effective price after discount
 */
export function resolveCouponPrice(
  slug: string,
  coupon: string | null | undefined
): CouponResult {
  const product = getProduct(slug);
  const originalPrice = product?.price ?? 0;

  if (isAdminCoupon(coupon)) {
    return {
      applied: true,
      code: coupon ?? null,
      effectivePrice: TEST_PRICE_DOLLARS,
      effectivePriceCents: TEST_PRICE_CENTS,
    };
  }

  return {
    applied: false,
    code: coupon ?? null,
    effectivePrice: originalPrice,
    effectivePriceCents: Math.round(originalPrice * 100),
  };
}
