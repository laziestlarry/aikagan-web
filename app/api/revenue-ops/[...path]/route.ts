/**
 * Revenue Ops API Proxy
 *
 * Forwards /api/revenue-ops/... to the AutonomaX backend.
 *
 * GET  /api/revenue-ops/api/dashboard
 * GET  /api/revenue-ops/api/financials
 * GET  /api/revenue-ops/api/profit-intelligence
 * POST /api/revenue-ops/api/mission/tick   (etc.)
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTONOMAX_API_URL ||
  "https://autonomax-revenue-lenljbhrqq-uc.a.run.app";
const API_KEY = process.env.AUTONOMAX_API_KEY ?? "";

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const path = (await ctx.params).path;
  const cleanPath = path.filter(Boolean).join("/");
  const url = `${BACKEND_URL.replace(/\/+$/, "")}/${cleanPath}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${API_KEY}`,
    "X-Forwarded-By": "aikagan-revenue-ops-proxy",
  };
  req.headers.forEach((v, k) => {
    if (!["host", "connection", "content-length", "transfer-encoding"].includes(k.toLowerCase())) {
      headers[k] = v;
    }
  });

  try {
    const res = await fetch(url, { method: req.method, headers, redirect: "follow" });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    console.error(`[revenue-ops-proxy] ${req.method} ${url} — ${err}`);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
