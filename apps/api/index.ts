// apps/api/index.ts
import express from 'express';
import predictRouter from './routes/predict';
import checkoutRouter from './routes/checkout';

const app = express();
app.use(express.json());

app.use('/predict', predictRouter);
app.use('/checkout', checkoutRouter);

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`🔥 Server running on http://0.0.0.0:${port}`);
});
