"use client";

import { useState } from "react";
import Link from "next/link";
import { UserRole } from "@/types";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("player");

  const roles: { value: UserRole; label: string; desc: string; icon: string }[] = [
    { value: "player", label: "Player", desc: "Create your profile and get discovered", icon: "🏏" },
    { value: "agent", label: "Agent", desc: "Manage talent and negotiate placements", icon: "🤝" },
    { value: "owner", label: "T20 Owner", desc: "Scout and recruit global talent for your franchise", icon: "🏟️" },
    { value: "sponsor", label: "Sponsor", desc: "Invest in youth cricket development", icon: "💰" },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-white mx-auto mb-4">
            CH
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isSignUp ? "Join CricketHub Global" : "Welcome Back"}
          </h1>
          <p className="text-slate-400 mt-1">
            {isSignUp ? "Create your account to get started" : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          {isSignUp && (
            <div className="mb-6">
              <label className="text-sm text-slate-400 block mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setSelectedRole(r.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedRole === r.value
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-lg">{r.icon}</span>
                    <p className="text-sm font-medium text-white mt-1">{r.label}</p>
                    <p className="text-xs text-slate-400">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-sm text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
            {isSignUp && (
              <div>
                <label className="text-sm text-slate-400 block mb-1">Country</label>
                <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500">
                  <option value="">Select your country</option>
                  <option value="IN">India</option>
                  <option value="AU">Australia</option>
                  <option value="PK">Pakistan</option>
                  <option value="GB">England</option>
                  <option value="WI">West Indies</option>
                  <option value="ZA">South Africa</option>
                  <option value="NZ">New Zealand</option>
                  <option value="LK">Sri Lanka</option>
                  <option value="BD">Bangladesh</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AE">UAE</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            )}
            <div>
              <label className="text-sm text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <Link href="/dashboard">
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-semibold transition-colors mt-2">
                {isSignUp ? "Create Account" : "Sign In"}
              </button>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          This is a demo application. No real authentication is performed.
        </p>
      </div>
    </div>
  );
}
