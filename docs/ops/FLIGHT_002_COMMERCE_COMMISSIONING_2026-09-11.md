# Flight 002 — Commerce Commissioning Evidence

Date: 2026-09-11
Production SHA: `5cc2d9a5079d99467560e143b9935cd479ad0979`
Doctrine: Diagnose → Rank → Execute → Verify

## Durable engineering evidence

- GitHub Actions run `34628641344` completed successfully.
- Lint passed with one non-blocking warning in `workers/edge.ts`.
- Type check passed.
- Next.js/Vercel production build passed and generated 74/74 static pages.
- Production deployment completed and was aliased to `https://aikagan.com`.
- Public `/api/health` returned HTTP 200 with:
  - `ok: true`
  - `version: 5cc2d9a5079d99467560e143b9935cd479ad0979`
  - `primary_checkout_provider: gumroad`
  - `startable_paid_offers: 3`
  - `checkout_startable: true`
  - `commercial_evidence: configuration_only`
- Public checkout status reported Gumroad hosted checkout available and Gumroad verification API configured.

## Checkout commissioning smoke — TEST / INTERNAL, not commercial proof

These calls intentionally created commissioning checkout intents only. They are not buyer demand, orders or revenue.

- Starter → HTTP 303 → `https://nomadauto.gumroad.com/l/autonomax-starter-29`
- Pro → HTTP 303 → `https://nomadauto.gumroad.com/l/autonomax-pro-79`
- Commander → HTTP 303 → `https://nomadauto.gumroad.com/l/autonomax-commander-149`

The central authority is `/api/income/checkout`. The legacy `/api/gumroad-checkout` now forwards to it so validation, intent attribution, provider selection and fail-closed policy are not duplicated.

Synthetic Gumroad coupon parameters were removed. When a requested coupon/test price cannot be enforced by an available provider, checkout fails closed instead of silently opening a full-price Gumroad purchase.

## Fulfillment contract present in production code

Verified Gumroad sale → independent Gumroad sale verification → exact SKU mapping → idempotency → income ledger → download token → customer entitlement → fulfillment queue/webhook → customer session → secure private ZIP.

This is capability evidence only until a provider-confirmed external purchase exercises the path.

## Customer / legal truth alignment

- Mission Control public readiness now separates checkout configuration from external commercial proof.
- Privacy and refund notices identify the provider presented at purchase and declare Gumroad as the mapped hosted self-serve rail rather than falsely naming Paddle for every purchase.
- Service offers remain scope-first rather than bypassing fulfillment acceptance with instant checkout.

## Founding Tester Circle

`/network` now recruits developers, coders, trainers, educators, QA testers, creators, founders and operators with explicit participation lanes. Joining/testing is free. Contributor recognition is permission-based. Cash compensation is not promised unless separately agreed. Affiliate commission applies only to verified attributed sales.

A LinkedIn + Facebook recruitment broadcast is scheduled for 2026-09-15 11:00 Europe/Istanbul with attributable campaign `founding_tester_circle_2026`.

## Evidence classification / open gate

- ENGINEERING / PRODUCTION: PASS for the deployed checkout configuration described above.
- TEST / INTERNAL checkout intents: PASS for all three hosted Gumroad destinations; excluded from demand and revenue.
- VERIFIED EXTERNAL payment: not yet evidenced in this commissioning record.
- VERIFIED EXTERNAL delivery / acceptance: not yet evidenced in this commissioning record.
- Therefore G7 remains OPEN. A real unrelated customer must complete provider-verified payment → correct entitlement/delivery → re-access/QA → acceptance or revision closure before Flight 002 commercial completion may be claimed.

## Hardening exception

`npm ci` reported 9 dependency vulnerabilities: 1 low, 1 moderate, 6 high, 1 critical. These require targeted dependency audit/remediation; they were not build blockers but should not be ignored in a hardened release claim.
