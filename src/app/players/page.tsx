"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { players, tournaments, performanceFeedItems, playerCombineData, generateCPIRankings, playerMatchHistory, getFormStatus } from "@/data/mock";
import { legends, skillColors, type Skill, type Routine } from "@/data/legends";
import StatCard from "@/components/StatCard";

const feedTypeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  "top-score": { icon: "B", color: "text-emerald-400", bg: "bg-emerald-500/20" },
  "best-bowling": { icon: "W", color: "text-blue-400", bg: "bg-blue-500/20" },
  "fastest-innings": { icon: "F", color: "text-amber-400", bg: "bg-amber-500/20" },
  "form-spike": { icon: "S", color: "text-purple-400", bg: "bg-purple-500/20" },
  "hot-prospect": { icon: "H", color: "text-red-400", bg: "bg-red-500/20" },
  "rank-movement": { icon: "R", color: "text-cyan-400", bg: "bg-cyan-500/20" },
};

export default function PlayersPage() {
  return (
    <Suspense fallback={<div className="py-8 text-slate-400">Loading...</div>}>
      <PlayersContent />
    </Suspense>
  );
}

function PlayersContent() {
  const [tab, setTab] = useState<"profile" | "mystats" | "training" | "ai" | "store">("profile");
  const [trainingTab, setTrainingTab] = useState<"idol" | "exercises" | "coach">("idol");
  const search = useSearchParams();
  const [completedRoutines, setCompletedRoutines] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem(`cricverse360_routine_log_${todayKey}`);
    if (stored) setCompletedRoutines(JSON.parse(stored));
  }, []);

  const toggleRoutine = (routineKey: string) => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const updated = { ...completedRoutines, [routineKey]: !completedRoutines[routineKey] };
    setCompletedRoutines(updated);
    localStorage.setItem(`cricverse360_routine_log_${todayKey}`, JSON.stringify(updated));
  };

  useEffect(() => {
    const t = search.get("tab");
    const sub = search.get("sub");
    if (t === "profile" || t === "mystats" || t === "training" || t === "ai" || t === "store") setTab(t);
    if (sub === "idol" || sub === "exercises" || sub === "coach") setTrainingTab(sub);
  }, [search]);

  const tabs = [
    { id: "profile", label: "My Profile" },
    { id: "mystats", label: "My Stats" },
    { id: "training", label: "Training" },
    { id: "ai", label: "Full Track AI" },
    { id: "store", label: "Merchandise Store" },
  ] as const;

  const player = players[0];
  const playerFeed = [...performanceFeedItems]
    .filter((item) => item.playerId === player.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {tab === "profile" && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              {player.avatar ? (
                <img src={player.avatar} alt={player.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  {player.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
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
              {playerFeed.map((item) => {
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
      )}

      {tab === "mystats" && (() => {
        const ranked = generateCPIRankings();
        const playerCPI = ranked.find((p) => p.id === player.id);
        const combine = playerCombineData[player.id];
        const matches = playerMatchHistory[player.id] || [];
        const formStatus = getFormStatus(matches, player.role);
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Career Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Matches" value={player.stats.matches} color="emerald" />
                <StatCard label="Innings" value={player.stats.innings} color="blue" />
                <StatCard label="Runs" value={player.stats.runs} color="purple" />
                <StatCard label="Average" value={player.stats.battingAverage} color="amber" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <StatCard label="Strike Rate" value={player.stats.strikeRate} color="emerald" />
                <StatCard label="50s / 100s" value={`${player.stats.fifties} / ${player.stats.hundreds}`} color="blue" />
                <StatCard label="Wickets" value={player.stats.wickets} color="purple" />
                <StatCard label="Bowl Avg" value={player.stats.bowlingAverage} color="amber" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <StatCard label="Economy" value={player.stats.economy} color="emerald" />
                <StatCard label="Best Bowling" value={player.stats.bestBowling} color="blue" />
                <StatCard label="Catches" value={player.stats.catches} color="purple" />
                <StatCard label="Stumpings" value={player.stats.stumpings} color="amber" />
              </div>
            </div>

            {playerCPI && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide">CPI Metrics</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${formStatus === "Red Hot" ? "bg-red-500/20 text-red-400 border-red-500/30" : formStatus === "In Form" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : formStatus === "Steady" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>{formStatus}</span>
                    <span className="text-xs text-slate-500">Rank #{playerCPI.cpiScore.nationalRank}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mb-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${playerCPI.cpiScore.overall >= 75 ? "border-emerald-500 bg-emerald-500/10" : playerCPI.cpiScore.overall >= 55 ? "border-blue-500 bg-blue-500/10" : "border-amber-500 bg-amber-500/10"}`}>
                    <p className={`text-2xl font-bold ${playerCPI.cpiScore.overall >= 75 ? "text-emerald-400" : playerCPI.cpiScore.overall >= 55 ? "text-blue-400" : "text-amber-400"}`}>{playerCPI.cpiScore.overall}</p>
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-400">Match (40%)</p>
                      <p className="text-lg font-bold text-emerald-400">{playerCPI.cpiScore.matchPerformance}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-400">Athletic (30%)</p>
                      <p className="text-lg font-bold text-blue-400">{playerCPI.cpiScore.athleticMetrics}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-400">Form (20%)</p>
                      <p className="text-lg font-bold text-purple-400">{playerCPI.cpiScore.formIndex}</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-400">Consist. (10%)</p>
                      <p className="text-lg font-bold text-amber-400">{playerCPI.cpiScore.consistency}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {combine && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Combine Assessment</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${combine.verifiedAthlete ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700/50 text-slate-400"}`}>{combine.verifiedAthlete ? "Verified" : "Pending"}</span>
                    <span className="text-xs text-slate-500">Next: {new Date(combine.nextAssessmentDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Yo-Yo Score</p>
                    <p className={`text-lg font-bold ${combine.yoYoScore >= 19 ? "text-emerald-400" : combine.yoYoScore >= 17 ? "text-amber-400" : "text-red-400"}`}>{combine.yoYoScore}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">20m Sprint</p>
                    <p className={`text-lg font-bold ${combine.sprint20m <= 3.0 ? "text-emerald-400" : combine.sprint20m <= 3.2 ? "text-amber-400" : "text-red-400"}`}>{combine.sprint20m}s</p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Bat Speed</p>
                    <p className={`text-lg font-bold ${combine.batSpeed && combine.batSpeed >= 110 ? "text-emerald-400" : "text-amber-400"}`}>{combine.batSpeed || "N/A"}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Vert. Jump</p>
                    <p className={`text-lg font-bold ${combine.verticalJump >= 60 ? "text-emerald-400" : combine.verticalJump >= 50 ? "text-amber-400" : "text-red-400"}`}>{combine.verticalJump}cm</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Fielding Eff.</p>
                    <p className={`text-lg font-bold ${combine.fieldingEfficiency >= 80 ? "text-emerald-400" : combine.fieldingEfficiency >= 70 ? "text-amber-400" : "text-red-400"}`}>{combine.fieldingEfficiency}%</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Throw Acc.</p>
                    <p className={`text-lg font-bold ${combine.throwAccuracy >= 80 ? "text-emerald-400" : combine.throwAccuracy >= 70 ? "text-amber-400" : "text-red-400"}`}>{combine.throwAccuracy}%</p>
                  </div>
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Reaction</p>
                    <p className={`text-lg font-bold ${combine.reactionTime <= 0.25 ? "text-emerald-400" : combine.reactionTime <= 0.30 ? "text-amber-400" : "text-red-400"}`}>{combine.reactionTime}s</p>
                  </div>
                  {combine.bowlingSpeed && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-400">Bowl Speed</p>
                      <p className={`text-lg font-bold ${combine.bowlingSpeed >= 140 ? "text-emerald-400" : combine.bowlingSpeed >= 120 ? "text-amber-400" : "text-slate-400"}`}>{combine.bowlingSpeed} km/h</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {tab === "training" && (() => {
        let savedSelections: Record<string, string> = {};
        try {
          const raw = typeof window !== "undefined" ? localStorage.getItem("idol-selections") : null;
          if (raw) savedSelections = JSON.parse(raw);
        } catch {}
        const hasIdols = Object.keys(savedSelections).length > 0;

        const savedLegends = Object.entries(savedSelections).map(([skill, id]) => {
          const legend = legends.find((l) => l.id === id);
          return legend ? { skill: skill as Skill, legend } : null;
        }).filter(Boolean) as { skill: Skill; legend: (typeof legends)[number] }[];

        const groupedRoutines: Record<string, { routine: Routine; idol: string; skill: Skill; key: string }[]> = { Daily: [], Weekly: [], Monthly: [] };
        for (const { skill, legend } of savedLegends) {
          const routines = legend.routines[skill] || [];
          for (const r of routines) {
            const key = `${legend.id}_${skill}_${r.name}`;
            const entry = { routine: r, idol: legend.name, skill, key };
            if (r.frequency === "Daily") groupedRoutines.Daily.push(entry);
            else if (r.frequency === "Monthly") groupedRoutines.Monthly.push(entry);
            else groupedRoutines.Weekly.push(entry);
          }
        }
        const totalRoutines = groupedRoutines.Daily.length + groupedRoutines.Weekly.length + groupedRoutines.Monthly.length;
        const completedCount = Object.values(completedRoutines).filter(Boolean).length;
        const pendingDaily = groupedRoutines.Daily.filter((item) => !completedRoutines[item.key]).length;
        const pendingWeekly = groupedRoutines.Weekly.filter((item) => !completedRoutines[item.key]).length;

        if (!hasIdols) {
          return (
            <div className="flex flex-col items-center justify-center py-16">
              <Link href="/idol-capture" className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">Idol Capture</p>
                  <p className="text-sm text-slate-400 mt-1">Select cricket legends as your idols to build your training routine</p>
                </div>
              </Link>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {totalRoutines > 0 && (pendingDaily > 0 || pendingWeekly > 0) && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-400">Pending Routines</p>
                  <p className="text-xs text-slate-400">
                    {pendingDaily > 0 && <span>{pendingDaily} daily routine{pendingDaily > 1 ? "s" : ""} pending</span>}
                    {pendingDaily > 0 && pendingWeekly > 0 && <span> &middot; </span>}
                    {pendingWeekly > 0 && <span>{pendingWeekly} weekly routine{pendingWeekly > 1 ? "s" : ""} pending</span>}
                  </p>
                </div>
                <span className="text-xs text-slate-500">{completedCount}/{totalRoutines} done today</span>
              </div>
            )}

            {totalRoutines > 0 && completedCount === totalRoutines && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">All routines completed!</p>
                  <p className="text-xs text-slate-400">Great work today. Keep up the consistency.</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Idol Selections</h2>
              <Link href="/idol-capture" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                Edit Idols
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {savedLegends.map(({ skill, legend }) => {
                const colors = skillColors[skill];
                return (
                  <div key={skill} className={`rounded-xl p-4 border ${colors.border} ${colors.bg}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${colors.text}`}>{skill}</p>
                    <div className="flex items-center gap-2">
                      <img src={legend.photo} alt={legend.name} className="w-8 h-8 rounded-full object-cover shrink-0 bg-slate-700" />
                      <div>
                        <p className="text-white font-semibold text-sm">{legend.name}</p>
                        <p className="text-xs text-slate-400">{legend.country}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalRoutines > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Training Routines</h2>
                  <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">{completedCount}/{totalRoutines} completed</span>
                </div>

                {(["Daily", "Weekly", "Monthly"] as const).map((freq) => {
                  const items = groupedRoutines[freq];
                  if (items.length === 0) return null;
                  const freqColors = { Daily: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", badge: "bg-emerald-500/20" }, Weekly: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", badge: "bg-blue-500/20" }, Monthly: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", badge: "bg-purple-500/20" } };
                  const fc = freqColors[freq];
                  const doneInGroup = items.filter((item) => completedRoutines[item.key]).length;
                  return (
                    <div key={freq} className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className={`text-sm font-semibold ${fc.text}`}>{freq} Routines</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${fc.badge} ${fc.text}`}>{doneInGroup}/{items.length}</span>
                      </div>
                      <div className={`border rounded-xl ${fc.border} ${fc.bg} overflow-hidden`}>
                        {items.map((item, i) => {
                          const sc = skillColors[item.skill];
                          const done = !!completedRoutines[item.key];
                          return (
                            <div key={i} className={`px-4 py-3 ${i < items.length - 1 ? "border-b border-slate-700/20" : ""} ${done ? "opacity-60" : ""}`}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleRoutine(item.key)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                      done ? "bg-emerald-500 border-emerald-500" : "border-slate-500 hover:border-emerald-400"
                                    }`}
                                  >
                                    {done && (
                                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    )}
                                  </button>
                                  <p className={`text-sm font-semibold ${done ? "text-slate-400 line-through" : "text-white"}`}>{item.routine.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{item.skill}</span>
                                  <span className="text-xs text-slate-500">{item.routine.duration}</span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-400 mb-1 ml-8">{item.routine.description}</p>
                              <div className="flex items-center gap-3 ml-8">
                                <p className="text-xs text-slate-500">Idol: {item.idol} &middot; {item.routine.frequency}</p>
                                <a href={item.routine.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/></svg>
                                  Watch
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Link href="/coaches" className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
              Find Coach
            </Link>
          </div>
        );
      })()}

      {tab === "ai" && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-xl font-semibold text-white mb-2">Full Track AI</h2>
          <p className="text-slate-400 text-sm mb-4">Upload a batting/bowling/fielding video and get instant AI feedback.</p>
          <Link href="/analyze" className="inline-block text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">Start Analysis</Link>
        </div>
      )}

      {tab === "store" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Cricket Stores</h2>
            <p className="text-slate-400 text-sm">Shop from top cricket equipment stores worldwide</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "CricMax", url: "https://www.cricmax.com", desc: "Premium cricket bats, pads & gear for all levels", tag: "Popular", color: "emerald" },
              { name: "Dream Cricket", url: "https://www.dreamcricket.com", desc: "Professional cricket equipment & training aids", tag: "Pro Gear", color: "blue" },
              { name: "Kookaburra", url: "https://www.kookaburra.com.au", desc: "Official balls, bats & protective equipment", tag: "Official", color: "amber" },
              { name: "Gray-Nicolls", url: "https://www.gray-nicolls.co.uk", desc: "Heritage cricket bats, gloves & pads since 1855", tag: "Heritage", color: "purple" },
              { name: "SG Cricket", url: "https://www.sgcricket.com", desc: "India's top cricket brand - bats, balls & kits", tag: "India #1", color: "red" },
              { name: "SS Cricket", url: "https://www.sscricket.com", desc: "Sareen Sports - premium English willow bats", tag: "Bats", color: "cyan" },
              { name: "GM Cricket", url: "https://www.gmcricket.com", desc: "Gunn & Moore - world-class cricket equipment", tag: "UK Brand", color: "indigo" },
              { name: "MRF Cricket", url: "https://www.mrfcricket.com", desc: "Match-quality bats endorsed by legends", tag: "Legend Choice", color: "orange" },
              { name: "Cricket Store Online", url: "https://www.cricketstoreonline.com", desc: "Largest online cricket store with global shipping", tag: "Online", color: "teal" },
            ].map((store) => (
              <a key={store.name} href={store.url} target="_blank" rel="noopener noreferrer" className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/40 transition-all group block">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors">{store.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-${store.color}-500/20 text-${store.color}-400`}>{store.tag}</span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{store.desc}</p>
                <span className="text-xs text-emerald-400 group-hover:underline flex items-center gap-1">
                  Visit Store <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                </span>
              </a>
            ))}
          </div>
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
            <p className="text-slate-500 text-xs text-center">CricVerse360 is not affiliated with these stores. Links open in a new tab.</p>
          </div>
        </div>
      )}
    </div>
  );
}
