export const STAGES = [
  "understand",
  "investigate",
  "decide",
  "scope",
  "build",
  "verify",
  "operate",
] as const;

export type Stage = (typeof STAGES)[number];

export const EVIDENCE_LEVELS = [
  "E0_claim",
  "E1_made",
  "E2_tested",
  "E3_integrated",
  "E4_live",
  "E5_accepted",
] as const;

export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];

export const AGENT_TYPES = [
  "intake",
  "diagnostic",
  "proposal",
  "fulfillment",
  "verification",
  "escalation",
  "reporting",
] as const;

export type AgentType = (typeof AGENT_TYPES)[number];

export const TIER_INTERESTS = [
  "starter",
  "pro",
  "commander",
  "managed",
  "enterprise",
] as const;

export type TierInterest = (typeof TIER_INTERESTS)[number];

export const LIVE_ONE_TIME_PRICES_CENTS = {
  starter: 2_900,
  pro: 7_900,
  commander: 14_900,
} as const;

export const MANAGED_MONTHLY_CENTS = 19_900;
export const HUMAN_APPROVAL_PRICE_CENTS = 7_900;

export const STAGE_DWELL_LIMITS_HOURS: Record<Stage, number | null> = {
  understand: 4,
  investigate: 24,
  decide: 48,
  scope: 24,
  build: 168,
  verify: 72,
  operate: null,
};

export const REVENUE_EVENTS: Record<Stage, string | null> = {
  understand: null,
  investigate: "revenue_leak_scan_delivered",
  decide: "offer_accepted",
  scope: "deposit_invoiced",
  build: "milestone_payment",
  verify: "final_payment",
  operate: "recurring_fee",
};

export const STAGE_PROGRESS: Record<Stage, number> = {
  understand: 10,
  investigate: 22,
  decide: 36,
  scope: 48,
  build: 68,
  verify: 86,
  operate: 100,
};

export type ScanAnswers = Record<string, number>;

export interface MissionIntake {
  clientName?: string;
  clientEmail?: string;
  businessUrl?: string;
  annualRevenueBand?: string;
  bottleneckStatement: string;
  tierInterest: TierInterest;
  scanAnswers?: ScanAnswers;
  path?: "opportunity" | "build" | "manage";
}

export interface EvidenceRecord {
  id: string;
  level: EvidenceLevel;
  artifactUrl?: string;
  checksum?: string;
  notes?: string;
  recordedAt: string;
  recordedBy: "human" | "system";
}

export interface MissionState {
  missionId: string;
  stage: Stage;
  currentLevel: EvidenceLevel;
  createdAt: string;
  lastTransitionAt: string;
  intake: MissionIntake;
  evidence: EvidenceRecord[];
  escalateToHuman: boolean;
  escalationReason?: string;
  acceptanceCheckSigned: boolean;
  recommendedTier?: TierInterest;
  recommendedPriceCents?: number;
  nextAction: string;
  status: "planned" | "active" | "blocked" | "delivered";
}

export interface AgentJob {
  jobId: string;
  agentType: AgentType;
  missionId: string;
  payload: Record<string, unknown>;
  attempts: number;
  maxAttempts: number;
}

export interface AgentResult {
  agentType: AgentType;
  status: "ok" | "blocked" | "error";
  evidenceGrade: EvidenceLevel;
  nextStage?: Stage;
  data: Record<string, unknown>;
  reason?: string;
}

export const NEXT_ACTIONS: Record<Stage, string> = {
  understand: "Complete intake with one measurable bottleneck and decision owner.",
  investigate: "Run or attach a Revenue Leak Scan before ranking interventions.",
  decide: "Approve, decline, or revise the proposed tier. Offers above $79 require a human gate.",
  scope: "Sign the acceptance check before any build work starts.",
  build: "Produce the smallest testable artifact and log E1 evidence.",
  verify: "Run a representative case. E4 live evidence is required before Operate.",
  operate: "Compare observed performance with the baseline. E5 requires customer acceptance.",
};
