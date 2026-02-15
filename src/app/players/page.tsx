"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PlayersPage() {
  return (
    <Suspense fallback={<div className="py-8 text-slate-400">Loading...</div>}>
      <PlayersContent />
    </Suspense>
  );
}

function PlayersContent() {
  const [tab, setTab] = useState<"profile" | "mystats" | "training" | "ai" | "store">("profile");
  const [trainingTab, setTrainingTab] = useState<"idol" | "exercises" | "coach">("idol");
  const search = useSearchParams();

  useEffect(() => {
    const t = search.get("tab");
    const sub = search.get("sub");
    if (t === "profile" || t === "mystats" || t === "training" || t === "ai" || t === "store") setTab(t);
    if (sub === "idol" || sub === "exercises" || sub === "coach") setTrainingTab(sub);
  }, [search]);

  const tabs = [
    { id: "profile", label: "Home" },
    { id: "mystats", label: "My Stats" },
    { id: "training", label: "Training" },
    { id: "ai", label: "Full Track AI" },
    { id: "store", label: "Merchandise Store" },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Players</h1>
        <p className="text-slate-400">Player workspace with unified tabs. No dropdowns.</p>
      </div>


      {tab === "profile" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h2 className="text-xl font-semibold text-white mb-2">My Profile</h2>
            <p className="text-slate-400 text-sm mb-4">Manage your profile, badges, and preferences.</p>
            <Link href="/dashboard" className="inline-block text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">Open My Profile</Link>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h2 className="text-xl font-semibold text-white mb-2">Performance Feed</h2>
            <p className="text-slate-400 text-sm mb-4">Your highlights, rank moves, and milestones.</p>
            <Link href="/performance-feed" className="inline-block text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">View Feed</Link>
          </div>
        </div>
      )}

      {tab === "mystats" && (
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/players" className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/50 transition-all">
            <h3 className="text-lg font-semibold text-white mb-1">Cricinfo</h3>
            <p className="text-slate-400 text-sm">Career stats, records, and splits.</p>
          </Link>
          <Link href="/rankings" className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/50 transition-all">
            <h3 className="text-lg font-semibold text-white mb-1">CPI Metrics</h3>
            <p className="text-slate-400 text-sm">Cricket Performance Index (CPI) details.</p>
          </Link>
          <Link href="/combine" className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/50 transition-all">
            <h3 className="text-lg font-semibold text-white mb-1">Combine Assessment</h3>
            <p className="text-slate-400 text-sm">YoYo, sprint, bat/bowl speed, jump, fielding.</p>
          </Link>
        </div>
      )}

      {tab === "training" && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Idol Capture</h3>
            <p className="text-slate-400 text-sm mb-4">Save your idol’s routines and mirror them.</p>
            <Link href="/dashboard" className="inline-block text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">Set Routine</Link>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Track Exercises</h3>
            <p className="text-slate-400 text-sm mb-4">Follow coach plans and your own workouts.</p>
            <Link href="/dashboard" className="inline-block text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">Open Planner</Link>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Connect with Coach</h3>
            <p className="text-slate-400 text-sm mb-4">Find world-class coaches to level up.</p>
            <Link href="/coaches" className="inline-block text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">Find Coaches</Link>
          </div>
        </div>
      )}

      {tab === "ai" && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-xl font-semibold text-white mb-2">Full Track AI</h2>
          <p className="text-slate-400 text-sm mb-4">Upload a batting/bowling/fielding video and get instant AI feedback.</p>
          <Link href="/analyze" className="inline-block text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">Start Analysis</Link>
        </div>
      )}

      {tab === "store" && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-xl font-semibold text-white mb-2">Merchandise Store</h2>
          <p className="text-slate-400 text-sm mb-4">Shop bats, balls, pads, gloves, helmets, kits, and more.</p>
          <Link href="/store" className="inline-block text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">Open Store</Link>
        </div>
      )}
    </div>
  );
}
