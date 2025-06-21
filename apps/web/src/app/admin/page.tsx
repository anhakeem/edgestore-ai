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
}

const AdminPage = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://edgestore-api.fly.dev/admin/personas')
      .then(res => setPersonas(res.data.personas || []))
      .catch(() => setPersonas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">📊 EdgeAgent Persona Dashboard</h1>
      {loading ? <p>Loading personas...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((p, i) => (
            <div key={i} className="bg-slate-800 p-4 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-2 text-cyan-400">{p.sessionId}</h2>
              <p><strong>Intent:</strong> {p.intent}</p>
              <p><strong>Churn:</strong> {p.churnRisk}</p>
              <p><strong>Events:</strong> {p.totalEvents}</p>
              <p><strong>Last Seen:</strong> {new Date(p.lastSeen).toLocaleString()}</p>
              <p><strong>Interests:</strong> {p.interest.join(', ') || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
