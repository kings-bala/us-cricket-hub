"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiGet } from "@/lib/api";

interface PublicProfile {
  profile: {
    username: string;
    age: number | null;
    location: string;
    role: string;
    batting_style: string;
    bowling_style: string;
    academy: string;
    bio: string;
    best_score: number;
    full_name: string;
    avatar_url: string;
  };
  analyses: {
    analysis_type: string;
    scores: string;
    created_at: string;
  }[];
}

function formatStyle(s: string) {
  return s?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "—";
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<PublicProfile | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError("Profile not found");
        setLoading(false);
      }
    }, 8000);

    apiGet<PublicProfile>(`/player/${username}`)
      .then(setData)
      .catch(() => setError("Profile not found"))
      .finally(() => setLoading(false));

    return () => clearTimeout(timeoutId);
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading player profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
          <p className="text-slate-400 mb-6">The player &quot;{username}&quot; doesn&apos;t exist or has a private profile.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/leaderboard" className="text-emerald-400 hover:text-emerald-300 font-semibold">View Leaderboard</Link>
            <span className="text-slate-600 hidden sm:inline">&middot;</span>
            <Link href="/analyze" className="text-emerald-400 hover:text-emerald-300 font-semibold">Get Your Score</Link>
            <span className="text-slate-600 hidden sm:inline">&middot;</span>
            <Link href="/" className="text-slate-400 hover:text-white">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const { profile: p, analyses } = data;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-start gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {p.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{p.full_name}</h1>
          <p className="text-slate-400">@{p.username}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{formatStyle(p.role)}</span>
            {p.location && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{p.location}</span>}
            {p.academy && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{p.academy}</span>}
          </div>
        </div>
        {p.best_score > 0 && (
          <div className="ml-auto w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center">
            <span className="text-lg font-bold text-emerald-400">{p.best_score}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {p.age && <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center"><p className="text-lg font-bold text-white">{p.age}</p><p className="text-xs text-slate-400">Age</p></div>}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center"><p className="text-sm font-medium text-white">{formatStyle(p.batting_style)}</p><p className="text-xs text-slate-400">Batting</p></div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center"><p className="text-sm font-medium text-white">{formatStyle(p.bowling_style)}</p><p className="text-xs text-slate-400">Bowling</p></div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center"><p className="text-lg font-bold text-white">{analyses.length}</p><p className="text-xs text-slate-400">Analyses</p></div>
      </div>

      {p.bio && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-10">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">About</h2>
          <p className="text-slate-300 text-sm">{p.bio}</p>
        </div>
      )}

      {/* Analysis History */}
      {analyses.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Analysis History</h2>
          <div className="space-y-3">
            {analyses.map((a, i) => {
              let scores: Record<string, number> = {};
              try { scores = typeof a.scores === "string" ? JSON.parse(a.scores) : a.scores; } catch { /* noop */ }
              const overall = scores.overall || 0;
              return (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-emerald-400">{overall}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white capitalize">{a.analysis_type} Analysis</p>
                    <p className="text-xs text-slate-400">{new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border border-slate-700/50 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Get Your Own AI Analysis</h2>
        <p className="text-slate-300 mb-4">Upload your cricket video and get personalized feedback.</p>
        <Link href="/analyze" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
          Try Free Analysis
        </Link>
      </div>
    </div>
  );
}
