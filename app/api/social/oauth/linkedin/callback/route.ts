import { NextRequest, NextResponse } from 'next/server';
import { consumeOauthState, setSocialCredential } from '@/lib/social/token-store';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const error = req.nextUrl.searchParams.get('error');
  if (error) return NextResponse.redirect(new URL(`/network?social=linkedin&error=${encodeURIComponent(error)}`, req.nextUrl.origin));
  if (!code || !state || !(await consumeOauthState(state, 'linkedin'))) {
    return NextResponse.json({ error: 'invalid_oauth_state' }, { status: 400 });
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${req.nextUrl.origin}/api/social/oauth/linkedin/callback`;
  if (!clientId || !clientSecret) return NextResponse.json({ error: 'linkedin_oauth_not_configured' }, { status: 503 });

  const form = new URLSearchParams({ grant_type: 'authorization_code', code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri });
  const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: form, cache: 'no-store',
  });
  const token = await tokenResponse.json().catch(() => null);
  if (!tokenResponse.ok || !token?.access_token) {
    return NextResponse.json({ error: 'linkedin_token_exchange_failed', detail: token }, { status: 502 });
  }

  const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { authorization: `Bearer ${token.access_token}` }, cache: 'no-store',
  });
  const profile = await profileResponse.json().catch(() => null);
  if (!profileResponse.ok || !profile?.sub) {
    return NextResponse.json({ error: 'linkedin_profile_resolution_failed', detail: profile }, { status: 502 });
  }

  await setSocialCredential('linkedin', {
    accessToken: token.access_token,
    expiresAt: token.expires_in ? Date.now() + Number(token.expires_in) * 1000 : null,
    authorUrn: process.env.LINKEDIN_AUTHOR_URN || `urn:li:person:${profile.sub}`,
    connectedAt: Date.now(),
  });
  return NextResponse.redirect(new URL('/network?social=linkedin&connected=1', req.nextUrl.origin));
}
