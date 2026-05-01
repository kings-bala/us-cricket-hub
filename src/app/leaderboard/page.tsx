"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface LeaderboardPlayer {
  rank: number;
  name: string;
  username: string;
  role: string;
  score: number;
  analysisType: string;
  location: string;
  featured: boolean;
  badges: string[];
  bestBowlingScore?: number;
}

const LEADERBOARD_DATA: LeaderboardPlayer[] = [];

const ALL_TIME_DATA: LeaderboardPlayer[] = [];

function getRankBadge(rank: number) {
  if (rank === 1) return { emoji: "\u{1F947}", bg: "bg-yellow-500/20", border: "border-yellow-500/40", text: "text-yellow-400" };
  if (rank === 2) return { emoji: "\u{1F948}", bg: "bg-slate-400/20", border: "border-slate-400/40", text: "text-slate-300" };
  if (rank === 3) return { emoji: "\u{1F949}", bg: "bg-amber-600/20", border: "border-amber-600/40", text: "text-amber-500" };
  return { emoji: "", bg: "bg-slate-800/50", border: "border-slate-700/50", text: "text-slate-400" };
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-blue-400";
  if (score >= 55) return "text-amber-400";
  return "text-red-400";
}

function getScoreBorder(score: number) {
  if (score >= 85) return "border-emerald-500";
  if (score >= 70) return "border-blue-500";
  if (score >= 55) return "border-amber-500";
  return "border-red-500";
}

function PlayerBadges({ badges }: { badges: string[] }) {
  if (!badges.length) return null;

  const badgeStyles: Record<string, string> = {
    "Top 10 This Week": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    "Featured Player": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    "Best Bowling Score": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  };

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {badges.map((badge) => (
        <span
          key={badge}
          className={`text-[10px] px-1.5 py-0.5 rounded border ${badgeStyles[badge] || "bg-slate-500/15 text-slate-400 border-slate-500/30"}`}
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<"all" | "batting" | "bowling" | "all-rounder">("all");
  const [tab, setTab] = useState<"weekly" | "alltime">("weekly");

  useEffect(() => {
    trackEvent("leaderboard_viewed");
  }, []);

  const sourceData = tab === "weekly" ? LEADERBOARD_DATA : ALL_TIME_DATA;
  const filtered = filter === "all"
    ? sourceData
    : filter === "all-rounder"
      ? sourceData.filter((p) => p.role.toLowerCase() === "all-rounder")
      : sourceData.filter((p) => p.analysisType === filter);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900/30 via-slate-900 to-blue-900/30 border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-lg">{"\u{1F3C6}"}</span>
            <span className="text-sm text-yellow-400 font-semibold">Player Rankings</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get Discovered on CricVerse360
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-4">
            Upload your video, earn your score, and appear among top players of the week. Coaches and scouts are watching.
          </p>
          <p className="text-sm text-emerald-400 font-medium mb-8">
            Top players get featured, badged, and discovered by academies worldwide.
          </p>
          <Link
            href="/analyze"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
          >
            Upload Your Video to Get Ranked
          </Link>
        </div>
      </section>

      {/* Tabs + Filters */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-800/50 rounded-full p-1 border border-slate-700/50">
            {(["weekly", "alltime"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  tab === t
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t === "weekly" ? "This Week" : "All Time"}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "batting", "bowling", "all-rounder"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50"
                }`}
              >
                {f === "all" ? "All Players" : f === "all-rounder" ? "All-Rounder" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">{"\u{1F3C6}"}</span>
            <h3 className="text-2xl font-bold text-white mb-3">No Rankings Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
              Be the first to upload your cricket video and claim the #1 spot on the CricVerse360 leaderboard. Your score will appear here for coaches and scouts to discover.
            </p>
            <Link
              href="/analyze"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
            >
              Upload Your Video to Get Ranked
            </Link>
          </div>
        )}

        {/* Top 3 Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {filtered.slice(0, 3).map((player) => {
            const badge = getRankBadge(player.rank);
            return (
              <div
                key={player.username}
                className={`${badge.bg} border ${badge.border} rounded-2xl p-6 text-center relative overflow-hidden`}
              >
                {player.featured && (
                  <span className="absolute top-3 right-3 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
                <span className="text-4xl mb-3 block">{badge.emoji}</span>
                <div className={`w-20 h-20 rounded-full border-4 ${getScoreBorder(player.score)} flex items-center justify-center mx-auto mb-3 bg-slate-900/50`}>
                  <span className={`text-2xl font-bold ${getScoreColor(player.score)}`}>{player.score}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{player.name}</h3>
                <p className="text-sm text-slate-400 capitalize">{player.role}</p>
                <p className="text-xs text-slate-500 mt-1">{player.location}</p>
                <PlayerBadges badges={player.badges} />
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-xs bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded capitalize">{player.analysisType}</span>
                </div>
                <Link
                  href="/analyze"
                  className="inline-block mt-4 text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Get Your Score &rarr;
                </Link>
              </div>
            );
          })}
        </div>

        {/* Rest of leaderboard */}
        {filtered.length > 3 && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-800/50 text-xs text-slate-500 font-semibold uppercase tracking-wide">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Player</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Score</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-1"></div>
            </div>

            {/* Rows */}
            {filtered.slice(3).map((player) => (
              <div
                key={player.username}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-t border-slate-700/30 hover:bg-slate-800/40 transition-colors"
              >
                <div className="col-span-1">
                  <span className="text-lg font-bold text-slate-400">#{player.rank}</span>
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {player.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{player.name}</p>
                    <PlayerBadges badges={player.badges} />
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-slate-300 capitalize">{player.role}</span>
                </div>
                <div className="col-span-2">
                  <span className={`text-lg font-bold ${getScoreColor(player.score)}`}>{player.score}</span>
                  <span className="text-xs text-slate-500">/100</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-slate-400">{player.location}</span>
                </div>
                <div className="col-span-1 text-right">
                  <Link
                    href="/analyze"
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Get Ranked
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No players found for this filter. Be the first!</p>
            <Link href="/analyze" className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm mt-2 inline-block">
              Upload Your Video &rarr;
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border border-emerald-500/20 rounded-2xl p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Want to See Your Name Here?
            </h2>
            <p className="text-slate-300 mb-2 max-w-lg mx-auto">
              Upload your cricket video, get your AI score, and climb the leaderboard.
            </p>
            <p className="text-sm text-emerald-400 font-medium mb-6">
              Top players get featured and discovered by coaches and academies.
            </p>
            <Link
              href="/analyze"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
            >
              Upload Your Video to Get Ranked
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
