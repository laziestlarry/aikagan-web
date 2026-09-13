# AutonomaX — Zero-Gap Readiness Report

## Latest Runtime Snapshot (2026-07-09)

- Bootstrap + verifier executed from `scripts/agent/bootstrap.sh` and `scripts/agent/verify_handoff.py`.
- Make.com scenarios are provisioned and activated (omnichannel + customer-success).
- Live webhook probes return `HTTP 200` for both commander webhooks.
- LemonSqueezy product pages return `HTTP 200` for Starter/Pro/Commander.
- Gumroad checkout URLs return `HTTP 200` for Starter/Pro/Commander.

## Payment Provider Status

| Provider | Status | Detail |
|----------|--------|--------|
| **Retired provider** | ⚠️ Configured, pending dashboard finalization | API key and webhook secret are present; keep Retired provider primary once dashboard checkout defaults are confirmed |
| **LemonSqueezy** | ✅ LIVE | Starter/Pro/Commander product pages returning `HTTP 200` |
| **Gumroad** | ✅ LIVE | Starter/Pro/Commander checkout URLs returning `HTTP 200` |

## Checkout Router Priority
1. Retired provider → fails (Dashboard setup needed), silently falls through
2. LemonSqueezy → ✅ works (active provider)
3. Gumroad → ✅ works (final fallback)
4. Manual → ✅ fallback

## Provider Env Vars (Vercel Production)

| Variable | Value | Status |
|----------|-------|--------|
| `RETIRED_PROVIDER_API_KEY` | Encrypted | ✅ Set |
| `RETIRED_PROVIDER_ENVIRONMENT` | (auto-detected from key prefix) | ✅ Auto |
| `RETIRED_PROVIDER_WEBHOOK_SECRET` | Encrypted | ✅ Set |
| `NEXT_PUBLIC_RETIRED_PROVIDER_CLIENT_TOKEN` | Encrypted | ✅ Set |
| `LEMONSQUEEZY_API_KEY` | Encrypted | ✅ Set |
| `LEMONSQUEEZY_STORE_ID` | `294599` | ✅ Set |
| `LEMONSQUEEZY_VARIANT_MASTERCLASS_STARTER` | `1667970` | ✅ Set |
| `LEMONSQUEEZY_VARIANT_MASTERCLASS_PRO` | `1668025` | ✅ Set |
| `LEMONSQUEEZY_VARIANT_MASTERCLASS_COMMANDER` | `1668039` | ✅ Set |
| `GUMROAD_ACCESS_TOKEN` | Encrypted | ✅ Set |

## Gumroad Products

| Product | ID | Price | Status |
|---------|----|-------|--------|
| AutonomaX - Starter | `J59rJByCCyKKEfDouQjTDw==` | $29 | ✅ Published |
| AutonomaX - Pro | `1BzBT7MJ_yBSJ1d9W9OrjA==` | $79 | ✅ Published |
| AutonomaX - Commander | `H7uOVVl-CaUQJRp8e_73WQ==` | $149 | ✅ Published |

### Gumroad Checkout Reachability

| Checkout URL | Status |
|--------------|--------|
| `https://nomadauto.gumroad.com/l/autonomax-starter-29` | ✅ `HTTP 200` |
| `https://nomadauto.gumroad.com/l/autonomax-pro-79` | ✅ `HTTP 200` |
| `https://nomadauto.gumroad.com/l/autonomax-commander-149` | ✅ `HTTP 200` |

### Draft products (cleanup suggested)
- `SzeFnOHIyVuz9FlP6xUP` — Test ($1)
- `70evF5Id9e03Ly7FNsK-` — AutonomaX Masterclass — Commander (old)
- `UPyeETqpyq67poBsH7oh` — AutonomaX Masterclass — Pro (old)
- `j2AeTGQzQmP_EdDZol67` — AutonomaX Masterclass — Starter (old)

## Manual Steps Required (for zero-gap)

### 1. Retired provider — Go-Live Checklist
1. Go to **Retired provider Dashboard** → **Checkout Settings**
2. Configure a **Default Payment Link** (required for checkout creation)
3. Verify environment: sandbox vs production matches the API key
4. Test a transaction with test card numbers
5. Add payout/bank details when ready for production

### 2. Gumroad — Clean Up Draft Products
1. Go to `https://app.gumroad.com/products` 
2. Delete or archive the 4 draft products (Test + old Masterclass duplicates)

### 3. LemonSqueezy — Production Switch
1. When ready for live payments, disable test mode in LS Dashboard
2. No API changes needed

## Design Continuity — Applied Changes

| Area | Change |
|------|--------|
| Product names | Autonomax → AutonomaX on all 3 tiers |
| Cover images | Premium dark design with gradient, tags, features, pricing |
| Thumbnails | Matching 600x600 square crops |
| Descriptions | Rich markdown with features, steps, brand footer |
| Download files | Welcome kits with AutonomaX branding (WELCOME, API_REF, QUICKSTART, ENTERPRISE_SETUP) |
| Store profile | Name: AIKAGAN, Bio set, Profile pic present |
