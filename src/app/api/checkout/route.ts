import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  const { priceId, packId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/mission-control?session_id={CHECKOUT_SESSION_ID}&pack=${packId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
    metadata: { packId }, // Critical for Make.com / AutonomaX backend triggers
  });

  return NextResponse.json({ sessionId: session.id });
}