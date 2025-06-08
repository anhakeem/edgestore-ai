// apps/api/index.ts
import express from 'express';
import predictRouter from './routes/predict';
import checkoutRouter from './routes/checkout';

const app = express();
app.use(express.json());

app.use('/predict', predictRouter);
app.use('/checkout', checkoutRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🔥 Server running on port ${port}`);
});
