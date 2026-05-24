# AIKAGAN Launch Checklist — Golden Delivery Live

**Branch:** `launch/golden-delivery-live` (fast-forwarded into `main`)
**Build status:** ✅ Green (Next.js 15.5.18, 31 static pages, 7 dynamic routes)
**Local commits ahead of origin/main:** 15

---

## 1. Push to origin (manual — sandbox has no GitHub creds)

From your terminal:

```bash
cd /Users/pq/aikagan-web
git push origin main
git push origin launch/golden-delivery-live
```

Once `main` is pushed, Vercel auto-deploys to production (workflow `deploy2.yml` triggers on `push` to `main` and runs `vercel --prod --yes`).

---

## 2. Set production secrets in Vercel

Already in `.env.local`: `NEXT_PUBLIC_FORMSPREE_ID`, `NEXT_PUBLIC_LS_STARTER_URL`, `NEXT_PUBLIC_LS_PRO_URL`, `NEXT_PUBLIC_LS_COMMANDER_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`.

**Still missing — set in Vercel → Project → Settings → Environment Variables (Production):**

| Variable | Purpose |
|---|---|
| `LEMONSQUEEZY_WEBHOOK_SECRET` | HMAC-SHA256 verification of `order_created` events. Generate in LemonSqueezy dashboard → Settings → Webhooks → add `/api/webhooks/lemonsqueezy` and copy the signing secret. |
| `DOWNLOAD_TOKEN_SECRET` | Signs the 48 h download tokens issued post-purchase. Generate with `openssl rand -hex 32`. |
| `NEXT_PUBLIC_AUTONOMAX_API_URL` | `https://autonomax-revenue-ops-71658389068.us-central1.run.app` (already in example) |
| `AUTONOMAX_API_KEY` | Bearer token for the revenue-ops backend (Cloud Run). |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV (optional — only if attribution writes are persisted). |

Also set the same `NEXT_PUBLIC_*` keys for Production so they're inlined at build time.

---

## 3. Configure the LemonSqueezy webhook

In LemonSqueezy → Settings → Webhooks → New webhook:

- **URL:** `https://aikagan.com/api/webhooks/lemonsqueezy`
- **Events:** `order_created`
- **Signing secret:** copy → paste into `LEMONSQUEEZY_WEBHOOK_SECRET` in Vercel

---

## 4. Place ZIP files in `private/downloads/`

The webhook resolves an order to a `slug`, then `/api/download/[token]` serves the file from `private/downloads/<zipFilename>`. Confirm the three product ZIPs are present locally and committed (already in repo root — they need to be moved into `private/downloads/` or re-pointed in `lib/products.ts`).

Run from `/Users/pq/aikagan-web`:

```bash
mkdir -p private/downloads
mv AutonomaX_Golden_Delivery_Starter_Pack.zip   private/downloads/
mv AutonomaX_Golden_Delivery_Pro_Pack.zip       private/downloads/
mv AutonomaX_Golden_Delivery_Commander_Pack.zip private/downloads/
git add private/downloads
git commit -m "chore: move product ZIPs to private/downloads"
git push
```

---

## 5. Conversion machinery confirmed live

| Layer | File | What it does |
|---|---|---|
| Hero CTA | `app/page.tsx` | Uses `CheckoutLink` with attribution + countdown |
| Product CTA | `app/products/golden-delivery-*/page.tsx` | `CheckoutButton` fires Meta Pixel `InitiateCheckout` + `trackCheckoutIntent` then redirects to LemonSqueezy with `?checkout[custom][product_slug]=…` |
| Lead magnets | `app/free/[slug]/page.tsx` | Email opt-in, fires Pixel `Lead`, calls `/api/lead` which posts to autonomax + returns asset path |
| Webhook | `app/api/webhooks/lemonsqueezy/route.ts` | HMAC verify → mint 48 h token → return `{ token }` |
| Thank-you | `app/checkout-success/page.tsx` | Reads `?token=…`, calls `/api/download/[token]` to stream the ZIP |
| Attribution | `src/lib/attribution.ts` + `AttributionInit` | UTM capture in localStorage, replay on checkout and lead submit |
| Live KPIs | `app/mission-control/page.tsx` + `components/shared/LiveKPIs.tsx` | Polls `/api/revenue-ops/api/mission/status` |
| Analytics | `app/layout.tsx` | GTM (`GTM-NZW2CP6H`), GA4, Meta Pixel, Vercel Web Analytics |

---

## 6. Post-deploy smoke tests

1. Visit `https://aikagan.com` — homepage renders, hero CTA present
2. Click any pack CTA → LemonSqueezy checkout opens with `product_slug` in URL
3. Make a test purchase ($1 LemonSqueezy test mode) → confirm webhook hit (LS dashboard) → confirm `/checkout-success?token=…` serves the ZIP
4. Visit `/free/builder-starter-checklist` → submit email → confirm `lead_captured` log in Vercel and Pixel `Lead` event in Meta Events Manager
5. `/mission-control` → confirm Live KPIs render (proxy hits Cloud Run)

---

## 7. What was archived

- `/Users/pq/aikagan.com` (static Netlify deploy) — marked with `LEGACY_NOTICE.md`. Production is now Vercel exclusively.
- `src/app/` (orphan duplicate Next.js app dir) — deleted by `bc39ced`. Resolved the dual-app-dir conflict that silently blocked the root `app/`.
- `src/components/CheckoutButton.tsx` (legacy stub) — deleted; was shadowing the real component via `@/*` tsconfig path priority.

---

## 8. Superposition summary (what merged into launch/golden-delivery-live)

1. **`upgrade/vercel-autonomax-integration`** (15 commits) — full conversion stack: LemonSqueezy webhooks, signed download tokens, Meta Pixel events, UTM attribution, lead magnets, revenue-ops proxy, live KPIs, full offer ladder, Vercel migration.
2. **`bc39ced` (agents/case-study-debug-launch-fix)** — dual-app-dir fix, removed `output: 'export'`, fixed CI pipeline, implemented lead webhook forward.
3. **`4340a7a` (wip on main)** — pre-launch hero redesign, checkout-success page, premium home image, attribution-aware `CheckoutLink` with countdown.
4. **`2afbf20` (build fixes)** — Next.js 15 async params, route export hygiene, ESLint relaxation, type narrowing.

---

## 9. Profit OS modules invoked

- **Profit Radar** — offer ladder in `lib/products.ts` (lead magnet → $29 starter → $79 pro → $149 commander)
- **Offer That Prints Money** — three packs with bullets, deliverables, guarantees
- **Website That Sells While You Sleep** — full funnel: landing → free → checkout → success → download
- **Objection Killer** — legal pages (terms, refund, privacy), money-back guarantee on product pages
- **Automation Money Machine** — webhook-driven post-purchase, autonomax revenue-ops backend, scheduler hits Cloud Run via proxy
- **Zero-Ad Sales Plan** — UTM attribution layer + lead magnets capture organic traffic before paid spend kicks in
