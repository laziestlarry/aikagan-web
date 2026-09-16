# Turkish public journey release — 2026-09-16

## Release objective

Make `aikagan.com/tr` a complete Turkish public journey instead of a translated landing page that later drops visitors into English screens. The route now keeps navigation, free outcomes, intake, product evaluation, support, legal copy, and verified post-purchase guidance in Turkish until the visitor deliberately selects English or opens the clearly named Gumroad payment provider.

## Public route inventory

| Visitor need | Turkish route | Delivered outcome |
| --- | --- | --- |
| Understand the offer | `/tr` | Outcome-first introduction and three free starting points |
| Choose a free start | `/tr/start-free` | Comparison of all free offers and their outputs |
| Browse free tools | `/tr/tools` | Turkish tool catalog |
| Find sales friction | `/tr/tools/revenue-leak-scan` | Seven-question score and ranked weaknesses |
| Inspect delivery quality | `/tr/free/golden-delivery-sample` | Turkish delivery-control sample |
| Understand the operating approach | `/tr/flight` | Plain-language inspect → prioritize → implement → verify flow |
| Understand delivery from idea to result | `/tr/genesis` | Plain-language build and evidence process |
| Prepare a business mission | `/tr/outcome` | Explanation of the free planning output |
| Submit the mission | `/tr/outcome/intake` | Three-step editable intake, deletion controls, human approval, on-page result |
| Review paid products | `/tr/products` | Fully localized names, descriptions, inclusions, prices, availability and delivery terms |
| Review a product | `/tr/products/[slug]` | Localized product detail and hosted checkout or written-scope path |
| Request implementation | `/tr/services` | Defined service categories and pre-payment scope boundary |
| Contact support | `/tr/contact` | Turkish intake form with placeholders, success and error states |
| Give product feedback | `/tr/feedback` | Turkish product-feedback form and receipt state |
| Join the user network | `/tr/network` | Turkish free-tool and feedback path |
| Understand the business | `/tr/about` | Plain-language identity and evidence policy |
| Review policies | `/tr/legal/*` | Turkish privacy/KVKK, terms and refund copy |
| Receive a paid delivery | `app.aikagan.com/checkout-success` | Turkish verification and download state when the shared locale cookie is Turkish |

## Translation decisions

- Visitor-facing `Gelir Kaçağı` was changed to `Gelir Kaybı`. This preserves the intended commercial meaning and avoids the everyday Turkish meanings of escape, fugitive, or illicit leakage.
- Internal project labels are not used as the primary explanation. `OutcomeOS` is presented as `İş Hedefi Taslağı`; execution modules are explained as ordinary work steps.
- AI is described as preparing, analysing, ranking, or assisting. Consequential approval remains with a named person.
- Every free and paid offer states what the visitor receives. Free tools do not imply revenue, payment, or completed implementation.
- Product data is translated at the catalog model boundary so list and detail pages cannot mix Turkish chrome with English inclusions.

## Commerce and delivery evidence

- Hosted Gumroad pages returned HTTP 200 for Starter, Pro, and Commander mappings.
- Local delivery archives passed ZIP integrity tests:
  - Starter: 8 entries, 10,012 bytes
  - Pro: 7 entries, 7,830 bytes
  - Commander: 6 entries, 8,963 bytes
- The public catalog remains default-deny for unmapped or unscoped offers.
- A checkout click records intent only. Revenue requires provider evidence; download access requires a verified session token.
- Turkish post-purchase copy does not display an unverified confirmation state.

## Search and AI discovery

- `sitemap.xml` is generated from the application and includes paired English/Turkish canonical URLs with `hreflang` alternates.
- The obsolete static `public/sitemap.xml` and `public/robots.txt` were removed because they were shadowing the current generated records.
- `robots.txt` keeps public routes discoverable while excluding API, admin, dashboard, and checkout-success surfaces.
- Turkish pages include canonical URLs, English/Turkish alternates, Turkish metadata, and JSON-LD for the organization, website, and free-tool list.
- `/llms.txt` and `/llms-full.txt` describe the bilingual launch, free tools, paid outcomes, evidence boundaries, canonical routes, and support identity for AI search and answer engines.

Search engines and AI services decide when and whether to crawl or index a page. These records make the release discoverable; they are not evidence of indexing. After deployment, submit `https://aikagan.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools, then inspect `/tr`, `/tr/tools/revenue-leak-scan`, `/tr/products`, and one Turkish product URL. Request indexing only after each live canonical and rendered page passes inspection.

## Automated acceptance

Run:

```bash
npm ci
npm run lint
npm run build
npm run verify:tr
npm run verify:outcomeos
node scripts/verify-hosted-checkouts.mjs
```

`verify:tr` starts the production build locally and checks 21 Turkish pages for HTTP success, `lang="tr"`, canonical URL, bilingual `hreflang`, title and description ranges, structured data, obsolete support addresses, ambiguous `kaçak` wording, internal Turkish link continuity, sitemap inclusion, free PDF availability, localized product names, and key form/result wording.

## Live audit after deployment

1. Open `/tr` in a clean Turkish-browser session. Confirm the header, footer, language button, and all next-page menus stay Turkish.
2. Complete all seven answers in the Gelir Kaybı Testi. Confirm the score and ranked results appear without email or payment.
3. Open and download the free delivery sample.
4. Complete the Turkish work-goal intake with non-sensitive test data. Verify the same-page result; remove the test record afterward if persistence is connected.
5. Open each paid product detail. Confirm Turkish name, contents, USD price, delivery method, refund/support text, and correct Gumroad destination.
6. Do not make a real purchase solely for a smoke test. Use an authorized low-value production order only when payment, webhook, session-token, archive download, email receipt, refund, and accounting evidence will all be retained.
7. Verify `app.aikagan.com/checkout-success` with a Turkish locale cookie in a non-payment state; it must not claim an order is confirmed.
8. Inspect Search Console and Bing only after the deployment SHA is live. Record coverage or indexing as external evidence, not as a release assumption.

