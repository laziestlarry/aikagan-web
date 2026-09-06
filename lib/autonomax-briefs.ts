import { kvGet, kvLpush, kvLrange, kvSet } from "@/lib/kv";

const BRIEF_QUEUE_KEY = "autonomax:briefs";
const BRIEF_TTL_S = 30 * 24 * 60 * 60;

export interface ProductBrief {
  id: string;
  status: "queued" | "provisioned";
  category: string;
  audience: string;
  keywords: string[];
  refs: string[];
  successCriteria: string;
  createdAt: string;
  source: string;
}

export interface CustomerSuccessPlan {
  status: "ready_for_review";
  generation: "deterministic_customer_success_plan";
  generatedAt: string;
  customerOutcome: string;
  activationSteps: string[];
  proofCheckpoints: string[];
  supportRoute: string;
  escalationPolicy: string;
  deliveryBoundary: string;
}

export interface ProvisionedBrief {
  brief: ProductBrief;
  customerSuccessPlan: CustomerSuccessPlan;
}

function briefKey(id: string) {
  return `autonomax:brief:${id}`;
}

function planKey(id: string) {
  return `autonomax:brief:${id}:customer-success-plan`;
}

function parseBrief(value: string): ProductBrief | null {
  try {
    const parsed = JSON.parse(value) as Partial<ProductBrief>;
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.category !== "string" ||
      typeof parsed.audience !== "string" ||
      typeof parsed.createdAt !== "string"
    ) {
      return null;
    }
    return {
      id: parsed.id,
      status: parsed.status === "provisioned" ? "provisioned" : "queued",
      category: parsed.category,
      audience: parsed.audience,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.filter((item): item is string => typeof item === "string") : [],
      refs: Array.isArray(parsed.refs) ? parsed.refs.filter((item): item is string => typeof item === "string") : [],
      successCriteria: typeof parsed.successCriteria === "string" ? parsed.successCriteria : "",
      createdAt: parsed.createdAt,
      source: typeof parsed.source === "string" ? parsed.source : "autonomax-control-plane",
    };
  } catch {
    return null;
  }
}

function createCustomerSuccessPlan(brief: ProductBrief): CustomerSuccessPlan {
  const keywords = brief.keywords.length ? brief.keywords.join(", ") : "the stated customer problem";
  const outcome = brief.successCriteria || `A reviewable ${brief.category} outcome for ${brief.audience}.`;

  return {
    status: "ready_for_review",
    generation: "deterministic_customer_success_plan",
    generatedAt: new Date().toISOString(),
    customerOutcome: outcome,
    activationSteps: [
      `Confirm the target customer: ${brief.audience}.`,
      `Validate the offer scope and priority signals: ${keywords}.`,
      "Assign an owner and a first-response SLA before external delivery.",
      "Review the draft with a human operator before publishing, charging, or fulfilling.",
    ],
    proofCheckpoints: [
      "The proposed outcome has a named owner and acceptance criteria.",
      "Customer-facing claims match verified capability and delivery capacity.",
      "Support, escalation, and refund or remediation paths are reachable.",
      "Delivery is recorded only after a verified recipient receives the approved artifact.",
    ],
    supportRoute: "Open a support ticket in the customer workspace or contact the assigned delivery owner.",
    escalationPolicy: "Escalate blocked, safety-sensitive, payment, or delivery-impacting work to a human operator before action.",
    deliveryBoundary: "This is an operator-ready Customer Success Plan. It is not AI-generated content, a published listing, a payment confirmation, or customer fulfillment.",
  };
}

export async function storeQueuedBrief(brief: ProductBrief): Promise<void> {
  await Promise.all([
    kvSet(briefKey(brief.id), brief, BRIEF_TTL_S),
    kvLpush(BRIEF_QUEUE_KEY, JSON.stringify(brief), BRIEF_TTL_S),
  ]);
}

export async function findBrief(id: string): Promise<ProductBrief | null> {
  const indexed = await kvGet<ProductBrief>(briefKey(id));
  if (indexed) return indexed;

  // Legacy queued briefs predate per-brief indexing. Recover only the named ID.
  const queued = await kvLrange<string>(BRIEF_QUEUE_KEY, 0, 1000);
  const recovered = queued.map(parseBrief).find((brief) => brief?.id === id) ?? null;
  if (recovered) await kvSet(briefKey(id), recovered, BRIEF_TTL_S);
  return recovered;
}

export async function provisionCustomerSuccessPlan(id: string): Promise<ProvisionedBrief | null> {
  const brief = await findBrief(id);
  if (!brief) return null;

  const existing = await kvGet<CustomerSuccessPlan>(planKey(id));
  const customerSuccessPlan = existing ?? createCustomerSuccessPlan(brief);
  if (!existing) await kvSet(planKey(id), customerSuccessPlan, BRIEF_TTL_S);

  const provisionedBrief: ProductBrief = { ...brief, status: "provisioned" };
  await kvSet(briefKey(id), provisionedBrief, BRIEF_TTL_S);
  return { brief: provisionedBrief, customerSuccessPlan };
}
