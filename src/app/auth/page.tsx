"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.replace(user.role === "admin" ? "/" : "/players?tab=profile");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    const err = login(email, password);
    if (err) {
      setError(err);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-white mx-auto mb-4">
            CV
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to CricVerse</h1>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                placeholder="you@cricverse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-semibold transition-colors mt-2"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6 bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-semibold mb-3 uppercase tracking-wide">Demo Accounts</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Arjun Patel (Player)</span>
              <span className="text-slate-500 font-mono">arjun@cricverse.com / player123</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Jake Thompson (Player)</span>
              <span className="text-slate-500 font-mono">jake@cricverse.com / player123</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Rashid Mohammed (Player)</span>
              <span className="text-slate-500 font-mono">rashid@cricverse.com / player123</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Rahul Desai (Player)</span>
              <span className="text-slate-500 font-mono">rahul@cricverse.com / player123</span>
            </div>
            <div className="border-t border-slate-700/50 my-2"></div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-medium">Master Admin</span>
              <span className="text-slate-500 font-mono">admin@cricverse.com / admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
