"use client";

import { useState, useMemo } from "react";
import PlayerCard from "@/components/PlayerCard";
import { players } from "@/data/mock";
import { AgeGroup, PlayerRole } from "@/types";

export default function PlayersPage() {
  const [search, setSearch] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "All">("All");
  const [country, setCountry] = useState<string>("All");
  const [streetOnly, setStreetOnly] = useState(false);
  const [role, setRole] = useState<PlayerRole | "All">("All");
  const [sortBy, setSortBy] = useState<"runs" | "wickets" | "average" | "name">("runs");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = [...players];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q)
      );
    }
    if (ageGroup !== "All") result = result.filter((p) => p.ageGroup === ageGroup);
    if (country !== "All") result = result.filter((p) => p.country === country);
    if (role !== "All") result = result.filter((p) => p.role === role);
    if (verifiedOnly) result = result.filter((p) => p.verified);
    if (streetOnly) result = result.filter((p) => p.streetCricketer);

    switch (sortBy) {
      case "runs":
        result.sort((a, b) => b.stats.runs - a.stats.runs);
        break;
      case "wickets":
        result.sort((a, b) => b.stats.wickets - a.stats.wickets);
        break;
      case "average":
        result.sort((a, b) => b.stats.battingAverage - a.stats.battingAverage);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [search, ageGroup, country, role, sortBy, verifiedOnly, streetOnly]);

  const countries = useMemo(() => {
    const set = new Set(players.map((p) => p.country));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Player Registry</h1>
        <p className="text-slate-400">
          Browse {players.length} registered youth cricket players from around the world
        </p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by name, city, country..."
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
            <option value="All">All Ages</option>
            <option value="U15">U15</option>
            <option value="U17">U17</option>
            <option value="U19">U19</option>
            <option value="U21">U21</option>
          </select>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "runs" | "wickets" | "average" | "name")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="runs">Sort: Most Runs</option>
            <option value="wickets">Sort: Most Wickets</option>
            <option value="average">Sort: Best Average</option>
            <option value="name">Sort: Name A-Z</option>
          </select>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
            />
            Verified profiles only
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={streetOnly}
              onChange={(e) => setStreetOnly(e.target.checked)}
              className="rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500"
            />
            Street cricketers only
          </label>
          <span className="text-sm text-slate-500">
            Showing {filtered.length} of {players.length} players
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((player, i) => (
          <PlayerCard key={player.id} player={player} rank={i + 1} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No players match your filters</p>
          <button
            onClick={() => {
              setSearch("");
              setAgeGroup("All");
              setCountry("All");
              setStreetOnly(false);
              setRole("All");
              setVerifiedOnly(false);
            }}
            className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
