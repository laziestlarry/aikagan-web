import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_SPRINTS = new Set(["2k$2hrs", "jim"]);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const sprintId = body?.sprintId;
  if (!sprintId || !ALLOWED_SPRINTS.has(sprintId)) {
    return NextResponse.json(
      { error: "sprintId required (2k$2hrs or jim)" },
      { status: 400 },
    );
  }

  const isParallel = body?.parallel !== false;
  const endpoint = `${req.nextUrl.origin}/api/ops/capacity-test`;

  const sprint1 = {
    sprintName: "2k$2hrs Parallel Performance Sprint",
    durationHours: 2200,
  };
  const sprint2 = {
    sprintName: "Jim $2000 Parallel Revenue Sprint",
    buyerName: "Jim",
    revenueTarget: 2000,
  };

  const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.ADMIN_SECRET) authHeaders["x-admin-secret"] = process.env.ADMIN_SECRET;

  async function fire(payload: any, prefix: string) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ ...payload, adminSecret: process.env.ADMIN_SECRET || "" }),
    });
    if (!res.ok) {
      return { ok: false, status: res.status, body: await res.text(), prefix };
    }
    const data = await res.json();
    return { ok: true, prefix, data };
  }

  if (sprintId === "2k$2hrs") {
    const result = await fire(sprint1, "parallel-sprint-2k$2hrs");
    return NextResponse.json({ mode: "single", result });
  }
  if (sprintId === "jim") {
    const result = await fire(sprint2, "parallel-sprint-jim");
    return NextResponse.json({ mode: "single", result });
  }
  return NextResponse.json({ error: "unreachable" }, { status: 500 });
}
