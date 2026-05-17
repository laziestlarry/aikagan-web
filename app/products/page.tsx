import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import ProductCard from '@/components/shared/ProductCard';
import CTA from '@/components/ui/CTA';
import { products } from '@/lib/products';

export const metadata: Metadata = buildMetadata({
  title: 'Products',
  description:
    'Downloadable AI packs, consulting packages, and automation bundles — priced for operators, built for production.',
  path: '/products/',
});

export default function ProductsPage() {
  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Products & <span className="text-gradient">Offers</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Packs, audits, bundles, and blueprints — each one delivers immediate value, not filler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
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
              featured={product.slug === 'golden-delivery-pro'}
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
          subtitle="All purchases are instant downloads. You'll receive your files immediately after checkout."
          primaryLabel="Start with Starter — $29"
          primaryHref="/products/golden-delivery-starter/"
          secondaryLabel="Explore Services"
          secondaryHref="/services/"
        />
      </Section>
    </>
  );
}
