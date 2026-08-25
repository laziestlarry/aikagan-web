import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { kvGet, kvSet } from '@/lib/kv';

export type SocialCredential = {
  accessToken: string;
  expiresAt?: number | null;
  authorUrn?: string;
  pageId?: string;
  pageName?: string;
  userId?: string;
  connectedAt: number;
};

type StoredEnvelope = { iv: string; tag: string; ciphertext: string };

function keyMaterial() {
  const secret = process.env.SOCIAL_TOKEN_ENCRYPTION_KEY || process.env.SOCIAL_PUBLISH_ADMIN_SECRET;
  if (!secret) throw new Error('SOCIAL_TOKEN_ENCRYPTION_KEY is not configured');
  return createHash('sha256').update(secret).digest();
}

function encrypt(value: SocialCredential): StoredEnvelope {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyMaterial(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return { iv: iv.toString('base64url'), tag: cipher.getAuthTag().toString('base64url'), ciphertext: ciphertext.toString('base64url') };
}

function decrypt(value: StoredEnvelope): SocialCredential {
  const decipher = createDecipheriv('aes-256-gcm', keyMaterial(), Buffer.from(value.iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(value.tag, 'base64url'));
  return JSON.parse(Buffer.concat([
    decipher.update(Buffer.from(value.ciphertext, 'base64url')),
    decipher.final(),
  ]).toString('utf8')) as SocialCredential;
}

export async function setSocialCredential(provider: 'linkedin' | 'facebook' | 'instagram', credential: SocialCredential) {
  await kvSet(`social:credential:${provider}`, encrypt(credential));
}

export async function getSocialCredential(provider: 'linkedin' | 'facebook' | 'instagram') {
  const envelope = await kvGet<StoredEnvelope>(`social:credential:${provider}`);
  if (!envelope) return null;
  try {
    const credential = decrypt(envelope);
    if (credential.expiresAt && credential.expiresAt <= Date.now()) return null;
    return credential;
  } catch {
    return null;
  }
}

export async function putOauthState(state: string, provider: 'linkedin' | 'meta') {
  await kvSet(`social:oauth:state:${state}`, { provider, exp: Date.now() + 10 * 60_000 }, 10 * 60);
}

export async function consumeOauthState(state: string, provider: 'linkedin' | 'meta') {
  const entry = await kvGet<{ provider: string; exp: number }>(`social:oauth:state:${state}`);
  return Boolean(entry && entry.provider === provider && entry.exp > Date.now());
}
