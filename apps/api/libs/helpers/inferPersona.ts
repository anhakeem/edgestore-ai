// apps/api/libs/helpers/inferPersona.ts

export interface EdgeAgentPersona {
  sessionId: string;
  intent: 'exploring' | 'buying' | 'learning' | 'browsing';
  churnRisk: 'low' | 'medium' | 'high';
  interest: string[];
  totalEvents: number;
  lastSeen: string;
}

export default function inferPersona(timeline: any[]): EdgeAgentPersona {
  const total = timeline.length;
  const inputs = timeline.map(e => e.input || '').filter(Boolean);
  const interest = Array.from(new Set(inputs.map(i => i.split(' ')[0].toLowerCase()))).slice(0, 3);

  return {
    sessionId: timeline[0]?.sessionId || 'unknown',
    intent: total > 10 ? 'buying' : total > 5 ? 'exploring' : 'browsing',
    churnRisk: total < 3 ? 'high' : total < 7 ? 'medium' : 'low',
    interest,
    totalEvents: total,
    lastSeen: timeline[total - 1]?.timestamp || new Date().toISOString()
  };
}
