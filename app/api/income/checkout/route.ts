import { NextRequest, NextResponse } from "next/server";
import { CHECKOUT_SENTINEL, getProduct } from "@/lib/products";
import { recordIntent, type IntentRecord } from "@/lib/income-ledger";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";
import { getGumroadProduct } from "@/lib/gumroad-products";
import { canStartPaidCheckout, storefrontCommerceState } from "@/lib/commerce";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckoutBody {
  slug: string;
  ref?: string | null;
  provider?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  email?: string | null;
  sessionId?: string | null;
  coupon?: string | null;
}

function newSessionId() {
  return `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 10)}`;
}

function gumroadCheckout(body: CheckoutBody) {
  if (body.coupon) return null;
  const product = getGumroadProduct(body.slug);
  if (!product) return null;
  const url = new URL(product.url);
  if (body.ref) url.searchParams.set("referral", body.ref);
  return { provider: "gumroad" as const, url: url.toString(), transactionId: product.id };
}

async function createCheckoutSession(body: CheckoutBody): Promise<{ status: number; data: Record<string, unknown> }> {
  const product = getProduct(body.slug);
  if (!product) return { status: 404, data: { error: `Unknown product: ${body.slug}` } };
  if (!product.price || product.priceModel === "free") {
    return { status: 400, data: { error: "Free products do not need checkout" } };
  }
  if (product.checkoutUrl !== CHECKOUT_SENTINEL) {
    return {
      status: 409,
      data: {
        ok: false,
        error: "scope_required",
        detail: "This offer requires scope and delivery confirmation before payment.",
        requestUrl: product.checkoutUrl?.startsWith("/")
          ? product.checkoutUrl
          : `/contact?product=${encodeURIComponent(body.slug)}`,
      },
    };
  }
  if (!canStartPaidCheckout(body.slug)) {
    return { status: 503, data: { ok: false, error: "storefront_commissioning", detail: "Checkout opens only after product, payment, and delivery verification." } };
  }

  const sessionId = body.sessionId || newSessionId();
  const intent: IntentRecord = {
    slug: body.slug,
    price: product.price,
    capturedAt: Date.now(),
    utm: {
      ...(body.utm_source ? { utm_source: body.utm_source } : {}),
      ...(body.utm_medium ? { utm_medium: body.utm_medium } : {}),
      ...(body.utm_campaign ? { utm_campaign: body.utm_campaign } : {}),
      ...(body.utm_term ? { utm_term: body.utm_term } : {}),
      ...(body.utm_content ? { utm_content: body.utm_content } : {}),
    },
    ref: body.ref ?? null,
    source: "income_checkout",
  };

  let intentRecorded = false;
  try {
    await recordIntent(intent, sessionId);
    intentRecorded = true;
  } catch (error) {
    console.warn("[income-checkout] intent evidence unavailable", String(error));
  }

  const result = gumroadCheckout(body);
  if (result) {
    return {
      status: 200,
      data: { ok: true, ...result, intentId: sessionId, intent: { recorded: intentRecorded, at: new Date(intent.capturedAt).toISOString() } },
    };
  }

  return {
    status: 503,
    data: {
      ok: false,
      error: body.coupon ? "coupon_not_supported" : "gumroad_checkout_unavailable",
      detail: body.coupon
        ? "This hosted checkout does not accept an unverified coupon. No charge was started."
        : "This product does not have a commissioned Gumroad product mapping.",
      provider: null,
      intentId: sessionId,
    },
  };
}

function bodyFromQuery(req: NextRequest, slug: string): CheckoutBody {
  return {
    slug,
    ref: req.nextUrl.searchParams.get("ref"),
    provider: "gumroad",
    utm_source: req.nextUrl.searchParams.get("utm_source"),
    utm_medium: req.nextUrl.searchParams.get("utm_medium"),
    utm_campaign: req.nextUrl.searchParams.get("utm_campaign"),
    utm_term: req.nextUrl.searchParams.get("utm_term"),
    utm_content: req.nextUrl.searchParams.get("utm_content"),
    email: req.nextUrl.searchParams.get("email"),
    sessionId: req.nextUrl.searchParams.get("sessionId") || req.nextUrl.searchParams.get("session_id"),
    coupon: req.nextUrl.searchParams.get("coupon"),
  };
}

export async function POST(req: NextRequest) {
  const limit = rateLimit({ key: clientKey(req, "income-checkout"), max: 30, windowMs: 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit);
  const body = (await req.json().catch(() => null)) as CheckoutBody | null;
  if (!body?.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const result = await createCheckoutSession({ ...body, provider: "gumroad" });
  return NextResponse.json(result.data, { status: result.status });
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (slug) {
    const result = await createCheckoutSession(bodyFromQuery(req, slug));
    const url = typeof result.data.url === "string" ? result.data.url : null;
    if (url) return NextResponse.redirect(url, 303);
    return NextResponse.json(result.data, { status: result.status });
  }

  const mapped = ["masterclass-starter", "masterclass-pro", "masterclass-commander"].filter(
    (productSlug) => Boolean(getGumroadProduct(productSlug)),
  );
  return NextResponse.json({
    ok: mapped.length === 3,
    storefrontMode: storefrontCommerceState(),
    defaultProvider: "gumroad",
    providers: { gumroad: { hostedCheckout: mapped.length === 3, verificationApi: Boolean(process.env.GUMROAD_ACCESS_TOKEN) } },
    mappedProducts: mapped,
  });
}
