// apps/api/libs/helpers/getTimeline.ts

import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.resolve(__dirname, '../../../session-timeline.json');

export default async function getTimeline(sessionId: string): Promise<any[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const allEvents = JSON.parse(raw);
    return allEvents.filter((e: any) => e.sessionId === sessionId);
  } catch (err) {
    console.error('❌ getTimeline failed:', err);
    return [];
  }
}
