# PROCESS FLOW ARCHITECTURE
## AutonomaX Business Unit — Value Generation → Financial Conversion → Data Profiling → Monetization

> **Purpose:** Map every customer touchpoint from awareness through fulfillment and recycling. Identify all settlement/fulfillment flows, KPI measurement points, and automation triggers.

---

## OVERVIEW: THE FOUR-LAYER PROCESS

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                    VALUE GENERATION                         │
                    │  (Traffic, Content, Awareness, Education)                   │
                    └──────────────────────┬──────────────────────────────────────┘
                                           │
                                           ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                   FINANCIAL CONVERSION                      │
                    │  (Stripe Checkout, Shopier Cart, Shopify Buy)               │
                    └──────────────────────┬──────────────────────────────────────┘
                                           │
                                           ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                     DATA PROFILING                          │
                    │  (Email capture, Purchase history, Usage patterns)          │
                    └──────────────────────┬──────────────────────────────────────┘
                                           │
                                           ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                      MONETIZATION                           │
                    │  (Cross-sell, Upgrade, Refund, Re-activate)                 │
                    └─────────────────────────────────────────────────────────────┘
```

---

## LAYER 1: VALUE GENERATION

### Flow Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  Traffic Source  │───▶│  Landing Page    │───▶│  Lead Magnet (Free) │
│  (Organic/Paid)  │    │  (aikagan.com)   │    │  (Email Opt-in)     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                                            │
                                                            ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  Social Proof    │◀───│  Product Page    │◀───│  Email Sequence     │
│  (Testimonials)  │    │  ($29/$79/$149)  │    │  (Nurture → Sell)   │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                              │
                              ▼
                    ┌───────────────────────┐
                    │  Checkout Initiated   │────▶ Layer 2
                    │  (Stripe Checkout     │
                    │   Session Created)    │
                    └───────────────────────┘
```

### Traffic Channels
| Source | Mechanism | Volume (Daily) | Cost | KPI |
|--------|----------|---------------|------|-----|
| **Reddit** | Value posts in r/Entrepreneur, r/SideProject | 50-200 visits | $0 | CTR > 3% |
| **LinkedIn** | AI ops content, client results | 30-100 visits | $0 | Engagement rate > 5% |
| **IndieHackers** | Build-in-public posts | 20-80 visits | $0 | Upvotes > 10 |
| **Twitter/X** | Threads, AI tips, tool comparisons | 20-50 visits | $0 | Retweet rate > 2% |
| **Google Organic** | SEO (long-tail "business toolkit" kw) | 50-300 visits | $0 | Position < 10 |
| **Google Ads** | "buy business tools" intent kw | 50-200 visits | $10-50/day | CPC < $1.50 |
| **Shopier TR** | Turkish social media | 10-50 visits | $0 | Conversion > 2% |

### Content Assets
| Asset | Type | Used On | Created |
|-------|------|---------|---------|
| Golden Delivery Starter Kit | Free PDF | Lead magnet, Reddit posts | ✅ In public/downloads/ |
| 7-Day First Sale Blueprint | Digital toolkit | $29 Masterclass Starter | ✅ In product ZIP |
| Funnel Master Guide | Digital toolkit | $79 Masterclass Pro | ✅ In product ZIP |
| Master System Map | Full bundle | $149 Commander | ✅ In product ZIP |

---

## LAYER 2: FINANCIAL CONVERSION

### Stripe Checkout Flow (aikagan.com)

```
┌─────────────────────┐
│  User Clicks "Buy"  │
│  (CheckoutLink.tsx) │
└─────────┬───────────┘
          │ POST /api/stripe-checkout
          ▼
┌─────────────────────┐
│  Create Stripe       │
│  Checkout Session   │  ← Uses price_data (no Price ID needed)
│  mode: payment      │
└─────────┬───────────┘
          │ Returns { url }
          ▼
┌─────────────────────┐
│  Redirect to         │
│  Stripe Checkout     │  ← Stripe-hosted checkout page
│  (checkout.stripe.   │
│   com/c/pay_...)     │
└─────────┬───────────┘
          │
          ▼
     ┌────────┐
     │ PAYMENT │  ← Card, Link, Apple Pay, Google Pay
     └────────┘
     │       │
     │       │
     ▼       ▼
SUCCESS   FAILURE
(payment_  (payment_
 intent.   intent.
 succeeded)payment_failed)
```

### Settlement Flow (Successful Payment)

```
Stripe Success
      │
      ├──────────────────────────────────────────────────────┐
      │                                                      │
      ▼                                                      ▼
Webhook Processing                                Client-side Fallback
(Stripe sends event)                             (Success page polls)
      │                                                      │
      │ POST /api/webhooks/stripe                            │ GET /api/session-token
      │ (verify signature)                                   │ (verify session_id)
      ▼                                                      ▼
┌─────────────────────┐                           ┌─────────────────────┐
│  Store download      │                           │  Verify session     │
│  token in memory     │                           │  via Stripe API     │
│  (token-store.ts)    │                           │  (fallback)         │
└─────────┬───────────┘                           └─────────┬───────────┘
          │                                                    │
          └────────────────────┬──────────────────────────────┘
                               │
                               ▼
               ┌──────────────────────────┐
               │  HMAC-SHA256 token        │
               │  with {slug, orderId,     │
               │   email, exp}             │
               └─────────────┬────────────┘
                             │
                             ▼
               ┌──────────────────────────┐
               │  User redirected to       │
               │  /checkout-success?       │
               │  session_id=cs_test_...   │
               └─────────────┬────────────┘
                             │
                             ▼
               ┌──────────────────────────┐
               │  Poll /api/session-token  │
               │  → returns token          │
               └─────────────┬────────────┘
                             │
                             ▼
               ┌──────────────────────────┐
               │  Redirect to              │
               │  /api/download/{token}    │
               │  → ZIP streams to user    │
               └──────────────────────────┘
```

### Shopier Cart Flow (Turkey Market)

```
User on autonomax.shopier.com
      │
      ▼
Select Product (199-29,899 TL)
      │
      ▼
Shopier Checkout (hosted)
      │
      ▼
Payment (Credit Card, EFT, Kapıda Ödeme)
      │
      ▼
Shopier sends confirmation (no webhook API documented)
      │
      ▼
Manual fulfillment flow:
  1. Check Shopier dashboard for new orders daily
  2. Manually email download link from template
  3. Log order in spreadsheet (until automation)

AUTOMATION PLAN: Build Shopier API scraper → cron job → auto-email
```

### Settlement Timing

| Channel | Settlement | Hold Period | Withdrawal | Notes |
|---------|-----------|-------------|-----------|-------|
| **Stripe** | T+2 business days | 0 days (low-risk digital goods) | Instant to debit card | 1.9% + $0.30 (US cards), 2.9% + $0.30 (intl) |
| **Shopier** | T+7 business days | Varies by order | Bank transfer weekly | 2.9% fee, Turkish lira |
| **Shopify** | T+2 (Payments) | 3-day rolling reserve | Daily auto-transfer | 2.9% + $0.30 + $30/mo |

### Payment Reconciliation
```
Each transaction recorded:
├── stripe_charge_id (ch_...)
├── amount (cents)
├── currency (usd/try)
├── product_slug
├── customer_email
├── timestamp
├── channel (stripe/shopier/shopify)
└── fulfillment_status (pending/complete/refunded)

→ Viewable in /api/transactions (once built)
→ Pushed to Make.com revenue dashboard webhook
→ Logged for tax reporting
```

---

## LAYER 3: DATA PROFILING

### Customer Data Pipeline

```
Purchase Event
      │
      ├──▶ Stripe Webhook: checkout.session.completed
      │     ├── email
      │     ├── name (if collected)
      │     ├── product_slug
      │     ├── amount_total
      │     └── payment_intent_id
      │
      ├──▶ token-store.ts (in-memory Map)
      │     ├── session_id → {slug, email, token}
      │     └── TTL: expires after token is consumed (or 48h)
      │
      ├──▶ Make.com webhook (revenue dashboard)
      │     ├── POST to configured Make webhook URL
      │     └── Triggers: WhatsApp alert, email receipt, CRM update
      │
      └──▶ Email List (future: Mailchimp/SendGrid/Resend)
            ├── Tag: product_slug
            ├── Tag: price_tier
            └── Sequence: onboarding + upsell
```

### Data Points Collected
| Data Point | Source | Use | Retention |
|-----------|--------|-----|-----------|
| Email | Stripe Checkout | Fulfillment, marketing | Indefinite (opt-out) |
| Purchase amount | Stripe webhook | Revenue tracking | 7 years (tax) |
| Product purchased | Stripe session | Fulfillment, recommendations | Indefinite |
| Date/time | Stripe event | Analytics | 7 years |
| Country/IP | Stripe metadata | Market analysis | 90 days |
| Order ID | Stripe generated | Support, refunds | 7 years |
| Lead magnet downloads | Formspree | Email list building | Indefinite |

### Privacy & Compliance
- **GDPR:** EU customers have right to deletion. Include email footer link.
- **Turkey KVKK:** Shopier customers must be offered data deletion.
- **CCPA:** California residents can opt out of data sale. (We don't sell data.)
- **PCI DSS:** Handled by Stripe (Stripe Checkout is PCI Level 1).
- **No customer data stored on our servers** — only tokens (transient) + email in token-store (in-memory).
- **Future:** Add data deletion endpoint: `POST /api/delete-my-data`

---

## LAYER 4: MONETIZATION (Post-Purchase)

### Revenue Expansion Flows

```
New Customer ($29 Starter)
      │
      ├──▶ Onboarding Email Sequence (Day 1-7)
      │     ├── Day 1: Welcome + download link reminder
      │     ├── Day 3: "See what Pro customers get" (upsell to $79)
      │     ├── Day 5: Case study using Pro tools
      │     └── Day 7: "Upgrade to Pro — here's $10 off"
      │
      ├──▶ Cross-sell Paths
      │     ├── Starter → Pro ($29 → $79 = $50 upgrade)
      │     ├── Pro → Commander ($79 → $149 = $70 upgrade)
      │     └── Commander → Premium ($149 → $497/mo)
      │
      ├──▶ Referral Loop
      │     ├── "Share with a friend — both get 20% off"
      │     ├── Commission-based: 20% recurring for affiliates
      │     └── White-label resell: Buy Commander → rebrand → resell
      │
      └──▶ Re-engagement Flow (Dormant > 90 days)
            ├── "New Masterclass content available"
            ├── "Your 24-hour reactivation discount"
            └── Feature upgrade notification
```

### Funnel Metrics (Monthly Scorecard)

```
Source → Traffic → CVR → Conversion → AOV → Revenue → COGS → Gross Profit
  │         │         │       │         │       │        │        │
  ▼         ▼         ▼       ▼         ▼       ▼        ▼        ▼
Organic   5,000     2.0%    100 sales   $58    $5,800   $150    $5,650
Paid      2,000     1.5%     30 sales   $79    $2,370    $60    $2,310
Shopier   500       3.0%     15 sales  ₺300    ₺4,500    ₺15    ₺4,485
Referral  300       5.0%     15 sales   $58      $870    $22      $848
Partner   200       4.0%      8 sales   $79      $632    $16      $616
──────    ─────     ────     ───────   ────   ───────   ────    ───────
Total    8,000     2.1%    168 sales   $63   $10,568   $260   $10,308
```

---

## END-TO-END FLOW (Complete Customer Journey)

```
AWARENESS                    CONSIDERATION              PURCHASE
─────────                    ─────────────              ────────
Sees Reddit post  ─────▶    Visits aikagan.com  ──▶  Views product page
                                                          │
Sees Google Ad  ──┐                                        │
                  ├────▶  Downloads free lead magnet  ─────┘
Sees Twitter      ┘                │
                                 Email nurture sequence
                                 (1-7 days)
                                      │
                                      ▼
                               Clicks "Buy Now"
                                      │
                                      ▼
                              Stripe Checkout Session
                                      │
                                  ───┴───
                                 │       │
                               Success  Failure
                                  │       │
                                  ▼       ▼
                          Download Token  Retry Prompt
                          (Page polls)   (Different card)
                                  │
                                  ▼
                          ZIP Delivered
                                  │
                              ────┴────
                             │         │
                             ▼         ▼
                      Onboarding   Upsell to Pro/
                      Emails       Commander
```

---

## SYSTEM HEALTH CHECKPOINTS

Every flow has monitoring points:

| Checkpoint | Monitor | Alert If | Recovery |
|-----------|---------|----------|----------|
| Stripe Checkout creation | API error count | > 1% error rate | Check Stripe API status |
| Webhook processing | Failed events | > 2 failed in 24h | Replay from Stripe Dashboard |
| Token delivery | Session poll timeout | > 30s without token | Direct Stripe API fallback |
| ZIP download | File not found | Any 404 | Verify private/downloads/ |
| Make.com webhook | HTTP 500 responses | Any failure | Check Make.com dashboard |
| AI provider chain | All providers fail | Total AI outage | Fallback to static content |
| Shopier | New orders | No orders in 7 days | Verify store active |
| Fly.io (app) | Health check | 503 for > 5min | Restart with `fly deploy` |
| Vercel | Build failures | Build fails | Check deployment logs |

---

## AUTOMATION TRIGGER MATRIX

| Trigger | Action | Tool | Priority |
|---------|--------|------|----------|
| `checkout.session.completed` | Generate download token | Stripe webhook → token-store | P0 |
| `checkout.session.completed` | Send WhatsApp alert | Stripe webhook → Make.com | P1 |
| `checkout.session.completed` | Send thank-you email | Stripe webhook → Resend/SendGrid | P1 |
| `payment_intent.failed` | Alert for retry | Stripe webhook → Make.com | P1 |
| New email on lead form | Add to nurture sequence | Formspree → Mailchimp/Resend | P2 |
| AI agent completes task | Log to analytics | AI agent → console/file | P2 |
| New Shopier order | Send manual download link | Human (until scripted) | P2 |
| Customer dormant > 90d | Re-engagement email | Cron → email API | P3 |
| All providers fail AI | Static response mode | AI resolution chain | P2 |
