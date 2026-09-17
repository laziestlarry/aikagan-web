// app/api/creator-hub/campaigns/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/kv';

export interface CampaignWaveItem {
  id: string;
  wave: number;
  platform: string;
  copy: string;
  mediaPrompt?: string;
  ctaUrl: string;
  status: 'draft' | 'approved' | 'scheduled' | 'published';
  scheduledTime?: string;
}

export async function GET(req: NextRequest) {
  const wave = req.nextUrl.searchParams.get('wave') || '1';
  const cacheKey = `creator_hub:wave:${wave}`;
  
  let waveItems = await kvGet<CampaignWaveItem[]>(cacheKey);
  
  if (!waveItems) {
    // Initialize default wave queue from Marketing Commander backlog
    waveItems = [
      {
        id: 'item-101',
        wave: parseInt(wave),
        platform: 'X',
        copy: 'Stop paying monthly SaaS rent for simple software. Own your revenue stack.',
        ctaUrl: 'https://aikagan.com/products/masterclass-starter?utm_source=x&utm_medium=creator_hub',
        status: 'approved'
      },
      {
        id: 'item-102',
        wave: parseInt(wave),
        platform: 'LinkedIn',
        copy: 'Why 80% of AI automation projects fail: The E0 to E5 evidence gap explained.',
        ctaUrl: 'https://aikagan.com/tools/revenue-leak-scan?utm_source=linkedin&utm_medium=creator_hub',
        status: 'draft'
      }
    ];
    await kvSet(cacheKey, waveItems, 86400);
  }

  return NextResponse.json({ ok: true, wave: parseInt(wave), items: waveItems });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, wave, status } = body;

  if (!id || !wave || !status) {
    return NextResponse.json({ ok: false, error: 'Missing required parameters' }, { status: 400 });
  }

  const cacheKey = `creator_hub:wave:${wave}`;
  const waveItems = (await kvGet<CampaignWaveItem[]>(cacheKey)) || [];
  
  const updated = waveItems.map(item => item.id === id ? { ...item, status } : item);
  await kvSet(cacheKey, updated, 86400);

  return NextResponse.json({ ok: true, updatedItem: updated.find(i => i.id === id) });
}