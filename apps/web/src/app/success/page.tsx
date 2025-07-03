// apps/web/src/app/success/page.tsx
'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-900 via-slate-900 to-black text-white px-4 text-center">
      <h1 className="text-5xl font-extrabold mb-4 text-green-400">🎉 Payment Confirmed</h1>
      <p className="text-lg mb-2 text-gray-300">Your EdgeAgent has been upgraded.</p>
      {sessionId && (
        <p className="text-sm mb-6 text-cyan-400">
          🔐 Stripe Session: <code>{sessionId}</code>
        </p>
      )}

      <div className="flex gap-4">
        <a
          href="/admin"
          className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-full font-bold text-white"
        >
          🔍 View My Agent
        </a>
        <a
          href="/"
          className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-full font-bold text-white border border-cyan-500"
        >
          ← Back to Home
        </a>
      </div>

      <footer className="text-xs text-gray-500 mt-12">
        &copy; {new Date().getFullYear()} EdgeStore.ai — Predictive Intelligence Engine
      </footer>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-white p-10 text-center">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
