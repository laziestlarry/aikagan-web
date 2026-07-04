import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingCart, Lock, Download, Sparkles, Shield, Zap, FileText } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-kagan-white mb-2">How It Works</h2>
            <p className="text-sm text-kagan-light">From zero to operational in three steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShoppingCart,
                title: 'Choose Your Offer',
                body: 'Select the pack, audit, or bundle that matches where you are. Need guidance? Book a call.',
                accent: 'text-amber-300',
                bgGlow: 'from-amber-300/5',
                borderGlow: 'border-amber-300/20 hover:border-amber-300/40',
              },
              {
                icon: Lock,
                title: 'Complete Checkout',
                body: 'Secure one-time payment via Paddle. Instant access. No subscriptions, no upsell traps.',
                accent: 'text-emerald-300',
                bgGlow: 'from-emerald-300/5',
                borderGlow: 'border-emerald-300/20 hover:border-emerald-300/40',
              },
              {
                icon: Download,
                title: 'Receive Delivery',
                body: 'Digital packs download instantly. Audits and bundles delivered on a defined timeline with weekly updates.',
                accent: 'text-purple-300',
                bgGlow: 'from-purple-300/5',
                borderGlow: 'border-purple-300/20 hover:border-purple-300/40',
              },
            ].map(({ icon: Icon, title, body, accent, bgGlow, borderGlow }) => (
              <div
                key={title}
                className={`group relative rounded-2xl border ${borderGlow} bg-gradient-to-b ${bgGlow} to-transparent p-6 transition-all duration-200 hover:-translate-y-0.5`}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b ${bgGlow} blur-xl pointer-events-none`} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${borderGlow.replace('hover:', '')} bg-black/40 ${accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.15em] text-kagan-light/60 font-medium">
                      Step {['Choose', 'Complete', 'Receive'].indexOf(title.split(' ')[0]) + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-kagan-white mb-2">{title}</h3>
                  <p className="text-sm text-kagan-light leading-relaxed">{body}</p>
                </div>
                {/* Subtle corner decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden opacity-20">
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-2xl border-b border-l border-current opacity-40" />
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip under steps */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-kagan-light/50">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400/60" /> 30-Day Guarantee
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400/60" /> Instant Digital Delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-purple-400/60" /> Download Links Valid 48h
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400/60" /> No Subscription Required
            </span>
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
