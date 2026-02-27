"use client";

import Link from "next/link";

export default function StorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">&larr; Dashboard</Link></div>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">🏏</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Rising Star Store</h1>
        <span className="text-sm bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full border border-amber-500/30 mb-6">Coming Soon</span>
        <p className="text-slate-400 max-w-md text-lg mb-8">Official Rising Star Cricket League merchandise is on its way. Stay tuned for jerseys, gear, and more.</p>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👕</span>
            </div>
            <span className="text-xs text-slate-500">Apparel</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎒</span>
            </div>
            <span className="text-xs text-slate-500">Bags</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🧢</span>
            </div>
            <span className="text-xs text-slate-500">Accessories</span>
          </div>
        </div>
      </div>
    </div>
  );
}
