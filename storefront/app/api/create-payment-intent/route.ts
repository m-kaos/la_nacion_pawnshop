import { NextRequest, NextResponse } from 'next/server';

// Note: Stripe SDK will be installed on backend for production
// For now, we use direct API calls
export async function POST(request: NextRequest) {
  try {
    const { amount, orderId } = await request.json();

    console.log('[Payment Intent] Creating for order:', orderId, 'amount:', amount);

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.error('[Payment Intent] STRIPE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    // Create Payment Intent using Stripe API
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: 'usd',
        'automatic_payment_methods[enabled]': 'true',
        'metadata[orderId]': orderId || 'unknown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Payment Intent] Stripe API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create payment intent', details: errorData },
        { status: response.status }
      );
    }

    const paymentIntent = await response.json();

    console.log('[Payment Intent] Created successfully:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error: any) {
    console.error('[Payment Intent] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
