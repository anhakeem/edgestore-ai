import React from 'react';
import { EdgeTask } from '../lib/loadCommand';
import DispatchPrompt from './DispatchPrompt';

type Props = {
  task: EdgeTask;
};

export default function TaskCard({ task }: Props) {
  return (
    <div className="border p-4 rounded-xl shadow-md mb-4 bg-white">
      <h2 className="text-xl font-bold mb-1">{task.title}</h2>
      <p className="text-sm text-gray-500 mb-2">ID: {task.id} | Type: {task.type}</p>
      <p className="mb-2">{task.description}</p>
      <p className="text-sm text-blue-700">Assigned to: {task.assigned_to}</p>
      <p className="text-sm text-purple-700">Priority: {task.priority}</p>
      <p className="text-sm text-green-700">Output Path: {task.output}</p>
      <div className="mt-4">
        <DispatchPrompt task={task} />
      </div>
    </div>
  );
}
