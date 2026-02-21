"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { players, playerMatchHistory, playerCombineData, calculateCPI, getFormStatus } from "@/data/mock";

const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import("recharts").then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(m => m.Area), { ssr: false });
const RadarChart = dynamic(() => import("recharts").then(m => m.RadarChart), { ssr: false });
const Radar = dynamic(() => import("recharts").then(m => m.Radar), { ssr: false });
const PolarGrid = dynamic(() => import("recharts").then(m => m.PolarGrid), { ssr: false });
const PolarAngleAxis = dynamic(() => import("recharts").then(m => m.PolarAngleAxis), { ssr: false });
const PolarRadiusAxis = dynamic(() => import("recharts").then(m => m.PolarRadiusAxis), { ssr: false });

function CPIRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#3b82f6" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">CPI</span>
      </div>
    </div>
  );
}

function FormBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; glow: string }> = {
    "Red Hot": { bg: "bg-red-500/20", text: "text-red-400", glow: "shadow-red-500/20 shadow-lg" },
    "In Form": { bg: "bg-emerald-500/20", text: "text-emerald-400", glow: "shadow-emerald-500/20 shadow-lg" },
    "Steady": { bg: "bg-amber-500/20", text: "text-amber-400", glow: "" },
    "Cold": { bg: "bg-slate-600/50", text: "text-slate-400", glow: "" },
  };
  const c = config[status] || config["Cold"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} ${c.glow}`}>
      {status === "Red Hot" && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
      {status === "In Form" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
      {status}
    </span>
  );
}

function ProgressBar({ label, value, max, unit }: { label: string; value: number; max: number; unit?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  const textColor = pct >= 75 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400";

  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`text-xs font-semibold ${textColor}`}>{value}{unit}</span>
      </div>
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function HeroNumber({ value, label, color = "emerald" }: { value: string | number; label: string; color?: string }) {
  const colors: Record<string, string> = { emerald: "text-emerald-400", blue: "text-blue-400", red: "text-red-400", amber: "text-amber-400", purple: "text-purple-400" };
  return (
    <div className="text-center">
      <div className={`text-4xl font-black ${colors[color] || colors.emerald}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center px-3 py-2 bg-slate-800/30 rounded-lg">
      <div className="text-sm font-semibold text-white">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase">{label}</div>
    </div>
  );
}

export default function StatsPage() {
  const [selectedId, setSelectedId] = useState(players[0].id);

  const player = useMemo(() => players.find(p => p.id === selectedId) || players[0], [selectedId]);
  const matches = useMemo(() => playerMatchHistory[selectedId] || [], [selectedId]);
  const combine = useMemo(() => playerCombineData[selectedId], [selectedId]);
  const cpi = useMemo(() => calculateCPI(player, matches), [player, matches]);
  const form = useMemo(() => getFormStatus(matches, player.role), [matches, player.role]);

  const battingChartData = useMemo(() =>
    [...matches].reverse().map(m => ({
      name: m.opponent.split(" ")[0],
      runs: m.runsScored,
    })),
  [matches]);

  const formTrendData = useMemo(() =>
    [...matches].reverse().map(m => {
      const sr = m.ballsFaced > 0 ? Math.round((m.runsScored / m.ballsFaced) * 100) : 0;
      return {
        name: m.date.slice(5),
        runs: m.runsScored,
        wickets: m.wicketsTaken * 20,
        sr,
        impact: m.runsScored + m.wicketsTaken * 25 + (m.manOfMatch ? 30 : 0),
      };
    }),
  [matches]);

  const radarData = useMemo(() => [
    { axis: "Match", value: cpi.matchPerformance },
    { axis: "Athletic", value: cpi.athleticMetrics },
    { axis: "Form", value: cpi.formIndex },
    { axis: "Consistency", value: cpi.consistency },
  ], [cpi]);

  const aiInsights = useMemo(() => {
    const insights: string[] = [];
    if (matches.length >= 2) {
      const recent3 = matches.slice(0, 3);
      const older = matches.slice(3);
      if (recent3.length && older.length) {
        const recentAvgRuns = recent3.reduce((s, m) => s + m.runsScored, 0) / recent3.length;
        const olderAvgRuns = older.reduce((s, m) => s + m.runsScored, 0) / older.length;
        const runsDiff = Math.round(((recentAvgRuns - olderAvgRuns) / Math.max(olderAvgRuns, 1)) * 100);
        if (Math.abs(runsDiff) >= 10) {
          insights.push(`Batting average ${runsDiff > 0 ? "up" : "down"} ${Math.abs(runsDiff)}% over last 3 matches`);
        }
        const recentSR = recent3.reduce((s, m) => s + (m.ballsFaced > 0 ? (m.runsScored / m.ballsFaced * 100) : 0), 0) / recent3.length;
        const olderSR = older.reduce((s, m) => s + (m.ballsFaced > 0 ? (m.runsScored / m.ballsFaced * 100) : 0), 0) / older.length;
        const srDiff = Math.round(recentSR - olderSR);
        if (Math.abs(srDiff) >= 5) {
          insights.push(`Strike rate ${srDiff > 0 ? "improved" : "dropped"} by ${Math.abs(srDiff)} points recently`);
        }
      }
      const motm = matches.filter(m => m.manOfMatch).length;
      if (motm >= 2) insights.push(`${motm} Man of the Match awards in last ${matches.length} innings`);
    }
    if (form === "Red Hot") insights.push("Currently in Red Hot form — riding a purple patch");
    if (cpi.overall >= 75) insights.push(`CPI of ${cpi.overall} puts you in the elite bracket`);
    if (combine) {
      if (combine.yoYoScore >= 19) insights.push(`Yo-Yo score of ${combine.yoYoScore} — top-tier endurance`);
      if (combine.bowlingSpeed && combine.bowlingSpeed >= 140) insights.push(`Bowling at ${combine.bowlingSpeed} km/h — express pace`);
    }
    if (insights.length === 0) insights.push("Keep logging sessions to unlock AI insights");
    return insights;
  }, [matches, form, cpi, combine]);

  const bowlingEconomy = useMemo(() => {
    const withOvers = matches.filter(m => m.oversBowled > 0);
    if (!withOvers.length) return 0;
    return Math.round(withOvers.reduce((s, m) => s + m.runsConceded / m.oversBowled, 0) / withOvers.length * 10) / 10;
  }, [matches]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Player Intelligence Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Visual analytics powered by CricVerse360 AI</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <Link href="/players" className="text-xs text-emerald-400 hover:text-emerald-300 whitespace-nowrap">View All Players</Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-800/80 via-slate-800/50 to-slate-800/80 border border-slate-700/50 rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <CPIRing score={cpi.overall} size={120} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{player.name}</h2>
              <FormBadge status={form} />
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-slate-400">
              <span>{player.role}</span>
              <span className="text-slate-600">|</span>
              <span>{player.battingStyle}</span>
              <span className="text-slate-600">|</span>
              <span>{player.city}, {player.country}</span>
              <span className="text-slate-600">|</span>
              <span>{player.ageGroup} &middot; Age {player.age}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
              <span className={`text-xs px-2.5 py-1 rounded-full ${player.profileTier === "Elite" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : player.profileTier === "Premium" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-600/50 text-slate-400 border border-slate-600"}`}>
                {player.profileTier}
              </span>
              {player.verified && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Verified</span>
              )}
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-300">{player.stats.matches} Matches</span>
            </div>
          </div>
          <div className="flex-shrink-0 hidden lg:flex gap-4">
            {[
              { label: "Nat. Rank", value: `#${cpi.nationalRank || Math.ceil(Math.random() * 20)}` },
              { label: "State Rank", value: `#${cpi.stateRank || Math.ceil(Math.random() * 10)}` },
            ].map(r => (
              <div key={r.label} className="text-center px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="text-lg font-bold text-white">{r.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">Batting</h3>
            <span className="text-[10px] text-slate-500">Last {matches.length} innings</span>
          </div>
          <div className="flex items-start gap-6 mb-4">
            <HeroNumber value={player.stats.runs.toLocaleString()} label="Career Runs" color="emerald" />
            <div className="flex-1 grid grid-cols-4 gap-2">
              <MiniStat label="Avg" value={player.stats.battingAverage} />
              <MiniStat label="SR" value={player.stats.strikeRate} />
              <MiniStat label="50s" value={player.stats.fifties} />
              <MiniStat label="100s" value={player.stats.hundreds} />
            </div>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={battingChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: 12 }}
                />
                <Bar dataKey="runs" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide">Bowling</h3>
            <span className="text-[10px] text-slate-500">Economy Rate</span>
          </div>
          <div className="flex items-start gap-6 mb-4">
            <HeroNumber value={player.stats.wickets} label="Career Wickets" color="red" />
            <div className="flex-1 grid grid-cols-3 gap-2">
              <MiniStat label="Avg" value={player.stats.bowlingAverage || "-"} />
              <MiniStat label="Econ" value={player.stats.economy || "-"} />
              <MiniStat label="Best" value={player.stats.bestBowling} />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Recent Economy</span>
              <span className={`text-sm font-bold ${bowlingEconomy <= 5 ? "text-emerald-400" : bowlingEconomy <= 7 ? "text-amber-400" : "text-red-400"}`}>
                {bowlingEconomy || "-"}
              </span>
            </div>
            <div className="relative h-4 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 opacity-20 w-full" />
              {bowlingEconomy > 0 && (
                <div
                  className="absolute top-0 h-full w-1.5 bg-white rounded-full shadow-lg shadow-white/30 transition-all duration-700"
                  style={{ left: `${Math.min((bowlingEconomy / 12) * 100, 98)}%` }}
                />
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between px-1">
                <span className="text-[8px] text-slate-600">0</span>
                <span className="text-[8px] text-slate-600">6</span>
                <span className="text-[8px] text-slate-600">12</span>
              </div>
            </div>
            <div className="flex justify-between mt-3">
              {matches.filter(m => m.oversBowled > 0).slice(0, 5).reverse().map((m, i) => (
                <div key={i} className="text-center">
                  <div className={`text-xs font-semibold ${m.wicketsTaken >= 3 ? "text-red-400" : "text-slate-300"}`}>
                    {m.wicketsTaken}/{m.runsConceded}
                  </div>
                  <div className="text-[9px] text-slate-600">{m.opponent.split(" ")[0]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-4">Form Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="impact" stroke="#3b82f6" fill="url(#impactGradient)" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-4">CPI Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <PolarRadiusAxis tick={false} domain={[0, 100]} axisLine={false} />
                <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.25} strokeWidth={2} dot={{ fill: "#a855f7", r: 3 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {combine && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Combine Assessment</h3>
              {combine.verifiedAthlete && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Verified</span>
              )}
            </div>
            <div className="space-y-3">
              <ProgressBar label="Yo-Yo Test" value={combine.yoYoScore} max={22} />
              <ProgressBar label="Sprint 20m" value={Math.max(0, 4.5 - combine.sprint20m)} max={1.5} unit="s" />
              {combine.bowlingSpeed && <ProgressBar label="Bowling Speed" value={combine.bowlingSpeed} max={160} unit=" km/h" />}
              {combine.batSpeed && <ProgressBar label="Bat Speed" value={combine.batSpeed} max={140} unit=" km/h" />}
              <ProgressBar label="Vertical Jump" value={combine.verticalJump} max={80} unit=" cm" />
              <ProgressBar label="Fielding Efficiency" value={combine.fieldingEfficiency} max={100} unit="%" />
              <ProgressBar label="Throw Accuracy" value={combine.throwAccuracy} max={100} unit="%" />
              <ProgressBar label="Reaction Time" value={Math.max(0, 0.5 - combine.reactionTime)} max={0.3} unit="s" />
            </div>
            <div className="mt-3 text-[10px] text-slate-500">
              Assessed: {combine.assessmentDate} &middot; Next: {combine.nextAssessmentDate}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.59.659H9.06a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.5" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-700/30">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/30">
            <p className="text-[10px] text-slate-500 italic">Insights generated from last {matches.length} match performances + combine data</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/players" className="text-xs px-4 py-2 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 transition-colors">
          Cricinfo
        </Link>
        <Link href="/rankings" className="text-xs px-4 py-2 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 transition-colors">
          CPI Metrics
        </Link>
      </div>
    </div>
  );
}
