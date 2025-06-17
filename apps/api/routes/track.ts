// apps/api/routes/track.ts
import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const DATA_FILE = path.resolve(__dirname, '../../session-timeline.json');

router.post('/', (req: Request, res: Response): void => {
  const { sessionId, event, input, output, timestamp } = req.body;

  if (!sessionId || !event) {
    return void res.status(400).json({ error: 'Missing sessionId or event' });
  }

  let data = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('⚠️ Failed to read timeline:', err);
  }

  data.push({ sessionId, event, input, output, timestamp });

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('⚠️ Failed to write timeline:', err);
  }

  res.json({ status: 'ok' });
});

export default router;
