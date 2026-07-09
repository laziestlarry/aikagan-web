// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/gumroad-status
//
// Admin-only diagnostic tool for Gumroad seller profile, product listings,
// and payout readiness. Uses GUMROAD_ACCESS_TOKEN (v2 API).
//
// Requires ADMIN_SECRET header to prevent abuse.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { GUMROAD_PRODUCTS } from "@/lib/gumroad-products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret") || req.nextUrl.searchParams.get("secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.GUMROAD_ACCESS_TOKEN;
  const results: Record<string, any> = {
    tokenConfigured: Boolean(token),
    checks: {},
  };

  if (!token) {
    return NextResponse.json(results);
  }

  const base = "https://api.gumroad.com/v2";

  // 1. Seller/account info (profile)
  try {
    const resp = await fetch(`${base}/user?access_token=${encodeURIComponent(token)}`);
    const data = await resp.json();
    results.checks.user = {
      status: resp.status,
      success: data?.success,
      user: data?.user
        ? {
            name: data.user.name,
            bio: data.user.bio,
            twitter_handle: data.user.twitter_handle,
            url: data.user.url,
          }
        : null,
      error: data?.message,
    };
  } catch (err: any) {
    results.checks.user = { error: err?.message };
  }

  // 2. Product listings — compare live Gumroad products vs our expected mapping
  try {
    const resp = await fetch(`${base}/products?access_token=${encodeURIComponent(token)}`);
    const data = await resp.json();
    const products = Array.isArray(data?.products) ? data.products : [];
    results.checks.products = {
      status: resp.status,
      success: data?.success,
      count: products.length,
      list: products.map((p: any) => ({
        id: p.id,
        name: p.name,
        permalink: p.custom_permalink || p.permalink,
        price: p.formatted_price,
        published: p.published,
        url: p.short_url,
        description_preview: (p.description || "").slice(0, 120),
      })),
      error: data?.message,
    };

    // Cross-check against our internal catalog
    results.checks.mapping_check = Object.entries(GUMROAD_PRODUCTS).map(([slug, prod]) => {
      const match = products.find(
        (p: any) => p.short_url === prod.url || p.custom_permalink === prod.permalink
      );
      return {
        slug,
        expectedUrl: prod.url,
        foundOnGumroad: Boolean(match),
        published: match?.published ?? null,
      };
    });
  } catch (err: any) {
    results.checks.products = { error: err?.message };
  }

  // 3. Sales / payout activity (recent sales confirm payout pipeline is live)
  try {
    const resp = await fetch(`${base}/sales?access_token=${encodeURIComponent(token)}`);
    const data = await resp.json();
    const sales = Array.isArray(data?.sales) ? data.sales : [];
    results.checks.recent_sales = {
      status: resp.status,
      success: data?.success,
      count: sales.length,
      latest: sales.slice(0, 3).map((s: any) => ({
        id: s.id,
        product_name: s.product_name,
        price: s.formatted_display_price,
        created_at: s.created_at,
      })),
      error: data?.message,
    };
  } catch (err: any) {
    results.checks.recent_sales = { error: err?.message };
  }

  return NextResponse.json(results);
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/gumroad-status?action=sync-descriptions
//
// Fixes a live mismatch: the published, revenue-generating listings
// (autonomax-{starter,pro,commander}-{price}) were created with placeholder
// "SaaS automation platform" copy, while a second, correctly-worded
// "AutonomaX Masterclass" description sits on unpublished duplicate listings.
// This copies the correct name + description onto the live listings.
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret") || req.nextUrl.searchParams.get("secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const action = req.nextUrl.searchParams.get("action");
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GUMROAD_ACCESS_TOKEN not set" }, { status: 400 });
  }

  if (action !== "sync-descriptions") {
    return NextResponse.json({ error: "Unknown action. Use ?action=sync-descriptions" }, { status: 400 });
  }

  const base = "https://api.gumroad.com/v2";

  // Maps the live (published, linked) product ID -> the correctly-worded
  // draft twin's permalink to source the fix copy from.
  const FIX_PAIRS: Record<string, { correctPermalink: string; correctName: string }> = {
    "J59rJByCCyKKEfDouQjTDw==": { correctPermalink: "autonomax-starter", correctName: "AutonomaX Masterclass — Starter" },
    "1BzBT7MJ_yBSJ1d9W9OrjA==": { correctPermalink: "autonomax-pro", correctName: "AutonomaX Masterclass — Pro" },
    "H7uOVVl-CaUQJRp8e_73WQ==": { correctPermalink: "autonomax-commander", correctName: "AutonomaX Masterclass — Commander" },
  };

  const results: Record<string, any> = { actions: [] };

  try {
    // Fetch all products once to source correct descriptions + IDs
    const listResp = await fetch(`${base}/products?access_token=${encodeURIComponent(token)}`);
    const listData = await listResp.json();
    const products = Array.isArray(listData?.products) ? listData.products : [];

    for (const [liveId, fix] of Object.entries(FIX_PAIRS)) {
      const correctProduct = products.find(
        (p: any) => (p.custom_permalink || p.permalink) === fix.correctPermalink
      );
      if (!correctProduct) {
        results.actions.push({ liveId, ok: false, error: "correct draft product not found" });
        continue;
      }

      const putResp = await fetch(
        `${base}/products/${encodeURIComponent(liveId)}?access_token=${encodeURIComponent(token)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            name: fix.correctName,
            description: correctProduct.description || "",
          }),
        }
      );
      const putData = await putResp.json();
      results.actions.push({
        liveId,
        sourcedFrom: fix.correctPermalink,
        status: putResp.status,
        success: putData?.success ?? false,
        newName: putData?.product?.name,
        error: putData?.message,
      });
    }
  } catch (err: any) {
    results.error = err?.message;
  }

  return NextResponse.json(results);
}
