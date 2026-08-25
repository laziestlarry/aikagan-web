import { NextRequest, NextResponse } from 'next/server';
import { consumeOauthState, setSocialCredential } from '@/lib/social/token-store';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const error = req.nextUrl.searchParams.get('error');
  if (error) return NextResponse.redirect(new URL(`/network?social=meta&error=${encodeURIComponent(error)}`, req.nextUrl.origin));
  if (!code || !state || !(await consumeOauthState(state, 'meta'))) {
    return NextResponse.json({ error: 'invalid_oauth_state' }, { status: 400 });
  }

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = process.env.META_REDIRECT_URI || `${req.nextUrl.origin}/api/social/oauth/meta/callback`;
  const version = process.env.META_GRAPH_VERSION || 'v25.0';
  if (!appId || !appSecret) return NextResponse.json({ error: 'meta_oauth_not_configured' }, { status: 503 });

  const tokenUrl = new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
  tokenUrl.searchParams.set('client_id', appId);
  tokenUrl.searchParams.set('client_secret', appSecret);
  tokenUrl.searchParams.set('redirect_uri', redirectUri);
  tokenUrl.searchParams.set('code', code);
  const shortResponse = await fetch(tokenUrl, { cache: 'no-store' });
  const short = await shortResponse.json().catch(() => null);
  if (!shortResponse.ok || !short?.access_token) {
    return NextResponse.json({ error: 'meta_token_exchange_failed', detail: short }, { status: 502 });
  }

  const longUrl = new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
  longUrl.searchParams.set('grant_type', 'fb_exchange_token');
  longUrl.searchParams.set('client_id', appId);
  longUrl.searchParams.set('client_secret', appSecret);
  longUrl.searchParams.set('fb_exchange_token', short.access_token);
  const longResponse = await fetch(longUrl, { cache: 'no-store' });
  const long = await longResponse.json().catch(() => null);
  const userToken = longResponse.ok && long?.access_token ? long.access_token : short.access_token;

  const pagesUrl = new URL(`https://graph.facebook.com/${version}/me/accounts`);
  pagesUrl.searchParams.set('fields', 'id,name,access_token,instagram_business_account');
  pagesUrl.searchParams.set('access_token', userToken);
  const pagesResponse = await fetch(pagesUrl, { cache: 'no-store' });
  const pages = await pagesResponse.json().catch(() => null);
  if (!pagesResponse.ok || !Array.isArray(pages?.data) || pages.data.length === 0) {
    return NextResponse.json({ error: 'meta_no_manageable_pages', detail: pages }, { status: 409 });
  }

  const preferredPageId = process.env.META_PAGE_ID;
  const page = (preferredPageId ? pages.data.find((p: any) => String(p.id) === preferredPageId) : null) || pages.data[0];
  if (!page?.id || !page?.access_token) return NextResponse.json({ error: 'meta_page_token_missing' }, { status: 502 });

  await setSocialCredential('facebook', {
    accessToken: page.access_token,
    pageId: String(page.id),
    pageName: page.name ? String(page.name) : undefined,
    connectedAt: Date.now(),
  });

  const instagramId = page.instagram_business_account?.id ? String(page.instagram_business_account.id) : null;
  if (instagramId) {
    await setSocialCredential('instagram', {
      accessToken: page.access_token,
      userId: instagramId,
      pageId: String(page.id),
      connectedAt: Date.now(),
    });
  }

  const suffix = instagramId ? '&instagram=1' : '';
  return NextResponse.redirect(new URL(`/network?social=meta&connected=1${suffix}`, req.nextUrl.origin));
}
