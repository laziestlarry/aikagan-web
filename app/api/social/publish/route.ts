import { NextRequest, NextResponse } from 'next/server';
import { publishToNetwork, type SocialNetwork } from '@/lib/social/connectors';

const supported: SocialNetwork[] = ['linkedin', 'x', 'facebook', 'instagram'];

export async function POST(req: NextRequest) {
  const adminSecret = process.env.SOCIAL_PUBLISH_ADMIN_SECRET;
  const supplied = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!adminSecret || supplied !== adminSecret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { networks, text, url, imageUrl } = await req.json();
  const requested = Array.isArray(networks) ? networks.filter((n): n is SocialNetwork => supported.includes(n)) : [];
  if (!text || requested.length === 0) {
    return NextResponse.json({ error: 'text and at least one supported network are required' }, { status: 400 });
  }
  if (requested.includes('instagram') && !imageUrl) {
    return NextResponse.json({ error: 'imageUrl is required for Instagram publishing' }, { status: 400 });
  }

  const results = await Promise.allSettled(
    requested.map((network) => publishToNetwork(network, { text, url, imageUrl })),
  );
  return NextResponse.json({
    ok: results.some((r) => r.status === 'fulfilled'),
    results: results.map((r, i) => r.status === 'fulfilled'
      ? r.value
      : { network: requested[i], error: r.reason instanceof Error ? r.reason.message : String(r.reason) }),
  });
}
