import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REPORTS_DIR = path.join(process.cwd(), "reports");
const ALLOWED = new Set([
  "parallel-sprint-2k2hrs.json",
  "parallel-sprint-2k2hrs.md",
  "parallel-sprint-2k2hrs.json",
  "parallel-sprint-2k2hrs.md",
  "parallel-sprint-jim.json",
  "parallel-sprint-jim.md",
]);

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file") || "";
  if (!ALLOWED.has(file)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const full = path.join(REPORTS_DIR, file);
  try {
    const raw = await fs.readFile(full, "utf-8");
    if (file.endsWith(".json")) {
      return NextResponse.json(JSON.parse(raw));
    }
    return new NextResponse(raw, {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
