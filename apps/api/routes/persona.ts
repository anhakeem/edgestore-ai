// apps/api/routes/persona.ts

import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const PERSONA_DIR = path.resolve(__dirname, '../../personas');

router.get('/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const filePath = path.join(PERSONA_DIR, `${sessionId}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const persona = JSON.parse(raw);
    res.json(persona);
  } catch (err) {
    console.error(`❌ Failed to load persona for ${sessionId}:`, err);
    res.status(404).json({ error: 'Persona not found' });
  }
});

export default router;
