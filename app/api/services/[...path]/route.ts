/**
 * Services API Proxy
 *
 * Forwards /api/services/... to the AutonomaX backend, with a short-circuit
 * for `/api/services/affiliates` which is served from the local Vercel KV
 * affiliate store (real data, not the mock that the backend used to return).
 *
 * GET  /api/services/crm/stats
 * GET  /api/services/affiliates  → local KV (real)
 * POST /api/services/chat/message (etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { listAffiliates } from "@/lib/referral";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_FASTAPI_URL ??
  "https://autonomax-revenue-ops-backend.fly.dev";

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const path = (await ctx.params).path;
  const cleanPath = path.filter(Boolean).join("/");

  // Local short-circuit: /api/services/affiliates is served from KV
  if (req.method === "GET" && cleanPath === "affiliates") {
    const list = await listAffiliates();
    const safe = list.map((a) => ({
      id: a.code,
      name: a.name,
      email: a.email.replace(/(.{2}).*(@.*)/, "$1***$2"),
      status: a.paidCommission > 0 ? "active" : "pending",
      commission_rate: 0.25,
      referrals: a.totalConversions,
      earned: a.totalCommission,
      paid: a.paidCommission,
    }));
    return NextResponse.json(
      { total: safe.length, affiliates: safe, source: "kv" },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }

  const url = `${BACKEND_URL.replace(/\/+$/, "")}/api/${cleanPath}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    "X-Forwarded-By": "aikagan-services-proxy",
  };
  req.headers.forEach((v, k) => {
    if (!["host", "connection", "content-length", "transfer-encoding"].includes(k.toLowerCase())) {
      headers[k] = v;
    }
  });

  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

  try {
    const res = await fetch(url, { method: req.method, headers, body, redirect: "follow" });
    const responseBody = await res.text();
    return new NextResponse(responseBody, {
      status: res.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    console.error(`[services-proxy] ${req.method} ${url} — ${err}`);
    return NextResponse.json({ error: "Service unavailable" }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
