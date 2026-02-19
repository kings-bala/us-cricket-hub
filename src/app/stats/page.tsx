"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const subLinks = [
  { href: "/players", label: "Cricinfo", color: "emerald", desc: "Player stats & records" },
  { href: "/rankings", label: "CPI Metrics", color: "blue", desc: "Cricket Performance Index" },
];

export default function StatsPage() {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Stats</h1>
        </div>
        <p className="text-slate-400">
          Explore player statistics, performance rankings, and the Cricket Performance Index.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {subLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm px-4 py-2 rounded-full border transition-colors bg-${item.color}-500/10 text-${item.color}-400 border-${item.color}-500/30 hover:bg-${item.color}-500/20`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {subLinks.map((item) => (
          <Link key={item.href} href={item.href} className="block group">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center`}>
                  <span className={`text-${item.color}-400 font-bold text-lg`}>{item.label[0]}</span>
                </div>
                <h2 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">{item.label}</h2>
              </div>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
