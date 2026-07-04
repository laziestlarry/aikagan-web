// This legacy endpoint is replaced by /api/paddle-checkout.
// Payments are now handled via Paddle Billing.
// Keep this file for backward compatibility only.

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Use /api/paddle-checkout instead." },
    { status: 410 }
  );
}
