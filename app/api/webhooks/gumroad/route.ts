import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { verifyGumroadSale } from "@/lib/gumroad-api";
import { processVerifiedGumroadSale } from "@/lib/gumroad-fulfillment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);
    if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

    const saleId = String(formData.get("sale_id") ?? "").trim();
    const pingEmail = String(formData.get("email") ?? "").trim().toLowerCase();
    if (!saleId) return NextResponse.json({ error: "Missing sale_id" }, { status: 400 });

    const expectedToken = process.env.GUMROAD_WEBHOOK_TOKEN?.trim() ?? "";
    if (expectedToken) {
      const supplied = req.nextUrl.searchParams.get("token") ?? req.headers.get("x-gumroad-webhook-token") ?? "";
      if (!supplied || !safeEqual(expectedToken, supplied)) {
        return NextResponse.json({ error: "Invalid webhook token" }, { status: 401 });
      }
    }

    const verification = await verifyGumroadSale(saleId);
    if (!verification.verified || !verification.sale) {
      return NextResponse.json({ error: "Sale verification failed", detail: verification.detail }, { status: 401 });
    }

    const verifiedEmail = String(verification.sale.email ?? verification.sale.purchaser_email ?? "").trim().toLowerCase();
    if (pingEmail && verifiedEmail && pingEmail !== verifiedEmail) {
      return NextResponse.json({ error: "Buyer email mismatch" }, { status: 401 });
    }

    const result = await processVerifiedGumroadSale(verification.sale, {
      source: "gumroad_webhook",
      headers: req.headers,
    });
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    console.error("[gumroad-webhook] Processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
