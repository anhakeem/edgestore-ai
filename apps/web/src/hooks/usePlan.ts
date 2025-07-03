// apps/web/src/hooks/usePlan.ts
import { useEffect, useState } from 'react';

export function useUserPlan(userId?: string) {
  const [plan, setPlan] = useState<'free' | 'pro' | 'growth' | 'enterprise' | null>(null);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/plans/me`, {
      headers: { 'x-user-id': userId },
    })
      .then(res => res.json())
      .then(data => setPlan(data.plan))
      .catch(err => console.error('Plan fetch failed', err));
  }, [userId]);

  return plan;
}
