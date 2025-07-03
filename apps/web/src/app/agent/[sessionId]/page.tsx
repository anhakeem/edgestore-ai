// apps/web/src/app/agent/[sessionId]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EdgeAgentSummary from '../../../components/EdgeAgentSummary';

export default function AgentProfilePage() {
  const { sessionId } = useParams() as { sessionId: string };
  const [agent, setAgent] = useState<any>(null);
  const [error, setError] = useState(false);
  const [insight, setInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState('');

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/public/persona_snapshot_${sessionId}.json`);
        if (!res.ok) throw new Error('404');
        const data = await res.json();
        setAgent(data);
      } catch {
        setError(true);
      }
    };

    if (sessionId) fetchAgent();
  }, [sessionId]);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    setInsightError('');
    try {
      const res = await fetch(`https://edgestore-api.fly.dev/insight/${sessionId}`, {
        headers: {
          'x-user-id': sessionId, // fallback auth logic
        },
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setInsight(data.insight || 'No insight returned.');
    } catch (err: any) {
      console.error(err);
      setInsightError('❌ Failed to fetch insight. Are you on Pro?');
    } finally {
      setLoadingInsight(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-12 text-center">
        <h1 className="text-3xl font-bold text-red-500">❌ Agent Not Found</h1>
        <p className="mt-4 text-gray-400">No EdgeAgent snapshot found for: <code>{sessionId}</code></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-12">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6">🧬 EdgeAgent Profile</h1>
      <p className="text-gray-400 mb-4">Session ID: <code>{sessionId}</code></p>

      {agent ? (
        <div className="max-w-xl mx-auto">
          <EdgeAgentSummary agent={agent} locked={false} />
          <a
            href={`/public/exports/persona_profile_${sessionId}.pdf`}
            className="block mt-6 text-blue-400 underline text-sm"
            download
          >
            📄 Download PDF Profile
          </a>

          <button
            onClick={fetchInsight}
            className="mt-6 px-4 py-2 rounded-md bg-cyan-700 hover:bg-cyan-800 text-white font-semibold"
            disabled={loadingInsight}
          >
            {loadingInsight ? 'Generating Insight...' : '🔍 Generate Insight'}
          </button>

          {insight && (
            <pre className="mt-4 bg-slate-800 p-4 rounded-md text-sm text-green-300 whitespace-pre-wrap">
              {insight}
            </pre>
          )}

          {insightError && (
            <p className="mt-4 text-red-400 text-sm">{insightError}</p>
          )}
        </div>
      ) : (
        <p className="text-cyan-300">Loading agent...</p>
      )}
    </div>
  );
}
