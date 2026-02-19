"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getItem, setItem } from "@/lib/storage";
import type { Academy, PlayerLevel } from "@/types";

type PlayerProfile = {
  basic: { email: string; fullName: string; role: string; ageGroup: string; battingStyle: string; bowlingStyle: string; level?: PlayerLevel };
  cric: { totalMatches: string; totalRuns: string; totalWickets: string; battingAverage: string; strikeRate: string };
};

const LEVELS: PlayerLevel[] = ["Beginner", "Intermediate", "Advanced"];
const levelColors: Record<PlayerLevel, string> = {
  Beginner: "bg-blue-500/20 text-blue-400",
  Intermediate: "bg-amber-500/20 text-amber-400",
  Advanced: "bg-emerald-500/20 text-emerald-400",
};

export default function AcademyRosterPage() {
  const { user } = useAuth();
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    const academies = getItem<Academy[]>("academies", []);
    const mine = academies.find(
      (a) => a.adminEmail.toLowerCase() === user.email.toLowerCase() || a.id === user.academyId
    );
    if (mine) setAcademy(mine);
  }, [user]);

  const profiles = getItem<PlayerProfile[]>("profiles", []);
  const enrolled = academy
    ? profiles.filter((p) => academy.playerEmails.includes(p.basic.email.toLowerCase()))
    : [];

  const filtered = enrolled.filter((p) => {
    const matchSearch = !search || p.basic.fullName.toLowerCase().includes(search.toLowerCase()) || p.basic.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.basic.role.toLowerCase() === filter.toLowerCase();
    const matchLevel = levelFilter === "all" || (p.basic.level || "Beginner") === levelFilter;
    return matchSearch && matchFilter && matchLevel;
  });

  const setPlayerLevel = (email: string, level: PlayerLevel) => {
    const allProfiles = getItem<PlayerProfile[]>("profiles", []);
    const pIdx = allProfiles.findIndex((p) => p.basic.email.toLowerCase() === email.toLowerCase());
    if (pIdx >= 0) {
      allProfiles[pIdx].basic.level = level;
      setItem("profiles", allProfiles);
    }
  };

  const removePlayer = (email: string) => {
    if (!academy) return;
    const academies = getItem<Academy[]>("academies", []);
    const idx = academies.findIndex((a) => a.id === academy.id);
    if (idx >= 0) {
      academies[idx].playerEmails = academies[idx].playerEmails.filter((e) => e.toLowerCase() !== email.toLowerCase());
      setItem("academies", academies);
      setAcademy({ ...academy, playerEmails: academies[idx].playerEmails });
    }
  };

  if (!academy) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Academy Found</h1>
          <Link href="/academy/register" className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg">Register Academy</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/academy" className="text-sm text-slate-400 hover:text-white mb-2 inline-block">← Academy Dashboard</Link>
            <h1 className="text-2xl font-bold">Player Roster</h1>
            <p className="text-slate-400 text-sm">{enrolled.length} of {academy.maxSeats} seats used</p>
          </div>
          <Link href="/academy/invite" className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">+ Invite Players</Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-Rounder">All-Rounder</option>
            <option value="Wicket-Keeper">Wicket-Keeper</option>
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Levels</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-12 text-center">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <p className="text-slate-400 mb-2">{enrolled.length === 0 ? "No players enrolled yet." : "No players match your search."}</p>
            {enrolled.length === 0 && <Link href="/academy/invite" className="text-emerald-400 text-sm hover:underline">Invite your first player →</Link>}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-xs uppercase tracking-wider text-slate-400 px-4 py-3">Player</th>
                  <th className="text-left text-xs uppercase tracking-wider text-slate-400 px-4 py-3 hidden sm:table-cell">Role</th>
                  <th className="text-left text-xs uppercase tracking-wider text-slate-400 px-4 py-3 hidden sm:table-cell">Level</th>
                  <th className="text-left text-xs uppercase tracking-wider text-slate-400 px-4 py-3 hidden md:table-cell">Age Group</th>
                  <th className="text-left text-xs uppercase tracking-wider text-slate-400 px-4 py-3 hidden md:table-cell">Matches</th>
                  <th className="text-left text-xs uppercase tracking-wider text-slate-400 px-4 py-3 hidden lg:table-cell">Runs</th>
                  <th className="text-left text-xs uppercase tracking-wider text-slate-400 px-4 py-3 hidden lg:table-cell">Wickets</th>
                  <th className="text-right text-xs uppercase tracking-wider text-slate-400 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {p.basic.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{p.basic.fullName}</div>
                          <div className="text-xs text-slate-400">{p.basic.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 hidden sm:table-cell">{p.basic.role}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <select
                        value={p.basic.level || "Beginner"}
                        onChange={(e) => setPlayerLevel(p.basic.email, e.target.value as PlayerLevel)}
                        className={`text-xs px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${levelColors[p.basic.level || "Beginner"]}`}
                      >
                        {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 hidden md:table-cell">{p.basic.ageGroup || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-300 hidden md:table-cell">{p.cric?.totalMatches || "0"}</td>
                    <td className="px-4 py-3 text-sm text-slate-300 hidden lg:table-cell">{p.cric?.totalRuns || "0"}</td>
                    <td className="px-4 py-3 text-sm text-slate-300 hidden lg:table-cell">{p.cric?.totalWickets || "0"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removePlayer(p.basic.email)}
                        className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
