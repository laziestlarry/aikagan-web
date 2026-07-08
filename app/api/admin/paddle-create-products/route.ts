// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/paddle-create-products
//
// Creates products and prices in the Paddle Catalog so we can use
// Paddle's hosted checkout URL instead of inline prices.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getPaddleEnvironment } from "@/lib/paddle-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret") || req.nextUrl.searchParams.get("secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.PADDLE_API_KEY;
  const env = getPaddleEnvironment();
  const baseUrl = env === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };

  const results: Record<string, any> = {};

  // Products to create
  const products = [
    { name: "AutonomaX Masterclass — Starter", description: "The 7-day first-sale system", tax_category: "saas", price: 2900 },
    { name: "AutonomaX Masterclass — Pro", description: "Revenue operations deep-dives", tax_category: "saas", price: 7900 },
    { name: "AutonomaX Masterclass — Commander", description: "The full empire architecture", tax_category: "saas", price: 14900 },
  ];

  for (const product of products) {
    try {
      // Step 1: Create product
      const productResp = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          tax_category: product.tax_category,
        }),
      });
      const productData = await productResp.json();

      if (!productResp.ok) {
        results[product.name] = { error: `Product create failed: ${JSON.stringify(productData)}` };
        continue;
      }

      const productId = productData.data?.id;
      results[`${product.name} product`] = { id: productId };

      // Step 2: Create price for this product
      const priceResp = await fetch(`${baseUrl}/prices`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          description: product.name,
          unit_price: { amount: String(product.price), currency_code: "USD" },
          product_id: productId,
        }),
      });
      const priceData = await priceResp.json();

      if (!priceResp.ok) {
        results[`${product.name} price`] = { error: `Price create failed: ${JSON.stringify(priceData)}` };
        continue;
      }

      const priceId = priceData.data?.id;
      results[`${product.name} price`] = { id: priceId, amount: product.price };

    } catch (e: any) {
      results[product.name] = { error: e.message };
    }
  }

  return NextResponse.json(results);
}
