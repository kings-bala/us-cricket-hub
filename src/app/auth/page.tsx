"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { UserRole } from "@/types";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("player");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register, verifyEmail, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/dashboard");
    return null;
  }

  const roles: { value: UserRole; label: string; desc: string; icon: string }[] = [
    { value: "player", label: "Player", desc: "Create your profile and get discovered", icon: "🏏" },
    { value: "agent", label: "Agent", desc: "Manage talent and negotiate placements", icon: "🤝" },
    { value: "owner", label: "T20 Owner", desc: "Scout and recruit global talent for your franchise", icon: "🏟️" },
    { value: "sponsor", label: "Sponsor", desc: "Invest in youth cricket development", icon: "💰" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setError("Full name is required");
          setLoading(false);
          return;
        }
        const result = await register(email, password, fullName, selectedRole);
        setSuccess(result.message || "Registration successful! Check your email for a verification code.");
        setShowVerify(true);
      } else {
        await login(email, password);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyEmail(email, verifyCode);
      setSuccess("Email verified! You can now sign in.");
      setShowVerify(false);
      setIsSignUp(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (showVerify) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-white mx-auto mb-4">
              CV
            </div>
            <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
            <p className="text-slate-400 mt-1">We sent a verification code to {email}</p>
          </div>
          <form onSubmit={handleVerify} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}
            {success && <p className="text-emerald-400 text-sm mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">{success}</p>}
            <div className="mb-4">
              <label className="text-sm text-slate-400 block mb-1">Verification Code</label>
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-white mx-auto mb-4">
            CV
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isSignUp ? "Join CricVerse360" : "Welcome Back"}
          </h1>
          <p className="text-slate-400 mt-1">
            {isSignUp ? "Create your account to get started" : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}
          {success && <p className="text-emerald-400 text-sm mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">{success}</p>}

          {isSignUp && (
            <div className="mb-6">
              <label className="text-sm text-slate-400 block mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-sm text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition-colors mt-2"
            >
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-4 text-center">
              <Link href="/auth/forgot-password" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                Forgot your password?
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
