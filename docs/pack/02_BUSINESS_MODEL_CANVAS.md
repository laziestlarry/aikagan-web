# BUSINESS MODEL CANVAS
## AutonomaX — Multi-Channel AI Ops Empire (Updated for Paddle)

> **Paddle (Merchant of Record) primary.** Stripe deferred. Shopier active for Turkey. All unit economics, fees, and architecture updated to reflect reality.

---

## THE CANVAS

### 1. Value Proposition

| Segment | Core Promise | Price | Delivery |
|---------|-------------|-------|----------|
| **DIY Founders** | "Turn 'meh' products into must-buys in 7 days" | $29–$79 | Digital downloads + AI tools via Paddle |
| **Scaling Operators** | "Run your business with AI ops agents — no team needed" | $79–$149 | Full stack + white-label rights |
| **Agency/Resellers** | "License and resell the entire system as your own" | $149–$2,497 | Full ops engine + white-label |

### 2. Customer Segments
1. **Solopreneurs** (25-45, online business, $0-$5k/mo) → $29 Starter
2. **Digital Marketers** (28-50, 3-10 employees, $5k-$50k/mo) → $79 Pro or $149 Commander
3. **Small Agencies** (owner, 1-5 staff, white-label seekers) → $149 Commander → $497-$2,497 custom
4. **Turkey Market** (small business owners, budget-conscious) → Shopier 199–29,899 TL
5. **Enterprise/Mid-Market** (6+ staff, needs infrastructure) → Future premium ops engine

### 3. Channels

| Channel | Status | Reach | CAC | Revenue Share |
|---------|--------|-------|-----|--------------|
| aikagan.com | LIVE, Paddle checkout | Global | $0-5 (organic) | 100% − 5% Paddle fee |
| autonomax.shopier.com | LIVE, 19 products | Turkey | $0-3 | 100% − 2.9% Shopier fee |
| Organic Social | Not started (code ready) | Reddit, LI, Twitter | $0 | 100% |
| Google Ads | Not started | High-intent search | $10-50 | Before revenue |
| Affiliates/Partners | Not started | Niche audiences | 20% commission | 80% net |

### 3b. Payment Channel Comparison: Shopier vs Paddle

| Feature | 🦎 Shopier (Turkey) | 🚀 Paddle (Global) |
|---------|-------------------|-------------------|
| **Market** | Turkey only | Global (200+ countries) |
| **Fee** | 2.9% flat | 5% + $0.50 |
| **VAT/GST handling** | Turkish VAT only (included) | Full global tax compliance (MoR) |
| **Payout method** | Turkish bank account (TRY) | Payoneer, PayPal, bank (USD/EUR/GBP) |
| **Buyer experience** | TR-only checkout page | Multi-language, multi-currency, global |
| **Chargeback handling** | Manual, slow | Managed by Paddle (MoR) |
| **Subscription support** | Limited | Full (Paddle Billing) |
| **API/SDK** | No public API | REST API + Node SDK |
| **Webhooks** | None | ✅ p-pl signature verified |
| **Product count** | 19 LIVE | 0 (awating credentials) |
| **Status** | 🟢 LIVE — generating sales | 🟡 Code ready — blocked by credentials |

**Strategy:** Shopier handles Turkey (free channel, already live). Paddle goes global. No conflict — they serve different geos.

### 4. Revenue Streams

| Stream | Product | Price | Frequency | Gross Margin |
|--------|---------|-------|-----------|-------------|
| Digital toolkits | Masterclass packs | $29/$79/$149 | One-time | ~93% (Paddle 5%+$0.50) |
| Turkey store | Shopier digital | 199-29,899 TL | One-time | ~95% |
| White-label | Licensed resell | $149 + % of reseller | Ongoing | ~90% |
| Future: AI Ops | Subscription | $47-$497/mo | Monthly | ~80% |

### 5. Key Resources
- **Paddle account** — MoR onboarding not yet complete
- **Shopier store** — 19 products, LIVE Turkish market
- **aikagan-web codebase** — Full Next.js application, Paddle-integrated, deployed
- **6 Product ZIPs** — Ready in `private/downloads/`
- **AI provider chain** — Groq (free) → DeepSeek ($0.14/M) → Gemini (free) → OpenAI
- **HMAC download token system** — No database, no ongoing cost

### 6. Key Activities
1. Launch Paddle checkout (blocked: need credentials)
2. Generate organic traffic (Reddit, LinkedIn, IndieHackers, Twitter)
3. Fulfill digital delivery (instant download via secure tokens)
4. Promote Shopier Turkey store (19 products live)
5. Operate AI agent pipeline (content, outreach, optimization)

### 7. Key Partnerships

| Partner | Type | Status | Value |
|---------|------|--------|-------|
| Paddle | MoR payment processor | Awaiting credentials | 5% fee for global reach + tax compliance |
| Make.com | Automation | Not yet wired | 4 webhooks waiting to be configured |
| Groq | AI inference (free) | Available | 30 req/s, 6k rpm |
| DeepSeek | AI inference (cheap) | Available | $0.14/M input tokens |
| Shopier | Turkey payment | LIVE | 19 products, 2.9% fee |
| Vercel | Hosting | Deployed | aikagan.com, Blob storage |

### 8. Cost Structure (Monthly)

| Cost Item | Amount | Type | Notes |
|-----------|--------|------|-------|
| Vercel Pro | $20 | Fixed | Hosting |
| Paddle fees | 5% + $0.50/sale | Variable | Per transaction |
| Shopier fees | 2.9% | Variable | Per transaction |
| Domain renewal | ~$1 | Fixed | aikagan.com |
| **Total Base** | **~$21/mo** | | **Before AI API usage** |

### 9. Unit Economics (Paddle)

| Product | Price | Paddle Fee | Net | Hosting | Gross Profit | Margin |
|---------|-------|-----------|-----|---------|-------------|-------|
| Starter | $29.00 | $1.95 | $27.05 | $0.25 | $26.80 | 92.4% |
| Pro | $79.00 | $4.45 | $74.55 | $0.50 | $74.05 | 93.7% |
| Commander | $149.00 | $7.95 | $141.05 | $1.00 | $140.05 | 94.0% |

**Breakeven:** 1 Paddle sale/month covers all fixed costs.

---

## KEY INSIGHTS

1. **Paddle's higher fee (5% vs Stripe's 2.9%)** is offset by zero compliance burden — Paddle handles global VAT/GST/sales tax, chargebacks, and payout reconciliation
2. **Turkey is a free channel** — Shopier is already live with 19 products, zero setup cost
3. **Margins remain excellent** (>92%) even with the Paddle fee increase
4. **The ONLY blocker is Paddle credentials** — once those are set, the entire revenue engine is live
5. **Phase 2 (Stripe, post-entity)** will improve margins from 93% back to 96%
