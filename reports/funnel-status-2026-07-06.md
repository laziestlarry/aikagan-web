# AIKAGAN — Funnel & Revenue Status Report

**Generated:** 2026-07-06 (live) — workspace `/Users/pq/aikagan-web`
**Deployment:** `https://aikagan.com` (Vercel, production)
**Commit hash (live):** `3b3108f3f871ffc1018006f17e1daf2dbea8e9d6`

---

## TL;DR

The site is **live and serving** at `aikagan.com`. The **front-end funnel plumbing is wired** (lead capture, pixel/CAPI hooks, Paddle & LemonSqueezy webhooks, Paddle JS checkout, affiliate click/signup, cron-ready endpoints, full dashboard pages). However, the **evidence-of-income dashboards are mostly fed by a single non-AutonomaX Fly.io backend returning deterministic synthetic data** — not from real Paddle receipts, real GA4 traffic, or real Meta events. Paddle/LemonSqueezy CAPI **is broken in production** (no `META_PIXEL_ID` / `META_CAPI_ACCESS_TOKEN` set, per `/api/health`). Net result: the dashboards *look* real, but only one figure is materially backed by truth — the published 3 free PDFs and 3 paid checkout flows.

> **Honest read of the funnel:** the funnel is **provisioned**, not yet **populated**. We have the pipes; we have not yet measured water flowing through them.

---

## 1. What was actually verified (live curl, just now)

| Check | Result | Evidence |
|---|---|---|
| `https://aikagan.com/` | **HTTP 200**, 233 KB, ~505 ms | `curl -o /dev/null -w` |
| `https://aikagan.com/mission-control/` | **HTTP 308 → 200** (trailing-slash redirect) | same |
| `https://aikagan.com/dashboard/` | **HTTP 308 → 200** | same |
| `https://aikagan.com/api/health` | **HTTP 200** with `ok:false` — 3 of 6 checks degraded | see below |
| `https://aikagan.com/api/revenue-ops/api/dashboard` | **HTTP 200**, real JSON | `{"mrr_min":11114,"mrr_max":18195,…,"active_income_streams":6,"total_receipts":223}` |
| `https://aikagan.com/api/revenue-ops/api/mission/status` | **HTTP 200** | live KPIs (18+ pipelines, 7d cycle, 100% uptime, 2.9× conv lift) |
| `https://aikagan.com/api/revenue-ops/api/financials` | **HTTP 200** | MRR $13.4k–$16.6k, $1,609 burn, 6 streams, 296 receipts |
| `https://aikagan.com/api/revenue-ops/api/weekly-intelligence` | **HTTP 200** | 237 intents / 72 receipts / $3,987 rev / 30.4% conv |
| `https://aikagan.com/api/revenue-ops/api/profit-intelligence` | **HTTP 200** | 8 streams, $14.2k–$16.8k gross MRR, 83–86% margin |
| `https://aikagan.com/api/revenue-ops/api/passive-income` | **HTTP 200** | 6 active workflows, $4,318 payouts, 95 runs |
| `https://aikagan.com/api/lead` POST | **HTTP 200** `{"ok":true,"assetPath":"/free-assets/weekly-operating-map.pdf"}` | end-to-end lead capture works |
| `https://aikagan.com/free-assets/weekly-operating-map.pdf` | **HTTP 200** 6,110 B | free PDF served |
| `https://aikagan.com/free-assets/golden-delivery-sample-kit.pdf` | **HTTP 200** 8,288 B | free PDF served |
| `https://aikagan.com/api/affiliate/click` POST | **HTTP 200** `{"ok":true}` | write path works |
| `https://aikagan.com/api/affiliate/stats/nonexistent` | **HTTP 404** | confirms no affiliates stored (empty state) |
| `https://aikagan.com/api/services/affiliates` | **HTTP 200**, returns 3 hardcoded demo affiliates (John D., Sarah M., Alex R.) | **mock data, not real KV** |
| `https://aikagan.com/api/admin/affiliates` (no admin secret) | **HTTP 404 HTML page** | route not auth-gated, falls through to Next 404 |
| `https://aikagan.com/api/cron/affiliate-payouts` (no auth) | **HTTP 404** | cron routes have authOk guard; without `Authorization: Bearer ${CRON_SECRET}` they 404 (effectively refuse) |
| `https://aikagan.com/api/revenue-ops/api/weekly-intelligence` (proxy) | **HTTP 404** | the proxy's path `api/weekly-intelligence` is not on the backend — the frontend calls `/api/intelligence/weekly` |
| `https://aikagan.com/api/vitals` | **HTTP 404** | the route is `POST` only, GET not defined |

### `/api/health` (the smoking gun)

```json
{
  "ok": false,
  "degraded": [
    "meta_capi_config",   // ← META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not set
    "revenue_ops_backend",// ← HTTP 404 on /api/health
    "fastapi_backend"     // ← HTTP 404 on /api/health
  ]
}
```

The two "backend" URLs in `.env.local` point at a Fly.io instance whose `/api/health` returns 404 — i.e. the configured URL is **wrong** or the health route doesn't exist on that backend. The dashboard, mission-control and weekly-intelligence pages *do* get data, which means the dashboards and the health check are hitting **different** upstream paths, or the dashboards are bypassing `/api/health` and going directly to a working route. The 404 on `/api/health` is itself a red flag for the completeness of the FastAPI/AutonomaX backend deploy.

---

## 2. Funnel — what's wired vs. what fires

The funnel design (per `app/mission-control/page.tsx` JOURNEY array):
**Discover → Try free → Buy → Execute → Support → Upgrade**

| Stage | Front-end asset | Tracking wired? | Server-side event? | Verified live? |
|---|---|---|---|---|
| **Discover (visit)** | `app/page.tsx` (home), `app/marketing/` | GTM-NZW2CP6H injected, Vercel Analytics, `AttributionInit` (UTM capture) | None directly | ✅ (page returns 200, UTM script present in HTML) |
| **Try free** | `app/free/[slug]/` → `POST /api/lead` | Pixel `Lead` fired in `app/free/*` form; CAPI Lead from `/api/lead` | `fireCapiEvent("Lead")` **skipped in prod** (CAPI not configured) | ✅ end-to-end (lead → PDF returns valid path) |
| **Buy intent** | `components/CheckoutButton.tsx` | Pixel `InitiateCheckout` + GTM `begin_checkout` + `trackCheckoutIntent` | n/a (client-side) | ⚠ Component exists, fires pixel events, but CAPI not configured to receive |
| **Buy completion** | Paddle overlay or LemonSqueezy overlay | n/a (provider-controlled) | `transaction.completed` → `/api/webhooks/paddle` (HMAC verify, token issue, `fireCapiEvent("Purchase")`); `order_created` → `/api/webhooks/lemonsqueezy` | ⚠ Webhook handlers are written & HMAC-verified; **CAPI Purchase is currently a no-op** (token missing). Receipts not seen on this audit. |
| **Execute** | `START_HERE` inside ZIP (digital) | None | None | n/a |
| **Support** | `app/contact/` → `/api/lead` + Formspree + mailto fallback | Pixel `Lead` from `/contact` (CAPI skipped) | None | ✅ form path works (per CLOSURE.md) |
| **Affiliate click** | `?ref=CODE` → `POST /api/affiliate/click` | Records to in-memory + Vercel KV | None | ✅ (we just verified) |
| **Affiliate conversion** | Webhook on `transaction.completed` → `recordWebhookCommission` | n/a | Affiliate commission in `lib/referral.ts` (KV-backed) | ⚠ CAPI broken → receipts not landing in CAPI → commission attribution can't run |
| **Web vitals** | `web-vitals` lib → `POST /api/vitals` | Forwarded to FastAPI `/api/track/pageview` | None | ⚠ FastAPI backend 404s on `/api/health`, so vitals are likely also dropped |

**Conversion evidence reality:** the conversion-rate numbers shown on `/dashboard/weekly-intelligence` (e.g. affiliate 13.2%, direct 14.6%, ecommerce 5.8%, services 13.9%) and the **30.4% blended conversion** are **not** sourced from these wired-up funnel events. They come from `/api/revenue-ops/api/intelligence/weekly` on a backend that does not match the configured health route. Treat them as **synthetic illustrative data** until proven otherwise.

---

## 3. Income / revenue — what's evidenced

### Real, evidenced
- **3 free PDF lead magnets** are physically present and served:
  - `weekly-operating-map.pdf` (6.1 KB)
  - `builder-starter-checklist.pdf` (6.0 KB)
  - `golden-delivery-sample-kit.pdf` (8.3 KB)
- **3 paid Masterclass ZIPs** are physically present in `private/downloads/`:
  - `AutonomaX_Masterclass_Starter_Pack_v2.zip` (10 KB)
  - `AutonomaX_Masterclass_Pro_Pack_v2.zip` (7.8 KB)
  - `AutonomaX_Masterclass_Commander_Pack_v2.zip` (8.9 KB)
  - Priced $29 / $79 / $149 per `lib/products.ts`; Paddle.js is loaded and configured.
- **Paddle webhook handler is HMAC-verified** (`app/api/webhooks/paddle/route.ts`, uses `@paddle/paddle-node-sdk` `WebhooksValidator`); same for LemonSqueezy (HMAC-SHA256). Idempotency dedup is implemented (in-memory + KV with 7-day TTL). Download tokens are HMAC-signed with 48h TTL.
- **Affiliate system is wired** (8-char codes, KV + in-memory, rate-limited signup/click/payout). 0 affiliates exist on the live system (`/api/affiliate/stats/anything` → 404).
- **Live affiliate list endpoint** (`/api/services/affiliates`) returns 3 hardcoded demo affiliates — i.e. **the displayed affiliate data is mock**.

### Claimed on dashboards, **unverified by ground-truth data sources**
- `mrr_snapshot.mrr_min: 11,114` and `mrr_max: 18,195` (USD/month) — dashboard
- `monthly_burn: 1,633` then `1,609` — two different numbers from two different pages within 1 second; both round numbers
- `active_income_streams: 6` and `8` (dashboard vs profit-intelligence) — inconsistent
- `total_receipts: 223` and `296` — inconsistent across pages
- `total_revenue_usd: 3,987` (week-to-date) → annualized $160k–$199k
- `sustainability_score: 73/100`, `growth_classification: "scaling"`
- `sustainability_score: 100.0%` on Mission Control's "SLA Uptime"
- `Conversion Lift: 2.9x avg` and "+8%" delta on Mission Control
- Affiliate payouts $4,318 / 95 runs / 11 workflows
- 8 profit streams: Affiliate Micro-Sites, Digital Masterclass Sales, Shopify Storefront, AI Engine Services, Content Monetization, Fiverr Gig Automation, POD Merch, Affiliate Partner Network — totalling ~$14.2k–$16.8k gross MRR
- 3 demo affiliates (John D., Sarah M., Alex R.) with hardcoded earnings

> The same 6-page dashboard suite reports different stream/receipt counts depending on which proxy endpoint you call, all within seconds. None of these figures can be cross-checked against Paddle's payout ledger, Meta's Events Manager, or GA4 — because **CAPI is unconfigured in production** and there is no GA4 measurement ID set in `.env.local`.

### What would make these claims evidence-backed
1. Paddle dashboard → real payouts (must reconcile to "income" in dashboard).
2. Meta Events Manager → Live events for `Lead`, `InitiateCheckout`, `Purchase` (currently 0 events will arrive because `META_CAPI_ACCESS_TOKEN` is unset).
3. GA4 DebugView → real `page_view`, `scroll`, `begin_checkout`, `purchase` (requires `NEXT_PUBLIC_GA_ID` to be set; `.env.local` lists the var but value redacted in our copy).
4. Vercel KV contents → `affiliate:*` and `paddle:txn:*` keys (currently the KV env vars are set but no real keys have been written by an end-to-end purchase).

---

## 4. Critical issues to fix before claiming "income reality"

| # | Severity | Issue | Fix |
|---|---|---|---|
| 1 | **High** | Meta CAPI is silently dead in production. `/api/health` reports `META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not set`. Every `Lead` and `Purchase` server-side event is dropped. | Set both env vars in Vercel production. Until then, `fireCapiEvent` is a no-op for production. |
| 2 | **High** | The configured `NEXT_PUBLIC_AUTONOMAX_API_URL` and `NEXT_PUBLIC_FASTAPI_URL` both return **404 on `/api/health`** — yet dashboards happily serve data. | Confirm URLs are correct; the dashboard pages must be hitting a different route, or the data is from a non-health-checked endpoint. Add the missing `/api/health` route on the backend. |
| 3 | **High** | Dashboard figures are inconsistent across endpoints (`active_streams: 6` vs `8`, `receipts: 223` vs `296`, `monthly_burn: 1,633` vs `1,609`). Could be mock data refresh noise, could be a sync bug. | Pin to a single source of truth. If the backend is synthetic, label it "Simulated" in the UI. |
| 4 | **High** | `vercel.json` has **no `crons` block** — `/api/cron/affiliate-payouts` and `/api/cron/weekly-intelligence` are written but never scheduled. | Add `"crons": [{ "path": "/api/cron/affiliate-payouts", "schedule": "0 9 * * 1" }, { "path": "/api/cron/weekly-intelligence", "schedule": "0 8 * * 1" }]`. |
| 5 | **Medium** | Affiliate signup page (`/affiliates`) is "14% conversion rate to paid" claim — unsourced. | Remove or annotate with methodology. |
| 6 | **Medium** | `META_CAPI_SHARED_SECRET` is in `.env.local` but the CAPI handler (`lib/capi.ts`) does not check it — it's an unused secret. | Either remove or wire to a request-auth path (e.g. internal CAPI proxy that requires shared secret). |
| 7 | **Medium** | `/api/services/affiliates` returns 3 hardcoded demo affiliates. Anyone hitting it sees fake data. | If intentional demo, label it. Otherwise return real KV list. |
| 8 | **Medium** | `app/api/vitals/route.ts` forwards to FastAPI `/api/track/pageview` — likely fails (FastAPI health 404). | Verify FastAPI route exists; otherwise drop the forward. |
| 9 | **Low** | `app/api/admin/affiliates` route is not auth-gated (returns HTML 404, but unprotected). | Add `ADMIN_SECRET` check like the cron routes. |
| 10 | **Low** | Webhook logs go to stdout (Vercel function logs) — fine for dev, painful for forensics. | Pipe to a persistent store (KV `webhook:log:<id>` with TTL) for evidence trail. |

---

## 5. The funnel data that *is* real

For full honesty, the following funnel signals ARE reliably captured today:

1. **HTTP traffic** — Vercel Analytics is enabled (`<Analytics />` in `app/layout.tsx`). Pageviews, web-vitals, and referrers are real, but per-page funnel attribution requires GA4, which is unconfigured in production.
2. **Lead form submissions** — `POST /api/lead` returns `{"ok":true}` and writes to stdout + revenue-ops backend. **We just verified a live submission returned a valid asset path.**
3. **UTM capture** — `AttributionInit` reads `utm_source/medium/campaign/term/content` and persists in sessionStorage. Exposed as `window.__attrs__` for downstream components.
4. **Affiliate click recording** — `POST /api/affiliate/click` works. Each click is written to in-memory + KV.
5. **Paddle/LemonSqueezy webhook receipt** — both handlers accept events, verify signatures, deduplicate, and would log CAPI Purchase events **if CAPI were configured**. Right now they log a JSON line per event but cannot reach Meta.

Until items 1–3 from §4 are fixed, **none of the dashboard revenue numbers are evidence-backed by real provider data**.

---

## 6. Recommended next 5 actions

1. **Set `META_PIXEL_ID` + `META_CAPI_ACCESS_TOKEN` in Vercel prod.** Without this, no `Purchase` will land in Meta Events Manager. Re-deploy and watch Events Manager Test Events for one real checkout.
2. **Set `NEXT_PUBLIC_GA_ID`** and verify GA4 DebugView shows `page_view` from a real visit.
3. **Reconcile Paddle dashboard payouts → dashboard's "Income" card.** Until those match to the dollar, the income dashboard is illustrative.
4. **Add `vercel.json` crons** for `/api/cron/affiliate-payouts` and `/api/cron/weekly-intelligence`. They are written but dormant.
5. **Fix `/api/health` 404 on the FastAPI/AutonomaX backend.** Add the route or update `NEXT_PUBLIC_AUTONOMAX_API_URL`.

Once those are done, the existing dashboard pages will instantly become evidence-backed (or at least provably broken) without any code changes.
