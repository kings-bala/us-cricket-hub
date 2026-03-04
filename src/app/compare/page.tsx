"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { players } from "@/data/mock";
import SubscriptionGate from "@/components/SubscriptionGate";

type CompareMetric = "batting" | "bowling" | "fitness" | "overall";

function calcImpactScore(p: typeof players[0]): number {
  const batWeight = p.role === "Bowler" ? 0.2 : 0.4;
  const bowlWeight = p.role === "Batsman" ? 0.15 : 0.35;
  const fieldWeight = 0.1;
  const fitWeight = 0.15;
  const batScore = Math.min(100, (p.stats.battingAverage / 50) * 40 + (p.stats.strikeRate / 150) * 30 + (p.stats.hundreds * 8) + (p.stats.fifties * 3));
  const bowlScore = p.stats.wickets > 0 ? Math.min(100, (1 - p.stats.bowlingAverage / 40) * 40 + (1 - p.stats.economy / 10) * 30 + p.stats.wickets * 0.8) : 0;
  const fieldScore = Math.min(100, (p.stats.catches + p.stats.stumpings) * 3);
  const fitScore = Math.min(100, (p.fitnessData.yoYoTest / 20) * 40 + (p.fitnessData.beepTestLevel / 15) * 30 + ((p.fitnessData.bowlingSpeed || 100) / 150) * 30);
  return Math.round(batScore * batWeight + bowlScore * bowlWeight + fieldScore * fieldWeight + fitScore * fitWeight);
}

function calcRoleFit(p: typeof players[0]): Record<string, number> {
  const sr = p.stats.strikeRate;
  const avg = p.stats.battingAverage;
  const eco = p.stats.economy;
  const speed = p.fitnessData.bowlingSpeed || 0;
  return {
    "Opener": Math.min(100, Math.round((sr / 150) * 50 + (avg / 50) * 50)),
    "Anchor": Math.min(100, Math.round((avg / 50) * 60 + (1 - sr / 200) * 40 + 20)),
    "Finisher": Math.min(100, Math.round((sr / 160) * 70 + (avg / 40) * 30)),
    "Powerplay Bowler": Math.min(100, Math.round((speed / 150) * 50 + (eco > 0 ? (1 - eco / 10) * 50 : 0))),
    "Death Bowler": Math.min(100, Math.round((speed / 150) * 40 + (eco > 0 ? (1 - eco / 12) * 40 : 0) + (p.stats.wickets / 100) * 20)),
    "Spin Option": Math.min(100, Math.round(p.bowlingStyle.includes("spin") || p.bowlingStyle.includes("Orthodox") || p.bowlingStyle.includes("Chinaman") || p.bowlingStyle.includes("Leg") ? 70 + (eco > 0 ? (1 - eco / 8) * 30 : 0) : 15)),
  };
}

function calcTrendScore(p: typeof players[0]): { score: number; direction: "up" | "down" | "stable" } {
  const base = calcImpactScore(p);
  const ageBonus = p.age < 18 ? 15 : p.age < 20 ? 10 : 5;
  const matchBonus = p.stats.matches > 40 ? 10 : p.stats.matches > 20 ? 5 : 0;
  const score = Math.min(100, base + ageBonus + matchBonus);
  const direction = ageBonus > 10 ? "up" : ageBonus > 5 ? "up" : "stable";
  return { score, direction };
}

export default function ComparePage() {
  return (
    <SubscriptionGate feature="compare_players">
      <CompareContent />
    </SubscriptionGate>
  );
}

function CompareContent() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["p1", "p8"]);
  const [metricView, setMetricView] = useState<CompareMetric>("overall");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  const selectedPlayers = useMemo(() => {
    return selectedIds.map(id => players.find(p => p.id === id)).filter(Boolean) as typeof players;
  }, [selectedIds]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return players.filter(p => !selectedIds.includes(p.id)).slice(0, 8);
    const q = searchQuery.toLowerCase();
    return players.filter(p => !selectedIds.includes(p.id) && (p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)));
  }, [searchQuery, selectedIds]);

  const addPlayer = (id: string) => {
    if (selectedIds.length >= 4) return;
    setSelectedIds(prev => [...prev, id]);
    setShowAddPlayer(false);
    setSearchQuery("");
  };

  const removePlayer = (id: string) => {
    if (selectedIds.length <= 2) return;
    setSelectedIds(prev => prev.filter(x => x !== id));
  };

  const metricTabs: { key: CompareMetric; label: string }[] = [
    { key: "overall", label: "Overall" },
    { key: "batting", label: "Batting" },
    { key: "bowling", label: "Bowling" },
    { key: "fitness", label: "Fitness" },
  ];

  const renderBar = (value: number, max: number, color: string) => {
    const pct = Math.min(100, (value / max) * 100);
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-700/50 rounded-full h-2.5">
          <div className={"h-2.5 rounded-full " + color} style={{ width: pct + "%" }} />
        </div>
        <span className="text-sm text-white font-medium w-12 text-right">{typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}</span>
      </div>
    );
  };

  const renderRoleFitBar = (value: number) => {
    const color = value >= 75 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : value >= 25 ? "bg-orange-500" : "bg-red-500";
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-700/50 rounded-full h-2">
          <div className={"h-2 rounded-full " + color} style={{ width: value + "%" }} />
        </div>
        <span className="text-xs text-slate-300 w-8 text-right">{value}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-3"><Link href="/players" className="text-sm text-slate-400 hover:text-white">&larr; Back to Players</Link></div>

        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Analytics</p>
            <h1 className="text-3xl font-bold text-white mb-2">Player Comparison</h1>
            <p className="text-slate-400">Side-by-side analysis with AI-powered Impact, Role Fit, and Trend scores</p>
          </div>
          {selectedIds.length < 4 && (
            <button onClick={() => setShowAddPlayer(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
              + Add Player
            </button>
          )}
        </div>

        {showAddPlayer && (
          <div className="glass-card rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Player to Compare</h3>
              <button onClick={() => { setShowAddPlayer(false); setSearchQuery(""); }} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, country, or role..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {searchResults.map(p => (
                <button key={p.id} onClick={() => addPlayer(p.id)}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 hover:border-emerald-500/50 transition-all text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.role} &middot; {p.country}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={"grid gap-4 mb-8 " + (selectedPlayers.length === 2 ? "grid-cols-2" : selectedPlayers.length === 3 ? "grid-cols-3" : "grid-cols-4")}>
          {selectedPlayers.map(p => {
            const impact = calcImpactScore(p);
            const trend = calcTrendScore(p);
            return (
              <div key={p.id} className="glass-card rounded-xl p-5 relative">
                {selectedIds.length > 2 && (
                  <button onClick={() => removePlayer(p.id)} className="absolute top-3 right-3 text-slate-500 hover:text-red-400 text-sm">&times;</button>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400">{p.role} &middot; {p.country} &middot; {p.ageGroup}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-emerald-400">{impact}</p>
                    <p className="text-xs text-slate-400">Impact</p>
                  </div>
                  <div className="text-center bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-400">{trend.score}</p>
                    <p className="text-xs text-slate-400">Trend</p>
                  </div>
                  <div className={"text-center rounded-lg p-3 border " + (trend.direction === "up" ? "bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20" : "bg-gradient-to-br from-slate-500/10 to-slate-600/10 border-slate-500/20")}>
                    <p className={"text-2xl font-bold " + (trend.direction === "up" ? "text-green-400" : "text-slate-400")}>{trend.direction === "up" ? "\u2191" : "\u2192"}</p>
                    <p className="text-xs text-slate-400">{trend.direction === "up" ? "Rising" : "Stable"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <p className="text-sm font-semibold text-white">{p.stats.matches}</p>
                    <p className="text-xs text-slate-500">Matches</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <p className="text-sm font-semibold text-white">{p.stats.runs}</p>
                    <p className="text-xs text-slate-500">Runs</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <p className="text-sm font-semibold text-white">{p.stats.wickets}</p>
                    <p className="text-xs text-slate-500">Wickets</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <p className="text-sm font-semibold text-white">{p.stats.strikeRate}</p>
                    <p className="text-xs text-slate-500">SR</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mb-6">
          {metricTabs.map(t => (
            <button key={t.key} onClick={() => setMetricView(t.key)}
              className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors " + (metricView === t.key ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white")}>
              {t.label}
            </button>
          ))}
        </div>

        {metricView === "overall" && (
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4">AI Impact Score Breakdown</h3>
              <div className="space-y-4">
                {selectedPlayers.map(p => (
                  <div key={p.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{p.name}</span>
                      <span className="text-sm font-bold text-emerald-400">{calcImpactScore(p)}/100</span>
                    </div>
                    {renderBar(calcImpactScore(p), 100, "bg-gradient-to-r from-emerald-500 to-blue-500")}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Role Fit Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left px-3 py-2 text-xs text-slate-400 font-medium">Role</th>
                      {selectedPlayers.map(p => (
                        <th key={p.id} className="text-left px-3 py-2 text-xs text-slate-400 font-medium">{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(calcRoleFit(selectedPlayers[0])).map(role => (
                      <tr key={role} className="border-b border-slate-700/30">
                        <td className="px-3 py-2.5 text-slate-300 font-medium">{role}</td>
                        {selectedPlayers.map(p => (
                          <td key={p.id} className="px-3 py-2.5">{renderRoleFitBar(calcRoleFit(p)[role])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Trend Score & Direction</h3>
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(" + selectedPlayers.length + ", 1fr)" }}>
                {selectedPlayers.map(p => {
                  const trend = calcTrendScore(p);
                  return (
                    <div key={p.id} className="text-center">
                      <p className="text-sm text-slate-400 mb-2">{p.name}</p>
                      <div className={"inline-flex items-center gap-2 px-4 py-2 rounded-full " + (trend.direction === "up" ? "bg-green-500/20 border border-green-500/30" : "bg-slate-700/50 border border-slate-600/50")}>
                        <span className={"text-xl font-bold " + (trend.direction === "up" ? "text-green-400" : "text-slate-400")}>{trend.score}</span>
                        <span className={"text-sm " + (trend.direction === "up" ? "text-green-400" : "text-slate-400")}>{trend.direction === "up" ? "\u2191 Rising" : "\u2192 Stable"}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Age {p.age} &middot; {p.stats.matches} matches</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {metricView === "batting" && (
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Batting Comparison</h3>
            <div className="space-y-5">
              {[
                { label: "Runs", key: "runs" as const, max: 2000, color: "bg-emerald-500" },
                { label: "Batting Average", key: "battingAverage" as const, max: 60, color: "bg-blue-500" },
                { label: "Strike Rate", key: "strikeRate" as const, max: 160, color: "bg-amber-500" },
                { label: "Fifties", key: "fifties" as const, max: 20, color: "bg-purple-500" },
                { label: "Hundreds", key: "hundreds" as const, max: 5, color: "bg-red-500" },
                { label: "Not Outs", key: "notOuts" as const, max: 10, color: "bg-teal-500" },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-sm text-slate-400 mb-2">{m.label}</p>
                  {selectedPlayers.map(p => (
                    <div key={p.id} className="mb-1.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-slate-500 w-28 truncate">{p.name}</span>
                        {renderBar(p.stats[m.key], m.max, m.color)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {metricView === "bowling" && (
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Bowling Comparison</h3>
            <div className="space-y-5">
              {[
                { label: "Wickets", getValue: (p: typeof players[0]) => p.stats.wickets, max: 100, color: "bg-red-500" },
                { label: "Bowling Average", getValue: (p: typeof players[0]) => p.stats.bowlingAverage, max: 40, color: "bg-blue-500", invert: true },
                { label: "Economy", getValue: (p: typeof players[0]) => p.stats.economy, max: 10, color: "bg-amber-500", invert: true },
                { label: "Bowling Speed (km/h)", getValue: (p: typeof players[0]) => p.fitnessData.bowlingSpeed || 0, max: 160, color: "bg-purple-500" },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-sm text-slate-400 mb-2">{m.label}</p>
                  {selectedPlayers.map(p => (
                    <div key={p.id} className="mb-1.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-slate-500 w-28 truncate">{p.name}</span>
                        {renderBar(m.getValue(p), m.max, m.color)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {metricView === "fitness" && (
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Fitness Comparison</h3>
            <div className="space-y-5">
              {[
                { label: "Yo-Yo Test", getValue: (p: typeof players[0]) => p.fitnessData.yoYoTest, max: 22, color: "bg-emerald-500" },
                { label: "Sprint Speed (s)", getValue: (p: typeof players[0]) => p.fitnessData.sprintSpeed, max: 10, color: "bg-blue-500" },
                { label: "Beep Test Level", getValue: (p: typeof players[0]) => p.fitnessData.beepTestLevel, max: 15, color: "bg-purple-500" },
                { label: "Throw Distance (m)", getValue: (p: typeof players[0]) => p.fitnessData.throwDistance, max: 80, color: "bg-amber-500" },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-sm text-slate-400 mb-2">{m.label}</p>
                  {selectedPlayers.map(p => (
                    <div key={p.id} className="mb-1.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-slate-500 w-28 truncate">{p.name}</span>
                        {renderBar(m.getValue(p), m.max, m.color)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-3">AI Verdict</h3>
          {selectedPlayers.length === 2 && (() => {
            const [a, b] = selectedPlayers;
            const aImpact = calcImpactScore(a);
            const bImpact = calcImpactScore(b);
            const better = aImpact >= bImpact ? a : b;
            const roleFitA = calcRoleFit(a);
            const roleFitB = calcRoleFit(b);
            const bestRoleA = Object.entries(roleFitA).sort((x, y) => y[1] - x[1])[0];
            const bestRoleB = Object.entries(roleFitB).sort((x, y) => y[1] - x[1])[0];
            return (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  <span className="text-emerald-400 font-semibold">{better.name}</span> has the higher overall Impact Score ({Math.max(aImpact, bImpact)} vs {Math.min(aImpact, bImpact)}).
                </p>
                <p className="text-sm text-slate-300">
                  Best role fit: <span className="text-blue-400">{a.name}</span> as <span className="text-white font-medium">{bestRoleA[0]}</span> ({bestRoleA[1]}),{" "}
                  <span className="text-blue-400">{b.name}</span> as <span className="text-white font-medium">{bestRoleB[0]}</span> ({bestRoleB[1]}).
                </p>
                <p className="text-sm text-slate-300">
                  Trend: <span className="text-blue-400">{a.name}</span> is{" "}
                  <span className={calcTrendScore(a).direction === "up" ? "text-green-400" : "text-slate-400"}>{calcTrendScore(a).direction === "up" ? "trending up" : "stable"}</span>,{" "}
                  <span className="text-blue-400">{b.name}</span> is{" "}
                  <span className={calcTrendScore(b).direction === "up" ? "text-green-400" : "text-slate-400"}>{calcTrendScore(b).direction === "up" ? "trending up" : "stable"}</span>.
                </p>
              </div>
            );
          })()}
          {selectedPlayers.length > 2 && (
            <div>
              <p className="text-sm text-slate-300 mb-2">Impact Score Rankings:</p>
              {[...selectedPlayers].sort((a, b) => calcImpactScore(b) - calcImpactScore(a)).map((p, i) => (
                <p key={p.id} className="text-sm text-slate-300">
                  {i + 1}. <span className="text-emerald-400 font-semibold">{p.name}</span> - Impact: {calcImpactScore(p)}, Trend: {calcTrendScore(p).score} ({calcTrendScore(p).direction})
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
