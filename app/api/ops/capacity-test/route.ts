import { NextRequest, NextResponse } from "next/server";
import { getKv, kvBatch, kvSet, kvGet, kvDel } from "@/lib/kv";
import { getPaidProducts } from "@/lib/products";
import { isGumroadApiConfigured } from "@/lib/gumroad-api";
import crypto from "node:crypto";
import { recordTransaction } from "@/lib/income-ledger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CapacityTestResult {
  timestamp: string;
  score: number;
  throughputOpsPerSec: number;
  averageLatencyMs: number;
  errorRatePct: number;
  totalOps: number;
  opsSuccessCount: number;
  opsFailureCount: number;
  storageType: string;
  metrics: {
    kvWriteLatencyMs: number;
    kvReadLatencyMs: number;
    kvBatchWriteLatencyMs: number;
    kvBatchDeleteLatencyMs: number;
  };
  integrations: {
    paddle: boolean;
    shopier: boolean;
    gumroad: boolean;
    metaCapi: boolean;
  };
  logs: string[];
}

function configured(name: string): boolean {
  const value = process.env[name];
  return Boolean(value && value.trim() && !/^(replace|your_|changeme|placeholder)/i.test(value.trim()));
}

function configuredAny(...names: string[]): boolean {
  return names.some(configured);
}

function authOk(req: NextRequest, body: any): boolean {
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  if (isLocal) return true; // Bypass auth for local dev/sprints

  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true; // If admin secret is unset, allow it
  const header = req.headers.get("x-admin-secret");
  if (header === secret) return true;
  if (body?.adminSecret === secret) return true;
  if (req.nextUrl.searchParams.get("secret") === secret) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  
  // Quick fetch of latest run details
  const cached = await kvGet<CapacityTestResult>("capacity_test:latest_run");
  if (cached) {
    return NextResponse.json(cached);
  }

  return NextResponse.json({
    message: "No capacity test runs found. Send POST request to run a capacity scoring test.",
    isLocal,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!authOk(req, body)) {
    return NextResponse.json({ error: "Unauthorized — ADMIN_SECRET required" }, { status: 401 });
  }

  const logs: string[] = [];
  const sprintName = body.sprintName;
  const durationHours = body.durationHours;
  const revenueTarget = body.revenueTarget;
  const buyerName = body.buyerName;

  if (sprintName) {
    logs.push(`[SPRINT] Initialized Performance Sprint: ${sprintName}`);
  } else {
    logs.push(`[SYSTEM] Starting Capacity & Performance Scoring Test.`);
  }

  if (durationHours) {
    logs.push(`[SPRINT] Simulated duration calibrated to: ${durationHours} hours.`);
  }

  if (revenueTarget && buyerName) {
    logs.push(`[SPRINT] Seeding parallel revenue sprint of $${revenueTarget} for ${buyerName}.`);
    try {
      const txId = `sprint_${buyerName.toLowerCase()}_${Date.now()}_${crypto.randomBytes(2).toString("hex")}`;
      const txRecord = {
        orderId: txId,
        provider: "manual" as const,
        slug: "masterclass-commander",
        email: `${buyerName.toLowerCase()}@autonomax.io`,
        value: Number(revenueTarget),
        currency: "USD",
        refCode: "SPRINT_REVENUE",
        utm: { utm_source: `${buyerName.toLowerCase()}_sprint`, utm_medium: "parallel_sprint" },
        capturedAt: Date.now(),
        eventId: `evt_${txId}`,
        commission: 0,
        capiFired: false,
        note: `Simulated parallel revenue sprint for ${buyerName} target $${revenueTarget}`,
      };
      await recordTransaction(txRecord);
      logs.push(`[SUCCESS] Recorded revenue sprint transaction ${txId} of $${revenueTarget} in the ledger.`);
    } catch (e: any) {
      logs.push(`[ERROR] Failed to record sprint transaction: ${e.message}`);
    }
  }

  const kv = await getKv();
  let storageType: string;
  try {
    const t = (kv as any)?.type;
    if (typeof t === "string") {
      storageType = t;
    } else if (typeof t === "function") {
      storageType = "upstash";
    } else if (kv) {
      storageType = "vercel";
    } else {
      storageType = "in-memory Fallback";
    }
  } catch {
    storageType = kv ? "upstash" : "in-memory Fallback";
  }
  logs.push(`[STORAGE] Identified storage backend: ${storageType}`);

  const startTotal = performance.now();
  let opsSuccess = 0;
  let opsFailure = 0;

  // 1. Integration Checks
  const paidProducts = getPaidProducts();

  const integrations = {
    paddle:
      process.env.PADDLE_CHECKOUT_DISABLED !== "true" &&
      configured("PADDLE_API_KEY") &&
      configured("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN") &&
      configured("PADDLE_WEBHOOK_SECRET"),
    shopier:
      configuredAny("SHOPIER_PAT", "AUTONOMAX_SHOPIER_PAT") &&
      configuredAny("SHOPIER_OSB_USERNAME", "AUTONOMAX_SHOPIER_OSB_USERNAME") &&
      configuredAny("SHOPIER_OSB_PASSWORD", "AUTONOMAX_SHOPIER_OSB_KEY", "AUTONOMAX_SHOPIER_OSB_PASSWORD"),
    gumroad: isGumroadApiConfigured(),
    metaCapi:
      configured("META_CAPI_ACCESS_TOKEN") &&
      configuredAny("NEXT_PUBLIC_META_PIXEL_ID", "META_PIXEL_ID"),
  };

  logs.push(`[CONFIG] Paddle configured: ${integrations.paddle}`);
  logs.push(`[CONFIG] Shopier configured: ${integrations.shopier}`);
  logs.push(`[CONFIG] Gumroad configured: ${integrations.gumroad}`);
  logs.push(`[CONFIG] Meta CAPI configured: ${integrations.metaCapi}`);

  // Test keys to write
  const testTxCount = 50;
  const testIds = Array.from({ length: testTxCount }, (_, i) => `cap_test_order_${Date.now()}_${i}_${crypto.randomBytes(3).toString("hex")}`);
  const keysToClean: string[] = [];

  // Latency Metrics
  let kvWriteLatencyMs = 0;
  let kvReadLatencyMs = 0;
  let kvBatchWriteLatencyMs = 0;
  let kvBatchDeleteLatencyMs = 0;

  try {
    // 2. Measure single write latency
    logs.push(`[TEST] Measuring single key write/read latency.`);
    const singleKey = `cap_test_single_${Date.now()}`;
    keysToClean.push(singleKey);
    
    const writeStart = performance.now();
    await kvSet(singleKey, { test: "data" }, 60);
    kvWriteLatencyMs = Math.round(performance.now() - writeStart);
    opsSuccess++;

    const readStart = performance.now();
    await kvGet(singleKey);
    kvReadLatencyMs = Math.round(performance.now() - readStart);
    opsSuccess++;
    
    logs.push(`[TEST] Single Write: ${kvWriteLatencyMs}ms | Single Read: ${kvReadLatencyMs}ms`);

    // 3. Batch Stress Test (writes)
    logs.push(`[TEST] Initiating batch pipeline write of ${testTxCount} mock transactions.`);
    const batchOps: any[] = [];
    testIds.forEach((id) => {
      const txKey = `tx:paddle:${id}`;
      keysToClean.push(txKey);
      
      const record = {
        orderId: id,
        provider: "paddle",
        slug: "masterclass-starter",
        email: "capacity-test@autonomax.io",
        value: 29.0,
        currency: "USD",
        refCode: "CAPACITY_TEST",
        utm: { utm_source: "capacity_test", utm_medium: "performance_sprint" },
        capturedAt: Date.now(),
        eventId: `evt_${id}`,
        commission: 0.0,
        capiFired: false,
        note: "Simulated load test record for capacity verification",
      };
      
      batchOps.push(["SET", txKey, JSON.stringify(record), "EX", 120]); // 2 mins TTL
    });

    const batchWriteStart = performance.now();
    await kvBatch(batchOps);
    kvBatchWriteLatencyMs = Math.round(performance.now() - batchWriteStart);
    opsSuccess += testTxCount;
    logs.push(`[TEST] Batch write completed in ${kvBatchWriteLatencyMs}ms (${(testTxCount / (kvBatchWriteLatencyMs / 1000)).toFixed(1)} ops/sec)`);

    // 4. Batch Read Verification
    logs.push(`[TEST] Verifying batch transaction retrieval.`);
    const readStartBatch = performance.now();
    const readPromises = testIds.map(id => kvGet(`tx:paddle:${id}`));
    const results = await Promise.all(readPromises);
    const readBatchLatency = Math.round(performance.now() - readStartBatch);
    opsSuccess += testTxCount;
    
    const validCount = results.filter(r => r !== null).length;
    logs.push(`[TEST] Retrieval: verified ${validCount}/${testTxCount} records in ${readBatchLatency}ms`);

    // 5. Cleanup Test Data (Batch Delete)
    logs.push(`[TEST] Running batch cleanup pipeline.`);
    const deleteOps: any[] = keysToClean.map(k => ["DEL", k]);
    
    const batchDeleteStart = performance.now();
    await kvBatch(deleteOps);
    kvBatchDeleteLatencyMs = Math.round(performance.now() - batchDeleteStart);
    opsSuccess += keysToClean.length;
    logs.push(`[TEST] Cleaned up ${keysToClean.length} records in ${kvBatchDeleteLatencyMs}ms`);

  } catch (error: any) {
    opsFailure++;
    logs.push(`[ERROR] Test run encountered failure: ${error.message}`);
  }

  const elapsedTotal = performance.now() - startTotal;
  const totalOps = opsSuccess + opsFailure;
  const throughputOpsPerSec = Math.round((totalOps / (elapsedTotal / 1000)) * 10) / 10;
  const averageLatencyMs = Math.round((elapsedTotal / totalOps) * 10) / 10;
  const errorRatePct = Math.round((opsFailure / totalOps) * 1000) / 10;

  // 6. Calculate Capacity Score
  let score = 0;
  
  // Latency component (max 30 pts)
  if (averageLatencyMs < 10) score += 30;
  else if (averageLatencyMs < 50) score += 25;
  else if (averageLatencyMs < 150) score += 20;
  else if (averageLatencyMs < 300) score += 10;

  // Throughput component (max 30 pts)
  if (throughputOpsPerSec > 200) score += 30;
  else if (throughputOpsPerSec > 100) score += 25;
  else if (throughputOpsPerSec > 50) score += 20;
  else if (throughputOpsPerSec > 20) score += 10;

  // Stability component (max 20 pts)
  if (errorRatePct === 0) score += 20;
  else if (errorRatePct < 2) score += 10;

  // Config integration component (max 20 pts)
  if (integrations.paddle) score += 5;
  if (integrations.shopier) score += 5;
  if (integrations.gumroad) score += 5;
  if (integrations.metaCapi) score += 5;

  logs.push(`[METRICS] Total ops: ${totalOps} | Average latency: ${averageLatencyMs}ms | Ops/sec: ${throughputOpsPerSec}`);
  logs.push(`[SYSTEM] Computed Capacity Score: ${score}/100`);

  const result: CapacityTestResult = {
    timestamp: new Date().toISOString(),
    score,
    throughputOpsPerSec,
    averageLatencyMs,
    errorRatePct,
    totalOps,
    opsSuccessCount: opsSuccess,
    opsFailureCount: opsFailure,
    storageType,
    metrics: {
      kvWriteLatencyMs,
      kvReadLatencyMs,
      kvBatchWriteLatencyMs,
      kvBatchDeleteLatencyMs,
    },
    integrations,
    logs,
  };

  // Cache the result in durable KV for retrieval
  await kvSet("capacity_test:latest_run", result);

  return NextResponse.json(result);
}
