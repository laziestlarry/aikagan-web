// ─────────────────────────────────────────────────────────────────────────────
// Referral / Affiliate System
//
// 8-char codes, lowercase + digits, never ambiguous (no 0/o/1/l).
// Storage: Vercel KV (preferred) with in-memory fallback.
// ─────────────────────────────────────────────────────────────────────────────

const CODE_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // no 0/o/1/l
const CODE_LENGTH = 8;

let _kv: { get: Function; set: Function; del: Function; incr: Function; scan: Function } | null = null;

async function getKv() {
  if (_kv) return _kv;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      _kv = kv;
    }
  } catch {
    // ignore
  }
  return _kv;
}

// ── In-memory fallback ─────────────────────────────────────────────────────
const _memory = new Map<string, {
  code: string;
  name: string;
  email: string;
  createdAt: number;
  totalClicks: number;
  totalConversions: number;
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
}>();

// ── Public API ─────────────────────────────────────────────────────────────

/** Generate a unique 8-char referral code. */
export function generateReferralCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

export interface PayoutLogEntry {
  at: number;
  amount: number;
  note?: string;
}

export interface AffiliateProfile {
  code: string;
  name: string;
  email: string;
  createdAt: number;
  totalClicks: number;
  totalConversions: number;
  totalCommission: number; // in dollars
  pendingCommission: number;
  paidCommission: number;
  payoutLog?: PayoutLogEntry[];
}

export interface ConversionInput {
  code: string;
  orderId: string;
  amount: number; // order total in dollars
  productSlug: string;
  /** 30/25/25/20 (percent) */
  commissionRate: number;
}

/** Register a new affiliate and return their code. */
export async function registerAffiliate(
  name: string,
  email: string
): Promise<AffiliateProfile> {
  const code = generateReferralCode();
  const profile: AffiliateProfile = {
    code,
    name,
    email,
    createdAt: Date.now(),
    totalClicks: 0,
    totalConversions: 0,
    totalCommission: 0,
    pendingCommission: 0,
    paidCommission: 0,
  };

  await persistProfile(profile);
  return profile;
}

export async function getAffiliateByCode(code: string): Promise<AffiliateProfile | null> {
  if (!code) return null;
  const kv = await getKv();
  if (kv) {
    try {
      const data = await kv.get(`affiliate:${code}`);
      if (data) return data as AffiliateProfile;
    } catch {
      // fall through
    }
  }
  return _memory.get(code) ?? null;
}

/** Record a click for an affiliate (ref=CODE on any page). */
export async function recordClick(code: string): Promise<void> {
  if (!code) return;
  const profile = await getAffiliateByCode(code);
  if (!profile) return;
  profile.totalClicks += 1;
  await persistProfile(profile);
}

/** Record a commission for an affiliate (called from webhook). */
export async function recordConversion(input: ConversionInput): Promise<boolean> {
  const profile = await getAffiliateByCode(input.code);
  if (!profile) return false;
  const commission = (input.amount * input.commissionRate) / 100;
  profile.totalConversions += 1;
  profile.totalCommission += commission;
  profile.pendingCommission += commission;
  await persistProfile(profile);
  return true;
}

/**
 * Mark pending commission as paid (admin action). Moves `pendingCommission`
 * → `paidCommission` for the given amount, capped at the current balance.
 *
 * Returns the actual amount paid, or 0 if the affiliate has no pending
 * balance or the code is unknown.
 */
export async function markCommissionPaid(
  code: string,
  amount: number,
  note?: string
): Promise<{ paid: number; remaining: number } | null> {
  const profile = await getAffiliateByCode(code);
  if (!profile) return null;
  const pay = Math.min(amount, profile.pendingCommission);
  if (pay <= 0) return { paid: 0, remaining: profile.pendingCommission };
  profile.pendingCommission -= pay;
  profile.paidCommission += pay;
  // Audit log
  const logs = (profile.payoutLog ??= [] as Array<{
    at: number;
    amount: number;
    note?: string;
  }>);
  logs.push({ at: Date.now(), amount: pay, note });
  await persistProfile(profile);
  return { paid: pay, remaining: profile.pendingCommission };
}

/** List affiliates — for admin/dashboard use. In-memory only unless KV. */
export async function listAffiliates(): Promise<AffiliateProfile[]> {
  // In-memory snapshot (most recent registered will be in here)
  const all = Array.from(_memory.values());
  if (all.length > 0) return all.sort((a, b) => b.createdAt - a.createdAt);
  // Fall back to KV scan if available
  const kv = await getKv();
  if (kv) {
    try {
      // Upstash SCAN pattern
      const result = await kv.scan(0, { match: "affiliate:*", count: 1000 });
      const keys: string[] = Array.isArray(result) && Array.isArray(result[1]) ? result[1] : [];
      const profiles: AffiliateProfile[] = [];
      for (const k of keys) {
        const data = (await kv.get(k)) as AffiliateProfile | null;
        if (data) profiles.push(data);
      }
      return profiles.sort((a, b) => b.createdAt - a.createdAt);
    } catch {
      return [];
    }
  }
  return [];
}

// ── Persistence ─────────────────────────────────────────────────────────────

async function persistProfile(profile: AffiliateProfile): Promise<void> {
  _memory.set(profile.code, profile);
  const kv = await getKv();
  if (kv) {
    try {
      await kv.set(`affiliate:${profile.code}`, profile, { ex: 365 * 24 * 60 * 60 });
    } catch {
      // ignore
    }
  }
}

/** Commission rates by product slug. */
export function getCommissionRate(slug: string): number {
  const map: Record<string, number> = {
    "masterclass-starter": 30,
    "masterclass-pro": 25,
    "masterclass-commander": 25,
    "golden-delivery-starter": 30,
    "golden-delivery-pro": 25,
    "golden-delivery-commander": 25,
  };
  return map[slug] ?? 25;
}

/** Build a public referral link. */
export function buildReferralLink(code: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/?ref=${code}`;
}
