"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { players, tournaments, performanceFeedItems, playerCombineData, generateCPIRankings, playerMatchHistory, getFormStatus } from "@/data/mock";
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
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                {player.name.split(" ").map((n) => n[0]).join("")}
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

      {tab === "training" && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Idol Capture</h3>
            <p className="text-slate-400 text-sm mb-4">Save your idol’s routines and mirror them.</p>
            <Link href="/idol-capture" className="inline-block text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">Set Routine</Link>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Track Exercises</h3>
            <p className="text-slate-400 text-sm mb-4">Follow coach plans and your own workouts.</p>
            <Link href="/dashboard" className="inline-block text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">Open Planner</Link>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Connect with Coach</h3>
            <p className="text-slate-400 text-sm mb-4">Find world-class coaches to level up.</p>
            <Link href="/coaches" className="inline-block text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">Find Coaches</Link>
          </div>
        </div>
      )}

      {tab === "ai" && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-xl font-semibold text-white mb-2">Full Track AI</h2>
          <p className="text-slate-400 text-sm mb-4">Upload a batting/bowling/fielding video and get instant AI feedback.</p>
          <Link href="/analyze" className="inline-block text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">Start Analysis</Link>
        </div>
      )}

      {tab === "store" && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-xl font-semibold text-white mb-2">Merchandise Store</h2>
          <p className="text-slate-400 text-sm mb-4">Shop bats, balls, pads, gloves, helmets, kits, and more.</p>
          <Link href="/store" className="inline-block text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">Open Store</Link>
        </div>
      )}
    </div>
  );
}
