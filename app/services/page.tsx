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
    'AI automation, e-commerce conversion, deployment, orchestration, Golden Delivery, and revenue-operations implementation — scoped around measurable outcomes and verified delivery.',
  path: '/services/',
});

export default function ServicesPage() {
  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300 mb-4">Implementation requests are live</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            What We <span className="text-gradient">Deliver</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Five service lines built around production work, measurable acceptance criteria, and evidence-backed delivery. Scope is agreed before implementation begins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc) => (
            <ServiceCard key={svc.id} {...svc} />
          ))}
        </div>
      </Section>

      <Section variant="default">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-kagan-white mb-4">
            Implementation Offers & <span className="text-gradient">Build Paths</span>
          </h2>
          <p className="text-lg text-kagan-light max-w-3xl mx-auto">
            These offer families remain available for scoping and implementation requests. Self-serve paid checkout stays gated until each product, payment, fulfillment, and delivery path is verified end to end.
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
              <Link
                href="/contact/"
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-kagan-gold/10 text-kagan-gold border border-kagan-gold/20 hover:bg-kagan-gold/20 transition-all text-sm font-semibold"
              >
                Request scope →
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="alt">
        <CTA
          title="Not Sure Where to Start?"
          subtitle="Start with one real bottleneck. We will diagnose it, rank the next mission, define the acceptance criteria, and only then decide whether implementation is justified."
          primaryLabel="Request Mission Scope"
          primaryHref="/contact/"
          secondaryLabel="See Flight 002"
          secondaryHref="/flight/"
        />
      </Section>
    </>
  );
}
