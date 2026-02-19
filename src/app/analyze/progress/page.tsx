"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getHistory, type SavedAnalysis } from "@/lib/analysis-history";

export default function ProgressPage() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [typeFilter, setTypeFilter] = useState<"all" | "batting" | "bowling" | "fielding">("all");

  useEffect(() => {
    setAnalyses(getHistory());
  }, []);

  const filtered = analyses
    .filter((a) => typeFilter === "all" || a.summary.type === typeFilter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const scoreColor = (s: number) => s >= 75 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400";
  const barColor = (s: number) => s >= 75 ? "bg-emerald-500" : s >= 60 ? "bg-amber-500" : "bg-red-500";

  const allCategories = Array.from(new Set(filtered.flatMap((a) => a.summary.categories.map((c) => c.category))));

  const getTrend = (scores: number[]) => {
    if (scores.length < 2) return { direction: "neutral" as const, change: 0 };
    const recent = scores.slice(-3);
    const earlier = scores.slice(0, Math.max(1, scores.length - 3));
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    const change = Math.round(recentAvg - earlierAvg);
    return { direction: change > 2 ? "up" as const : change < -2 ? "down" as const : "neutral" as const, change };
  };

  const overallScores = filtered.map((a) => a.summary.overallScore);
  const overallTrend = getTrend(overallScores);
  const avgScore = overallScores.length > 0 ? Math.round(overallScores.reduce((a, b) => a + b, 0) / overallScores.length) : 0;
  const bestScore = overallScores.length > 0 ? Math.max(...overallScores) : 0;
  const latestScore = overallScores.length > 0 ? overallScores[overallScores.length - 1] : 0;
  const maxBarHeight = 120;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3">
        <Link href="/players?tab=training&sub=progress" className="text-sm text-slate-400 hover:text-white">&larr; Back to Training</Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">Progress Dashboard</h1>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30">Tracking</span>
          </div>
          <p className="text-sm text-slate-400">Track your technique improvement over time.</p>
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Types</option>
          <option value="batting">Batting</option>
          <option value="bowling">Bowling</option>
          <option value="fielding">Fielding</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
          <p className="text-slate-400 font-medium">No analysis data yet</p>
          <p className="text-xs text-slate-500 mt-1">Analyze multiple videos to see your progress over time.</p>
          <Link href="/analyze" className="inline-block mt-4 text-sm text-amber-400 hover:text-amber-300">Go to Analysis &rarr;</Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <p className="text-xs text-slate-500 mb-1">Sessions</p>
              <p className="text-2xl font-bold text-white">{filtered.length}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <p className="text-xs text-slate-500 mb-1">Average Score</p>
              <p className={`text-2xl font-bold ${scoreColor(avgScore)}`}>{avgScore}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <p className="text-xs text-slate-500 mb-1">Best Score</p>
              <p className={`text-2xl font-bold ${scoreColor(bestScore)}`}>{bestScore}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <p className="text-xs text-slate-500 mb-1">Trend</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${overallTrend.direction === "up" ? "text-emerald-400" : overallTrend.direction === "down" ? "text-red-400" : "text-slate-400"}`}>
                  {overallTrend.direction === "up" ? "+" : ""}{overallTrend.change}
                </p>
                <span className="text-lg">{overallTrend.direction === "up" ? "\u2191" : overallTrend.direction === "down" ? "\u2193" : "\u2192"}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Score Over Time</h3>
            <div className="flex items-end gap-1.5 h-32">
              {filtered.map((a, i) => {
                const height = (a.summary.overallScore / 100) * maxBarHeight;
                return (
                  <div key={a.id} className="flex-1 flex flex-col items-center group relative" style={{ minWidth: "20px", maxWidth: "60px" }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {a.summary.overallScore} &mdash; {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 ${barColor(a.summary.overallScore)} ${i === filtered.length - 1 ? "opacity-100" : "opacity-60"}`}
                      style={{ height: `${height}px` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-600">{filtered.length > 0 ? new Date(filtered[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
              <span className="text-xs text-slate-600">{filtered.length > 0 ? new Date(filtered[filtered.length - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
            </div>
          </div>

          {allCategories.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Category Trends</h3>
              <div className="space-y-4">
                {allCategories.map((cat) => {
                  const catScores = filtered
                    .map((a) => a.summary.categories.find((c) => c.category === cat)?.score)
                    .filter((s): s is number => s !== undefined);
                  const trend = getTrend(catScores);
                  const latest = catScores.length > 0 ? catScores[catScores.length - 1] : 0;
                  const avg = catScores.length > 0 ? Math.round(catScores.reduce((a, b) => a + b, 0) / catScores.length) : 0;

                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-white font-medium">{cat}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">Avg: {avg}</span>
                          <span className={`text-xs font-bold ${scoreColor(latest)}`}>{latest}</span>
                          <span className={`text-xs ${trend.direction === "up" ? "text-emerald-400" : trend.direction === "down" ? "text-red-400" : "text-slate-500"}`}>
                            {trend.direction === "up" ? `+${trend.change}` : trend.direction === "down" ? `${trend.change}` : "="}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-700 ${barColor(latest)}`} style={{ width: `${latest}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Session History</h3>
            <div className="space-y-2">
              {[...filtered].reverse().map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <div>
                    <p className="text-sm text-white font-medium truncate">{a.fileName}</p>
                    <p className="text-xs text-slate-500">{new Date(a.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })} &middot; {a.summary.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${scoreColor(a.summary.overallScore)}`}>{a.summary.overallScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {latestScore > 0 && (
            <div className={`rounded-xl p-5 border ${overallTrend.direction === "up" ? "bg-emerald-500/5 border-emerald-500/20" : overallTrend.direction === "down" ? "bg-amber-500/5 border-amber-500/20" : "bg-blue-500/5 border-blue-500/20"}`}>
              <h3 className={`text-sm font-semibold mb-2 ${overallTrend.direction === "up" ? "text-emerald-400" : overallTrend.direction === "down" ? "text-amber-400" : "text-blue-400"}`}>
                {overallTrend.direction === "up" ? "Great Progress!" : overallTrend.direction === "down" ? "Room for Improvement" : "Steady Performance"}
              </h3>
              <p className="text-sm text-slate-300">
                {overallTrend.direction === "up"
                  ? `Your scores are trending up by ${overallTrend.change} points. Keep up the great work!`
                  : overallTrend.direction === "down"
                    ? `Your recent scores have dipped by ${Math.abs(overallTrend.change)} points. Focus on the areas highlighted above.`
                    : "Your performance is consistent. Challenge yourself with more complex drills to push beyond your current level."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
