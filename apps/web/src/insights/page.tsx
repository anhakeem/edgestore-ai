// apps/web/src/app/insights/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InsightsPage() {
  const [plan, setPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    fetch('/api/plans/me', {
      headers: {
        'x-user-id': userId,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.plan || data.plan === 'free') {
          router.push('/pricing');
        } else {
          setPlan(data.plan);
        }
      })
      .catch((err) => {
        console.error('Plan check failed:', err);
        router.push('/error');
      });
  }, []);

  if (!plan) {
    return <div className="p-4">Checking your access...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📊 Premium Insights</h1>
      <p className="mb-2">You are on the <strong>{plan}</strong> plan. Welcome to the war room.</p>
      <div className="border p-4 rounded-lg bg-gray-50">
        🔮 AI Signals will appear here...
      </div>
    </div>
  );
}
