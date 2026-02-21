"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    const err = await forgotPassword(email);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setStep("reset");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code || !newPassword) {
      setError("Please enter the code and new password");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const err = await resetPassword(email, code, newPassword);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setStep("done");
    }
  };

  if (step === "done") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Password Reset!</h1>
          <p className="text-slate-400 mb-6">Your password has been updated. You can now sign in with your new password.</p>
          <Link href="/auth" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-white mx-auto mb-4">
            CV
          </div>
          <h1 className="text-2xl font-bold text-white">
            {step === "email" ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-slate-400 mt-1">
            {step === "email"
              ? "Enter your email to receive a reset code"
              : "Enter the code and your new password"}
          </p>
        </div>

        <form
          onSubmit={step === "email" ? handleSendCode : handleReset}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === "email" ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold transition-colors mt-2"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                A reset code has been sent to {email}
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Reset Code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`${inputClass} tracking-widest text-center text-lg`}
                  maxLength={6}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold transition-colors mt-2"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          Remember your password?{" "}
          <Link href="/auth" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
