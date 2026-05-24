import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * LemonSqueezy Webhook Handler
 *
 * Verifies HMAC-SHA256 signature, then fans out to:
 *   1. Make.com webhook (post-purchase automation, email delivery, CRM)
 *   2. GTM / server-side conversion event (optional — can be done client-side too)
 *
 * Required Vercel env vars:
 *   LEMONSQUEEZY_WEBHOOK_SECRET  — from LS dashboard → Webhooks → Signing Secret
 *   MAKE_WEBHOOK_URL             — from Make.com → Webhooks → Custom Webhook URL
 */

export const runtime = 'edge'; // Fast cold-start; crypto.subtle available in edge runtime

async function hmacSha256(secret: string, body: string): Promise<string> {
  // Edge-compatible HMAC
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature') ?? '';

  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[LS Webhook] LEMONSQUEEZY_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const expectedHash = await hmacSha256(secret, rawBody);

  if (expectedHash !== signature) {
    console.warn('[LS Webhook] Invalid signature — possible spoofed request');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventName = (event?.meta as Record<string, unknown>)?.event_name as string;
  const orderData = event?.data as Record<string, unknown>;

  console.log(`[LS Webhook] Received event: ${eventName}`);

  if (eventName === 'order_created') {
    const makeUrl = process.env.MAKE_WEBHOOK_URL;
    if (makeUrl) {
      try {
        await fetch(makeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: eventName,
            order_id: (orderData?.id as string) ?? null,
            customer_email: ((orderData?.attributes as Record<string, unknown>)?.user_email as string) ?? null,
            product_name: ((orderData?.attributes as Record<string, unknown>)?.first_order_item as Record<string, unknown>)?.product_name ?? null,
            variant_name: ((orderData?.attributes as Record<string, unknown>)?.first_order_item as Record<string, unknown>)?.variant_name ?? null,
            total: ((orderData?.attributes as Record<string, unknown>)?.total as number) ?? null,
            currency: ((orderData?.attributes as Record<string, unknown>)?.currency as string) ?? 'USD',
            checkout_url: ((orderData?.attributes as Record<string, unknown>)?.urls as Record<string, unknown>)?.receipt ?? null,
            timestamp: new Date().toISOString(),
          }),
        });
        console.log('[LS Webhook] Forwarded order_created to Make.com');
      } catch (err) {
        console.error('[LS Webhook] Failed to forward to Make.com:', err);
        // Still return 200 to LemonSqueezy — don't retry the webhook
      }
    } else {
      console.warn('[LS Webhook] MAKE_WEBHOOK_URL not set — skipping Make.com forwarding');
    }
  }

  return NextResponse.json({ status: 'ok', event: eventName });
}
