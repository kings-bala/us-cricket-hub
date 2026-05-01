"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/analyze", label: "AI Analysis" },
    { href: "/coaches", label: "Coaches" },
    { href: "/pricing", label: "Pricing" },
    { href: "/players", label: "Players" },
  ];

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm">
              CV
            </div>
            <span className="font-bold text-lg hidden sm:block">CricVerse360</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-slate-300 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-sm text-slate-300 hover:text-white transition-colors">
                  My Profile
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="text-sm text-slate-300 hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="hidden sm:flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                    {user.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U"}
                  </div>
                  <span className="text-sm text-slate-300">{user.full_name?.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-sm bg-emerald-500 hover:bg-emerald-600 px-4 py-1.5 rounded-full transition-colors"
              >
                Sign In
              </Link>
            )}
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-slate-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-slate-300 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-slate-300 hover:text-white"
                >
                  My Profile
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm text-slate-300 hover:text-white"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
