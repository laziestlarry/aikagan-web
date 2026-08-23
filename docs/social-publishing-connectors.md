# Social publishing connectors

AIKAGAN exposes one authenticated internal publishing route at `POST /api/social/publish`.

It does **not** store social-network access tokens in source control. Instead, each network is connected through a server-side publish endpoint that owns its OAuth/API credentials.

## Required production environment variables

- `SOCIAL_PUBLISH_ADMIN_SECRET` — protects the AIKAGAN publishing API.
- `SOCIAL_PUBLISH_SHARED_SECRET` — bearer secret used when calling connector endpoints.
- `LINKEDIN_PUBLISH_ENDPOINT` — HTTPS endpoint that performs the authenticated LinkedIn publish action.
- `X_PUBLISH_ENDPOINT` — HTTPS endpoint that performs the authenticated X publish action.
- `FACEBOOK_PUBLISH_ENDPOINT` — HTTPS endpoint that performs the authenticated Facebook Page publish action.

## Why this shape

LinkedIn, X and Meta require distinct app registrations, OAuth scopes, review/approval rules and token lifecycles. Keeping those credentials behind network-specific server endpoints isolates vendor auth from the storefront and lets the site fail closed when a connector is unavailable.

## Launch payload

```json
{
  "networks": ["linkedin", "x", "facebook"],
  "text": "AIKAGAN now starts with free value. Try practical diagnostics and guided AI workflows before buying anything.",
  "url": "https://aikagan.com/start-free/"
}
```

## Acceptance criteria

1. Route rejects missing/invalid admin secret with 401.
2. Unconfigured networks return explicit connector errors; they are never reported as successful posts.
3. At least one configured network can publish the supplied message and return a real provider response.
4. Provider post URL/ID should be returned by the connector endpoint and retained in launch evidence before counting a post as published.
