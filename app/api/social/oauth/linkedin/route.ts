import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { putOauthState } from '@/lib/social/token-store';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${req.nextUrl.origin}/api/social/oauth/linkedin/callback`;
  if (!clientId) return NextResponse.json({ error: 'LINKEDIN_CLIENT_ID missing' }, { status: 503 });

  const state = randomBytes(24).toString('base64url');
  await putOauthState(state, 'linkedin');
  const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', 'openid profile w_member_social');
  return NextResponse.redirect(url);
}
