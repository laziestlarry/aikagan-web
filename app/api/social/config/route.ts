import { NextRequest, NextResponse } from 'next/server';
import { getLinkedInAppConfig, getMetaAppConfig, setSocialAppConfig, socialAdminSecret } from '@/lib/social/config-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorized(req: NextRequest) {
  const secret = socialAdminSecret();
  const supplied = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return Boolean(secret && supplied === secret);
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const [linkedin, meta] = await Promise.all([getLinkedInAppConfig(), getMetaAppConfig()]);
  return NextResponse.json({ ok: true, configured: { linkedin: Boolean(linkedin), meta: Boolean(meta) } });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as Record<string, string> | null;
  if (!body?.provider) return NextResponse.json({ error: 'provider required' }, { status: 400 });
  if (body.provider === 'linkedin') {
    if (!body.clientId || !body.clientSecret) return NextResponse.json({ error: 'clientId and clientSecret required' }, { status: 400 });
    await setSocialAppConfig('linkedin', { clientId: body.clientId, clientSecret: body.clientSecret, redirectUri: body.redirectUri });
  } else if (body.provider === 'meta') {
    if (!body.appId || !body.appSecret) return NextResponse.json({ error: 'appId and appSecret required' }, { status: 400 });
    await setSocialAppConfig('meta', { appId: body.appId, appSecret: body.appSecret, redirectUri: body.redirectUri, pageId: body.pageId });
  } else return NextResponse.json({ error: 'provider must be linkedin or meta' }, { status: 400 });
  return NextResponse.json({ ok: true, provider: body.provider });
}
