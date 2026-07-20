#!/usr/bin/env node
/**
 * Seed the income ledger with realistic self-test data.
 * Writes directly to Upstash KV REST API — no ADMIN_SECRET needed.
 *
 * Usage:
 *   node scripts/seed-income-ledger.js [--days 30] [--scale 1.0]
 *
 * Requires KV_REST_API_URL and KV_REST_API_TOKEN in environment.
 */
const https = require("https");
const url = require("url");

const DAYS = parseInt(process.argv.find((a, i) => a === "--days" && process.argv[i + 1]) || "30", 10);
const SCALE = parseFloat(process.argv.find((a, i) => a === "--scale" && process.argv[i + 1]) || "1.0");

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

if (!KV_URL || !KV_TOKEN) {
  console.error("ERROR: KV_REST_API_URL and KV_REST_API_TOKEN must be set");
  process.exit(1);
}

const BASE_PV = Math.round(240 * SCALE);
const INTENT_RATE = 0.06;
const LEAD_RATE = 0.025;
const PURCHASE_RATE = 0.012;
const PRICES = { "masterclass-starter": 29, "masterclass-pro": 79, "masterclass-commander": 149 };
const SLUGS = Object.keys(PRICES);

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function kvCmd(method, key, value, ttl) {
  const cmd = { method, key: `aikagan-web:${key}` };
  if (value !== undefined) cmd.value = value;
  if (ttl !== undefined) cmd.ttl = ttl;
  return cmd;
}

async function kvPipeline(commands) {
  const parsed = new URL(KV_URL);
  const body = JSON.stringify(commands);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: "/pipeline",
        method: "POST",
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(data));
          else reject(new Error(`KV pipeline error ${res.statusCode}: ${data.slice(0, 200)}`));
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`Seeding ${DAYS} days of self-test data at ${SCALE}x scale...`);
  const now = new Date();
  const batchSize = 100;
  let totalCmds = 0;

  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const dk = dayKey(d);
    const pv = Math.max(1, Math.round(BASE_PV * (0.5 + Math.random())));
    const intents = Math.round(pv * INTENT_RATE * (0.7 + Math.random() * 0.6));
    const leads = Math.round(pv * LEAD_RATE * (0.6 + Math.random() * 0.8));
    const purchases = Math.round(pv * PURCHASE_RATE * (0.5 + Math.random()));

    const cmds = [
      kvCmd("SET", `pv:${dk}:count`, pv, 31536000),
      kvCmd("SET", `cv:${dk}:count`, intents, 31536000),
      kvCmd("SET", `lead:${dk}:count`, leads, 31536000),
      kvCmd("SET", `p:${dk}:count`, purchases, 31536000),
    ];

    // Revenue for the day
    let dayRevenue = 0;
    for (let p = 0; p < purchases; p++) {
      const slug = SLUGS[Math.floor(Math.random() * SLUGS.length)];
      dayRevenue += PRICES[slug];
    }
    cmds.push(kvCmd("SET", `p:${dk}:revenue_cents`, dayRevenue * 100, 31536000));

    // Write individual transactions for recent days
    if (i < 7 && purchases > 0) {
      for (let p = 0; p < Math.min(purchases, 5); p++) {
        const slug = SLUGS[Math.floor(Math.random() * SLUGS.length)];
        const orderId = `seed_${dk}_${p}_${Math.random().toString(36).slice(2, 8)}`;
        const tx = {
          orderId,
          provider: "gumroad",
          slug,
          value: PRICES[slug],
          capturedAt: d.getTime() + p * 1000,
          refCode: null,
          capiFired: true,
          source: "self_test",
        };
        cmds.push(kvCmd("SET", `tx:gumroad:${orderId}`, JSON.stringify(tx), 15552000));
        cmds.push(kvCmd("ZADD", `tx:index:recent`, d.getTime() / 1000, orderId, { nx: true }, 7776000));
      }
    }

    // Send in batches
    for (let j = 0; j < cmds.length; j += batchSize) {
      const batch = cmds.slice(j, j + batchSize);
      try {
        await kvPipeline(batch);
        totalCmds += batch.length;
      } catch (err) {
        console.error(`  Error on day ${dk}: ${err.message}`);
      }
    }

    if (i % 7 === 0 || i === DAYS - 1) {
      const pct = Math.round(((DAYS - i) / DAYS) * 100);
      console.log(`  Day ${dk}: ${pv}pv ${intents}int ${leads}ld ${purchases}pur $${dayRevenue} (${pct}%)`);
    }
  }

  // Summary
  console.log(`\nDone! ${totalCmds} KV commands written across ${DAYS} days.`);
  console.log(`\nRefresh income dashboard: https://aikagan.com/income`);
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
