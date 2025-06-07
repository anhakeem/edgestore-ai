import React from 'react';
import { EdgeTask } from '../lib/loadCommand';

type Props = {
  task: EdgeTask;
};

export default function DispatchPrompt({ task }: Props) {
  const prompt = `
You're assisting with the EdgeStore.ai project. Task: ${task.title}
Assigned Agent: ${task.assigned_to}

Details:
${task.description}

Output path: ${task.output}
Respond only with the code required for that file.
`.trim();

  return (
    <div>
      <button
        onClick={() => navigator.clipboard.writeText(prompt)}
        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
      >
        📋 Copy Prompt for {task.assigned_to}
      </button>
    </div>
  );
}
