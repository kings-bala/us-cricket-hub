"use client";

import { useState, useMemo, useCallback } from "react";
import { generateACPIRankings, roleIcons } from "@/data/mock";
import { PlayerRole } from "@/types";

type RankedPlayer = ReturnType<typeof generateACPIRankings>[number];

interface SquadAnalysis {
  balanceScore: number;
  battingDepth: number;
  bowlingVariety: number;
  alerts: string[];
  weaknesses: string[];
}

function analyzeSquad(squad: RankedPlayer[]): SquadAnalysis {
  const roleCounts: Record<string, number> = { Batsman: 0, Bowler: 0, "All-Rounder": 0, "Wicket-Keeper": 0 };
  squad.forEach((p) => { roleCounts[p.role]++; });

  const alerts: string[] = [];
  const weaknesses: string[] = [];

  if (roleCounts["Wicket-Keeper"] === 0 && squad.length > 0) alerts.push("No wicket-keeper selected");
  if (roleCounts["Wicket-Keeper"] > 1) alerts.push("Multiple wicket-keepers - consider replacing one");
  if (roleCounts["Bowler"] < 3 && squad.length >= 8) alerts.push("Fewer than 3 specialist bowlers");
  if (roleCounts["Batsman"] < 3 && squad.length >= 8) alerts.push("Fewer than 3 specialist batsmen");

  const bowlingStyles = new Set(squad.filter((p) => p.role === "Bowler" || p.role === "All-Rounder").map((p) => {
    if (p.bowlingStyle.includes("Fast") || p.bowlingStyle.includes("Medium")) return "pace";
    return "spin";
  }));
  if (!bowlingStyles.has("pace") && squad.length >= 5) weaknesses.push("No pace bowling option");
  if (!bowlingStyles.has("spin") && squad.length >= 5) weaknesses.push("No spin bowling option");

  const battingStyles = new Set(squad.filter((p) => p.role === "Batsman" || p.role === "All-Rounder" || p.role === "Wicket-Keeper").map((p) => p.battingStyle));
  if (battingStyles.size === 1 && squad.length >= 5) weaknesses.push("All batsmen are " + [...battingStyles][0] + " - no variety");

  const avgACPI = squad.length > 0 ? squad.reduce((s, p) => s + p.acpiScore.overall, 0) / squad.length : 0;
  const battingDepth = Math.min(100, (roleCounts["Batsman"] + roleCounts["All-Rounder"] + roleCounts["Wicket-Keeper"]) / 7 * 100);

  const paceCount = squad.filter((p) => (p.role === "Bowler" || p.role === "All-Rounder") && (p.bowlingStyle.includes("Fast") || p.bowlingStyle.includes("Medium"))).length;
  const spinCount = squad.filter((p) => (p.role === "Bowler" || p.role === "All-Rounder") && !(p.bowlingStyle.includes("Fast") || p.bowlingStyle.includes("Medium"))).length;
  const bowlingVariety = squad.length > 0 ? Math.min(100, (Math.min(paceCount, 3) + Math.min(spinCount, 2)) / 5 * 100) : 0;

  const idealRatios = { Batsman: 4, Bowler: 4, "All-Rounder": 2, "Wicket-Keeper": 1 };
  let balanceScore = 100;
  if (squad.length >= 8) {
    Object.entries(idealRatios).forEach(([role, ideal]) => {
      const diff = Math.abs(roleCounts[role] - ideal);
      balanceScore -= diff * 10;
    });
  }
  balanceScore = Math.max(0, Math.min(100, balanceScore + (avgACPI > 60 ? 10 : 0)));

  return { balanceScore: Math.round(balanceScore), battingDepth: Math.round(battingDepth), bowlingVariety: Math.round(bowlingVariety), alerts, weaknesses };
}

export default function SquadBuilderPage() {
  const [squad, setSquad] = useState<RankedPlayer[]>([]);
  const [roleFilter, setRoleFilter] = useState<PlayerRole | "All">("All");
  const [search, setSearch] = useState("");

  const allPlayers = useMemo(() => generateACPIRankings(), []);

  const availablePlayers = useMemo(() => {
    const squadIds = new Set(squad.map((p) => p.id));
    let result = allPlayers.filter((p) => !squadIds.has(p.id));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q));
    }
    if (roleFilter !== "All") result = result.filter((p) => p.role === roleFilter);
    return result;
  }, [allPlayers, squad, search, roleFilter]);

  const analysis = useMemo(() => analyzeSquad(squad), [squad]);

  const addToSquad = useCallback((player: RankedPlayer) => {
    if (squad.length >= 11) return;
    setSquad((prev) => [...prev, player]);
  }, [squad.length]);

  const removeFromSquad = useCallback((playerId: string) => {
    setSquad((prev) => prev.filter((p) => p.id !== playerId));
  }, []);

  const clearSquad = useCallback(() => setSquad([]), []);

  const roleCounts: Record<string, number> = { Batsman: 0, Bowler: 0, "All-Rounder": 0, "Wicket-Keeper": 0 };
  squad.forEach((p) => { roleCounts[p.role]++; });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Squad Builder</h1>
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full border border-orange-500/30">Captain Mode</span>
        </div>
        <p className="text-slate-400">Build your dream XI. AI analyzes team balance, batting depth, bowling variety, and detects weaknesses.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Your Squad ({squad.length}/11)</h2>
              {squad.length > 0 && (
                <button onClick={clearSquad} className="text-xs text-red-400 hover:text-red-300">Clear All</button>
              )}
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {(["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"] as PlayerRole[]).map((r) => (
                <span key={r} className="text-xs bg-slate-900/50 text-slate-400 px-2 py-1 rounded-full">
                  {roleIcons[r]} {roleCounts[r]}
                </span>
              ))}
            </div>

            {squad.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Click players from the list to add them to your squad
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {squad.map((player, idx) => (
                  <div key={player.id} className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-3 group">
                    <span className="text-xs text-slate-500 w-5">{idx + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {player.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{player.name}</p>
                      <p className="text-xs text-slate-500">{roleIcons[player.role]} {player.role} &middot; ACPI {player.acpiScore.overall}</p>
                    </div>
                    <button
                      onClick={() => removeFromSquad(player.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {squad.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-4">Squad Analysis</h3>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Team Balance</span>
                    <span className={`font-bold ${analysis.balanceScore >= 70 ? "text-emerald-400" : analysis.balanceScore >= 40 ? "text-amber-400" : "text-red-400"}`}>{analysis.balanceScore}/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${analysis.balanceScore >= 70 ? "bg-emerald-500" : analysis.balanceScore >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${analysis.balanceScore}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Batting Depth</span>
                    <span className={`font-bold ${analysis.battingDepth >= 70 ? "text-emerald-400" : analysis.battingDepth >= 40 ? "text-amber-400" : "text-red-400"}`}>{analysis.battingDepth}/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${analysis.battingDepth >= 70 ? "bg-emerald-500" : analysis.battingDepth >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${analysis.battingDepth}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Bowling Variety</span>
                    <span className={`font-bold ${analysis.bowlingVariety >= 70 ? "text-emerald-400" : analysis.bowlingVariety >= 40 ? "text-amber-400" : "text-red-400"}`}>{analysis.bowlingVariety}/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${analysis.bowlingVariety >= 70 ? "bg-emerald-500" : analysis.bowlingVariety >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${analysis.bowlingVariety}%` }} />
                  </div>
                </div>
              </div>

              {analysis.alerts.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-amber-400 mb-1">Alerts</p>
                  {analysis.alerts.map((alert, i) => (
                    <p key={i} className="text-xs text-amber-300/80 flex items-center gap-1 mb-0.5">
                      <span>&#9888;</span> {alert}
                    </p>
                  ))}
                </div>
              )}

              {analysis.weaknesses.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-400 mb-1">Weaknesses</p>
                  {analysis.weaknesses.map((w, i) => (
                    <p key={i} className="text-xs text-red-300/80 flex items-center gap-1 mb-0.5">
                      <span>&#10060;</span> {w}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search available players..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as PlayerRole | "All")}
                className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="All">All Roles</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket-Keeper">Wicket-Keeper</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {availablePlayers.map((player) => {
              const disabled = squad.length >= 11;
              return (
                <button
                  key={player.id}
                  onClick={() => addToSquad(player)}
                  disabled={disabled}
                  className={`w-full text-left bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 transition-all ${
                    disabled ? "opacity-50 cursor-not-allowed" : "hover:border-orange-500/50 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {player.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{player.name}</p>
                        {player.verified && (
                          <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{roleIcons[player.role]} {player.role} &middot; {player.country} &middot; {player.ageGroup}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs">
                      <div className="text-center">
                        <p className="text-slate-500">ACPI</p>
                        <p className="font-bold text-white">{player.acpiScore.overall}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-500">Form</p>
                        <p className={`font-bold ${
                          player.formStatus === "Red Hot" ? "text-red-400" :
                          player.formStatus === "In Form" ? "text-emerald-400" :
                          player.formStatus === "Steady" ? "text-amber-400" : "text-blue-400"
                        }`}>{player.formStatus}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-500">Rank</p>
                        <p className="font-bold text-white">#{player.acpiScore.nationalRank}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {availablePlayers.length === 0 && (
            <div className="text-center py-16 text-slate-500 text-sm">
              {squad.length >= 11 ? "Squad is full! (11/11)" : "No players match your search"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
