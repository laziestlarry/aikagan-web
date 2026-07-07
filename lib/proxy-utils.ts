/**
 * Shared proxy utilities for Vercel → backend API proxying.
 *
 * Provides:
 *  - fetchWithTimeout  — abortable fetch with configurable timeout
 *  - buildResponse    — uniform response builder (text body, stripped headers, CORS)
 *  - stripHeaders     — remove hop-by-hop headers from request/forward maps
 *  - proxyRequest     — full proxy loop: forward → fetch → retry → respond
 *
 * Usage in [...path]/route.ts:
 *
 *   import { proxyRequest } from "@/lib/proxy-utils";
 *
 *   const BACKEND = process.env.NEXT_PUBLIC_MY_API_URL ?? "https://...";
 *   const API_KEY = process.env.MY_API_KEY ?? "";
 *
 *   function reqHandler(req: NextRequest, ctx: RouteContext) { … }
 *   export const GET = reqHandler;  POST = reqHandler;  …
 */

import { NextRequest, NextResponse } from "next/server";

// ─── Types ───────────────────────────────────────────────────────────────────

export type RouteContext = { params: Promise<{ path: string[] }> };

export interface ProxyOptions {
  /** Backend base URL (scheme + host, no trailing slash). */
  backendUrl: string;
  /** API key sent as Bearer token. Empty string = no auth header. */
  apiKey?: string;
  /** Request timeout in ms. Default 10 000. */
  timeoutMs?: number;
  /** Max retries for idempotent (GET/HEAD) requests. Default 1. */
  maxRetries?: number;
  /** Prefix added before the catch-all path segments (e.g. "/api"). */
  pathPrefix?: string;
  /** Name logged in X-Forwarded-By header. */
  forwarderName?: string;
  /** Extra headers to always inject (e.g. custom auth). */
  extraHeaders?: Record<string, string>;
}

interface ProxyResult {
  response: NextResponse<unknown>;
}

// ─── Hop-by-hop headers that MUST NOT be forwarded ───────────────────────────

const HOP_BY_HOP = new Set([
  "host",
  "connection",
  "transfer-encoding",
  "content-length",
  "te",
  "trailer",
  "upgrade",
  "keep-alive",
]);

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Fetch with a timeout via AbortController.  Cleans up the timer in all
 * paths (resolve, reject, abort) so we never leave dangling timers.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Clean a headers object/iterator of hop-by-hop headers.
 * Works with Headers, Record<string,string>, or HeadersInit arrays.
 *
 * When `source` is a Headers object (Response/Request.headers), iterates
 * with `.forEach()` and writes to a plain Record.
 *
 * When `source` is already a plain object, mutates and returns it.
 */
export function stripHopByHop(
  source: Headers | Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  // Headers.forEach exists on both Headers and Map-like objects
  if (typeof (source as Headers).forEach === "function" && !Array.isArray(source)) {
    (source as Headers).forEach((value, key) => {
      if (!HOP_BY_HOP.has(key.toLowerCase())) {
        out[key] = value;
      }
    });
  } else {
    const src = source as Record<string, string>;
    for (const key of Object.keys(src)) {
      if (!HOP_BY_HOP.has(key.toLowerCase())) {
        out[key] = src[key];
      }
    }
  }
  return out;
}

/**
 * Build a NextResponse from an upstream fetch Response.
 * - Reads body as text (most portable across Vercel runtimes)
 * - Strips hop-by-hop response headers
 * - Injects CORS + content-type
 */
export async function buildResponse(upstream: Response): Promise<NextResponse> {
  const body = await upstream.text();
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
  };

  // Forward safe response headers
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  return new NextResponse(body, {
    status: upstream.status,
    headers,
  });
}

// ─── Main proxy loop ─────────────────────────────────────────────────────────

/**
 * Execute one proxied request: build upstream URL → forward headers →
 * fetch (with timeout) → retry on 5xx for idempotent → build response.
 *
 * Returns a NextResponse (either the proxied payload or an error JSON).
 */
export async function proxyRequest(
  req: NextRequest,
  pathSegments: string[],
  opts: ProxyOptions,
): Promise<NextResponse> {
  const {
    backendUrl,
    apiKey = "",
    timeoutMs = 10_000,
    maxRetries = 1,
    pathPrefix = "",
    forwarderName = "aikagan-proxy",
    extraHeaders = {},
  } = opts;

  const method = req.method.toUpperCase();
  const isIdempotent = method === "GET" || method === "HEAD";

  // Filter empty segments caused by Vercel trailing-slash redirects
  const cleanPath = pathSegments.filter(Boolean).join("/");
  const prefix = pathPrefix.replace(/^\/+|\/+$/g, ""); // strip leading/trailing slashes
  const upstreamPath = prefix ? `${prefix}/${cleanPath}` : cleanPath;
  const upstreamUrl = `${backendUrl.replace(/\/+$/, "")}/${upstreamPath}${req.nextUrl.search}`;

  // Build forwarded headers
  const forwardHeaders: Record<string, string> = {
    ...extraHeaders,
    "X-Forwarded-By": forwarderName,
  };
  if (apiKey) {
    forwardHeaders["Authorization"] = `Bearer ${apiKey}`;
  }

  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      // Don't override explicit headers above
      if (!(key in forwardHeaders)) {
        forwardHeaders[key] = value;
      }
    }
  });

  // Read request body for non-idempotent methods
  const body = isIdempotent ? undefined : await req.text();

  // Attempt + optional retry
  const attempt = (): Promise<Response> =>
    fetchWithTimeout(upstreamUrl, { method, headers: forwardHeaders, body }, timeoutMs);

  let upstream: Response;
  try {
    upstream = await attempt();
    if (isIdempotent && upstream.status >= 500 && maxRetries > 0) {
      console.warn(
        `[proxy] Retrying ${method} ${upstreamPath} (HTTP ${upstream.status})`,
      );
      upstream = await attempt();
    }
  } catch (err: unknown) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    const status = isAbort ? 504 : 502;
    const message = isAbort ? "Upstream timeout" : "Upstream error";
    console.error(`[proxy] ${method} ${upstreamPath} → ${message}:`, err);
    return NextResponse.json({ error: message, path: upstreamPath }, { status });
  }

  return buildResponse(upstream);
}
