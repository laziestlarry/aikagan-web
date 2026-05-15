import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import ServiceCard from '@/components/shared/ServiceCard';
import CTA from '@/components/ui/CTA';
import { SERVICES } from '@/lib/constants';

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description:
    'AI automation, e-commerce conversion, deployment, orchestration, and Golden Delivery — end-to-end execution for serious operators.',
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
