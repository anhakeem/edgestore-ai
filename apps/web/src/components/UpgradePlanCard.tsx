// apps/web/src/components/UpgradePlanCard.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpgradePlanCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/checkout/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to redirect to Stripe Checkout');
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      alert('Upgrade failed. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white max-w-md mx-auto my-6">
      <h3 className="text-xl font-bold mb-2">Upgrade Your Plan</h3>
      <p className="text-gray-700 mb-4">
        You're on the free plan. Unlock premium features like persona PDF, timeline insights, and more.
      </p>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-900"
      >
        {loading ? 'Redirecting...' : 'Upgrade via Stripe'}
      </button>
    </div>
  );
}
