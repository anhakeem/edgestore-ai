// apps/web/src/app/demo/page.tsx

'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface Persona {
  sessionId: string;
  intent: string;
  churnRisk: string;
  interest: string[];
  totalEvents: number;
  lastSeen: string;
}

const DemoPage = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sid = `demo-${uuidv4().slice(0, 8)}`;
    setSessionId(sid);
  }, []);

  const runDemo = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      await axios.post('https://edgestore-api.fly.dev/track', {
        sessionId,
        event: 'prediction_request',
        input,
        output: `Output for ${input}`,
        timestamp: new Date().toISOString()
      });

      await axios.post('https://edgestore-api.fly.dev/track', {
        sessionId,
        event: 'session_end',
        timestamp: new Date().toISOString()
      });

      // Delay fetch to allow backend processing
      setTimeout(async () => {
        try {
          const res = await axios.get(`https://edgestore-api.fly.dev/persona/${sessionId}`);
          setPersona(res.data);
        } catch {
          setPersona(null);
        } finally {
          setLoading(false);
        }
      }, 1200);
    } catch (err) {
      console.error('Demo error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 text-center">
      <h1 className="text-4xl font-bold mb-4 text-cyan-400">🧪 EdgeAgent Live Demo</h1>
      <p className="mb-6 text-gray-400">
        Enter a phrase, and we’ll simulate a user prediction + end their session to show you what the AI detects.
      </p>

      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        className="px-4 py-2 rounded-lg text-black w-full max-w-md mb-4"
        placeholder="Try something like: I want AI storage tools"
      />

      <button
        onClick={runDemo}
        disabled={loading}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-white font-bold rounded-full transition hover:from-cyan-600 hover:to-blue-700"
      >
        {loading ? 'Analyzing...' : 'Run Live Prediction'}
      </button>

      {persona && (
        <div className="bg-slate-800 mt-10 p-6 rounded-xl max-w-xl mx-auto text-left">
          <h2 className="text-2xl font-bold text-green-300 mb-2">🧬 EdgeAgent Generated</h2>
          <p><strong>🆔 Session:</strong> {persona.sessionId}</p>
          <p><strong>🧠 Intent:</strong> {persona.intent}</p>
          <p><strong>⚠️ Risk:</strong> {persona.churnRisk}</p>
          <p><strong>🎯 Interests:</strong> {persona.interest.join(', ') || 'None'}</p>
          <p><strong>📊 Events:</strong> {persona.totalEvents}</p>
          <p><strong>🕒 Last Seen:</strong> {new Date(persona.lastSeen).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default DemoPage;
