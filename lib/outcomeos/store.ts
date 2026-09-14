import { randomUUID } from "node:crypto";
import { kvGet, kvLpush, kvLrange, kvSadd, kvSet, kvSmembers } from "@/lib/kv";
import { appendEvidence, evaluateStall, markEscalation, nextActionFor, progressFor } from "./stage-gate";
import {
  type EvidenceRecord,
  type MissionIntake,
  type MissionState,
  type TierInterest,
} from "./types";

const TTL_S = 90 * 24 * 60 * 60;
const INDEX_KEY = "outcomeos:missions:index";
const OPEN_KEY = "outcomeos:missions:open";

function key(missionId: string): string {
  return `outcomeos:mission:${missionId}`;
}

function normalizeIntake(input: Partial<MissionIntake> & { bottleneckStatement: string }): MissionIntake {
  const tier = (input.tierInterest || "starter") as TierInterest;
  return {
    clientName: input.clientName?.trim() || undefined,
    clientEmail: input.clientEmail?.trim().toLowerCase() || undefined,
    businessUrl: input.businessUrl?.trim() || undefined,
    annualRevenueBand: input.annualRevenueBand,
    bottleneckStatement: input.bottleneckStatement.trim(),
    tierInterest: ["starter", "pro", "commander", "managed", "enterprise"].includes(tier) ? tier : "starter",
    scanAnswers: input.scanAnswers,
    path: input.path,
  };
}

export async function createMission(input: Partial<MissionIntake> & { bottleneckStatement: string }): Promise<MissionState> {
  const now = new Date().toISOString();
  const intake = normalizeIntake(input);
  const mission: MissionState = {
    missionId: randomUUID(),
    stage: "understand",
    currentLevel: "E0_claim",
    createdAt: now,
    lastTransitionAt: now,
    intake,
    evidence: [],
    escalateToHuman: false,
    acceptanceCheckSigned: false,
    nextAction: nextActionFor("understand"),
    status: "active",
  };
  await persist(mission);
  return mission;
}

export async function getMission(missionId: string): Promise<MissionState | null> {
  return kvGet<MissionState>(key(missionId));
}

export async function persist(mission: MissionState): Promise<MissionState> {
  await kvSet(key(mission.missionId), mission, TTL_S);
  await kvSadd(INDEX_KEY, mission.missionId, TTL_S);
  if (mission.status === "active" || mission.status === "blocked") {
    await kvSadd(OPEN_KEY, mission.missionId, TTL_S);
  }
  await kvLpush("outcomeos:activity", JSON.stringify({
    missionId: mission.missionId,
    stage: mission.stage,
    level: mission.currentLevel,
    status: mission.status,
    at: new Date().toISOString(),
  }), TTL_S);
  return mission;
}

export async function listOpenMissionIds(): Promise<string[]> {
  return kvSmembers(OPEN_KEY);
}

export async function recentActivity(limit = 20): Promise<unknown[]> {
  return kvLrange("outcomeos:activity", 0, limit - 1);
}

export async function addEvidence(missionId: string, record: Omit<EvidenceRecord, "id" | "recordedAt"> & { recordedAt?: string }): Promise<MissionState> {
  const mission = await getMission(missionId);
  if (!mission) throw new Error("mission_not_found");
  const next = appendEvidence(mission, {
    id: randomUUID(),
    recordedAt: record.recordedAt ?? new Date().toISOString(),
    ...record,
  });
  return persist(next);
}

export async function signAcceptance(missionId: string): Promise<MissionState> {
  const mission = await getMission(missionId);
  if (!mission) throw new Error("mission_not_found");
  mission.acceptanceCheckSigned = true;
  mission.lastTransitionAt = new Date().toISOString();
  return persist(mission);
}

export async function escalate(missionId: string, reason: string): Promise<MissionState> {
  const mission = await getMission(missionId);
  if (!mission) throw new Error("mission_not_found");
  return persist(markEscalation(mission, reason));
}

export async function scanStalledMissions(now = Date.now()): Promise<MissionState[]> {
  const ids = await listOpenMissionIds();
  const escalated: MissionState[] = [];
  for (const id of ids) {
    const mission = await getMission(id);
    if (!mission) continue;
    const next = evaluateStall(mission, now);
    if (next.escalateToHuman && !mission.escalateToHuman) {
      await persist(next);
      escalated.push(next);
    }
  }
  return escalated;
}

export function workspaceProjection(mission: MissionState) {
  return {
    id: mission.missionId,
    title: mission.intake.clientName ? `${mission.intake.clientName} mission` : "Outcome mission",
    segment: mission.intake.path ?? "founder",
    objective: mission.intake.bottleneckStatement,
    status: mission.status,
    progress: progressFor(mission.stage),
    nextAction: mission.nextAction,
    stage: mission.stage,
    evidenceLevel: mission.currentLevel,
    escalateToHuman: mission.escalateToHuman,
    escalationReason: mission.escalationReason,
    acceptanceCheckSigned: mission.acceptanceCheckSigned,
    createdAt: mission.createdAt,
    updatedAt: mission.lastTransitionAt,
  };
}
