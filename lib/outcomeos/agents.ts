import { createHash, randomUUID } from "node:crypto";
import {
  LIVE_ONE_TIME_PRICES_CENTS,
  MANAGED_MONTHLY_CENTS,
  type AgentJob,
  type AgentResult,
  type EvidenceLevel,
  type MissionIntake,
  type ScanAnswers,
  type TierInterest,
} from "./types";

const SCAN_KEYS = ["offer", "proof", "checkout", "fulfillment", "followup", "measurement", "retention"] as const;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function scoreIntakeSeverity(statement: string): number {
  const keywords = ["manual", "leak", "missed", "delay", "burnout", "reconcile", "checkout", "fulfillment"];
  const hits = keywords.filter((word) => statement.toLowerCase().includes(word)).length;
  return clamp01(0.25 + 0.08 * hits);
}

export function scoreScan(answers?: ScanAnswers): { score: number | null; weakest: string[] } {
  if (!answers) return { score: null, weakest: [] };
  const values = SCAN_KEYS.map((key) => answers[key]).filter((value) => typeof value === "number");
  if (values.length !== SCAN_KEYS.length) return { score: null, weakest: [] };
  const score = Math.round(values.reduce((sum, value) => sum + value, 0) / (SCAN_KEYS.length * 2) * 100);
  const weakest = SCAN_KEYS.filter((key) => (answers[key] ?? 3) < 2)
    .sort((a, b) => (answers[a] ?? 0) - (answers[b] ?? 0))
    .slice(0, 3);
  return { score, weakest };
}

export function recommendTier(intake: MissionIntake, scanScore: number | null): {
  tier: TierInterest;
  priceCents: number;
  priceModel: "one_time" | "monthly_request";
  checkoutAutomated: boolean;
} {
  if (intake.tierInterest === "managed" || intake.tierInterest === "enterprise") {
    return {
      tier: intake.tierInterest,
      priceCents: MANAGED_MONTHLY_CENTS,
      priceModel: "monthly_request",
      checkoutAutomated: false,
    };
  }
  if (intake.tierInterest === "commander" || (scanScore != null && scanScore < 40)) {
    return { tier: "commander", priceCents: LIVE_ONE_TIME_PRICES_CENTS.commander, priceModel: "one_time", checkoutAutomated: true };
  }
  if (intake.tierInterest === "pro" || (scanScore != null && scanScore < 70)) {
    return { tier: "pro", priceCents: LIVE_ONE_TIME_PRICES_CENTS.pro, priceModel: "one_time", checkoutAutomated: true };
  }
  return { tier: "starter", priceCents: LIVE_ONE_TIME_PRICES_CENTS.starter, priceModel: "one_time", checkoutAutomated: true };
}

function result(
  agentType: AgentResult["agentType"],
  status: AgentResult["status"],
  evidenceGrade: EvidenceLevel,
  data: Record<string, unknown>,
  extra: Partial<AgentResult> = {},
): AgentResult {
  return { agentType, status, evidenceGrade, data, ...extra };
}

export function runIntakeAgent(job: AgentJob): AgentResult {
  const statement = String(job.payload.bottleneckStatement ?? job.payload.objective ?? "").trim();
  if (statement.length < 10) {
    return result("intake", "blocked", "E0_claim", {}, { reason: "intake_incomplete" });
  }
  return result(
    "intake",
    "ok",
    "E0_claim",
    {
      missionId: job.missionId,
      severityScore: scoreIntakeSeverity(statement),
      checksum: createHash("sha256").update(statement).digest("hex").slice(0, 16),
    },
    { nextStage: "investigate" },
  );
}

export function runDiagnosticAgent(job: AgentJob): AgentResult {
  const answers = job.payload.scanAnswers as ScanAnswers | undefined;
  const scored = scoreScan(answers);
  if (scored.score == null) {
    return result(
      "diagnostic",
      "blocked",
      "E0_claim",
      {
        revenueLeaks: [],
        competitorGaps: [],
        keywordGaps: [],
      },
      { reason: "insufficient_evidence_no_scan_answers" },
    );
  }
  return result(
    "diagnostic",
    "ok",
    "E0_claim",
    {
      scanScore: scored.score,
      weakestLinks: scored.weakest,
      revenueLeaks: scored.weakest.map((link) => `Self-reported weakness: ${link}`),
      method: "self_reported_scan",
      competitorGaps: [],
      keywordGaps: [],
    },
    { nextStage: "decide" },
  );
}

export function runProposalAgent(job: AgentJob): AgentResult {
  const intake = (job.payload.intake ?? job.payload) as MissionIntake;
  const scanScore = typeof job.payload.scanScore === "number" ? job.payload.scanScore : scoreScan(intake.scanAnswers).score;
  const recommendation = recommendTier(
    {
      bottleneckStatement: String(intake.bottleneckStatement ?? ""),
      tierInterest: (intake.tierInterest as TierInterest) || "starter",
      scanAnswers: intake.scanAnswers,
    },
    scanScore,
  );
  return result("proposal", "ok", "E0_claim", {
    ...recommendation,
    objectionPreemptions: [
      "DIY vs implemented vs managed comparison is generated at Decide; it is not proof of delivery.",
      "Cost-of-inaction estimates are illustrative unless tied to observed numbers.",
      "Live prices remain $29 / $79 / $149 one-time. Managed $199/mo is request-scope, not automated checkout.",
    ],
    liveCheckoutProvider: "gumroad",
  });
}

export function runFulfillmentAgent(job: AgentJob): AgentResult {
  const artifactUrl = typeof job.payload.artifactUrl === "string" ? job.payload.artifactUrl : "";
  if (!artifactUrl) {
    return result("fulfillment", "blocked", "E0_claim", {}, { reason: "no_artifact_url" });
  }
  return result("fulfillment", "ok", "E1_made", {
    artifactUrl,
    recordedAt: new Date().toISOString(),
  });
}

export function runVerificationAgent(job: AgentJob): AgentResult {
  const observed = job.payload.observed as Record<string, unknown> | undefined;
  const baseline = job.payload.baseline as Record<string, unknown> | undefined;
  const liveUrl = typeof job.payload.liveUrl === "string" ? job.payload.liveUrl : "";
  if (!liveUrl || !observed || !baseline) {
    return result(
      "verification",
      "blocked",
      "E0_claim",
      { acceptanceChecksPassed: 0, acceptanceChecksTotal: 1 },
      { reason: "live_url_and_baseline_vs_observed_required" },
    );
  }
  return result("verification", "ok", "E4_live", {
    liveUrl,
    baselineVsObserved: { baseline, observed },
    notes: "Observed values recorded. E5 still requires customer acceptance.",
  });
}

export function runEscalationAgent(job: AgentJob): AgentResult {
  const stalled = Boolean(job.payload.stalled);
  return result("escalation", "ok", "E0_claim", {
    stalled,
    escalateToHuman: stalled,
    reason: stalled ? "stalled_gt_dwell_limit" : null,
  });
}

export function runReportingAgent(job: AgentJob): AgentResult {
  const stats = (job.payload.stats as Record<string, unknown>) ?? {};
  return result("reporting", "ok", "E0_claim", {
    periodStart: job.payload.periodStart ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    missionsStarted: Number(stats.missionsStarted ?? 0),
    missionsCompleted: Number(stats.missionsCompleted ?? 0),
    evidenceVelocityAvgHours: Number(stats.evidenceVelocityAvgHours ?? 0),
    revenueEvents: Number(stats.revenueEvents ?? 0),
    anomalies: Array.isArray(stats.anomalies) ? stats.anomalies : [],
    simulated: false,
  });
}

export function runAgent(job: AgentJob): AgentResult {
  switch (job.agentType) {
    case "intake":
      return runIntakeAgent(job);
    case "diagnostic":
      return runDiagnosticAgent(job);
    case "proposal":
      return runProposalAgent(job);
    case "fulfillment":
      return runFulfillmentAgent(job);
    case "verification":
      return runVerificationAgent(job);
    case "escalation":
      return runEscalationAgent(job);
    case "reporting":
      return runReportingAgent(job);
    default:
      return result("intake", "error", "E0_claim", {}, { reason: "unknown_agent" });
  }
}

export function newJob(agentType: AgentJob["agentType"], missionId: string, payload: Record<string, unknown> = {}): AgentJob {
  return {
    jobId: randomUUID(),
    agentType,
    missionId,
    payload,
    attempts: 0,
    maxAttempts: 3,
  };
}
