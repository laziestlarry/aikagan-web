# AI COMMANDER — Manual Execution Script (v3)

> **OBJECTIVE:** Launch the Chimera Genesis campaign — qualified buyer traffic →
> free-gift email capture → $29/$79/$149 conversion, on autopilot.
>
> Manual surface has been collapsed to **3 steps** + 1 OAuth pass.
> Everything else (Make.com scenarios, GitHub secrets, workflow scheduling,
> end-to-end verification, Pixel CAPI) is generated and verified by code.

---

## STEP 1 — Credentials (one file, one time)

Open `/Users/pq/aikagan-web/.env.fulfillment` and fill in **only these
required values**:

| Variable | Where to get it |
| --- | --- |
| `GEMINI_API_KEY` | [Google AI Studio → API Key](https://aistudio.google.com/app/apikey) |
| `MAKE_API_KEY` | Make.com → Profile → API → "Add token" with scopes `scenarios:write`, `connections:read`, `hooks:read`. |
| `MAKE_TEAM_ID` | Run `python scripts/agent/provision_make.py --list-teams` (after MAKE_API_KEY is set) — copy the numeric ID. |
| `META_PIXEL_ID` | Meta Events Manager → Data sources → your pixel. *(Only required if you want CAPI server-side attribution — recommended.)* |
| `META_CAPI_ACCESS_TOKEN` | Meta Events Manager → Settings → Generate Access Token. |

Everything else in `.env.fulfillment` already has working defaults that match
the live aikagan.com configuration.

---

## STEP 2 — Run the bootstrap (one command)

```bash
cd /Users/pq/aikagan-web
bash scripts/agent/bootstrap.sh
```

What it does, in order:
1. Creates `.venv`, installs `scripts/agent/requirements.txt` + `pyyaml`.
2. Runs `verify_handoff.py --quick` — fails fast on missing env vars / imports.
3. If `MAKE_API_KEY` + `MAKE_TEAM_ID` are present → `provision_make.py --activate`
   uploads both Make.com blueprints, retrieves the resulting Custom Webhook
   URLs, and **writes them back into `.env.fulfillment`**.
4. Runs the Marketing Commander in `--dry-run` (proves Gemini + schema work).
5. Runs the full `verify_handoff.py` (pings Gemini, Reddit, Make.com webhooks,
   live aikagan.com CTAs, all 3 LemonSqueezy product pages, the workflow YAML,
   and both blueprint files).

If anything FAILs, the script tells you exactly which hop and exits non-zero.

---

## STEP 3 — Push secrets to GitHub Actions (one command)

```bash
cd /Users/pq/aikagan-web
bash scripts/agent/push_secrets_to_github.sh
```

Requires `gh` CLI (`brew install gh && gh auth login`). The script reads
`.env.fulfillment` and:
- Sends every key/token/webhook URL to **GitHub Secrets**.
- Sends every non-sensitive default to **GitHub Variables**.
- Skips any placeholder still containing `YOUR_..._HERE`.

Now the cron has everything it needs. Trigger a smoke run:

```bash
gh workflow run "AIKAGAN Commanders" -f target=marketing -f wave=1
```

---

## ONE-TIME OAUTH PASS (Make.com side — 5 minutes, no code can do this for you)

`provision_make.py` uploaded both scenarios, but Make.com requires you to sign
into each platform once. Open Make.com → your team → **Scenarios**:

1. **AIKAGAN — Omnichannel Router** — click each module that shows a yellow
   warning chip and pick (or create) the connection:
   - X / Twitter
   - LinkedIn
   - Facebook Page
   - Instagram Business
   - Gmail (for Substack drafts + manual-post queue)
   - Discord (uses an incoming-webhook URL — paste it into the team
     **Custom Variable** `DISCORD_WEBHOOK_URL`)
2. **AIKAGAN — Customer Success Router**:
   - Gmail (for sending replies)
   - Google Docs (for the FAQ doc — set the doc ID in
     `AIKAGAN_FAQ_DOC_ID` Custom Variable)
   - Slack (optional, for escalations — set `AIKAGAN_SUPPORT_SLACK_CHANNEL`)
3. Click **Run once** on each scenario. Confirm the test row reaches its
   destination. Flip both scenarios to **ON**.

---

## ZERO-MAINTENANCE RUNTIME (what happens after Step 3)

| When | What runs | Where |
| --- | --- | --- |
| Daily 14:00 UTC | Marketing Commander → wave of the day → 14 channels | GitHub Actions `marketing-commander-grand-launch` |
| Hourly :15 | Customer Success → drain inbox → auto-reply | GitHub Actions `customer-service-commander` |
| Daily 15:00 UTC | Customer Success playbook refresh (FAQ + macros) | GitHub Actions `customer-service-playbook-refresh` |
| Daily 09:00 local | Cowork morning brief — wave status + KPI + recommended action | Cowork Scheduled Task |
| On every `/api/lead` POST | Mirror Pixel **Lead** event server-side via `/api/capi` | Vercel runtime |
| On every LemonSqueezy webhook | Mirror Pixel **Purchase** event server-side via `/api/capi` | Vercel runtime |

You only touch the system when the morning Cowork brief asks you to.

---

## CHEAT SHEET — useful one-liners

```bash
# Find your Make.com team
python scripts/agent/provision_make.py --list-teams

# Re-provision a single Make.com scenario after editing its blueprint
python scripts/agent/provision_make.py --only omnichannel --activate

# Force a specific launch wave today
python scripts/agent/omnichannel_publisher_agent.py --wave 3

# Refresh the customer-success playbook on demand
python scripts/agent/customer_success_commander.py --playbook

# End-to-end health check (full network)
python scripts/agent/verify_handoff.py

# End-to-end health check, no network (CI-safe)
python scripts/agent/verify_handoff.py --quick
```

---

## WHAT TO DO IF…

| Symptom | Fix |
| --- | --- |
| Workflow runs but no posts appear | Open Make.com → the relevant scenario → check the History tab; usually an OAuth connection expired. |
| Pixel Lead events show in browser but not Meta Events Manager | Hit `GET /api/capi` — confirms CAPI is configured; check `META_CAPI_ACCESS_TOKEN`. |
| Reddit pain-point scrape returns the fallback every day | Add `User-Agent` rotation or run from a different IP; the fallback already keeps the launch going. |
| GitHub Actions secrets out of sync after editing `.env.fulfillment` | Re-run `bash scripts/agent/push_secrets_to_github.sh`. |
| You changed a LemonSqueezy checkout ID | Edit `scripts/agent/conversion_router.py` LEMONSQUEEZY_PRODUCTS, then `python -m scripts/agent/verify_handoff.py` to confirm. |

---

**END OF MANUAL SCRIPT.** Past this point, the agency runs itself.
