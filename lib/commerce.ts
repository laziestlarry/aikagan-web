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
