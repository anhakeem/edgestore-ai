// apps/web/src/hooks/usePersona.ts

import { useEffect, useState } from 'react';

export interface EdgeAgentPersona {
  sessionId: string;
  intent: string;
  churnRisk: string;
  interest: string[];
  totalEvents: number;
  lastSeen: string;
}

export default function usePersona(sessionId: string | null) {
  const [persona, setPersona] = useState<EdgeAgentPersona | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    setLoading(true);
    fetch(`https://edgestore-api.fly.dev/persona/${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not ready');
        return res.json();
      })
      .then(setPersona)
      .catch(() => setPersona(null))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return { persona, loading };
}
