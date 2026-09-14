import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_SESSION_COOKIE, verifyCustomerSession } from "@/lib/customer-session";
import { clientKey, rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { addEvidence, getMission, persist, signAcceptance, workspaceProjection } from "@/lib/outcomeos/store";
import { advanceStage, StageGateError } from "@/lib/outcomeos/stage-gate";
import { type EvidenceLevel } from "@/lib/outcomeos/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function canAccess(req: NextRequest, email?: string): boolean {
  const adminSecret = process.env.ADMIN_SECRET?.trim();
  if (adminSecret && req.headers.get("x-admin-secret") === adminSecret) return true;
  const session = verifyCustomerSession(req.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  if (!session) return false;
  return Boolean(email && session.email === email);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mission = await getMission(id);
  if (!mission) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canAccess(req, mission.intake.clientEmail)) {
    return NextResponse.json({
      mission: {
        id: mission.missionId,
        stage: mission.stage,
        evidenceLevel: mission.currentLevel,
        status: mission.status,
        nextAction: mission.nextAction,
      },
      redacted: true,
    });
  }
  return NextResponse.json({ mission: workspaceProjection(mission), record: mission });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limit = rateLimit({ key: clientKey(req, "outcome-mission"), max: 20, windowMs: 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit);

  const { id } = await params;
  const mission = await getMission(id);
  if (!mission) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canAccess(req, mission.intake.clientEmail)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "invalid_json" }, { status: 400 });

  try {
    if (body.action === "sign_acceptance") {
      const signed = await signAcceptance(id);
      return NextResponse.json({ mission: workspaceProjection(signed) });
    }
    if (body.action === "add_evidence") {
      const level = String(body.level ?? "") as EvidenceLevel;
      const updated = await addEvidence(id, {
        level,
        artifactUrl: typeof body.artifactUrl === "string" ? body.artifactUrl : undefined,
        notes: typeof body.notes === "string" ? body.notes : undefined,
        recordedBy: "human",
      });
      return NextResponse.json({ mission: workspaceProjection(updated) });
    }
    if (body.action === "advance") {
      const advanced = await persist(advanceStage(mission));
      return NextResponse.json({ mission: workspaceProjection(advanced) });
    }
    return NextResponse.json({ error: "unknown_action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof StageGateError || error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
