# KPI DASHBOARD & SUCCESS METRICS FRAMEWORK
## AutonomaX Business Unit — Real-Time Performance Tracking

> **Purpose:** Every metric tied to a decision. No vanity metrics. Every KPI has a target, an alert threshold, and a specific action to take when it goes red.

---

## DASHBOARD STRUCTURE

Four metric tiers, updated daily:

```
TIER 1: FINANCIAL HEALTH     TIER 2: CONVERSION ENGINE
├── Revenue (daily)          ├── Traffic by channel
├── Orders (daily)           ├── Conversion rate
├── AOV (avg order value)    ├── Cart abandonment
└── Gross profit             └── Email opt-in rate

TIER 3: CUSTOMER HEALTH      TIER 4: OPERATIONAL
├── Churn rate               ├── Fulfillment time
├── Repeat purchase rate     ├── AI agent uptime
├── NPS / satisfaction       ├── Server response time
└── Refund rate              └── Webhook success rate
```

---

## TIER 1: FINANCIAL HEALTH

### Revenue Metrics

| Metric | Calculation | Daily Target | Weekly Target | Monthly Target | Alert | Action if Red |
|--------|------------|-------------|---------------|---------------|-------|--------------|
| **Daily Revenue** | Sum of all Stripe + Shopier + Shopify sales | $50 | $350 | $1,500 | < $10/day for 3 days | Increase ad spend, post more content |
| **Weekly Revenue** | 7-day rolling sum | — | $500-$3,600 | — | < $200/week | Audit all channels, revert to Phase 1 |
| **Monthly Revenue** | Month-to-date | — | — | $3,400-$14,400 | < $1,000/mo end of week 2 | Full funnel audit |
| **Monthly Recurring** | Sum of active monthly subscriptions | — | — | $470+ (10 subs × $47) | < $470 | Activate subscription campaign |
| **Gross Margin** | (Revenue - Stripe/Shopier fees - COGS) / Revenue | > 90% | > 92% | > 94% | < 88% | Check for unexpected costs |

### Order Metrics

| Metric | Calculation | Target | Alert | Action |
|--------|------------|--------|-------|--------|
| **Orders/Day** | Count of completed payments | 5+/day (Month 1) | 0 orders in 24h | Emergency Protocol |
| **Avg Order Value** | Revenue / Orders | $58+ | < $29 | Check products sold (starter only?) |
| **Refund Rate** | Refunds / Total Orders | < 5% | > 10% | Review product quality, support issues |
| **Chargeback Rate** | Disputes / Orders | < 0.5% | > 1% | Stripe may restrict. Check fraud. |

### Financial Targets

```
Day 1-7:    $   500 - $ 3,600   (breakeven: 2 sales)
Day 8-14:   $ 1,000 - $ 7,200   (Google Ads active)
Day 15-30:  $ 3,400 - $14,400   (email + partners)
Day 31-60:  $ 8,000 - $35,000   (premium engine + Shopify)
Day 61-90:  $15,000 - $60,000   (enterprise + recurring)
Day 91-365: $30,000 - $250,000  (scaled system)
```

---

## TIER 2: CONVERSION ENGINE

### Traffic Metrics

| Metric | Calculation | Target | Alert | Action |
|--------|------------|--------|-------|--------|
| **Unique Visitors/Day** | Google Analytics unique sessions | 500+ (Month 1) | < 50/day | Increase posting frequency |
| **Traffic by Channel** | Organic / Paid / Social / Referral ratio | Diversified | Any channel > 80% | Activate dormant channels |
| **Top Content** | Page with most views | Product page | < 100 visits/week | Refresh SEO, update content |
| **Bounce Rate** | Single-page sessions / Total | < 60% | > 75% | Improve landing page, loading speed |

### Conversion Metrics

| Metric | Calculation | Target | Alert | Action |
|--------|------------|--------|-------|--------|
| **Overall CVR** | Orders / Unique Visitors | 2.0%+ | < 0.5% | Audit checkout flow |
| **Page to Checkout** | Checkout starts / Page views | 5%+ | < 2% | Improve product page CTA |
| **Checkout to Payment** | Completed / Started | 70%+ | < 50% | Check Stripe errors, card acceptance |
| **Email Opt-In Rate** | Email captures / Visitors | 5%+ | < 2% | Improve lead magnet offer |
| **Lead to Sale** | Purchase / Email captures | 5%+ in 30 days | < 2% | Improve email sequence |

### Channel-Specific KPIs

| Channel | KPI | Target | Action if Red |
|---------|-----|--------|--------------|
| **Reddit** | Upvotes per post | 20+ | Change subreddit or content angle |
| **Reddit** | Click-through rate | 3%+ | Improve headline hook |
| **LinkedIn** | Engagement rate | 5%+ | Post different content format |
| **Twitter/X** | Retweet rate | 2%+ | Use more visuals, threads |
| **Google Ads** | CTR | 2%+ | Refresh ad copy, keywords |
| **Google Ads** | CPC | < $1.50 | Pause expensive keywords |
| **Google Ads** | ROAS | 3x+ | Scale if >3x, fix if <1x |
| **Partners** | Sales per partner | 5+/month | Provide better promo materials |

---

## TIER 3: CUSTOMER HEALTH

### Satisfaction Metrics

| Metric | Calculation | Target | Alert | Action |
|--------|------------|--------|-------|--------|
| **Refund Rate** | Refunds / Orders | < 5% | > 10% | Review product, improve descriptions |
| **Support Tickets** | Per 100 orders | < 10 | > 25 | Add FAQ, improve docs |
| **First Response Time** | Time to first reply | < 4 hours | > 24 hours | Add more support hours or AI assistant |
| **Resolution Time** | Time to close | < 24 hours | > 72 hours | Escalate or refund |
| **NPS** | (Promoters - Detractors) / Total | 50+ | < 30 | Survey for improvement areas |

### Retention Metrics

| Metric | Calculation | Target (Month 1) | Target (Month 3) | Action if Red |
|--------|------------|-----------------|-----------------|--------------|
| **Repeat Purchase** | 2+ orders / Total customers | 5% | 15% | Launch loyalty program |
| **Upgrade Rate** | Starter → Pro/Commander | 10% | 20% | Improve upsell sequence |
| **White-Label Conversion** | Commander → reselling | — | 5% | Better white-label support |
| **Referral Rate** | Referred / Total | 2% | 10% | Launch referral incentive |

### Cohort Tracking Table

```
Month  Cohort Size  Revenue/Cohort  Retention   Repeat Rate
─────  ───────────  ──────────────  ─────────   ──────────
Month 1    ___           $___          ___%         ___%
Month 2    ___           $___          ___%         ___%
Month 3    ___           $___          ___%         ___%
```

---

## TIER 4: OPERATIONAL HEALTH

### Technical Metrics

| Metric | Target | Alert | Action |
|--------|--------|-------|--------|
| **Site Uptime** | 99.9%+ | < 99% | Check Vercel status, restart |
| **Checkout API Response** | < 500ms | > 2s | Check Stripe API latency |
| **Token Delivery Time** | < 3s from payment | > 10s | Check token-store fallback |
| **Webhook Success Rate** | 99%+ | < 95% | Check Stripe Dashboard |
| **AI Agent Uptime** | 95%+ | < 80% | Provider fallback chain |
| **Download Speed** | > 50 Mbps | < 10 Mbps | Check Vercel Blob/CDN |
| **SSL Certificate** | 30+ days to expiry | < 7 days | Auto-renew (Vercel handles) |

### Response & Recovery

| Scenario | Recovery Time | Action |
|----------|--------------|--------|
| Stripe Checkout fails | < 5 min | Switch to backup payment method |
| Site down | < 15 min | Vercel auto-restore or manual deploy |
| Token delivery broken | < 30 min | Email support@aikagan.com with order ID |
| AI agents all offline | < 5 min | Fallback to static content |
| Security breach | < 60 min | Revoke all keys, contact Stripe |

---

## DATA SOURCES & COLLECTION

### Automated Sources
| Data | Source | Update Frequency |
|------|--------|-----------------|
| Revenue & Orders | Stripe API (via webhook + dashboard) | Real-time |
| Traffic & Behavior | Google Analytics 4 | Real-time |
| Email metrics | Resend/SendGrid API | Daily (batch) |
| AI agent performance | unified_ai_income logs | Real-time |
| Server metrics | Fly.io/Vercel dashboard | Real-time |
| Ad performance | Google Ads API | Daily |
| Partner sales | Manual spreadsheet (until automated) | Weekly |

### Manual Sources
| Data | Source | Update Frequency |
|------|--------|-----------------|
| Shopier orders | Shopier dashboard check | Daily |
| Partner check-ins | Manual outreach | Weekly |
| Customer feedback | Email + support tickets | Weekly |
| Competitor prices | Manual review | Monthly |

---

## REPORTING CADENCE

### Daily (5 minutes)
```
□ Stripe Dashboard: new sales, revenue
□ Email: customer inquiries
□ Google Analytics: unusual patterns?
□ Social: engagement on latest posts
→ One row in daily log
```

### Weekly (30 minutes — Sunday)
```
□ Full KPI review (all 4 tiers)
□ Compare to targets
□ Identify top/bottom channels
□ Plan next week's content + ads
→ Weekly report in docs/business/reports/
```

### Monthly (2 hours — Month End)
```
□ Full financial review
□ Customer cohort analysis
□ Product performance review
□ Cost analysis (Stripe fees, AI API costs, hosting)
□ Month-over-month growth
→ Monthly report + next month plan
```

---

## DASHBOARD TEMPLATES

### Daily Log (Spreadsheet Format)
```
Date    | Rev  | Orders | AOV | Source1 | Source2 | CVR | Notes
────────|──────|────────|─────|─────────|─────────|─────|──────
Day 1   | $58  | 1      | $58 | Reddit  | —       | 2%  | First sale!
Day 2   | $0   | 0      | $0  | —       | —       | 0%  | No traffic
Day 3   | $116 | 2      | $58 | LI      | Reddit  | 1.5%| Better headline
```

### Weekly Review (Scorecard)
```
WEEK ENDING: __/__/____

REVENUE:
  Target: $___   Actual: $___   % of Target: ___%

TRAFFIC:
  Total Visitors: ___   Top Channel: ___   CVR: ___%

CUSTOMERS:
  New: ___   Total: ___   Repeat: ___   Avg Order: $___

EMAIL:
  Subscribers: ___   Open Rate: ___%   Click Rate: ___%

OPERATIONS:
  Site Uptime: ___%   Fulfillment Time: ___   Support Tickets: ___

TOP 3 THIS WEEK:
  1.
  2.
  3.

BOTTOM 3 (TO FIX):
  1.
  2.
  3.

NEXT WEEK'S TARGET: $___
```

### Monthly Dashboard
```
MONTH: _______________

FINANCIAL:
  Revenue:       $___  (target: $___)
  Gross Profit:  $___  (margin: ___%)
  Refunds:       $___  (rate: ___%)
  Recurring MRR: $___  (___ subscribers)

CUSTOMERS:
  New:           ___   Total Cohort: ___
  Avg Order:     $___  AOV trend: ___/___
  Top Product:   ___

CHANNELS:
  Organic:     $___  (___%)  CVR: ___%
  Paid:        $___  (___%)  CVR: ___%  ROAS: ___x
  Partners:    $___  (___%)  CVR: ___%
  Shopier:     ₺___  (___%)  CVR: ___%

GROWTH:
  MoM Revenue Growth: ___%
  MoM Customer Growth: ___%
  Email List Growth: ___%

KEY LEARNINGS:
  What worked:
  What didn't:
  What to try next month:

NEXT MONTH TARGET: $___
```
