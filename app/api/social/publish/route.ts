import { NextRequest, NextResponse } from 'next/server';
import { publishToNetwork, type SocialNetwork } from '@/lib/social/connectors';
import { kvLpush } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supported: SocialNetwork[] = ['linkedin', 'x', 'facebook', 'instagram'];

export async function POST(req: NextRequest) {
  const adminSecret = process.env.SOCIAL_PUBLISH_ADMIN_SECRET;
  const supplied = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!adminSecret || supplied !== adminSecret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { networks, text, url, imageUrl, campaign } = await req.json();
  const requested = Array.isArray(networks) ? networks.filter((n): n is SocialNetwork => supported.includes(n)) : [];
  if (typeof text !== 'string' || !text.trim() || requested.length === 0) {
    return NextResponse.json({ error: 'text and at least one supported network are required' }, { status: 400 });
  }
  if (text.length > 5000) {
    return NextResponse.json({ error: 'text exceeds 5000 characters' }, { status: 400 });
  }
  if (requested.includes('instagram') && !imageUrl) {
    return NextResponse.json({ error: 'imageUrl is required for Instagram publishing' }, { status: 400 });
  }

  const campaignId = typeof campaign === 'string' && campaign.trim() ? campaign.trim().slice(0, 120) : 'autonomax_social';
  const results = await Promise.allSettled(
    requested.map((network) => publishToNetwork(network, { text: text.trim(), url, imageUrl, campaign: campaignId })),
  );

  const normalized = results.map((r, i) => r.status === 'fulfilled'
    ? r.value
    : { network: requested[i], error: r.reason instanceof Error ? r.reason.message : String(r.reason) });

  const event = {
    at: new Date().toISOString(),
    campaign: campaignId,
    requested,
    destination: typeof url === 'string' ? url : null,
    results: normalized.map((item) => ({
      network: item.network,
      status: 'status' in item ? item.status : null,
      postId: 'postId' in item ? item.postId : null,
      error: 'error' in item ? item.error : null,
    })),
  };
  await kvLpush('social:publish:events', JSON.stringify(event), 30 * 24 * 60 * 60).catch(() => undefined);

  return NextResponse.json({
    ok: results.some((r) => r.status === 'fulfilled'),
    campaign: campaignId,
    results: normalized,
  });
}
