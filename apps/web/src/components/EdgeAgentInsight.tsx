// apps/web/src/components/EdgeAgentInsight.tsx
import React from 'react';

interface Props {
  insight: string;
  locked: boolean;
}

const EdgeAgentInsight: React.FC<Props> = ({ insight, locked }) => {
  return (
    <div className="relative bg-slate-800 p-6 rounded-xl text-white shadow-lg overflow-hidden">
      <h3 className="text-xl font-bold text-cyan-300 mb-2">🧠 AI Insight</h3>
      <p className="text-gray-300">{insight}</p>

      {locked && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
          <p className="text-yellow-300 text-lg font-semibold mb-3">🔒 This insight is locked</p>
          <a
            href="/pricing"
            className="inline-block px-5 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
          >
            🚀 Upgrade to Unlock
          </a>
        </div>
      )}
    </div>
  );
};

export default EdgeAgentInsight;
