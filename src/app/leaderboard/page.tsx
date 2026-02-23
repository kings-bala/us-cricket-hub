"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import Link from "next/link";

type LeaderboardEntry = {
  rank: number;
  user_id: string;
  full_name: string;
  email: string;
  academy: string;
  total_ce: number;
  weekly_ce: number;
  level: number;
  level_name: string;
  streak_count: number;
};

type EnergyData = {
  total_ce: number;
  weekly_ce: number;
  level: number;
  level_name: string;
  next_level_ce: number | null;
  next_level_name: string | null;
  streak_count: number;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earned_at?: string;
};

const LEVEL_COLORS: Record<number, string> = {
  1: "from-slate-500 to-slate-600",
  2: "from-blue-500 to-blue-600",
  3: "from-emerald-500 to-emerald-600",
  4: "from-purple-500 to-purple-600",
  5: "from-amber-500 to-amber-600",
  6: "from-red-500 to-red-600",
  7: "from-yellow-400 to-yellow-500",
};

const BADGE_ICONS: Record<string, string> = {
  footprints: "\u{1F463}",
  flame: "\u{1F525}",
  shield: "\u{1F6E1}\uFE0F",
  trophy: "\u{1F3C6}",
  video: "\u{1F4F9}",
  book: "\u{1F4DA}",
  target: "\u{1F3AF}",
  star: "\u2B50",
  users: "\u{1F465}",
  "trending-up": "\u{1F4C8}",
  crown: "\u{1F451}",
};

const SEED_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user_id: "p1", full_name: "Arjun Patel", email: "arjun@cricverse360.com", academy: "Rising Star Cricket Academy", total_ce: 820, weekly_ce: 145, level: 4, level_name: "Rising Star", streak_count: 12 },
  { rank: 2, user_id: "p10", full_name: "Neel Sharma", email: "neel@risingstar.com", academy: "Rising Star Cricket Academy", total_ce: 710, weekly_ce: 120, level: 4, level_name: "Rising Star", streak_count: 9 },
  { rank: 3, user_id: "p3", full_name: "Rashid Mohammed", email: "rashid@cricverse360.com", academy: "Rising Star Cricket Academy", total_ce: 520, weekly_ce: 95, level: 3, level_name: "Prospect", streak_count: 7 },
  { rank: 4, user_id: "p2", full_name: "Jake Thompson", email: "jake@cricverse360.com", academy: "Rising Star Cricket Academy", total_ce: 450, weekly_ce: 80, level: 3, level_name: "Prospect", streak_count: 5 },
  { rank: 5, user_id: "p8", full_name: "Rahul Desai", email: "rahul@cricverse360.com", academy: "Rising Star Cricket Academy", total_ce: 310, weekly_ce: 65, level: 3, level_name: "Prospect", streak_count: 4 },
];

const SEED_BADGES: Badge[] = [
  { id: "badge_first_step", name: "First Step", description: "Attend your 1st session", icon: "footprints", category: "attendance" },
  { id: "badge_consistent", name: "Consistent", description: "7-day attendance streak", icon: "flame", category: "attendance" },
  { id: "badge_iron_will", name: "Iron Will", description: "30-day attendance streak", icon: "shield", category: "attendance" },
  { id: "badge_unstoppable", name: "Unstoppable", description: "90-day attendance streak", icon: "trophy", category: "attendance" },
  { id: "badge_analyst", name: "Analyst", description: "Upload 5 videos for AI analysis", icon: "video", category: "skill" },
  { id: "badge_learner", name: "Learner", description: "Ask AI Coach 10 questions", icon: "book", category: "skill" },
  { id: "badge_sharpshooter", name: "Sharpshooter", description: "Score 80+ on any AI analysis", icon: "target", category: "skill" },
  { id: "badge_all_rounder", name: "All-Rounder", description: "Score 80+ on both batting & bowling", icon: "star", category: "skill" },
  { id: "badge_team_player", name: "Team Player", description: "Attend 10 group sessions", icon: "users", category: "social" },
  { id: "badge_rising_star", name: "Rising Star", description: "Reach top 10 on leaderboard", icon: "trending-up", category: "social" },
  { id: "badge_champion", name: "Champion", description: "Reach #1 on leaderboard", icon: "crown", category: "social" },
];

function getSeedEnergyForUser(email: string): EnergyData {
  const entry = SEED_LEADERBOARD.find((e) => e.email === email);
  if (entry) {
    const nextLevels: Record<number, { ce: number; name: string }> = { 1: { ce: 101, name: "Starter" }, 2: { ce: 301, name: "Prospect" }, 3: { ce: 601, name: "Rising Star" }, 4: { ce: 1001, name: "Pro" }, 5: { ce: 2001, name: "Elite" }, 6: { ce: 5001, name: "Legend" } };
    const next = nextLevels[entry.level];
    return { total_ce: entry.total_ce, weekly_ce: entry.weekly_ce, level: entry.level, level_name: entry.level_name, next_level_ce: next?.ce || null, next_level_name: next?.name || null, streak_count: entry.streak_count };
  }
  return { total_ce: 0, weekly_ce: 0, level: 1, level_name: "Rookie", next_level_ce: 101, next_level_name: "Starter", streak_count: 0 };
}

function getSeedBadgesForUser(email: string): string[] {
  const map: Record<string, string[]> = {
    "arjun@cricverse360.com": ["badge_first_step", "badge_consistent", "badge_iron_will", "badge_analyst", "badge_team_player", "badge_rising_star"],
    "neel@risingstar.com": ["badge_first_step", "badge_consistent", "badge_analyst", "badge_learner", "badge_team_player"],
    "rashid@cricverse360.com": ["badge_first_step", "badge_consistent", "badge_sharpshooter", "badge_team_player"],
    "jake@cricverse360.com": ["badge_first_step", "badge_consistent", "badge_analyst"],
    "rahul@cricverse360.com": ["badge_first_step", "badge_consistent"],
  };
  return map[email] || ["badge_first_step"];
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [scope, setScope] = useState<"weekly" | "alltime">("weekly");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(SEED_LEADERBOARD);
  const [myEnergy, setMyEnergy] = useState<EnergyData | null>(null);
  const [myBadges, setMyBadges] = useState<string[]>([]);
  const [allBadges] = useState<Badge[]>(SEED_BADGES);
  const [loading, setLoading] = useState(true);
  const [awardEmail, setAwardEmail] = useState("");
  const [awardAmount, setAwardAmount] = useState("10");
  const [awardReason, setAwardReason] = useState("");
  const [awardMsg, setAwardMsg] = useState("");

  const isCoach = user?.role === "coach";
  const isAdmin = user?.role === "admin";
  const isPlayer = user?.role === "player";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const lbRes = await apiRequest<{ leaderboard: LeaderboardEntry[]; myRank: LeaderboardEntry | null }>(`/energy/leaderboard?scope=${scope}`);
      if (lbRes.ok && lbRes.data?.leaderboard?.length > 0) {
        setLeaderboard(lbRes.data.leaderboard);
      } else {
        const sorted = [...SEED_LEADERBOARD].sort((a, b) => scope === "weekly" ? b.weekly_ce - a.weekly_ce : b.total_ce - a.total_ce);
        setLeaderboard(sorted);
      }
    } catch {
      const sorted = [...SEED_LEADERBOARD].sort((a, b) => scope === "weekly" ? b.weekly_ce - a.weekly_ce : b.total_ce - a.total_ce);
      setLeaderboard(sorted);
    }

    if (user) {
      try {
        const eRes = await apiRequest<EnergyData>("/energy/me");
        if (eRes.ok && eRes.data?.total_ce !== undefined) {
          setMyEnergy(eRes.data);
        } else {
          setMyEnergy(getSeedEnergyForUser(user.email));
        }
      } catch {
        setMyEnergy(getSeedEnergyForUser(user.email));
      }

      try {
        const bRes = await apiRequest<Badge[]>("/energy/my-badges");
        if (bRes.ok && Array.isArray(bRes.data) && bRes.data.length > 0) {
          setMyBadges(bRes.data.map((b) => b.id));
        } else {
          setMyBadges(getSeedBadgesForUser(user.email));
        }
      } catch {
        setMyBadges(getSeedBadgesForUser(user.email));
      }
    }
    setLoading(false);
  }, [scope, user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAwardCe = async () => {
    if (!awardEmail || !awardAmount) return;
    setAwardMsg("");
    try {
      const res = await apiRequest<{ message: string }>("/energy/award", {
        method: "POST",
        body: { action: "coach_bonus", targetEmail: awardEmail, ceAmount: Number(awardAmount), details: awardReason || "Coach bonus" },
      });
      if (res.ok) {
        setAwardMsg(res.data?.message || `+${awardAmount} CE awarded!`);
        setAwardEmail("");
        setAwardAmount("10");
        setAwardReason("");
        loadData();
      } else {
        setAwardMsg("Failed to award CE — backend may be offline. Demo data shown.");
      }
    } catch {
      setAwardMsg("Failed to award CE — backend may be offline. Demo data shown.");
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
          <p className="text-slate-400 mb-6">Sign in to view the leaderboard</p>
          <Link href="/auth" className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-full text-sm font-medium transition-colors">Sign In</Link>
        </div>
      </main>
    );
  }

  const myRankEntry = leaderboard.find((e) => e.email === user.email);
  const progressPct = myEnergy && myEnergy.next_level_ce ? Math.min(100, Math.round((myEnergy.total_ce / myEnergy.next_level_ce) * 100)) : 100;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">{"\u{1F3C6}"}</span> Leaderboard
            </h1>
            <p className="text-slate-400 mt-1">Earn Cricket Energy by following your routine</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setScope("weekly")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scope === "weekly" ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>Weekly</button>
            <button onClick={() => setScope("alltime")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scope === "alltime" ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>All-Time</button>
          </div>
        </div>

        {isPlayer && myEnergy && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${LEVEL_COLORS[myEnergy.level] || LEVEL_COLORS[1]} flex items-center justify-center text-2xl font-bold shadow-lg`}>
                  {myEnergy.level}
                </div>
                <div>
                  <div className="text-lg font-bold">{user.name}</div>
                  <div className="text-sm text-slate-400">
                    <span className="text-emerald-400 font-medium">{myEnergy.level_name}</span>
                    {myRankEntry && <span className="ml-2 text-slate-500">#{myRankEntry.rank}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-amber-400">{"\u26A1"} {myEnergy.total_ce}</div>
                  <div className="text-xs text-slate-500">Total CE</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-emerald-400">{myEnergy.weekly_ce}</div>
                  <div className="text-xs text-slate-500">This Week</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-orange-400">{"\u{1F525}"} {myEnergy.streak_count}</div>
                  <div className="text-xs text-slate-500">Day Streak</div>
                </div>
              </div>
            </div>
            {myEnergy.next_level_ce && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{myEnergy.level_name}</span>
                  <span>{myEnergy.total_ce} / {myEnergy.next_level_ce} CE to {myEnergy.next_level_name}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full bg-gradient-to-r ${LEVEL_COLORS[myEnergy.level] || LEVEL_COLORS[1]}`} style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-400">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700/50">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                    {isAdmin ? "All Academies" : "Top Players"} — {scope === "weekly" ? "This Week" : "All Time"}
                  </h2>
                </div>
                <div className="divide-y divide-slate-700/30">
                  {leaderboard.map((entry) => {
                    const isMe = entry.email === user.email;
                    const ceVal = scope === "weekly" ? entry.weekly_ce : entry.total_ce;
                    return (
                      <div key={entry.user_id} className={`flex items-center gap-4 px-6 py-4 transition-colors ${isMe ? "bg-emerald-500/10 border-l-2 border-emerald-500" : "hover:bg-slate-700/20"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                          entry.rank === 2 ? "bg-slate-400/20 text-slate-300" :
                          entry.rank === 3 ? "bg-amber-600/20 text-amber-500" :
                          "bg-slate-700/50 text-slate-400"
                        }`}>
                          {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${isMe ? "text-emerald-400" : "text-white"}`}>{entry.full_name}</span>
                            {isMe && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">YOU</span>}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span className={`bg-gradient-to-r ${LEVEL_COLORS[entry.level] || LEVEL_COLORS[1]} bg-clip-text text-transparent font-medium`}>{entry.level_name}</span>
                            {isAdmin && entry.academy && <span className="text-slate-600">· {entry.academy}</span>}
                            {entry.streak_count > 0 && <span>{"\u{1F525}"} {entry.streak_count}d</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-amber-400">{"\u26A1"} {ceVal}</div>
                          <div className="text-[10px] text-slate-500">{scope === "weekly" ? "this week" : "total"}</div>
                        </div>
                      </div>
                    );
                  })}
                  {leaderboard.length === 0 && (
                    <div className="px-6 py-12 text-center text-slate-500">No players yet. Start earning Cricket Energy!</div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {isPlayer && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                    My Badges ({myBadges.length}/{allBadges.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {allBadges.map((badge) => {
                      const earned = myBadges.includes(badge.id);
                      return (
                        <div key={badge.id} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${earned ? "bg-slate-700/50" : "opacity-30"}`} title={badge.description}>
                          <span className="text-2xl">{BADGE_ICONS[badge.icon] || "\u2B50"}</span>
                          <span className="text-[10px] text-center leading-tight text-slate-300">{badge.name}</span>
                          {!earned && <span className="text-[9px] text-slate-600">{"\u{1F512}"}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">How to Earn CE</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { action: "Attend practice", ce: 20 },
                    { action: "Complete drills", ce: 15 },
                    { action: "Upload AI analysis", ce: 10 },
                    { action: "Ask AI Coach", ce: 5 },
                    { action: "Daily login", ce: 5 },
                    { action: "7-day streak bonus", ce: 50 },
                    { action: "30-day streak bonus", ce: 200 },
                    { action: "Improve AI score", ce: 25 },
                  ].map((item) => (
                    <div key={item.action} className="flex justify-between text-slate-400">
                      <span>{item.action}</span>
                      <span className="text-amber-400 font-medium">+{item.ce} CE</span>
                    </div>
                  ))}
                </div>
              </div>

              {(isCoach || isAdmin) && (
                <div className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-4">
                    {isAdmin ? "Admin: Award CE" : "Coach: Award Bonus CE"}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Player Email</label>
                      <input type="email" value={awardEmail} onChange={(e) => setAwardEmail(e.target.value)} placeholder="player@example.com" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">CE Amount</label>
                      <input type="number" value={awardAmount} onChange={(e) => setAwardAmount(e.target.value)} min="1" max="100" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Reason (optional)</label>
                      <input type="text" value={awardReason} onChange={(e) => setAwardReason(e.target.value)} placeholder="Great effort today!" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500" />
                    </div>
                    <button onClick={handleAwardCe} className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium py-2 rounded-lg transition-colors">
                      Award CE {"\u26A1"}
                    </button>
                    {awardMsg && <p className="text-xs text-center text-emerald-400">{awardMsg}</p>}
                  </div>
                </div>
              )}

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Levels</h3>
                <div className="space-y-2">
                  {[
                    { level: 1, name: "Rookie", range: "0–100 CE" },
                    { level: 2, name: "Starter", range: "101–300 CE" },
                    { level: 3, name: "Prospect", range: "301–600 CE" },
                    { level: 4, name: "Rising Star", range: "601–1000 CE" },
                    { level: 5, name: "Pro", range: "1001–2000 CE" },
                    { level: 6, name: "Elite", range: "2001–5000 CE" },
                    { level: 7, name: "Legend", range: "5000+ CE" },
                  ].map((l) => (
                    <div key={l.level} className={`flex items-center gap-2 text-xs ${myEnergy && myEnergy.level === l.level ? "text-white" : "text-slate-500"}`}>
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${LEVEL_COLORS[l.level]} flex items-center justify-center text-[10px] font-bold text-white`}>{l.level}</div>
                      <span className="flex-1">{l.name}</span>
                      <span className="text-slate-600">{l.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
