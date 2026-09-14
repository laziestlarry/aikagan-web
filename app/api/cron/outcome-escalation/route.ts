import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cron-auth";
import { listOpenMissionIds, recentActivity, scanStalledMissions } from "@/lib/outcomeos/store";
import { newJob, runReportingAgent } from "@/lib/outcomeos/agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(req: NextRequest) {
  const auth = requireCronAuth(req);
  if (!auth.ok) return auth.response!;

  const escalated = await scanStalledMissions();
  const open = await listOpenMissionIds();
  const activity = await recentActivity(10);
  const report = runReportingAgent(newJob("reporting", "system", {
    stats: {
      missionsStarted: open.length,
      missionsCompleted: 0,
      anomalies: escalated.map((mission) => ({
        missionId: mission.missionId,
        stage: mission.stage,
        reason: mission.escalationReason,
      })),
    },
  }));

  return NextResponse.json({
    ok: true,
    openMissions: open.length,
    escalated: escalated.map((mission) => ({
      missionId: mission.missionId,
      stage: mission.stage,
      reason: mission.escalationReason,
    })),
    report,
    activityCount: activity.length,
  });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
