// ─────────────────────────────────────────────────────────────────────────────
// POST /api/gumroad-checkout
//
// Returns a Gumroad checkout URL for the given product slug.
// Gumroad is a Merchant of Record — handles payment, tax, and delivery.
//
// Environment:
//   GUMROAD_ACCESS_TOKEN  — set in Vercel for license verification / webhooks
//
// Product URLs are pre-configured in lib/gumroad-products.ts.
// Webhook: POST /api/webhooks/gumroad (set up in Gumroad dashboard)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { getGumroadProduct } from "@/lib/gumroad-products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const slug = body?.slug;
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Missing or invalid slug" }, { status: 400 });
    }

    const product = getProduct(slug);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 404 });
    }
    if (!product.price || product.priceModel === "free") {
      return NextResponse.json({ error: "Free products do not need checkout" }, { status: 400 });
    }

    const hasToken = Boolean(process.env.GUMROAD_ACCESS_TOKEN);
    if (!hasToken) {
      return NextResponse.json(
        { error: "Gumroad not configured (set GUMROAD_ACCESS_TOKEN)" },
        { status: 503 }
      );
    }

    const gumroadProduct = getGumroadProduct(slug);
    if (!gumroadProduct) {
      return NextResponse.json(
        { error: `No Gumroad product for slug: ${slug}` },
        { status: 404 }
      );
    }

    // Apply coupon override if present
    let url = gumroadProduct.url;
    const coupon = body?.coupon;
    if (coupon) {
      // For test coupon, we just pass it as a query param — Gumroad itself
      // won't apply it, but our system will recognize it in the webhook/flow
      url = `${url}?coupon=${encodeURIComponent(coupon)}`;
    }

    // Add attribution params
    const ref = body?.ref;
    if (ref) {
      url += `${url.includes("?") ? "&" : "?"}ref=${encodeURIComponent(ref)}`;
    }

    console.log("✅ Gumroad checkout:", {
      slug,
      url,
      price: product.price,
      coupon: coupon ?? null,
    });

    return NextResponse.json({
      url,
      transactionId: gumroadProduct.id,
    });
  } catch (err: any) {
    console.error("❌ Gumroad checkout error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to create Gumroad checkout" },
      { status: 500 }
    );
  }
}
