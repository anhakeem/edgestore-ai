// apps/api/routes/predict.ts

import { Request, Response, Router } from 'express';
import getTimeline from '../libs/helpers/getTimeline';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { sessionId, input } = req.body;

  if (!sessionId || !input) {
    res.status(400).json({ error: 'Missing sessionId or input' });
    return;
  }

  try {
    const timeline = await getTimeline(sessionId);

    const mockSummary = `
🧠 Timeline Insight:
- Total Events: ${timeline.length}
- Last Input: "${input}"

📊 Prediction Summary:
- Intent: Exploring
- Churn Risk: Medium
- Likely Interest: AI Tooling

✅ Next Step: Recommend a demo or free trial CTA.
    `;

    res.json({ result: mockSummary });
  } catch (err) {
    console.error('Predict API error:', err);
    res.status(500).json({ error: 'Prediction failed.' });
  }
});

export default router;
