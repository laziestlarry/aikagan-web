# Revenue Production Release — 2026-08-20

Canonical source commit before this release trigger: `1d481a58f137b6011966b127de7acd0448f8393a`.

## Validated application controls

- Managed checkout reaches the server-side provider resolver instead of being pre-gated on Gumroad.
- Promotional KPI fallback values are removed; missing evidence is shown as unavailable.
- Paddle `transaction.completed` processing remains retryable until buyer identity, access issuance, income-ledger persistence, and fulfillment queueing complete.
- Buyer identity is resolved from Paddle customer data when the transaction payload does not embed email/name.
- Scoped human/service offers route to intake before payment; managed checkout is reserved for products with defined automated fulfillment.
- Unsupported income-outcome claims were removed from the product catalog.

## CI evidence

PR-head GitHub Actions run `32369972901` passed:

- `npm ci`
- lint
- `tsc --noEmit`
- Vercel settings pull
- Vercel production build

## Release mechanism

The Vercel Git integration cancels unsigned connector-created deployments. Production is therefore released through `.github/workflows/deploy.yml`, which performs an authenticated Vercel CLI production deployment on `main` after build gates pass.

## External infrastructure truth gate

At release time, the public `aikagan.com` request path is still served by Firebase Hosting and `app.aikagan.com` serves a Google AI Studio application. The application release can be made READY on Vercel, but real traffic will not reach it until DNS/hosting is cut over to the Vercel project. No repository status may represent that external DNS cutover as complete until independently observed.

## Commercial proof gate

Production readiness is not a revenue claim. Final proof requires a real independent buyer transaction, verified Paddle webhook processing, one ledger entry, successful entitlement/delivery, and Paddle payout-verification completion.
