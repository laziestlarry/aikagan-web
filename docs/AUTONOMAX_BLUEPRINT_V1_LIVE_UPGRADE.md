# AutonomaX Blueprint v1 — Live Upgrade Pack

**Target:** `laziestlarry/aikagan-web`  
**Surface:** `app.aikagan.com/autonomax`  
**Operating rule:** no state is presented as complete without its own runtime evidence.

## Delivered

- A typed blueprint manifest for director agents, executor roles, critical path, events, and the eight-stage Product-to-Revenue pipeline.
- `GET /api/autonomax/blueprint` for runtime readiness and queue depth.
- `POST /api/autonomax/briefs` for validated, rate-limited ProductBrief intake.
- Durable brief storage through the existing shared KV abstraction, with in-memory fallback explicitly treated as non-durable.
- A live AutonomaX control-plane page showing capability gates, director mandates, pipeline contracts, and the real brief queue.
- Mission Control journey routing into the new control plane.
- One consolidated GitHub Actions/Vercel production pipeline with locked installs, lint, type checking, preview validation, and production deployment.

## Truth states

The control plane distinguishes four required gates:

1. Durable state
2. Model provider
3. Commerce provider
4. Golden Delivery fulfillment handoff

Telemetry and change-control authentication are advisory gates. Missing configuration is reported as blocked; it is not replaced with synthetic readiness.

## ProductBrief contract

```json
{
  "category": "AI revenue operations audit",
  "audience": "Founder with a stalled app and broken checkout",
  "keywords": ["checkout repair", "delivery automation"],
  "refs": ["https://example.com/reference"],
  "successCriteria": "Verified checkout, payment evidence, and retryable delivery job"
}
```

Accepted briefs emit `product.brief_queued` and receive HTTP `202`. The response states whether model generation can be dispatched or remains blocked.

## Deferred by design

The pack does not simulate these states:

- AI-generated draft
- approved asset package
- published marketplace listing
- paid order
- delivered order
- completed self-improvement proposal

Each requires a real downstream adapter and its own verified event.

## Next production adapters

1. Model adapter that consumes `autonomax:briefs` and emits schema-valid drafts.
2. Quality evaluator with a persisted rubric score and approval gate.
3. Shopify/Etsy publishing adapters behind explicit channel credentials and feature flags.
4. Listing verification that stores the returned live URL.
5. Nightly evaluation job that proposes changes without merging them automatically.
