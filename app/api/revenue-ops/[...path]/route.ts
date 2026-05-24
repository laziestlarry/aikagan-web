import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// AutonomaX Revenue Ops API Proxy
//
// Routes requests from the AIKAGAN frontend to the autonomax_revenue_ops
// Cloud Run backend. This proxy:
//   - Hides the Cloud Run URL from public clients
//   - Adds the AUTONOMAX_API_KEY Bearer token
//   - Strips request headers that should not be forwarded
//   - Has a 10-second timeout
//
// Usage:
//   GET  /api/revenue-ops/api/mission/status
//   GET  /api/revenue-ops/api/offers/ladder
//   GET  /api/revenue-ops/api/attribution/summary
//   POST /api/revenue-ops/api/mission/tick
// ─────────────────────────────────────────────────────────────────────────────

const BACKEND_URL = process.env.NEXT_PUBLIC_AUTONOMAX_API_URL
  ?? "https://autonomax-revenue-ops-71658389068.us-central1.run.app";
const API_KEY = process.env.AUTONOMAX_API_KEY ?? "";

// Headers to strip before forwarding
const STRIP_HEADERS = new Set([
  "host", "connection", "transfer-encoding", "te",
  "trailer", "upgrade", "keep-alive",
]);

async function proxyRequest(req: NextRequest, pathSegments: string[]) {
  const upstreamPath = "/" + pathSegments.join("/");
  const upstreamUrl = `${BACKEND_URL}${upstreamPath}${req.nextUrl.search}`;

  const forwardHeaders: HeadersInit = {};
  req.headers.forEach((value, key) => {
    if (!STRIP_HEADERS.has(key.toLowerCase())) {
      forwardHeaders[key] = value;
    }
  });
  if (API_KEY) forwardHeaders["Authorization"] = `Bearer ${API_KEY}`;
  forwardHeaders["X-Forwarded-By"] = "aikagan-proxy";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const body =
      req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
      signal: controller.signal,
    });

    const responseHeaders: HeadersInit = {};
    upstream.headers.forEach((value, key) => {
      if (!STRIP_HEADERS.has(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });
    // Allow the frontend to read JSON
    responseHeaders["Access-Control-Allow-Origin"] = "*";

    const responseBody = await upstream.arrayBuffer();
    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { error: isAbort ? "Upstream timeout" : "Upstream error" },
      { status: isAbort ? 504 : 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path);
}
export async function POST(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path);
}
export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path);
}
export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path);
}
