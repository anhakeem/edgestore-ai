// apps/web/src/app/cancel/page.tsx

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-900 text-white px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">❌ Payment Cancelled</h1>
        <p className="text-lg">Your subscription wasn’t completed.</p>
        <p className="mt-2 text-sm text-gray-300">Try again anytime from the pricing page.</p>
      </div>
    </div>
  );
}
