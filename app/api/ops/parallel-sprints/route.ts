import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REPORTS_DIR = path.join(process.cwd(), "reports");
const SPRINT_FILES = [
  { id: "2k$2hrs", name: "2k$2hrs Parallel Performance Sprint", prefix: "parallel-sprint-2k$2hrs" },
  { id: "2k2hrs", name: "2k2hrs Parallel Performance Sprint (legacy)", prefix: "parallel-sprint-2k2hrs" },
  { id: "jim", name: "Jim $2000 Parallel Revenue Sprint", prefix: "parallel-sprint-jim" },
];

async function readJsonSafe(p: string) {
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest) {
  const sprints = await Promise.all(
    SPRINT_FILES.map(async (s) => {
      const jsonPath = path.join(REPORTS_DIR, `${s.prefix}.json`);
      const mdPath = path.join(REPORTS_DIR, `${s.prefix}.md`);
      const data = await readJsonSafe(jsonPath);
      let mdAvailable = false;
      try {
        await fs.stat(mdPath);
        mdAvailable = true;
      } catch {
        mdAvailable = false;
      }
      return {
        id: s.id,
        name: s.name,
        prefix: s.prefix,
        latest: data,
        mdAvailable,
        jsonAvailable: data !== null,
        jsonPath: data ? `/api/ops/parallel-sprints/report?file=${s.prefix}.json` : null,
        mdPath: mdAvailable ? `/api/ops/parallel-sprints/report?file=${s.prefix}.md` : null,
      };
    }),
  );

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    sprints,
  });
}
