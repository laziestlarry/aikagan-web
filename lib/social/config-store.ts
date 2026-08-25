import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { kvGet, kvSet } from '@/lib/kv';

export type LinkedInAppConfig = { clientId: string; clientSecret: string; redirectUri?: string };
export type MetaAppConfig = { appId: string; appSecret: string; redirectUri?: string; pageId?: string };
type Provider = 'linkedin' | 'meta';
type Envelope = { iv: string; tag: string; ciphertext: string };

function keyMaterial() {
  const secret = process.env.SOCIAL_TOKEN_ENCRYPTION_KEY || process.env.SOCIAL_PUBLISH_ADMIN_SECRET || process.env.ADMIN_SECRET || process.env.DOWNLOAD_TOKEN_SECRET;
  if (!secret) throw new Error('social encryption authority is not configured');
  return createHash('sha256').update(secret).digest();
}

function encrypt(value: unknown): Envelope {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyMaterial(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return { iv: iv.toString('base64url'), tag: cipher.getAuthTag().toString('base64url'), ciphertext: ciphertext.toString('base64url') };
}
function decrypt<T>(value: Envelope): T {
  const decipher = createDecipheriv('aes-256-gcm', keyMaterial(), Buffer.from(value.iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(value.tag, 'base64url'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(value.ciphertext, 'base64url')), decipher.final()]).toString('utf8')) as T;
}

export async function setSocialAppConfig(provider: Provider, value: LinkedInAppConfig | MetaAppConfig) {
  await kvSet(`social:app-config:${provider}`, encrypt(value));
}

export async function getLinkedInAppConfig(): Promise<LinkedInAppConfig | null> {
  const env = process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
    ? { clientId: process.env.LINKEDIN_CLIENT_ID, clientSecret: process.env.LINKEDIN_CLIENT_SECRET, redirectUri: process.env.LINKEDIN_REDIRECT_URI }
    : null;
  if (env) return env;
  const stored = await kvGet<Envelope>('social:app-config:linkedin');
  if (!stored) return null;
  try { return decrypt<LinkedInAppConfig>(stored); } catch { return null; }
}

export async function getMetaAppConfig(): Promise<MetaAppConfig | null> {
  const env = process.env.META_APP_ID && process.env.META_APP_SECRET
    ? { appId: process.env.META_APP_ID, appSecret: process.env.META_APP_SECRET, redirectUri: process.env.META_REDIRECT_URI, pageId: process.env.META_PAGE_ID }
    : null;
  if (env) return env;
  const stored = await kvGet<Envelope>('social:app-config:meta');
  if (!stored) return null;
  try { return decrypt<MetaAppConfig>(stored); } catch { return null; }
}

export function socialAdminSecret() {
  return process.env.SOCIAL_PUBLISH_ADMIN_SECRET || process.env.ADMIN_SECRET || null;
}
