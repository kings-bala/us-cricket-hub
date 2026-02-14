"use client";

import Link from "next/link";
import { useState } from "react";
import { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  player: "Player",
  agent: "Agent",
  owner: "T20 Owner",
  sponsor: "Sponsor",
};

const roleColors: Record<UserRole, string> = {
  player: "bg-emerald-500",
  agent: "bg-blue-500",
  owner: "bg-purple-500",
  sponsor: "bg-amber-500",
};

export default function Navbar() {
  const [role, setRole] = useState<UserRole>("player");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm">
              CH
            </div>
            <span className="font-bold text-lg hidden sm:block">CricketHub Global</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/players" className="text-sm text-slate-300 hover:text-white transition-colors">
              Players
            </Link>
            <Link href="/agents" className="text-sm text-slate-300 hover:text-white transition-colors">
              Agents
            </Link>
            <Link href="/scouting" className="text-sm text-slate-300 hover:text-white transition-colors">
              Pro Scouting
            </Link>
            <Link href="/sponsors" className="text-sm text-slate-300 hover:text-white transition-colors">
              Sponsors
            </Link>
            <Link href="/analyze" className="text-sm text-slate-300 hover:text-white transition-colors">
              AI Analysis
            </Link>
            <Link href="/coaches" className="text-sm text-slate-300 hover:text-white transition-colors">
              Coaches
            </Link>
            <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-400">View as:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className={`text-xs px-2 py-1 rounded-full text-white border-0 cursor-pointer ${roleColors[role]}`}
              >
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <option key={r} value={r} className="bg-slate-800">
                    {roleLabels[r]}
                  </option>
                ))}
              </select>
            </div>
            <Link
              href="/auth"
              className="text-sm bg-emerald-500 hover:bg-emerald-600 px-4 py-1.5 rounded-full transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-700 pb-4">
          <div className="px-4 pt-3 space-y-2">
            {[
              { href: "/players", label: "Players" },
              { href: "/agents", label: "Agents" },
              { href: "/scouting", label: "Pro Scouting" },
              { href: "/sponsors", label: "Sponsors" },
              { href: "/analyze", label: "AI Analysis" },
              { href: "/coaches", label: "Coaches" },
              { href: "/dashboard", label: "Dashboard" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-slate-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-700">
              <span className="text-xs text-slate-400">View as:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className={`ml-2 text-xs px-2 py-1 rounded-full text-white border-0 ${roleColors[role]}`}
              >
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <option key={r} value={r} className="bg-slate-800">
                    {roleLabels[r]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
