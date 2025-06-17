// apps/api/routes/timeline.ts
import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { sessionEvents } from './sessionStore';

const router = Router();
const DATA_FILE = path.resolve(__dirname, '../../session-timeline.json');

router.get('/:id', (req: Request, res: Response): void => {
  const sessionId = req.params.id;

  if (!fs.existsSync(DATA_FILE)) {
    return void res.json({ events: [] });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const events = data.filter((entry: any) => entry.sessionId === sessionId);
  res.json({ events });
});

export default router;
