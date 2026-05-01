"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { apiGet } from "@/lib/api";

interface AnalysisRecord {
  id: string;
  analysis_type: string;
  scores: string | Record<string, unknown>;
  feedback: string;
  video_ref: string;
  created_at: string;
}

interface SubStatus {
  plan: string;
  status: string;
  analysis_credits: number;
}

function parseScore(scores: string | Record<string, unknown>): number {
  try {
    const obj = typeof scores === "string" ? JSON.parse(scores) : scores;
    return Number(obj?.overall) || 0;
  } catch {
    return 0;
  }
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-blue-400";
  if (score >= 55) return "text-amber-400";
  return "text-red-400";
}

function getScoreBg(score: number): string {
  if (score >= 85) return "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30";
  if (score >= 70) return "from-blue-500/20 to-blue-500/5 border-blue-500/30";
  if (score >= 55) return "from-amber-500/20 to-amber-500/5 border-amber-500/30";
  return "from-red-500/20 to-red-500/5 border-red-500/30";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatTimeAgo(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  } catch {
    return "";
  }
}

// SVG-based score trend chart
function ScoreTrendChart({ analyses }: { analyses: AnalysisRecord[] }) {
  const sorted = [...analyses].reverse(); // oldest first
  if (sorted.length < 2) return null;

  const scores = sorted.map((a) => parseScore(a.scores));
  const maxScore = 100;
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = scores.map((s, i) => ({
    x: padding.left + (i / (scores.length - 1)) * chartW,
    y: padding.top + chartH - (s / maxScore) * chartH,
    score: s,
    date: formatDate(sorted[i].created_at),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[400px]" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = padding.top + chartH - (v / maxScore) * chartH;
          return (
            <g key={v}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="#64748b" fontSize="11">{v}</text>
            </g>
          );
        })}
        {/* Area fill */}
        <path d={areaPath} fill="url(#scoreGradient)" opacity="0.3" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
            <title>{p.date}: {p.score}/100</title>
          </g>
        ))}
        {/* Date labels */}
        {points.length <= 8 && points.map((p, i) => (
          <text key={i} x={p.x} y={height - 5} textAnchor="middle" fill="#64748b" fontSize="10">
            {sorted[i].created_at ? new Date(sorted[i].created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
          </text>
        ))}
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function ProgressDashboard() {
  const router = useRouter();
  const { user, tokens, loading } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [subscription, setSubscription] = useState<SubStatus | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth?redirect=/dashboard");
      return;
    }
    const fetchData = async () => {
      try {
        const [historyRes, subRes] = await Promise.all([
          apiGet<AnalysisRecord[]>("/analysis/history", tokens?.accessToken),
          apiGet<SubStatus>("/subscriptions/status", tokens?.accessToken),
        ]);
        setAnalyses(historyRes || []);
        setSubscription(subRes || null);
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, [user, tokens, loading, router]);

  if (loading || fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isPro = subscription?.plan === "pro" || subscription?.plan === "pro_plus";
  const scores = analyses.map((a) => parseScore(a.scores));
  const lastScore = scores.length > 0 ? scores[0] : null;
  const bestScore = scores.length > 0 ? Math.max(...scores) : null;
  const totalAnalyses = analyses.length;
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  // Compute improvement (latest vs first)
  const improvement = scores.length >= 2 ? scores[0] - scores[scores.length - 1] : null;

  // Type distribution
  const battingCount = analyses.filter((a) => a.analysis_type === "batting").length;
  const bowlingCount = analyses.filter((a) => a.analysis_type === "bowling").length;

  // Free users see max 3 reports; Pro see all
  const visibleReports = isPro ? analyses : analyses.slice(0, 3);
  const hiddenCount = isPro ? 0 : Math.max(0, analyses.length - 3);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900/30 via-slate-900 to-emerald-900/30 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-emerald-400 font-medium mb-1">Welcome back,</p>
              <h1 className="text-3xl font-bold text-white">{user.full_name || "Player"}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-xs px-2.5 py-1 rounded-full border ${isPro ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-700/50 text-slate-400 border-slate-600"}`}>
                  {subscription?.plan === "pro_plus" ? "Pro Plus" : subscription?.plan === "pro" ? "Pro" : "Free"} Plan
                </span>
                {subscription && (
                  <span className="text-xs text-slate-500">{subscription.analysis_credits} credits remaining</span>
                )}
              </div>
            </div>
            <Link
              href="/analyze"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-bold transition-colors shadow-lg shadow-emerald-500/20 text-center"
            >
              Upload Another Video to Improve Your Score
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty state */}
        {totalAnalyses === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No analyses yet</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              Upload your first cricket video to get your AI analysis score. Track your progress and improve over time.
            </p>
            <Link
              href="/analyze"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
            >
              Upload Your First Video
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className={`bg-gradient-to-br ${lastScore !== null ? getScoreBg(lastScore) : "from-slate-800 to-slate-800/50 border-slate-700"} border rounded-xl p-5`}>
                <p className="text-xs text-slate-400 mb-1">Last Score</p>
                <p className={`text-3xl font-bold ${lastScore !== null ? getScoreColor(lastScore) : "text-slate-500"}`}>
                  {lastScore !== null ? lastScore : "-"}<span className="text-base text-slate-500">/100</span>
                </p>
                {analyses[0] && <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(analyses[0].created_at)}</p>}
              </div>
              <div className={`bg-gradient-to-br ${bestScore !== null ? getScoreBg(bestScore) : "from-slate-800 to-slate-800/50 border-slate-700"} border rounded-xl p-5`}>
                <p className="text-xs text-slate-400 mb-1">Best Score</p>
                <p className={`text-3xl font-bold ${bestScore !== null ? getScoreColor(bestScore) : "text-slate-500"}`}>
                  {bestScore !== null ? bestScore : "-"}<span className="text-base text-slate-500">/100</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">Personal best</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-5">
                <p className="text-xs text-slate-400 mb-1">Total Analyses</p>
                <p className="text-3xl font-bold text-blue-400">{totalAnalyses}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {battingCount} batting &middot; {bowlingCount} bowling
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-xl p-5">
                <p className="text-xs text-slate-400 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-purple-400">{avgScore !== null ? avgScore : "-"}<span className="text-base text-slate-500">/100</span></p>
                {improvement !== null && (
                  <p className={`text-xs mt-1 ${improvement >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {improvement >= 0 ? "+" : ""}{improvement} since first analysis
                  </p>
                )}
              </div>
            </div>

            {/* Goal Message + Latest Report */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Goal Message */}
              <div className="bg-gradient-to-r from-amber-900/20 to-emerald-900/20 border border-amber-500/20 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-2xl">&#x1F3AF;</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Your next goal: beat your previous score.</p>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {bestScore !== null
                      ? `Your best is ${bestScore}/100. Upload a new video to beat it.`
                      : "Upload again to start tracking improvement."}
                  </p>
                </div>
              </div>

              {/* Latest Report Quick Access */}
              {analyses[0] && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <p className="text-xs text-slate-400 mb-2">Latest Report</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getScoreBg(parseScore(analyses[0].scores))} flex items-center justify-center`}>
                      <span className={`text-xl font-bold ${getScoreColor(parseScore(analyses[0].scores))}`}>{parseScore(analyses[0].scores)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium capitalize">{analyses[0].analysis_type} Analysis</p>
                      <p className="text-xs text-slate-500">{formatDate(analyses[0].created_at)}</p>
                      {analyses[0].feedback && (
                        <p className="text-xs text-slate-400 mt-1 truncate">{analyses[0].feedback}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Score Trend */}
            {analyses.length >= 2 && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Score Trend</h2>
                    <p className="text-sm text-slate-400">Your performance over time</p>
                  </div>
                  {improvement !== null && (
                    <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${improvement >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                      {improvement >= 0 ? "+" : ""}{improvement} pts
                    </div>
                  )}
                </div>
                <ScoreTrendChart analyses={isPro ? analyses : analyses.slice(0, 5)} />
                {!isPro && analyses.length > 5 && (
                  <p className="text-xs text-slate-500 text-center mt-3">
                    Showing last 5 analyses. <Link href="/pricing" className="text-emerald-400 hover:underline">Upgrade to Pro</Link> to see full history.
                  </p>
                )}
              </div>
            )}

            {/* Pro Improvement Insights */}
            {isPro && analyses.length >= 2 && (
              <div className="bg-gradient-to-br from-emerald-900/20 to-blue-900/20 border border-emerald-500/20 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">Pro</span>
                  <h2 className="text-lg font-semibold text-white">Improvement Insights</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Consistency</p>
                    <p className="text-white font-semibold">
                      {(() => {
                        const stdDev = Math.sqrt(scores.reduce((sum, s) => sum + Math.pow(s - (avgScore || 0), 2), 0) / scores.length);
                        if (stdDev < 5) return "Very Consistent";
                        if (stdDev < 10) return "Consistent";
                        if (stdDev < 15) return "Moderate";
                        return "Variable";
                      })()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Score variance across sessions</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Trend Direction</p>
                    <p className={`font-semibold ${improvement !== null && improvement >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {improvement !== null && improvement > 5 ? "Improving" : improvement !== null && improvement < -5 ? "Declining" : "Stable"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Based on first vs latest</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Focus Area</p>
                    <p className="text-white font-semibold">
                      {battingCount > bowlingCount ? "Batting" : bowlingCount > battingCount ? "Bowling" : "All-Round"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{battingCount} batting / {bowlingCount} bowling sessions</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pro: Repeated Weaknesses Across Reports */}
            {isPro && analyses.length >= 2 && (
              <div className="bg-gradient-to-br from-red-900/10 to-amber-900/10 border border-amber-500/15 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">Pro</span>
                  <h2 className="text-lg font-semibold text-white">Repeated Weaknesses</h2>
                </div>
                <p className="text-sm text-slate-400 mb-4">Issues that appear across multiple reports — focus here for the biggest improvement.</p>
                {(() => {
                  const feedbackKeys: Record<string, number> = {};
                  analyses.forEach((a) => {
                    try {
                      const sc = typeof a.scores === "string" ? JSON.parse(a.scores) : a.scores;
                      Object.entries(sc).forEach(([key, val]) => {
                        if (key !== "overall" && typeof val === "string" && val.length > 10) {
                          const k = key.replace(/_/g, " ");
                          feedbackKeys[k] = (feedbackKeys[k] || 0) + 1;
                        }
                      });
                    } catch { /* skip */ }
                  });
                  const repeated = Object.entries(feedbackKeys)
                    .filter(([, count]) => count >= 2)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);
                  if (repeated.length === 0) {
                    return (
                      <p className="text-sm text-slate-500">Not enough data yet. Upload more videos to identify recurring patterns.</p>
                    );
                  }
                  return (
                    <div className="space-y-2">
                      {repeated.map(([area, count]) => (
                        <div key={area} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3">
                          <span className="text-sm text-white capitalize font-medium">{area}</span>
                          <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            Flagged in {count} report{count > 1 ? "s" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Upgrade tease for free users: repeated weaknesses */}
            {!isPro && analyses.length >= 2 && (
              <div className="relative mb-8">
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-white">Repeated Weaknesses</h2>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 w-full bg-slate-700/30 rounded-lg" />
                    <div className="h-8 w-3/4 bg-slate-700/30 rounded-lg" />
                    <div className="h-8 w-5/6 bg-slate-700/30 rounded-lg" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-slate-300 font-medium mb-1">See which weaknesses repeat across reports</p>
                    <Link href="/pricing" className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full font-medium transition-colors">
                      Upgrade to Pro
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Previous Reports */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Previous Reports</h2>
                {totalAnalyses > 0 && (
                  <span className="text-xs text-slate-500">{totalAnalyses} total</span>
                )}
              </div>
              <div className="space-y-3">
                {visibleReports.map((analysis, idx) => {
                  const score = parseScore(analysis.scores);
                  return (
                    <div
                      key={analysis.id}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getScoreBg(score)} flex items-center justify-center`}>
                            <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium capitalize">{analysis.analysis_type} Analysis</p>
                              {idx === 0 && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">Latest</span>}
                              {score === bestScore && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Best</span>}
                            </div>
                            <p className="text-sm text-slate-400 mt-0.5">{formatDate(analysis.created_at)}</p>
                            {analysis.feedback && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-md">{analysis.feedback}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${getScoreColor(score)}`}>{score}/100</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Locked reports for free users */}
                {hiddenCount > 0 && (
                  <div className="relative">
                    <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-700/50" />
                        <div>
                          <div className="h-4 w-32 bg-slate-700/50 rounded" />
                          <div className="h-3 w-24 bg-slate-700/50 rounded mt-2" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-slate-300 font-medium mb-2">+{hiddenCount} more report{hiddenCount > 1 ? "s" : ""} locked</p>
                        <Link
                          href="/pricing"
                          className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full font-medium transition-colors"
                        >
                          Upgrade to See All History
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upgrade prompt for free users */}
            {!isPro && (
              <div className="bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-blue-500/20 rounded-2xl p-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Unlock Full Progress Tracking</h2>
                    <ul className="space-y-1.5 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">&#x2022;</span> Full analysis history
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">&#x2022;</span> Complete score trend graph
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">&#x2022;</span> Improvement insights & consistency tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">&#x2022;</span> Up to 15 analyses per month
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link
                      href="/pricing"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-bold transition-colors text-center shadow-lg shadow-emerald-500/20"
                    >
                      Go Pro &ndash; $9.99/mo
                    </Link>
                    <Link
                      href="/pricing"
                      className="text-emerald-400 hover:text-emerald-300 text-sm text-center"
                    >
                      View all plans &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="text-center py-6">
              <p className="text-white font-semibold text-lg mb-2">Ready to beat your score?</p>
              <p className="text-slate-400 mb-4">Every upload helps you track improvement and climb the leaderboard.</p>
              <Link
                href="/analyze"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
              >
                Upload Again to Improve Your Score
              </Link>
              <p className="text-sm text-slate-500 mt-3">Upload your video and get instant AI feedback in seconds.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
