// apps/web/src/app/success/page.tsx

'use client';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900 text-white px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">✅ Payment Successful</h1>
        <p className="text-lg mb-2">Your session ID:</p>
        <p className="text-md font-mono text-green-200">{sessionId}</p>
        <p className="mt-4 text-sm text-gray-300">You can now access premium features.</p>
      </div>
    </div>
  );
}
