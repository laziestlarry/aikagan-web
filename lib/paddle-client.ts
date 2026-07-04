// ─────────────────────────────────────────────────────────────────────────────
// Paddle Billing API Client
//
// Singleton Paddle SDK instance. Returns null when PADDLE_API_KEY is not set
// (graceful fallback during dev / before env vars configured).
// ─────────────────────────────────────────────────────────────────────────────

import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const API_KEY = process.env.PADDLE_API_KEY ?? "";

let _client: Paddle | null = null;

export function getPaddleClient(): Paddle | null {
  if (!API_KEY) return null;
  if (!_client) {
    _client = new Paddle(API_KEY, {
      environment: process.env.NODE_ENV === "production"
        ? Environment.production
        : Environment.sandbox,
    });
  }
  return _client;
}
