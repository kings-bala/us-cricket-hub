"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

type PlayerRole = "Batsman" | "Bowler" | "All-Rounder" | "Wicket-Keeper";
type BattingStyle = "Right-hand Bat" | "Left-hand Bat";
type BowlingStyle = "Right-arm Fast" | "Right-arm Medium" | "Left-arm Fast" | "Left-arm Medium" | "Right-arm Off-spin" | "Left-arm Orthodox" | "Left-arm Chinaman" | "Right-arm Leg-spin";
type AgeGroup = "U13" | "U15" | "U17" | "U19" | "U21" | "U23" | "Men";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, tokens } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [role, setRole] = useState<PlayerRole>("Batsman");
  const [battingStyle, setBattingStyle] = useState<BattingStyle>("Right-hand Bat");
  const [bowlingStyle, setBowlingStyle] = useState<BowlingStyle>("Right-arm Medium");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("U19");
  const [country, setCountry] = useState("");
  const [academy, setAcademy] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPost("/profile/update", {
        role, battingStyle, bowlingStyle, ageGroup, country, academy,
      }, tokens?.accessToken);
      trackEvent("profile_completed", { role, ageGroup }, tokens?.accessToken);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
          <p className="text-slate-400 mt-1">Optional — helps us personalize your coaching feedback</p>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-emerald-400 font-semibold">Profile saved!</p>
            <p className="text-slate-400 text-sm mt-1">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-5">
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Player Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"] as PlayerRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                      role === r
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-700 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Batting Style</label>
                <select
                  value={battingStyle}
                  onChange={(e) => setBattingStyle(e.target.value as BattingStyle)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Right-hand Bat">Right-hand Bat</option>
                  <option value="Left-hand Bat">Left-hand Bat</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Bowling Style</label>
                <select
                  value={bowlingStyle}
                  onChange={(e) => setBowlingStyle(e.target.value as BowlingStyle)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Right-arm Fast">Right-arm Fast</option>
                  <option value="Right-arm Medium">Right-arm Medium</option>
                  <option value="Left-arm Fast">Left-arm Fast</option>
                  <option value="Left-arm Medium">Left-arm Medium</option>
                  <option value="Right-arm Off-spin">Right-arm Off-spin</option>
                  <option value="Left-arm Orthodox">Left-arm Orthodox</option>
                  <option value="Left-arm Chinaman">Left-arm Chinaman</option>
                  <option value="Right-arm Leg-spin">Right-arm Leg-spin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Age Group</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="U13">U13</option>
                  <option value="U15">U15</option>
                  <option value="U17">U17</option>
                  <option value="U19">U19</option>
                  <option value="U21">U21</option>
                  <option value="U23">U23</option>
                  <option value="Men">Men</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. USA, India"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Academy / Club (optional)</label>
              <input
                type="text"
                value={academy}
                onChange={(e) => setAcademy(e.target.value)}
                placeholder="e.g. Rising Star Cricket Academy"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition-colors"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-sm font-medium flex items-center"
              >
                Skip for now
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
