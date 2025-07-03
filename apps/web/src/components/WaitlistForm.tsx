// apps/web/src/components/WaitlistForm.tsx
'use client';
import React, { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.includes('@')) return setStatus('❌ Please enter a valid email.');
    setSubmitting(true);
    setStatus('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setStatus(data.message.includes('Already') ? '⚠️ Already signed up.' : '✅ You’re on the list!');
      setEmail('');
    } catch {
      setStatus('❌ Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl max-w-md mx-auto mt-12 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-2">📩 Join the EdgeStore Waitlist</h3>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full px-4 py-2 rounded bg-slate-900 text-white border border-cyan-500 mb-2"
      />
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`w-full py-2 rounded font-bold transition ${
          submitting
            ? 'bg-slate-700 cursor-not-allowed'
            : 'bg-cyan-600 hover:bg-cyan-700'
        }`}
      >
        {submitting ? 'Submitting...' : 'Sign Up'}
      </button>
      {status && <p className="text-sm mt-3 text-cyan-300">{status}</p>}
    </div>
  );
}
