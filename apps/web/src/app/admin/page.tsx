// apps/web/src/app/admin/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

const SnapshotPreviewModal = dynamic(() => import('@/components/SnapshotPreviewModal'), { ssr: false });

interface Persona {
  sessionId: string;
  intent: string;
  churnRisk: string;
  interest: string[];
  lastSeen: string;
  totalEvents: number;
  userId: string;
  plan: string;
}

interface SnapshotFile {
  name: string;
  size: number;
  created: string;
  content?: string;
}

interface PlanFile {
  name: string;
  plan: string;
  updated: string;
}

export default function AdminPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [snapshots, setSnapshots] = useState<SnapshotFile[]>([]);
  const [plans, setPlans] = useState<PlanFile[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<SnapshotFile | null>(null);

  const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || '';

  useEffect(() => {
    axios.get('https://edgestore-api.fly.dev/admin/personas')
      .then(res => setPersonas(res.data.personas || []))
      .catch(() => setPersonas([]));

    axios.get('https://edgestore-api.fly.dev/admin/snapshots', {
      headers: { Authorization: `Bearer ${ADMIN_KEY}` }
    })
      .then(res => setSnapshots(res.data.files || []))
      .catch(() => console.warn('⚠️ Failed to load snapshots'));

    axios.get('https://edgestore-api.fly.dev/plans', {
      headers: { 'x-admin-key': ADMIN_KEY }
    })
      .then(res => setPlans(res.data.plans || []))
      .catch(() => console.warn('⚠️ Failed to load plans'));
  }, []);

  const openSnapshot = async (file: SnapshotFile) => {
    try {
      const res = await axios.get(`/public/${file.name}`, {
        headers: { 'x-admin-key': ADMIN_KEY },
      });
      setSelectedSnapshot({ ...file, content: JSON.stringify(res.data, null, 2) });
      setModalOpen(true);
    } catch (err) {
      console.error('Snapshot fetch failed:', err);
    }
  };

  const handlePlanOverride = async (userId: string, newPlan: string) => {
    try {
      await axios.post('https://edgestore-api.fly.dev/admin/plan', { userId, plan: newPlan }, {
        headers: { 'x-admin-key': ADMIN_KEY },
      });
      alert(`✅ Plan for ${userId} updated to ${newPlan}`);
    } catch (err) {
      console.error('❌ Plan override failed:', err);
      alert('Failed to update plan.');
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold text-brand-cyan mb-10">🛠️ Admin Control Panel</h1>

      {/* Personas + Plan Override */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">🧬 Active Personas & Plan Override</h2>
        {personas.length === 0 ? (
          <p className="text-gray-400">No personas found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {personas.map((p) => (
              <div key={p.sessionId} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <p><strong>Session:</strong> {p.sessionId}</p>
                <p><strong>User ID:</strong> {p.userId}</p>
                <p><strong>Intent:</strong> {p.intent}</p>
                <p><strong>Churn Risk:</strong> {p.churnRisk}</p>
                <p><strong>Plan:</strong> <span className="text-yellow-300">{p.plan}</span></p>
                <p><strong>Last Seen:</strong> {new Date(p.lastSeen).toLocaleString()}</p>
                <div className="mt-4 space-x-2">
                  {['free', 'pro', 'growth', 'enterprise'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => handlePlanOverride(p.userId, tier)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        p.plan === tier
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {tier.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Snapshot Archive */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">🗂 Snapshot Archive</h2>
        {snapshots.length === 0 ? (
          <p className="text-gray-400">No snapshots found.</p>
        ) : (
          <ul className="space-y-2">
            {snapshots.map((file) => (
              <li
                key={file.name}
                onClick={() => openSnapshot(file)}
                className="bg-slate-900 p-4 rounded-xl border border-cyan-800 hover:bg-slate-800 cursor-pointer transition-all"
              >
                <p className="text-cyan-300 font-mono break-all">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB • Created: {new Date(file.created).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stripe Plan Sync */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">💳 Synced Plans (Stripe)</h2>
        {plans.length === 0 ? (
          <p className="text-gray-400">No synced plans available.</p>
        ) : (
          <ul className="space-y-2">
            {plans.map((plan) => (
              <li
                key={plan.name}
                className="bg-slate-900 p-4 rounded-xl border border-green-700 hover:bg-slate-800"
              >
                <p className="text-green-300 font-mono break-all">{plan.name}</p>
                <p className="text-sm text-green-400">Plan: {plan.plan}</p>
                <p className="text-xs text-gray-500">Updated: {new Date(plan.updated).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Snapshot Modal */}
      {selectedSnapshot && (
        <SnapshotPreviewModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          file={selectedSnapshot.name}
          content={selectedSnapshot.content || ''}
        />
      )}
    </div>
  );
}
