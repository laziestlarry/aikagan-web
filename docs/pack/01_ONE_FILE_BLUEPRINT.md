# ONE-FILE APPLICATION BLUEPRINT
## aikagan-web — Complete System Map

> **Single-file reference** covering every route, component, library, data flow, and deployment artifact. Updated for Paddle (Merchant of Record) as primary payment provider.

---

## 1. SYSTEM TOPOLOGY

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VERCEL (Serverless Edge)                      │
│                                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────────┐  │
│  │  Next.js 15  │  │  API Routes  │  │  private/downloads/        │  │
│  │  (React 18)  │  │  (7 dynamic) │  │  (6 ZIPs, streamed)       │  │
│  └──────┬──────┘  └──────┬───────┘  └────────────────────────────┘  │
│         │                │                                           │
│         ▼                ▼                                           │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              SHARED LIBRARIES (lib/)                          │   │
│  │  paddle-client.ts  │  products.ts  │  download-token.ts      │   │
│  │  token-store.ts    │  capi.ts      │  api-client.ts          │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌──────────────────┐        ┌──────────────────────────┐
│   PADDLE BILLING │        │   SHOPIER (Turkey)        │
│   (MoR Primary)  │        │   (autonomax.shopier.com) │
│   5% + $0.50     │        │   2.9% fee, 19 products   │
│   Payoneer payout│        │   TRY pricing             │
└──────────────────┘        └──────────────────────────┘
```

---

## 2. COMPONENT TREE (Full)

```
app/layout.tsx                          ← Root layout (metadata, fonts, GA, Meta Pixel)
├── src/components/layout/Navbar.tsx     ← Navigation (logo, links, CTA)
├── app/page.tsx                         ← Landing page
│   ├── src/components/home/Hero.tsx     ← Hero section (headline, subtitle, CTA)
│   ├── src/components/home/HeroMotion.tsx  ← Animated hero elements
│   ├── src/components/home/ValueProposition.tsx  ← Value props
│   ├── src/components/home/FeatureGrid.tsx  ← Feature showcase
│   ├── src/components/home/SocialProof.tsx  ← Testimonials/social proof
│   ├── src/components/home/TrustBar.tsx  ← Trust badges
│   ├── src/components/shared/ProductCard.tsx  ← Product cards (3 paid)
│   └── src/components/ui/CheckoutLink.tsx  ← Checkout trigger
├── app/products/page.tsx                ← Product listing
├── app/products/[slug]/page.tsx         ← Product detail
│   ├── src/components/ui/CheckoutLink.tsx
│   └── src/components/ui/ExitIntentModal.tsx  ← Exit popup with discount
├── app/checkout-success/page.tsx        ← Post-purchase (polls for token)
│   └── src/components/shared/ProcessStages.tsx
├── app/legal/*                          ← Legal pages (refund, terms, privacy, contact)
├── app/about/page.tsx                   ← About page
├── app/contact/page.tsx                ← Contact form
├── app/services/page.tsx               ← Services page
├── app/mission-control/page.tsx        ← Dashboard/KPI view
├── app/free/[slug]/page.tsx            ← Free lead magnet pages
├── app/thank-you/page.tsx             ← Redirect to /checkout-success
├── src/components/layout/Footer.tsx    ← Footer
├── components/AttributionInit.tsx      ← Attribution tracking
├── components/MetaPixelEvent.tsx       ← Meta Pixel events
├── components/shared/CRMPipeline.tsx   ← CRM view
├── components/shared/LiveChat.tsx      ← Live chat widget
├── components/shared/LiveKPIs.tsx      ← Live KPI counters
├── components/ui/CheckoutButton.tsx    ← Alt checkout button
├── components/ui/LeadMagnetForm.tsx    ← Email capture form
└── components/CheckoutButton.tsx       ← Duplicate checkout btn (legacy)
```

---

## 3. API ROUTE DETAILS

### POST /api/paddle-checkout
```
Request:  { slug: "masterclass-starter" }
Action:   Creates Paddle transaction with inline price + custom_data: { product_slug }
Returns:  { url: "https://checkout.paddle.com/transaction/txn_...", transactionId: "txn_..." }
Errors:   400 (invalid slug), 404 (unknown product), 500 (API key missing / auth failure)
```

### POST /api/webhooks/paddle
```
Headers:  p-pl: <signature>
Body:     Raw JSON event payload
Action:   Validates signature via WebhooksValidator
          On transaction.completed: extracts product_slug, generates token, stores in Map
Returns:  { ok: true } / 401 (bad signature)
```

### GET /api/session-token
```
Query:    ?transaction_id=txn_...
Action:   Checks in-memory Map first, then falls back to Paddle API get(transactionId)
Returns:  200 { token, slug, email } | 202 { status: "processing" } | 400/404 errors
```

### GET /api/download/[token]
```
Action:   Splits token on ".", verifies HMAC signature, checks TTL (48h)
          Reads ZIP from private/downloads/<product.zip>, streams to client
Returns:  ZIP stream | 401 (invalid/expired) | 404 (product not found)
```

---

## 4. PRODUCT CONFIGURATION

All products defined in `lib/products.ts` with interface:

```typescript
interface Product {
  slug: string;           // URL slug
  name: string;           // Display name
  tier: string;           // Human-readable tier label
  ladderTier: ProductTier; // Machine-readable: lead_magnet | masterclass
  price: number;          // USD (0 for free)
  originalPrice?: number; // Strike-through price
  priceModel: "free" | "one_time" | "monthly";
  checkoutUrl: string | null;  // "paddle" for paid | null for free
  zipFilename: string | null;  // Filename in private/downloads/
  nextSlug: string | null;     // Upsell path
  leadMagnetPath?: string;     // Free asset path
  badge?: string;
  guarantee?: string;
}
```

---

## 5. DOWNLOAD TOKEN SYSTEM

Self-contained, payment-provider-agnostic. No database required.

```
generateDownloadToken(slug, orderId, email):
  1. Create payload: { slug, orderId, email, exp: Date.now() + 48h }
  2. Base64url-encode the JSON payload
  3. HMAC-SHA256 sign with DOWNLOAD_TOKEN_SECRET
  4. Concatenate: payload_b64.signature_b64

verifyDownloadToken(token):
  1. Split on "."
  2. Recompute HMAC and compare
  3. Check exp hasn't passed
  4. Return { slug, orderId, email } or null
```

---

## 6. CRITICAL FILES REFERENCE

| File | Lines | Complexity | Why It Matters |
|------|-------|-----------|----------------|
| `lib/products.ts` | 217 | Medium | The product catalog — ALL pricing, descriptions, tier logic lives here |
| `lib/paddle-client.ts` | 17 | Low | Singleton Paddle SDK — returns null gracefully when unconfigured |
| `lib/download-token.ts` | 30 | Low | HMAC token logic — payment-provider-agnostic, no changes needed |
| `lib/token-store.ts` | 21 | Low | In-memory Map — swap to Vercel KV for multi-instance |
| `app/api/paddle-checkout/route.ts` | 89 | High | Core revenue route — creates Paddle transaction, handles all errors |
| `app/api/webhooks/paddle/route.ts` | 108 | High | Fulfillment trigger — validates signature, issues tokens |
| `app/api/session-token/route.ts` | 94 | Medium | Success page polling — Paddle API fallback |
| `app/api/download/[token]/route.ts` | ~80 | Medium | File delivery — verifies token, streams ZIP |
| `app/checkout-success/page.tsx` | 373 | High | User-facing post-purchase experience |
| `src/components/ui/CheckoutLink.tsx` | 133 | High | Primary checkout trigger component |
| `app/products/[slug]/page.tsx` | 225 | Medium | Product detail page |

---

## 7. DEPLOYMENT BLUEPRINT

```bash
# First deployment:
npm run build                          # Verify compilation (0 errors)
vercel --prod                          # Deploy to aikagan.com
vercel env add PADDLE_API_KEY          # Set server-side env var
vercel env add NEXT_PUBLIC_PADDLE_CLIENT_TOKEN  # Set client-side
vercel env add PADDLE_WEBHOOK_SECRET   # Set webhook secret
vercel env rm STRIPE_SECRET_KEY        # Clean up legacy
vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Clean up legacy
vercel --prod                          # Re-deploy with new env vars

# Daily operations:
vercel logs                            # Check for errors
rg "❌" app/                           # Find application errors
```

---

## 8. TESTING BLUEPRINT

```bash
# Type checking:
npm run build                          # Full compile + type check

# Manual E2E (once Paddle keys configured):
# 1. Visit https://aikagan.com
# 2. Click "Buy Now" on Starter ($29)
# 3. Verify redirect to checkout.paddle.com
# 4. Pay with test card (Paddle Sandbox)
# 5. Verify redirect back to /checkout-success?transaction_id=...
# 6. Wait for token (polls every 2s)
# 7. Click download → ZIP streams

# Edge cases:
# - Invalid product slug → 400
# - Missing PADDLE_API_KEY → 500
# - Expired token → 401 download
# - Concurrent purchases → each gets unique token
```
