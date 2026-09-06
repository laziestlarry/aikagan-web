import { NextResponse } from 'next/server';
import { AUTONOMAX_BLUEPRINT, getAutonomaXReadiness } from '@/lib/autonomax-blueprint';
import { provisionQueuedCustomerSuccessPlans } from '@/lib/autonomax-briefs';
import { kvLlen } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const gates = getAutonomaXReadiness();
  const required = gates.filter((gate) => gate.required);
  const requiredReady = required.filter((gate) => gate.configured).length;
  const [queueDepth, provisionedCustomerSuccessPlans] = await Promise.all([
    kvLlen('autonomax:briefs'),
    provisionQueuedCustomerSuccessPlans(),
  ]);

  return NextResponse.json(
    {
      ok: true,
      generatedAt: new Date().toISOString(),
      blueprint: AUTONOMAX_BLUEPRINT,
      runtime: {
        state: requiredReady === required.length ? 'ready' : 'blocked',
        requiredReady,
        requiredTotal: required.length,
        queueDepth,
        provisionedCustomerSuccessPlans,
        gates,
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
