import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink as ExtIcon } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/constants';
import Section from '@/components/ui/Section';
import ProcessStages from '@/components/shared/ProcessStages';
import LiveKPIs from '@/components/shared/LiveKPIs';
import CTA from '@/components/ui/CTA';
import Badge from '@/components/ui/Badge';
import CRMPipeline from '@/components/shared/CRMPipeline';

export const metadata: Metadata = buildMetadata({
  title: 'Mission Control',
  description:
    'Where you are in the AutonomaX customer journey — discover, try, buy, execute, support. Plus live operational KPIs and our 6-stage delivery process.',
  path: '/mission-control/',
});

const JOURNEY = [
  { n: '1', label: 'Discover',  body: 'Land on the site. Read the offer. Decide if the toolkit fits.',                   href: '/',                                         linkLabel: 'Home →' },
  { n: '2', label: 'Try free',  body: 'Grab one of the 3 free gifts — instant email-gated download, no card.',             href: '/free/golden-delivery-sample',              linkLabel: 'Grab a gift →' },
  { n: '3', label: 'Buy',       body: 'Upgrade to a Masterclass tier (Starter $29 · Pro $79 · Commander $149).',           href: '/products/masterclass-starter',             linkLabel: 'See the offer →' },
  { n: '4', label: 'Execute',   body: 'Open START_HERE inside the ZIP. Follow the day-by-day blueprint. Ship.',            href: '/products/masterclass-starter',             linkLabel: 'Sample plan →' },
  { n: '5', label: 'Support',   body: 'Stuck? Email us. We answer within 24 hours. Refund window stays open 30 days.',     href: '/contact',                                  linkLabel: 'Contact →' },
  { n: '6', label: 'Upgrade',   body: 'Ready for the full system? The Autonoma-X Platform runs 24/7 AI operations for your business.', href: 'https://app.aikagan.com', linkLabel: 'Open Platform →', external: true },
];

export default function MissionControlPage() {
  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-10">
          <Badge variant="green" className="mb-4">Operational · Transparent</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Mission <span className="text-gradient">Control</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Where you are in the AutonomaX customer journey — and what we are doing in the background to support you.
          </p>
        </div>

        {/* ── Customer journey breadcrumb ─────────────────────────────────── */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-6 uppercase">
            ⚜ Customer Journey ⚜
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {JOURNEY.map((s, i) => {
              const isExternal = 'external' in s && s.external;
              const content = (
                <>
                  {i < JOURNEY.length - 1 && (
                    <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-kagan-gold/40 text-lg">→</span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-kagan-gold/40 text-xs font-bold text-kagan-gold">
                      {s.n}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-kagan-white">
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-kagan-light leading-relaxed">{s.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs text-kagan-gold/80 group-hover:text-kagan-gold">
                    {s.linkLabel}
                    {isExternal && <ExtIcon className="h-3 w-3" />}
                  </span>
                </>
              );
              if (isExternal) {
                return (
                  <a
                    key={s.n}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex flex-col items-start gap-2 rounded-xl border border-kagan-amber/30 bg-kagan-amber/[0.06] p-4 hover:border-kagan-gold/60 hover:bg-kagan-gold/[0.08] transition-colors group"
                  >
                    {content}
                  </a>
                );
              }
              return (
                <Link
                  key={s.n}
                  href={s.href}
                  className="relative flex flex-col items-start gap-2 rounded-xl border border-kagan-gold/20 bg-kagan-gold/[0.04] p-4 hover:border-kagan-gold/60 hover:bg-kagan-gold/[0.08] transition-colors group"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Live operational KPIs (revenue-ops backend) ─────────────────── */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-2 uppercase">
            ⚜ Live KPIs — Operational Transparency ⚜
          </h2>
          <p className="text-center text-xs text-kagan-light mb-6 max-w-xl mx-auto">
            Updated every 30 seconds from our revenue-ops backend. We publish these so you can see the operation is real and accountable before you spend a dollar.
          </p>
          <LiveKPIs />
        </div>

        {/* ── CRM pipeline (FastAPI backend) ──────────────────────────────── */}
        <CRMPipeline />

        {/* ── 6-stage delivery process ────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-6 uppercase">
            ⚜ How We Ship — 6-Stage Delivery Process ⚜
          </h2>
          <ProcessStages />
        </div>
      </Section>

      <Section variant="alt">
        <CTA
          title="Initiate a Mission"
          subtitle="Three paths: grab a free gift to test-drive the system, jump to the Masterclass toolkits, or open the full platform for autonomous operations."
          primaryLabel="Start with Starter — $29"
          primaryHref="/products/masterclass-starter/"
          secondaryLabel="Open Platform"
          secondaryHref={SITE.appUrl}
        />
        <div className="text-center mt-6">
          <Link
            href="/free/golden-delivery-sample/"
            className="text-sm text-kagan-gold hover:text-kagan-gold-light transition-colors"
          >
            Or grab a free gift first →
          </Link>
        </div>
      </Section>
    </>
  );
}
