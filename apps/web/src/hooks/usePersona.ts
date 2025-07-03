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
  const [locked, setLocked] = useState(false); // 🔐 Add locked state

  useEffect(() => {
    if (!sessionId) return;

    setLoading(true);
    setLocked(false); // reset

    fetch(`https://edgestore-api.fly.dev/persona/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('sessionId') || ''}` // 🧠 Ensure sessionId is passed
      }
    })
      .then((res) => {
        if (res.status === 403) {
          setLocked(true);             // 🔐 Flag gated state
          throw new Error('Gated');
        }
        if (!res.ok) throw new Error('Not ready');
        return res.json();
      })
      .then(setPersona)
      .catch(() => setPersona(null))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return { persona, loading, locked }; // 👑 Expose locked status
}
