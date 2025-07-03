// apps/web/src/app/agents/page.tsx
'use client';
import React, { useEffect, useState } from 'react';

interface SnapshotMeta {
  file: string;
  createdAt: string;
}

interface Persona {
  name?: string;
  insights?: {
    dominantIntent: string;
    churnRisk: string;
    interest: string[];
  };
  recommendations?: string[];
}

export default function AgentsGallery() {
  const [snapshots, setSnapshots] = useState<SnapshotMeta[]>([]);
  const [personas, setPersonas] = useState<Record<string, Persona>>({});
  const [locked, setLocked] = useState(false); // 🔐 Gating flag

  useEffect(() => {
    fetch('/api/snapshots', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('sessionId') || ''}`,
      },
    })
      .then(res => {
        if (res.status === 403) {
          setLocked(true); // 🔒 Block UI
          return [];
        }
        return res.json();
      })
      .then(data => setSnapshots(data))
      .catch(err => {
        console.warn('Snapshot load failed:', err);
        setLocked(true);
      });
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      for (const { file } of snapshots) {
        if (!file.endsWith('.json')) continue;
        try {
          const res = await fetch(`/public/${file}`);
          const data = await res.json();
          setPersonas(prev => ({ ...prev, [file]: data }));
        } catch (err) {
          console.warn(`⚠️ Failed to load ${file}`, err);
        }
      }
    };
    if (snapshots.length) loadAll();
  }, [snapshots]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-12">
      <h1 className="text-5xl font-bold text-cyan-400 mb-6">🌐 EdgeAgent Gallery</h1>
      <p className="text-gray-400 mb-10">Browse recent EdgeAgents tracked and inferred by the system.</p>

      {locked ? (
        <div className="bg-slate-900 border border-yellow-600 p-6 rounded-2xl shadow-inner text-yellow-100">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">🔒 Access Restricted</h2>
          <p className="text-yellow-200 text-sm mb-2">
            The EdgeAgent archive is available only to Pro users. Upgrade your plan to explore the latest tracked personas.
          </p>
          <a
            href="/pricing"
            className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-lg mt-2 font-semibold hover:bg-yellow-400 transition"
          >
            🚀 Upgrade to Pro
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snapshots.map(({ file, createdAt }, i) => {
            const sessionId = file.replace(/persona_snapshot_/, '').replace(/\.json/, '').split('_')[0];
            const persona = personas[file];

            return (
              <div key={i} className="bg-slate-800 p-4 rounded-lg shadow hover:shadow-lg transition">
                <p className="font-mono text-cyan-300 text-sm mb-1">{sessionId}</p>
                <p className="text-xs text-gray-400 mb-2">🕒 {new Date(createdAt).toLocaleString()}</p>

                {persona ? (
                  <>
                    <p className="text-white mb-1"><strong>Intent:</strong> {persona.insights?.dominantIntent}</p>
                    <p className="text-white mb-1"><strong>Risk:</strong> {persona.insights?.churnRisk}</p>
                    <p className="text-white mb-2"><strong>Interests:</strong> {(persona.insights?.interest || []).join(', ')}</p>
                    <a
                      href={`/public/${file}`}
                      download
                      className="text-green-400 text-sm underline mr-4"
                    >
                      📄 JSON
                    </a>
                    <a
                      href={`/public/exports/persona_profile_${sessionId}.pdf`}
                      download
                      className="text-blue-400 text-sm underline"
                    >
                      🧾 PDF
                    </a>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Loading summary...</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
