# AIKAGAN — AI Commander Agency (v2)

The collective intelligence powering the **Chimera Genesis** launch on
[aikagan.com](https://aikagan.com). Every agent below shares one
`conversion_router.py` so attribution, deep links, and offer tiers stay in
lockstep across every channel.

> **Profit OS modules invoked across the agency:**
> Profit Radar · Offer That Prints Money · Instant Brand-in-a-Box ·
> Website That Sells While You Sleep · 7-Day Hype Machine · Zero-Ad Sales Plan ·
> Objection Killer · Partnership Power Plays · 60-Day Scale Sprint ·
> Automation Money Machine.

---

## The Commanders

### 1. Marketing Commander — `scripts/agent/omnichannel_publisher_agent.py`
- **Role:** Autonomous Launch Director + social-media publisher.
- **Directive:** Scrape live buyer pain across 10 subreddits, generate
  platform-native copy for the day's wave, and push UTM-tagged, tier-matched
  CTAs to Make.com for distribution to 14+ channels.
- **Output:** `scripts/agent/content_backlog/wave<n>_<utc-ts>.json` and the
  legacy `latest_launch_director_payload.json`.
- **Schedule:** Daily at **14:00 UTC** via GitHub Actions
  (`.github/workflows/marketing-commander.yml`, job
  `marketing-commander-grand-launch`). Manual `workflow_dispatch` accepts a
  `wave` input (1–3).
- **Distribution:** Single Make.com Custom Webhook → Router → native modules
  (X, LinkedIn, Facebook, Instagram, Substack, Medium, Reddit DMs, Discord,
  Pinterest, YouTube descriptions, Quora, Tumblr, Nextdoor, Digg).

### 2. Customer Success Commander — `scripts/agent/customer_success_commander.py`
- **Role:** Autonomous Pre-sales + Post-purchase Support Agent.
- **Directive:** Reduce friction, classify objections, reply with operator
  tone, and direct the buyer to the right next CTA without sounding salesy.
- **Two run modes:**
  - `--playbook` — refresh FAQ + reply macros + escalation rules daily.
  - `--inbox-dir / --poll / --stdin` — handle individual inbound buyer messages.
- **Schedule:**
  - Hourly via GitHub Actions (`customer-service-commander`).
  - Daily playbook refresh at **15:00 UTC**.
- **Distribution:** Make.com Custom Webhook → Gmail "Send an Email" module.

### 3. Conversion Router — `scripts/agent/conversion_router.py`
- **Role:** Single source of truth for offer URLs, UTM strings, and the
  platform → tier matrix. Imported by every commander.
- **Why it exists:** Stops every commander from inventing its own LemonSqueezy
  link and losing attribution. Centralized = clean reporting in GA4 + Pixel.
- **Verified live IDs** baked in: Starter, Pro, Commander LemonSqueezy checkouts
  matching the buttons on aikagan.com today.

### 4. Audience Signal Agent (legacy / optional)
- **Location:** `autonomax_revenue_ops/agents/audience_signal_agent.py`
- **Directive:** Build a long-running friction map from support objections to
  prioritize FAQ writes and landing-page proof blocks.

---

## Wave Schedule (7-Day Hype Machine)

| Wave | Days | Platforms | Goal |
| --- | --- | --- | --- |
| 1 | Day 1–2 | X, LinkedIn, Substack, Medium, IndieHackers | Long-form, indexable, SEO + backlinks |
| 2 | Day 3–4 | Reddit, Hacker News, Discord, Quora, Facebook | Community-led, conversation-shaped |
| 3 | Day 5–7 | Instagram, TikTok, Pinterest, YouTube, Tumblr, Nextdoor, Digg | Visual + niche, bottom-funnel email captures |

`LAUNCH_DAY_OVERRIDE` in `.env.fulfillment` controls the day counter; CI bumps
it or you can force a wave with `--wave 2`.

---

## Conversion-First Defaults

| Audience temperature | Default tier shown |
| --- | --- |
| Cold (Reddit, HN, Quora, Pinterest, Nextdoor, Tumblr, Digg) | Free gift → email capture |
| Mid (FB, IG, TikTok, Discord) | Starter $29 |
| Warm (X, LinkedIn, Substack, Medium, IH, YouTube) | Pro $79 (popular tier) |
| Buyer email list | Commander $149 (upgrade pitch) |

Override per-message with `build_cta(platform, override_tier="pro")` if the
context warrants it.

---

## Architecture Flow

```
              ┌─────────────────────────────────────┐
              │   GitHub Actions (cron + dispatch)  │
              └──────────────────┬──────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                ▼                                 ▼
   ┌──────────────────────┐         ┌────────────────────────────┐
   │ Marketing Commander  │         │ Customer Success Commander │
   │   - Reddit radar     │         │   - Inbox drain (Gmail)    │
   │   - Gemini gen       │         │   - Classify + reply       │
   │   - conversion_router│         │   - Playbook refresh       │
   └──────────┬───────────┘         └────────────┬───────────────┘
              │  POST JSON                       │  POST JSON
              ▼                                  ▼
        ┌──────────────────────────────────────────────┐
        │              Make.com Webhooks                │
        │  Router → X, LinkedIn, FB, IG, Substack…      │
        │  Gmail Send → buyer reply                     │
        └────────────────────────┬─────────────────────┘
                                 │
                                 ▼
                       Native platform APIs
                  (OAuth managed inside Make.com)
```

1. **Intelligence (GitHub Actions):** Cron triggers the Python commanders.
2. **AI Processing (Gemini):** `google-generativeai` SDK generates JSON
   conforming to pydantic schemas — no free-form text the router can't parse.
3. **Routing (Make.com):** Webhook routers translate one JSON payload into
   N native API calls without storing tokens on our side.
4. **Execution (APIs):** Make.com handles OAuth and pushes to each platform.
5. **Attribution (GA4 + Meta Pixel):** Every link is UTM-tagged by
   `conversion_router.py` so we can attribute every signup and sale.

---

## File Map

```
aikagan-web/
├── .env.fulfillment                     # one-stop fulfillment vars
├── AI_COMMANDER_AGENCY.md               # this file
├── AI_COMMANDER_MANUAL_EXECUTION.md     # 7-step activation script
├── .github/workflows/
│   └── marketing-commander.yml          # scheduled + manual launches
└── scripts/agent/
    ├── conversion_router.py             # ⭐ shared offer + UTM module
    ├── omnichannel_publisher_agent.py   # Marketing Commander
    ├── customer_success_commander.py    # CS Commander
    ├── requirements.txt                 # google-generativeai, httpx, tenacity…
    ├── inbox/                           # drop *.json messages for the CS agent
    ├── support_log/                     # every reply Gemini wrote
    └── content_backlog/                 # every wave's launch payload
```
