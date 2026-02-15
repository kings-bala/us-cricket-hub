"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { generateCPIRankings, roleIcons, regionColors } from "@/data/mock";
import { AgeGroup, PlayerRole, Region } from "@/types";

const formStatusColors: Record<string, string> = {
  "Red Hot": "bg-red-500/20 text-red-400 border-red-500/30",
  "In Form": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Steady": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Cold": "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function RankingsPage() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "All">("All");
  const [role, setRole] = useState<PlayerRole | "All">("All");
  const [region, setRegion] = useState<Region | "All">("All");
  const [search, setSearch] = useState("");

  const allRanked = useMemo(() => generateCPIRankings(), []);

  const filtered = useMemo(() => {
    let result = [...allRanked];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q)
      );
    }
    if (ageGroup !== "All") result = result.filter((p) => p.ageGroup === ageGroup);
    if (role !== "All") result = result.filter((p) => p.role === role);
    if (region !== "All") result = result.filter((p) => p.region === region);
    return result;
  }, [allRanked, search, ageGroup, role, region]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/players?tab=profile" className="text-sm text-slate-400 hover:text-white">← Back to Players Home</Link></div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">CPI Rankings</h1>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">Cricket Performance Index</span>
        </div>
        <p className="text-slate-400">
          Proprietary ranking system: 40% Match Performance, 30% Athletic Metrics, 20% Form Index, 10% Consistency
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Match Performance</p>
          <p className="text-2xl font-bold mt-1 text-emerald-400">40%</p>
          <p className="text-xs text-slate-500 mt-1">Runs, wickets, strike rate</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Athletic Metrics</p>
          <p className="text-2xl font-bold mt-1 text-blue-400">30%</p>
          <p className="text-xs text-slate-500 mt-1">Yo-Yo, sprint, fitness</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Form Index</p>
          <p className="text-2xl font-bold mt-1 text-purple-400">20%</p>
          <p className="text-xs text-slate-500 mt-1">Last 5 match trend</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Consistency</p>
          <p className="text-2xl font-bold mt-1 text-amber-400">10%</p>
          <p className="text-xs text-slate-500 mt-1">Performance variance</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value as AgeGroup | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Age Groups</option>
            <option value="U13">U13</option>
            <option value="U15">U15</option>
            <option value="U17">U17</option>
            <option value="U19">U19</option>
            <option value="U21">U21</option>
            <option value="Men">Men</option>
          </select>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as PlayerRole | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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
            onClick={() => { setSearch(""); setAgeGroup("All"); setRole("All"); setRegion("All"); }}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-3">Showing {filtered.length} ranked players</p>
      </div>

      <div className="space-y-3">
        {filtered.map((player) => (
          <Link key={player.id} href={`/players/${player.id}`}>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="text-center w-12">
                  <p className="text-2xl font-bold text-slate-500">#{player.cpiScore.nationalRank}</p>
                  {player.cpiScore.rankChange !== 0 && (
                    <p className={`text-xs font-medium ${player.cpiScore.rankChange > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {player.cpiScore.rankChange > 0 ? "+" : ""}{player.cpiScore.rankChange}
                    </p>
                  )}
                </div>

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {player.name.split(" ").map((n) => n[0]).join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">{player.name}</h3>
                    {player.verified && (
                      <svg className="w-4 h-4 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${formStatusColors[player.formStatus]}`}>
                      {player.formStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-slate-400">{roleIcons[player.role]} {player.role}</span>
                    <span className="text-xs text-slate-600">&middot;</span>
                    <span className="text-xs text-slate-400">{player.ageGroup}</span>
                    <span className="text-xs text-slate-600">&middot;</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${regionColors[player.region] || "bg-slate-700/50 text-slate-300"}`}>{player.country}</span>
                    <span className="text-xs text-slate-600">&middot;</span>
                    <span className="text-xs text-slate-500">{player.state}</span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-3">
                  <div className="text-center px-3">
                    <p className="text-xs text-slate-500">Match</p>
                    <p className="text-sm font-bold text-emerald-400">{player.cpiScore.matchPerformance}</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-xs text-slate-500">Athletic</p>
                    <p className="text-sm font-bold text-blue-400">{player.cpiScore.athleticMetrics}</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-xs text-slate-500">Form</p>
                    <p className="text-sm font-bold text-purple-400">{player.cpiScore.formIndex}</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-xs text-slate-500">Consist.</p>
                    <p className="text-sm font-bold text-amber-400">{player.cpiScore.consistency}</p>
                  </div>
                </div>

                <div className="text-center shrink-0">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                                        player.cpiScore.overall >= 75 ? "border-emerald-500 bg-emerald-500/10" :
                                        player.cpiScore.overall >= 55 ? "border-blue-500 bg-blue-500/10" :
                                        player.cpiScore.overall >= 35 ? "border-amber-500 bg-amber-500/10" :
                    "border-slate-600 bg-slate-700/50"
                  }`}>
                    <p className={`text-lg font-bold ${
                                            player.cpiScore.overall >= 75 ? "text-emerald-400" :
                                            player.cpiScore.overall >= 55 ? "text-blue-400" :
                                            player.cpiScore.overall >= 35 ? "text-amber-400" :
                      "text-slate-400"
                    }`}>{player.cpiScore.overall}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">CPI</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No players match your filters</p>
          <button
            onClick={() => { setSearch(""); setAgeGroup("All"); setRole("All"); setRegion("All"); }}
            className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
