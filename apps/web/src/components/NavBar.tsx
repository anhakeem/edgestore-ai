// apps/web/src/components/NavBar.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shadow-sm">
      <Link href="/" className="flex items-center space-x-3">
        <Image
          src="/logo-white.svg"
          alt="EdgeStore AI Logo"
          width={40}
          height={40}
          className="w-10 h-10"
        />
        <span className="text-xl font-bold text-cyan-400">EdgeStore.ai</span>
      </Link>
      <div className="flex space-x-6 text-sm">
        <Link href="/" className="hover:text-cyan-300">🏠 Home</Link>
        <Link href="/pricing" className="hover:text-cyan-300">💳 Pricing</Link>
        <Link href="/archive" className="hover:text-cyan-300">🗃 Archive</Link>
        <Link href="/admin" className="hover:text-cyan-300">🌐 Agents</Link>
      </div>
    </nav>
  );
}
