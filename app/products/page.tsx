import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText, Lock, Shield, ShoppingCart, Sparkles, Zap } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import ProductCard from '@/components/shared/ProductCard';
import CTA from '@/components/ui/CTA';
import { products } from '@/lib/products';

export const metadata: Metadata = buildMetadata({
  title: 'Products',
  description:
    'AutonomaX Masterclass Starter, Pro, and Commander packs with verified hosted checkout and Golden Delivery. Custom venture blueprint work is available by request.',
  path: '/products/',
});

const FREE_SLUGS = ['weekly-operating-map', 'builder-starter-checklist', 'golden-delivery-sample'];
const FEATURED_SLUG = 'masterclass-pro';
const OTHER_PAID_SLUGS = ['masterclass-starter', 'masterclass-commander'];
const CUSTOM_SERVICE_SLUG = 'ai-venture-launch-blueprint';

export default function ProductsPage() {
  const freeProducts = FREE_SLUGS.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as typeof products;
  const featuredProduct = products.find((product) => product.slug === FEATURED_SLUG);
  const paidProducts = OTHER_PAID_SLUGS.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as typeof products;
  const customService = products.find((product) => product.slug === CUSTOM_SERVICE_SLUG);

  return (
    <>
      <Section variant="hero">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-kagan-white md:text-5xl">
            Products & <span className="text-gradient">Offers</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-kagan-light">
            Start with Pro for the complete revenue-operations toolkit, choose Starter for a focused first-sale system,
            or Commander for the full licensing and scale architecture.
          </p>
        </div>

        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
          ⚜ Free Gifts — Instant Download ⚜
        </h2>
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {freeProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/free/${product.slug}`}
              className="block rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.04] p-7 transition-colors hover:border-emerald-400/60 hover:bg-emerald-400/[0.07]"
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  {product.tier}
                </span>
                <span className="font-extrabold text-emerald-300">FREE</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-kagan-white">{product.name}</h3>
              <p className="mb-4 text-sm text-kagan-light">{product.description}</p>
              <ul className="mb-5 space-y-1.5 text-sm text-kagan-light">
                {(product.bullets ?? []).slice(0, 4).map((bullet) => (
                  <li key={bullet} className="flex gap-2"><span className="text-emerald-300">✓</span>{bullet}</li>
                ))}
              </ul>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-300">
                Send it to my email →
              </span>
            </Link>
          ))}
        </div>

        {featuredProduct ? (
          <div className="mb-16">
            <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-kagan-gold">
              ⚜ Recommended ProfitOS Pack — Verified Checkout ⚜
            </h2>
            <div className="mx-auto max-w-3xl">
              <ProductCard
                slug={featuredProduct.slug}
                name={featuredProduct.name}
                category={featuredProduct.tier}
                price={`$${featuredProduct.price}`}
                originalPrice={String(featuredProduct.originalPrice)}
                description={featuredProduct.description}
                includes={featuredProduct.bullets}
                badge={featuredProduct.badge ?? 'Recommended'}
                checkoutUrl={featuredProduct.checkoutUrl ?? undefined}
                featured
              />
            </div>
          </div>
        ) : null}

        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-kagan-gold">
          ⚜ Other Masterclass Levels ⚜
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {paidProducts.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              name={product.name}
              category={product.tier}
              price={`$${product.price}`}
              originalPrice={String(product.originalPrice)}
              description={product.description}
              includes={product.bullets}
              badge={product.badge ?? 'Available'}
              checkoutUrl={product.checkoutUrl ?? undefined}
            />
          ))}
        </div>

        {customService ? (
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-sky-300/25 bg-sky-300/[0.04] p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Custom service — availability by request</p>
                <h2 className="mt-2 text-2xl font-bold text-kagan-white">{customService.name}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-kagan-light">
                  {customService.description} This service is not presented as an instant checkout until it receives its own verified provider product and intake workflow.
                </p>
              </div>
              <Link
                href={`/products/${customService.slug}`}
                className="shrink-0 rounded-lg border border-sky-300/40 px-5 py-3 text-center text-sm font-semibold text-sky-200 transition hover:bg-sky-300/10"
              >
                View service details
              </Link>
            </div>
          </div>
        ) : null}
      </Section>

      <Section variant="alt">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-kagan-white">How It Works</h2>
            <p className="text-sm text-kagan-light">From offer selection to verified delivery</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: ShoppingCart,
                title: 'Choose Your Offer',
                body: 'Select Starter, Pro, or Commander according to the operating depth and license rights you need.',
                accent: 'text-amber-300',
                border: 'border-amber-300/20',
              },
              {
                icon: Lock,
                title: 'Complete Checkout',
                body: 'The site records checkout intent and redirects only to a product-specific payment page verified by the production gate.',
                accent: 'text-emerald-300',
                border: 'border-emerald-300/20',
              },
              {
                icon: Download,
                title: 'Receive Delivery',
                body: 'Provider-confirmed purchases enter the ledger, fulfillment queue, email handoff, and secure Golden Delivery process.',
                accent: 'text-purple-300',
                border: 'border-purple-300/20',
              },
            ].map(({ icon: Icon, title, body, accent, border }) => (
              <div key={title} className={`rounded-2xl border ${border} bg-black/20 p-6`}>
                <Icon className={`h-6 w-6 ${accent}`} />
                <h3 className="mt-4 text-lg font-bold text-kagan-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-kagan-light">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-kagan-light/50">
            <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-400/60" /> Published refund terms</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-400/60" /> Verified hosted checkout</span>
            <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-purple-400/60" /> Signed delivery access</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-amber-400/60" /> No subscription required</span>
          </div>
        </div>
      </Section>

      <Section>
        <CTA
          title="Ready to Start?"
          subtitle="Choose a mapped Masterclass pack and continue through the verified hosted checkout path."
          primaryLabel="Start with Pro — $79"
          primaryHref="/products/masterclass-pro/"
          secondaryLabel="Or grab a free gift"
          secondaryHref="/free/golden-delivery-sample/"
        />
      </Section>
    </>
  );
}
