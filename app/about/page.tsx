import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import CTA from '@/components/ui/CTA';
import { Zap, Cpu, ShoppingCart } from 'lucide-react';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description:
    'The story behind AutonomaX Profit OS: from scattered tools to one measurable revenue operations system.',
  path: '/about/',
});

const SYSTEMS = [
  {
    icon: Cpu,
    name: 'AutonomaX',
    description:
      'The AI automation engine. Autonomous agent pipelines that handle data ingestion, decision routing, content generation, and operational workflows — all orchestrated with observability and safety guardrails.',
  },
  {
    icon: ShoppingCart,
    name: 'ProPulse',
    description:
      'The e-commerce conversion system. AI-driven product page optimization, dynamic offer routing, cart recovery intelligence, and LTV modeling — built to move revenue needles, not vanity metrics.',
  },
  {
    icon: Zap,
    name: 'Golden Delivery',
    description:
      'The done-for-you execution layer. Full-stack design, build, deploy, and operate. Weekly delivery cadence, SLA-backed uptime, and a dedicated ops team running your AI commerce infrastructure.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            About <span className="text-gradient">AutonomaX</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            A brief history of the systems, the operator, and the mission.
          </p>
        </div>

        {/* Kagan / Lazy Larry */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="border-kagan-gold/20">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-kagan-gold/10 border border-kagan-gold/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-kagan-gold">K</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-kagan-white">Kagan</h2>
                  <Badge variant="gold">Lazy Larry</Badge>
                </div>
                <p className="text-kagan-light leading-relaxed mb-4">
                  Also known as <strong className="text-kagan-white">Lazy Larry</strong> — a systems architect
                  and AI infrastructure operator who builds autonomous commerce engines. The name is ironic: the
                  systems do the heavy lifting, but someone has to design them right.
                </p>
                <p className="text-kagan-light leading-relaxed">
                  AutonomaX is the public operating surface — a collection of integrated AI
                  systems (AutonomaX, ProPulse) and the Golden Delivery execution methodology. Every system
                  is battle-tested against real commercial requirements: conversion, uptime, observability,
                  and continuous delivery.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Systems */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-kagan-white mb-8 text-center">
            The Systems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SYSTEMS.map((sys) => (
              <Card key={sys.name} hover>
                <div className="p-3 rounded-lg bg-kagan-gold/10 border border-kagan-gold/20 inline-block mb-4">
                  <sys.icon className="h-6 w-6 text-kagan-gold" />
                </div>
                <h3 className="text-lg font-bold text-kagan-white mb-3">{sys.name}</h3>
                <p className="text-sm text-kagan-light leading-relaxed">{sys.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="alt">
        <CTA
          title="Work With AutonomaX"
          subtitle="Direct access to Kagan for architecture reviews, strategy sessions, and AI infrastructure deployment."
          primaryLabel="Start Project"
          primaryHref="/contact/"
          secondaryLabel="View Services"
          secondaryHref="/services/"
        />
      </Section>
    </>
  );
}
