import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import ProcessStages from '@/components/shared/ProcessStages';
import LiveKPIs from '@/components/shared/LiveKPIs';
import CTA from '@/components/ui/CTA';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = buildMetadata({
  title: 'Mission Control',
  description:
    'The Kaganate operating process \u2014 from intake through architecture, build, Golden Delivery, and ongoing operations.',
  path: '/mission-control/',
});

export default function MissionControlPage() {
  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-14">
          <Badge variant="green" className="mb-4">Operational</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Mission <span className="text-gradient">Control</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Every engagement follows a proven six-stage process. This is how The Kaganate ships.
          </p>
        </div>

        {/* Live KPI tiles \u2014 hydrates with live data from autonomax revenue ops */}
        <LiveKPIs />

        {/* Process stages */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-kagan-white mb-8 text-center">
            Delivery Process
          </h2>
          <ProcessStages />
        </div>
      </Section>

      <Section variant="alt">
        <CTA
          title="Initiate a Mission"
          subtitle="Submit your project request and enter The Kaganate delivery pipeline. First response within 48 hours."
          primaryLabel="Start Project"
          primaryHref="/contact/"
          secondaryLabel="Explore Services"
          secondaryHref="/services/"
        />
      </Section>
    </>
  );
}
