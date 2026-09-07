import { hasGumroadProduct } from "./gumroad-products";
import { CHECKOUT_SENTINEL, getProduct } from "./products";

export type StorefrontCommerceState = "open" | "commissioning";

/**
 * Commerce is intentionally default-deny. An operator must explicitly enable
 * it only after the product, provider, and fulfillment acceptance gates pass.
 */
export function storefrontCommerceState(): StorefrontCommerceState {
  return process.env.STOREFRONT_COMMERCE_ENABLED === "true" ? "open" : "commissioning";
}

export function isStorefrontCommerceEnabled(): boolean {
  return storefrontCommerceState() === "open";
}

/** Digital SKUs with a live Gumroad permalink are the commissioned hosted rail. */
export function isHostedGumroadOffer(slug: string): boolean {
  const product = getProduct(slug);
  return Boolean(product && product.checkoutUrl === CHECKOUT_SENTINEL && hasGumroadProduct(slug));
}

/**
 * Automated Paddle/Lemon remain gated. Hosted Gumroad for mapped Golden
 * Delivery packs may start checkout while the rest of the storefront commissions.
 */
export function canStartPaidCheckout(slug: string): boolean {
  return isStorefrontCommerceEnabled() || isHostedGumroadOffer(slug);
}
