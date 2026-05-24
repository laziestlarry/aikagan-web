# AIKAGAN.COM — GEMINI HANDOFF PROMPT
**Mission: $2,000 in 48 hours. Everything coded. Only external setup remains.**

---

## CONTEXT FOR GEMINI

You are taking over AIKAGAN.com operational launch from an AI that completed all codebase upgrades.  
The site sells three digital product packs (AutonomaX Golden Delivery Starter $29 / Pro $79 / Commander $149) via LemonSqueezy.  
All conversion mechanics, overlay checkout, urgency, upsell sequences, SEO infrastructure, and webhook handler are **live in code and deployed to Vercel**.

**Your only job is the 9 external-account tasks below, in order.**  
Do not touch the codebase. These are credential activations and platform configs that require human login.

---

## WHAT IS ALREADY DONE ✓

| Area | Status |
|------|--------|
| LemonSqueezy overlay checkout (`lemonsqueezy-button`) wired to every CTA | ✓ DONE |
| 72-hour rolling countdown timer (homepage sticky urgency banner) | ✓ DONE |
| Social proof strip + micro-testimonials (homepage) | ✓ DONE |
| Post-purchase upsell page (`/checkout-success`) — tiered per product, auto-upsells Starter→Pro→Commander | ✓ DONE |
| All 3 product pages: FAQ sections, objection-killer copy | ✓ DONE |
| GTM `begin_checkout` dataLayer events on every checkout link | ✓ DONE |
| `next.config.js` — static export removed, Vercel SSR enabled | ✓ DONE |
| `app/sitemap.ts` + `app/robots.ts` | ✓ DONE |
| `app/api/webhooks/lemonsqueezy/route.ts` — HMAC-verified, forwards to Make.com | ✓ DONE |

---

## YOUR TASK LIST (External Setup Only)

Work in this exact order. Each task has a time estimate.

---

### TASK 1 — LemonSqueezy: Register Webhook
**Time: 5 minutes**

1. Log in to LemonSqueezy dashboard → Settings → Webhooks
2. Click **Add Webhook**
3. **URL**: `https://aikagan.com/api/webhooks/lemonsqueezy`
4. **Events to select**: ☑ `order_created`
5. Copy the **Signing Secret** that LS generates
6. Go to Vercel → Project Settings → Environment Variables → add:
   - `LEMONSQUEEZY_WEBHOOK_SECRET` = (the signing secret from step 5)
7. **Redeploy** on Vercel (click Redeploy on latest deployment)

---

### TASK 2 — Make.com: Create Purchase Automation
**Time: 15 minutes**

Goal: When a sale happens → deliver download link → tag buyer in email list → log to sheet.

1. Log in to Make.com → Create a new Scenario
2. **Trigger module**: Webhooks → Custom Webhook → copy the webhook URL
3. Go to Vercel → Environment Variables → add:
   - `MAKE_WEBHOOK_URL` = (the Make.com webhook URL from step 2)
4. Redeploy Vercel
5. Back in Make.com, build the scenario:
   ```
   [Webhook] → [Email: Send email with download link] → [Google Sheets: Log purchase row]
   ```
   - Email "From": your sender email
   - Email "To": `{{customer_email}}` from webhook payload
   - Email "Subject": `Your AutonomaX Pack is ready — download now`
   - Email body: include `{{checkout_url}}` (receipt URL from payload) and direct download instructions
   - Sheets row: timestamp, customer_email, product_name, total
6. Activate the scenario (toggle ON)
7. Test: place a $0 test order in LemonSqueezy and verify the scenario runs

---

### TASK 3 — LemonSqueezy: Verify Download Files Are Attached
**Time: 5 minutes**

1. In LemonSqueezy → Products → each product → Files tab
2. Confirm the correct ZIP is attached:
   - Starter → `AutonomaX_Golden_Delivery_Starter_Pack.zip`
   - Pro → `AutonomaX_Golden_Delivery_Pro_Pack.zip`
   - Commander → `AutonomaX_Golden_Delivery_Commander_Pack.zip`
3. If missing: upload the files now
4. These are served by LS on purchase — the site's `/downloads/` paths are backup reference only

---

### TASK 4 — GTM: Configure Conversion Tag
**Time: 10 minutes**

GTM container `GTM-NZW2CP6H` is already installed. Add the conversion tag:

1. Log in to Google Tag Manager → Container GTM-NZW2CP6H
2. **Tags → New → Google Ads Conversion Tracking** (or GA4 Purchase event if no Google Ads)
3. **Trigger**: Custom Event → Event name: `begin_checkout`
4. Map variables:
   - `value` → `{{ecommerce.value}}`
   - `currency` → `USD`
   - `items` → `{{ecommerce.items}}`
5. **Submit** and **Publish** the container version
6. Verify with GTM Preview mode: open aikagan.com, click any checkout button, confirm `begin_checkout` fires

---

### TASK 5 — Google Search Console: Submit Sitemap
**Time: 3 minutes**

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Select `aikagan.com` property (create if first time)
3. Sitemaps → Enter `sitemap.xml` → Submit
4. Confirm status shows "Success"

---

### TASK 6 — LemonSqueezy: Activate Discount Code (Launch Promo)
**Time: 5 minutes**

Create a launch discount to use in DM outreach and social posts:

1. LemonSqueezy → Discounts → New Discount
2. Code: `KAGANATE` (or your choice)
3. Amount: 20% off
4. Applies to: All products
5. Usage limit: 50 uses
6. Expiry: 48 hours from now
7. Copy the code — you'll use it in Task 8 outreach messages

---

### TASK 7 — Zero-Ad Sales Sprint (Start This Immediately, Run In Parallel)
**Time: 2 hours active, then ongoing**

This is the fastest path to $2,000. No ads needed.

**DM Script (WhatsApp / LinkedIn / Instagram / email):**
```
Hey [name] — I just launched a toolkit that's helping people land their first 
AI-assisted revenue sale in 7 days. It's $29 and comes with exact scripts, 
checklists, and a day-by-day blueprint.

Here's the link: https://aikagan.com/products/golden-delivery-starter/

Use code KAGANATE for 20% off today only. Happy to answer any questions.
```

**Target list (work through in order):**
1. Anyone who has expressed interest in making money online in last 6 months
2. Freelancers, consultants, coaches in your network
3. Anyone who follows AI / side hustle content
4. LinkedIn connections with "consultant", "freelance", "coach" in bio
5. Reddit: r/beermoney, r/WorkOnline (genuine post, link in comments if allowed)

**Math to $2,000:**
- 69 Starter sales @ $29 = $2,001
- 26 Pro sales @ $79 = $2,054
- 14 Commander sales @ $149 = $2,086
- Any mix works — aim for 50+ DMs in the first 4 hours

---

### TASK 8 — Social Posts (Fire These Now)
**Time: 20 minutes**

**Twitter/X:**
```
I just launched a done-for-you AI revenue toolkit.

7 files. Day-by-day blueprint. Exact DM scripts.
Designed to get your first AI-assisted sale in 7 days.

$29 launch price (going up soon).

→ aikagan.com/products/golden-delivery-starter/

Use code KAGANATE for 20% off today only.
```

**LinkedIn:**
```
After months of building, I launched AutonomaX Golden Delivery today.

It's a 3-tier digital product system that gives people the exact 
blueprint, scripts, and checklists to start making AI-assisted revenue — 
starting at $29.

If you've been meaning to start monetizing your skills but keep getting 
stuck in "preparation mode," this is for you.

Launch pricing: Starter $29 / Pro $79 / Commander $149

aikagan.com

(Use KAGANATE for 20% off — 48 hours only)
```

---

### TASK 9 — Formspree / Contact Form (5 min, if broken)
**Time: 5 minutes if not already done**

If the contact form on `/contact` doesn't send messages:

1. Go to [formspree.io](https://formspree.io) → New Form
2. Copy the form endpoint (looks like `https://formspree.io/f/xpwzabcd`)
3. Open `app/contact/page.tsx` in the repo — find the form `action=""` attribute and set it to your Formspree URL
4. Commit and push — Vercel auto-deploys

---

## MONITORING (Check Every 3 Hours)

| Signal | Where to check |
|--------|----------------|
| Webhook firing | Make.com → Scenario history |
| GTM events | GA4 → Events → `begin_checkout` |
| Orders | LemonSqueezy → Orders |
| Revenue | LemonSqueezy → Dashboard |

**If no sales in 4 hours**: double the DM volume (Task 7). The site converts — traffic is the only variable.

---

## TECH STACK REFERENCE (read-only)

- **Framework**: Next.js 15, App Router, TypeScript
- **Hosting**: Vercel (auto-deploy from GitHub `main` branch)
- **Payments**: LemonSqueezy (overlay checkout via lemon.js — `lemonsqueezy-button` class)
- **Automation**: Make.com (webhook → email + sheets)
- **Analytics**: Google Tag Manager `GTM-NZW2CP6H` + `@vercel/analytics`
- **Webhook endpoint**: `POST https://aikagan.com/api/webhooks/lemonsqueezy`
- **Env vars needed in Vercel**: `LEMONSQUEEZY_WEBHOOK_SECRET`, `MAKE_WEBHOOK_URL`
- **Support email**: lazylarries@gmail.com

---

*Handoff complete. All code deployed. Execute tasks 1–8 in order. $2,000 target: 48 hours.*
