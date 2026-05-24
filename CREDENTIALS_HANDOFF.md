# AIKAGAN Web — Credentials & Secrets Handoff
**Repo:** `github.com/laziestlarry/aikagan-web`  
**Date:** 2026-05-23  
**Status:** Pre-launch audit complete

---

## ✅ What Is Already Working

| Item | Status | Notes |
|------|--------|-------|
| LemonSqueezy Starter checkout URL | ✅ LIVE | `autonomax.lemonsqueezy.com/checkout/buy/2dd8d2ad…` → 302 to cart |
| LemonSqueezy Pro checkout URL | ✅ LIVE | `autonomax.lemonsqueezy.com/checkout/buy/5ae79599…` → 302 to cart |
| LemonSqueezy Commander checkout URL | ✅ LIVE | `autonomax.lemonsqueezy.com/checkout/buy/eb358df9…` → 302 to cart |
| `.env.local` gitignored | ✅ SAFE | Confirmed never committed to git history |
| Variable names in `.env.local` | ✅ FIXED | Was using `NEXT_PUBLIC_CHECKOUT_*` (wrong); now uses `NEXT_PUBLIC_LS_*` to match `lib/products.ts` |
| GitHub Pages deploy workflow | ✅ READY | `deploy.yml` — no secrets needed, deploys on push to `main` |

---

## ⚠️ What You Must Set Before Going Live

### 1. GitHub Actions Secrets — Vercel Deploy (`deploy2.yml`)

The production pipeline (`deploy2.yml`) deploys to Vercel. It needs 3 secrets set in your repo.

**Where to add them:**  
`https://github.com/laziestlarry/aikagan-web/settings/secrets/actions`

| Secret Name | How to Get It |
|-------------|--------------|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens → Create Token |
| `VERCEL_ORG_ID` | Vercel Dashboard → Team/Personal Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel Dashboard → Your Project → Settings → General → Project ID |

**Steps:**
1. Go to `https://vercel.com/account/tokens` → Create a new token (name it `AIKAGAN_GITHUB_ACTIONS`)
2. Go to your Vercel project settings → copy `Project ID` and `Org/Team ID`
3. Go to `https://github.com/laziestlarry/aikagan-web/settings/secrets/actions`
4. Click **New repository secret** for each of the 3 values above

---

### 2. Analytics — Optional but Recommended

Add these to `.env.local` locally AND as Vercel Environment Variables for production:

| Variable | Where to Get It |
|----------|----------------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics → Admin → Data Streams → your stream → Measurement ID (e.g. `G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Business Suite → Events Manager → your Pixel → Pixel ID |

**To add to Vercel (production):**  
Vercel Dashboard → Your Project → Settings → Environment Variables → Add each one.

---

### 3. LemonSqueezy Checkout URLs — Optional Overrides

The checkout URLs are **already hardcoded and live** in `lib/products.ts`. You only need to set these env vars if you want to swap to a different store or product variant:

```
NEXT_PUBLIC_LS_STARTER_URL=   # leave blank = use hardcoded autonomax URL
NEXT_PUBLIC_LS_PRO_URL=       # leave blank = use hardcoded autonomax URL
NEXT_PUBLIC_LS_COMMANDER_URL= # leave blank = use hardcoded autonomax URL
```

---

## 🚀 Go-Live Checklist

- [ ] Set `VERCEL_TOKEN` in GitHub repo secrets
- [ ] Set `VERCEL_ORG_ID` in GitHub repo secrets
- [ ] Set `VERCEL_PROJECT_ID` in GitHub repo secrets
- [ ] (Optional) Add `NEXT_PUBLIC_GA_ID` to Vercel env vars
- [ ] (Optional) Add `NEXT_PUBLIC_META_PIXEL_ID` to Vercel env vars
- [ ] Push to `main` branch → watch `deploy2.yml` complete in GitHub Actions
- [ ] Verify live URL resolves and checkout buttons work end-to-end

---

## 🔒 Security Notes

- `.env.local` is in `.gitignore` (`*.env*.local`) — **never committed**, confirmed clean history
- All checkout processing is handled server-side by LemonSqueezy — no payment credentials ever touch this repo
- GitHub Actions secrets are encrypted at rest by GitHub — safe to store Vercel tokens there
- Do **not** add `VERCEL_TOKEN` to `.env.local` — it is only needed in GitHub repo secrets

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `.env.local` | Local dev overrides — never committed |
| `.env.local.example` | Template for teammates |
| `lib/products.ts` | Hardcoded LemonSqueezy checkout URLs + product config |
| `.github/workflows/deploy.yml` | GitHub Pages static deploy |
| `.github/workflows/deploy2.yml` | Vercel production deploy (needs 3 secrets above) |
