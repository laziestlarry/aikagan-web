import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAutonomaXReadiness } from '@/lib/autonomax-blueprint';
import { kvIncrBy, kvLpush } from '@/lib/kv';
import { clientKey, rateLimit, rateLimitResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ProductBriefInput {
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
  const record = {
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

  await kvLpush('autonomax:briefs', JSON.stringify(record), 30 * 24 * 60 * 60);
  await kvIncrBy('autonomax:event:product.brief_queued', 1, 30 * 24 * 60 * 60);

  const modelReady = getAutonomaXReadiness().find(
    (gate) => gate.id === 'model-provider',
  )?.configured;

  return NextResponse.json(
    {
      ok: true,
      event: 'product.brief_queued',
      brief: record,
      nextAction: modelReady
        ? 'Draft generation may be dispatched by the configured orchestrator.'
        : 'Brief is stored, but generation remains blocked until a model provider is configured.',
    },
    { status: 202 },
  );
}
