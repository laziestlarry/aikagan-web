/**
 * GET /api/income/debug
 *
 * Diagnostic endpoint. Returns what the kv wrapper actually returns for a
 * few representative keys. ADMIN_SECRET gated.
 */

import { NextRequest, NextResponse } from "next/server";
import { getKv, kvGet, kvSet } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  const provided = req.headers.get("x-admin-secret") ?? req.nextUrl.searchParams.get("secret") ?? "";
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kv = await getKv();
  const type: string = kv?.type ?? "memory";

  // Probe keys via the wrapper AND directly
  const testKeys = [
    "pv:2026-07-07:count",
    "p:2026-07-07:count",
    "p:2026-07-07:revenue_cents",
  ];
  // Also do a manual pipeline test to see what the function actually sends
  let manualPipelineTest: { body?: string; response?: string; status?: number; resultType?: string; resultLength?: number; error?: string } | null = null;
  const wrapperProbes: Array<{ key: string; value: unknown; typeOf: string }> = [];
  for (const k of testKeys) {
    const v = await kvGet(k);
    wrapperProbes.push({ key: k, value: v, typeOf: v === null ? "null" : typeof v });
  }

  // Try a key we KNOW the function just wrote (the debug:probe key from writeThenRead)
  const knownKey = "debug:probe:exists:1";
  await kvSet(knownKey, "marker");
  const knownReadBack = await kvGet(knownKey);
  const knownReadBack2 = await kvGet(knownKey); // read again to ensure no caching

  // Also: do the same test with a counter-shaped key (matches the income ledger keys)
  const counterKey = `debug:counter:${Date.now()}`;
  await kvSet(counterKey, "999");
  const counterRead1 = await kvGet(counterKey);
  const counterRead2 = await kvGet(counterKey);

  // Manual pipeline test
  try {
    const body = JSON.stringify([["GET", "pv:2026-07-07:count"]]);
    const url = (process.env.KV_REST_API_URL ?? "").replace(/\/+$/, "");
    const token = process.env.KV_REST_API_TOKEN ?? "";
    const r = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });
    const responseText = await r.text();
    const parsed = JSON.parse(responseText) as { result?: unknown[] };
    manualPipelineTest = {
      body,
      status: r.status,
      response: responseText.slice(0, 200),
      resultType: Array.isArray(parsed?.result) ? (parsed.result.length > 0 ? typeof (parsed.result as unknown[])[0] : "empty") : "not-array",
      resultLength: Array.isArray(parsed?.result) ? (parsed.result as unknown[]).length : 0,
    };
  } catch (err) {
    manualPipelineTest = { body: "err", response: String(err), status: 0 };
  }

  // Call the wrapper's call function directly to compare
  let wrapperDirectCall: { result: unknown; type: string } | null = null;
  try {
    const kv = await getKv();
    if (kv && kv.type === "upstash") {
      const uc = kv as unknown as { pipeline: (cmds: unknown[][]) => Promise<unknown[]> };
      const out = await uc.pipeline([["GET", "pv:2026-07-07:count"]]);
      wrapperDirectCall = {
        result: out,
        type: Array.isArray(out) ? (out.length > 0 ? typeof out[0] : "empty") : "not-array",
      };
    }
  } catch (err) {
    wrapperDirectCall = { result: String(err), type: "error" } as { result: unknown; type: string };
  }

  // Direct call
  const directProbes: Array<{ key: string; raw: unknown }> = [];
  let directPing: { status: number; body: unknown } | null = null;
  let writeThenRead: { writeStatus: number; readStatus: number; writeBody: string; readBody: string } | null = null;
  let singleEndpointProbe: { status: number; body: string } | null = null;
  if (type === "upstash") {
    const url = `${(process.env.KV_REST_API_URL ?? "").replace(/\/+$/, "")}/pipeline`;
    // First try PING
    try {
      const pr = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN ?? ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([["PING"]]),
        cache: "no-store",
      });
      const pbody = await pr.text();
      directPing = { status: pr.status, body: pbody.slice(0, 200) };
    } catch (err) {
      directPing = { status: 0, body: String(err) };
    }
    // Then the actual GETs — use root endpoint (Upstash's canonical URL)
    const r = await fetch(`${url}?_t=${Date.now()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testKeys.map((k) => ["GET", k])),
      cache: "no-store",
    });
    const out = await r.json();
    const arr = (out?.result ?? []) as unknown[];
    for (let i = 0; i < testKeys.length; i++) {
      directProbes.push({ key: testKeys[i] as string, raw: arr[i] ?? null });
    }
    // Write-then-read test using a unique key
    const testKey = `debug:probe:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    const wr = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([["SET", testKey, "hello"], ["GET", testKey]]),
      cache: "no-store",
    });
    writeThenRead = {
      writeStatus: wr.status,
      readStatus: wr.status,
      writeBody: (await wr.text()).slice(0, 300),
      readBody: "",
    };
  }

  return NextResponse.json({
    kvType: type,
    envPresent: {
      KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
      KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
      NEXT_PUBLIC_META_PIXEL_ID: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
      META_CAPI_ACCESS_TOKEN: Boolean(process.env.META_CAPI_ACCESS_TOKEN),
    },
    envValues: {
      KV_REST_API_URL: (process.env.KV_REST_API_URL ?? "").slice(0, 50),
      KV_REST_API_TOKEN_length: (process.env.KV_REST_API_TOKEN ?? "").length,
      KV_REST_API_TOKEN_prefix: (process.env.KV_REST_API_TOKEN ?? "").slice(0, 12),
      KV_REST_API_TOKEN_suffix: (process.env.KV_REST_API_TOKEN ?? "").slice(-4),
      NEXT_PUBLIC_META_PIXEL_ID: (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").slice(0, 30),
      META_CAPI_ACCESS_TOKEN_length: (process.env.META_CAPI_ACCESS_TOKEN ?? "").length,
      META_CAPI_ACCESS_TOKEN_prefix: (process.env.META_CAPI_ACCESS_TOKEN ?? "").slice(0, 12),
      META_CAPI_ACCESS_TOKEN_suffix: (process.env.META_CAPI_ACCESS_TOKEN ?? "").slice(-4),
    },
    directPing,
    writeThenRead,
    knownKeyWriteRead: { key: knownKey, after1stRead: knownReadBack, after2ndRead: knownReadBack2 },
    counterTest: { key: counterKey, after1st: counterRead1, after2nd: counterRead2 },
    manualPipelineTest,
    wrapperDirectCall,
    wrapperProbes,
    directProbes,
    singleEndpointProbe,
    directCapiFire,
  });
}
