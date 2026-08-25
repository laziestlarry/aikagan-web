import { getSocialCredential } from '@/lib/social/token-store';

export type SocialNetwork = 'linkedin' | 'x' | 'facebook' | 'instagram';

export type PublishPayload = {
  text: string;
  url?: string;
  imageUrl?: string;
};

const META_GRAPH_VERSION = process.env.META_GRAPH_VERSION || 'v25.0';
const LINKEDIN_VERSION = process.env.LINKEDIN_VERSION || '202604';

function joinText(text: string, url?: string) {
  return url && !text.includes(url) ? `${text}\n\n${url}` : text;
}

async function publishLinkedIn(payload: PublishPayload) {
  const stored = await getSocialCredential('linkedin');
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN || stored?.accessToken;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN || stored?.authorUrn;
  if (!accessToken || !authorUrn) throw new Error('linkedin is not authenticated');

  const response = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
      'x-restli-protocol-version': '2.0.0',
      'linkedin-version': LINKEDIN_VERSION,
    },
    body: JSON.stringify({
      author: authorUrn,
      commentary: joinText(payload.text, payload.url),
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    }),
    cache: 'no-store',
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`linkedin publish failed (${response.status}): ${body.slice(0, 300)}`);
  return {
    network: 'linkedin' as const,
    status: response.status,
    postId: response.headers.get('x-restli-id'),
  };
}

async function publishFacebook(payload: PublishPayload) {
  const stored = await getSocialCredential('facebook');
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN || stored?.accessToken;
  const pageId = process.env.META_PAGE_ID || stored?.pageId;
  if (!accessToken || !pageId) throw new Error('facebook is not authenticated');

  const body = new URLSearchParams({
    message: payload.text,
    access_token: accessToken,
  });
  if (payload.url) body.set('link', payload.url);

  const response = await fetch(`https://graph.facebook.com/${META_GRAPH_VERSION}/${encodeURIComponent(pageId)}/feed`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`facebook publish failed (${response.status}): ${JSON.stringify(json).slice(0, 300)}`);
  return { network: 'facebook' as const, status: response.status, postId: json?.id ?? null };
}

async function publishInstagram(payload: PublishPayload) {
  if (!payload.imageUrl) throw new Error('instagram requires imageUrl for publishing');
  const stored = await getSocialCredential('instagram');
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || stored?.accessToken;
  const userId = process.env.INSTAGRAM_USER_ID || stored?.userId;
  if (!accessToken || !userId) throw new Error('instagram is not authenticated');

  const create = new URLSearchParams({
    image_url: payload.imageUrl,
    caption: joinText(payload.text, payload.url),
    access_token: accessToken,
  });
  const createResponse = await fetch(`https://graph.facebook.com/${META_GRAPH_VERSION}/${encodeURIComponent(userId)}/media`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: create,
    cache: 'no-store',
  });
  const created = await createResponse.json().catch(() => null);
  if (!createResponse.ok || !created?.id) {
    throw new Error(`instagram media creation failed (${createResponse.status}): ${JSON.stringify(created).slice(0, 300)}`);
  }

  const publish = new URLSearchParams({ creation_id: created.id, access_token: accessToken });
  const publishResponse = await fetch(`https://graph.facebook.com/${META_GRAPH_VERSION}/${encodeURIComponent(userId)}/media_publish`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: publish,
    cache: 'no-store',
  });
  const published = await publishResponse.json().catch(() => null);
  if (!publishResponse.ok) {
    throw new Error(`instagram publish failed (${publishResponse.status}): ${JSON.stringify(published).slice(0, 300)}`);
  }
  return { network: 'instagram' as const, status: publishResponse.status, postId: published?.id ?? null };
}

async function publishLegacyX(payload: PublishPayload) {
  const endpoint = process.env.X_PUBLISH_ENDPOINT;
  const secret = process.env.SOCIAL_PUBLISH_SHARED_SECRET;
  if (!endpoint || !secret) throw new Error('x connector is not configured');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`x publish failed (${response.status}): ${body.slice(0, 300)}`);
  return { network: 'x' as const, status: response.status, body: body.slice(0, 1000) };
}

export async function publishToNetwork(network: SocialNetwork, payload: PublishPayload) {
  if (network === 'linkedin') return publishLinkedIn(payload);
  if (network === 'facebook') return publishFacebook(payload);
  if (network === 'instagram') return publishInstagram(payload);
  return publishLegacyX(payload);
}
