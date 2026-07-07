# AIKAGAN Upgrade Pack — Marketing + Provider Resilience

**Status:** Active build
**Generated:** 2026-07-06
**Scope:** Provider fallback, referral tracking, marketing/affiliate infrastructure, traffic generation assets

---

## 1. Executive Summary

This pack upgrades the aikagan-web codebase with four interlocking capabilities:

1. **Provider resilience** — Multi-provider checkout (Paddle → LemonSqueezy → Gumroad fallback) so a single provider failure can't block revenue
2. **Referral tracking** — End-to-end `?ref=` plumbing from URL → attribution → checkout custom data → webhook → commission
3. **Affiliate dashboard upgrade** — Real referral link generator with code, click tracking, and projected earnings
4. **Marketing/affiliate assets** — Library of pre-built social posts, email swipes, and traffic-generation landing pages

All changes deploy in **one Vercel push** and require **no third-party signups** beyond Paddle approval.

---

## 2. Paddle Alternatives Verification

| Provider | Status | Switch time | Verdict |
|---|---|---|---|
| **Paddle** (active) | Awaiting domain re-review (3 working days) | — | Primary |
| **LemonSqueezy** | Code paths exist, needs env vars + product IDs | 30 min | **Build as backup now** |
| **Gumroad** | Not configured, ~1 day to set up | 1 day | Optional third layer |
| **Stripe Cyprus** | `charges_enabled: false` | N/A (not from Turkey) | Skip until Phase 2 |
| **Payoneer** | USD/EUR/GBP accounts live | Already used for payouts | Not a checkout — receiving only |

**Decision:** Add LemonSqueezy as automatic fallback when Paddle checkout fails. The provider router checks Paddle first (better MoR, lower fees), falls back to LemonSqueezy automatically. Both pipe the same HMAC download token through the same success page.

---

## 3. New Code Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│  PUBLIC                                                          │
│  /affiliates  (referral code generator + dashboard)             │
│  /marketing   (social swipes, email templates, content kit)     │
│  /free/[slug] (lead magnet — already wired)                     │
└──────────┬─────────────────────────────────────────────────────┘
           │   ref=kagan-x, utm_*, fbclid
           ▼
┌────────────────────────────────────────────────────────────────────┐
│  ATTRIBUTION LAYER (src/lib/attribution.ts — already wired)     │
│  - sessionStorage persistence                                   │
│  - appendAttribution() on all checkout CTAs                    │
│  - trackCheckoutIntent() fires beacon to /api/revenue-ops     │
└──────────┬─────────────────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────────────────────────────┐
│  CHECKOUT ROUTER  /api/checkout                                  │
│  - slug, ref, country → provider selection                      │
│  - Paddle primary → LemonSqueezy fallback                       │
│  - Returns { provider, url, transactionId, ref }                │
└──────────┬─────────────────────────────────────────────────────┘
           │
      ┌────┴────┐
      ▼         ▼
   PADDLE    LEMONSQUEEZY
   /api/     /api/
   paddle-   lemonsqueezy-
   checkout  checkout
      │         │
      └────┬────┘
           ▼
   /api/webhooks/{paddle,lemonsqueezy}
   - issue HMAC download token
   - log to Vercel KV (48h TTL)
   - fire Meta CAPI Purchase
   - record commission for ?ref
           │
           ▼
   /checkout-success?token=...&transaction_id=...
   - polls /api/session-token
   - streams ZIP from /api/download/[token]
```

---

## 4. Files to Add / Modify

### New files
- `lib/provider-router.ts` — provider selection logic
- `app/api/checkout/route.ts` — public router endpoint (replaces paddle-checkout for new code)
- `app/api/lemonsqueezy-checkout/route.ts` — LemonSqueezy checkout
- `app/api/affiliate/signup/route.ts` — affiliate registration
- `app/api/affiliate/stats/[code]/route.ts` — referral stats
- `app/marketing/page.tsx` — marketing assets library
- `src/components/marketing/SocialSwipeCard.tsx` — copy-to-clipboard social templates
- `lib/referral.ts` — referral code generation + tracking

### Modified files
- `src/components/ui/CheckoutLink.tsx` — call `/api/checkout` instead of `/api/paddle-checkout`
- `src/components/shared/ProductCard.tsx` — same
- `app/affiliates/page.tsx` — better commission structure, real referral link
- `app/affiliates/AffiliateDashboard.tsx` — show clicks, conversions, projected earnings
- `app/page.tsx` — add marketing CTA pointing to /marketing
- `src/lib/constants.ts` — add marketing copy

---

## 5. Referral System Mechanics

### Code structure
- 8-char alphanumeric codes, e.g. `kagan-x7p` (lowercase + digit)
- Stored in Vercel KV under `affiliate:<code>` (60-day TTL, refreshed on activity)
- Each click on `?ref=CODE` logs to `ref:click:<code>:<date>` (date-bucketed for charts)
- Each conversion attributed via checkout custom data → webhook → KV counter

### Commission
- 30% Starter, 25% Pro, 25% Commander
- Stored in `commission:<code>:<orderId>` for ledger
- "Pending" until 30 days post-purchase (refund window)

### Tracking
- `?ref=CODE` on any page → appendAttribution stores to sessionStorage
- CheckoutLink appends `ref=CODE` to provider checkout URL
- Provider's custom_data / checkout_options carries `ref_code`
- Webhook reads `ref_code` and credits the affiliate

---

## 6. Marketing/Affiliate Assets

### `/marketing` page
- 10 ready-to-post Twitter/X swipes (different angles: pain, dream, social proof, urgency, curiosity)
- 5 LinkedIn posts (founder voice, case study, build-in-public)
- 3 Reddit-friendly posts (with subreddit suggestions)
- Email subject lines (3 sequences)
- Instagram caption templates
- Image prompts (Midjourney style)

### Affiliate dashboard upgrade
- Generated referral code (8-char)
- Real referral link with UTM auto-append
- Clicks today / 7d / 30d
- Conversions + revenue
- Pending vs. paid commission
- Projected 30-day earnings (based on conversion rate)
- Social post templates (copy-paste)

---

## 7. Traffic Generation Plan (Day 0 → 90)

### Day 0–7 (during Paddle re-review)
- Publish `/marketing` page with social swipes
- Pre-write 30 Twitter/X posts + 10 LinkedIn posts
- Add Affiliate dashboard to main nav
- Run 1 launch thread on IndieHackers + Reddit r/EntrepreneurRideAlong
- Email list: send to existing 0 (no list yet — start collecting)

### Day 8–30 (Paddle approval + first sales)
- First paid sale → use as case study
- Daily content (5 posts/week): Twitter, LinkedIn, IndieHackers
- DM outreach to 20 micro-influencers per week
- Launch 3 free products as lead magnets across Gumroad, Beehiiv, etc.

### Day 31–90 (scale)
- 5 affiliates onboarded (use the dashboard)
- Email automation via ConvertKit / Beehiiv
- Paid acquisition: $200 Meta ads test on top product
- Content SEO: 4 long-form blog posts/month
- Target: 30 sales/month, $1,500 MRR-equivalent

---

## 8. Implementation Phases

| Phase | Scope | Time | Status |
|---|---|---|---|
| **A** | Provider router + LemonSqueezy checkout | 1 hour | Building |
| **B** | Referral code plumbing through checkout | 1 hour | Building |
| **C** | Affiliate dashboard upgrade | 1 hour | Building |
| **D** | Marketing page + social swipes | 1 hour | Building |
| **E** | Deploy + verify end-to-end | 30 min | Pending |

Total: ~5 hours of build, deployable in 1 Vercel push.

---

## 9. Acceptance Criteria

- [ ] `/api/checkout?slug=masterclass-starter` returns Paddle URL with `custom_data.ref_code` populated if `?ref=CODE` present
- [ ] If Paddle returns error → falls back to LemonSqueezy URL automatically
- [ ] `/affiliates` page generates 8-char codes that work end-to-end
- [ ] Webhook reads `ref_code` from Paddle and LemonSqueezy, credits affiliate
- [ ] `/marketing` page renders with copy-to-clipboard social swipes
- [ ] GA4 + Meta CAPI events fire on Lead, InitiateCheckout, Purchase
- [ ] Site loads <2s on 4G (Lighthouse mobile >85)

---

## 10. Risk & Mitigations

| Risk | Mitigation |
|---|---|
| Paddle domain re-review fails again | LemonSqueezy fallback is built — switch primary with one env var flip |
| LemonSqueezy account not yet created | Code is env-driven; activate when ready (no code change) |
| KV quota exceeded | In-memory fallback already exists |
| Payouts to Payoneer from Paddle blocked | Payoneer test: payouts enabled in Turkey; if blocked → switch to Payoneer USD via Wise |
| Apple/Google tax category issues | Use `taxCategory: "digital-goods"` (already in Paddle code) |
| Customer in unsupported country | Paddle covers 200+ countries; LemonSqueezy covers similar |
| Refund abuse | 30-day refund window + commission 30-day hold + KYC |

---

## 11. Go / No-Go Decision Matrix

| Signal | Action |
|---|---|
| Paddle approves aikagan.com in 3 days | Primary = Paddle, fallback = LemonSqueezy |
| Paddle rejects again | Switch primary to LemonSqueezy, resubmit with Paddle later |
| LemonSqueezy rejects | Use Gumroad, then PayPal (Turkey allowed via Wise payout) |
| All 3 reject | Direct bank transfer (TR) for local, BTC/USDT for crypto-native |

**Decision deadline:** 3 working days (Paddle re-review result).

---

*End of upgrade pack — implementation starts below.*
