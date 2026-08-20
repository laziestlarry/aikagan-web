// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CATALOG — AIKAGAN × AutonomaX
//
// Revenue rule: only offers with a verified automated fulfillment path may use
// managed checkout. Human/custom work remains an intake/request flow until a
// separate service contract and fulfillment process is active.
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
  tier: string;
  ladderTier: ProductTier;
  price: number;
  originalPrice?: number;
  priceModel: "free" | "one_time" | "monthly";
  description: string;
  bullets: string[];
  checkoutUrl: string | null;
  zipFilename: string | null;
  nextSlug: string | null;
  badge?: string;
  guarantee?: string;
  image?: string;
  accentColor?: string;
  leadMagnetPath?: string;
  deliveryMode?: "download" | "service" | "hybrid";
  deliverySteps?: string[];
  positioning?: string;
  fulfillmentWindow?: string;
}

/** Managed checkout sentinel. Server routing chooses an approved provider. */
export const CHECKOUT_SENTINEL = "paddle";

export const products: Product[] = [
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
    nextSlug: "masterclass-starter",
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
      "10 sequential steps from idea to first paid validation",
      "No paid ads required to use the checklist",
      "Removes 'where do I even start' paralysis",
      "Instant digital delivery",
    ],
    checkoutUrl: null,
    zipFilename: null,
    nextSlug: "masterclass-starter",
    leadMagnetPath: "/free-assets/builder-starter-checklist.pdf",
    badge: "Free",
    accentColor: "#34d399",
  },
  {
    slug: "golden-delivery-sample",
    name: "Golden Delivery — Sample Kit",
    tier: "Free Gift",
    ladderTier: "lead_magnet",
    price: 0,
    priceModel: "free",
    description: "Curated extract from the full Golden Delivery system: a launch blueprint preview, one offer template, and a 24-hour activation checklist.",
    bullets: [
      "7-Day First Sale Blueprint preview chapter",
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
  {
    slug: "ai-venture-launch-blueprint",
    name: "AI Venture Launch Blueprint",
    tier: "AutonomaX ProfitOS",
    ladderTier: "core",
    price: 99,
    originalPrice: 299,
    priceModel: "one_time",
    description: "Structured venture analysis for an idea, niche, or dormant project: market opportunity, monetization path, business model, execution roadmap, risk notes, and automation opportunities.",
    bullets: [
      "Executive summary and market opportunity snapshot",
      "Competitor and positioning analysis",
      "Monetization strategy and business model map",
      "14-day and 30-day execution roadmap",
      "Operational risk and assumption notes",
      "Automation opportunities for workflows and APIs",
      "Implementation options scoped separately after review",
    ],
    checkoutUrl: "/contact?product=ai-venture-launch-blueprint",
    zipFilename: null,
    nextSlug: "masterclass-pro",
    badge: "Request scope",
    accentColor: "#38bdf8",
    deliveryMode: "service",
    fulfillmentWindow: "Scope and delivery window confirmed before payment",
    positioning: "A scoped analysis service; it is not placed into automated checkout until delivery terms are confirmed.",
    deliverySteps: [
      "Submit your idea, niche, and project context.",
      "Receive confirmation of scope, deliverables, timing, and commercial terms.",
      "Proceed only after the delivery commitment is explicit.",
      "Completed work is delivered with a recommended next implementation action.",
    ],
  },
  {
    slug: "masterclass-starter",
    name: "Starter",
    tier: "AutonomaX Masterclass",
    ladderTier: "masterclass",
    price: 29,
    originalPrice: 97,
    priceModel: "one_time",
    description: "A practical first-launch toolkit: execution framework, offer worksheet, response scripts, and activation checklist. Includes the Golden Delivery Starter Pack.",
    bullets: [
      "7-Day First Launch Blueprint",
      "Offer Creation Worksheet",
      "Buyer-objection response scripts",
      "24-Hour Activation Checklist",
      "Execution workbook",
      "Bonus: Golden Delivery — Starter Pack ZIP",
    ],
    checkoutUrl: CHECKOUT_SENTINEL,
    zipFilename: "AutonomaX_Masterclass_Starter_Pack_v2.zip",
    nextSlug: "masterclass-pro",
    badge: "Best for beginners",
    guarantee: "30-day money-back guarantee",
    accentColor: "#f59e0b",
    deliveryMode: "download",
  },
  {
    slug: "masterclass-pro",
    name: "Pro",
    tier: "AutonomaX Masterclass",
    ladderTier: "masterclass",
    price: 79,
    originalPrice: 297,
    priceModel: "one_time",
    description: "A deeper revenue-operations toolkit for building and testing offers, funnels, traffic experiments, automation workflows, and a 30-day operating cadence. Includes the Golden Delivery Pro Pack.",
    bullets: [
      "Funnel Master Guide with 3 funnel architectures",
      "AI tools stack with implementation prompts",
      "Traffic playbook for organic and paid experiments",
      "30-Day Revenue Operations Calendar",
      "5 offer templates with editable positioning",
      "6 automation workflow templates",
      "Bonus: Golden Delivery — Pro Pack ZIP",
    ],
    checkoutUrl: CHECKOUT_SENTINEL,
    zipFilename: "AutonomaX_Masterclass_Pro_Pack_v2.zip",
    nextSlug: "masterclass-commander",
    badge: "Most popular",
    guarantee: "30-day money-back guarantee",
    accentColor: "#D4AF37",
    deliveryMode: "download",
  },
  {
    slug: "masterclass-commander",
    name: "Commander",
    tier: "AutonomaX Masterclass",
    ladderTier: "masterclass",
    price: 149,
    originalPrice: 597,
    priceModel: "one_time",
    description: "The complete operating architecture: system map, licensing guide, 60-day scale sprint, partnership playbook, automation OS, and KPI dashboard. Includes the Golden Delivery Commander Pack.",
    bullets: [
      "Master System Map with operating and revenue-model patterns",
      "White-label licensing guide and usage boundaries",
      "60-Day Scale Sprint with milestones and experiments",
      "Partnership Playbook with outreach templates",
      "Automation OS with schedules and failure prevention",
      "KPI Dashboard with diagnostics and red flags",
      "Bonus: Golden Delivery — Commander Pack ZIP",
    ],
    checkoutUrl: CHECKOUT_SENTINEL,
    zipFilename: "AutonomaX_Masterclass_Commander_Pack_v2.zip",
    nextSlug: null,
    badge: "Maximum toolkit",
    guarantee: "30-day money-back guarantee",
    accentColor: "#a78bfa",
    deliveryMode: "download",
  },
  {
    slug: "revenue-audit-sprint",
    name: "Revenue Audit Sprint",
    tier: "AutonomaX Audit",
    ladderTier: "tripwire",
    price: 29,
    originalPrice: 97,
    priceModel: "one_time",
    description: "Focused review of a current stack, conversion path, and monetization options with structured recommendations.",
    bullets: [
      "Technical stack and integration audit",
      "Conversion tracking review",
      "Ranked monetization opportunities",
      "Written recommendations and next-action sequence",
    ],
    checkoutUrl: "/contact?product=revenue-audit-sprint",
    zipFilename: null,
    nextSlug: "masterclass-pro",
    badge: "Request scope",
    accentColor: "#f59e0b",
    deliveryMode: "service",
    fulfillmentWindow: "Scope and delivery window confirmed before payment",
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
