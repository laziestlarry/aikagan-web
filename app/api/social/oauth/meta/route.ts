import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { consumeOauthSetupTicket, putOauthState } from '@/lib/social/token-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const setup = req.nextUrl.searchParams.get('setup') || '';
  if (!setup || !(await consumeOauthSetupTicket(setup, 'meta'))) {
    return NextResponse.json({ error: 'authorized setup ticket required' }, { status: 401 });
  }

  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.META_REDIRECT_URI || `${req.nextUrl.origin}/api/social/oauth/meta/callback`;
  if (!appId) return NextResponse.json({ error: 'META_APP_ID missing' }, { status: 503 });

  const state = randomBytes(24).toString('base64url');
  await putOauthState(state, 'meta');
  const version = process.env.META_GRAPH_VERSION || 'v25.0';
  const url = new URL(`https://www.facebook.com/${version}/dialog/oauth`);
  url.searchParams.set('client_id', appId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish');
  return NextResponse.redirect(url);
}
