"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type Extra = "wide" | "no-ball" | "bye" | "leg-bye" | null;
type Wicket = "bowled" | "caught" | "lbw" | "run-out" | "stumped" | "hit-wicket" | null;

interface BallEntry {
  id: string;
  over: number;
  ball: number;
  runs: number;
  extra: Extra;
  extraRuns: number;
  wicket: Wicket;
  batsmanName: string;
  bowlerName: string;
  description: string;
}

interface BatterInnings {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissal: string;
}

interface BowlerSpell {
  name: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
  extras: number;
}

interface MatchState {
  team1: string;
  team2: string;
  battingTeam: "team1" | "team2";
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  totalBalls: number;
  currentOver: number;
  currentBall: number;
  target: number | null;
  innings: 1 | 2;
  isComplete: boolean;
  ballLog: BallEntry[];
  batters: BatterInnings[];
  bowlers: BowlerSpell[];
  striker: string;
  nonStriker: string;
  currentBowler: string;
  thisOver: number[];
  maxOvers: number;
  firstInningsTotal: number | null;
}

const SAMPLE_PLAYERS_A = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"];
const SAMPLE_PLAYERS_B = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"];

export default function ScoringPage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<"setup" | "scoring" | "complete">("setup");
  const [setupForm, setSetupForm] = useState({ team1: "", team2: "", maxOvers: 20, tossWinner: "team1" as "team1" | "team2", tossDecision: "bat" as "bat" | "bowl" });

  const [match, setMatch] = useState<MatchState | null>(null);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showNewBatter, setShowNewBatter] = useState(false);
  const [showNewBowler, setShowNewBowler] = useState(false);
  const [pendingRuns, setPendingRuns] = useState(0);
  const [selectedExtra, setSelectedExtra] = useState<Extra>(null);
  const [newBatterName, setNewBatterName] = useState("");
  const [newBowlerName, setNewBowlerName] = useState("");

  const startMatch = () => {
    if (!setupForm.team1.trim() || !setupForm.team2.trim()) return;
    const battingFirst = setupForm.tossDecision === "bat" ? setupForm.tossWinner : (setupForm.tossWinner === "team1" ? "team2" : "team1");
    const battingPlayers = battingFirst === "team1" ? SAMPLE_PLAYERS_A : SAMPLE_PLAYERS_B;

    setMatch({
      team1: setupForm.team1.trim(),
      team2: setupForm.team2.trim(),
      battingTeam: battingFirst as "team1" | "team2",
      totalRuns: 0,
      totalWickets: 0,
      totalOvers: 0,
      totalBalls: 0,
      currentOver: 0,
      currentBall: 0,
      target: null,
      innings: 1,
      isComplete: false,
      ballLog: [],
      batters: [
        { name: battingPlayers[0], runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, dismissal: "" },
        { name: battingPlayers[1], runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, dismissal: "" },
      ],
      bowlers: [],
      striker: battingPlayers[0],
      nonStriker: battingPlayers[1],
      currentBowler: "",
      thisOver: [],
      maxOvers: setupForm.maxOvers,
      firstInningsTotal: null,
    });
    setPhase("scoring");
    setShowNewBowler(true);
  };

  const recordBall = useCallback((runs: number, extra: Extra, wicket: Wicket) => {
    if (!match || !match.currentBowler) return;

    setMatch(prev => {
      if (!prev) return prev;
      const m = { ...prev };
      m.ballLog = [...prev.ballLog];
      m.batters = prev.batters.map(b => ({ ...b }));
      m.bowlers = prev.bowlers.map(b => ({ ...b }));
      m.thisOver = [...prev.thisOver];

      const isLegalDelivery = extra !== "wide" && extra !== "no-ball";
      const extraRuns = extra === "wide" ? 1 + runs : extra === "no-ball" ? 1 + runs : extra === "bye" || extra === "leg-bye" ? runs : 0;
      const batsmanRuns = (extra === "bye" || extra === "leg-bye") ? 0 : extra === "wide" ? 0 : extra === "no-ball" ? runs : runs;
      const totalBallRuns = extra ? extraRuns + (extra === "no-ball" ? 0 : 0) : runs;
      const addToTotal = extra === "wide" ? 1 + runs : extra === "no-ball" ? 1 + runs : runs;

      let newBall = m.currentBall;
      let newOver = m.currentOver;
      if (isLegalDelivery) {
        newBall++;
        if (newBall >= 6) {
          newOver++;
          newBall = 0;
        }
      }

      let desc = "";
      if (wicket) {
        desc = `W${runs > 0 ? `+${runs}` : ""}`;
      } else if (extra === "wide") {
        desc = `Wd${runs > 0 ? `+${runs}` : ""}`;
      } else if (extra === "no-ball") {
        desc = `Nb${runs > 0 ? `+${runs}` : ""}`;
      } else if (extra === "bye") {
        desc = `${runs}b`;
      } else if (extra === "leg-bye") {
        desc = `${runs}lb`;
      } else {
        desc = `${runs}`;
      }

      const entry: BallEntry = {
        id: `b${Date.now()}`,
        over: m.currentOver,
        ball: m.currentBall,
        runs: batsmanRuns,
        extra,
        extraRuns: extra ? (extra === "wide" || extra === "no-ball" ? 1 : 0) : 0,
        wicket,
        batsmanName: m.striker,
        bowlerName: m.currentBowler,
        description: desc,
      };
      m.ballLog.push(entry);
      m.thisOver.push(totalBallRuns);

      m.totalRuns += addToTotal;

      const strikerIdx = m.batters.findIndex(b => b.name === m.striker);
      if (strikerIdx >= 0) {
        if (batsmanRuns > 0) m.batters[strikerIdx].runs += batsmanRuns;
        if (isLegalDelivery) m.batters[strikerIdx].balls++;
        if (batsmanRuns === 4 && !extra) m.batters[strikerIdx].fours++;
        if (batsmanRuns === 6 && !extra) m.batters[strikerIdx].sixes++;
      }

      const bowlerIdx = m.bowlers.findIndex(b => b.name === m.currentBowler);
      if (bowlerIdx >= 0) {
        if (isLegalDelivery) {
          m.bowlers[bowlerIdx].balls++;
          if (m.bowlers[bowlerIdx].balls >= 6) {
            m.bowlers[bowlerIdx].overs++;
            m.bowlers[bowlerIdx].balls = 0;
          }
        }
        m.bowlers[bowlerIdx].runs += addToTotal;
        if (wicket && wicket !== "run-out") m.bowlers[bowlerIdx].wickets++;
        if (extra) m.bowlers[bowlerIdx].extras++;
      }

      if (wicket) {
        m.totalWickets++;
        if (strikerIdx >= 0) {
          m.batters[strikerIdx].isOut = true;
          m.batters[strikerIdx].dismissal = wicket;
        }
      }

      const shouldRotate = (runs % 2 === 1);
      if (shouldRotate && !wicket) {
        const temp = m.striker;
        m.striker = m.nonStriker;
        m.nonStriker = temp;
      }

      m.currentBall = newBall;
      m.currentOver = newOver;
      m.totalBalls = newOver * 6 + newBall;

      if (isLegalDelivery && newBall === 0) {
        const temp = m.striker;
        m.striker = m.nonStriker;
        m.nonStriker = temp;
        m.thisOver = [];
      }

      const allOut = m.totalWickets >= 10;
      const oversComplete = newOver >= m.maxOvers;
      const targetReached = m.target !== null && m.totalRuns >= m.target;

      if (allOut || oversComplete || targetReached) {
        if (m.innings === 1) {
          m.firstInningsTotal = m.totalRuns;
          m.target = m.totalRuns + 1;
          m.innings = 2;
          m.battingTeam = m.battingTeam === "team1" ? "team2" : "team1";
          const newBattingPlayers = m.battingTeam === "team1" ? SAMPLE_PLAYERS_A : SAMPLE_PLAYERS_B;
          m.totalRuns = 0;
          m.totalWickets = 0;
          m.totalOvers = 0;
          m.totalBalls = 0;
          m.currentOver = 0;
          m.currentBall = 0;
          m.ballLog = [];
          m.batters = [
            { name: newBattingPlayers[0], runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, dismissal: "" },
            { name: newBattingPlayers[1], runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, dismissal: "" },
          ];
          m.bowlers = [];
          m.striker = newBattingPlayers[0];
          m.nonStriker = newBattingPlayers[1];
          m.currentBowler = "";
          m.thisOver = [];
        } else {
          m.isComplete = true;
        }
      }

      return m;
    });
  }, [match]);

  const addRuns = (runs: number) => {
    if (selectedExtra) {
      recordBall(runs, selectedExtra, null);
      setSelectedExtra(null);
    } else {
      recordBall(runs, null, null);
    }
  };

  const addWicket = (type: Wicket) => {
    recordBall(pendingRuns, selectedExtra, type);
    setSelectedExtra(null);
    setPendingRuns(0);
    setShowWicketModal(false);
    if (match && match.totalWickets < 9) {
      setShowNewBatter(true);
    }
  };

  const addNewBatter = () => {
    if (!match || !newBatterName.trim()) return;
    setMatch(prev => {
      if (!prev) return prev;
      const m = { ...prev };
      m.batters = [...prev.batters, { name: newBatterName.trim(), runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, dismissal: "" }];
      m.striker = newBatterName.trim();
      return m;
    });
    setNewBatterName("");
    setShowNewBatter(false);
  };

  const addNewBowler = () => {
    if (!match || !newBowlerName.trim()) return;
    setMatch(prev => {
      if (!prev) return prev;
      const m = { ...prev };
      const existing = prev.bowlers.find(b => b.name === newBowlerName.trim());
      if (!existing) {
        m.bowlers = [...prev.bowlers, { name: newBowlerName.trim(), overs: 0, balls: 0, maidens: 0, runs: 0, wickets: 0, extras: 0 }];
      }
      m.currentBowler = newBowlerName.trim();
      return m;
    });
    setNewBowlerName("");
    setShowNewBowler(false);
  };

  const undoLastBall = () => {
    if (!match || match.ballLog.length === 0) return;
    setMatch(prev => {
      if (!prev || prev.ballLog.length === 0) return prev;
      const m = { ...prev };
      const last = prev.ballLog[prev.ballLog.length - 1];
      m.ballLog = prev.ballLog.slice(0, -1);

      const isLegal = last.extra !== "wide" && last.extra !== "no-ball";
      const addedRuns = last.extra === "wide" ? 1 + last.runs : last.extra === "no-ball" ? 1 + last.runs : last.runs;

      m.totalRuns -= addedRuns;

      if (isLegal) {
        if (m.currentBall === 0) {
          m.currentOver--;
          m.currentBall = 5;
        } else {
          m.currentBall--;
        }
      }
      m.totalBalls = m.currentOver * 6 + m.currentBall;

      if (last.wicket) {
        m.totalWickets--;
        const bidx = m.batters.findIndex(b => b.name === last.batsmanName);
        if (bidx >= 0) {
          m.batters = prev.batters.map(b => ({ ...b }));
          m.batters[bidx].isOut = false;
          m.batters[bidx].dismissal = "";
        }
      }

      m.thisOver = m.thisOver.slice(0, -1);
      return m;
    });
  };

  const getRunRate = () => {
    if (!match || match.totalBalls === 0) return "0.00";
    return ((match.totalRuns / match.totalBalls) * 6).toFixed(2);
  };

  const getRequiredRate = () => {
    if (!match || !match.target || match.innings !== 2) return null;
    const remaining = match.target - match.totalRuns;
    const ballsLeft = (match.maxOvers * 6) - match.totalBalls;
    if (ballsLeft <= 0) return null;
    return ((remaining / ballsLeft) * 6).toFixed(2);
  };

  const getOversDisplay = () => {
    if (!match) return "0.0";
    return `${match.currentOver}.${match.currentBall}`;
  };

  const getResult = () => {
    if (!match || !match.isComplete) return "";
    if (match.target === null || match.firstInningsTotal === null) return "";
    if (match.totalRuns >= match.target) {
      const wicketsLeft = 10 - match.totalWickets;
      const battingTeamName = match.battingTeam === "team1" ? match.team1 : match.team2;
      return `${battingTeamName} won by ${wicketsLeft} wicket${wicketsLeft !== 1 ? "s" : ""}`;
    }
    const margin = match.firstInningsTotal - match.totalRuns;
    const bowlingTeamName = match.battingTeam === "team1" ? match.team2 : match.team1;
    return `${bowlingTeamName} won by ${margin} run${margin !== 1 ? "s" : ""}`;
  };

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/streaming" className="text-slate-400 hover:text-white text-sm">&larr; Streaming</Link>
            <h1 className="text-2xl font-bold">Live Scoring</h1>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold">New Match Setup</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Team 1 *</label>
                <input type="text" value={setupForm.team1} onChange={e => setSetupForm(f => ({ ...f, team1: e.target.value }))} placeholder="e.g. Lions" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Team 2 *</label>
                <input type="text" value={setupForm.team2} onChange={e => setSetupForm(f => ({ ...f, team2: e.target.value }))} placeholder="e.g. Tigers" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Overs</label>
              <div className="flex gap-2">
                {[5, 10, 20, 50].map(o => (
                  <button key={o} onClick={() => setSetupForm(f => ({ ...f, maxOvers: o }))} className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${setupForm.maxOvers === o ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-slate-700 text-slate-400 hover:border-slate-600"}`}>
                    T{o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Toss Won By</label>
              <div className="flex gap-2">
                <button onClick={() => setSetupForm(f => ({ ...f, tossWinner: "team1" }))} className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${setupForm.tossWinner === "team1" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-slate-700 text-slate-400"}`}>
                  {setupForm.team1 || "Team 1"}
                </button>
                <button onClick={() => setSetupForm(f => ({ ...f, tossWinner: "team2" }))} className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${setupForm.tossWinner === "team2" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-slate-700 text-slate-400"}`}>
                  {setupForm.team2 || "Team 2"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Chose to</label>
              <div className="flex gap-2">
                <button onClick={() => setSetupForm(f => ({ ...f, tossDecision: "bat" }))} className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${setupForm.tossDecision === "bat" ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-slate-700 text-slate-400"}`}>
                  Bat
                </button>
                <button onClick={() => setSetupForm(f => ({ ...f, tossDecision: "bowl" }))} className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${setupForm.tossDecision === "bowl" ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-slate-700 text-slate-400"}`}>
                  Bowl
                </button>
              </div>
            </div>
            <button onClick={startMatch} disabled={!setupForm.team1.trim() || !setupForm.team2.trim()} className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold text-sm transition-colors">
              Start Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!match) return null;

  const battingTeamName = match.battingTeam === "team1" ? match.team1 : match.team2;
  const bowlingTeamName = match.battingTeam === "team1" ? match.team2 : match.team1;
  const activeBatters = match.batters.filter(b => !b.isOut);
  const reqRate = getRequiredRate();

  if (match.isComplete) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Match Complete</h1>
            <p className="text-xl text-emerald-400 font-semibold mb-6">{getResult()}</p>

            {match.firstInningsTotal !== null && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">1st Innings</p>
                  <p className="text-2xl font-bold text-white">{match.firstInningsTotal}/{10}</p>
                  <p className="text-xs text-slate-400">{match.maxOvers} overs</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">2nd Innings</p>
                  <p className="text-2xl font-bold text-white">{match.totalRuns}/{match.totalWickets}</p>
                  <p className="text-xs text-slate-400">{getOversDisplay()} overs</p>
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-slate-400 mb-3">Scorecard</h3>
            <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-700">
                    <th className="text-left py-1">Batter</th>
                    <th className="text-right">R</th>
                    <th className="text-right">B</th>
                    <th className="text-right">4s</th>
                    <th className="text-right">6s</th>
                    <th className="text-right">SR</th>
                  </tr>
                </thead>
                <tbody>
                  {match.batters.map(b => (
                    <tr key={b.name} className="border-b border-slate-800">
                      <td className="py-1.5 text-left">
                        <span className="text-white">{b.name}</span>
                        {b.isOut && <span className="text-red-400 text-[10px] ml-1">({b.dismissal})</span>}
                        {!b.isOut && <span className="text-emerald-400 text-[10px] ml-1">*</span>}
                      </td>
                      <td className="text-right text-white font-medium">{b.runs}</td>
                      <td className="text-right text-slate-400">{b.balls}</td>
                      <td className="text-right text-slate-400">{b.fours}</td>
                      <td className="text-right text-slate-400">{b.sixes}</td>
                      <td className="text-right text-slate-400">{b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-700">
                    <th className="text-left py-1">Bowler</th>
                    <th className="text-right">O</th>
                    <th className="text-right">R</th>
                    <th className="text-right">W</th>
                    <th className="text-right">Econ</th>
                  </tr>
                </thead>
                <tbody>
                  {match.bowlers.map(b => (
                    <tr key={b.name} className="border-b border-slate-800">
                      <td className="py-1.5 text-left text-white">{b.name}</td>
                      <td className="text-right text-slate-400">{b.overs}.{b.balls}</td>
                      <td className="text-right text-slate-400">{b.runs}</td>
                      <td className="text-right text-emerald-400 font-medium">{b.wickets}</td>
                      <td className="text-right text-slate-400">{(b.overs * 6 + b.balls) > 0 ? (b.runs / ((b.overs * 6 + b.balls) / 6)).toFixed(1) : "0.0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 justify-center">
              <Link href="/streaming" className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition-colors">Back to Streaming</Link>
              <button onClick={() => { setMatch(null); setPhase("setup"); }} className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">New Match</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse">LIVE</span>
              <span className="text-xs text-slate-400">Innings {match.innings} &middot; {battingTeamName} batting</span>
              {match.innings === 2 && match.target && (
                <span className="text-xs text-amber-400">Target: {match.target}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={undoLastBall} disabled={match.ballLog.length === 0} className="text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 transition-colors">Undo</button>
              <Link href="/streaming" className="text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-400 hover:text-white transition-colors">Exit</Link>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <p className="text-4xl font-bold text-white">{match.totalRuns}<span className="text-2xl text-slate-400">/{match.totalWickets}</span></p>
              <p className="text-sm text-slate-400 mt-1">Overs: {getOversDisplay()}/{match.maxOvers}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">CRR</p>
              <p className="text-lg font-bold text-emerald-400">{getRunRate()}</p>
            </div>
            {reqRate && (
              <div className="text-center">
                <p className="text-xs text-slate-500">RRR</p>
                <p className={`text-lg font-bold ${parseFloat(reqRate) > parseFloat(getRunRate()) ? "text-red-400" : "text-emerald-400"}`}>{reqRate}</p>
              </div>
            )}
          </div>

          {match.innings === 2 && match.target && (
            <div className="mt-2">
              <p className="text-xs text-slate-400">
                Need <span className="text-white font-medium">{match.target - match.totalRuns}</span> from <span className="text-white font-medium">{(match.maxOvers * 6) - match.totalBalls}</span> balls
              </p>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-500">This Over:</span>
            <div className="flex gap-1">
              {match.thisOver.map((r, i) => (
                <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium ${r === 0 ? "bg-slate-700 text-slate-400" : r === 4 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : r === 6 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-700 text-white"}`}>
                  {match.ballLog[match.ballLog.length - match.thisOver.length + i]?.description || r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Batters</h3>
              </div>
              <div className="space-y-2">
                {activeBatters.slice(0, 2).map(b => (
                  <div key={b.name} className={`flex items-center justify-between p-2 rounded-lg ${b.name === match.striker ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-900/30"}`}>
                    <div className="flex items-center gap-2">
                      {b.name === match.striker && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      <span className="text-sm text-white">{b.name}</span>
                      {b.name === match.striker && <span className="text-[10px] text-emerald-400">*</span>}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-white font-bold">{b.runs}</span>
                      <span className="text-slate-500">({b.balls})</span>
                      <span className="text-blue-400">{b.fours}x4</span>
                      <span className="text-emerald-400">{b.sixes}x6</span>
                      <span className="text-slate-400">{b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(0) : "0"}</span>
                    </div>
                  </div>
                ))}
              </div>
              {match.currentBowler && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Bowling:</span>
                      <span className="text-sm text-white">{match.currentBowler}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      {(() => {
                        const b = match.bowlers.find(b => b.name === match.currentBowler);
                        if (!b) return null;
                        return (
                          <>
                            <span className="text-slate-400">{b.overs}.{b.balls}-{b.maidens}-{b.runs}-{b.wickets}</span>
                          </>
                        );
                      })()}
                      <button onClick={() => setShowNewBowler(true)} className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-400 hover:text-white transition-colors">Change</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">Score Input</h3>

              {selectedExtra && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">{selectedExtra}</span>
                  <span className="text-xs text-slate-400">+ select runs</span>
                  <button onClick={() => setSelectedExtra(null)} className="text-xs text-slate-500 hover:text-white ml-auto">&times; Cancel</button>
                </div>
              )}

              <div className="grid grid-cols-7 gap-2 mb-3">
                {[0, 1, 2, 3, 4, 5, 6].map(r => (
                  <button key={r} onClick={() => addRuns(r)} className={`py-3 rounded-xl text-lg font-bold transition-all active:scale-95 ${r === 4 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30" : r === 6 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30" : r === 0 ? "bg-slate-700/50 text-slate-400 hover:bg-slate-700" : "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700"}`}>
                    {r}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-2">
                <button onClick={() => setSelectedExtra(selectedExtra === "wide" ? null : "wide")} className={`py-2.5 rounded-xl text-xs font-medium transition-all ${selectedExtra === "wide" ? "bg-amber-500/20 text-amber-400 border border-amber-500" : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"}`}>
                  Wide
                </button>
                <button onClick={() => setSelectedExtra(selectedExtra === "no-ball" ? null : "no-ball")} className={`py-2.5 rounded-xl text-xs font-medium transition-all ${selectedExtra === "no-ball" ? "bg-amber-500/20 text-amber-400 border border-amber-500" : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"}`}>
                  No Ball
                </button>
                <button onClick={() => setSelectedExtra(selectedExtra === "bye" ? null : "bye")} className={`py-2.5 rounded-xl text-xs font-medium transition-all ${selectedExtra === "bye" ? "bg-amber-500/20 text-amber-400 border border-amber-500" : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"}`}>
                  Bye
                </button>
                <button onClick={() => setSelectedExtra(selectedExtra === "leg-bye" ? null : "leg-bye")} className={`py-2.5 rounded-xl text-xs font-medium transition-all ${selectedExtra === "leg-bye" ? "bg-amber-500/20 text-amber-400 border border-amber-500" : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"}`}>
                  Leg Bye
                </button>
                <button onClick={() => { setPendingRuns(0); setShowWicketModal(true); }} className="py-2.5 rounded-xl text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">
                  Wicket
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={() => { const temp = match.striker; setMatch(prev => prev ? { ...prev, striker: prev.nonStriker, nonStriker: temp } : prev); }} className="flex-1 py-2 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors">
                  Swap Batsmen
                </button>
                <button onClick={() => setShowNewBowler(true)} className="flex-1 py-2 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors">
                  Change Bowler
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-2">Ball-by-Ball</h3>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {[...match.ballLog].reverse().map(b => (
                  <div key={b.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">{b.over}.{b.ball + 1}</span>
                    <span className="text-slate-400">{b.batsmanName}</span>
                    <span className={`font-medium ${b.wicket ? "text-red-400" : b.runs >= 4 ? "text-emerald-400" : "text-white"}`}>{b.description}</span>
                  </div>
                ))}
                {match.ballLog.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No balls bowled yet</p>}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-2">Bowling</h3>
              <div className="space-y-1.5">
                {match.bowlers.map(b => (
                  <div key={b.name} className={`flex items-center justify-between text-xs py-1 ${b.name === match.currentBowler ? "text-emerald-400" : "text-slate-400"}`}>
                    <span className="w-24 truncate">{b.name}</span>
                    <span>{b.overs}.{b.balls}</span>
                    <span>{b.runs}</span>
                    <span className="font-medium">{b.wickets}</span>
                    <span>{(b.overs * 6 + b.balls) > 0 ? (b.runs / ((b.overs * 6 + b.balls) / 6)).toFixed(1) : "-"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-2">Batting</h3>
              <div className="space-y-1.5">
                {match.batters.map(b => (
                  <div key={b.name} className={`flex items-center justify-between text-xs py-1 ${b.isOut ? "text-slate-600 line-through" : b.name === match.striker ? "text-emerald-400" : "text-slate-400"}`}>
                    <span className="w-24 truncate">{b.name}{b.name === match.striker ? "*" : ""}</span>
                    <span className="font-medium">{b.runs}</span>
                    <span>({b.balls})</span>
                    <span>{b.fours}x4</span>
                    <span>{b.sixes}x6</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showWicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowWicketModal(false)}>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6 mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">How Out?</h2>
            <div className="grid grid-cols-2 gap-2">
              {(["bowled", "caught", "lbw", "run-out", "stumped", "hit-wicket"] as Wicket[]).map(w => (
                <button key={w} onClick={() => addWicket(w)} className="py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors capitalize">
                  {w?.replace("-", " ")}
                </button>
              ))}
            </div>
            <button onClick={() => setShowWicketModal(false)} className="w-full mt-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {showNewBatter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6 mx-4">
            <h2 className="text-lg font-bold text-white mb-4">New Batter</h2>
            <input type="text" value={newBatterName} onChange={e => setNewBatterName(e.target.value)} placeholder="Batter name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-3" autoFocus onKeyDown={e => e.key === "Enter" && addNewBatter()} />
            <div className="flex flex-wrap gap-1 mb-3 max-h-24 overflow-y-auto">
              {(match.battingTeam === "team1" ? SAMPLE_PLAYERS_A : SAMPLE_PLAYERS_B).filter(p => !match.batters.some(b => b.name === p)).map(p => (
                <button key={p} onClick={() => setNewBatterName(p)} className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${newBatterName === p ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-slate-700 text-slate-400 hover:border-slate-600"}`}>{p}</button>
              ))}
            </div>
            <button onClick={addNewBatter} disabled={!newBatterName.trim()} className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold text-sm transition-colors">
              Add Batter
            </button>
          </div>
        </div>
      )}

      {showNewBowler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6 mx-4">
            <h2 className="text-lg font-bold text-white mb-4">{match.currentBowler ? "Change Bowler" : "Select Opening Bowler"}</h2>
            <input type="text" value={newBowlerName} onChange={e => setNewBowlerName(e.target.value)} placeholder="Bowler name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-3" autoFocus onKeyDown={e => e.key === "Enter" && addNewBowler()} />
            <div className="flex flex-wrap gap-1 mb-3 max-h-24 overflow-y-auto">
              {(match.battingTeam === "team1" ? SAMPLE_PLAYERS_B : SAMPLE_PLAYERS_A).map(p => (
                <button key={p} onClick={() => setNewBowlerName(p)} className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${newBowlerName === p ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-slate-700 text-slate-400 hover:border-slate-600"}`}>{p}</button>
              ))}
            </div>
            {match.bowlers.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-slate-500 mb-1">Previous bowlers:</p>
                <div className="flex flex-wrap gap-1">
                  {match.bowlers.filter(b => b.name !== match.currentBowler).map(b => (
                    <button key={b.name} onClick={() => setNewBowlerName(b.name)} className="text-[10px] px-2 py-1 rounded-full border border-slate-600 text-slate-300 hover:border-emerald-500 transition-colors">{b.name} ({b.overs}.{b.balls})</button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={addNewBowler} disabled={!newBowlerName.trim()} className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold text-sm transition-colors">
              {match.currentBowler ? "Change Bowler" : "Start Bowling"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
