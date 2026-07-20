# AutonomaX Team Operations

## Command Structure

```
                      ┌──────────────────────┐
                      │     COMMANDER         │
                      │  Strategic Direction  │
                      │  Gate Approvals       │
                      │  Priority Decisions   │
                      └──────┬───────────────┘
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
   ┌─────────────────┐ ┌──────────┐ ┌──────────────────┐
   │ Marketing Ops   │ │ Revenue  │ │ Customer Success │
   │ Content Gen     │ │ Ops      │ │ Support          │
   │ Social Posting  │ │ Ledger   │ │ Playbooks        │
   │ Channel Mgmt    │ │ Checkout │ │ Escalation       │
   └─────────────────┘ └──────────┘ └──────────────────┘
             │                │                │
             ▼                ▼                ▼
   ┌─────────────────┐ ┌──────────┐ ┌──────────────────┐
   │ Micro-Bots      │ │ Agents   │ │ Automation       │
   │ Scraper Bot     │ │ CAPI     │ │ Make.com         │
   │ Generator Bot   │ │ Webhooks │ │ Vercel Cron      │
   │ Formatter Bot   │ │ Tracking │ │ GitHub Actions   │
   └─────────────────┘ └──────────┘ └──────────────────┘
```

## Roles

### Commander Layer (Strategic)
- **Orchestrator** — Sets priorities, gates risky moves, approves consent checkpoints
- **Revenue Ops** — Monitors income streams, provider health, dashboards, ledger
- **Growth Operator** — Packages social posts, affiliate prompts, channel experiments

### Operations Layer (Tactical)
- **Funnel Operator** — Maintains landing pages, product pages, CTAs, trust proof, analytics
- **Fulfillment Operator** — Processes Blueprint intake, prepares deliverables, sends delivery updates
- **Customer Success** — Routes support, refunds, buyer questions, delivery issues

### Agent Layer (Automated)
- **Marketing Commander** — Daily content generation + social posting (14:00 UTC)
- **Customer Success Commander** — Hourly inbox drain + auto-reply (:15 past hour)
- **Playbook Refresher** — Daily FAQ + reply macro refresh (15:00 UTC)

### Micro-Bot Layer (Intelligence)
- **ContentScraperBot** — Reddit + HN signal harvesting
- **ContentGeneratorBot** — Multi-LLM content generation (Gemini → OpenAI → Claude)
- **PlatformFormatterBot** — Per-platform content formatting
- **AnalyticsBot** — Opportunity scoring and ranking
- **MemoryBot** — KV-backed cross-run state persistence

## Schedules

| Time (UTC) | Action | Agent |
|------------|--------|-------|
| 06:00 | Fulfillment queue drain | Vercel Cron |
| 14:00 | Marketing wave content + social push | Marketing Commander |
| 15:00 | Customer success playbook refresh | CS Commander |
| :15 hourly | Inbox drain + auto-reply | CS Commander |
| 08:00 Mon | Weekly intelligence roll-up | Vercel Cron |
| 09:00 Mon | Affiliate payout processing | Vercel Cron |

## Daily Ops Routine

1. **Morning check** — Review success dashboard (/dashboard/success)
2. **Health check** — Verify 11/11 gates passing
3. **Revenue check** — Check income reality for new purchases
4. **Content check** — Verify Marketing Commander ran (check CI logs)
5. **Support check** — Review any customer messages

## Key Metrics (Targets)

| Metric | Current | Target |
|--------|---------|--------|
| Daily pageviews | ~400 | 1,000+ |
| Daily purchases | 0 (seeded) | 3+ |
| Monthly revenue | $2,661 (seeded) | $10,000+ |
| Sustainability | 95/100 | 95/100 |
| Health gates | 11/11 | 11/11 |
| Content posts/day | 0 (active) | 3-5 |
| Email leads/day | ~18 | 50+ |
