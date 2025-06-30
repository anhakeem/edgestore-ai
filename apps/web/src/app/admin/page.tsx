// apps/web/src/app/admin/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Persona {
  sessionId: string;
  intent: string;
  churnRisk: string;
  interest: string[];
  lastSeen: string;
  totalEvents: number;
  gptInsight?: string;
}

const AdminPage = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [loadingInsights, setLoadingInsights] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    axios.get('https://edgestore-api.fly.dev/admin/personas')
      .then(res => setPersonas(res.data.personas || []))
      .catch(() => setPersonas([]))
      .finally(() => setLoading(false));
  }, []);

  const loadInsight = async (sessionId: string) => {
    setLoadingInsights(prev => ({ ...prev, [sessionId]: true }));
    try {
      const res = await axios.get(`https://edgestore-api.fly.dev/agent/${sessionId}/ai`);
      setInsights(prev => ({ ...prev, [sessionId]: res.data.insights }));
    } catch {
      setInsights(prev => ({ ...prev, [sessionId]: '❌ Failed to load insight.' }));
    } finally {
      setLoadingInsights(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  const exportPersonasWithInsights = async () => {
    setExporting(true);
    try {
      const res = await axios.get('https://edgestore-api.fly.dev/admin/personas');
      const rawPersonas = res.data.personas || [];

      const enriched = await Promise.all(
        rawPersonas.map(async (p: Persona) => {
          try {
            const aiRes = await axios.get(`https://edgestore-api.fly.dev/agent/${p.sessionId}/ai`);
            return { ...p, gptInsight: aiRes.data.insights };
          } catch {
            return { ...p, gptInsight: '❌ Failed to fetch GPT insight.' };
          }
        })
      );

      const blob = new Blob([JSON.stringify(enriched, null, 2)], {
        type: 'application/json',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `edgestore_full_export_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex items-center gap-4 mb-4">
  <img
    src="/logo-chrome.svg"
    alt="EdgeStore Chrome Logo"
    className="w-10 h-10 sm:w-12 sm:h-12"
  />
  <h1 className="text-4xl font-black text-brand-cyan">
    📊 EdgeAgent Intelligence Archive
  </h1>
</div>


      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400 text-sm">🧠 Total Archived Personas: {personas.length}</p>
        <button
          onClick={exportPersonasWithInsights}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2 rounded-full shadow-md transition-all"
        >
          {exporting ? 'Exporting GPT Data...' : '⬇ Export All with AI'}
        </button>
      </div>

      {loading ? (
        <p className="text-cyan-400 text-sm">Loading archived personas...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((p) => (
            <div key={p.sessionId} className="bg-slate-900 p-5 rounded-2xl shadow-glow border border-cyan-700 text-sm sm:text-base">
              <h2 className="text-lg font-semibold text-brand-cyan mb-2 break-all">{p.sessionId}</h2>
              <p><strong>🎯 Intent:</strong> {p.intent}</p>
              <p><strong>⚠️ Churn Risk:</strong> {p.churnRisk}</p>
              <p><strong>📊 Events:</strong> {p.totalEvents}</p>
              <p><strong>🕒 Last Seen:</strong> {new Date(p.lastSeen).toLocaleString()}</p>
              <p><strong>🧩 Interests:</strong> {p.interest.join(', ') || 'None'}</p>

              <button
                onClick={() => loadInsight(p.sessionId)}
                className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 underline transition-all"
              >
                {loadingInsights[p.sessionId] ? '🔄 Loading Insight...' : '🔍 View AI Insight'}
              </button>

              {insights[p.sessionId] && (
                <pre className="mt-3 bg-slate-950 p-3 rounded-xl border border-cyan-800 text-cyan-200 whitespace-pre-wrap overflow-y-auto max-h-64 font-mono">
                  {insights[p.sessionId]}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
