import { NextRequest, NextResponse } from "next/server";
import { clientKey, rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { recordLead } from "@/lib/income-ledger";
import { createMission, persist, workspaceProjection } from "@/lib/outcomeos/store";
import { newJob, runIntakeAgent, runDiagnosticAgent, runProposalAgent } from "@/lib/outcomeos/agents";
import { type ScanAnswers, type TierInterest } from "@/lib/outcomeos/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@]+@[^@]+\.[^@]+$/;

export async function POST(req: NextRequest) {
  const limit = rateLimit({ key: clientKey(req, "outcome-intake"), max: 8, windowMs: 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit);

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const bottleneckStatement = String(body.bottleneckStatement ?? body.objective ?? "").trim();
  if (bottleneckStatement.length < 10) {
    return NextResponse.json({ error: "bottleneck_required" }, { status: 400 });
  }

  const clientEmail = String(body.clientEmail ?? body.email ?? "").trim().toLowerCase();
  if (clientEmail && !EMAIL_RE.test(clientEmail)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const mission = await createMission({
    clientName: String(body.clientName ?? "").trim() || undefined,
    clientEmail: clientEmail || undefined,
    businessUrl: String(body.businessUrl ?? "").trim() || undefined,
    annualRevenueBand: String(body.annualRevenueBand ?? "").trim() || undefined,
    bottleneckStatement,
    tierInterest: (String(body.tierInterest ?? "starter") as TierInterest),
    scanAnswers: (body.scanAnswers as ScanAnswers | undefined),
    path: body.path === "build" || body.path === "manage" || body.path === "opportunity" ? body.path : undefined,
  });

  const intakeResult = runIntakeAgent(newJob("intake", mission.missionId, { bottleneckStatement }));
  const diagnosticResult = runDiagnosticAgent(newJob("diagnostic", mission.missionId, {
    scanAnswers: mission.intake.scanAnswers,
  }));
  const proposalResult = runProposalAgent(newJob("proposal", mission.missionId, {
    intake: mission.intake,
    scanScore: diagnosticResult.data.scanScore,
  }));

  if (proposalResult.status === "ok") {
    mission.recommendedTier = proposalResult.data.tier as TierInterest;
    mission.recommendedPriceCents = Number(proposalResult.data.priceCents ?? 0);
  }
  if (diagnosticResult.status === "ok") {
    mission.evidence.push({
      id: mission.missionId,
      level: "E0_claim",
      notes: `Self-reported scan score ${String(diagnosticResult.data.scanScore)}`,
      recordedAt: new Date().toISOString(),
      recordedBy: "system",
    });
  }
  await persist(mission);

  if (clientEmail) {
    try {
      await recordLead({
        email: clientEmail,
        slug: "outcome-intake",
        capturedAt: Date.now(),
        utm: {},
        ref: null,
        capiFired: false,
      });
    } catch {}
  }

  return NextResponse.json({
    ok: true,
    mission: workspaceProjection(mission),
    agents: {
      intake: intakeResult,
      diagnostic: diagnosticResult,
      proposal: proposalResult,
    },
    evidenceRule: "Agent output is E0 until an artifact, live URL, or customer acceptance is attached.",
    next: "/outcome/intake?mission=" + mission.missionId,
  }, { status: 202 });
}
