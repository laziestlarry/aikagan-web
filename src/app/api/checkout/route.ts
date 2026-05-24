// This Stripe checkout route is deprecated — payments are handled via LemonSqueezy overlay.
// Keeping file to avoid 404 on any cached references.
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Stripe checkout is not active. Use LemonSqueezy.' },
    { status: 410 }
  );
}
