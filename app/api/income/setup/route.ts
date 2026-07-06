/**
 * GET /api/income/setup
 *
 * Returns the exact list of env vars the operator must set in Vercel for
 * the income generation system to be fully live. Public, read-only.
 *
 * Each entry has:
 *   - key, where, required, format, currentStatus, instructions, optionality
 *
 * Designed so the operator can copy this JSON into a checklist and tick
 * each item as it gets set. After setting all required vars and
 * redeploying, the same /api/health endpoint will report ok: true.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface EnvEntry {
  key: string;
  required: boolean;
  status: "set" | "missing";
  where: string;
  how: string;
  generate?: string;
  notes?: string;
}

function status(key: string): "set" | "missing" {
  return Boolean(process.env[key]) ? "set" : "missing";
}

export async function GET() {
  const entries: EnvEntry[] = [
    // Critical (system won't run without these)
    {
      key: "PADDLE_API_KEY",
      required: true,
      status: status("PADDLE_API_KEY"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "vendors.paddle.com → Developer Tools → Authentication → API key",
    },
    {
      key: "PADDLE_WEBHOOK_SECRET",
      required: true,
      status: status("PADDLE_WEBHOOK_SECRET"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "vendors.paddle.com → Developer Tools → Webhooks → Add endpoint (https://aikagan.com/api/webhooks/paddle) → copy secret",
    },
    {
      key: "DOWNLOAD_TOKEN_SECRET",
      required: true,
      status: status("DOWNLOAD_TOKEN_SECRET"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "Run locally: openssl rand -hex 32",
      generate: "openssl rand -hex 32",
    },
    {
      key: "KV_REST_API_URL",
      required: true,
      status: status("KV_REST_API_URL"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "Option A: Vercel Pro — Vercel → Storage → KV → connect → copy env. Option B (Hobby, free): upstash.com → Create Redis DB → REST → copy REST URL",
      notes: "Required for the income evidence ledger to survive across serverless instances. Without it, the in-memory fallback works but resets on every cold start.",
    },
    {
      key: "KV_REST_API_TOKEN",
      required: true,
      status: status("KV_REST_API_TOKEN"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "Same source as KV_REST_API_URL",
    },
    {
      key: "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN",
      required: true,
      status: status("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "Paddle → Developer Tools → Client-side tokens",
      notes: "Used by Paddle.js overlay. Without it, the checkout button falls back to the manual-checkout page (still works).",
    },
    // Important for analytics / attribution
    {
      key: "NEXT_PUBLIC_GA_ID",
      required: false,
      status: status("NEXT_PUBLIC_GA_ID"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "analytics.google.com → Admin → Data Streams → copy Measurement ID (G-XXXXXXX)",
    },
    {
      key: "NEXT_PUBLIC_META_PIXEL_ID",
      required: false,
      status: status("NEXT_PUBLIC_META_PIXEL_ID"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "Meta Events Manager → Settings → Copy Pixel ID",
    },
    {
      key: "META_CAPI_ACCESS_TOKEN",
      required: false,
      status: status("META_CAPI_ACCESS_TOKEN"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "Meta Events Manager → Settings → Generate Access Token (long-lived)",
      notes: "Without this, CAPI Purchase/Lead events are recorded as 'dropped' in the audit log. Browser-side Pixel still fires (if NEXT_PUBLIC_META_PIXEL_ID is set).",
    },
    {
      key: "NEXT_PUBLIC_SITE_URL",
      required: false,
      status: status("NEXT_PUBLIC_SITE_URL"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "Set to https://aikagan.com (or your custom domain)",
    },
    // Security
    {
      key: "ADMIN_SECRET",
      required: false,
      status: status("ADMIN_SECRET"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "Run locally: openssl rand -hex 32",
      generate: "openssl rand -hex 32",
      notes: "Required to access /admin/income and /api/admin/affiliates. Without it, admin routes are 401.",
    },
    {
      key: "CRON_SECRET",
      required: false,
      status: status("CRON_SECRET"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "Run locally: openssl rand -hex 32",
      generate: "openssl rand -hex 32",
      notes: "Required so Vercel Cron can call /api/cron/affiliate-payouts and /api/cron/weekly-intelligence. Vercel auto-injects it.",
    },
    // Optional backends
    {
      key: "NEXT_PUBLIC_AUTONOMAX_API_URL",
      required: false,
      status: status("NEXT_PUBLIC_AUTONOMAX_API_URL"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "URL of the AutonomaX revenue-ops backend (Fly.io / Cloud Run)",
    },
    {
      key: "NEXT_PUBLIC_FASTAPI_URL",
      required: false,
      status: status("NEXT_PUBLIC_FASTAPI_URL"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "URL of the FastAPI services backend",
    },
    {
      key: "AUTONOMAX_API_KEY",
      required: false,
      status: status("AUTONOMAX_API_KEY"),
      where: "Vercel → Project → Settings → Environment Variables",
      how: "Internal bearer token for AutonomaX backend",
    },
  ];

  const required = entries.filter((e) => e.required);
  const missingRequired = required.filter((e) => e.status === "missing");
  const ready = missingRequired.length === 0;

  return NextResponse.json(
    {
      ok: ready,
      summary: {
        total: entries.length,
        required: required.length,
        missing_required: missingRequired.length,
        ready,
      },
      required_now: missingRequired.map((e) => ({
        key: e.key,
        how: e.how,
        notes: e.notes,
        generate: e.generate,
      })),
      all: entries,
      next_step: ready
        ? "All required env vars are set. The funnel is live. Optional vars can be added later for full analytics attribution."
        : `Set ${missingRequired.length} required env var(s), then redeploy. After redeploy, /api/health will report ok: true.`,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
