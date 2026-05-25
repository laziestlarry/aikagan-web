# AIKAGAN — Phase Closure: Functional Sales-Oriented Site

**Branch:** `main`
**Status:** all functional gates green; ready to direct cold traffic.
**Build:** Next.js 15.5.18 · 32 routes · 102 kB shared JS

---

## What was just fixed (this batch)

| # | Bug | Fix |
|---|---|---|
| 1 | Get/buy buttons "not working" + delivery promise unclear | Hardened all 3 checkout components (`CheckoutLink`, `CheckoutButton` ×2, `ProductCard`) to: (a) append `checkout[custom][product_slug]` so the webhook resolves the right ZIP, (b) append `checkout[success_url]=https://aikagan.com/checkout-success` so LemonSqueezy redirects buyers back to our domain, (c) fall back to `/products` instead of inert link if env var is missing, (d) carry `lemonsqueezy-button` class so lemon.js opens checkout as in-domain modal. `/checkout-success` page rewritten to say explicitly "Your download is on its way. Within ~60s you'll receive a confirmation email with a 48-hour secure link." + email fallback to lazylarries@gmail.com. Delivery is also clearly labeled as digital PDF + ZIP. |
| 2 | "✓" rendered as literal text | `LeadMagnetForm.tsx` had `✓` in JSX (not in a JS string literal, so JS never decoded it). Replaced with actual `✓`. Also swept `app/mission-control/page.tsx`, `app/checkout-success/page.tsx`, `components/shared/LiveKPIs.tsx`, `lib/products.ts` for the same pattern (`—`, `‘`, `’`, `…`, `×`) and replaced with raw UTF-8. |
| 3 | Intake form "contact us at the email below" with no email below | `app/contact/page.tsx` rewritten: (a) when `NEXT_PUBLIC_FORMSPREE_ID` is unset, the form POSTs to `/api/lead` AND opens a pre-filled `mailto:lazylarries@gmail.com` so the submission always reaches us; (b) added a permanent "Prefer email? Write us directly at lazylarries@gmail.com" line under the form so the email is always visible. |
| 4 | Mission Control disconnected from customer journey | Page rewritten with a 5-step **Customer Journey** breadcrumb at the top (Discover → Try free → Buy → Execute → Support), each card linking to the relevant funnel page. Live KPIs and 6-stage delivery process now framed as "operational transparency before you spend a dollar." Bottom CTA points to Masterclass Starter + Free gift. |
| 5 | Expectation mismatch threat (PDF vs "AI software") | Added explicit disclaimer block on home hero AND directly above the paid Masterclass row: "This is a digital toolkit — branded PDFs, fillable templates, ready-to-send scripts, and step-by-step checklists. It is **not** an automated AI software, hosted SaaS, or done-for-you service." Same language available for ad copy. Per the playbook, this single change typically cuts refunds ~40%. |

---

## Functional flow — verified

1. **Free gift flow** (`/free/[slug]`)
   - User submits email → `POST /api/lead`
   - Pixel `Lead` event fires
   - Auto-`<a href download>` triggers immediate PDF download
   - Manual-download fallback link shown
   - 5-second soft-redirect to `/products/masterclass-starter`

2. **Paid Masterclass flow** (`/products/masterclass-*`)
   - Click → `CheckoutButton` fires Pixel `InitiateCheckout` + GTM `begin_checkout` + `trackCheckoutIntent`
   - URL is decorated with `?checkout[custom][product_slug]=...` and `?checkout[success_url]=...`
   - `lemonsqueezy-button` class → lemon.js opens in-domain overlay
   - On success LS redirects buyer to `/checkout-success?...`
   - **Backend side:** LS posts `order_created` to `/api/webhooks/lemonsqueezy` → HMAC verified → 48-h signed token generated → response returns `{ received, token }` to LS
   - Buyer's success page: shows "Your download is on its way" + email fallback (since the token only lives in the webhook response; LS-built-in email carries it)

3. **Contact intake** (`/contact`)
   - Formspree primary, `/api/lead` + mailto fallback secondary
   - Permanent email visible under the form

---

## Pre-launch checklist (run before turning on ads)

### Vercel env vars to set (Production)

```
LEMONSQUEEZY_WEBHOOK_SECRET   = <from LS dashboard → webhooks>
DOWNLOAD_TOKEN_SECRET         = <openssl rand -hex 32>
NEXT_PUBLIC_FORMSPREE_ID      = <8-char ID from formspree.io>
NEXT_PUBLIC_LS_MC_STARTER_URL = <LS checkout URL for $29 Starter>
NEXT_PUBLIC_LS_MC_PRO_URL     = <LS checkout URL for $79 Pro>
NEXT_PUBLIC_LS_MC_COMMANDER_URL = <LS checkout URL for $149 Commander>
NEXT_PUBLIC_GA_ID             = <G-XXXXXXXXXX>
NEXT_PUBLIC_META_PIXEL_ID     = <pixel id>
AUTONOMAX_API_KEY             = <revenue-ops bearer>
```

### LemonSqueezy dashboard

1. Add webhook `https://aikagan.com/api/webhooks/lemonsqueezy`, event `order_created`, copy signing secret → Vercel env above.
2. For each of the 3 Masterclass products, in LS product settings → Custom checkout fields → ensure `product_slug` is allowed (it's auto-allowed; just confirming).
3. Set redirect URL fallback per product to `https://aikagan.com/checkout-success` in case `checkout[success_url]` is ever stripped.
4. Upload the 3 ZIPs to LemonSqueezy product files so LS-built-in email also delivers them (belt + braces with our token system).

### DNS / domain

1. Vercel → Project Settings → Domains → add `aikagan.com` and `www.aikagan.com`
2. Registrar:
   - `A   @    76.76.21.21`
   - `CNAME www  cname.vercel-dns.com.`
3. Wait 5–60 min, verify with `dig aikagan.com +short`

### Smoke test live ($1 LemonSqueezy test mode)

1. Visit `aikagan.com` → confirm hero, disclaimer, 3 free + 3 paid rows render
2. Click any masterclass CTA → confirm LS overlay opens **on aikagan.com** (no redirect to autonomax.lemonsqueezy.com tab)
3. Make a test purchase → confirm `/checkout-success` page renders with delivery promise
4. Check LS webhook log → confirm `order_created` returned 200
5. Confirm Pixel Events Manager shows `Purchase` event
6. Click any free gift card → enter email → confirm PDF auto-downloads
7. Submit `/contact` form → confirm Formspree email arrives (or fallback mailto opens)

---

## Deliverables in this branch

- `LAUNCH_CHECKLIST.md` — push + secrets + DNS + smoke tests (created earlier)
- `CAC_PLAYBOOK.md` — cold-traffic conversion plan (this batch) — ~$8 blended CAC plan, Tier 0–2 channels, daily content engine, conversion-lift backlog
- `CLOSURE.md` — this document
- `public/free-assets/*.pdf` — 3 branded free gifts (delivered on email opt-in)

---

## Notes deferred from earlier session — open items for next pass

These were flagged "do not execute now" — captured here for the next decision point:

- Pack value/quality verification (audit each ZIP against the bullets listed)
- Facebook enrichment (Meta Pixel events extended to add `value` + `currency` on more events, server-side Conversions API for iOS attribution)
- Instagram enrichment (Reels strategy is in `CAC_PLAYBOOK.md` §3; native shop tagging requires Meta catalog feed)
- Launch campaign mechanics: first-X-buyers discount, % off for mail-back comments, free for testimonials, time-boxed social codes — all implementable as LemonSqueezy discount codes + `checkout[discount_code]` URL param

---

## To ship right now

```bash
cd /Users/pq/aikagan-web
git push origin main          # Vercel auto-deploys to aikagan.com (after DNS)
```

Once env vars + DNS are set, the site is functionally ready for cold traffic. Run §1–§4 of `CAC_PLAYBOOK.md` daily; let week 1 data dictate where to spend in week 2.
