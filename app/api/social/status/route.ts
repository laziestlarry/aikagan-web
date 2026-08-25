import { NextResponse } from 'next/server';
import { getSocialCredential } from '@/lib/social/token-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function configured(name: string): boolean {
  const value = process.env[name];
  return Boolean(value && value.trim() && !/^(replace|your_|changeme|placeholder)/i.test(value.trim()));
}

export async function GET() {
  const [linkedin, facebook, instagram] = await Promise.all([
    getSocialCredential('linkedin'),
    getSocialCredential('facebook'),
    getSocialCredential('instagram'),
  ]);

  const configuredProviders = {
    linkedin: configured('LINKEDIN_CLIENT_ID') && configured('LINKEDIN_CLIENT_SECRET'),
    meta: configured('META_APP_ID') && configured('META_APP_SECRET'),
  };
  const security = {
    encryption: configured('SOCIAL_TOKEN_ENCRYPTION_KEY') || configured('SOCIAL_PUBLISH_ADMIN_SECRET'),
    publishAdmin: configured('SOCIAL_PUBLISH_ADMIN_SECRET'),
  };
  const connected = {
    linkedin: Boolean(linkedin),
    facebook: Boolean(facebook),
    instagram: Boolean(instagram),
  };

  return NextResponse.json({
    ok: true,
    directPublishingReady: security.encryption && security.publishAdmin && (connected.linkedin || connected.facebook || connected.instagram),
    configured: configuredProviders,
    security,
    connected,
    missing: [
      ...(!configuredProviders.linkedin ? ['linkedin_app_credentials'] : []),
      ...(!configuredProviders.meta ? ['meta_app_credentials'] : []),
      ...(!security.encryption ? ['social_token_encryption'] : []),
      ...(!security.publishAdmin ? ['social_publish_admin_secret'] : []),
    ],
    activation: {
      setup: '/api/social/oauth/setup',
      linkedin: '/api/social/oauth/linkedin',
      meta: '/api/social/oauth/meta',
      publish: '/api/social/publish',
    },
  });
}
