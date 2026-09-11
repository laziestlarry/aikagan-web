import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Legacy compatibility endpoint.
 *
 * /api/income/checkout is the single checkout authority for product validation,
 * intent attribution, provider selection and fallback policy. Keep this route
 * only so older clients do not bypass those controls.
 */
export async function POST(req: NextRequest) {
  const target = new URL("/api/income/checkout", req.url);
  const body = await req.text();
  const response = await fetch(target, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") || "application/json",
      "user-agent": req.headers.get("user-agent") || "aikagan-gumroad-compat",
      "x-forwarded-host": req.headers.get("host") || "",
    },
    body,
    cache: "no-store",
  });

  const payload = await response.text();
  return new NextResponse(payload, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "application/json",
      "cache-control": "no-store, max-age=0",
      "x-aikagan-checkout-authority": "/api/income/checkout",
    },
  });
}
