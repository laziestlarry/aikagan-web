import { NextRequest, NextResponse } from 'next/server';
import { issueOauthSetupTicket } from '@/lib/social/token-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Provider = 'linkedin' | 'meta';

export async function POST(req: NextRequest) {
  const adminSecret = process.env.SOCIAL_PUBLISH_ADMIN_SECRET;
  const supplied = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!adminSecret || supplied !== adminSecret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as { provider?: Provider } | null;
  if (!body?.provider || !['linkedin', 'meta'].includes(body.provider)) {
    return NextResponse.json({ error: 'provider must be linkedin or meta' }, { status: 400 });
  }

  const ticket = await issueOauthSetupTicket(body.provider);
  const url = new URL(`/api/social/oauth/${body.provider}`, req.nextUrl.origin);
  url.searchParams.set('setup', ticket);
  return NextResponse.json({ ok: true, provider: body.provider, url: url.toString(), expiresInSeconds: 300 });
}
