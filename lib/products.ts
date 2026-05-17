// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT URL CONFIGURATION — LemonSqueezy (store: autonomax)
// ─────────────────────────────────────────────────────────────────────────────
// Env vars override the hardcoded values below (useful for staging/alt stores).
// To override: set NEXT_PUBLIC_LS_STARTER_URL etc. in .env.local or Vercel.
// ─────────────────────────────────────────────────────────────────────────────

const CHECKOUT = {
  starter:   process.env.NEXT_PUBLIC_LS_STARTER_URL
               ?? "https://autonomax.lemonsqueezy.com/checkout/buy/2dd8d2ad-0fc5-495f-bd42-594484e981d3",
  pro:       process.env.NEXT_PUBLIC_LS_PRO_URL
               ?? "https://autonomax.lemonsqueezy.com/checkout/buy/5ae79599-3cc7-4a82-9bce-b977b6a0a160",
  commander: process.env.NEXT_PUBLIC_LS_COMMANDER_URL
               ?? "https://autonomax.lemonsqueezy.com/checkout/buy/eb358df9-f77c-4009-af74-a0ec005bb744",
};

export const products = [
  {
    slug: "golden-delivery-starter",
    name: "Starter",
    tier: "Starter Pack",
    price: 29,
    originalPrice: 97,
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
    downloadUrl: "/downloads/AutonomaX_Golden_Delivery_Starter_Pack.zip",
    badge: "Best for beginners",
    guarantee: "30-day money-back guarantee",
    image: "/visuals/starter_pack.png",
    accentColor: "#34d399",
  },
  {
    slug: "golden-delivery-pro",
    name: "Pro",
    tier: "Pro Pack",
    price: 79,
    originalPrice: 297,
    description: "9-file Revenue Operations System. Funnels, AI tools, 30-day calendar, traffic playbook, and 5 ready-to-sell offer templates — everything to hit $1K/month.",
    bullets: [
      "Funnel Master Guide (3 complete funnel architectures + copy)",
      "AI Tools Stack (7 tools, exact prompts, $0–$76/mo setup)",
      "Traffic Playbook (5 organic + 2 paid channels, post formulas)",
      "30-Day Revenue Calendar (day-by-day tasks + KPI targets)",
      "5 Complete Offer Templates (priced $27–$197)",
      "6 Automation Workflow Templates",
      "Pro Offer Creation Guide + System Access",
    ],
    checkoutUrl: CHECKOUT.pro,
    downloadUrl: "/downloads/AutonomaX_Golden_Delivery_Pro_Pack.zip",
    badge: "Most popular",
    guarantee: "30-day money-back guarantee",
    image: "/visuals/pro_pack.png",
    accentColor: "#D4AF37",
  },
  {
    slug: "golden-delivery-commander",
    name: "Commander",
    tier: "Commander Pack",
    price: 149,
    originalPrice: 997,
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
    downloadUrl: "/downloads/AutonomaX_Golden_Delivery_Commander_Pack.zip",
    badge: "Maximum value",
    guarantee: "30-day money-back guarantee",
    image: "/visuals/commander_pack.png",
    accentColor: "#a78bfa",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}