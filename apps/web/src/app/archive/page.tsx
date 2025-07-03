// apps/web/src/app/archive/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import EdgeAgentSummary from '../../components/EdgeAgentSummary';

interface SnapshotMeta {
  file: string;
  createdAt: string;
}

export default function ArchivePage() {
  const [snapshots, setSnapshots] = useState<SnapshotMeta[]>([]);
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    fetch('/api/snapshots')
      .then(res => res.json())
      .then(data => setSnapshots(data))
      .catch(err => console.error('❌ Failed to load snapshots', err));
  }, []);

  const handlePreview = async (file: string) => {
    setLoadingPreview(true);
    try {
      const res = await fetch(`/public/${file}`);
      const data = await res.json();
      setSelectedAgent(data);
    } catch (err) {
      console.error('❌ Failed to preview agent:', err);
      setSelectedAgent(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  const filtered = snapshots.filter(({ file }) =>
    file.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-12">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6">📦 Agent Archive</h1>
      <p className="text-gray-400 mb-8">Click any file to preview the full EdgeAgent profile below.</p>

      <input
        type="text"
        placeholder="🔍 Filter by sessionId..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-96 px-4 py-2 mb-8 rounded-xl bg-slate-900 text-white border border-cyan-600 shadow-inner placeholder:text-gray-400"
      />

      <ul className="space-y-4">
        {filtered.map(({ file, createdAt }, i) => {
          const sessionId = file.replace(/persona_snapshot_/, '').replace(/\.json/, '').split('_')[0];
          const pdfPath = `/public/exports/persona_profile_${sessionId}.pdf`;

          return (
            <li
              key={i}
              className="bg-slate-900 p-5 rounded-2xl shadow-glow border border-cyan-800 transition hover:scale-[1.02] cursor-pointer"
              onClick={() => handlePreview(file)}
            >
              <div>
                <p className="text-lg font-mono text-cyan-300">{file}</p>
                <p className="text-sm text-gray-400">🕒 {new Date(createdAt).toLocaleString()}</p>
              </div>
              <div className="mt-4 flex gap-4">
                <a href={`/public/${file}`} className="text-sm text-green-400 underline hover:text-green-300" download>
                  📄 JSON
                </a>
                <a href={pdfPath} className="text-sm text-blue-400 underline hover:text-blue-300" download>
                  🧾 PDF
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      {/* AGENT PREVIEW BLOCK */}
      <div className="mt-16">
        {loadingPreview && (
          <p className="text-sm text-cyan-300">⏳ Loading EdgeAgent preview...</p>
        )}
        {!loadingPreview && selectedAgent && (
          <div className="max-w-xl mx-auto">
            {/* Logo Preview Header */}
            <div className="flex justify-center mb-4 bg-white p-2 rounded">
              <div className="w-12 h-auto">
                <img src="/logo-gold.svg" alt="Gold Test" />
              </div>
            </div>
            <EdgeAgentSummary agent={selectedAgent} locked={false} />
          </div>
        )}
      </div>
    </div>
  );
}
