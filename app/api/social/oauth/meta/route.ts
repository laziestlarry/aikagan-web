import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { consumeOauthSetupTicket, putOauthState } from '@/lib/social/token-store';
import { getMetaAppConfig } from '@/lib/social/config-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const setup = req.nextUrl.searchParams.get('setup') || '';
  if (!setup || !(await consumeOauthSetupTicket(setup, 'meta'))) {
    return NextResponse.json({ error: 'authorized setup ticket required' }, { status: 401 });
  }

  const config = await getMetaAppConfig();
  if (!config?.appId) return NextResponse.json({ error: 'meta_app_credentials_missing' }, { status: 503 });
  const redirectUri = config.redirectUri || `${req.nextUrl.origin}/api/social/oauth/meta/callback`;

  const state = randomBytes(24).toString('base64url');
  await putOauthState(state, 'meta');
  const version = process.env.META_GRAPH_VERSION || 'v25.0';
  const url = new URL(`https://www.facebook.com/${version}/dialog/oauth`);
  url.searchParams.set('client_id', config.appId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish');
  return NextResponse.redirect(url);
}
