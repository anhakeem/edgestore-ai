// apps/web/src/components/EdgeAgentSummary.tsx
// apps/web/src/components/EdgeAgentSummary.tsx
import React from 'react';

interface Props {
  agent: {
    sessionId: string;
    signal: string;
    keywords: string[];
    emotion: string;
    score: number;
    rank: string;
  };
  locked: boolean;
}

const EdgeAgentSummary: React.FC<Props> = ({ agent, locked }) => {
  return (
    <div className="relative bg-slate-800 p-6 rounded-xl text-white shadow-lg overflow-hidden">
      <h3 className="text-xl font-bold text-green-300 mb-4">🧬 EdgeAgent Summary</h3>
      <p><strong>🆔 Session:</strong> {agent.sessionId}</p>
      <p><strong>📡 Signal:</strong> {agent.signal}</p>
      <p><strong>🔍 Keywords:</strong> {agent.keywords.join(', ')}</p>
      <p><strong>💢 Emotion:</strong> {agent.emotion}</p>
      <p><strong>📈 Score:</strong> {agent.score}</p>
      <p><strong>🎖️ Rank:</strong> {agent.rank}</p>

      {locked && (
        <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
          <p className="text-yellow-300 text-lg font-semibold mb-3">🔒 EdgeAgent is locked</p>
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

export default EdgeAgentSummary;
