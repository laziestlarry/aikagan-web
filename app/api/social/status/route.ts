import { NextResponse } from 'next/server';
import { getSocialCredential } from '@/lib/social/token-store';
import { getLinkedInAppConfig, getMetaAppConfig, socialAdminSecret } from '@/lib/social/config-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const [linkedin, facebook, instagram, linkedinConfig, metaConfig] = await Promise.all([
    getSocialCredential('linkedin'),
    getSocialCredential('facebook'),
    getSocialCredential('instagram'),
    getLinkedInAppConfig(),
    getMetaAppConfig(),
  ]);

  const configuredProviders = {
    linkedin: Boolean(linkedinConfig),
    meta: Boolean(metaConfig),
  };
  const security = {
    encryption: Boolean(process.env.SOCIAL_TOKEN_ENCRYPTION_KEY || process.env.SOCIAL_PUBLISH_ADMIN_SECRET || process.env.ADMIN_SECRET || process.env.DOWNLOAD_TOKEN_SECRET),
    publishAdmin: Boolean(socialAdminSecret()),
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
      ...(!security.publishAdmin ? ['social_publish_admin_authority'] : []),
      ...(!(connected.linkedin || connected.facebook || connected.instagram) ? ['social_account_authorization'] : []),
    ],
    activation: {
      config: '/api/social/config',
      setup: '/api/social/oauth/setup',
      linkedin: '/api/social/oauth/linkedin',
      meta: '/api/social/oauth/meta',
      publish: '/api/social/publish',
    },
  });
}
