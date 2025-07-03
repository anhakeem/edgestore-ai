// apps/web/src/components/SnapshotPreviewModal.tsx
'use client';
import React from 'react';

export default function SnapshotPreviewModal({
  open,
  onClose,
  file,
  content,
}: {
  open: boolean;
  onClose: () => void;
  file: string;
  content: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white w-full max-w-3xl p-6 rounded-2xl shadow-2xl border border-cyan-700 overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-cyan-400 break-all">{file}</h2>
          <button
            onClick={onClose}
            className="text-cyan-300 hover:text-white transition text-sm font-mono"
          >
            ✖ Close
          </button>
        </div>
        <pre className="text-sm whitespace-pre-wrap break-words font-mono text-green-300 overflow-auto max-h-[60vh] rounded bg-slate-800 p-4">
          {content}
        </pre>
      </div>
    </div>
  );
}
