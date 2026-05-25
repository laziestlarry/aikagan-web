import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import ProductCard from '@/components/shared/ProductCard';
import CTA from '@/components/ui/CTA';
import { products } from '@/lib/products';

export const metadata: Metadata = buildMetadata({
  title: 'Products',
  description:
    'Three Masterclass tiers — Starter $29, Pro $79, Commander $149 — each bundling the matching Golden Delivery pack. Plus three free gifts on email opt-in.',
  path: '/products/',
});

const FREE_SLUGS = ['weekly-operating-map', 'builder-starter-checklist', 'golden-delivery-sample'];
const PAID_SLUGS = ['masterclass-starter', 'masterclass-pro', 'masterclass-commander'];

export default function ProductsPage() {
  const freeProducts = FREE_SLUGS.map(s => products.find(p => p.slug === s)).filter(Boolean) as typeof products;
  const paidProducts = PAID_SLUGS.map(s => products.find(p => p.slug === s)).filter(Boolean) as typeof products;

  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Products & <span className="text-gradient">Offers</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Three Masterclass tiers — each bundles the matching Golden Delivery pack as a bonus.
            Three free gifts up top — email entry, instant download.
          </p>
        </div>

        {/* ── Free Gifts ─────────────────────────────────────── */}
        <h2 className="text-xs font-bold tracking-[0.25em] text-emerald-400 text-center mb-6 uppercase">
          ⚜ Free Gifts — Instant Download ⚜
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {freeProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/free/${product.slug}`}
              className="block rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.04] p-7 hover:border-emerald-400/60 hover:bg-emerald-400/[0.07] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  {product.tier}
                </span>
                <span className="text-emerald-300 font-extrabold">FREE</span>
              </div>
              <h3 className="text-xl font-bold text-kagan-white mb-2">{product.name}</h3>
              <p className="text-sm text-kagan-light mb-4">{product.description}</p>
              <ul className="space-y-1.5 text-sm text-kagan-light mb-5">
                {(product.bullets ?? []).slice(0, 4).map((b) => (
                  <li key={b} className="flex gap-2"><span className="text-emerald-300">✓</span>{b}</li>
                ))}
              </ul>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-300">
                Send it to my email →
              </span>
            </Link>
          ))}
        </div>

        {/* ── Paid Masterclass ────────────────────────────────── */}
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-6 uppercase">
          ⚜ AutonomaX Masterclass — Pick Your Level ⚜
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              badge={product.badge}
              checkoutUrl={product.checkoutUrl}
              featured={product.slug === 'masterclass-pro'}
            />
          ))}
        </div>
      </Section>

      <Section variant="alt">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-kagan-white mb-6">How It Works</h2>
          <div className="space-y-4">
            {[
              {
                n: '1',
                title: 'Choose Your Offer',
                body: 'Select the pack, audit, or bundle that matches where you are. Need guidance? Book a call.',
              },
              {
                n: '2',
                title: 'Complete Checkout',
                body: 'Secure one-time payment. Instant access. No subscriptions, no upsell traps.',
              },
              {
                n: '3',
                title: 'Receive Delivery',
                body: 'Downloads delivered instantly. Audits and bundles delivered on a defined timeline with weekly updates.',
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-kagan-gold/10 border border-kagan-gold/20 flex items-center justify-center text-kagan-gold font-bold text-sm">
                  {n}
                </div>
                <div>
                  <h3 className="font-semibold text-kagan-white mb-1">{title}</h3>
                  <p className="text-sm text-kagan-light">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <CTA
          title="Ready to Purchase?"
          subtitle="All purchases are instant downloads via in-domain checkout. You'll receive your files immediately."
          primaryLabel="Start with Starter — $29"
          primaryHref="/products/masterclass-starter/"
          secondaryLabel="Or grab a free gift"
          secondaryHref="/free/golden-delivery-sample/"
        />
      </Section>
    </>
  );
}
