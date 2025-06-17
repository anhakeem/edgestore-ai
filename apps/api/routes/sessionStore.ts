// edgestore-ai/apps/api/routes/sessionStore.ts

interface TimelineEvent {
  sessionId: string;
  event: string;
  input: string;
  output: string;
  timestamp: string;
}

export const sessionEvents: Record<string, TimelineEvent[]> = {};
