// apps/web/src/app/pricing/page.tsx
'use client';
import React from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RQaeRDGr0rJp0mxCTtpqNawEAt6wIxxbMvnwGiiOVDeaS5oVHNYHFTnkSiKwcl0s6O0TtS9HqSjB6IR571eT2ga009Aa3WAoC');

const plans = [
const plans = [
  {
    name: 'Basic',
    price: 'Free',
    stripePriceId: '',
    description: 'Start exploring EdgeStore without a card.',
    features: ['500 sessions/mo', 'Session Timeline UI', 'Churn Detection (Basic)'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$15',
    stripePriceId: 'price_1RcUd9DGr0rJp0mxKGSFyAgf',
    description: 'For solo builders & indie hackers.',
    features: ['2,000 sessions/mo', 'Basic Persona AI', 'Churn Risk Flags'],
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$49',
    stripePriceId: 'price_1RcUd9DGr0rJp0mxKGSFyAgf',
    description: 'For scaling teams with multiple stakeholders.',
    features: ['10,000 sessions/mo', 'EdgeAgent Heatmaps', 'Webhook Alerts'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    stripePriceId: 'price_1RcUd9DGr0rJp0mxKGSFyAgf',
    description: 'For orgs that demand total edge domination.',
    features: ['Unlimited sessions', 'Custom AI Agents', 'Priority Support'],
    highlight: false,
  },
];

const PricingPage = () => {
const handleCheckout = async (priceId: string) => {
  if (!priceId) {
    alert('❌ Missing Stripe Price ID.');
    return;
  }

  const sessionId = sessionStorage.getItem('edgestore-session') || 'anon-' + Date.now();
  const userEmail = prompt('📧 Enter your email for billing:');
  if (!userEmail) {
    alert('Email required to proceed.');
    return;
  }

  try {
    const res = await axios.post('https://edgestore-api.fly.dev/checkout/create-checkout-session', {
      priceId,
      userEmail,
      userId: sessionId,
    });

    const { url } = res.data;
    if (url) {
      window.location.href = url;
    } else {
      alert('❌ No redirect URL from Stripe.');
    }
  } catch (err) {
    console.error('❌ Stripe session creation failed:', err);
    alert('❌ Stripe checkout error occurred.');
  }
};

  return (
 <div className="max-w-4xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 gap-8">
  {plans.map((plan, i) => (
    <div key={i} className={`
      rounded-2xl p-6 border-2 transition-all duration-300 shadow-glow
      ${plan.highlight ? 'border-cyan-500 bg-slate-800 hover:shadow-xl' : 'border-slate-700 bg-slate-900 hover:shadow-md'}
    `}>
      {/* Inject Logo Based on Tier */}
      {plan.name === 'Enterprise' && (
        <div className="flex justify-center mb-3">
          <img src="/logo-gold.svg" alt="Enterprise Logo" className="w-12 h-12" />
        </div>
      )}
      {plan.name === 'Growth' && (
        <div className="flex justify-center mb-3">
          <img src="/logo-green.svg" alt="Growth Logo" className="w-10 h-10" />
        </div>
      )}
      {plan.name === 'Pro' && (
        <div className="flex justify-center mb-3">
          <img src="/logo-cyan.svg" alt="Pro Logo" className="w-10 h-10" />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-2 text-white">{plan.name}</h2>
      <p className="text-3xl font-extrabold text-brand-cyan mb-4">{plan.price}/mo</p>
      <p className="text-gray-400 mb-6">{plan.description}</p>

      <ul className="space-y-2 mb-6">
        {plan.features.map((f, idx) => (
          <li key={idx} className="text-sm text-green-400">✔ {f}</li>
        ))}
      </ul>

      {plan.stripePriceId ? (
        <button
          onClick={() => handleCheckout(plan.stripePriceId)}
          className={`w-full py-2 rounded-xl font-bold transition-all duration-300
            ${plan.highlight ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-slate-700 hover:bg-slate-600'}`}
        >
          Start Now
        </button>
      ) : (
        <a
          href="/"
          className="block text-center py-2 rounded-xl border border-cyan-500 text-cyan-300 hover:bg-slate-800 transition-all"
        >
          Start Free
        </a>
      )}
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default PricingPage;
