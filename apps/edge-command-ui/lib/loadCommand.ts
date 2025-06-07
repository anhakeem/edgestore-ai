import fs from 'fs';
import path from 'path';

export interface EdgeTask {
  id: string;
  title: string;
  assigned_to: string;
  type: string;
  priority: string;
  description: string;
  output: string;
}

export function loadEdgeCommand(): EdgeTask[] {
  const filePath = path.join(process.cwd(), '../../edge-command/EdgeCommand.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  return parsed.tasks as EdgeTask[];
}
