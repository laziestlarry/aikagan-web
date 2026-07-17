import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import AutonomaXBlueprintConsole from '@/components/shared/AutonomaXBlueprintConsole';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'AutonomaX Control Plane',
  description:
    'Live blueprint, readiness gates, governed ProductBrief intake, agent mandates, and product-to-revenue pipeline for AutonomaX.',
  path: '/autonomax/',
});

export default function AutonomaXPage() {
  return (
    <>
      <Section variant="hero">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <Badge variant="green" className="mb-4">Blueprint v1 · Live Upgrade</Badge>
          <h1 className="text-4xl font-extrabold text-kagan-white md:text-6xl">
            Autonoma<span className="text-gradient">X Control Plane</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-kagan-light">
            A truthful operating surface for the next-generation AI organization: capability gates, durable brief intake,
            director mandates, and the governed path from discovery to paid delivery.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/mission-control/"
              className="inline-flex items-center gap-2 rounded-xl border border-kagan-gold/35 px-5 py-3 text-sm font-bold text-kagan-gold transition hover:bg-kagan-gold/10"
            >
              Mission Control <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products/"
              className="inline-flex items-center gap-2 rounded-xl bg-kagan-gold px-5 py-3 text-sm font-extrabold text-black transition hover:bg-kagan-gold-light"
            >
              Revenue offers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <AutonomaXBlueprintConsole />
      </Section>

      <Section variant="alt">
        <div className="mx-auto max-w-4xl rounded-3xl border border-kagan-gold/20 bg-kagan-gold/[0.04] p-7 md:p-10">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 flex-none text-kagan-gold" />
            <div>
              <h2 className="text-2xl font-bold text-kagan-white">Operational contract</h2>
              <p className="mt-3 leading-7 text-kagan-light">
                A queued brief is evidence of intake, not evidence of generation, publication, payment, or fulfillment.
                Each downstream state must be produced by its own verified event and release gate.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
