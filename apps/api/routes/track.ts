// apps/api/routes/track.ts

import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import getTimeline from '../libs/helpers/getTimeline';
import inferPersona from '../libs/helpers/inferPersona';

const router = Router();
const DATA_FILE = path.resolve(__dirname, '../../session-timeline.json');
const PERSONA_DIR = path.resolve(__dirname, '../../personas');

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { sessionId, event, input, output, timestamp } = req.body;

  if (!sessionId || !event) {
    res.status(400).json({ error: 'Missing sessionId or event' });
    return;
  }

  let data = [];
  try {
    if (await fs.stat(DATA_FILE).then(() => true).catch(() => false)) {
      const raw = await fs.readFile(DATA_FILE, 'utf8');
      data = JSON.parse(raw);
    }
  } catch (err) {
    console.error('⚠️ Failed to read timeline:', err);
  }

  data.push({ sessionId, event, input, output, timestamp });

  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('⚠️ Failed to write timeline:', err);
  }

  // 🔥 EdgeAgent Persona Generation + AI-trigger logic
  if (event === 'session_end') {
    try {
      const timeline = await getTimeline(sessionId);
      const persona = inferPersona(timeline);

      await fs.mkdir(PERSONA_DIR, { recursive: true });
      const personaPath = path.join(PERSONA_DIR, `${sessionId}.json`);
      await fs.writeFile(personaPath, JSON.stringify(persona, null, 2));

      console.log(`💾 Persona saved: ${personaPath}`);

      // 🧠 Trigger logic based on behavioral traits
      const triggerActions = (agent: any) => {
        if (agent.churnRisk === 'high') {
          console.warn(`⚠️ HIGH CHURN RISK → ${agent.sessionId}`);
          // TODO: Email, popup, or log queue
        }

        if (agent.intent === 'buying') {
          console.log(`🎯 CONVERSION WINDOW OPEN → ${agent.sessionId}`);
          // TODO: Auto-nudge CTA logic
        }

        if (agent.totalEvents < 3) {
          console.log(`🛌 DORMANT USER → ${agent.sessionId}`);
          // TODO: Tag user or schedule reminder
        }
      };

      triggerActions(persona);
    } catch (err) {
      console.error('❌ Failed to generate persona or trigger actions:', err);
    }
  }

  res.json({ status: 'ok' });
});

export default router;
