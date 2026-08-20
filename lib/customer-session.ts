import crypto from "crypto";

export const CUSTOMER_SESSION_COOKIE = "ax_customer";
export const CUSTOMER_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type CustomerSession = {
  customerId: string;
  email: string;
  exp: number;
};

function secret(): string {
  const value = process.env.CUSTOMER_SESSION_SECRET || process.env.DOWNLOAD_TOKEN_SECRET || "";
  if (!value) throw new Error("CUSTOMER_SESSION_SECRET or DOWNLOAD_TOKEN_SECRET is not set");
  return value;
}

export function customerIdForEmail(email: string): string {
  return crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 24);
}

export function signCustomerSession(email: string): string {
  const normalized = email.trim().toLowerCase();
  const payload: CustomerSession = {
    customerId: customerIdForEmail(normalized),
    email: normalized,
    exp: Date.now() + CUSTOMER_SESSION_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyCustomerSession(value?: string | null): CustomerSession | null {
  if (!value) return null;
  const [body, sig] = value.split(".");
  if (!body || !sig) return null;
  try {
    const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as CustomerSession;
    if (!payload.email || !payload.customerId || !payload.exp || Date.now() > payload.exp) return null;
    if (customerIdForEmail(payload.email) !== payload.customerId) return null;
    return payload;
  } catch {
    return null;
  }
}
