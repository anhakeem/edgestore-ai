// edgestore-ai/apps/web/src/app/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import EdgeAgentSummary from '../components/EdgeAgentSummary';
import EdgeAgentInsight from '../components/EdgeAgentInsight';

const HomePage: React.FC = () => {
  const [sessionId, setSessionId] = useState('');
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<any>(null);
  const [agent, setAgent] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const [userPlan, setUserPlan] = useState<string>('free');
  const [sessionUsage, setSessionUsage] = useState<number>(0);
  const [sessionLimit, setSessionLimit] = useState<number>(500);

  useEffect(() => {
    let existing = sessionStorage.getItem('sessionId');
    if (!existing) {
      existing = uuidv4();
      sessionStorage.setItem('sessionId', existing);
    }
    const id = existing || '';
    setSessionId(id);

    axios.get(`https://edgestore-api.fly.dev/plans/${id}`)
      .then((res) => {
        const { plan, usage, sessionLimit } = res.data;
        setUserPlan(plan);
        setSessionUsage(usage);
        setSessionLimit(sessionLimit);
      })
      .catch(err => {
        console.error('⚠️ Plan check failed:', err);
      });
  }, []);

  const handlePredict = async () => {
    if (!input.trim()) return;

    // 💥 Cap Enforcement
    if (sessionUsage >= sessionLimit) {
      alert('❌ Session limit reached. Upgrade to continue.');
      setLocked(true);
      return;
    }

    setLoading(true);
    setAiInsights(null);
    setAgent(null);
    setPersona(null);
    setLocked(false);

    const headers = {
      Authorization: `Bearer ${sessionId}`,
    };

    try {
      await axios.post('https://edgestore-api.fly.dev/track', {
        sessionId,
        event: 'prediction_request',
        input,
        output: `Mock output for "${input}"`,
        timestamp: new Date().toISOString(),
      }, { headers });

      await axios.post('https://edgestore-api.fly.dev/track', {
        sessionId,
        event: 'session_end',
        timestamp: new Date().toISOString(),
      }, { headers });

      const [personaRes, agentRes, aiRes] = await Promise.all([
        axios.get(`https://edgestore-api.fly.dev/persona/${sessionId}`, { headers }),
        axios.get(`https://edgestore-api.fly.dev/predict?sessionId=${sessionId}`, { headers }),
        axios.get(`https://edgestore-api.fly.dev/agent/${sessionId}/ai`, { headers }).catch(err => {
          if (err.response?.status === 403) {
            setLocked(true);
            return { data: { insights: null } };
          }
          throw err;
        }),
      ]);

      setPersona(personaRes.data);
      setAgent(agentRes.data);
      setAiInsights(aiRes.data.insights);

      // 🔁 Re-check session usage after action
      const planRes = await axios.get(`https://edgestore-api.fly.dev/plans/${sessionId}`);
      setSessionUsage(planRes.data.usage);

    } catch (err) {
      console.error('❌ AI insight fetch failed:', err);
      setAiInsights('❌ AI insight failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      const res = await axios.post('/checkout/create-checkout-session', {});
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert('Upgrade failed: No Stripe URL returned.');
      }
    } catch (err) {
      console.error('⚠️ Upgrade error:', err);
      alert('Failed to start upgrade session.');
    } finally {
      setUpgrading(false);
    }
  };

  const isOutOfSessions = sessionUsage >= sessionLimit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-8">

      {/* 🔼 Plan Banner */}
      <div className="text-center mb-6 text-sm text-cyan-400">
        Plan: <strong>{userPlan}</strong> — {sessionUsage} / {sessionLimit} sessions used
      </div>

      {/* HERO */}
      <section className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <img
            src="/logo-glow.svg"
            alt="EdgeStore AI Glowing Logo"
            className="w-24 h-24 animate-pulse drop-shadow-[0_0_12px_#22d3ee]"
          />
        </div>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Predict churn. Understand user behavior. Generate EdgeAgents in real time.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="/pricing" className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-full font-bold text-white">See Pricing</a>
          <a href="/book" className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-full font-bold text-white border border-cyan-500">Book a Demo</a>
        </div>
      </section>

      {/* LIVE INPUT */}
      <section className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">🔍 Try It Yourself</h2>
        <p className="text-gray-400 mb-4">Type something a user might do — then watch the AI analyze it.</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-4 py-2 rounded-md text-black w-full max-w-md mb-4"
          placeholder="e.g., 'I want to switch to a better AI tool'"
        />
        <button
          onClick={handlePredict}
          disabled={loading || isOutOfSessions}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-bold text-white"
        >
          {isOutOfSessions ? 'Upgrade Required' : loading ? 'Analyzing...' : 'Predict Behavior'}
        </button>
      </section>

      {/* PERSONA RESULT */}
      {persona && (
        <section className="bg-slate-800 p-6 rounded-xl max-w-xl mx-auto text-left mb-10">
          <h3 className="text-2xl font-bold text-green-400 mb-2">🧬 EdgeAgent Generated</h3>
          <p><strong>🆔</strong> {persona.sessionId}</p>
          <p><strong>🧠 Intent:</strong> {persona.intent}</p>
          <p><strong>⚠ Risk:</strong> {persona.churnRisk}</p>
          <p><strong>🎯 Interests:</strong> {persona.interest.join(', ') || 'None'}</p>
          <p><strong>📊 Events:</strong> {persona.totalEvents}</p>
          <p><strong>🕒 Last Seen:</strong> {new Date(persona.lastSeen).toLocaleString()}</p>
        </section>
      )}

      {/* EDGE AGENT SUMMARY */}
      {agent && (
        <section className="mt-8 max-w-xl mx-auto">
          <EdgeAgentSummary agent={agent} locked={locked} />
        </section>
      )}

      {/* AI INSIGHT */}
      {loading && (
        <p className="text-center text-sm text-cyan-400 mt-4">
          🧠 Generating AI Insight...
        </p>
      )}

      {aiInsights && typeof aiInsights === 'string' && aiInsights.startsWith('❌') && (
        <p className="text-center text-sm text-red-500 mt-4">{aiInsights}</p>
      )}

      {aiInsights && typeof aiInsights === 'string' && !aiInsights.startsWith('❌') && (
        <section className="mt-8 max-w-xl mx-auto">
          <EdgeAgentInsight insight={aiInsights} locked={locked} />
        </section>
      )}

      {/* LOCKED CTA */}
      {(locked || isOutOfSessions) && (
        <section className="mt-10 max-w-xl mx-auto bg-yellow-800/30 border border-yellow-400 p-6 rounded-xl text-yellow-200 text-center">
          <h3 className="text-xl font-bold mb-2">🔐 Feature Locked</h3>
          <p>This AI feature or usage cap is part of a premium plan.</p>
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="mt-4 px-5 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
          >
            {upgrading ? 'Redirecting to Stripe...' : '🚀 Upgrade to Pro'}
          </button>
        </section>
      )}

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm mt-24">
        &copy; {new Date().getFullYear()} EdgeStore.ai — Behavioral Intelligence Engine
      </footer>
    </div>
  );
};

export default HomePage;
