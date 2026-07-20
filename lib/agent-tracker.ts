import { getKv, kvSet, kvLpush, kvLrange } from "./kv";

const ACTIVITY_TTL_S = 90 * 24 * 60 * 60;
const ACTIVITY_LOG_KEY = "agent:activity:recent";

export interface AgentActivity {
  agentName: string;
  runMode: string;
  status: "success" | "failed";
  startedAt: string;
  durationMs: number;
  summary: string;
  outputCount?: number;
}

export async function recordAgentActivity(activity: AgentActivity): Promise<void> {
  try {
    const kv = await getKv();
    if (!kv) return;
    const entry = JSON.stringify({ ...activity, recordedAt: new Date().toISOString() });
    await kvLpush(ACTIVITY_LOG_KEY, entry, ACTIVITY_TTL_S);
  } catch {
    // silent — tracking is non-critical
  }
}

export async function getRecentAgentActivity(limit = 10): Promise<AgentActivity[]> {
  try {
    const kv = await getKv();
    if (!kv) return [];
    const entries = await kvLrange<string>(ACTIVITY_LOG_KEY, 0, limit - 1);
    return entries.map((e) => (typeof e === "string" ? JSON.parse(e) : e)).filter(Boolean);
  } catch {
    return [];
  }
}

export function makeAgentActivity(
  agentName: string,
  runMode: string,
  status: "success" | "failed",
  durationMs: number,
  summary: string,
  outputCount?: number,
): AgentActivity {
  return {
    agentName,
    runMode,
    status,
    startedAt: new Date().toISOString(),
    durationMs,
    summary,
    outputCount,
  };
}
