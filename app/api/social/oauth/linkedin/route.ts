import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { consumeOauthSetupTicket, putOauthState } from '@/lib/social/token-store';
import { getLinkedInAppConfig } from '@/lib/social/config-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const setup = req.nextUrl.searchParams.get('setup') || '';
  if (!setup || !(await consumeOauthSetupTicket(setup, 'linkedin'))) {
    return NextResponse.json({ error: 'authorized setup ticket required' }, { status: 401 });
  }

  const config = await getLinkedInAppConfig();
  if (!config?.clientId) return NextResponse.json({ error: 'linkedin_app_credentials_missing' }, { status: 503 });
  const redirectUri = config.redirectUri || `${req.nextUrl.origin}/api/social/oauth/linkedin/callback`;

  const state = randomBytes(24).toString('base64url');
  await putOauthState(state, 'linkedin');
  const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', 'openid profile w_member_social');
  return NextResponse.redirect(url);
}
