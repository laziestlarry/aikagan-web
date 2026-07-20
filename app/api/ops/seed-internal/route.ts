import { NextResponse } from "next/server";
import { recordTransaction, recordPageview, recordIntent, recordLead } from "@/lib/income-ledger";
import { recordAgentActivity, makeAgentActivity } from "@/lib/agent-tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRICES: Record<string, number> = {
  "masterclass-starter": 29,
  "masterclass-pro": 79,
  "masterclass-commander": 149,
};
const SLUGS = Object.keys(PRICES);

function randBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

export async function POST() {
  const days = 30;
  const scale = 1.0;
  const BASE_PV = Math.round(240 * scale);
  const now = Date.now();
  let txCount = 0;

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now - i * 86400000);
    const pv = Math.max(1, Math.round(BASE_PV * (0.5 + Math.random() * 0.5)));
    const intents = Math.round(pv * 0.06 * (0.7 + Math.random() * 0.6));
    const leads = Math.round(pv * 0.025 * (0.6 + Math.random() * 0.8));
    const purchases = Math.round(pv * 0.012 * (0.5 + Math.random()));

    // Record pageviews
    for (let v = 0; v < pv; v++) {
      await recordPageview("/", day.getTime() + v * 1000).catch(() => {});
    }
    // Record intents
    for (let n = 0; n < intents; n++) {
      const slug = SLUGS[Math.floor(Math.random() * SLUGS.length)];
      await recordIntent({
        slug,
        price: PRICES[slug],
        capturedAt: day.getTime() + n * 1000,
        utm: {},
        ref: null,
        source: "self_test",
      }, `seed_${i}_${n}`).catch(() => {});
    }
    // Record leads
    for (let l = 0; l < leads; l++) {
      await recordLead({
        email: `test+${i}_${l}@aikagan.test`,
        slug: "golden-delivery-sample",
        capturedAt: day.getTime() + l * 1000,
        utm: {},
        ref: null,
        capiFired: false,
      }).catch(() => {});
    }
    // Record purchases (only last 14 days for recency)
    if (i < 14 && purchases > 0) {
      const count = Math.min(purchases, 3);
      for (let p = 0; p < count; p++) {
        const slug = SLUGS[Math.floor(Math.random() * SLUGS.length)];
        const orderId = `seed_${i}_${p}_${Math.random().toString(36).slice(2, 8)}`;
        await recordTransaction({
          orderId,
          provider: "gumroad",
          slug,
          email: `buyer+${i}@aikagan.test`,
          value: PRICES[slug],
          currency: "USD",
          refCode: null,
          utm: {},
          capturedAt: day.getTime() + p * 1000 + 5000,
          eventId: orderId,
          commission: 0,
          capiFired: false,
          note: "self_test",
        }).catch(() => {});
        txCount++;
      }
    }
  }

  // Record the seed as an agent activity
  await recordAgentActivity(makeAgentActivity(
    "Income Seed",
    "internal_seed",
    "success",
    Date.now() - now,
    `Seeded ${days}d with ${txCount} purchases across ${SLUGS.length} products`,
    txCount,
  )).catch(() => {});

  return NextResponse.json({
    ok: true,
    days,
    scale,
    transactionsCreated: txCount,
    note: "Self-test data written to KV. Refresh /income to view.",
  });
}
