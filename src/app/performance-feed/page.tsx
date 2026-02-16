"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { performanceFeedItems } from "@/data/mock";

type FeedType = "all" | "top-score" | "best-bowling" | "fastest-innings" | "form-spike" | "hot-prospect" | "rank-movement";

const feedTypeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  "top-score": { icon: "B", color: "text-emerald-400", bg: "bg-emerald-500/20" },
  "best-bowling": { icon: "W", color: "text-blue-400", bg: "bg-blue-500/20" },
  "fastest-innings": { icon: "F", color: "text-amber-400", bg: "bg-amber-500/20" },
  "form-spike": { icon: "S", color: "text-purple-400", bg: "bg-purple-500/20" },
  "hot-prospect": { icon: "H", color: "text-red-400", bg: "bg-red-500/20" },
  "rank-movement": { icon: "R", color: "text-cyan-400", bg: "bg-cyan-500/20" },
};

export default function PerformanceFeedPage() {
  const [typeFilter, setTypeFilter] = useState<FeedType>("all");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = useMemo(() => {
    let result = [...performanceFeedItems];
    if (typeFilter !== "all") result = result.filter((item) => item.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.playerName.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q) ||
          item.league.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q)
      );
    }
    if (dateFilter) result = result.filter((item) => item.date === dateFilter);
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return result;
  }, [typeFilter, search, dateFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    performanceFeedItems.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3">
        <Link href="/players?tab=profile" className="text-sm text-slate-400 hover:text-white">← Back to My Profile</Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Performance Feed</h1>
          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/30">Live Updates</span>
        </div>
        <p className="text-slate-400">
          Daily engagement feed with top performances, bowling figures, form spikes, hot prospects, and ranking movements.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTypeFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            typeFilter === "all"
              ? "bg-white/10 text-white border-white/20"
              : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600"
          }`}
        >
          All ({performanceFeedItems.length})
        </button>
        {([
          ["top-score", "Top Scores"],
          ["best-bowling", "Best Bowling"],
          ["fastest-innings", "Fastest Innings"],
          ["form-spike", "Form Spikes"],
          ["hot-prospect", "Hot Prospects"],
          ["rank-movement", "Rank Movement"],
        ] as [string, string][]).map(([type, label]) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type as FeedType)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              typeFilter === type
                ? `${feedTypeConfig[type].bg} ${feedTypeConfig[type].color} border-current`
                : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600"
            }`}
          >
            {label} ({typeCounts[type] || 0})
          </button>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search by player, state, league..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => { setSearch(""); setTypeFilter("all"); setDateFilter(""); }}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-3">Showing {filtered.length} feed items</p>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const config = feedTypeConfig[item.type];
          return (
            <Link key={item.id} href={`/players/${item.playerId}`}>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/50 transition-all group">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center ${config.color} font-bold text-sm shrink-0`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${config.bg} ${config.color}`}>
                        {item.type.replace("-", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{item.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{item.playerName}</span>
                      <span>&middot;</span>
                      <span>{item.state}</span>
                      <span>&middot;</span>
                      <span>{item.league}</span>
                      <span>&middot;</span>
                      <span>{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xl font-bold ${config.color}`}>{item.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No feed items match your filters</p>
          <button
            onClick={() => { setSearch(""); setTypeFilter("all"); setDateFilter(""); }}
            className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
