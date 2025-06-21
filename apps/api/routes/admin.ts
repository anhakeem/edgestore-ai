// apps/api/routes/admin.ts

import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const PERSONA_DIR = path.resolve(__dirname, '../../personas');

router.get('/personas', async (_req: Request, res: Response) => {
  try {
    const files = await fs.readdir(PERSONA_DIR);
    const personas = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(PERSONA_DIR, file), 'utf-8');
        personas.push(JSON.parse(content));
      }
    }

    res.json({ personas });
  } catch (err) {
    console.error('❌ Failed to list personas:', err);
    res.status(500).json({ error: 'Failed to fetch personas' });
  }
});

export default router;
