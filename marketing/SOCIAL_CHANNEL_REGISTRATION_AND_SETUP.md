# SOCIAL CHANNEL REGISTRATION & SETUP SOP
## Account Creation, Profile Specs, UTM Registry & Publishing Cadence

---

## 1. HANDLE & IDENTITY REGISTRY
Register the identical handle everywhere to protect brand search and enable cross-platform attribution.

| Channel | Handle | Display Name | Primary Link |
|---------|--------|--------------|--------------|
| Facebook Page | `@aikagan` | AIKAGAN \| Outcome Operations | `https://aikagan.com/?utm_source=facebook&utm_medium=page` |
| Facebook Group | `AIKAGAN Builders Network` | Free diagnostics + verified outcomes | `https://aikagan.com/network` |
| Instagram | `@kagan.aikagan` | Kagan Dolek \| AI Business Ops | `https://aikagan.com/tools/revenue-leak-scan?utm_source=instagram&utm_medium=bio` |
| YouTube | `@aikagan` | AIKAGAN \| Outcome Operations | `https://aikagan.com/tools/revenue-leak-scan?utm_source=youtube&utm_medium=channel_link` |
| TikTok | `@aikagan` | AIKAGAN \| Own Your Ops | `https://aikagan.com/tools/revenue-leak-scan?utm_source=tiktok&utm_medium=bio` |
| Pinterest | `@aikagan` | AIKAGAN Business Systems | `https://aikagan.com/tools/revenue-leak-scan?utm_source=pinterest&utm_medium=profile` |
| X / Twitter | `@aikagan` | AIKAGAN \| Trust Layer for AI Ops | `https://aikagan.com/tools/revenue-leak-scan?utm_source=x&utm_medium=profile` |
| LinkedIn Page | `AIKAGAN` | Outcome-Ready AI Business Systems | `https://aikagan.com/?utm_source=linkedin&utm_medium=page` |
| LinkedIn Personal | Kagan Dolek | Founder, AIKAGAN & AutonomaX | `https://outcome.aikagan.com?utm_source=linkedin&utm_medium=profile` |

---

## 2. REGISTRATION SEQUENCE (Do in this order)

1. **Email + Recovery:** Use a dedicated brand inbox (`kagan@aikagan.com`). Enable 2FA with an authenticator app, not SMS. Store recovery codes in the password manager.
2. **Business Assets Ready Before Signup:** logo (SVG + 1024px PNG), 1200x630 OG image (`/og.png`), 1024px avatar, banner per channel.
3. **Create Facebook Page first** → then link Instagram (Meta Business Suite) so IG inherits business tools and ad-free cross-posting.
4. **YouTube:** create channel under the brand Google account, set custom handle `@aikagan`, upload banner 2560x1440 (safe area 1546x423).
5. **TikTok / Pinterest:** register, complete bio, verify email, add link.
6. **X / LinkedIn:** register page, pin the launch post.
7. **Verify ownership:** add each channel URL to `src/lib/constants.ts` SOCIAL and to the footer when live.

---

## 3. PROFILE BIO TEMPLATES

**Instagram / TikTok (150 char max):**
```
Outcome-ready AI business systems you OWN.
No monthly SaaS rent.
Free 2-min revenue leak scan 👇
```

**YouTube About:**
```
AIKAGAN builds the trust layer for AI-powered business operations.

We publish practical teardowns of revenue leaks, checkout friction, fulfillment failure, and the E0→E5 evidence ladder that separates a claim from an accepted outcome.

Start free: revenue leak scan (2 minutes, no signup).
Own your stack: one-time Golden Delivery packs ($29 / $79 / $149).

Try before you buy. Verify before you trust.
```

---

## 4. UTM REGISTRY (Single Source of Truth)
Never post an untagged link. Format: `?utm_source=<platform>&utm_medium=<format>&utm_campaign=<sprint>`

| Platform | Medium values | Campaign values |
|----------|---------------|-----------------|
| facebook | `page`, `group_post`, `dm`, `story` | `zero_to_hero_w1` … `w4` |
| instagram | `bio`, `reel`, `carousel`, `story`, `dm_conversation` | `zero_to_hero_w1` … `w4` |
| youtube | `channel_link`, `shorts`, `longform`, `pinned_comment` | `zero_to_hero_w1` … `w4` |
| tiktok | `bio`, `video`, `duet` | `zero_to_hero_w1` … `w4` |
| pinterest | `profile`, `pin`, `board` | `evergreen_pins` |
| x | `profile`, `thread`, `reply` | `zero_to_hero_w1` … `w4` |
| linkedin | `page`, `profile`, `dm_outreach` | `founding_20_partners` |

Attribution is only claimed when a **verified provider payment** is traced back. Clicks and intents are never reported as revenue.

---

## 5. PUBLISHING CADENCE (Weekly Minimum)

| Day | Facebook | Instagram | YouTube | TikTok | Pinterest |
|-----|----------|-----------|---------|--------|-----------|
| Mon | Group value post | Carousel | — | 1 short | 2 pins |
| Tue | — | Story poll | 1 Short | 1 short | — |
| Wed | Group teardown | Reel | — | 1 short | 2 pins |
| Thu | — | Carousel | — | 1 short | — |
| Fri | Group free gift | Reel + DM CTA | 1 Short | 1 short | 2 pins |
| Sat | — | Story recap | — | — | — |
| Sun | Weekly review | — | — | — | 1 pin |

Rule: 3 value posts for every 1 offer post. No naked affiliate links in post bodies.
