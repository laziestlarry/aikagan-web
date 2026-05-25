// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CATALOG — AIKAGAN × AutonomaX
//
// Offer ladder (mirrors autonomax_revenue_ops/data/offer_ladder.json):
//   lead_magnet (free) → tripwire ($29) → core ($149–$249) → premium ($299+) → recurring
//
// Checkout URLs are LemonSqueezy — env vars override hardcoded defaults.
// zipFilename maps to private/downloads/<file> (not publicly accessible).
// ─────────────────────────────────────────────────────────────────────────────

export type ProductTier =
  | "lead_magnet"
  | "tripwire"
  | "core"
  | "premium"
  | "masterclass"
  | "recurring";

export interface Product {
  slug: string;
  name: string;
  /** Human-readable tier label shown on cards */
  tier: string;
  /** Machine-readable tier used for offer-ladder logic */
  ladderTier: ProductTier;
  price: number;
  originalPrice?: number;
  priceModel: "free" | "one_time" | "monthly";
  description: string;
  bullets: string[];
  checkoutUrl: string | null;
  /** Filename inside private/downloads/ — null for lead magnets */
  zipFilename: string | null;
  /** slug of the next-step upsell product */
  nextSlug: string | null;
  badge?: string;
  guarantee?: string;
  image?: string;
  accentColor?: string;
  /** For lead magnets: public asset path to deliver on opt-in */
  leadMagnetPath?: string;
}

const CHECKOUT = {
  starter:    process.env.NEXT_PUBLIC_LS_STARTER_URL
                ?? "https://autonomax.lemonsqueezy.com/checkout/buy/2dd8d2ad-0fc5-495f-bd42-594484e981d3",
  pro:        process.env.NEXT_PUBLIC_LS_PRO_URL
                ?? "https://autonomax.lemonsqueezy.com/checkout/buy/5ae79599-3cc7-4a82-9bce-b977b6a0a160",
  commander:  process.env.NEXT_PUBLIC_LS_COMMANDER_URL
                ?? "https://autonomax.lemonsqueezy.com/checkout/buy/eb358df9-f77c-4009-af74-a0ec005bb744",
  calmIncome: process.env.NEXT_PUBLIC_LS_CALM_INCOME_URL
                ?? "https://autonomax.lemonsqueezy.com/checkout/buy/4ff5e2ac-3cae-4741-afa0-b84c1dba2e29",
  masterclassStarter: process.env.NEXT_PUBLIC_LS_MC_STARTER_URL ?? "",
  masterclassPro:     process.env.NEXT_PUBLIC_LS_MC_PRO_URL ?? "",
  masterclassCommander: process.env.NEXT_PUBLIC_LS_MC_COMMANDER_URL ?? "",
};

export const products: Product[] = [
  // ───────────────────────────────────────────────────────
  // TIER 1 — Lead Magnets (free opt-in)
  // ───────────────────────────────────────────────────────
  {
    slug: "weekly-operating-map",
    name: "Weekly Operating Map",
    tier: "Free Download",
    ladderTier: "lead_magnet",
    price: 0,
    priceModel: "free",
    description: "One-page weekly routine that replaces tool clutter with a single Sunday + Wednesday cadence.",
    bullets: [
      "Sunday planning block (20 min)",
      "Wednesday reset check-in (10 min)",
      "Single-page printable PDF",
      "Works offline, no tools required",
    ],
    checkoutUrl: null,
    zipFilename: null,
    nextSlug: "golden-delivery-starter",
    leadMagnetPath: "/free-assets/weekly-operating-map.pdf",
    badge: "Free",
    accentColor: "#34d399",
  },
  {
    slug: "builder-starter-checklist",
    name: "Builder Starter Checklist",
    tier: "Free Download",
    ladderTier: "lead_magnet",
    price: 0,
    priceModel: "free",
    description: "10-step checklist for first-time builders: from idea to first sale, no overwhelm.",
    bullets: [
      "10 sequential steps from idea to first \$1",
      "No audience, no ads required",
      "Removes \u2018where do I even start\u2019 paralysis",
      "Instant digital delivery",
    ],
    checkoutUrl: null,
    zipFilename: null,
    nextSlug: "masterclass-starter",
    leadMagnetPath: "/free-assets/builder-starter-checklist.pdf",
    badge: "Free",
    accentColor: "#34d399",
  },
  // Third free pack to fill row 1 — Golden Delivery Sample Kit (email-gated download)
  {
    slug: "golden-delivery-sample",
    name: "Golden Delivery — Sample Kit",
    tier: "Free Gift",
    ladderTier: "lead_magnet",
    price: 0,
    priceModel: "free",
    description: "Curated extract from the full Golden Delivery system. The exact first-sale blueprint, one offer template, and the 24-hour activation checklist — instant email delivery.",
    bullets: [
      "7-Day First Sale Blueprint (preview chapter)",
      "1 ready-to-use offer template",
      "24-Hour Quick Win activation checklist",
      "AutonomaX revenue map (1-page)",
      "Email delivery — no card required",
    ],
    checkoutUrl: null,
    zipFilename: "AutonomaX_Golden_Delivery_Starter_Pack.zip",
    nextSlug: "masterclass-starter",
    leadMagnetPath: "/free-assets/golden-delivery-sample-kit.pdf",
    badge: "Free Gift",
    accentColor: "#34d399",
  },
  // ───────────────────────────────────────────────────────
  // TIER 2 — Tripwire / Golden Delivery Packs
  // ───────────────────────────────────────────────────────
  {
    slug: "golden-delivery-starter",
    name: "Starter",
    tier: "Golden Delivery — Starter Pack",
    ladderTier: "tripwire",
    price: 29,
    originalPrice: 97,
    priceModel: "one_time",
    description: "7-file Launch Ignition System. Get your first sale in 7 days using the exact blueprint, scripts, and activation checklist — no audience, no ads, no guesswork.",
    bullets: [
      "7-Day First Sale Blueprint (day-by-day execution map)",
      "Offer Creation Worksheet (5-section fillable guide)",
      "Objection Crusher Scripts (6 pre-written DM responses)",
      "24-Hour Quick Win Activation Checklist",
      "System Access Guide to AutonomaX AI Revenue Engine",
      "First Sale Plan + Start Here orientation docs",
    ],
    checkoutUrl: CHECKOUT.starter,
    zipFilename: "AutonomaX_Golden_Delivery_Starter_Pack.zip",
    nextSlug: "golden-delivery-pro",
    badge: "Best for beginners",
    guarantee: "30-day money-back guarantee",
    image: "/visuals/starter_pack.png",
    accentColor: "#34d399",
  },
  {
    slug: "golden-delivery-pro",
    name: "Pro",
    tier: "Golden Delivery — Pro Pack",
    ladderTier: "core",
    price: 79,
    originalPrice: 297,
    priceModel: "one_time",
    description: "9-file Revenue Operations System. Funnels, AI tools, 30-day calendar, traffic playbook, and 5 ready-to-sell offer templates — everything to hit $1K/month.",
    bullets: [
      "Funnel Master Guide (3 complete funnel architectures + copy)",
      "AI Tools Stack (7 tools, exact prompts, $0\u2013$76/mo setup)",
      "Traffic Playbook (5 organic + 2 paid channels, post formulas)",
      "30-Day Revenue Calendar (day-by-day tasks + KPI targets)",
      "5 Complete Offer Templates (priced $27\u2013$197)",
      "6 Automation Workflow Templates",
      "Pro Offer Creation Guide + System Access",
    ],
    checkoutUrl: CHECKOUT.pro,
    zipFilename: "AutonomaX_Golden_Delivery_Pro_Pack.zip",
    nextSlug: "golden-delivery-commander",
    badge: "Most popular",
    guarantee: "30-day money-back guarantee",
    image: "/visuals/pro_pack.png",
    accentColor: "#D4AF37",
  },
  {
    slug: "golden-delivery-commander",
    name: "Commander",
    tier: "Golden Delivery — Commander Pack",
    ladderTier: "premium",
    price: 149,
    originalPrice: 997,
    priceModel: "one_time",
    description: "12-file Empire Architecture. Full scaling system: white-label rights, 60-day sprint, partnership playbook, automation OS, KPI dashboard, and $10K+/month revenue path models.",
    bullets: [
      "Master System Map (5-layer empire architecture + revenue models)",
      "White-Label Guide (license & resell the system as your own)",
      "60-Day Scale Sprint (week-by-week milestones + experiments)",
      "Partnership Playbook (5 deal types, outreach templates, commission tables)",
      "Automation OS (full stack map, cron schedules, failure prevention)",
      "KPI Dashboard (4 metric tiers, diagnostics, red flags)",
      "Advanced Workflows, Revenue Paths, VIP Onboarding (9 more docs)",
    ],
    checkoutUrl: CHECKOUT.commander,
    zipFilename: "AutonomaX_Golden_Delivery_Commander_Pack.zip",
    nextSlug: "masterclass-starter",
    badge: "Maximum value",
    guarantee: "30-day money-back guarantee",
    image: "/visuals/commander_pack.png",
    accentColor: "#a78bfa",
  },
  // ───────────────────────────────────────────────────────
  // TIER 3 — Masterclass v2 (advanced)
  // ───────────────────────────────────────────────────────
  {
    slug: "masterclass-starter",
    name: "Starter",
    tier: "AutonomaX Masterclass",
    ladderTier: "masterclass",
    price: 29,
    originalPrice: 97,
    priceModel: "one_time",
    description: "The 7-day first-sale system — full AutonomaX framework, scripts, offer templates and the activation checklist. Includes the entire Golden Delivery — Starter Pack as a bonus.",
    bullets: [
      "Full 7-Day First Sale Blueprint (day-by-day execution map)",
      "Offer Creation Worksheet (5-section fillable guide)",
      "Objection Crusher Scripts (6 pre-written DM responses)",
      "24-Hour Quick Win Activation Checklist",
      "Masterclass-grade execution workbook",
      "Bonus: full Golden Delivery — Starter Pack ZIP",
    ],
    checkoutUrl: CHECKOUT.masterclassStarter || null,
    zipFilename: "AutonomaX_Masterclass_Starter_Pack_v2.zip",
    nextSlug: "masterclass-pro",
    badge: "Best for beginners",
    guarantee: "30-day money-back guarantee",
    accentColor: "#f59e0b",
  },
  {
    slug: "masterclass-pro",
    name: "Pro",
    tier: "AutonomaX Masterclass",
    ladderTier: "masterclass",
    price: 79,
    originalPrice: 297,
    priceModel: "one_time",
    description: "Revenue operations deep-dives, AI tools stack, traffic playbook and 5 ready-to-sell offer templates — everything to hit $1K/month. Includes the Golden Delivery — Pro Pack.",
    bullets: [
      "Funnel Master Guide (3 complete funnel architectures + copy)",
      "AI Tools Stack (7 tools, exact prompts, $0–$76/mo setup)",
      "Traffic Playbook (5 organic + 2 paid channels, post formulas)",
      "30-Day Revenue Calendar (day-by-day tasks + KPI targets)",
      "5 Complete Offer Templates (priced $27–$197)",
      "6 Automation Workflow Templates",
      "Bonus: full Golden Delivery — Pro Pack ZIP",
    ],
    checkoutUrl: CHECKOUT.masterclassPro || null,
    zipFilename: "AutonomaX_Masterclass_Pro_Pack_v2.zip",
    nextSlug: "masterclass-commander",
    badge: "Most popular",
    guarantee: "30-day money-back guarantee",
    accentColor: "#D4AF37",
  },
  {
    slug: "masterclass-commander",
    name: "Commander",
    tier: "AutonomaX Masterclass",
    ladderTier: "masterclass",
    price: 149,
    originalPrice: 597,
    priceModel: "one_time",
    description: "The full empire architecture. White-label licensing, 60-day scale sprint, partnership playbook, automation OS, KPI dashboard and the $10K+/month revenue path models. Includes the Golden Delivery — Commander Pack.",
    bullets: [
      "Master System Map (5-layer empire architecture + revenue models)",
      "White-Label Guide (license & resell the system as your own)",
      "60-Day Scale Sprint (week-by-week milestones + experiments)",
      "Partnership Playbook (5 deal types, outreach templates, commission tables)",
      "Automation OS (full stack map, cron schedules, failure prevention)",
      "KPI Dashboard (4 metric tiers, diagnostics, red flags)",
      "Bonus: full Golden Delivery — Commander Pack ZIP",
    ],
    checkoutUrl: CHECKOUT.masterclassCommander || null,
    zipFilename: "AutonomaX_Masterclass_Commander_Pack_v2.zip",
    nextSlug: null,
    badge: "Maximum value",
    guarantee: "30-day money-back guarantee",
    accentColor: "#a78bfa",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByTier(tier: ProductTier): Product[] {
  return products.filter((p) => p.ladderTier === tier);
}

export function getPaidProducts(): Product[] {
  return products.filter((p) => p.priceModel !== "free");
}
