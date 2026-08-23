export type SocialNetwork = 'linkedin' | 'x' | 'facebook';

export type PublishPayload = {
  text: string;
  url?: string;
};

const endpointByNetwork: Record<SocialNetwork, string | undefined> = {
  linkedin: process.env.LINKEDIN_PUBLISH_ENDPOINT,
  x: process.env.X_PUBLISH_ENDPOINT,
  facebook: process.env.FACEBOOK_PUBLISH_ENDPOINT,
};

export async function publishToNetwork(network: SocialNetwork, payload: PublishPayload) {
  const endpoint = endpointByNetwork[network];
  const secret = process.env.SOCIAL_PUBLISH_SHARED_SECRET;

  if (!endpoint) {
    throw new Error(`${network} connector is not configured`);
  }
  if (!secret) {
    throw new Error('SOCIAL_PUBLISH_SHARED_SECRET is not configured');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`${network} publish failed (${response.status}): ${body.slice(0, 300)}`);
  }

  return { network, status: response.status, body: body.slice(0, 1000) };
}
