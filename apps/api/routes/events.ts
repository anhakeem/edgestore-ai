// edgestore-ai/apps/api/routes/events.ts
import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const filePath = path.join(__dirname, '../session-timeline.json');

router.get('/', (_req: Request, res: Response) => {
  try {
    let sessions: Record<string, any[]> = {};

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const allEvents = JSON.parse(raw) as any[];

      // Group by sessionId
      allEvents.forEach(event => {
        const { sessionId, ...rest } = event;
        if (!sessions[sessionId]) sessions[sessionId] = [];
        sessions[sessionId].push(rest);
      });
    }

    res.json({ sessions });
  } catch (err) {
    console.error('❌ Failed to read events:', err);
    res.status(500).json({ error: 'Failed to load events' });
  }
});

export default router;
