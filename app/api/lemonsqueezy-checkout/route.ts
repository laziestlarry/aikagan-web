// ─────────────────────────────────────────────────────────────────────────────
// POST /api/lemonsqueezy-checkout
//
// Creates a LemonSqueezy checkout URL for a product. LemonSqueezy is the
// fallback provider when Paddle is unavailable.
//
// Required env (set when ready to enable):
//   LEMONSQUEEZY_API_KEY         — ls_… API token from Settings > API
//   LEMONSQUEEZY_STORE_ID        — numeric store id
//   LEMONSQUEEZY_VARIANT_<SLUG>  — variant id per product (e.g. LEMONSQUEEZY_VARIANT_MASTERCLASS_STARTER)
//
// Custom data carries ref_code and UTM params; webhook reads them at /api/webhooks/lemonsqueezy.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { tokenStore } from "@/lib/token-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = "https://api.lemonsqueezy.com/v1";

interface VariantEnvMap {
  [slug: string]: string | undefined;
}

function readVariantIds(): VariantEnvMap {
  return {
    "masterclass-starter": process.env.LEMONSQUEEZY_VARIANT_MASTERCLASS_STARTER,
    "masterclass-pro": process.env.LEMONSQUEEZY_VARIANT_MASTERCLASS_PRO,
    "masterclass-commander": process.env.LEMONSQUEEZY_VARIANT_MASTERCLASS_COMMANDER,
    "golden-delivery-starter": process.env.LEMONSQUEEZY_VARIANT_GOLDEN_STARTER,
    "golden-delivery-pro": process.env.LEMONSQUEEZY_VARIANT_GOLDEN_PRO,
    "golden-delivery-commander": process.env.LEMONSQUEEZY_VARIANT_GOLDEN_COMMANDER,
  };
}

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

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    if (!apiKey || !storeId) {
      return NextResponse.json(
        { error: "LemonSqueezy not configured (set LEMONSQUEEZY_API_KEY and LEMONSQUEEZY_STORE_ID)" },
        { status: 503 }
      );
    }

    const variantId = readVariantIds()[slug];
    if (!variantId) {
      return NextResponse.json(
        { error: `No LemonSqueezy variant id for slug: ${slug}. Set LEMONSQUEEZY_VARIANT_${slug.replace(/-/g, "_").toUpperCase()}.` },
        { status: 503 }
      );
    }

    const customData = (body?.customData ?? {}) as Record<string, string>;
    // ref_code from customData (passed by checkout router) or directly from body.ref
    const ref = customData.ref_code || body?.ref || null;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aikagan.com";

    // Create checkout
    const checkoutRes = await fetch(`${API_BASE}/checkouts`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_options: {
              embed: false,
              media: false,
              logo: true,
            },
            checkout_data: {
              custom: {
                product_slug: slug,
                ...(ref ? { ref_code: ref } : {}),
                ...(customData.utm_source ? { utm_source: customData.utm_source } : {}),
                ...(customData.utm_medium ? { utm_medium: customData.utm_medium } : {}),
                ...(customData.utm_campaign ? { utm_campaign: customData.utm_campaign } : {}),
              },
            },
            product_options: {
              redirect_url: `${siteUrl}/checkout-success?provider=lemonsqueezy${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`,
              receipt_button_text: "Download your files",
              receipt_thank_you_note: "Thank you — your digital toolkit is ready.",
            },
          },
          relationships: {
            store: { data: { type: "stores", id: storeId } },
            variant: { data: { type: "variants", id: variantId } },
          },
        },
      }),
    });

    const data = await checkoutRes.json();
    if (!checkoutRes.ok) {
      console.error("❌ LemonSqueezy checkout error:", data);
      return NextResponse.json(
        { error: data?.errors?.[0]?.detail ?? "Failed to create LemonSqueezy checkout" },
        { status: 502 }
      );
    }

    const checkoutId = data?.data?.id;
    const checkoutUrl = data?.data?.attributes?.url;

    // Pre-register in token store so success page can poll
    if (checkoutId) {
      tokenStore.set(`ls:${checkoutId}`, {
        token: null,
        slug,
        email: null,
        exp: Date.now() + 48 * 60 * 60 * 1000,
      });
    }

    console.log("✅ LemonSqueezy checkout created:", {
      checkoutId,
      slug,
      ref,
    });

    return NextResponse.json({
      url: checkoutUrl,
      transactionId: checkoutId,
    });
  } catch (err: any) {
    console.error("❌ LemonSqueezy checkout error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to create LemonSqueezy checkout" },
      { status: 500 }
    );
  }
}
