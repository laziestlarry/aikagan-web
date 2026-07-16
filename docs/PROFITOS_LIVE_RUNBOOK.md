# ProfitOS Live Production Runbook

## Truth rule

A deployment is not production-ready because it builds. It is ready only when `/api/ops/status` returns HTTP 200 with `ready: true` and `simulated: false`.

## Required production configuration

- `PADDLE_API_KEY`
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
- `PADDLE_WEBHOOK_SECRET`
- `DOWNLOAD_SECRET` or `FULFILLMENT_SECRET`

Recommended telemetry configuration:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `NEXT_PUBLIC_META_PIXEL_ID`

## Release sequence

1. Deploy the candidate branch to Vercel preview.
2. Open `/mission-control` and inspect every critical gate.
3. Trigger the `Production Readiness Gate` workflow with the preview URL.
4. Correct missing configuration until the gate passes.
5. Execute one real low-value purchase using the active checkout rail.
6. Confirm the payment webhook, order record, delivery email, and download access.
7. Merge only after the evidence above is captured.

## Rollback rule

If checkout or fulfillment fails after release, revert the release or disable paid calls to action. Never replace a failed live signal with simulated success data.
