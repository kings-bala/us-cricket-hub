"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { generateCPIRankings, playerMatchHistory, regionColors } from "@/data/mock";
import { FormStatus, PlayerRole, Region } from "@/types";

const formStatusConfig: Record<FormStatus, { color: string; bg: string; border: string; label: string }> = {
  "Red Hot": { color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30", label: "Exceptional recent form - scoring/taking wickets consistently at elite level" },
  "In Form": { color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30", label: "Strong recent performances - reliable and contributing regularly" },
  "Steady": { color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30", label: "Moderate form - performing at average level with room to improve" },
  "Cold": { color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30", label: "Below par recent form - needs attention and support" },
};

export default function FormMeterPage() {
  const [formFilter, setFormFilter] = useState<FormStatus | "All">("All");
  const [role, setRole] = useState<PlayerRole | "All">("All");
  const [region, setRegion] = useState<Region | "All">("All");
  const [search, setSearch] = useState("");

  const allRanked = useMemo(() => generateCPIRankings(), []);

  const filtered = useMemo(() => {
    let result = [...allRanked];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q)
      );
    }
    if (formFilter !== "All") result = result.filter((p) => p.formStatus === formFilter);
    if (role !== "All") result = result.filter((p) => p.role === role);
    if (region !== "All") result = result.filter((p) => p.region === region);
    return result;
  }, [allRanked, search, formFilter, role, region]);

  const formCounts = useMemo(() => {
    const counts: Record<string, number> = { "Red Hot": 0, "In Form": 0, "Steady": 0, "Cold": 0 };
    allRanked.forEach((p) => { counts[p.formStatus]++; });
    return counts;
  }, [allRanked]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/players?tab=profile" className="text-sm text-slate-400 hover:text-white">← Back to Players Home</Link></div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">AI Form Meter</h1>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30">Rolling Last-5 Match Analysis</span>
        </div>
        <p className="text-slate-400">
          AI-powered form analysis using a weighted rolling average of the last 5 matches. Recent matches carry more weight.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(["Red Hot", "In Form", "Steady", "Cold"] as FormStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFormFilter(formFilter === status ? "All" : status)}
            className={`rounded-xl p-4 border transition-all text-left ${
              formFilter === status
                ? `${formStatusConfig[status].bg} ${formStatusConfig[status].border} ring-1 ring-offset-0`
                : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-semibold ${formStatusConfig[status].color}`}>{status}</span>
              <span className="text-2xl font-bold text-white">{formCounts[status]}</span>
            </div>
            <p className="text-xs text-slate-500">{formStatusConfig[status].label}</p>
          </button>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as PlayerRole | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Roles</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-Rounder">All-Rounder</option>
            <option value="Wicket-Keeper">Wicket-Keeper</option>
          </select>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Regions</option>
            <option value="South Asia">South Asia</option>
            <option value="Oceania">Oceania</option>
            <option value="Europe">Europe</option>
            <option value="Caribbean">Caribbean</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Middle East">Middle East</option>
          </select>
          <button
            onClick={() => { setSearch(""); setFormFilter("All"); setRole("All"); setRegion("All"); }}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-3">Showing {filtered.length} players</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((player) => {
          const matches = playerMatchHistory[player.id] || [];
          const last5 = matches.slice(0, 5);
          const config = formStatusConfig[player.formStatus];

          return (
            <Link key={player.id} href={`/players/${player.id}`}>
              <div className={`bg-slate-800/50 border rounded-xl p-5 hover:border-purple-500/50 transition-all group ${config.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {player.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors text-sm">{player.name}</h3>
                      <p className="text-xs text-slate-400">{player.role} &middot; {player.ageGroup}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${config.bg} ${config.color} ${config.border}`}>
                    {player.formStatus}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Last 5 Match Performance</p>
                  <div className="flex gap-1">
                    {last5.map((match, i) => {
                      const perf = player.role === "Bowler"
                        ? match.wicketsTaken * 20
                        : match.runsScored;
                      const maxVal = player.role === "Bowler" ? 100 : 150;
                      const height = Math.max(8, (perf / maxVal) * 100);
                      return (
                        <div key={match.matchId} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-slate-700/50 rounded-sm relative" style={{ height: "60px" }}>
                            <div
                              className={`absolute bottom-0 left-0 right-0 rounded-sm ${
                                i === 0 ? "bg-purple-500" : "bg-purple-500/60"
                              }`}
                              style={{ height: `${Math.min(height, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {player.role === "Bowler" ? `${match.wicketsTaken}w` : match.runsScored}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={`px-1.5 py-0.5 rounded-full ${regionColors[player.region] || "bg-slate-700/50 text-slate-300"}`}>
                    {player.country}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">CPI: <span className="text-white font-semibold">{player.cpiScore.overall}</span></span>
                    <span className="text-slate-500">Rank: <span className="text-white font-semibold">#{player.cpiScore.nationalRank}</span></span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No players match your filters</p>
          <button
            onClick={() => { setSearch(""); setFormFilter("All"); setRole("All"); setRegion("All"); }}
            className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
