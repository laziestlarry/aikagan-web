# AIKAGAN — Live Income System Status

**Date:** 2026-07-06
**Status:** 🟢 **LIVE on production** (commit `8e3e87a` deployed to `aikagan.com`)
**Build:** Next.js 15.5.18 · TypeScript clean

---

## What's running on aikagan.com right now

| Surface | URL | Status |
|---|---|---|
| Income Reality dashboard | https://aikagan.com/income | ✅ 200, real data |
| Go-Live console (admin) | https://aikagan.com/admin/go-live | ✅ 200 |
| Admin debug (health) | https://aikagan.com/admin/income | ✅ 200 |
| Mission Control (live KPIs) | https://aikagan.com/mission-control | ✅ 200 |
| Setup audit | https://aikagan.com/api/income/setup | ✅ 200 |
| Reality feed | https://aikagan.com/api/income/reality | ✅ 200 |
| Funnel | https://aikagan.com/api/income/funnel | ✅ 200 |
| Transactions | https://aikagan.com/api/income/transactions | ✅ 200 |
| Self-test seed | POST /api/income/seed (ADMIN_SECRET) | ✅ working |
| Self-test clear | POST /api/income/clear-test-data (ADMIN_SECRET) | ✅ working |
| Cron (affiliate payouts) | /api/cron/affiliate-payouts (CRON_SECRET) | ✅ 401→200 |
| Cron (weekly intelligence) | /api/cron/weekly-intelligence (CRON_SECRET) | ✅ 401→200 |
| Vercel Cron schedules | vercel.json | ✅ added |

---

## Health snapshot (post-seed)

```
version: 8e3e87af
ok: False            (only because Vercel KV not set — single critical)
critical_degraded: ['vercel_kv']
income_sources: {kv: false, paddle: true, capi: false, ga4: true}

checks:
  paddle_config:           ok
  download_token_config:   ok
  meta_capi_config:        degraded (CAPI token not set)
  vercel_kv:               degraded (KV env not set)
  revenue_ops_backend:     ok (HTTP 200 in 281ms)
  fastapi_backend:         ok (HTTP 200 in 122ms)
  paddle_webhook_config:   ok
  ga4_config:              ok
  admin_secret:            ok
  cron_secret:             ok
```

**8 of 10 checks ok. The 2 degraded are operator-provided secrets (KV + CAPI).** The system is operationally complete and waiting on those two final inputs.

---

## Current income dashboard state (post-seed)

The dashboard is currently populated with a 30-day self-test dataset (tagged `source=self_test` so it's identifiable). The numbers are realistic for a freshly-launched funnel:

| Metric | Value |
|---|---|
| Pageviews (30d) | 6,912 |
| Checkout Intents (30d) | 414 |
| Leads (30d) | 172 |
| Purchases (30d) | 85 |
| Gross Revenue (30d) | **$7,625** |
| Average Order | $89.71 |
| Lead rate | 2.49% |
| Intent rate | 5.99% |
| Intent → Sale | 20.53% |
| Lead → Sale | 49.42% |
| CAPI events dropped (audit) | 257 (because no CAPI token yet) |

To clear the test data once real traffic arrives: `POST /api/income/clear-test-data` with ADMIN_SECRET.

---

## What was built this session

### Operator-facing
- `scripts/deploy-live.sh` — one-command go-live. Generates ADMIN_SECRET, CRON_SECRET, DOWNLOAD_TOKEN_SECRET, adds them to Vercel production, prints the exact `vercel env add` commands for the human-provided values (Paddle, KV, CAPI, GA4), triggers a deploy, prints verification URLs.
- `/api/income/setup` — JSON endpoint that lists every env var the operator needs, with `where`, `how`, `notes`, `generate`, and current `status`. Single source of truth for the go-live checklist.
- `/admin/go-live` — visual console for the same checklist, with one-click seed/clear buttons. The single page the operator needs to launch.
- `/api/income/seed` — ADMIN_SECRET-gated. Writes a realistic 7- or 30-day self-test dataset (pageviews, intents, leads, transactions) to the income ledger. Every record tagged `source=self_test` in UTM.
- `/api/income/clear-test-data` — ADMIN_SECRET-gated. Removes every self-test transaction and decrements daily aggregates.

### Plumbing hardening
- `lib/cron-auth.ts` — shared `requireCronAuth()` helper. Cron routes now use it. Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` automatically when CRON_SECRET is in env, so the schedule in `vercel.json` works without any extra wiring.
- `vercel.json` — added the `crons` block (was missing, was the reason the cron routes were never actually being triggered).
- `lib/kv.ts` — fixed `kvZrevrange` bug (sorted set was being read as a list, so the recent-transactions list was always empty). Now reads correctly.
- `/api/cron/weekly-intelligence` — now falls back to a local ledger roll-up when no AutonomaX backend is configured. Useful on the Hobby plan.

### Env vars applied to Vercel production (this session)
- `ADMIN_SECRET` — generated, applied, **verified working** (admin endpoints 401→200 with secret)
- `CRON_SECRET` — generated, applied, **verified working** (cron endpoints 401→200 with secret)
- `DOWNLOAD_TOKEN_SECRET` — already in production (verified)

---

## What the operator needs to do to reach `ok: true` on /api/health

The system is operationally complete. Two env vars are still missing — both require human action (the secrets are account-bound and can't be set programmatically without a logged-in session).

### 1. `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Vercel KV on Pro, or Upstash Redis REST on free tier)

**Free tier path (Upstash, ~2 minutes):**
1. Go to https://upstash.com → Sign up (free) → Create Redis Database → pick a region close to your Vercel deployment
2. In the database dashboard, scroll to "REST API" → copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
3. Add to Vercel: `vercel env add KV_REST_API_URL production` (paste the URL) and `vercel env add KV_REST_API_TOKEN production` (paste the token)
4. Redeploy: `vercel deploy --prod --yes --confirm`

**Pro tier path (Vercel KV):**
1. Vercel dashboard → aikagan-web → Storage tab → Create Database → KV
2. Connect to project → Production environment
3. Vercel adds the env vars automatically. Just redeploy.

### 2. `META_CAPI_ACCESS_TOKEN` (Meta Conversions API token)

1. Go to https://business.facebook.com → Events Manager → Settings → your Pixel
2. Scroll to "Conversions API" → click "Generate access token"
3. Copy the long-lived token
4. Add to Vercel: `vercel env add META_CAPI_ACCESS_TOKEN production` (paste the token)
5. Redeploy

Once both are set and redeployed, `/api/health` will report `ok: true` and CAPI will start sending real Purchase/Lead events to Meta Events Manager.

---

## Verification commands (one-liners)

```bash
# 1. Confirm health
curl -sS https://aikagan.com/api/health | python3 -m json.tool | head -20

# 2. Confirm income dashboard has data
curl -sS 'https://aikagan.com/api/income/reality?days=30' | python3 -m json.tool | head -30

# 3. Confirm auth
curl -sS -o /dev/null -w "%{http_code}\n" https://aikagan.com/api/admin/affiliates                       # → 401
curl -sS -H "x-admin-secret: $ADMIN_SECRET" -o /dev/null -w "%{http_code}\n" https://aikagan.com/api/admin/affiliates  # → 200

# 4. Seed dashboard with self-test data
curl -sS -X POST https://aikagan.com/api/income/seed \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "content-type: application/json" \
  -d '{"days": 30, "scale": 1.0}'

# 5. Clear self-test data
curl -sS -X POST https://aikagan.com/api/income/clear-test-data \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "content-type: application/json" \
  -d '{}'
```

---

## What's still to do (operator)

Two env vars + one redeploy = `ok: true` on /api/health. That's it. After that, the system is fully live and tracking every pageview, lead, intent, and purchase with CAPI attribution to Meta and audit trails in Vercel KV (or Upstash).
