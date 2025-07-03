// web/src/components/UpgradeButton.tsx
'use client';

import { useState } from 'react';

interface UpgradeButtonProps {
  plan: 'free' | 'pro' | 'growth' | 'enterprise';
  targetPlan: 'pro' | 'growth' | 'enterprise';
  userId: string;
}

export function UpgradeButton({ plan, targetPlan, userId }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ plan: targetPlan }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('❌ Checkout URL missing:', data);
        alert('Checkout failed. Try again.');
      }
    } catch (err) {
      console.error('⚠️ Upgrade failed:', err);
      alert('Upgrade failed.');
    } finally {
      setLoading(false);
    }
  };

  if (plan === targetPlan || plan === 'enterprise') {
    return null;
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      {loading ? 'Redirecting...' : `Upgrade to ${targetPlan.charAt(0).toUpperCase() + targetPlan.slice(1)}`}
    </button>
  );
}
