// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT ALTERNATIVES — Payment rail model
//
// When Paddle/LemonSqueezy onboarding is pending, these alternatives keep the
// funnel alive. Each alternative:
//   • Has a purchase URL / instruction for the buyer
//   • Wires back into the same delivery flow (fulfillment + CAPI + income ledger)
//
// Rail priority for full-active status:
//   1. Paddle (Merchant of Record — best global + Turkey)
//   2. LemonSqueezy (MoR fallback)
//   3. Gumroad (MoR — PayPal + cards + Apple Pay + Google Pay)
//   4. Squarespace Commerce (parallel storefront link)
//   5. Shopier (Turkish gateway — iyzico-backed, lira)
//   6. Binance Pay (crypto)
//   7. Manual checkout (works every time)
//
// Each rail can be "online" (API-based, creates a checkout URL) or "redirect"
// (links to an external store / payment page).
// ─────────────────────────────────────────────────────────────────────────────

/** Status of a payment rail */
export type RailStatus = "active" | "onboarding" | "needs_setup" | "manual";

/** Payment rail definition */
export interface PaymentRail {
  /** Unique id */
  id: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Current status */
  status: RailStatus;
  /** Whether it's a Merchant of Record (handles tax/VAT) */
  isMoR: boolean;
  /** Supported payment methods */
  methods: string[];
  /** Payout channel (where funds arrive) */
  payoutTo: string;
  /** Link to create checkout / storefront */
  checkoutLink: string | null;
  /** Link to setup instructions */
  setupLink: string | null;
  /** Notes for the operator */
  notes: string;
}

export const paymentRails: PaymentRail[] = [
  {
    id: "paddle",
    name: "Paddle",
    description: "Merchant of Record — global coverage, tax/VAT compliance, Payoneer payout",
    status: "onboarding",
    isMoR: true,
    methods: ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Google Pay"],
    payoutTo: "Payoneer",
    checkoutLink: null, // API-based, handled by /api/paddle-checkout
    setupLink: "https://vendor.paddle.com",
    notes: "Onboarding submitted and pending re-review (~3 days). API key present.",
  },
  {
    id: "lemonsqueezy",
    name: "LemonSqueezy",
    description: "Merchant of Record — developer-friendly, supports global + Turkey",
    status: "onboarding",
    isMoR: true,
    methods: ["Visa", "Mastercard", "PayPal", "Apple Pay"],
    payoutTo: "Bank transfer",
    checkoutLink: null, // API-based, handled by /api/lemonsqueezy-checkout
    setupLink: "https://app.lemonsqueezy.com",
    notes: "Application submitted May 22. Awaiting reply to their 3 questions.",
  },
  {
    id: "gumroad",
    name: "Gumroad",
    description: "Merchant of Record — quickest to activate, PayPal + cards + Apple Pay + Google Pay",
    status: "needs_setup",
    isMoR: true,
    methods: ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Google Pay"],
    payoutTo: "Bank / Payoneer",
    checkoutLink: null, // API-based via GUMROAD_ACCESS_TOKEN
    setupLink: "https://gumroad.com/settings",
    notes: "Set GUMROAD_ACCESS_TOKEN env var, create product in Gumroad dashboard, set LEMONSQUEEZY_VARIANT_* or map variant slugs.",
  },
  {
    id: "squarespace",
    name: "Squarespace Commerce",
    description: "Parallel storefront — full e-commerce with digital delivery",
    status: "needs_setup",
    isMoR: false,
    methods: ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"],
    payoutTo: "Bank (Stripe)",
    checkoutLink: null, // Squarespace store URL
    setupLink: "https://www.squarespace.com/commerce",
    notes: "Create a Squarespace store with the same products, link from aikagan.com.",
  },
  {
    id: "shopier",
    name: "Shopier",
    description: "Turkish payment gateway — iyzico-backed, TL pricing, local market",
    status: "needs_setup",
    isMoR: false,
    methods: ["Visa", "Mastercard", "Bank transfer (TR)"],
    payoutTo: "Turkish bank account",
    checkoutLink: null,
    setupLink: "https://shopier.com",
    notes: "Best for TR-based buyers. Requires Turkish business/merchant account.",
  },
  {
    id: "binance",
    name: "Binance Pay",
    description: "Crypto checkout — USDT, BTC, ETH, BNB — no chargebacks, global",
    status: "needs_setup",
    isMoR: false,
    methods: ["USDT", "BTC", "ETH", "BNB"],
    payoutTo: "Binance wallet",
    checkoutLink: null, // Binance Pay API or manual wallet address
    setupLink: "https://pay.binance.com",
    notes: "Create a Binance Pay merchant account. Generate payment links per product.",
  },
  {
    id: "payoneer",
    name: "Payoneer Checkout",
    description: "Cross-border payment receiving — supports 190+ countries",
    status: "needs_setup",
    isMoR: false,
    methods: ["Visa", "Mastercard", "Bank transfer"],
    payoutTo: "Payoneer wallet (already held)",
    checkoutLink: null,
    setupLink: "https://www.payoneer.com/checkout/",
    notes: "Account exists (Paddle payout destination). Payoneer Checkout product requires separate application.",
  },
  {
    id: "manual",
    name: "Manual Checkout",
    description: "Buyer submits info — human processes payment + delivers",
    status: "manual",
    isMoR: false,
    methods: ["Any"],
    payoutTo: "Any",
    checkoutLink: null, // Generated by /api/checkout fallback
    setupLink: null,
    notes: "Always available. Works for any payment method. 24h processing time.",
  },
];

/** Rails that are immediately usable (active or manual) */
export function getActiveRails(): PaymentRail[] {
  return paymentRails.filter((r) => r.status === "active" || r.status === "manual");
}

/** Rails that need setup but could be activated quickly */
export function getSetupRails(): PaymentRail[] {
  return paymentRails.filter((r) => r.status === "needs_setup");
}

/** Rail by id */
export function getRail(id: string): PaymentRail | undefined {
  return paymentRails.find((r) => r.id === id);
}

/** Get the manual checkout URL with optional coupon */
export function manualCheckoutUrl(
  slug: string,
  intentId?: string,
  coupon?: string | null
): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aikagan.com";
  const params = new URLSearchParams({ slug });
  if (intentId) params.set("intent", intentId);
  if (coupon) params.set("coupon", coupon);
  return `${base}/checkout/manual?${params.toString()}`;
}
