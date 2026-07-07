# EXECUTION DASHBOARD — PIPELINED & ONGOING
## AutonomaX — Daily/Weekly/Monthly Performance Tracking

> **Every metric tied to a decision.** No vanity metrics. Real-time with daily updates.

---

## LIVE STATUS (Current Snapshot)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PIPELINE STATUS — PHASE 1                       │
├─────────────────────────────────────────────────────────────────────┤
│ 🟡 Paddle Checkout     — Code done, awaiting PADDLE_API_KEY         │
│ 🟢 Shopier Store       — LIVE (19 products, autonomax.shopier.com)  │
│ 🟢 aikagan.com         — DEPLOYED (Vercel, build passes)            │
│ 🔲 Email Capture       — Not configured (needs Formspree ID)        │
│ 🔲 Make.com Webhooks   — 4 configured but not wired                 │
│ 🔲 Organic Social      — Not started                                │
│ 🔲 Google Ads          — Not started                                │
│ 🔲 Affiliate Program   — Not started                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## TIER 1: FINANCIAL HEALTH (Update Daily)

| Metric | Today | Week Target | Month Target | Status |
|--------|-------|-------------|--------------|--------|
| **Revenue (daily)** | $0 | $50 | $50 | 🟡 Paddle blocked |
| **Orders (daily)** | 0 | 1-2 | 1-2 | 🟡 |
| **AOV** | — | $58+ | $58+ | ⚪ No data |
| **Gross margin** | — | >90% | >93% | ⚪ No data |
| **Shopier (weekly)** | — | — | $50-$300 | 🟢 Live, needs promo |

### Financial Targets by Phase

```
Phase 1a (Paddle live):   $  50 - $  800 /week   (organic only)
Phase 1b (Week 2-4):      $ 850 - $ 3,600 /week  (organic + Shopier)
Phase 1c (Month 2):       $ 3,400 - $14,400 /month
Phase 2 (Entity ready):   $ 8,000 - $35,000 /month
Phase 3 (Stripe + subs): $30,000 - $250,000 /month
```

---

## TIER 2: CONVERSION ENGINE (Update Daily)

| Metric | Today | Target | Status | Action if Red |
|--------|-------|--------|--------|--------------|
| **Unique visitors/day** | — | 200+ | ⚪ No traffic source | Post content daily |
| **Traffic channels active** | 0/4 | 2 | 🔲 | Post on Reddit + LI today |
| **Page to checkout %** | — | >5% | ⚪ | Improve CTAs |
| **Checkout completion %** | — | >60% | ⚪ | Test Paddle flow |
| **Email opt-in rate** | — | >5% | 🔲 | Add Formspree |

### Traffic Channel Pipeline

| Channel | Status | First Post | Daily Posts | Est. Visitors |
|---------|--------|-----------|-------------|---------------|
| Reddit | 🔲 Not started | Day 1 | 1-2 | 50-200 |
| LinkedIn | 🔲 Not started | Day 1 | 1 | 30-100 |
| Twitter/X | 🔲 Not started | Day 2 | 2-3 | 20-50 |
| IndieHackers | 🔲 Not started | Day 2 | 1/wk | 20-80 |
| Google Ads | 🔲 Not started | Week 3 | — | 50-200 ($10-20/day) |

---

## TIER 3: CUSTOMER HEALTH (Update Weekly)

| Metric | Week 1 | Month 1 | Month 3 | Alert |
|--------|--------|---------|---------|-------|
| **Orders fulfilled** | 0-10 | 30-60 | 500+ | >2h without fulfillment |
| **Refund rate** | 0% | <5% | <3% | >10% → review product |
| **Support response** | <4h | <4h | <2h | >24h → add support |
| **Repeat purchase rate** | — | >5% | >15% | <5% → check upsell flow |

---

## TIER 4: OPERATIONAL HEALTH (Update Daily)

| Metric | Status | Target | Alert |
|--------|--------|--------|-------|
| **Paddle API** | 🟡 Not configured | 100% uptime | Payment gateway down |
| **Vercel uptime** | 🟢 Live | 99.99% | Deployment failed |
| **Download token system** | 🟢 Working | 100% success | Token generation fails |
| **Shopier store** | 🟢 Live | 100% uptime | Store returns error |
| **Build status** | 🟢 Passes | 0 errors | Build breaks |

---

## PIPELINE VIEW (Kanban)

### BUILD PIPELINE (Code)

```
BACKLOG                           IN PROGRESS              DONE
┌──────────────┐                 ┌──────────────┐         ┌──────────────┐
│ Shopier API   │                 │ Paddle account│         │ Paddle code  │
│ bridge        │                 │ creation     │         │ migration    │
├──────────────┤                 ├──────────────┤         ├──────────────┤
│ Email sequence│                 │ Vercel env   │         │ Build passes │
├──────────────┤                 │ vars         │         ├──────────────┤
│ Google Ads   │                 └──────────────┘         │ Deployment   │
├──────────────┤                                          ├──────────────┤
│ Make.com     │                                          │ Business docs│
│ webhooks     │                                          └──────────────┘
├──────────────┤
│ Affiliate    │
│ program      │
└──────────────┘
```

### REVENUE PIPELINE

```
LEAD CAPTURE        →   CHECKOUT INITIATED   →   PAYMENT RECEIVED   →   DELIVERED
🔲 Formspree        →   🟢 Paddle checkout   →   🟡 Paddle webhook  →   🟢 Token → ZIP
🔲 Lead magnet flow      (code ready,               (needs keys)          (HMAC, no DB)
    needs Form ID)         needs keys)
```

---

## DAILY TASK LIST (Checklist)

```
TODAY'S DATE: _______________

□ Check Paddle dashboard/status
□ Check Shopier dashboard (new orders?)
□ aikagan.com health check (visit homepage, verify no errors)
□ Post 1 piece of content (Reddit / LinkedIn / Twitter)
□ Respond to all comments and messages
□ Track revenue: Paddle $___ + Shopier $___ = $___
□ Pipeline check: anything blocked? ________________________________
□ PM update if needed: status note in docs/pack/05_EXECUTION_DASHBOARD.md
```

---

## WEEKLY REVIEW TEMPLATE

```
WEEK ENDING: _______________

REVENUE:
  Paddle: $_____ (___ orders)
  Shopier: $_____ (___ orders)
  Total: $_____

TRAFFIC:
  Unique visitors: _____
  Top channel: ___________
  Conversion rate: _____%

CUSTOMERS:
  New customers: _____
  Refunds: _____ (___%)
  Support tickets: _____

PIPELINE:
  Items completed: _______________
  Items blocked: _________________
  Items started: _________________

DECISIONS FOR NEXT WEEK:
  1. ___________________________________
  2. ___________________________________
  3. ___________________________________

BLOCKERS (need help with):
  • ___________________________________
```
