# ProfitOS Live Production Runbook

## Truth rule

A deployment is not production-ready because it builds. It is ready only when `/api/ops/status` returns HTTP 200 with `ready: true` and `simulated: false`.

## Required production configuration

Configure at least one complete payment rail.

### Gumroad — primary public storefront rail

- `GUMROAD_ACCESS_TOKEN`
- Hosted product mapping in `lib/gumroad-products.ts`
- `/api/cron/process-emails` scheduled reconciliation
- Optional Gumroad Ping may post to `https://aikagan.com/api/webhooks/gumroad`; every Ping is verified against Gumroad sales data before fulfillment

Gumroad's legacy resource-subscription API is not used. The production worker polls authenticated sales data, rejects refunded or disputed sales, and processes each order idempotently.

### Paddle — approved surfaces only

- `PADDLE_API_KEY`
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_CHECKOUT_DISABLED` must not be `true`
- Use only on a Paddle-approved domain such as `app.aikagan.com` or `propulse-autonomax.web.app`

### Lemon Squeezy

- Merchant approval
- `LEMONSQUEEZY_CHECKOUT_ENABLED=true`
- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_STORE_ID`
- `LEMONSQUEEZY_WEBHOOK_SECRET`
- At least one `LEMONSQUEEZY_VARIANT_<PRODUCT_SLUG>` variable

### Shopier

- `SHOPIER_PAT` or `AUTONOMAX_SHOPIER_PAT`
- Product-specific dynamic checkout or product-specific hosted URLs
- OSB credentials for webhook verification

All payment rails also require:

- `DOWNLOAD_TOKEN_SECRET`
- `MAKE_PURCHASE_WEBHOOK_URL` or `MAKE_CUSTOMER_SERVICE_WEBHOOK_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `CRON_SECRET`

Recommended conversion telemetry:

- `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, or `NEXT_PUBLIC_META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN`
- `MAKE_OMNICHANNEL_WEBHOOK_URL`

## Release sequence

1. Deploy the candidate branch to Vercel preview.
2. Open `/mission-control` and inspect every critical gate.
3. Confirm hosted checkout pages and ZIP archive integrity.
4. Merge only when checkout fails closed and all non-financial gates pass.
5. After production deploy, verify `/api/ops/status`, `/api/health`, and the mapped checkout redirect.
6. Execute one consented low-value purchase.
7. Confirm the verified sale, durable ledger record, CAPI event, Make/KV handoff, delivery email, and secure download.

## Reconciliation operations

`/api/cron/process-emails` runs every 15 minutes. It:

1. reads recent authenticated Gumroad sales,
2. maps supported product IDs/permalinks,
3. rejects refunded or disputed sales,
4. deduplicates previously processed sale IDs,
5. issues secure delivery access,
6. writes the income ledger and CAPI event,
7. hands the order to Make.com and the durable KV retry queue.

## Rollback rule

If checkout or fulfillment fails after release, revert the release or disable paid calls to action. Never replace a failed live signal with simulated success data.
