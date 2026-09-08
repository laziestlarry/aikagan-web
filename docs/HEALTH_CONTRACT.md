# AIKAGAN production health contract

`/api/health` reports customer-usable production availability rather than treating rollout state alone as an outage.

- `storefront_mode: commissioning` remains visible as an operational state.
- A commissioned hosted Gumroad SKU counts as a real checkout rail when its product mapping can start checkout.
- The global `STOREFRONT_COMMERCE_ENABLED` flag continues to gate automated/non-hosted commerce rails.
- HTTP 503 is reserved for a genuinely degraded critical path such as no registered paid catalog, no usable checkout provider, missing required fulfillment/token configuration, unavailable durable queue, or no paid SKU with a startable checkout path.

This keeps commissioning state observable without falsely reporting the entire application unavailable when verified hosted checkout is customer-usable.
