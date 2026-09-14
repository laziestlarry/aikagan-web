import {
  EVIDENCE_LEVELS,
  HUMAN_APPROVAL_PRICE_CENTS,
  NEXT_ACTIONS,
  REVENUE_EVENTS,
  STAGE_DWELL_LIMITS_HOURS,
  STAGE_PROGRESS,
  STAGES,
  type EvidenceLevel,
  type EvidenceRecord,
  type MissionState,
  type Stage,
} from "./types";

export class StageGateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StageGateError";
  }
}

export function stageIndex(stage: Stage): number {
  return STAGES.indexOf(stage);
}

export function evidenceIndex(level: EvidenceLevel): number {
  return EVIDENCE_LEVELS.indexOf(level);
}

export function nextStage(stage: Stage): Stage | null {
  const idx = stageIndex(stage);
  if (idx < 0 || idx >= STAGES.length - 1) return null;
  return STAGES[idx + 1];
}

export function previousStage(stage: Stage): Stage | null {
  const idx = stageIndex(stage);
  if (idx <= 0) return null;
  return STAGES[idx - 1];
}

export function nextRequiredLevel(level: EvidenceLevel): EvidenceLevel {
  const idx = evidenceIndex(level);
  return EVIDENCE_LEVELS[Math.min(idx + 1, EVIDENCE_LEVELS.length - 1)];
}

export function canPublishProof(level: EvidenceLevel): boolean {
  return evidenceIndex(level) >= evidenceIndex("E4_live");
}

export function dwellLimitHours(stage: Stage): number | null {
  return STAGE_DWELL_LIMITS_HOURS[stage];
}

export function isStalled(state: Pick<MissionState, "stage" | "lastTransitionAt">, now = Date.now()): boolean {
  const limit = dwellLimitHours(state.stage);
  if (limit == null) return false;
  const last = Date.parse(state.lastTransitionAt);
  if (Number.isNaN(last)) return true;
  return now - last > limit * 60 * 60 * 1000;
}

export function revenueEventFor(stage: Stage): string | null {
  return REVENUE_EVENTS[stage];
}

export function progressFor(stage: Stage): number {
  return STAGE_PROGRESS[stage];
}

export function nextActionFor(stage: Stage): string {
  return NEXT_ACTIONS[stage];
}

export function requiresHumanApproval(state: Pick<MissionState, "stage" | "recommendedPriceCents">): boolean {
  if (state.stage !== "decide") return false;
  return (state.recommendedPriceCents ?? 0) > HUMAN_APPROVAL_PRICE_CENTS;
}

export function canAdvance(state: MissionState, target?: Stage): { ok: boolean; reason?: string } {
  const destination = target ?? nextStage(state.stage);
  if (!destination) return { ok: false, reason: "already_at_terminal_stage" };
  if (stageIndex(destination) !== stageIndex(state.stage) + 1) {
    return { ok: false, reason: "stages_must_advance_one_step" };
  }

  switch (state.stage) {
    case "understand":
      if (!state.intake?.bottleneckStatement || state.intake.bottleneckStatement.trim().length < 10) {
        return { ok: false, reason: "intake_incomplete" };
      }
      return { ok: true };
    case "investigate":
      if (!state.evidence.some((record) => record.notes || record.artifactUrl)) {
        return { ok: false, reason: "diagnostic_evidence_missing" };
      }
      return { ok: true };
    case "decide":
      if (requiresHumanApproval(state) && !state.acceptanceCheckSigned) {
        return { ok: false, reason: "human_approval_required_for_offer_above_79" };
      }
      return { ok: true };
    case "scope":
      if (!state.acceptanceCheckSigned) {
        return { ok: false, reason: "acceptance_check_required_before_build" };
      }
      return { ok: true };
    case "build":
      if (evidenceIndex(state.currentLevel) < evidenceIndex("E1_made")) {
        return { ok: false, reason: "e1_made_evidence_required" };
      }
      return { ok: true };
    case "verify":
      if (evidenceIndex(state.currentLevel) < evidenceIndex("E4_live")) {
        return { ok: false, reason: "e4_live_evidence_required_before_operate" };
      }
      if (!state.acceptanceCheckSigned) {
        return { ok: false, reason: "acceptance_check_required_before_operate" };
      }
      return { ok: true };
    default:
      return { ok: false, reason: "operate_is_continuous" };
  }
}

export function appendEvidence(state: MissionState, record: EvidenceRecord): MissionState {
  const expected = nextRequiredLevel(state.currentLevel);
  const incoming = evidenceIndex(record.level);
  const current = evidenceIndex(state.currentLevel);
  if (incoming < current) {
    throw new StageGateError(`Evidence ${record.level} is below current ${state.currentLevel}`);
  }
  if (incoming > evidenceIndex(expected)) {
    throw new StageGateError(`Evidence ${record.level} skips required ${expected}`);
  }
  const evidence = [...state.evidence, record];
  return {
    ...state,
    evidence,
    currentLevel: record.level,
    lastTransitionAt: record.recordedAt,
    escalateToHuman: false,
    escalationReason: undefined,
  };
}

export function advanceStage(state: MissionState, now = new Date().toISOString()): MissionState {
  const gate = canAdvance(state);
  if (!gate.ok) throw new StageGateError(gate.reason ?? "cannot_advance");
  const destination = nextStage(state.stage);
  if (!destination) throw new StageGateError("already_at_terminal_stage");
  return {
    ...state,
    stage: destination,
    lastTransitionAt: now,
    nextAction: nextActionFor(destination),
    status: destination === "operate" ? "delivered" : "active",
    escalateToHuman: false,
    escalationReason: undefined,
  };
}

export function markEscalation(state: MissionState, reason: string): MissionState {
  return {
    ...state,
    status: "blocked",
    escalateToHuman: true,
    escalationReason: reason,
    nextAction: `Human gate: ${reason}`,
  };
}

export function evaluateStall(state: MissionState, now = Date.now()): MissionState {
  if (!isStalled(state, now) || state.escalateToHuman) return state;
  return markEscalation(state, `stalled_gt_${dwellLimitHours(state.stage)}h`);
}
