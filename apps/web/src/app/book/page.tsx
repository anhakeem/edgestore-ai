// apps/web/src/app/book/page.tsx

'use client';
import React from 'react';

const BookPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-6 text-cyan-400 text-center">📆 Book Your EdgeAgent Demo</h1>
      <p className="text-lg text-gray-400 max-w-2xl mb-10 text-center">
        Ready to see how EdgeStore can predict churn, convert faster, and map your users in real time?
        Book a 15-minute call — we’ll show you the truth behind your sessions.
      </p>

      <div className="w-full max-w-2xl bg-slate-800 rounded-lg p-4 shadow-md">
        {/* Replace this iframe with your preferred booking tool */}
        <iframe
          src="https://calendly.com/anhakeem007/30min"
          width="100%"
          height="600"
          frameBorder="0"
          className="rounded-lg"
          title="Schedule a demo"
        ></iframe>
      </div>
    </div>
  );
};

export default BookPage;
