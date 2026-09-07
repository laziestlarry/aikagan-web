import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { adminUnauthorizedResponse, isAdminRequest } from '@/lib/admin-auth';
import { getAutonomaXReadiness } from '@/lib/autonomax-blueprint';
import { provisionCustomerSuccessPlan, storeQueuedBrief, type ProductBrief } from '@/lib/autonomax-briefs';
import { kvIncrBy } from '@/lib/kv';
import { clientKey, rateLimit, rateLimitResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ProductBriefInput {
  briefId?: unknown;
  category?: unknown;
  audience?: unknown;
  keywords?: unknown;
  refs?: unknown;
  successCriteria?: unknown;
}

function cleanText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function cleanList(value: unknown, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

export async function POST(req: NextRequest) {
  const limit = rateLimit({
    key: clientKey(req, 'autonomax-brief'),
    max: 5,
    windowMs: 60_000,
  });
  if (!limit.allowed) return rateLimitResponse(limit);

  const body = (await req.json().catch(() => null)) as ProductBriefInput | null;
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const requestedBriefId = cleanText(body.briefId, 64);
  if (requestedBriefId) {
    if (!isAdminRequest(req)) return adminUnauthorizedResponse();
    const provisioned = await provisionCustomerSuccessPlan(requestedBriefId);
    if (!provisioned) {
      return NextResponse.json({ error: 'Brief not found in the active retention window.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, event: 'customer.success_plan_provisioned', ...provisioned });
  }

  const category = cleanText(body.category, 120);
  const audience = cleanText(body.audience, 240);
  const keywords = cleanList(body.keywords, 12, 80);
  const refs = cleanList(body.refs, 8, 500);
  const successCriteria = cleanText(body.successCriteria, 500);

  if (!category || !audience) {
    return NextResponse.json(
      { error: 'category and audience are required.' },
      { status: 400 },
    );
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const record: ProductBrief = {
    id,
    status: 'queued',
    category,
    audience,
    keywords,
    refs,
    successCriteria,
    createdAt,
    source: 'autonomax-control-plane',
  };

  await storeQueuedBrief(record);
  await kvIncrBy('autonomax:event:product.brief_queued', 1, 30 * 24 * 60 * 60);
  const provisioned = await provisionCustomerSuccessPlan(record.id);
  const modelProviderConfigured = getAutonomaXReadiness().some(
    (gate) => gate.id === 'model-provider' && gate.configured,
  );

  return NextResponse.json(
    {
      ok: true,
      event: 'product.brief_queued',
      brief: provisioned?.brief ?? record,
      customerSuccessPlan: provisioned?.customerSuccessPlan,
      nextAction: modelProviderConfigured
        ? 'Customer Success Plan is ready for operator review. A configured model provider may be used only through an approved generation workflow.'
        : 'Customer Success Plan is ready for operator review. AI draft generation remains unavailable until a model provider is configured.',
    },
    { status: 202 },
  );
}
