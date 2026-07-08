// ─────────────────────────────────────────────────────────────────────────────
// Paddle Billing API Client
//
// Singleton Paddle SDK instance. Returns null when PADDLE_API_KEY is not set
// (graceful fallback during dev / before env vars configured).
// ─────────────────────────────────────────────────────────────────────────────

import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const API_KEY = process.env.PADDLE_API_KEY ?? "";
// Auto-detect environment from key prefix if not explicitly set
// Production keys start with pdl_live_, sandbox keys start with pdl_
const PADDLE_ENV = process.env.PADDLE_ENVIRONMENT
  ?? (API_KEY.startsWith("pdl_live_") ? "production" : "sandbox");

let _client: Paddle | null = null;

export function getPaddleClient(): Paddle | null {
  if (!API_KEY) return null;
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
