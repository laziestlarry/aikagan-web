export type ReadinessState = 'ready' | 'blocked';

export interface BlueprintRole {
  id: string;
  title: string;
  mandate: string;
  owns: string[];
}

export interface BlueprintStage {
  id: string;
  title: string;
  output: string;
  event: string;
}

export interface CapabilityGate {
  id: string;
  title: string;
  required: boolean;
  configured: boolean;
  state: ReadinessState;
  detail: string;
}

export const AUTONOMAX_BLUEPRINT = {
  version: '1.0-live',
  northStar:
    'Generate, publish, sell, deliver, and improve digital products through governed agent workflows backed by evidence.',
  criticalPath: ['Data', 'Model', 'Orchestrator', 'API', 'Frontend', 'Payments', 'Delivery'],
  directors: [
    {
      id: 'product',
      title: 'Chief Product Agent',
      mandate: 'Validate demand and convert opportunities into measurable SKU specifications.',
      owns: ['roadmap', 'briefs', 'success criteria'],
    },
    {
      id: 'commerce',
      title: 'Chief Commerce Agent',
      mandate: 'Own channel readiness, pricing, checkout routing, and listing quality.',
      owns: ['listings', 'pricing', 'channel sync'],
    },
    {
      id: 'operations',
      title: 'Chief Operations Agent',
      mandate: 'Protect release quality, uptime, cost controls, and rollback capability.',
      owns: ['CI/CD', 'environments', 'reliability'],
    },
    {
      id: 'data',
      title: 'Chief Data Agent',
      mandate: 'Own source quality, retrieval grounding, evaluation sets, and model policy.',
      owns: ['datasets', 'embeddings', 'evals'],
    },
    {
      id: 'customer',
      title: 'Chief Customer Agent',
      mandate: 'Own fulfillment visibility, support workflows, SLA performance, and retention signals.',
      owns: ['support', 'delivery status', 'retention'],
    },
  ] satisfies BlueprintRole[],
  executors: [
    'Sourcing Bots',
    'Content Fabricators',
    'Listing Runners',
    'Support Copilots',
    'Revenue Analysts',
  ],
  pipeline: [
    { id: 'discover', title: 'Ingest & Discover', output: 'Structured opportunity evidence', event: 'opportunity.discovered' },
    { id: 'brief', title: 'Brief Synthesis', output: 'Validated ProductBrief', event: 'product.brief_queued' },
    { id: 'forge', title: 'Asset Forge', output: 'Draft copy and asset plan', event: 'product.generated' },
    { id: 'gate', title: 'Quality Gate', output: 'Scored and approved variant', event: 'agent.proposal' },
    { id: 'publish', title: 'Publish', output: 'Verified live listing URL', event: 'listing.published' },
    { id: 'promote', title: 'Promote', output: 'Attributed campaign dispatch', event: 'campaign.dispatched' },
    { id: 'measure', title: 'Measure', output: 'Revenue and funnel evidence', event: 'order.paid' },
    { id: 'improve', title: 'Improve', output: 'Governed change proposal', event: 'system.improvement_proposed' },
  ] satisfies BlueprintStage[],
  events: [
    'product.brief_queued',
    'product.generated',
    'asset.created',
    'listing.published',
    'order.paid',
    'refund.issued',
    'agent.proposal',
  ],
} as const;

function configured(...names: string[]): boolean {
  return names.some((name) => Boolean(process.env[name]?.trim()));
}

export function getAutonomaXReadiness(): CapabilityGate[] {
  const durableState =
    configured('KV_REST_API_URL') && configured('KV_REST_API_TOKEN');
  const modelProvider = configured(
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'GEMINI_API_KEY',
    'GOOGLE_GENERATIVE_AI_API_KEY',
  );
  const commerceProvider = configured(
    'PADDLE_API_KEY',
    'LEMONSQUEEZY_API_KEY',
    'GUMROAD_ACCESS_TOKEN',
    'SHOPIER_API_KEY',
  );
  const fulfillment = configured('MAKE_WEBHOOK_URL', 'FULFILLMENT_WEBHOOK_URL');
  const telemetry = configured('NEXT_PUBLIC_GA_ID', 'META_CAPI_ACCESS_TOKEN');
  const changeControl = configured('ADMIN_SECRET', 'CRON_SECRET');

  const rows: Array<Omit<CapabilityGate, 'state'>> = [
    {
      id: 'durable-state',
      title: 'Durable state',
      required: true,
      configured: durableState,
      detail: durableState
        ? 'Shared KV credentials are configured.'
        : 'Configure KV_REST_API_URL and KV_REST_API_TOKEN before claiming durable queues.',
    },
    {
      id: 'model-provider',
      title: 'Model provider',
      required: true,
      configured: modelProvider,
      detail: modelProvider
        ? 'At least one model provider key is present.'
        : 'No model provider key is visible; brief intake works, generation remains blocked.',
    },
    {
      id: 'commerce-provider',
      title: 'Commerce provider',
      required: true,
      configured: commerceProvider,
      detail: commerceProvider
        ? 'At least one commerce credential is present.'
        : 'No commerce API credential is visible to the runtime.',
    },
    {
      id: 'fulfillment',
      title: 'Golden Delivery handoff',
      required: true,
      configured: fulfillment,
      detail: fulfillment
        ? 'A fulfillment webhook is configured.'
        : 'Configure MAKE_WEBHOOK_URL or FULFILLMENT_WEBHOOK_URL.',
    },
    {
      id: 'telemetry',
      title: 'Telemetry',
      required: false,
      configured: telemetry,
      detail: telemetry
        ? 'Attribution or analytics configuration is visible.'
        : 'Telemetry is advisory until GA or CAPI configuration is present.',
    },
    {
      id: 'change-control',
      title: 'Change control',
      required: false,
      configured: changeControl,
      detail: changeControl
        ? 'Administrative or scheduled-job authentication is configured.'
        : 'Admin and scheduled mutation surfaces should remain disabled.',
    },
  ];

  return rows.map((row) => ({
    ...row,
    state: row.configured ? 'ready' : 'blocked',
  }));
}
