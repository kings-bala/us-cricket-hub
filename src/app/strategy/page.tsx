"use client";

import { useState, useMemo } from "react";
import { players } from "@/data/mock";
import SubscriptionGate from "@/components/SubscriptionGate";

type Phase = "powerplay" | "middle" | "death";
type MatchFormat = "T20" | "ODI" | "T10";

interface BattingSlot {
  playerId: string | null;
  role: string;
  targetSR: number;
  notes: string;
}

interface BowlingPlan {
  playerId: string | null;
  phase: Phase;
  overs: number;
  plan: string;
  matchup: string;
}

interface StrategyPlan {
  id: string;
  name: string;
  format: MatchFormat;
  opponent: string;
  battingOrder: BattingSlot[];
  bowlingPlans: BowlingPlan[];
  phaseTargets: Record<Phase, { targetRuns: number; targetWickets: number; approach: string }>;
  notes: string;
}

const phaseInfo: Record<Phase, { label: string; color: string; overs: Record<MatchFormat, string> }> = {
  powerplay: { label: "Powerplay", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", overs: { T20: "1-6", ODI: "1-10", T10: "1-3" } },
  middle: { label: "Middle Overs", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", overs: { T20: "7-15", ODI: "11-40", T10: "4-8" } },
  death: { label: "Death Overs", color: "bg-red-500/20 text-red-400 border-red-500/30", overs: { T20: "16-20", ODI: "41-50", T10: "9-10" } },
};

const defaultBattingOrder: BattingSlot[] = [
  { playerId: "p1", role: "Aggressive Opener", targetSR: 145, notes: "Attack in powerplay" },
  { playerId: "p8", role: "Anchor Opener", targetSR: 130, notes: "Build foundation" },
  { playerId: "p3", role: "No.3 Stabilizer", targetSR: 135, notes: "Flexible role" },
  { playerId: "p4", role: "Middle Order", targetSR: 140, notes: "Accelerate if set" },
  { playerId: "p6", role: "Finisher", targetSR: 160, notes: "Death overs specialist" },
  { playerId: "p10", role: "All-rounder", targetSR: 145, notes: "Quick runs lower order" },
  { playerId: "p5", role: "Lower Order Hitter", targetSR: 150, notes: "Cameo role" },
  { playerId: null, role: "Bowler", targetSR: 100, notes: "" },
  { playerId: null, role: "Bowler", targetSR: 100, notes: "" },
  { playerId: null, role: "Bowler", targetSR: 100, notes: "" },
  { playerId: null, role: "Bowler", targetSR: 100, notes: "" },
];

const defaultBowlingPlans: BowlingPlan[] = [
  { playerId: "p2", phase: "powerplay", overs: 3, plan: "Yorker + short pitch mix", matchup: "vs LHB: wide yorkers" },
  { playerId: "p2", phase: "death", overs: 1, plan: "Slower balls + yorkers", matchup: "vs set batsman: change pace" },
  { playerId: "p5", phase: "powerplay", overs: 2, plan: "Aggressive pace, target stumps", matchup: "vs RHB: outswingers" },
  { playerId: "p5", phase: "death", overs: 2, plan: "Yorkers + bouncers", matchup: "vs finishers: wide lines" },
  { playerId: "p7", phase: "middle", overs: 4, plan: "Flight + drift, vary pace", matchup: "vs RHB: leg stump line" },
  { playerId: "p3", phase: "middle", overs: 3, plan: "Contain + wicket-taking", matchup: "vs aggressive: slower ball" },
  { playerId: "p10", phase: "middle", overs: 2, plan: "Tight lines, build pressure", matchup: "vs LHB: around the wicket" },
  { playerId: "p10", phase: "powerplay", overs: 1, plan: "Early breakthrough", matchup: "vs openers: full length" },
];

const defaultPlan: StrategyPlan = {
  id: "sp1", name: "Default T20 Strategy", format: "T20", opponent: "Opposition XI",
  battingOrder: defaultBattingOrder, bowlingPlans: defaultBowlingPlans,
  phaseTargets: {
    powerplay: { targetRuns: 55, targetWickets: 1, approach: "Aggressive - target 9+ RPO. Use field restrictions." },
    middle: { targetRuns: 75, targetWickets: 3, approach: "Build partnerships. Rotate strike, punish bad balls." },
    death: { targetRuns: 60, targetWickets: 4, approach: "All-out attack. Target 12+ RPO in last 5 overs." },
  },
  notes: "Key: Win the powerplay battle. Middle overs control with spinners. Death overs - trust the quicks.",
};

export default function StrategyPage() {
  return (
    <SubscriptionGate feature="strategy_tools">
      <StrategyContent />
    </SubscriptionGate>
  );
}

function StrategyContent() {
  const [plan, setPlan] = useState<StrategyPlan>(defaultPlan);
  const [activeTab, setActiveTab] = useState<"batting" | "bowling" | "phases" | "simulation">("batting");
  const [simBall, setSimBall] = useState(0);
  const [simRuns, setSimRuns] = useState(0);
  const [simWickets, setSimWickets] = useState(0);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);

  const getPlayer = (id: string | null) => id ? players.find(p => p.id === id) : null;

  const tabs = [
    { key: "batting" as const, label: "Batting Order" },
    { key: "bowling" as const, label: "Bowling Plans" },
    { key: "phases" as const, label: "Phase Targets" },
    { key: "simulation" as const, label: "Ball-by-Ball Sim" },
  ];

  const currentPhase = useMemo((): Phase => {
    const over = Math.floor(simBall / 6) + 1;
    if (plan.format === "T20") return over <= 6 ? "powerplay" : over <= 15 ? "middle" : "death";
    if (plan.format === "ODI") return over <= 10 ? "powerplay" : over <= 40 ? "middle" : "death";
    return over <= 3 ? "powerplay" : over <= 8 ? "middle" : "death";
  }, [simBall, plan.format]);

  const simulateBall = () => {
    const maxBalls = plan.format === "T20" ? 120 : plan.format === "ODI" ? 300 : 60;
    if (simBall >= maxBalls || simWickets >= 10) return;

    const outcomes = [0, 0, 1, 1, 1, 2, 2, 3, 4, 4, 6, "W", "WD", "NB"];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];
    const over = Math.floor(simBall / 6) + 1;
    const ball = (simBall % 6) + 1;

    if (result === "W") {
      setSimWickets(prev => prev + 1);
      setSimLog(prev => [...prev, over + "." + ball + " - WICKET!"]);
      setSimBall(prev => prev + 1);
    } else if (result === "WD" || result === "NB") {
      setSimRuns(prev => prev + 1);
      setSimLog(prev => [...prev, over + "." + ball + " - " + result + " (1 extra)"]);
    } else {
      const runs = result as number;
      setSimRuns(prev => prev + runs);
      setSimLog(prev => [...prev, over + "." + ball + " - " + (runs === 0 ? "Dot ball" : runs === 4 ? "FOUR!" : runs === 6 ? "SIX!" : runs + " run" + (runs > 1 ? "s" : ""))]);
      setSimBall(prev => prev + 1);
    }
  };

  const simulateOver = () => {
    for (let i = 0; i < 6; i++) simulateBall();
  };

  const resetSim = () => {
    setSimBall(0); setSimRuns(0); setSimWickets(0); setSimLog([]);
  };

  const updatePhaseTarget = (phase: Phase, field: string, value: string | number) => {
    setPlan(prev => ({
      ...prev,
      phaseTargets: {
        ...prev.phaseTargets,
        [phase]: { ...prev.phaseTargets[phase], [field]: value },
      },
    }));
  };

  const updateBattingSlot = (idx: number, field: string, value: string | number | null) => {
    setPlan(prev => ({
      ...prev,
      battingOrder: prev.battingOrder.map((s, i) => i === idx ? { ...s, [field]: value } : s),
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Game Planning</p>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">Match Strategy Planner</h1>
              <span className={"text-xs px-2 py-1 rounded-full border " + phaseInfo[currentPhase].color}>{plan.format}</span>
            </div>
            <p className="text-slate-400">Phase-based planning, opposition matchups, and ball-by-ball simulation</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={plan.format} onChange={e => setPlan(prev => ({ ...prev, format: e.target.value as MatchFormat }))}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
              <option value="T20">T20</option>
              <option value="ODI">ODI</option>
              <option value="T10">T10</option>
            </select>
            <input type="text" value={plan.opponent} onChange={e => setPlan(prev => ({ ...prev, opponent: e.target.value }))}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-40"
              placeholder="Opponent name" />
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors border " + (activeTab === t.key ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white")}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "batting" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Batting Order vs {plan.opponent}</h3>
              <div className="space-y-2">
                {plan.battingOrder.map((slot, idx) => {
                  const p = getPlayer(slot.playerId);
                  return (
                    <div key={idx} className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/30 rounded-lg p-3">
                      <span className="text-lg font-bold text-slate-500 w-8 text-center">{idx + 1}</span>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {p ? p.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <select value={slot.playerId || ""} onChange={e => updateBattingSlot(idx, "playerId", e.target.value || null)}
                            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none w-40">
                            <option value="">Select Player</option>
                            {players.map(pl => <option key={pl.id} value={pl.id}>{pl.name}</option>)}
                          </select>
                          <input type="text" value={slot.role} onChange={e => updateBattingSlot(idx, "role", e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none w-36" placeholder="Role" />
                        </div>
                        {p && <p className="text-xs text-slate-500 mt-1">{p.role} &middot; Avg {p.stats.battingAverage} &middot; SR {p.stats.strikeRate}</p>}
                      </div>
                      <div className="text-center shrink-0">
                        <p className="text-sm font-semibold text-amber-400">{slot.targetSR}</p>
                        <p className="text-xs text-slate-500">Target SR</p>
                      </div>
                      <input type="text" value={slot.notes} onChange={e => updateBattingSlot(idx, "notes", e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-400 focus:outline-none w-40" placeholder="Notes" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bowling" && (
          <div className="space-y-4">
            {(["powerplay", "middle", "death"] as Phase[]).map(phase => {
              const phasePlans = plan.bowlingPlans.filter(bp => bp.phase === phase);
              const totalOvers = phasePlans.reduce((s, bp) => s + bp.overs, 0);
              return (
                <div key={phase} className="glass-card rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={"text-xs px-2 py-1 rounded-full border " + phaseInfo[phase].color}>{phaseInfo[phase].label}</span>
                      <span className="text-xs text-slate-500">Overs {phaseInfo[phase].overs[plan.format]}</span>
                    </div>
                    <span className="text-xs text-slate-400">{totalOvers} overs allocated</span>
                  </div>
                  <div className="space-y-2">
                    {phasePlans.map((bp, idx) => {
                      const p = getPlayer(bp.playerId);
                      return (
                        <div key={idx} className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/30 rounded-lg p-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {p ? p.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{p ? p.name : "TBD"}</p>
                            {p && <p className="text-xs text-slate-500">{p.stats.wickets} wkts &middot; Eco {p.stats.economy} &middot; {p.fitnessData.bowlingSpeed ? p.fitnessData.bowlingSpeed + " km/h" : p.bowlingStyle}</p>}
                          </div>
                          <div className="text-center shrink-0">
                            <p className="text-sm font-semibold text-blue-400">{bp.overs}</p>
                            <p className="text-xs text-slate-500">Overs</p>
                          </div>
                          <div className="shrink-0 max-w-xs">
                            <p className="text-xs text-slate-300">{bp.plan}</p>
                            <p className="text-xs text-amber-400/70 mt-0.5">{bp.matchup}</p>
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

        {activeTab === "phases" && (
          <div className="space-y-4">
            {(["powerplay", "middle", "death"] as Phase[]).map(phase => {
              const target = plan.phaseTargets[phase];
              return (
                <div key={phase} className="glass-card rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={"text-xs px-2 py-1 rounded-full border " + phaseInfo[phase].color}>{phaseInfo[phase].label}</span>
                      <span className="text-xs text-slate-500">Overs {phaseInfo[phase].overs[plan.format]}</span>
                    </div>
                    <button onClick={() => setEditingPhase(editingPhase === phase ? null : phase)}
                      className="text-xs text-emerald-400 hover:text-emerald-300">{editingPhase === phase ? "Done" : "Edit"}</button>
                  </div>
                  {editingPhase === phase ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Target Runs</label>
                          <input type="number" value={target.targetRuns} onChange={e => updatePhaseTarget(phase, "targetRuns", parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Max Wickets</label>
                          <input type="number" value={target.targetWickets} onChange={e => updatePhaseTarget(phase, "targetWickets", parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Approach</label>
                        <textarea value={target.approach} onChange={e => updatePhaseTarget(phase, "approach", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none" rows={2} />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center bg-slate-900/50 rounded-lg p-3">
                          <p className="text-xl font-bold text-white">{target.targetRuns}</p>
                          <p className="text-xs text-slate-500">Target Runs</p>
                        </div>
                        <div className="text-center bg-slate-900/50 rounded-lg p-3">
                          <p className="text-xl font-bold text-amber-400">{target.targetWickets}</p>
                          <p className="text-xs text-slate-500">Max Wickets</p>
                        </div>
                        <div className="text-center bg-slate-900/50 rounded-lg p-3">
                          <p className="text-xl font-bold text-emerald-400">
                            {(target.targetRuns / (plan.format === "T20" ? (phase === "powerplay" ? 6 : phase === "middle" ? 9 : 5) : (phase === "powerplay" ? 10 : phase === "middle" ? 30 : 10))).toFixed(1)}
                          </p>
                          <p className="text-xs text-slate-500">Required RPO</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">{target.approach}</p>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-3">Total Target</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400">
                    {plan.phaseTargets.powerplay.targetRuns + plan.phaseTargets.middle.targetRuns + plan.phaseTargets.death.targetRuns}
                  </p>
                  <p className="text-sm text-slate-400">Total Runs</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-400">
                    {plan.phaseTargets.powerplay.targetWickets + plan.phaseTargets.middle.targetWickets + plan.phaseTargets.death.targetWickets}
                  </p>
                  <p className="text-sm text-slate-400">Max Wickets</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">
                    {((plan.phaseTargets.powerplay.targetRuns + plan.phaseTargets.middle.targetRuns + plan.phaseTargets.death.targetRuns) / (plan.format === "T20" ? 20 : plan.format === "ODI" ? 50 : 10)).toFixed(1)}
                  </p>
                  <p className="text-sm text-slate-400">Overall RPO</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "simulation" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Live Simulation</h3>
                <span className={"text-xs px-2 py-1 rounded-full border " + phaseInfo[currentPhase].color}>{phaseInfo[currentPhase].label}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center bg-slate-900/50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-white">{simRuns}/{simWickets}</p>
                  <p className="text-xs text-slate-500">Score</p>
                </div>
                <div className="text-center bg-slate-900/50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-emerald-400">{Math.floor(simBall / 6)}.{simBall % 6}</p>
                  <p className="text-xs text-slate-500">Overs</p>
                </div>
                <div className="text-center bg-slate-900/50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-blue-400">{simBall > 0 ? ((simRuns / simBall) * 6).toFixed(1) : "0.0"}</p>
                  <p className="text-xs text-slate-500">Run Rate</p>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <button onClick={simulateBall} disabled={simBall >= (plan.format === "T20" ? 120 : 300) || simWickets >= 10}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                  Next Ball
                </button>
                <button onClick={simulateOver} disabled={simBall >= (plan.format === "T20" ? 120 : 300) || simWickets >= 10}
                  className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                  Sim Over
                </button>
                <button onClick={resetSim}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Reset
                </button>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Phase Progress</h4>
                {(["powerplay", "middle", "death"] as Phase[]).map(phase => {
                  const target = plan.phaseTargets[phase];
                  const phaseOversStart = phase === "powerplay" ? 0 : phase === "middle" ? (plan.format === "T20" ? 36 : 60) : (plan.format === "T20" ? 90 : 240);
                  const isActive = currentPhase === phase;
                  return (
                    <div key={phase} className={"flex items-center gap-3 py-2 " + (isActive ? "opacity-100" : "opacity-50")}>
                      <span className={"text-xs px-2 py-0.5 rounded border w-20 text-center " + phaseInfo[phase].color}>{phaseInfo[phase].label}</span>
                      <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                        <div className={"h-2 rounded-full transition-all " + (phase === "powerplay" ? "bg-emerald-500" : phase === "middle" ? "bg-blue-500" : "bg-red-500")}
                          style={{ width: Math.min(100, (simBall > phaseOversStart ? ((simBall - phaseOversStart) / 36) * 100 : 0)) + "%" }} />
                      </div>
                      <span className="text-xs text-slate-500">Target: {target.targetRuns}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Ball-by-Ball Log</h3>
              <div className="bg-slate-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {simLog.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">Click &quot;Next Ball&quot; to start the simulation</p>
                ) : (
                  <div className="space-y-1">
                    {[...simLog].reverse().map((entry, i) => (
                      <div key={i} className={"text-sm py-1 px-2 rounded " + (entry.includes("WICKET") ? "bg-red-500/10 text-red-400" : entry.includes("FOUR") ? "bg-emerald-500/10 text-emerald-400" : entry.includes("SIX") ? "bg-amber-500/10 text-amber-400" : entry.includes("Dot") ? "text-slate-500" : "text-slate-300")}>
                        {entry}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {simLog.length > 0 && (
                <div className="mt-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-2">Simulation Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p className="text-slate-300">Boundaries: <span className="text-emerald-400">{simLog.filter(l => l.includes("FOUR")).length} fours, {simLog.filter(l => l.includes("SIX")).length} sixes</span></p>
                    <p className="text-slate-300">Dot balls: <span className="text-slate-400">{simLog.filter(l => l.includes("Dot")).length}</span></p>
                    <p className="text-slate-300">Wickets: <span className="text-red-400">{simWickets}</span></p>
                    <p className="text-slate-300">Extras: <span className="text-amber-400">{simLog.filter(l => l.includes("WD") || l.includes("NB")).length}</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Strategy Notes</h3>
          <textarea value={plan.notes} onChange={e => setPlan(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none" rows={3} />
        </div>
      </div>
    </div>
  );
}
