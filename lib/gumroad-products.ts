// ─────────────────────────────────────────────────────────────────────────────
// Gumroad Product Mappings
//
// Maps aikagan product slugs to Gumroad product permalinks/URLs.
// Products created under nomadauto.gumroad.com.
// ─────────────────────────────────────────────────────────────────────────────

export interface GumroadProduct {
  /** Gumroad product ID */
  id: string;
  /** Gumroad permalink slug */
  permalink: string;
  /** Full checkout URL */
  url: string;
  /** Product price in cents for verification */
  priceCents: number;
}

export const GUMROAD_PRODUCTS: Record<string, GumroadProduct> = {
  "masterclass-starter": {
    id: "j2AeTGQzQmP_EdDZol67ew==",
    permalink: "autonomax-starter",
    url: "https://nomadauto.gumroad.com/l/autonomax-starter",
    priceCents: 2900,
  },
  "masterclass-pro": {
    id: "UPyeETqpyq67poBsH7oh5g==",
    permalink: "autonomax-pro",
    url: "https://nomadauto.gumroad.com/l/autonomax-pro",
    priceCents: 7900,
  },
  "masterclass-commander": {
    id: "70evF5Id9e03Ly7FNsK-Uw==",
    permalink: "autonomax-commander",
    url: "https://nomadauto.gumroad.com/l/autonomax-commander",
    priceCents: 14900,
  },
};

export function getGumroadProduct(slug: string): GumroadProduct | undefined {
  return GUMROAD_PRODUCTS[slug];
}

export function hasGumroadProduct(slug: string): boolean {
  return slug in GUMROAD_PRODUCTS;
}
