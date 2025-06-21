// apps/web/src/app/pricing/page.tsx

'use client';
import React from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RQaeRDGr0rJp0mxCTtpqNawEAt6wIxxbMvnwGiiOVDeaS5oVHNYHFTnkSiKwcl0s6O0TtS9HqSjB6IR571eT2ga009Aa3WAoC'); // Replace

const plans = [
  {
    name: 'Pro',
    price: '$15',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
    description: 'For solo builders & indie hackers.',
    features: ['2,000 sessions/mo', 'Basic Persona AI', 'Churn Risk Flags'],
  },
  {
    name: 'Growth',
    price: '$15',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_GROWTH,
    description: 'For scaling teams with multiple stakeholders.',
    features: ['10,000 sessions/mo', 'EdgeAgent Heatmaps', 'Webhook Alerts'],
  },
  {
    name: 'Enterprise',
    price: '$15',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE,
    description: 'For orgs that demand total edge domination.',
    features: ['Unlimited sessions', 'Custom AI Agents', 'Priority Support'],
  },
];

const PricingPage = () => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const payload = {
      priceId: 'price_1RVfCADGr0rJp0mxqSnBl1bP', // ← Replace with your real ID
      userEmail: 'demo@edgestore.ai',
      userId: 'demo-session-001',
    };

    const res = await axios.post('https://edgestore-api.fly.dev/checkout/create-checkout-session', payload);
    const { url } = res.data;

    if (url) {
      window.location.href = url;
    } else {
      alert('Failed to redirect to Stripe');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 px-6">
      <h1 className="text-5xl font-extrabold text-center mb-10 text-cyan-400">🪙 EdgeStore Pricing</h1>
      <p className="text-center text-gray-400 mb-16">Upgrade to unlock predictive power at scale.</p>

      <div className="max-w-4xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`rounded-xl p-6 shadow-lg border-2 ${plan.highlight ? 'border-cyan-500 bg-slate-800' : 'border-slate-700 bg-slate-900'}`}>
            <h2 className="text-2xl font-bold mb-2 text-white">{plan.name}</h2>
            <p className="text-3xl font-extrabold text-cyan-300 mb-4">{plan.price}/mo</p>
            <p className="text-gray-400 mb-6">{plan.description}</p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="text-sm text-green-400">✔ {f}</li>
              ))}
            </ul>
            <button
              onClick={handleCheckout}
              className={`w-full py-2 rounded-lg font-bold ${plan.highlight ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              Start Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
