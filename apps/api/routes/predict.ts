// apps/api/routes/predict.ts

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { sessionEvents } from './sessionStore';

const router = Router();
const DATA_FILE = path.resolve(__dirname, '../../session-timeline.json');

router.post('/', (req: Request, res: Response): void => {
  const { input, sessionId } = req.body;

  if (!input || typeof input !== 'string') {
    res.status(400).json({ error: 'Missing or invalid input' });
    return;
  }

  const result = `Echo: ${input}`;

  // 🧠 Optional: track into session-timeline.json
  const event = {
    sessionId: sessionId || 'unknown',
    event: 'prediction_request',
    input,
    output: result,
    timestamp: new Date().toISOString()
  };

  try {
    let existing = [];
    if (fs.existsSync(DATA_FILE)) {
      existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    existing.push(event);
    fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));
  } catch (err) {
    console.error('❌ Failed to track prediction event:', err);
  }

  res.json({ result });
});

export default router;
