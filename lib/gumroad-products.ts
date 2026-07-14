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
    id: "J59rJByCCyKKEfDouQjTDw==",
    permalink: "autonomax-starter-29",
    url: "https://nomadauto.gumroad.com/l/autonomax-starter-29",
    priceCents: 2900,
  },
  "masterclass-pro": {
    id: "1BzBT7MJ_yBSJ1d9W9OrjA==",
    permalink: "autonomax-pro-79",
    url: "https://nomadauto.gumroad.com/l/autonomax-pro-79",
    priceCents: 7900,
  },
  "masterclass-commander": {
    id: "H7uOVVl-CaUQJRp8e_73WQ==",
    permalink: "autonomax-commander-149",
    url: "https://nomadauto.gumroad.com/l/autonomax-commander-149",
    priceCents: 14900,
  },
  "revenue-audit-sprint": {
    id: "J59rJByCCyKKEfDouQjTDw==",
    permalink: "autonomax-starter-29",
    url: "https://nomadauto.gumroad.com/l/autonomax-starter-29",
    priceCents: 2900,
  },
};

export function getGumroadProduct(slug: string): GumroadProduct | undefined {
  return GUMROAD_PRODUCTS[slug];
}

export function hasGumroadProduct(slug: string): boolean {
  return slug in GUMROAD_PRODUCTS;
}
