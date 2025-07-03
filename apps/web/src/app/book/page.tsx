// apps/web/src/app/book/page.tsx
// apps/web/src/app/book/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookPage = () => {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const existing = sessionStorage.getItem('sessionId') || `anon-${Date.now()}`;
    sessionStorage.setItem('sessionId', existing);
    setSessionId(existing);

    // Track visit intent
    axios.post('https://edgestore-api.fly.dev/track', {
      sessionId: existing,
      event: 'booking_page_visited',
      timestamp: new Date().toISOString(),
    }).catch((err) => {
      console.warn('⚠️ booking_page_visited tracking failed:', err);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-6 text-cyan-400 text-center">📆 Book Your EdgeAgent Demo</h1>
      <p className="text-lg text-gray-400 max-w-2xl mb-10 text-center">
        Ready to see how EdgeStore can predict churn, convert faster, and map your users in real time?
        Book a 15-minute call — we’ll show you the truth behind your sessions.
      </p>

      <div className="w-full max-w-2xl bg-slate-800 rounded-lg p-4 shadow-md">
        <iframe
          src={`https://calendly.com/anhakeem007/30min?embed_domain=edgestore.ai&embed_type=Inline&sessionId=${sessionId}`}
          width="100%"
          height="600"
          frameBorder="0"
          className="rounded-lg"
          title="Schedule a demo"
        ></iframe>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Calendly session tracking enabled. Edge intelligence will sync this booking to your timeline.
      </p>
    </div>
  );
};

export default BookPage;
