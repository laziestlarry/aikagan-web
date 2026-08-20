# Production Release Gate — 2026-08-20

This release PR exists to drive the normal reviewed merge/deploy path after the revenue-critical application tree was validated and promoted to `main`.

## Required release result

- CI must pass locked install, lint, TypeScript, and Vercel build.
- Production deployment must resolve to the current GitHub main tree.
- Managed checkout must remain fail-closed when a provider or fulfillment dependency is unavailable.
- Paddle completed events must remain retryable until access, ledger evidence, and fulfillment queueing succeed.
- Missing evidence must never be replaced with promotional KPI values.
- Human/service offers must not enter automated checkout before scope and delivery terms are explicit.

## External traffic gate

`aikagan.com` and `app.aikagan.com` must be independently checked after deployment. If either still resolves to Firebase / Google AI Studio rather than the Vercel runtime, DNS cutover remains an external infrastructure blocker and the system must not be labeled fully live.
