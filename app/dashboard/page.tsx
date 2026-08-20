import Link from 'next/link';
import {
  ArrowRight,
  Boxes,
  FileCheck2,
  Gauge,
  LifeBuoy,
  LockKeyhole,
  Rocket,
  Sparkles,
} from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';
import { SITE } from '@/lib/constants';

const ACTIONS = [
  {
    title: 'Start a project',
    description: 'Turn an objective into a scoped execution workspace and keep the resulting assets together.',
    href: '/autonomax/',
    icon: Rocket,
    cta: 'Open AutonomaX',
  },
  {
    title: 'Use your operating system',
    description: 'Review capability gates, submit a ProductBrief, and move work through the governed execution pipeline.',
    href: '/autonomax/',
    icon: Boxes,
    cta: 'Open control plane',
  },
  {
    title: 'Verify the outcome',
    description: 'Treat generated work, fulfillment, purchases, and production state as separate evidence-backed events.',
    href: `${SITE.url}/mission-control/`,
    icon: FileCheck2,
    cta: 'View public status',
    external: true,
  },
  {
    title: 'Get support',
    description: 'Use the support channel for access, fulfillment, implementation, or product questions.',
    href: `${SITE.url}/contact/`,
    icon: LifeBuoy,
    cta: 'Contact support',
    external: true,
  },
] as const;

export default function DashboardPage() {
  return (
    <>
      <Section variant="hero">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <Badge variant="gold" className="mb-4">AutonomaX App</Badge>
            <h1 className="text-4xl font-extrabold text-kagan-white md:text-6xl">
              Your execution <span className="text-gradient">workspace</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-kagan-light">
              The app is the post-conversion product surface: activate work, generate useful outputs, keep evidence,
              and move from purchased capability to an operational result.
            </p>
          </div>

          <div className="mb-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-kagan-gold/25 bg-kagan-gold/[0.05] p-5">
              <Sparkles className="mb-4 h-5 w-5 text-kagan-gold" />
              <div className="text-sm font-bold text-kagan-white">1. Activate value</div>
              <p className="mt-2 text-sm leading-6 text-kagan-light">Start with a concrete business objective instead of browsing system internals.</p>
            </div>
            <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-5">
              <Gauge className="mb-4 h-5 w-5 text-kagan-gold" />
              <div className="text-sm font-bold text-kagan-white">2. Execute visibly</div>
              <p className="mt-2 text-sm leading-6 text-kagan-light">Move work through defined gates with explicit state and evidence.</p>
            </div>
            <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-5">
              <FileCheck2 className="mb-4 h-5 w-5 text-kagan-gold" />
              <div className="text-sm font-bold text-kagan-white">3. Keep the result</div>
              <p className="mt-2 text-sm leading-6 text-kagan-light">Treat the delivered artifact and its verification as the customer outcome.</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {ACTIONS.map((action) => {
              const Icon = action.icon;
              const body = (
                <>
                  <div className="mb-4 inline-flex rounded-xl bg-kagan-gold/10 p-3 text-kagan-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-kagan-white">{action.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-kagan-light">{action.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-kagan-gold">
                    {action.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </>
              );

              return 'external' in action && action.external ? (
                <a
                  key={action.title}
                  href={action.href}
                  className="group flex min-h-56 flex-col rounded-2xl border border-kagan-border bg-kagan-card/60 p-6 transition hover:-translate-y-0.5 hover:border-kagan-gold/40"
                >
                  {body}
                </a>
              ) : (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex min-h-56 flex-col rounded-2xl border border-kagan-border bg-kagan-card/60 p-6 transition hover:-translate-y-0.5 hover:border-kagan-gold/40"
                >
                  {body}
                </Link>
              );
            })}
          </div>
        </div>
      </Section>

      <Section variant="alt">
        <div className="mx-auto max-w-4xl rounded-3xl border border-kagan-amber/25 bg-kagan-amber/[0.05] p-7 md:p-9">
          <div className="flex items-start gap-4">
            <LockKeyhole className="mt-1 h-6 w-6 flex-none text-kagan-amber" />
            <div>
              <h2 className="text-xl font-bold text-kagan-white">Access boundary</h2>
              <p className="mt-2 leading-7 text-kagan-light">
                This workspace no longer exposes AIKAGAN revenue, investment, CRM, or internal operating metrics. Authentication
                and entitlement enforcement must be completed before customer-specific purchases, credits, files, or project data
                are rendered here.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
