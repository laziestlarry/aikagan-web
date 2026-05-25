# AIKAGAN — Cold-Traffic CAC Playbook

**Goal:** start converting cold traffic into Masterclass buyers ($29 / $79 / $149) at <$8 CAC, using a free-gift → Masterclass funnel that the site already supports natively.

**Status of the funnel** (already wired in code):
- 3 free email-gated downloads at `/free/[slug]` → instant PDF + Meta Pixel `Lead` event + `/api/lead` POST → autonomax revenue-ops backend
- 3 paid Masterclass tiers at `/products/masterclass-{starter,pro,commander}` → in-domain LemonSqueezy overlay → `/api/webhooks/lemonsqueezy` (HMAC verified) → signed 48-h download token → `/checkout-success` → `/api/download/[token]` serves ZIP
- UTM attribution captured at every page load (`AttributionInit`), persisted in localStorage, replayed on opt-in and at checkout
- Pixel events firing: `ViewContent` (lead-magnet pages), `Lead` (opt-in success), `InitiateCheckout` (paid CTA click), `Purchase` (success page)
- GTM container `GTM-NZW2CP6H` active; GA4 + Pixel managed via GTM

This playbook is **strategy, not implementation** — execute the parts that fit the bandwidth.

---

## 1. The funnel math (this dictates everything below)

| Step | Promise | Target rate | Cost per step |
|---|---|---|---|
| Cold view → click | Land on free gift | 1.5% – 4% CTR | ≤ $0.30 CPC organic-leaning, ≤ $0.80 paid |
| Click → email opt-in | One field, instant download | 35% – 55% | ≤ $1.50 per lead |
| Lead → Masterclass Starter buy | Email follow-up + retargeting | 5% – 12% | ≤ $4 CAC if lead was $1.50 |
| Starter buyer → Pro/Commander upsell | Order-bump on success page + 14-day email | 25% – 40% (of starters) | AOV bumps $29 → ~$45 blended |

Translation: at **lead $1.50** and **buy conversion 8%**, blended CAC sits around **$8 paying customer** before upsell. The upsell to Pro/Commander does the margin work.

---

## 2. Where the cold clicks come from (ranked by cost-efficiency, no big-spend assumed)

### Tier 0 — Free, compounding (start here, every week)

1. **Reddit organic** — r/Entrepreneur, r/SideProject, r/SaaSMarketing, r/digital_marketing, r/StartUpIdeas, r/InternetIsBeautiful (free gift kit demos), r/ChatGPTPromptGenius. **Rule:** zero links in the post; "DM if you want it" → manual share with UTM. This bypasses Reddit's link suppression and trains the algorithm that the account adds value.
2. **Twitter/X threads** — one thread per week, structured as "I built a 7-day first-sale system; here's the 1-page version free, [thread]". The thread is the lead magnet preview. Final tweet: link to `/free/golden-delivery-sample/?utm_source=x&utm_campaign=thread<n>`.
3. **LinkedIn carousels** — repurpose the 10-step Builder Checklist PDF into a 10-slide carousel. Native upload; CTA in last slide is the free gift.
4. **TikTok / IG Reels** — 30-second screen-recordings of "what's actually inside the pack." Caption: "Free if you want the PDF — link in bio." Repurpose 3× from the same recording.
5. **Quora/Indie Hackers/HN comments** — answer "how do I get my first sale" questions with the actual 7-day blueprint summary + a soft mention of the free gift only at the very end. Comments age well in Google for years.

### Tier 1 — Paid, retargeting-only first (defensive spend)

6. **Meta Pixel custom audiences from `Lead` events** → 1% lookalike. Run the **lookalike against the lead audience**, not against buyers; you need lead volume before lookalike-of-buyers works. Daily $5 cap × 4 audiences = $20/day for a week, then prune.
7. **Retargeting cart-abandoners** — fire `InitiateCheckout` Pixel event triggers a 24-hour retarget at $1 CPM. Creative is one image: the open ZIP with file names visible.
8. **Google Search exact-match on long-tail intent** — `"how to make first online sale in 7 days"`, `"AI revenue script template"`. Tiny budget ($5/day), bid only on terms with <$0.50 CPC.

### Tier 2 — Partnerships (highest leverage, slowest to ship)

9. **Newsletter swaps** with creator newsletters under 5K subs. Trade a free-gift dedicated send each way. Use a unique UTM per partner to measure.
10. **Affiliate program inside LemonSqueezy** — 30% lifetime commission. List in [LemonSqueezy Affiliate marketplace](https://www.lemonsqueezy.com/affiliates). Free; converts from existing buyers who become evangelists.

---

## 3. The AI-assisted weekly content engine (60 minutes total / week)

The point: produce ~15 organic posts per week without burning out.

| Day | Task (10 min each) | Tool stack |
|---|---|---|
| Mon | Pick the week's "pain hook" from a Reddit thread that's hot                | Reddit search + Claude/GPT |
| Mon | Rewrite hook as 4-tweet X thread + LinkedIn post + 30-sec Reel script      | Claude/GPT one-shot prompt |
| Tue | Record the Reel script in one take. Caption + trim in CapCut.              | Phone + CapCut |
| Wed | Drop the Reel + repost to TikTok, IG, YouTube Shorts                       | Native uploads |
| Thu | Publish the X thread + LinkedIn carousel; comment-bomb Reddit (1 thread)   | Native |
| Fri | Look at GA4 + Pixel → which UTM converted? Double down on Monday          | Mission Control + GA4 |
| Sun | Plan next week. 30 minutes.                                                | Notes app |

**Prompt template for the Monday rewrite** (paste into Claude/GPT):
```
You are a direct-response copywriter. I sell a $29 digital toolkit
that helps people get their first online sale in 7 days. Audience:
solopreneurs, side-hustlers, frustrated by "AI guru" course noise.

Take this Reddit thread / pain point: <paste here>

Output, in order:
1. A 4-tweet X thread (≤280 chars each) hooking on the pain,
   teaching ONE genuinely useful tip from the toolkit, ending with
   "Free 1-page version if anyone wants it — reply 'send'."
2. A LinkedIn post (≤1300 chars) with line breaks, no hashtags
   except 3 at the end. Tone: experienced operator, not guru.
3. A 30-second TikTok/Reel script (~75 words) optimised for a
   screen-recording of opening the PDF. First 3 words must hook.

Avoid words: unlock, secret, hack, masterclass-bro, "you NEED".
Use words: practical, today, real, ship, test.
```

---

## 4. Lead-gen quality safeguards (avoid junk leads inflating CAC)

- Require **valid email pattern** (already done in `/api/lead`).
- Add a **honeypot field** in `LeadMagnetForm` (5-min fix) — kills 80% of bot signups that pad the cost-per-lead.
- **Double opt-in** for paid-ad leads only — adds friction but cleans the list. Use a 6-hour delayed confirmation email; if not confirmed by hour 12, suppress from `Lead` lookalike audience.
- **Tag every lead source with UTM**; the `/api/lead` route already accepts `utm_source`, `utm_medium`, `utm_campaign`.

---

## 5. Conversion lifts to ship before scaling traffic (highest-ROI engineering)

These are cheaper than buying more clicks:

1. **Order bump on `/checkout-success`** — already wired (`OrderBump` component). Verify it shows for Starter buyers offering Pro at $50 delta. Expect +18–28% AOV.
2. **Exit-intent modal on `/products/masterclass-starter`** — JS popup offering a 24-hour 20% code (LS dynamic discount). Conservatively recovers 4–7% of would-be bouncers.
3. **48-hour countdown timer** — already in the hero; **make it real**, not visual. Currently the `CountdownTimer` is decorative. Wire it to a server-set expiration (Vercel KV) so the discount actually expires for each visitor's session. Authenticity matters: fake urgency is the #1 refund-driver.
4. **Visible refund policy + delivery format** — already added the "digital toolkit" disclaimer in commit. Keep it. Refund requests drop ~40% when expectations are explicit.
5. **`Lead → Buyer` 5-email sequence** — send via LemonSqueezy's built-in email + a dedicated ESP (ConvertKit free tier or Resend $0). Sequence: Day 0 deliver gift; Day 1 case study; Day 3 toolkit teardown video link; Day 5 limited-time $20-off Starter; Day 7 social-proof + final reminder.

---

## 6. Brutal first-week target

| Channel | Daily spend | Daily clicks | Daily leads | Daily buys | Daily revenue |
|---|---|---|---|---|---|
| Reddit organic + comments     | $0         | 80          | 25          | 1          | $29     |
| X threads + comment replies   | $0         | 60          | 15          | 0–1        | $0–$29  |
| LinkedIn carousel + posts     | $0         | 40          | 10          | 0          | $0      |
| Reels (3× post per day)       | $0         | 100         | 18          | 1          | $29     |
| Meta retargeting              | $5         | 30          | 6           | 1          | $29     |
| **Total**                     | **$5/day** | **310**     | **74**      | **3**      | **~$87/day** |

**Week-one expected revenue:** ~$600. **Week-one ad spend:** $35. **Net day-one ROAS:** 17×. **The math works only if Reddit/X/LinkedIn organic posts ship every day.**

---

## 7. Tracking — what to look at daily

Open these in this order each morning (5 min):

1. `aikagan.com/mission-control` — Live KPIs (when the autonomax backend reports real numbers)
2. **Meta Events Manager** — confirm `Lead` and `Purchase` events fired yesterday
3. **GA4 Realtime** — sources of yesterday's traffic
4. **LemonSqueezy dashboard** — refund requests, dispute rate, MRR
5. **Vercel Analytics** — page-level CTR, drop-offs

If `Lead → Purchase` conversion is below 4%, fix copy/offer **before** buying more traffic.

---

## 8. Profit OS modules invoked

- **Profit Radar** — Tier 0/1 ranking and the daily target table
- **7-Day Hype Machine** — the weekly content engine (Section 3)
- **Zero-Ad Sales Plan** — Tier 0 channels (Sections 2.1–2.5)
- **Objection Killer** — the disclaimer block we added on home + product pages
- **Automation Money Machine** — Section 5.5 email sequence
- **60-Day Scale Sprint** — Section 5 lifts shipped before scaling traffic
