import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import ServiceCard from '@/components/shared/ServiceCard';
import CTA from '@/components/ui/CTA';
import { SERVICES, PROJECT_OFFERS } from '@/lib/constants';
import Link from 'next/link';

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description:
    'AI automation, e-commerce conversion, deployment, orchestration, Golden Delivery, freelance project offers, digital products, and passive income — end-to-end execution for serious operators.',
  path: '/services/',
});

export default function ServicesPage() {
  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            What We <span className="text-gradient">Deliver</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Five service lines — each one built for production, measured by conversion, and backed by real delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc) => (
            <ServiceCard key={svc.id} {...svc} />
          ))}
        </div>
      </Section>

      {/* Project Offers & Side Hustles */}
      <Section variant="default">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-kagan-white mb-4">
            Project Offers & <span className="text-gradient">Side Hustles</span>
          </h2>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Freelance services, digital products, and passive income streams — available for immediate purchase or hire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECT_OFFERS.map((offer) => (
            <div key={offer.id} className="bg-kagan-card border border-kagan-border/60 rounded-2xl p-6 hover:border-kagan-gold/30 transition-all">
              <p className="text-xs font-semibold uppercase tracking-wider text-kagan-muted mb-2">{offer.subtitle}</p>
              <h3 className="text-xl font-bold text-kagan-white mb-3">{offer.title}</h3>
              <p className="text-sm text-kagan-light mb-4">{offer.description}</p>
              <ul className="space-y-1.5 mb-6">
                {offer.features.map((f) => (
                  <li key={f} className="text-sm text-kagan-muted flex items-start gap-2">
                    <span className="text-kagan-gold mt-0.5">•</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href={offer.ctaUrl}
                target={offer.ctaUrl.startsWith('http') ? '_blank' : undefined}
                rel={offer.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-kagan-gold/10 text-kagan-gold border border-kagan-gold/20 hover:bg-kagan-gold/20 transition-all text-sm font-semibold"
              >
                {offer.cta} →
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="alt">
        <CTA
          title="Not Sure Where to Start?"
          subtitle="Most projects begin with a structured intake and architecture review. Tell us what you're building — we'll map the path."
          primaryLabel="Request Consultation"
          primaryHref="/contact/"
          secondaryLabel="View Products"
          secondaryHref="/products/"
        />
      </Section>
    </>
  );
}
