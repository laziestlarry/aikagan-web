# AutonomaX — Launch Strategy & Growth Roadmap

## Current System State (Live)

| Capability | Status | Detail |
|-----------|--------|--------|
| Payment Processing | 🟢 Paddle (primary) → LS → Gumroad | All 3 providers live |
| Product Delivery | 🟢 HMAC tokens → auto-download | 48h TTL, KV-backed |
| Income Ledger | 🟢 KV-backed, real-time | CAPI + GA4 tracking |
| Affiliate Program | 🟢 20-30% commission | Referral codes, dashboard, cron payouts |
| Legal | 🟢 Privacy, Terms, Refund, Contact | All pages live |
| Marketing | 🟢 Product pages, affiliate program | Mission control dashboard |

## Phase 1 — Launch (Week 1)

### Traffic Direction

| Channel | Action | Tool |
|---------|--------|------|
| **Facebook/Instagram** | Share product pages + affiliate link | aikagan.com/products + ref codes |
| **Existing Audience** | Email list outreach via Make.com | Automated via purchase webhook |
| **Organic Search** | sitemap.xml already indexed by Vercel | SEO baseline set |
| **Affiliate Network** | Activate affiliate program | /affiliates — 20-30% commission |

### Conversion Optimization

- **Landing pages**: /products shows all tiers with social proof ("128+ builders")
- **Checkout**: Paddle gold-branded overlay → minimal friction
- **Post-purchase**: Confetti success page → download → upsell (Pro/Commander upgrade)
- **Exit intent**: Modal offers free gift on exit (/products/[slug])

### Ad Creative Assets

| Asset | URL | Use |
|-------|-----|-----|
| Logo (PNG) | aikagan.com/brand/logo.png | Social media, ads |
| Logo (SVG) | aikagan.com/brand/logo.svg | Scalable for print |
| Product Covers | aikagan.com/gumroad-cover-{tier}.png | Ad creative |
| Product Thumbnails | aikagan.com/gumroad-thumb-{tier}.png | Social cards |

## Phase 2 — Growth (Week 2-4)

### Recurring Income Model

```
Current: One-time purchases ($29/$79/$149)
Target:  Add recurring options
  1. AutonomaX Pro Monthly — $29/mo (templates + updates)
  2. AutonomaX Commander Annual — $149/yr (white-label + support)
  3. Enterprise — Custom pricing (dedicated infra + SLA)
```

### Affiliate Scaling

- **Current**: 20-30% commission on one-time sales
- **Target**: Tiered commission (20% → 25% → 30% based on volume)
- **Cron**: Auto payouts every 30 days via /api/cron/affiliate-payouts
- **Tracking**: Full UTM attribution + ref_code across all providers

### Content Marketing

| Asset | Purpose |
|-------|---------|
| Free gifts (3 lead magnets) | Email capture → nurture → sale |
| Weekly intelligence | Value-add content, KPI benchmarks |
| Mission control dashboard | Public-facing trust signal |

## Phase 3 — Scale (Month 2-3)

### Platform Expansion

1. **Shopier** — Turkish market (already configured, env vars set)
2. **Recurring billing** — Paddle subscriptions for monthly/annual plans
3. **White-label licensing** — Commander tier enterprise sales

### Technical Growth

| Initiative | Impact |
|-----------|--------|
| Single-page checkout | Reduce bounce, increase conversion |
| Abandoned cart recovery | Email reminders via cron |
| Multi-currency pricing | Paddle localizes automatically |
| Affiliate leaderboard | Gamification for top referrers |

## Financial Model

### Current Unit Economics

| Tier | Price | Paddle Fee | Net | Affiliate (30%) | Net after Affiliate |
|------|-------|------------|-----|-----------------|---------------------|
| Starter | $29 | ~$2.90 | $26.10 | $8.70 | $17.40 |
| Pro | $79 | ~$5.90 | $73.10 | $23.70 | $49.40 |
| Commander | $149 | ~$10.90 | $138.10 | $44.70 | $93.40 |

### Breakeven Targets

- **Monthly overhead**: Vercel Hobby ($0) + KV ($0) + Domain ($1/mo) ≈ **$1/mo**
- **Breakeven**: 1 Starter sale per month
- **Profit at 10 sales/mo**: ~$174–$934 depending on tier mix

## Risk Management

| Risk | Mitigation |
|------|-----------|
| Paddle payment failure | Falls through to LS → Gumroad → Manual |
| Download token expiry | Email backup via Make.com webhook |
| Serverless cold start | KV persistence, in-memory fallback |
| Chargebacks | Paddle handles as Merchant of Record |

## Legal & Compliance Checklist

| Requirement | Status | Location |
|------------|--------|----------|
| Privacy Policy | ✅ Live | /legal/privacy |
| Terms of Service | ✅ Live | /legal/terms |
| Refund Policy | ✅ Live | /legal/refund |
| Contact Page | ✅ Live | /legal/contact |
| GDPR Compliance | ✅ Paddle handles (MoR) | Paddle terms |
| Cookie Consent | ✅ GTM consent mode | Google Tag Manager |
| Accessibility | ⚠️ Baseline | WCAG 2.1 AA pending |
