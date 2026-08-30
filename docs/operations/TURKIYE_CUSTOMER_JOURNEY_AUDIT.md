# Türkiye Customer Journey — Lifecycle Audit

Audit date: 2026-08-28
Scope: Turkish visitor experience canonicalized under `aikagan.com/tr`; the retained `.com.tr` domain is a redirect-only defensive entry point.
Rule: code/configuration is evidence of implementation, not proof of external payment or fulfillment success.

## Journey map and status

| Stage | Intended route/action | Status | Evidence / gap |
|---|---|---|---|
| Türkiye entry | `aikagan.com` → `/tr`; `.com.tr` → `aikagan.com/tr` | Implemented, deployment pending | Middleware owns locale selection and permanent country-domain redirects. |
| Language override | TR Türkiye ↔ EN Global | Implemented, deployment pending | Locale cookie and explicit selector implemented. |
| Turkish home | `/tr` canonical | Implemented | Turkish value proposition and free-first CTAs exist. |
| Free tools index | `/tr/tools` | Implemented | Revenue scan, sample, AutonomaX links exist. |
| Revenue Leak Scan | `/tr/tools/revenue-leak-scan` / public localized path | Implemented | 7-question interaction calculates result without email. |
| Free-result next step | AutonomaX or products | Implemented in UI | Must verify application onboarding and local product route after deployment. |
| Local catalog | `/tr/products` | Implemented | 18 TRY offers across digital/training/consulting/subscription/service categories. |
| Local checkout | Shopier per SKU | Configured, not end-to-end verified in this audit | Each SKU has a Shopier destination. Actual product-page identity, payment completion and post-payment behavior require live transaction/provider evidence. |
| Digital fulfillment | Product promises “Anında dijital teslimat” | **Not proven** | No payment→delivery evidence inspected here. Do not treat the promise as verified until tested per SKU/family. |
| Subscription activation | AutonomaX/Bopper promises immediate access | **Not proven** | Requires successful paid activation/access test. |
| Consulting/training/service | 24–48h / 24h / 48h promises | Partially specified | Delivery SLA text exists; intake, scheduling and operational ownership need evidence. |
| Services offer | `/tr/services` | Implemented | Three service families and pre-payment scope promise exist. |
| Service intake | `/tr/contact` email path | Functional design but weak | Email is a fallback, not structured intake. Add form/CRM ticket + SLA tracking before calling lifecycle excellent. |
| App mid-end | `app.aikagan.com/autonomax` | Linked | Registration/auth/onboarding-to-first-value has not been verified by this audit. |
| Support | Turkish contact page | Implemented | General support email and services path exist. |
| Legal/refund | localized public routes in middleware | Routed | Content and checkout-consistency should be tested live before launch sign-off. |
| Measurement | checkout click component exists | Partial | Verified purchase, fulfillment and retention event chain must be demonstrated. |
| Retention/referral | post-delivery | **Gap** | No verified Turkish post-delivery lifecycle was established in this audit. |

## Link integrity defects found in source review

The target standard is:

- All Turkish navigation, metadata, canonicals and sitemap entries stay under `aikagan.com/tr`.
- `.com.tr` and `www.com.tr` requests permanently redirect to the matching canonical `/tr` destination.
- Historical localized paths such as `/urunler` redirect to their current equivalents such as `/tr/products`.
- No local-commerce CTA should accidentally fall back to the global USD catalog.

## Critical launch gates

### P0 — must pass before claiming Türkiye lifecycle completion

1. Deploy the latest locale/routing commits successfully to production.
2. Verify Türkiye-simulated entry lands on reachable Turkish content and explicit EN override persists.
3. Crawl every Turkish navigation/CTA and require 2xx/final expected destination with no loop/NXDOMAIN.
4. For every Shopier SKU, verify destination product identity, displayed TRY price and expected fulfillment type.
5. Execute at least one controlled real purchase for each fulfillment family (digital, subscription/access, scheduled service) or mark that family unavailable until verified.
6. Verify payment confirmation → delivery/access/intake → support route and refund instruction.
7. Verify AutonomaX link reaches usable auth/registration/onboarding and first-value state.
8. Verify analytics can distinguish checkout click from verified payment and fulfillment success.

### P1 — required for operational excellence

- Replace email-only service intake with structured intake carrying locale, source, requested outcome, consent and SLA state.
- Add Turkish post-purchase/fulfillment status page or equivalent provider-backed handoff.
- Add customer-visible order/support reference where provider capabilities permit.
- Instrument activation, fulfillment failure, support defect, refund and repeat/referral events.
- Establish partner RACI, escalation and reconciliation record before delegating local operations.

## Acceptance test matrix

Run on mobile and desktop, anonymous and returning visitor:

1. TR geo/no preference → Turkish fallback.
2. TR visitor chooses EN → remains global on next root visit.
3. Global visitor chooses TR → canonical Turkish experience under `/tr`.
4. Turkish home → free tools → scan → result → product catalog.
5. Turkish home → services → contact/intake.
6. Turkish home/tools → AutonomaX → registration/auth → usable first-value state.
7. Each catalog CTA → correct Shopier SKU/TRY offer.
8. Successful purchase → promised delivery/access/intake within stated SLA.
9. Failed/canceled payment → no false fulfillment; clear recovery.
10. Support/refund/legal → reachable and consistent with offer/payment provider.
11. Returning customer → access/support route remains available.
12. Analytics reconciliation: checkout intents ≥ verified payments ≥ fulfilled transactions, with identifiers sufficient to investigate mismatches.

## Current conclusion

The Turkish front-end proposition, free diagnostic, services and local TRY catalog are materially implemented. The lifecycle is **not yet truthfully complete** because the newest routing deployment is pending and payment-to-fulfillment, app onboarding, structured service intake, verified-purchase analytics and retention have not been demonstrated end-to-end. These are operational gates, not cosmetic backlog.
