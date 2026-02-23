"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useCatalog, useCatalogMulti } from "@/hooks/useCatalog";
import { calculateCPI, getFormStatus } from "@/data/mock";
import StatCard from "@/components/StatCard";
import { UserRole, Player } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getItem } from "@/lib/storage";
import { apiRequest } from "@/lib/api-client";

const roleLabels: Record<UserRole, string> = {
  player: "My Profile",
  agent: "Agent Dashboard",
  owner: "T20 Owner Dashboard",
  sponsor: "Sponsor Dashboard",
  coach: "Coach Dashboard",
  academy_admin: "Academy Dashboard",
};

const feedTypeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  "top-score": { icon: "B", color: "text-emerald-400", bg: "bg-emerald-500/20" },
  "best-bowling": { icon: "W", color: "text-blue-400", bg: "bg-blue-500/20" },
  "fastest-innings": { icon: "F", color: "text-amber-400", bg: "bg-amber-500/20" },
  "form-spike": { icon: "S", color: "text-purple-400", bg: "bg-purple-500/20" },
  "hot-prospect": { icon: "H", color: "text-red-400", bg: "bg-red-500/20" },
  "rank-movement": { icon: "R", color: "text-cyan-400", bg: "bg-cyan-500/20" },
};

function resolvePlayer(allPlayers: Player[], email: string | undefined): Player {
  if (email) {
    const seed = allPlayers.find(
      (p) =>
        p.id ===
        [
          { e: "arjun@cricverse360.com", id: "p1" },
          { e: "jake@cricverse360.com", id: "p2" },
          { e: "rashid@cricverse360.com", id: "p3" },
          { e: "rahul@cricverse360.com", id: "p8" },
        ].find((m) => m.e === email.toLowerCase())?.id
    );
    if (seed) return seed;

    const profiles = getItem<{ basic: { email: string; fullName: string; role: string; battingStyle: string; bowlingStyle: string; ageGroup: string; country: string; state: string; city: string; region: string }; cric: { totalMatches: string; totalRuns: string; totalWickets: string; battingAverage: string; bowlingAverage: string; strikeRate: string; economy: string } }[]>("profiles", []);
    const reg = profiles.find((p) => p.basic.email.toLowerCase() === email.toLowerCase());
    if (reg) {
      const c = reg.cric;
      return {
        id: `reg_${email}`,
        name: reg.basic.fullName,
        age: 0,
        ageGroup: (reg.basic.ageGroup || "Men") as Player["ageGroup"],
        country: reg.basic.country || "USA",
        countryCode: "US",
        region: (reg.basic.region || "Americas") as Player["region"],
        state: reg.basic.state || "",
        city: reg.basic.city || "",
        role: (reg.basic.role || "Batsman") as Player["role"],
        battingStyle: (reg.basic.battingStyle || "Right-hand Bat") as Player["battingStyle"],
        bowlingStyle: (reg.basic.bowlingStyle || "Right-arm Medium") as Player["bowlingStyle"],
        profileTier: "Free",
        avatar: "",
        verified: false,
        stats: {
          matches: Number(c.totalMatches) || 0,
          innings: Number(c.totalMatches) || 0,
          runs: Number(c.totalRuns) || 0,
          battingAverage: Number(c.battingAverage) || 0,
          strikeRate: Number(c.strikeRate) || 0,
          fifties: 0,
          hundreds: 0,
          wickets: Number(c.totalWickets) || 0,
          bowlingAverage: Number(c.bowlingAverage) || 0,
          economy: Number(c.economy) || 0,
          bestBowling: "-",
          catches: 0,
          stumpings: 0,
        },
        fitnessData: { sprintSpeed: 0, yoYoTest: 0, throwDistance: 0, beepTestLevel: 0 },
        highlights: [],
        achievements: [],
        showcaseEvents: [],
        targetLeagues: [],
      };
    }
  }
  return allPlayers[0];
}

function PlayerDashboard() {
  const { data } = useCatalogMulti("players", "performance_feed", "tournaments");
  const tournaments = data.tournaments;
  const { user } = useAuth();
  const player = resolvePlayer(data.players, user?.email);
  const recentFeed = [...data.performance_feed]
    .filter((item) => item.playerId === player.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await apiRequest<{ uploadUrl?: string; key?: string }>("/users/avatar", { method: "POST" });
    if (res.ok && res.data?.uploadUrl) {
      try {
        await fetch(res.data.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": "image/jpeg" } });
        const bucket = "cricverse360-assets-411964234582";
        setAvatarUrl(`https://${bucket}.s3.us-east-1.amazonaws.com/${res.data.key}`);
      } catch {}
    }
    setUploading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                {player.name.split(" ").map((n) => n[0]).join("")}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            {uploading && <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{player.name}</h2>
            <p className="text-sm text-slate-400">{player.role} &middot; {player.ageGroup} &middot; {player.country}</p>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full mt-1 inline-block">{player.profileTier} Profile</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Matches" value={player.stats.matches} color="emerald" />
        <StatCard label="Runs" value={player.stats.runs} color="blue" />
        <StatCard label="Average" value={player.stats.battingAverage} color="purple" />
        <StatCard label="Wickets" value={player.stats.wickets} color="amber" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Profile Visibility</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-400">Profile Views (30d)</span><span className="text-white font-medium">247</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Shortlisted by Scouts</span><span className="text-white font-medium">8</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Agent Interest</span><span className="text-emerald-400 font-medium">3 new</span></div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Upcoming Events</h3>
          <div className="space-y-2">
            {tournaments.filter((t) => t.status === "upcoming").slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{t.name}</span>
                <span className="text-xs text-slate-500">{t.startDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Performance Feed</h3>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">Live</span>
          </div>
          <Link href="/performance-feed" className="text-xs text-cyan-400 hover:text-cyan-300">View All &rarr;</Link>
        </div>
        <div className="space-y-2">
          {recentFeed.map((item) => {
            const config = feedTypeConfig[item.type];
            return (
              <Link key={item.id} href={`/players/${item.playerId}`}>
                <div className="flex items-center gap-3 hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center ${config.color} font-bold text-xs shrink-0`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.playerName} &middot; {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                  <span className={`text-sm font-bold ${config.color} shrink-0`}>{item.value}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-emerald-400 mb-2">Upgrade to Premium</h3>
        <p className="text-sm text-slate-400 mb-3">Get professional video analysis, verified speed-gun data, and priority visibility to scouts.</p>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">Upgrade Now - $9.99/mo</button>
      </div>
    </div>
  );
}

function AgentDashboard() {
  const { data } = useCatalogMulti("agents", "players", "match_history");
  const agent = data.agents[0];
  const agentPlayers = data.players.filter((p) => agent.playerIds.includes(p.id));
  const matchHistory = data.match_history;
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const totalRuns = agentPlayers.reduce((s, p) => s + p.stats.runs, 0);
  const totalWickets = agentPlayers.reduce((s, p) => s + p.stats.wickets, 0);
  const avgStrikeRate = agentPlayers.length ? Math.round(agentPlayers.reduce((s, p) => s + p.stats.strikeRate, 0) / agentPlayers.length * 10) / 10 : 0;

  const formColors: Record<string, string> = {
    "Red Hot": "bg-red-500/20 text-red-400 border-red-500/30",
    "In Form": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Steady": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "Cold": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Players" value={agentPlayers.length} color="emerald" />
        <StatCard label="Placements" value={agent.placements} color="blue" />
        <StatCard label="Success Rate" value={`${agent.successRate}%`} color="purple" />
        <StatCard label="Rating" value={agent.rating} color="amber" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Total Runs (Stable)" value={totalRuns} color="emerald" />
        <StatCard label="Total Wickets (Stable)" value={totalWickets} color="red" />
        <StatCard label="Avg Strike Rate" value={avgStrikeRate} color="blue" />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Player Stats &amp; AI Analysis</h3>
        <div className="space-y-3">
          {agentPlayers.map((p) => {
            const matches = matchHistory[p.id] || [];
            const cpi = calculateCPI(p, matches);
            const form = getFormStatus(matches, p.role);
            const isExpanded = expandedPlayer === p.id;
            const last5 = matches.slice(0, 5);
            const recentAvg = last5.length ? Math.round(last5.reduce((s, m) => s + m.runsScored, 0) / last5.length) : 0;
            const recentWickets = last5.reduce((s, m) => s + m.wicketsTaken, 0);

            const insights: string[] = [];
            if (cpi.overall >= 75) insights.push(`Elite CPI (${cpi.overall}) - ready for top-tier league placement`);
            else if (cpi.overall >= 60) insights.push(`Strong CPI (${cpi.overall}) - competitive for mid-tier leagues`);
            else insights.push(`CPI ${cpi.overall} - needs development before league placement`);

            if (form === "Red Hot") insights.push("Currently in exceptional form - ideal time for trial/showcase");
            else if (form === "In Form") insights.push("Performing consistently - good candidate for upcoming drafts");
            else if (form === "Cold") insights.push("Form dip detected - recommend targeted coaching before exposure");

            if (p.role === "Bowler" || p.role === "All-Rounder") {
              if (p.stats.economy > 0 && p.stats.economy <= 6) insights.push(`Excellent economy rate (${p.stats.economy}) - strong selling point`);
              if (p.fitnessData.bowlingSpeed && p.fitnessData.bowlingSpeed >= 140) insights.push(`Pace ${p.fitnessData.bowlingSpeed} km/h - franchise-level speed`);
            }
            if (p.stats.battingAverage >= 40) insights.push(`Batting average ${p.stats.battingAverage} - premium value`);
            if (p.verified) insights.push("Profile verified - scout-ready");

            return (
              <div key={p.id} className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
                <button onClick={() => setExpandedPlayer(isExpanded ? null : p.id)} className="w-full flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {p.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.role} &middot; {p.ageGroup} &middot; {p.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${formColors[form] || "bg-slate-700/50 text-slate-300"}`}>{form}</span>
                    <span className="text-xs text-slate-400">CPI <span className="text-white font-bold">{cpi.overall}</span></span>
                    <span className="text-slate-500">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50 pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">Matches</p>
                        <p className="text-sm font-semibold text-white">{p.stats.matches}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">Runs</p>
                        <p className="text-sm font-semibold text-white">{p.stats.runs}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">Wickets</p>
                        <p className="text-sm font-semibold text-white">{p.stats.wickets}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">Bat Avg</p>
                        <p className="text-sm font-semibold text-white">{p.stats.battingAverage}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">SR</p>
                        <p className="text-sm font-semibold text-white">{p.stats.strikeRate}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">Economy</p>
                        <p className="text-sm font-semibold text-white">{p.stats.economy || "-"}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">50s / 100s</p>
                        <p className="text-sm font-semibold text-white">{p.stats.fifties} / {p.stats.hundreds}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">Best Bowling</p>
                        <p className="text-sm font-semibold text-white">{p.stats.bestBowling}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs text-slate-400 mb-2 uppercase tracking-wide">CPI Breakdown</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Match Perf", value: cpi.matchPerformance, color: "emerald" },
                          { label: "Athletic", value: cpi.athleticMetrics, color: "blue" },
                          { label: "Form", value: cpi.formIndex, color: "purple" },
                          { label: "Consistency", value: cpi.consistency, color: "amber" },
                        ].map((c) => (
                          <div key={c.label} className="text-center">
                            <div className="relative w-12 h-12 mx-auto mb-1">
                              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                                <circle cx="24" cy="24" r="20" fill="none" stroke="#334155" strokeWidth="4" />
                                <circle cx="24" cy="24" r="20" fill="none" stroke={c.color === "emerald" ? "#10b981" : c.color === "blue" ? "#3b82f6" : c.color === "purple" ? "#a855f7" : "#f59e0b"} strokeWidth="4" strokeDasharray={`${c.value * 1.256} 125.6`} strokeLinecap="round" />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">{c.value}</span>
                            </div>
                            <p className="text-[10px] text-slate-500">{c.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {last5.length > 0 && (
                      <div>
                        <h4 className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Last 5 Matches</h4>
                        <div className="flex gap-1">
                          {last5.map((m, i) => {
                            const perf = p.role === "Bowler" ? m.wicketsTaken * 20 : m.runsScored;
                            const maxVal = p.role === "Bowler" ? 100 : 150;
                            const height = Math.max(8, (perf / maxVal) * 100);
                            return (
                              <div key={m.matchId} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full bg-slate-700/50 rounded-sm relative" style={{ height: "48px" }}>
                                  <div className={`absolute bottom-0 left-0 right-0 rounded-sm ${i === 0 ? "bg-blue-500" : "bg-blue-500/60"}`} style={{ height: `${Math.min(height, 100)}%` }} />
                                </div>
                                <span className="text-[9px] text-slate-500">{p.role === "Bowler" ? `${m.wicketsTaken}w` : m.runsScored}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                          <span>Avg last 5: <span className="text-white">{recentAvg} runs</span></span>
                          <span>Wickets last 5: <span className="text-white">{recentWickets}</span></span>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs text-slate-400 mb-2 uppercase tracking-wide">AI Insights</h4>
                      <div className="space-y-1.5">
                        {insights.map((insight, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <span className="text-blue-400 mt-0.5 shrink-0">●</span>
                            <span className="text-slate-300">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/players/${p.id}`} className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                        Full Profile →
                      </Link>
                      <Link href={`/stats`} className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                        Deep Stats →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2"><span className="text-emerald-400">+</span><span className="text-slate-300">New inquiry from Mumbai Indians for talent review</span></div>
            <div className="flex gap-2"><span className="text-blue-400">i</span><span className="text-slate-300">Player profiles viewed 340 times this week globally</span></div>
            <div className="flex gap-2"><span className="text-amber-400">!</span><span className="text-slate-300">IPL Pre-Draft Camp registration closing soon</span></div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Pending Opportunities</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-300">Mumbai Indians - Trial invite</span><span className="text-amber-400">Pending</span></div>
            <div className="flex justify-between"><span className="text-slate-300">Sydney Sixers - Contract talk</span><span className="text-emerald-400">Active</span></div>
            <div className="flex justify-between"><span className="text-slate-300">CricGear Pro - Endorsement</span><span className="text-blue-400">Review</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnerDashboard() {
  const { data } = useCatalogMulti("teams", "players");
  const team = data.teams[0];
  const draftEligible = data.players.filter((p) => (p.ageGroup === "U19" || p.ageGroup === "U21") && p.verified);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {team.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{team.name}</h2>
            <p className="text-sm text-slate-400">{team.city} &middot; {team.league}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Roster Size" value={team.rosterSize} color="emerald" />
        <StatCard label="Local Quota" value={`${team.localFilled}/${team.localQuota}`} color="blue" />
        <StatCard label="Draft Eligible" value={draftEligible.length} color="purple" />
        <StatCard label="Shortlisted" value={5} color="amber" />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Draft-Ready Prospects</h3>
          <Link href="/scouting" className="text-xs text-emerald-400 hover:text-emerald-300">Open Pro Dashboard &rarr;</Link>
        </div>
        <div className="space-y-2">
          {draftEligible.slice(0, 5).map((p) => (
            <Link key={p.id} href={`/players/${p.id}`} className="flex items-center justify-between hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.role} &middot; {p.country}</p>
                </div>
              </div>
              <div className="text-right text-xs">
                <p className="text-white">{p.stats.runs}r / {p.stats.wickets}w</p>
                <p className="text-slate-500">{p.stats.matches} matches</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-purple-400 mb-2">Homegrown Quota Alert</h3>
        <p className="text-sm text-slate-400">You need {team.localQuota - team.localFilled} more local players to meet the quota. Use the Pro Scouting Dashboard to find global talent.</p>
      </div>
    </div>
  );
}

function CoachDashboard() {
  const { data } = useCatalogMulti("coaches", "players");
  const coach = data.coaches[0];
  const myPlayers = data.players.slice(0, 6);
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
            {coach.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{coach.name}</h2>
            <p className="text-sm text-slate-400">{coach.specialization} • {coach.experience}+ yrs • {coach.region}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Players Developed" value={coach.playersDeveloped} color="emerald" />
        <StatCard label="Rating" value={coach.rating} color="amber" />
        <StatCard label="Certifications" value={coach.certifications.length} color="blue" />
        <StatCard label="Review Count" value={coach.reviewCount} color="purple" />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">My Trainees</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {myPlayers.map((p) => (
            <Link key={p.id} href={`/players/${p.id}`} className="flex items-center gap-3 hover:bg-slate-700/30 rounded-lg p-2 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {p.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{p.name}</p>
                <p className="text-xs text-slate-400">{p.role} • {p.ageGroup}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function SponsorDashboard() {
  const { data: catData } = useCatalog("sponsors");
  const sponsor = catData[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Sponsorships" value={sponsor.sponsoredAssets.length} color="amber" />
        <StatCard label="Total Investment" value="$75K" color="emerald" />
        <StatCard label="Brand Impressions" value="125K" color="blue" />
        <StatCard label="Engagement Rate" value="4.2%" color="purple" />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Your Sponsorships</h3>
        <div className="space-y-3">
          {sponsor.sponsoredAssets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
              <div>
                <p className="text-sm font-medium text-white">{asset.name}</p>
                <p className="text-xs text-slate-400">{asset.description}</p>
              </div>
              <span className="text-sm font-bold text-emerald-400">${asset.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Performance Metrics</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Leaderboard Views</span><span className="text-white">45,230</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Brand Click-throughs</span><span className="text-white">2,180</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Social Mentions</span><span className="text-white">340</span></div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">ROI Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Cost per Impression</span><span className="text-white">$0.60</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Cost per Click</span><span className="text-white">$34.40</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Est. Brand Value</span><span className="text-emerald-400">$112K</span></div>
          </div>
        </div>
      </div>

      <Link href="/sponsors">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 hover:border-amber-500/40 transition-colors">
          <h3 className="text-sm font-semibold text-amber-400 mb-2">Expand Your Portfolio</h3>
          <p className="text-sm text-slate-400">Browse available sponsorship opportunities to increase your brand presence in the global cricket ecosystem.</p>
        </div>
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole>("player");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3">
        <Link href="/players?tab=profile" className="text-sm text-slate-400 hover:text-white">← Back to My Profile</Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">{roleLabels[role]}</h1>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="player">Player View</option>
          <option value="agent">Agent View</option>
          <option value="owner">T20 Owner View</option>
          <option value="sponsor">Sponsor View</option>
          <option value="coach">Coach View</option>
        </select>
      </div>

      {role === "player" && <PlayerDashboard />}
      {role === "agent" && <AgentDashboard />}
      {role === "owner" && <OwnerDashboard />}
      {role === "sponsor" && <SponsorDashboard />}
      {role === "coach" && <CoachDashboard />}
    </div>
  );
}
