"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { players, playerCombineData, regionColors } from "@/data/mock";
import { PlayerRole, Region } from "@/types";

export default function CombinePage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<PlayerRole | "All">("All");
  const [region, setRegion] = useState<Region | "All">("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"yoYo" | "sprint" | "vertical" | "fielding">("yoYo");

  const playersWithCombine = useMemo(() => {
    return players
      .filter((p) => playerCombineData[p.id])
      .map((p) => ({ ...p, combine: playerCombineData[p.id] }));
  }, []);

  const filtered = useMemo(() => {
    let result = [...playersWithCombine];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q) || p.country.toLowerCase().includes(q)
      );
    }
    if (role !== "All") result = result.filter((p) => p.role === role);
    if (region !== "All") result = result.filter((p) => p.region === region);
    if (verifiedOnly) result = result.filter((p) => p.combine.verifiedAthlete);

    result.sort((a, b) => {
      switch (sortBy) {
        case "yoYo": return b.combine.yoYoScore - a.combine.yoYoScore;
        case "sprint": return a.combine.sprint20m - b.combine.sprint20m;
        case "vertical": return b.combine.verticalJump - a.combine.verticalJump;
        case "fielding": return b.combine.fieldingEfficiency - a.combine.fieldingEfficiency;
        default: return 0;
      }
    });
    return result;
  }, [playersWithCombine, search, role, region, verifiedOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/players?tab=profile" className="text-sm text-slate-400 hover:text-white">← Back to Players Home</Link></div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Verified Combine & Assessment</h1>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">Bi-Annual</span>
        </div>
        <p className="text-slate-400">
          Standardized athletic assessments: Yo-Yo test, 20m sprint, bowling speed, bat speed, vertical jump, and fielding efficiency. Reassessment every 6 months.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">Yo-Yo Test</p>
          <p className="text-lg font-bold text-emerald-400 mt-1">Endurance</p>
          <p className="text-xs text-slate-500 mt-1">Score /20</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">20m Sprint</p>
          <p className="text-lg font-bold text-blue-400 mt-1">Speed</p>
          <p className="text-xs text-slate-500 mt-1">Seconds</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">Bowl Speed</p>
          <p className="text-lg font-bold text-red-400 mt-1">Pace</p>
          <p className="text-xs text-slate-500 mt-1">km/h</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">Bat Speed</p>
          <p className="text-lg font-bold text-amber-400 mt-1">Power</p>
          <p className="text-xs text-slate-500 mt-1">km/h</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">Vertical Jump</p>
          <p className="text-lg font-bold text-purple-400 mt-1">Power</p>
          <p className="text-xs text-slate-500 mt-1">cm</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">Fielding Eff.</p>
          <p className="text-lg font-bold text-cyan-400 mt-1">Agility</p>
          <p className="text-xs text-slate-500 mt-1">%</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as PlayerRole | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
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
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Regions</option>
            <option value="South Asia">South Asia</option>
            <option value="Oceania">Oceania</option>
            <option value="Americas">Americas</option>
            <option value="Caribbean">Caribbean</option>
            <option value="Africa">Africa</option>
            <option value="Europe">Europe</option>
            <option value="Middle East">Middle East</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "yoYo" | "sprint" | "vertical" | "fielding")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="yoYo">Sort: Yo-Yo Score</option>
            <option value="sprint">Sort: Sprint (fastest)</option>
            <option value="vertical">Sort: Vertical Jump</option>
            <option value="fielding">Sort: Fielding Efficiency</option>
          </select>
          <label className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-slate-600"
            />
            Verified Only
          </label>
          <button
            onClick={() => { setSearch(""); setRole("All"); setRegion("All"); setVerifiedOnly(false); setSortBy("yoYo"); }}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-3">Showing {filtered.length} athletes</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-700/50">
              <th className="text-left py-3 px-3">Player</th>
              <th className="text-center py-3 px-2">Yo-Yo</th>
              <th className="text-center py-3 px-2">20m Sprint</th>
              <th className="text-center py-3 px-2">Bowl Speed</th>
              <th className="text-center py-3 px-2">Bat Speed</th>
              <th className="text-center py-3 px-2">Vert. Jump</th>
              <th className="text-center py-3 px-2">Field Eff.</th>
              <th className="text-center py-3 px-2">Throw Acc.</th>
              <th className="text-center py-3 px-2">Reaction</th>
              <th className="text-center py-3 px-2">Status</th>
              <th className="text-center py-3 px-2">Next Assessment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player) => (
              <tr key={player.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3">
                  <Link href={`/players/${player.id}`} className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {player.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{player.name}</p>
                        {player.combine.verifiedAthlete && (
                          <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{player.role} &middot; <span className={`px-1 rounded ${regionColors[player.region] || ""}`}>{player.country}</span></p>
                    </div>
                  </Link>
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`text-sm font-bold ${player.combine.yoYoScore >= 19 ? "text-emerald-400" : player.combine.yoYoScore >= 17 ? "text-amber-400" : "text-red-400"}`}>
                    {player.combine.yoYoScore}
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`text-sm font-bold ${player.combine.sprint20m <= 3.0 ? "text-emerald-400" : player.combine.sprint20m <= 3.2 ? "text-amber-400" : "text-red-400"}`}>
                    {player.combine.sprint20m}s
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  {player.combine.bowlingSpeed ? (
                    <span className={`text-sm font-bold ${player.combine.bowlingSpeed >= 140 ? "text-emerald-400" : player.combine.bowlingSpeed >= 120 ? "text-amber-400" : "text-slate-400"}`}>
                      {player.combine.bowlingSpeed}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-600">N/A</span>
                  )}
                </td>
                <td className="text-center py-3 px-2">
                  {player.combine.batSpeed ? (
                    <span className={`text-sm font-bold ${player.combine.batSpeed >= 110 ? "text-emerald-400" : player.combine.batSpeed >= 100 ? "text-amber-400" : "text-slate-400"}`}>
                      {player.combine.batSpeed}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-600">N/A</span>
                  )}
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`text-sm font-bold ${player.combine.verticalJump >= 60 ? "text-emerald-400" : player.combine.verticalJump >= 50 ? "text-amber-400" : "text-red-400"}`}>
                    {player.combine.verticalJump}
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`text-sm font-bold ${player.combine.fieldingEfficiency >= 80 ? "text-emerald-400" : player.combine.fieldingEfficiency >= 70 ? "text-amber-400" : "text-red-400"}`}>
                    {player.combine.fieldingEfficiency}%
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`text-sm font-bold ${player.combine.throwAccuracy >= 80 ? "text-emerald-400" : player.combine.throwAccuracy >= 70 ? "text-amber-400" : "text-red-400"}`}>
                    {player.combine.throwAccuracy}%
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`text-sm font-bold ${player.combine.reactionTime <= 0.25 ? "text-emerald-400" : player.combine.reactionTime <= 0.30 ? "text-amber-400" : "text-red-400"}`}>
                    {player.combine.reactionTime}s
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${player.combine.verifiedAthlete ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700/50 text-slate-400"}`}>
                    {player.combine.verifiedAthlete ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className="text-xs text-slate-500">
                    {new Date(player.combine.nextAssessmentDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No athletes match your filters</p>
          <button
            onClick={() => { setSearch(""); setRole("All"); setRegion("All"); setVerifiedOnly(false); }}
            className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
