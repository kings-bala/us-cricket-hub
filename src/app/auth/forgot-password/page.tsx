"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword, resetPassword } = useAuth();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess("Password reset code sent to your email.");
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      setSuccess("Password reset successful! You can now sign in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-white mx-auto mb-4">
            CV
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 mt-1">
            {step === "email" ? "Enter your email to receive a reset code" : "Enter the code and your new password"}
          </p>
        </div>

        <form onSubmit={step === "email" ? handleSendCode : handleReset} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}
          {success && <p className="text-emerald-400 text-sm mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">{success}</p>}

          {step === "email" ? (
            <div className="space-y-4">
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Reset Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code from email"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition-colors"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
