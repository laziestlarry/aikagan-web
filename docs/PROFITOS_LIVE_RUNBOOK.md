# ProfitOS Live Production Runbook

## Truth rule

A deployment is not production-ready because it builds. It is ready only when `/api/ops/status` returns HTTP 200 with `ready: true` and `simulated: false`.

## Required production configuration

Configure at least one complete payment rail:

### Paddle

- `PADDLE_API_KEY`
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_CHECKOUT_DISABLED` must not be `true`

### Lemon Squeezy

- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_STORE_ID`
- `LEMONSQUEEZY_WEBHOOK_SECRET`
- At least one `LEMONSQUEEZY_VARIANT_<PRODUCT_SLUG>` variable

### Shopier

- `SHOPIER_PAT` or `AUTONOMAX_SHOPIER_PAT`
- `SHOPIER_OSB_USERNAME` or `AUTONOMAX_SHOPIER_OSB_USERNAME`
- `SHOPIER_OSB_PASSWORD`, `AUTONOMAX_SHOPIER_OSB_KEY`, or `AUTONOMAX_SHOPIER_OSB_PASSWORD`

### Gumroad

- `GUMROAD_WEBHOOK_TOKEN`
- Configure the Gumroad Ping URL as `https://aikagan.com/api/webhooks/gumroad?token=<GUMROAD_WEBHOOK_TOKEN>`

All payment rails also require:

- `DOWNLOAD_TOKEN_SECRET`
- `MAKE_PURCHASE_WEBHOOK_URL` or `MAKE_CUSTOMER_SERVICE_WEBHOOK_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Recommended conversion telemetry:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `NEXT_PUBLIC_META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN`
- `MAKE_OMNICHANNEL_WEBHOOK_URL`

## Release sequence

1. Deploy the candidate branch to Vercel preview.
2. Open `/mission-control` and inspect every critical gate.
3. Trigger the `Production Readiness Gate` workflow with the preview URL.
4. Correct missing configuration until the gate passes.
5. Execute one real low-value purchase using the active checkout rail.
6. Confirm the payment webhook, durable order record, delivery email, and secure download access.
7. Merge only after the evidence above is captured.

## Rollback rule

If checkout or fulfillment fails after release, revert the release or disable paid calls to action. Never replace a failed live signal with simulated success data.
