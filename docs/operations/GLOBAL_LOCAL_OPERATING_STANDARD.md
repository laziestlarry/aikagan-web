# AIKAGAN Global–Local Operating Standard (GLOS)

Status: Active operating standard
Owner: AIKAGAN / AutonomaX
Purpose: turn globally reusable business value into locally tailored, partner-operable productized solutions while preserving evidence, customer outcomes, and shared-profit accountability.

## Corporate doctrine

**Globally standardized value. Locally tailored solutions. Jointly operated growth.**

A market expansion is not a translation project. It is a controlled replication of a proven value proposition into a local customer journey, commercial model, payment rail, fulfillment system, support path, partner operating agreement, and measurable improvement loop.

## Operating unit

Each expansion market is a Market Cell. A Market Cell owns: locale and customer language; local catalog and pricing; payment and compliance gates; acquisition channels; partner roles; fulfillment SLA; support/escalation; analytics; customer feedback; and a market P&L/share model. Shared global assets remain versioned centrally. Local adaptations are recorded as overlays rather than undocumented forks.

## Stage gates

1. **Evidence gate** — define customer segment, pain, evidence, proposition and measurable outcome.
2. **Localization gate** — adapt wording, currency, offer packaging, proof, cultural expectations and legal/commercial constraints.
3. **Journey gate** — verify discovery → free value → diagnosis → offer → checkout/intake → payment → registration/access → fulfillment → support → retention/referral.
4. **Partner gate** — assign accountable local operator, responsibilities, SLA, economics, data boundaries and escalation.
5. **Launch gate** — production routes, payments, fulfillment, analytics, support and rollback are verified with evidence.
6. **Learning gate** — record actual outcomes, defects, objections and local discoveries; promote reusable lessons to the global standard only after evidence.
7. **Scale gate** — clone the validated Market Cell template, replacing only market-specific overlays.

No gate is marked complete from code existence alone. Completion requires a working customer-visible path or explicit evidence that the dependent external service is operational.

## Definition of Done: customer lifecycle

A market is operational only when all applicable stages pass:

- Entry resolves reliably and preserves explicit language choice.
- Navigation never strands the visitor between global and local URL schemes.
- Free experience produces the promised result without hidden purchase requirements.
- Result pages provide an appropriate next action: DIY product, implementation service, application experience, or no purchase.
- Product cards state what is sold, local price, payment provider, delivery mode and timing.
- Checkout destination corresponds to the selected SKU and displayed commercial promise.
- Successful payment has a verified fulfillment trigger or a truthful manual SLA; “instant” is forbidden unless tested end-to-end.
- Application CTAs reach a usable registration/access path; authenticated-only destinations must provide sign-in/onboarding rather than a dead end.
- Service CTAs reach structured intake or an explicit contact path with response SLA.
- Support, refund/privacy/terms and escalation routes remain reachable in the visitor’s language where applicable.
- Analytics distinguish market, locale, offer/SKU, source, checkout intent, verified purchase and fulfillment outcome.
- Retention/referral has a defined post-delivery next action.

## Development record

Every material market change records:

- Date / market / owner
- Objective and customer problem
- Baseline evidence
- Change and affected routes/SKUs
- Assumptions and dependencies
- Verification performed and evidence
- Result: passed / partial / blocked / rolled back
- Customer or partner impact
- Lesson learned
- Standard change proposed
- Follow-up owner and acceptance criterion

Use commits and PRs as immutable implementation evidence; use this record for business/operational reasoning. Never rewrite a failed experiment as a success.

## Lessons library

Lessons are tagged `global`, `market:<cc>`, `journey`, `commerce`, `fulfillment`, `partner`, `localization`, `analytics`, or `reliability`.

Promotion rule: a local lesson becomes a global standard when it is (a) observed in two markets, or (b) prevents a high-impact customer, legal, payment, security or fulfillment failure. A global rule may be overridden locally only with a documented reason, owner, expiry/review date and verification criterion.

### Türkiye bootstrap lessons

- Domain readiness and application readiness are separate gates. Never redirect traffic to a market domain until public DNS/HTTPS are verified.
- A reachable locale path on the global domain is the safe rollout fallback while a local domain is being delegated.
- Geo detection is a convenience, not a lock. Explicit language choice must win and persist.
- Local commerce must use local-facing pricing/payment expectations without silently changing the global catalog.
- Internal implementation paths (`/tr/...`) and public localized paths (`/ucretsiz-araclar`, `/urunler`, etc.) must not leak into links in a way that creates host-dependent redirects or dead ends.
- A checkout claim such as “instant delivery” is an operational assertion and requires payment-to-delivery evidence, not merely a product-card label.

## Partner operating contract template

Each local partner agreement should define: market/segment; catalog authority; acquisition responsibilities; fulfillment responsibilities; support hours/SLA; approved brand/value claims; pricing/discount authority; payment/refund ownership; customer-data access; KPI definitions; revenue/cost/profit-share formula; reconciliation cadence; quality threshold; incident escalation; IP/reusable-learning rights; termination/transition; and audit/evidence access.

Shared profit is calculated from independently verifiable transactions and agreed attributable costs, not forecast revenue or vanity metrics.

## Market scorecard

Minimum funnel: qualified visits → free experience starts → free result completions → offer views → checkout/intake starts → verified purchases/contracts → fulfilled orders → support defects/refunds → repeat/referral outcomes.

Operational KPIs: route success %, checkout success %, payment-to-fulfillment success %, SLA compliance %, refund/defect %, conversion by market/offer, contribution margin, partner reconciliation variance, and time from local lesson to validated improvement.

## Replication package

A Market Cell may be copied only with: proposition profile; locale dictionary/tone guide; route map; local catalog overlay; price/payment configuration; fulfillment map; support/legal map; analytics events; partner RACI/economics; launch test suite; known lessons; rollback procedure; and current evidence status.

This creates controlled multiplication: one global operating grammar, many locally optimized commercial implementations.