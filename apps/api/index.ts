// edgestore-ai/apps/api/index.ts
import express from 'express';
import cors from 'cors';
import predictRoute from './routes/predict';
import trackRoute from './routes/track';
import timelineRoute from './routes/timeline';
import eventsRoute from './routes/events';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('✅ EdgeStore API is alive');
});

app.use('/predict', predictRoute);
app.use('/track', express.json(), trackRoute);
app.use('/timeline', express.json(), timelineRoute);
app.use('/events', express.json(), eventsRoute);


// 🚀 Start server after all routes are mounted
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🔥 Listening on port ${port}`);
});
