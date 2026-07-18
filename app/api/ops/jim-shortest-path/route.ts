import { NextRequest, NextResponse } from "next/server";
import { products, getProduct, getPaidProducts } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Step {
  step: number;
  slug: string;
  name: string;
  tier: string;
  price: number;
  originalPrice?: number;
  mode: "free" | "download" | "service";
  cumulative: number;
  badge?: string;
  checkoutUrl: string | null;
  cta: string;
  rationale: string;
}

interface ShortestPathResponse {
  persona: string;
  goal: string;
  generatedAt: string;
  totalRevenueAtCapacity: number;
  steps: Step[];
  fallbackRoutes: { name: string; slug: string; price: number; reason: string }[];
  assumptions: string[];
  notes: string[];
}

const PERSONA = "Jim";
const REVENUE_TARGET_USD = 2000;

// Build the canonical shortest path. Sequence: free -> $29 tripwire -> $79 core -> $99 Blueprint -> $149 commander.
// This produces 1+29+79+99+149 = $357 of single-buyer max revenue. Reaching $2K requires scale across buyer counts.
function buildShortestPath(): Step[] {
  const sequence = [
    {
      slug: "golden-delivery-sample",
      rationale: "Free opt-in seeds the email list and proves value with zero friction.",
      cta: "Send free Golden Delivery Sample Kit",
      mode: "free" as const,
    },
    {
      slug: "revenue-audit-sprint",
      rationale: "Lowest-friction $29 tripwire with a service angle — fastest first paid conversion.",
      cta: "Buy Revenue Audit Sprint",
      mode: "service" as const,
    },
    {
      slug: "masterclass-starter",
      rationale: "Tripwire upsell — instant-download playbook + Golden Delivery bonus pack.",
      cta: "Buy Masterclass Starter",
      mode: "download" as const,
    },
    {
      slug: "masterclass-pro",
      rationale: "Core offer for buyers ready to execute; unlocks the 30-day revenue calendar.",
      cta: "Buy Masterclass Pro",
      mode: "download" as const,
    },
    {
      slug: "ai-venture-launch-blueprint",
      rationale: "Highest-margin $99 service offer — service delivery with 3-day SLA, no download friction.",
      cta: "Buy AI Venture Launch Blueprint",
      mode: "service" as const,
    },
    {
      slug: "masterclass-commander",
      rationale: "Premium close: full white-label, 60-day sprint, partnership playbook. The max-value ladder step.",
      cta: "Buy Masterclass Commander",
      mode: "download" as const,
    },
  ];

  let cumulative = 0;
  return sequence.map((step, idx) => {
    const product = getProduct(step.slug);
    if (!product) {
      throw new Error(`Shortest-path step missing product: ${step.slug}`);
    }
    cumulative += product.price;
    return {
      step: idx + 1,
      slug: product.slug,
      name: product.name,
      tier: product.tier,
      price: product.price,
      originalPrice: product.originalPrice,
      mode: step.mode,
      cumulative,
      badge: product.badge,
      checkoutUrl: product.checkoutUrl,
      cta: step.cta,
      rationale: step.rationale,
    };
  });
}

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

  if (!isLocal && process.env.NODE_ENV === "production") {
    const secret = process.env.ADMIN_SECRET;
    const header = req.headers.get("x-admin-secret");
    if (secret && header !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const steps = buildShortestPath();
  const totalPerBuyer = steps.reduce((sum, s) => sum + s.price, 0);
  const buyersNeeded = Math.max(1, Math.ceil(REVENUE_TARGET_USD / Math.max(1, totalPerBuyer)));

  const paidProducts = getPaidProducts();
  const usedSlugs = new Set(steps.map((s) => s.slug));
  const fallbackRoutes = paidProducts
    .filter((p) => !usedSlugs.has(p.slug))
    .map((p) => ({
      name: p.name,
      slug: p.slug,
      price: p.price,
      reason: p.price >= 99 ? "Service-led upsell for buyers who reject download offers" : "Low-ticket expansion once trust is built",
    }));

  const body: ShortestPathResponse = {
    persona: PERSONA,
    goal: `Capture the first $${REVENUE_TARGET_USD} in <2 hours via the lowest-friction offer path.`,
    generatedAt: new Date().toISOString(),
    totalRevenueAtCapacity: totalPerBuyer,
    steps,
    fallbackRoutes,
    assumptions: [
      `One buyer converting through the full ladder yields $${totalPerBuyer} in gross revenue.`,
      `To reach $${REVENUE_TARGET_USD}, the path must close ${buyersNeeded} buyer${buyersNeeded === 1 ? "" : "s"} or scale ladder depth across channels.`,
      "Each step uses the active checkout rail (Paddle primary, Shopier/Gumroad fallback) so it is wire-ready today.",
      "Service offers (Blueprint $99, Revenue Audit $29) deliver within 3 business days — keep promise tight.",
    ],
    notes: [
      "Step 1 is a free opt-in to seed the email list. No payment risk, no friction.",
      "Step 2 ($29) is the tripwire: lowest price to convert intent into a paid buyer.",
      "Steps 3-5 ladder value with the nextSlug chain defined in the catalog.",
      "Step 6 is the $149 max-value close. Buyers who reach this tier are whitelist candidates for implementation work.",
      `Revenue target $${REVENUE_TARGET_USD} is achievable with ${buyersNeeded} full-ladder buyer${buyersNeeded === 1 ? "" : "s"} or by parallelizing across Masterclass Pro + Blueprint at the same time.`,
    ],
  };

  return NextResponse.json(body);
}
