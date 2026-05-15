import Section from '@/components/ui/Section';
import { Layers, Cpu, RefreshCw, Gauge } from 'lucide-react';

const VALUES = [
  {
    icon: Cpu,
    title: 'AI-Native Architecture',
    description:
      'Every system is designed around autonomous agents, not bolted-on chatbots. Real orchestration, real results.',
  },
  {
    icon: Layers,
    title: 'Full-Stack Execution',
    description:
      'Strategy, architecture, build, deploy, operate. We don\'t hand you a report — we run the infrastructure.',
  },
  {
    icon: RefreshCw,
    title: 'Continuous Delivery',
    description:
      'Weekly shipping cadence. Every engagement moves forward every week. No black boxes, no disappearing acts.',
  },
  {
    icon: Gauge,
    title: 'Measured by Conversion',
    description:
      'We optimize for revenue, not vanity metrics. Every pipeline is measured against real commercial outcomes.',
  },
];

export default function ValueProposition() {
  return (
    <Section variant="alt">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-kagan-white mb-4">
          How The Kaganate Operates
        </h2>
        <p className="text-kagan-light text-lg max-w-2xl mx-auto">
          Four principles that define every engagement — from audit to full Golden Delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {VALUES.map((v) => (
          <div
            key={v.title}
            className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 hover:border-kagan-gold/30 transition-colors duration-300"
          >
            <div className="p-2.5 rounded-lg bg-kagan-gold/10 border border-kagan-gold/20 inline-block mb-4">
              <v.icon className="h-5 w-5 text-kagan-gold" />
            </div>
            <h3 className="text-base font-semibold text-kagan-white mb-2">{v.title}</h3>
            <p className="text-sm text-kagan-light leading-relaxed">{v.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
