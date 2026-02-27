"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { players } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";

type ReadinessLevel = "Ready Now" | "6 Months" | "1 Year" | "Development";
type WatchlistCategory = "shortlist" | "watchlist" | "monitor";

interface WatchlistEntry {
  playerId: string;
  category: WatchlistCategory;
  readiness: ReadinessLevel;
  notes: string;
  addedDate: string;
  priority: number;
}

const categoryColors: Record<WatchlistCategory, string> = {
  shortlist: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  watchlist: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  monitor: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const readinessColors: Record<ReadinessLevel, string> = {
  "Ready Now": "bg-emerald-500/20 text-emerald-400",
  "6 Months": "bg-blue-500/20 text-blue-400",
  "1 Year": "bg-amber-500/20 text-amber-400",
  "Development": "bg-slate-500/20 text-slate-400",
};

function calcImpactScore(p: typeof players[0]): number {
  const batWeight = p.role === "Bowler" ? 0.2 : 0.4;
  const bowlWeight = p.role === "Batsman" ? 0.15 : 0.35;
  const batScore = Math.min(100, (p.stats.battingAverage / 50) * 40 + (p.stats.strikeRate / 150) * 30 + (p.stats.hundreds * 8) + (p.stats.fifties * 3));
  const bowlScore = p.stats.wickets > 0 ? Math.min(100, (1 - p.stats.bowlingAverage / 40) * 40 + (1 - p.stats.economy / 10) * 30 + p.stats.wickets * 0.8) : 0;
  const fieldScore = Math.min(100, (p.stats.catches + p.stats.stumpings) * 3);
  const fitScore = Math.min(100, (p.fitnessData.yoYoTest / 20) * 40 + (p.fitnessData.beepTestLevel / 15) * 30);
  return Math.round(batScore * batWeight + bowlScore * bowlWeight + fieldScore * 0.1 + fitScore * 0.15);
}

const defaultEntries: WatchlistEntry[] = [
  { playerId: "p1", category: "shortlist", readiness: "6 Months", notes: "Exceptional batting talent. Monitor progress in upcoming BCCI Youth Trophy.", addedDate: "2025-11-01", priority: 1 },
  { playerId: "p2", category: "shortlist", readiness: "Ready Now", notes: "Genuine pace. Ready for development squad trials.", addedDate: "2025-10-15", priority: 2 },
  { playerId: "p8", category: "shortlist", readiness: "Ready Now", notes: "Top scorer in US U19. Must-pick for national squad.", addedDate: "2025-09-20", priority: 3 },
  { playerId: "p3", category: "watchlist", readiness: "6 Months", notes: "Strong all-round ability. Needs exposure at higher level.", addedDate: "2025-11-10", priority: 4 },
  { playerId: "p4", category: "watchlist", readiness: "Ready Now", notes: "Outstanding keeper-batter. Could fill WK slot in T20 squad.", addedDate: "2025-10-28", priority: 5 },
  { playerId: "p5", category: "watchlist", readiness: "Ready Now", notes: "Raw pace at 148 km/h. Best fast bowling prospect available.", addedDate: "2025-11-05", priority: 6 },
  { playerId: "p7", category: "monitor", readiness: "1 Year", notes: "Quality leg-spinner. Needs more matches at senior level.", addedDate: "2025-11-12", priority: 7 },
  { playerId: "p9", category: "monitor", readiness: "Development", notes: "Street cricket background. Raw talent, needs structured coaching.", addedDate: "2025-11-18", priority: 8 },
];

export default function SelectorPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WatchlistEntry[]>(defaultEntries);
  const [activeCategory, setActiveCategory] = useState<WatchlistCategory | "all">("all");
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "impact" | "readiness">("priority");

  const isSelector = user?.role === "admin" || user?.role === "coach" || user?.role === "academy_admin";

  const filteredEntries = useMemo(() => {
    let result = activeCategory === "all" ? entries : entries.filter(e => e.category === activeCategory);
    if (sortBy === "impact") {
      result = [...result].sort((a, b) => {
        const pA = players.find(p => p.id === a.playerId);
        const pB = players.find(p => p.id === b.playerId);
        if (!pA || !pB) return 0;
        return calcImpactScore(pB) - calcImpactScore(pA);
      });
    } else if (sortBy === "readiness") {
      const order: Record<ReadinessLevel, number> = { "Ready Now": 0, "6 Months": 1, "1 Year": 2, "Development": 3 };
      result = [...result].sort((a, b) => order[a.readiness] - order[b.readiness]);
    } else {
      result = [...result].sort((a, b) => a.priority - b.priority);
    }
    return result;
  }, [entries, activeCategory, sortBy]);

  const availablePlayers = useMemo(() => {
    const entryIds = new Set(entries.map(e => e.playerId));
    let available = players.filter(p => !entryIds.has(p.id));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      available = available.filter(p => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.country.toLowerCase().includes(q));
    }
    return available;
  }, [entries, searchQuery]);

  const addToWatchlist = (playerId: string, category: WatchlistCategory) => {
    setEntries(prev => [...prev, {
      playerId, category, readiness: "Development" as ReadinessLevel,
      notes: "", addedDate: new Date().toISOString().split("T")[0],
      priority: prev.length + 1,
    }]);
    setShowAddPlayer(false);
    setSearchQuery("");
  };

  const removeEntry = (playerId: string) => {
    setEntries(prev => prev.filter(e => e.playerId !== playerId));
  };

  const updateCategory = (playerId: string, category: WatchlistCategory) => {
    setEntries(prev => prev.map(e => e.playerId === playerId ? { ...e, category } : e));
  };

  const updateReadiness = (playerId: string, readiness: ReadinessLevel) => {
    setEntries(prev => prev.map(e => e.playerId === playerId ? { ...e, readiness } : e));
  };

  const saveNote = (playerId: string) => {
    setEntries(prev => prev.map(e => e.playerId === playerId ? { ...e, notes: noteText } : e));
    setEditingNote(null);
    setNoteText("");
  };

  const movePriority = (playerId: string, direction: "up" | "down") => {
    setEntries(prev => {
      const idx = prev.findIndex(e => e.playerId === playerId);
      if (idx < 0) return prev;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const next = [...prev];
      const tmp = next[idx].priority;
      next[idx] = { ...next[idx], priority: next[swapIdx].priority };
      next[swapIdx] = { ...next[swapIdx], priority: tmp };
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  };

  const stats = useMemo(() => ({
    shortlist: entries.filter(e => e.category === "shortlist").length,
    watchlist: entries.filter(e => e.category === "watchlist").length,
    monitor: entries.filter(e => e.category === "monitor").length,
    readyNow: entries.filter(e => e.readiness === "Ready Now").length,
  }), [entries]);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-3"><Link href="/players" className="text-sm text-slate-400 hover:text-white">&larr; Back to Players</Link></div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">Selector Dashboard</h1>
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30">Selector Tools</span>
            </div>
            <p className="text-slate-400">Manage watchlists, shortlists, and player rankings for team selection</p>
          </div>
          {isSelector && (
            <button onClick={() => setShowAddPlayer(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
              + Add Player
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.shortlist}</p>
            <p className="text-xs text-slate-400">Shortlisted</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{stats.watchlist}</p>
            <p className="text-xs text-slate-400">Watchlist</p>
          </div>
          <div className="bg-gradient-to-br from-slate-500/10 to-slate-600/10 border border-slate-600/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">{stats.monitor}</p>
            <p className="text-xs text-slate-400">Monitoring</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.readyNow}</p>
            <p className="text-xs text-slate-400">Ready Now</p>
          </div>
        </div>

        {showAddPlayer && (
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Player to Watchlist</h3>
              <button onClick={() => { setShowAddPlayer(false); setSearchQuery(""); }} className="text-slate-400 hover:text-white text-xl">&times;</button>
            </div>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search players..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-4" />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availablePlayers.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.role} &middot; {p.country} &middot; Impact: {calcImpactScore(p)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addToWatchlist(p.id, "shortlist")} className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Shortlist</button>
                    <button onClick={() => addToWatchlist(p.id, "watchlist")} className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Watch</button>
                    <button onClick={() => addToWatchlist(p.id, "monitor")} className="text-xs px-2 py-1 rounded bg-slate-500/20 text-slate-400 hover:bg-slate-500/30">Monitor</button>
                  </div>
                </div>
              ))}
              {availablePlayers.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No more players to add</p>}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {(["all", "shortlist", "watchlist", "monitor"] as const).map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors border " + (activeCategory === c ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white")}>
                {c === "all" ? "All (" + entries.length + ")" : c.charAt(0).toUpperCase() + c.slice(1) + " (" + entries.filter(e => e.category === c).length + ")"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sort:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500">
              <option value="priority">Priority</option>
              <option value="impact">Impact Score</option>
              <option value="readiness">Readiness</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredEntries.map((entry, idx) => {
            const p = players.find(x => x.id === entry.playerId);
            if (!p) return null;
            const impact = calcImpactScore(p);
            return (
              <div key={entry.playerId} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => movePriority(entry.playerId, "up")} disabled={idx === 0}
                      className="text-slate-500 hover:text-white disabled:opacity-20 text-xs">&#9650;</button>
                    <span className="text-lg font-bold text-slate-500 w-6 text-center">{idx + 1}</span>
                    <button onClick={() => movePriority(entry.playerId, "down")} disabled={idx === filteredEntries.length - 1}
                      className="text-slate-500 hover:text-white disabled:opacity-20 text-xs">&#9660;</button>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                    {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={"/compare?ids=" + p.id} className="font-semibold text-white hover:text-emerald-400 transition-colors">{p.name}</Link>
                      <span className={"text-xs px-2 py-0.5 rounded-full border " + categoryColors[entry.category]}>{entry.category}</span>
                      <span className={"text-xs px-2 py-0.5 rounded-full " + readinessColors[entry.readiness]}>{entry.readiness}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{p.role} &middot; {p.country} &middot; {p.ageGroup} &middot; {p.stats.matches} matches</p>

                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">Impact:</span>
                        <span className="text-sm font-bold text-emerald-400">{impact}</span>
                        <div className="w-16 bg-slate-700/50 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: impact + "%" }} />
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">{p.stats.runs} runs</span>
                      <span className="text-xs text-slate-500">{p.stats.wickets} wkts</span>
                      <span className="text-xs text-slate-500">SR {p.stats.strikeRate}</span>
                      {p.fitnessData.bowlingSpeed && <span className="text-xs text-slate-500">{p.fitnessData.bowlingSpeed} km/h</span>}
                    </div>

                    {editingNote === entry.playerId ? (
                      <div className="flex gap-2">
                        <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                          className="flex-1 bg-slate-900/50 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                          onKeyDown={e => e.key === "Enter" && saveNote(entry.playerId)} />
                        <button onClick={() => saveNote(entry.playerId)} className="text-xs px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30">Save</button>
                        <button onClick={() => setEditingNote(null)} className="text-xs px-3 py-1.5 bg-slate-700 text-slate-400 rounded hover:text-white">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-400 italic flex-1">{entry.notes || "No notes"}</p>
                        {isSelector && (
                          <button onClick={() => { setEditingNote(entry.playerId); setNoteText(entry.notes); }}
                            className="text-xs text-slate-500 hover:text-emerald-400">Edit</button>
                        )}
                      </div>
                    )}
                  </div>

                  {isSelector && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <select value={entry.category} onChange={e => updateCategory(entry.playerId, e.target.value as WatchlistCategory)}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none">
                        <option value="shortlist">Shortlist</option>
                        <option value="watchlist">Watchlist</option>
                        <option value="monitor">Monitor</option>
                      </select>
                      <select value={entry.readiness} onChange={e => updateReadiness(entry.playerId, e.target.value as ReadinessLevel)}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none">
                        <option value="Ready Now">Ready Now</option>
                        <option value="6 Months">6 Months</option>
                        <option value="1 Year">1 Year</option>
                        <option value="Development">Development</option>
                      </select>
                      <button onClick={() => removeEntry(entry.playerId)} className="text-xs text-red-400 hover:text-red-300 mt-1">Remove</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg mb-2">No players in this category</p>
            <p className="text-slate-600 text-sm">Add players to your watchlist to get started</p>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-3">Selection Summary</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-emerald-400 mb-2">Ready for Selection ({entries.filter(e => e.readiness === "Ready Now").length})</h4>
              {entries.filter(e => e.readiness === "Ready Now").map(e => {
                const p = players.find(x => x.id === e.playerId);
                return p ? <p key={e.playerId} className="text-sm text-slate-300">{p.name} - {p.role}</p> : null;
              })}
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-2">Pipeline ({entries.filter(e => e.readiness === "6 Months").length})</h4>
              {entries.filter(e => e.readiness === "6 Months").map(e => {
                const p = players.find(x => x.id === e.playerId);
                return p ? <p key={e.playerId} className="text-sm text-slate-300">{p.name} - {p.role}</p> : null;
              })}
            </div>
            <div>
              <h4 className="text-sm font-medium text-amber-400 mb-2">Development ({entries.filter(e => e.readiness === "1 Year" || e.readiness === "Development").length})</h4>
              {entries.filter(e => e.readiness === "1 Year" || e.readiness === "Development").map(e => {
                const p = players.find(x => x.id === e.playerId);
                return p ? <p key={e.playerId} className="text-sm text-slate-300">{p.name} - {p.role}</p> : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
