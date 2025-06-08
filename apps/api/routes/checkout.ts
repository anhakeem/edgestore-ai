import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10', // Use a recent API version
});

// POST /create-checkout-session to launch Stripe Checkout
router.post('/create-checkout-session', async (req, res) => {
  const { priceId, userId } = req.body;

  if (!priceId || !userId) {
    return res.status(400).json({ error: 'priceId and userId are required' });
  }

  try {
    // Optionally, retrieve the user from your database to ensure they exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      client_reference_id: userId, // Link the Stripe session to your internal user ID
      customer_email: user.email, // Pre-fill customer email if available
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata?.userId || subscription.client_reference_id; // Retrieve userId from metadata or client_reference_id

  if (!userId) {
    console.warn('Webhook received but no userId found in metadata or client_reference_id:', subscription);
    return res.status(400).send('User ID not found in webhook event.');
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        console.log(`Subscription created: ${subscription.id} for user ${userId}`);
        await prisma.user.update({
          where: { id: userId as string },
          data: { subscriptionStatus: 'active' },
        });
        break;
      case 'customer.subscription.updated':
        console.log(`Subscription updated: ${subscription.id} for user ${userId}, status: ${subscription.status}`);
        await prisma.user.update({
          where: { id: userId as string },
          data: { subscriptionStatus: subscription.status as string }, // Stripe statuses like 'active', 'canceled', 'unpaid', etc.
        });
        break;
      case 'customer.subscription.deleted':
        console.log(`Subscription deleted: ${subscription.id} for user ${userId}`);
        await prisma.user.update({
          where: { id: userId as string },
          data: { subscriptionStatus: 'canceled' },
        });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return res.status(500).json({ error: 'Failed to process webhook event' });
  }

  res.json({ received: true });
});

export default router;