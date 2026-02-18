"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuspended, setIsSuspended] = useState(false);
  const [showReinstate, setShowReinstate] = useState(false);
  const [reason, setReason] = useState("");
  const [reinstateMsg, setReinstateMsg] = useState("");
  const { login, user, requestReinstatement, hasPendingRequest } = useAuth();
  const router = useRouter();

  if (user) {
    router.replace(user.role === "admin" ? "/admin" : "/players?tab=profile");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSuspended(false);
    setShowReinstate(false);
    setReinstateMsg("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    const err = login(email, password);
    if (err) {
      setError(err);
      if (err.includes("suspended")) setIsSuspended(true);
    }
  };

  const handleReinstate = () => {
    if (!reason.trim()) { setReinstateMsg("Please provide a reason."); return; }
    if (hasPendingRequest(email)) { setReinstateMsg("You already have a pending request."); return; }
    const err = requestReinstatement(email, reason.trim());
    if (err) { setReinstateMsg(err); }
    else { setReinstateMsg("Your reinstatement request has been submitted. The admin will review it shortly."); setShowReinstate(false); setReason(""); }
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
          {reinstateMsg && !showReinstate && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
              {reinstateMsg}
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

        {isSuspended && !showReinstate && !reinstateMsg && (
          <div className="mt-4 bg-slate-800/50 border border-amber-500/30 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-300 mb-3">Want to request account reinstatement?</p>
            <button onClick={() => setShowReinstate(true)} className="text-sm bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">Request Reinstatement</button>
          </div>
        )}

        {showReinstate && (
          <div className="mt-4 bg-slate-800/50 border border-amber-500/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Request Reinstatement</h3>
            <p className="text-xs text-slate-400 mb-3">Explain why your account should be reinstated. The admin will review your request.</p>
            {reinstateMsg && <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{reinstateMsg}</div>}
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for reinstatement..." rows={3} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 mb-3 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => { setShowReinstate(false); setReinstateMsg(""); }} className="flex-1 text-sm bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleReinstate} className="flex-1 text-sm bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold transition-colors">Submit Request</button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-slate-400 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
