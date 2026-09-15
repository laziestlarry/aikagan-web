# TRAFFIC JOURNEY QA & DELIVERY ASSURANCE
## Hosting, Conversion Path, Fulfillment & Edge-Case Verification

---

## 1. THE CANONICAL TRAFFIC JOURNEY
Every paid acquisition link must resolve through this exact chain. Any break is a revenue leak.

```
Social post / DM / blog
        │  (UTM tagged)
        ▼
aikagan.com/<landing>          → 200, SSR, <2s LCP
        │
        ▼
/tools/revenue-leak-scan       → score computed client-side, no email gate
        │
        ▼
/outcome/intake                → draft mission recorded (E0), no payment
        │
        ▼
/products/<slug>               → contents, price, delivery, support shown
        │
        ▼
/api/income/checkout?provider=gumroad → 303 → nomadauto.gumroad.com/l/<sku>
        │
        ▼
Gumroad payment                → verified sale + webhook
        │
        ▼
/api/webhooks/gumroad          → token issued, customer provisioned
        │
        ▼
app.aikagan.com/dashboard      → entitlement + delivery visible
        │
        ▼
E5 acceptance                  → case study eligibility
```

---

## 2. PRE-LAUNCH QA CHECKLIST (Run before every campaign wave)

| # | Check | Command / Method | Pass Criteria |
|---|-------|------------------|---------------|
| 1 | Home reachable | `curl -sI https://aikagan.com` | 307 → /tr or 200 |
| 2 | App reachable | `curl -sI https://app.aikagan.com` | 308 → /dashboard |
| 3 | OutcomeOS reachable | `curl -sI https://outcome.aikagan.com` | 200 |
| 4 | Health contract | `curl -s https://aikagan.com/api/health` | `ok:true`, `checkout_startable:true` |
| 5 | All 3 Gumroad CTAs | `curl -s .../products \| rg 'provider=gumroad'` | starter + pro + commander |
| 6 | Starter checkout resolves | click CTA or `curl -sIL ".../api/income/checkout?slug=masterclass-starter&provider=gumroad"` | 303 → gumroad 200 |
| 7 | Pro checkout resolves | same for `masterclass-pro` | 303 → gumroad 200 |
| 8 | Commander checkout resolves | same for `masterclass-commander` | 303 → gumroad 200 |
| 9 | Sitemap valid | `curl -s https://aikagan.com/sitemap.xml` | canonical host, no trailing slash |
| 10 | Robots correct | `curl -s https://aikagan.com/robots.txt` | allows /, disallows /api/ |
| 11 | Scan works | open `/tools/revenue-leak-scan` on mobile | score renders, share copies |
| 12 | Intake works | submit `/outcome/intake` | mission draft recorded, no payment |
| 13 | Turkish path | `curl -sI https://aikagan.com/tr` | 200, correct locale |
| 14 | No console errors | browser devtools on 4 key pages | zero errors |
| 15 | Mobile 390px | responsive check | no horizontal scroll |

---

## 3. EDGE-CASE FAILURE MATRIX

| Failure | Detection | Automated Response | Human Escalation |
|---------|-----------|--------------------|------------------|
| Gumroad rail unavailable | checkout returns `checkout_unavailable` | inline error banner, no silent redirect to manual | ops alert, 30 min |
| Webhook duplicate | same `sale_id` replayed | idempotency key blocks double-grant | log only |
| Webhook signature mismatch | token comparison fails | 401, no entitlement granted | immediate review |
| Delivery asset missing | storage check fails | fall back to backup link | 15 min |
| Email bounce | provider bounce event | alternate channel attempt | immediate |
| Stalled mission > dwell limit | escalation cron `/api/cron/outcome-escalation` | mark `escalateToHuman`, status blocked | daily digest |
| KV unavailable | health `durable_queue` degraded | in-memory fallback, no data loss claim | monitor |
| Turkish country redirect loop | repeated 307 | locale cookie short-circuits | test in private window |

---

## 4. DELIVERY QUALITY ASSURANCE (Post-Purchase)

1. **Within 5 minutes of verified payment:** entitlement granted, delivery link issued, confirmation email queued.
2. **Within 24 hours:** onboarding sequence D+0 sent; workspace shows mission + next action.
3. **D+3:** check-in with one concrete improvement prompt.
4. **D+7:** request acceptance confirmation (this is the only path to E5).
5. **D+30:** eligible refund window closes; request testimonial only if E5 was confirmed.

**Rule:** No customer is counted as fulfilled until delivery is traceable and the customer has confirmed receipt. A page view, checkout intent, or generated file is never recorded as revenue or completed fulfillment.

---

## 5. HOSTING & RESILIENCE NOTES
- Frontend/API: Vercel (production alias `aikagan.com`).
- CI/CD: GitHub Actions `Build and Deploy to Vercel` must pass before a release is considered shipped.
- KV: Upstash REST with in-memory fallback; health reports `durable_queue`.
- Cron: `vercel.json` schedules affiliate-payouts, weekly-intelligence, process-emails, outcome-escalation.
- Release integrity check: `curl -s .../api/health | jq .version` must equal the merged `main` SHA.
