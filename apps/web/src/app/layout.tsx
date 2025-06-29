// apps/web/src/app/layout.tsx
import '../globals.css';
import NavBar from '../components/NavBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EdgeStore.ai – Behavioral Prediction & Persona Intelligence',
  description: 'Track behavior. Predict churn. Export real-time AI-driven EdgeAgent profiles.',
  keywords: [
    'AI personas',
    'churn prediction',
    'behavior analytics',
    'EdgeAgent',
    'user intent detection',
  ],
  metadataBase: new URL('https://edgestore-web.vercel.app'),
  openGraph: {
    title: 'EdgeStore.ai – Predict Behavior. Export Intelligence.',
    description: 'Behavior tracking and AI-driven persona export. Create EdgeAgents from user data in real-time.',
    url: 'https://edgestore-web.vercel.app',
    siteName: 'EdgeStore.ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EdgeStore AI Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EdgeStore.ai',
    description: 'Real-time AI persona intelligence system.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <NavBar />
        {children}
      </body>
    </html>
  );
}

