// ─────────────────────────────────────────────────────────────────────────────
// Paddle Billing API Client
//
// The commercial checkout rail requires both the server API key and the public
// Paddle.js client token. Returning null when either is absent forces the
// multi-provider checkout router to continue to Lemon Squeezy, Gumroad, or
// Shopier instead of creating a transaction the buyer cannot open.
// ─────────────────────────────────────────────────────────────────────────────

import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const API_KEY = process.env.PADDLE_API_KEY ?? "";
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
// Auto-detect environment from key prefix if not explicitly set.
// Production keys start with pdl_live_; sandbox keys use a non-live prefix.
const PADDLE_ENV = process.env.PADDLE_ENVIRONMENT
  ?? (API_KEY.startsWith("pdl_live_") ? "production" : "sandbox");

let _client: Paddle | null = null;

export function getPaddleClient(): Paddle | null {
  if (!API_KEY || !CLIENT_TOKEN) return null;
  if (!_client) {
    _client = new Paddle(API_KEY, {
      environment: PADDLE_ENV === "production"
        ? Environment.production
        : Environment.sandbox,
    });
  }
  return _client;
}

export function getPaddleEnvironment(): string {
  return PADDLE_ENV;
}

export function isPaddleCheckoutConfigured(): boolean {
  return Boolean(API_KEY && CLIENT_TOKEN && process.env.PADDLE_CHECKOUT_DISABLED !== "true");
}
