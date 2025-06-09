import express, { Request, Response } from 'express';

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Sample predict endpoint
app.post('/predict', (req: Request, res: Response) => {
  const input = req.body.input || 'No input received';
  res.json({ result: `Predicted output for: ${input}` });
});

// ✅ Ensure the PORT is treated as a number
const port = parseInt(process.env.PORT || '8080', 10);

app.listen(port, '0.0.0.0', () => {
  console.log(`🔥 API listening on port ${port}`);
});
