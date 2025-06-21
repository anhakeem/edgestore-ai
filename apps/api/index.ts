// apps/api/index.ts

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import predictHandler from './routes/predict';
import eventsHandler from './routes/events';
import timelineHandler from './routes/timeline';
import trackHandler from './routes/track';
import checkoutRouter from './routes/checkout';
import personaHandler from './routes/persona';
import adminHandler from './routes/admin';




const app = express();
const port = parseInt(process.env.PORT || '8080', 10);

app.use(cors());
app.use(express.json());

app.use('/predict', predictHandler);
app.use('/events', eventsHandler);
app.use('/timeline', timelineHandler);
app.use('/track', trackHandler);
app.use('/checkout', checkoutRouter);
app.use('/persona', personaHandler);
app.use('/admin', adminHandler);
app.use('/checkout', checkoutRouter);

console.log('🔐 STRIPE_SECRET_KEY Loaded:', !!process.env.STRIPE_SECRET_KEY);
app.listen(port, '0.0.0.0', () => {
  console.log(`🔥 EdgeStore API listening on 0.0.0.0:${port}`);
});
