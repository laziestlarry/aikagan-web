import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import ProductCard from '@/components/shared/ProductCard';
import CTA from '@/components/ui/CTA';
import { PRODUCTS } from '@/lib/constants';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              featured={product.id === 'golden-bundle'}
            />
          ))}
        </div>
      </Section>

      <Section variant="alt">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-kagan-white mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-kagan-gold/10 border border-kagan-gold/20 flex items-center justify-center text-kagan-gold font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold text-kagan-white mb-1">Choose Your Offer</h3>
                <p className="text-sm text-kagan-light">
                  Select the pack, audit, or bundle that matches where you are. Need guidance? Book a call.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-kagan-gold/10 border border-kagan-gold/20 flex items-center justify-center text-kagan-gold font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold text-kagan-white mb-1">Complete Intake</h3>
                <p className="text-sm text-kagan-light">
                  Fill out a brief form so we understand your stack, goals, and timeline. No endless discovery calls.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-kagan-gold/10 border border-kagan-gold/20 flex items-center justify-center text-kagan-gold font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold text-kagan-white mb-1">Receive Delivery</h3>
                <p className="text-sm text-kagan-light">
                  Downloads delivered instantly. Audits and bundles delivered on a defined timeline with weekly updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <CTA
          title="Ready to Purchase?"
          subtitle="All purchases start with a brief intake to ensure the right fit. You'll hear back within one business day."
          primaryLabel="Inquire Now"
          primaryHref="/contact/"
          secondaryLabel="Explore Services"
          secondaryHref="/services/"
        />
      </Section>
    </>
  );
}
