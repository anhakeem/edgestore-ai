import express, { Request, Response, raw, RequestHandler } from 'express';
import Stripe from 'stripe';

const router = express.Router();

// 🧠 Lazy Stripe instantiation to prevent early crash
let stripe: Stripe | null = null;
const getStripe = (): Stripe => {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('❌ STRIPE_SECRET_KEY is not set in environment');
    }
    stripe = new Stripe(key, { apiVersion: '2025-05-28.basil' });
  }
  return stripe;
};

// ✅ TYPE-SAFE Checkout session route
const createCheckoutSessionHandler: RequestHandler = async (req: Request, res: Response) => {
  const { priceId, userEmail, userId } = req.body;

  if (!priceId || !userEmail || !userId) {
    res.status(400).json({ error: 'Missing required fields' });
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

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Stripe error:', error);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
};

router.post('/create-checkout-session', createCheckoutSessionHandler);

// ✅ TYPE-SAFE Webhook route
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
    console.error(`❌ Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata?.userId || (subscription as any).client_reference_id;

  console.log(`🔥 Stripe event: ${event.type} for user: ${userId}`);
  res.json({ received: true });
};

router.post('/webhook', raw({ type: 'application/json' }), stripeWebhookHandler);

export default router;
