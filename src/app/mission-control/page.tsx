import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import ProcessStages from '@/components/shared/ProcessStages';
import CTA from '@/components/ui/CTA';
import Badge from '@/components/ui/Badge';
import { Activity, BarChart3, Clock, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = buildMetadata({
  title: 'Mission Control',
  description:
    'The Kaganate operating process — from intake through architecture, build, Golden Delivery, and ongoing operations.',
  path: '/mission-control/',
});

const STATS = [
  { label: 'Active Pipelines', value: '12+', icon: Activity },
  { label: 'Avg. Delivery Cycle', value: '7 Days', icon: Clock },
  { label: 'SLA Uptime', value: '99.9%', icon: ShieldCheck },
  { label: 'Conversion Lift', value: '3.2× avg', icon: BarChart3 },
];

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

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5 text-center"
            >
              <stat.icon className="h-5 w-5 text-kagan-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-kagan-white mb-1 font-mono">{stat.value}</div>
              <div className="text-xs text-kagan-muted">{stat.label}</div>
            </div>
          ))}
        </div>

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
