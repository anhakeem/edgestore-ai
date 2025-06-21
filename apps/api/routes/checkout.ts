// edgestore-ai/apps/api/routes/checkout.ts

import express, { Request, Response, raw, RequestHandler } from 'express';
import Stripe from 'stripe';

const router = express.Router();

// 🧠 Lazy Stripe Instantiation
let stripe: Stripe | null = null;
const getStripe = (): Stripe => {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.error('❌ STRIPE_SECRET_KEY is not defined in .env');
      throw new Error('Missing STRIPE_SECRET_KEY');
    }
    stripe = new Stripe(key, { apiVersion: '2025-05-28.basil' });
  }
  return stripe;
};

// STRIPE SECRET KEY Loaded
console.log('🔐 STRIPE_SECRET_KEY Loaded:', !!process.env.STRIPE_SECRET_KEY);

// ✅ CREATE CHECKOUT SESSION
const createCheckoutSessionHandler: RequestHandler = async (req: Request, res: Response) => {
  const { priceId, userEmail, userId } = req.body;

  console.log('🧾 Received checkout request:', { priceId, userEmail, userId });

  if (!priceId || !userEmail || !userId) {
    console.warn('⚠️ Missing required checkout fields');
    res.status(400).json({ error: 'Missing required fields: priceId, userEmail, or userId' });
    return;
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      client_reference_id: userId,
      customer_email: userEmail,
    });

    console.log('✅ Stripe session created:', session.id);
    res.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Stripe error:', error?.message);
    console.error('🪵 Full Error:', error);
    res.status(500).json({ error: error?.message || 'Stripe session creation failed' });
  }
};

router.post('/create-checkout-session', createCheckoutSessionHandler);

// ✅ WEBHOOK HANDLER
const stripeWebhookHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error(`❌ Webhook signature error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata?.userId || (subscription as any).client_reference_id;

  console.log(`🔥 Stripe event received: ${event.type} for user: ${userId}`);
  res.json({ received: true });
};

router.post('/webhook', raw({ type: 'application/json' }), stripeWebhookHandler);

export default router;
