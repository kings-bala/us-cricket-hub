"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type StreamingTab = "streams" | "scoring";

interface Stream {
  id: string;
  title: string;
  streamerName: string;
  platform: "youtube" | "twitch";
  embedUrl: string;
  isLive: boolean;
  viewerCount: number;
  matchInfo: { teams: string; score: string; overs: string };
  scheduledAt?: string;
}

const MOCK_STREAMS: Stream[] = [
  { id: "s1", title: "RSCL T20 Final - Lions vs Tigers", streamerName: "CricVerse Official", platform: "youtube", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", isLive: true, viewerCount: 1243, matchInfo: { teams: "Lions vs Tigers", score: "156/4", overs: "16.2" } },
  { id: "s2", title: "Academy Practice Match - Under 19", streamerName: "Rising Star Academy", platform: "youtube", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", isLive: true, viewerCount: 87, matchInfo: { teams: "Academy XI vs Colts XI", score: "92/3", overs: "12.0" } },
  { id: "s3", title: "Regional T20 Cup - Semi Final 1", streamerName: "CricStream", platform: "twitch", embedUrl: "https://player.twitch.tv/?channel=example&parent=localhost", isLive: false, viewerCount: 0, matchInfo: { teams: "Eagles vs Hawks", score: "-", overs: "-" }, scheduledAt: "2026-02-25T14:00:00Z" },
  { id: "s4", title: "Women's Premier League - Match 5", streamerName: "WPL Official", platform: "youtube", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", isLive: false, viewerCount: 0, matchInfo: { teams: "Storm vs Blaze", score: "-", overs: "-" }, scheduledAt: "2026-02-26T10:00:00Z" },
  { id: "s5", title: "Club Championship - Day 2", streamerName: "LocalCricket TV", platform: "youtube", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", isLive: false, viewerCount: 0, matchInfo: { teams: "Metro CC vs Valley CC", score: "-", overs: "-" }, scheduledAt: "2026-03-01T09:00:00Z" },
];

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
  team1Players: string[];
  team2Players: string[];
}

export default function StreamingPage() {
  const { user } = useAuth();
  const isStreamer = user?.role === "academy_admin" || user?.role === "coach" || user?.role === "admin";

  const [activeTab, setActiveTab] = useState<StreamingTab>("streams");

  const [selectedStream, setSelectedStream] = useState<Stream | null>(MOCK_STREAMS.find(s => s.isLive) || null);
  const [chatMessages, setChatMessages] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: "m1", user: "CricFan22", text: "What a shot!", time: "16:20" },
    { id: "m2", user: "BowlerKing", text: "Great yorker delivery", time: "16:21" },
    { id: "m3", user: "Arjun_P", text: "Lions looking strong today", time: "16:22" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all");
  const [showGoLive, setShowGoLive] = useState(false);
  const [goLiveForm, setGoLiveForm] = useState({ title: "", team1: "", team2: "", platform: "youtube" as "youtube" | "twitch", streamUrl: "" });
  const [userStreams, setUserStreams] = useState<Stream[]>([]);
  const [myLiveStream, setMyLiveStream] = useState<Stream | null>(null);

  const allStreams = [...userStreams, ...MOCK_STREAMS];
  const liveStreams = allStreams.filter(s => s.isLive);
  const upcomingStreams = allStreams.filter(s => !s.isLive && s.scheduledAt);
  const filteredStreams = filter === "live" ? liveStreams : filter === "upcoming" ? upcomingStreams : allStreams;

  const startStream = () => {
    if (!goLiveForm.title.trim() || !goLiveForm.team1.trim() || !goLiveForm.team2.trim()) return;
    const embedUrl = goLiveForm.streamUrl.trim()
      ? goLiveForm.streamUrl.includes("youtube.com/watch?v=")
        ? goLiveForm.streamUrl.replace("watch?v=", "embed/")
        : goLiveForm.streamUrl.includes("youtu.be/")
          ? `https://www.youtube.com/embed/${goLiveForm.streamUrl.split("youtu.be/")[1]}`
          : goLiveForm.streamUrl
      : "https://www.youtube.com/embed/dQw4w9WgXcQ";
    const newStream: Stream = {
      id: `user-${Date.now()}`,
      title: goLiveForm.title.trim(),
      streamerName: user?.name || "You",
      platform: goLiveForm.platform,
      embedUrl,
      isLive: true,
      viewerCount: Math.floor(Math.random() * 50) + 5,
      matchInfo: { teams: `${goLiveForm.team1.trim()} vs ${goLiveForm.team2.trim()}`, score: "0/0", overs: "0.0" },
    };
    setUserStreams(prev => [newStream, ...prev]);
    setMyLiveStream(newStream);
    setSelectedStream(newStream);
    setShowGoLive(false);
    setGoLiveForm({ title: "", team1: "", team2: "", platform: "youtube", streamUrl: "" });
  };

  const stopStream = () => {
    if (!myLiveStream) return;
    setUserStreams(prev => prev.filter(s => s.id !== myLiveStream.id));
    setMyLiveStream(null);
    const fallback = MOCK_STREAMS.find(s => s.isLive) || null;
    setSelectedStream(fallback);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const msg = { id: `m${Date.now()}`, user: user?.name?.split(" ")[0] || "You", text: chatInput.trim(), time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) };
    setChatMessages(prev => [...prev, msg]);
    setChatInput("");
  };

  const [scoringPhase, setScoringPhase] = useState<"setup" | "scoring" | "complete">("setup");
  const [setupForm, setSetupForm] = useState({ team1: "", team2: "", maxOvers: 20, tossWinner: "team1" as "team1" | "team2", tossDecision: "bat" as "bat" | "bowl" });
  const [customOvers, setCustomOvers] = useState("");

  const [team1Players, setTeam1Players] = useState<string[]>([]);
  const [team2Players, setTeam2Players] = useState<string[]>([]);
  const [newPlayerInput, setNewPlayerInput] = useState("");
  const [addingPlayerFor, setAddingPlayerFor] = useState<"team1" | "team2" | null>(null);
  const [editingPlayerIdx, setEditingPlayerIdx] = useState<{ team: "team1" | "team2"; idx: number } | null>(null);
  const [editPlayerValue, setEditPlayerValue] = useState("");

  const [match, setMatch] = useState<MatchState | null>(null);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showNewBatter, setShowNewBatter] = useState(false);
  const [showNewBowler, setShowNewBowler] = useState(false);
  const [pendingRuns, setPendingRuns] = useState(0);
  const [selectedExtra, setSelectedExtra] = useState<Extra>(null);
  const [newBatterName, setNewBatterName] = useState("");
  const [newBowlerName, setNewBowlerName] = useState("");
  const [showEditOvers, setShowEditOvers] = useState(false);
  const [editOversValue, setEditOversValue] = useState("");

  const addPlayer = (team: "team1" | "team2") => {
    if (!newPlayerInput.trim()) return;
    if (team === "team1") {
      setTeam1Players(prev => [...prev, newPlayerInput.trim()]);
    } else {
      setTeam2Players(prev => [...prev, newPlayerInput.trim()]);
    }
    setNewPlayerInput("");
    setAddingPlayerFor(null);
  };

  const removePlayer = (team: "team1" | "team2", idx: number) => {
    if (team === "team1") {
      setTeam1Players(prev => prev.filter((_, i) => i !== idx));
    } else {
      setTeam2Players(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const saveEditPlayer = () => {
    if (!editingPlayerIdx || !editPlayerValue.trim()) return;
    const { team, idx } = editingPlayerIdx;
    if (team === "team1") {
      setTeam1Players(prev => prev.map((p, i) => i === idx ? editPlayerValue.trim() : p));
    } else {
      setTeam2Players(prev => prev.map((p, i) => i === idx ? editPlayerValue.trim() : p));
    }
    setEditingPlayerIdx(null);
    setEditPlayerValue("");
  };

  const startMatch = () => {
    if (!setupForm.team1.trim() || !setupForm.team2.trim()) return;
    if (team1Players.length < 2 || team2Players.length < 2) return;
    const battingFirst = setupForm.tossDecision === "bat" ? setupForm.tossWinner : (setupForm.tossWinner === "team1" ? "team2" : "team1");
    const battingPlayers = battingFirst === "team1" ? team1Players : team2Players;

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
      team1Players: [...team1Players],
      team2Players: [...team2Players],
    });
    setScoringPhase("scoring");
    setShowNewBowler(true);
  };

  const updateMaxOvers = () => {
    const val = parseInt(editOversValue);
    if (!match || isNaN(val) || val < 1 || val > 50) return;
    setMatch(prev => prev ? { ...prev, maxOvers: val } : prev);
    setShowEditOvers(false);
    setEditOversValue("");
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
      const batsmanRuns = (extra === "bye" || extra === "leg-bye") ? 0 : extra === "wide" ? 0 : extra === "no-ball" ? runs : runs;
      const addToTotal = extra === "wide" ? 1 + runs : extra === "no-ball" ? 1 + runs : runs;
      const totalBallRuns = addToTotal;

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
          const newBattingPlayers = m.battingTeam === "team1" ? m.team1Players : m.team2Players;
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

  const renderPlayerList = (team: "team1" | "team2", players: string[], teamName: string) => (
    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">{teamName || (team === "team1" ? "Team 1" : "Team 2")} Players</h3>
        <span className="text-[10px] text-slate-500">{players.length} player{players.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="space-y-1.5 mb-3">
        {players.map((p, i) => (
          <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-1.5 group">
            {editingPlayerIdx?.team === team && editingPlayerIdx.idx === i ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editPlayerValue}
                  onChange={e => setEditPlayerValue(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveEditPlayer(); if (e.key === "Escape") setEditingPlayerIdx(null); }}
                  className="flex-1 bg-slate-900 border border-emerald-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                  autoFocus
                />
                <button onClick={saveEditPlayer} className="text-emerald-400 text-[10px] hover:text-emerald-300">Save</button>
                <button onClick={() => setEditingPlayerIdx(null)} className="text-slate-500 text-[10px] hover:text-white">Cancel</button>
              </div>
            ) : (
              <>
                <span className="text-xs text-slate-300">{i + 1}. {p}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingPlayerIdx({ team, idx: i }); setEditPlayerValue(p); }} className="text-[10px] text-slate-500 hover:text-amber-400 px-1">Edit</button>
                  <button onClick={() => removePlayer(team, i)} className="text-[10px] text-slate-500 hover:text-red-400 px-1">&times;</button>
                </div>
              </>
            )}
          </div>
        ))}
        {players.length === 0 && <p className="text-xs text-slate-600 text-center py-2">No players added yet</p>}
      </div>
      {addingPlayerFor === team ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlayerInput}
            onChange={e => setNewPlayerInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addPlayer(team); if (e.key === "Escape") { setAddingPlayerFor(null); setNewPlayerInput(""); } }}
            placeholder="Player name"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            autoFocus
          />
          <button onClick={() => addPlayer(team)} disabled={!newPlayerInput.trim()} className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs transition-colors">Add</button>
          <button onClick={() => { setAddingPlayerFor(null); setNewPlayerInput(""); }} className="px-2 py-1.5 text-xs text-slate-500 hover:text-white">Cancel</button>
        </div>
      ) : (
        <button onClick={() => { setAddingPlayerFor(team); setNewPlayerInput(""); }} className="w-full py-1.5 rounded-lg border border-dashed border-slate-700 text-xs text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors">
          + Add Player
        </button>
      )}
    </div>
  );

  const renderScoringSetup = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">New Match Setup</h2>
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
              <button key={o} onClick={() => { setSetupForm(f => ({ ...f, maxOvers: o })); setCustomOvers(""); }} className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${setupForm.maxOvers === o && !customOvers ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-slate-700 text-slate-400 hover:border-slate-600"}`}>
                T{o}
              </button>
            ))}
            <div className="flex-1 relative">
              <input
                type="number"
                value={customOvers}
                onChange={e => {
                  setCustomOvers(e.target.value);
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1 && v <= 50) setSetupForm(f => ({ ...f, maxOvers: v }));
                }}
                placeholder="Custom"
                min={1}
                max={50}
                className={`w-full text-sm py-2 rounded-lg border text-center focus:outline-none ${customOvers ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-slate-700 text-slate-400 bg-transparent"} placeholder-slate-600`}
              />
            </div>
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

        <div className="grid grid-cols-2 gap-4">
          {renderPlayerList("team1", team1Players, setupForm.team1)}
          {renderPlayerList("team2", team2Players, setupForm.team2)}
        </div>

        <button
          onClick={startMatch}
          disabled={!setupForm.team1.trim() || !setupForm.team2.trim() || team1Players.length < 2 || team2Players.length < 2}
          className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold text-sm transition-colors"
        >
          {team1Players.length < 2 || team2Players.length < 2 ? `Add at least 2 players per team (${team1Players.length}/2, ${team2Players.length}/2)` : "Start Match"}
        </button>
      </div>
    </div>
  );

  const renderScoringComplete = () => {
    if (!match) return null;
    return (
      <div className="max-w-2xl mx-auto">
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
            <button onClick={() => { setMatch(null); setScoringPhase("setup"); }} className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">New Match</button>
          </div>
        </div>
      </div>
    );
  };

  const renderScoringLive = () => {
    if (!match) return null;
    const battingTeamName = match.battingTeam === "team1" ? match.team1 : match.team2;
    const activeBatters = match.batters.filter(b => !b.isOut);
    const reqRate = getRequiredRate();

    if (match.isComplete) {
      setScoringPhase("complete");
      return null;
    }

    return (
      <>
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
              <button onClick={() => { setEditOversValue(String(match.maxOvers)); setShowEditOvers(true); }} className="text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-400 hover:text-white transition-colors">
                Overs: {match.maxOvers}
              </button>
              <button onClick={undoLastBall} disabled={match.ballLog.length === 0} className="text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 transition-colors">Undo</button>
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
              <h3 className="text-sm font-semibold mb-3">Batters</h3>
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
                        const bwl = match.bowlers.find(bw => bw.name === match.currentBowler);
                        if (!bwl) return null;
                        return <span className="text-slate-400">{bwl.overs}.{bwl.balls}-{bwl.maidens}-{bwl.runs}-{bwl.wickets}</span>;
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
                {[...match.ballLog].reverse().map(bl => (
                  <div key={bl.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">{bl.over}.{bl.ball + 1}</span>
                    <span className="text-slate-400">{bl.batsmanName}</span>
                    <span className={`font-medium ${bl.wicket ? "text-red-400" : bl.runs >= 4 ? "text-emerald-400" : "text-white"}`}>{bl.description}</span>
                  </div>
                ))}
                {match.ballLog.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No balls bowled yet</p>}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-2">Bowling</h3>
              <div className="space-y-1.5">
                {match.bowlers.map(bw => (
                  <div key={bw.name} className={`flex items-center justify-between text-xs py-1 ${bw.name === match.currentBowler ? "text-emerald-400" : "text-slate-400"}`}>
                    <span className="w-24 truncate">{bw.name}</span>
                    <span>{bw.overs}.{bw.balls}</span>
                    <span>{bw.runs}</span>
                    <span className="font-medium">{bw.wickets}</span>
                    <span>{(bw.overs * 6 + bw.balls) > 0 ? (bw.runs / ((bw.overs * 6 + bw.balls) / 6)).toFixed(1) : "-"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-2">Batting</h3>
              <div className="space-y-1.5">
                {match.batters.map(bt => (
                  <div key={bt.name} className={`flex items-center justify-between text-xs py-1 ${bt.isOut ? "text-slate-600 line-through" : bt.name === match.striker ? "text-emerald-400" : "text-slate-400"}`}>
                    <span className="w-24 truncate">{bt.name}{bt.name === match.striker ? "*" : ""}</span>
                    <span className="font-medium">{bt.runs}</span>
                    <span>({bt.balls})</span>
                    <span>{bt.fours}x4</span>
                    <span>{bt.sixes}x6</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showEditOvers && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowEditOvers(false)}>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xs p-6 mx-4" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-bold text-white mb-4">Edit Overs</h2>
              <p className="text-xs text-slate-400 mb-3">Current: {match.maxOvers} overs</p>
              <input
                type="number"
                value={editOversValue}
                onChange={e => setEditOversValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && updateMaxOvers()}
                min={1}
                max={50}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={updateMaxOvers} className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors">Save</button>
                <button onClick={() => setShowEditOvers(false)} className="flex-1 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}

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
                {(match.battingTeam === "team1" ? match.team1Players : match.team2Players).filter(p => !match.batters.some(bt => bt.name === p)).map(p => (
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
                {(match.battingTeam === "team1" ? match.team2Players : match.team1Players).map(p => (
                  <button key={p} onClick={() => setNewBowlerName(p)} className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${newBowlerName === p ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-slate-700 text-slate-400 hover:border-slate-600"}`}>{p}</button>
                ))}
              </div>
              {match.bowlers.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] text-slate-500 mb-1">Previous bowlers:</p>
                  <div className="flex flex-wrap gap-1">
                    {match.bowlers.filter(bw => bw.name !== match.currentBowler).map(bw => (
                      <button key={bw.name} onClick={() => setNewBowlerName(bw.name)} className="text-[10px] px-2 py-1 rounded-full border border-slate-600 text-slate-300 hover:border-emerald-500 transition-colors">{bw.name} ({bw.overs}.{bw.balls})</button>
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
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">Streaming</h1>
              {activeTab === "streams" && liveStreams.length > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse">
                  {liveStreams.length} LIVE
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">
              {activeTab === "streams" ? "Watch live cricket matches and upcoming stream schedule" : "Score matches ball-by-ball with live tracking"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">&larr; Dashboard</Link>
            {activeTab === "streams" && isStreamer && !myLiveStream && (
              <button onClick={() => setShowGoLive(true)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Go Live
              </button>
            )}
            {activeTab === "streams" && myLiveStream && (
              <button onClick={stopStream} className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-red-400 font-medium transition-colors flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                End Stream
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("streams")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "streams" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white hover:border-slate-600"}`}
          >
            Watch Streams
          </button>
          {isStreamer && (
            <button
              onClick={() => setActiveTab("scoring")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "scoring" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white hover:border-slate-600"}`}
            >
              Live Scoring
              {match && scoringPhase === "scoring" && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          )}
        </div>

        {activeTab === "streams" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {selectedStream ? (
                <>
                  <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                    {selectedStream.isLive ? (
                      <iframe
                        src={selectedStream.embedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <div className="text-center">
                          <p className="text-slate-500 text-sm mb-2">Stream starts</p>
                          <p className="text-white font-semibold">{selectedStream.scheduledAt ? new Date(selectedStream.scheduledAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "TBD"}</p>
                        </div>
                      </div>
                    )}
                    {selectedStream.isLive && (
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                        </span>
                        <span className="text-xs bg-black/60 text-white px-2 py-0.5 rounded">{selectedStream.viewerCount.toLocaleString()} viewers</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-white">{selectedStream.title}</h2>
                        <p className="text-xs text-slate-400 mt-1">Streamed by {selectedStream.streamerName} on {selectedStream.platform === "youtube" ? "YouTube" : "Twitch"}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${selectedStream.platform === "youtube" ? "bg-red-500/20 text-red-400" : "bg-purple-500/20 text-purple-400"}`}>
                        {selectedStream.platform === "youtube" ? "YouTube" : "Twitch"}
                      </span>
                    </div>
                    {selectedStream.isLive && (
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-slate-500">Teams</p>
                          <p className="text-sm text-white font-medium mt-1">{selectedStream.matchInfo.teams}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-slate-500">Score</p>
                          <p className="text-sm text-emerald-400 font-bold mt-1">{selectedStream.matchInfo.score}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-slate-500">Overs</p>
                          <p className="text-sm text-white font-medium mt-1">{selectedStream.matchInfo.overs}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-16 text-center">
                  <p className="text-slate-500">Select a stream to watch</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {selectedStream?.isLive && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col" style={{ height: "360px" }}>
                  <div className="p-3 border-b border-slate-700/50">
                    <h3 className="text-sm font-semibold text-white">Live Chat</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className="text-xs">
                        <span className="text-slate-500">{msg.time}</span>{" "}
                        <span className="text-emerald-400 font-medium">{msg.user}:</span>{" "}
                        <span className="text-slate-300">{msg.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-700/50">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendChat()}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button onClick={sendChat} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg transition-colors">Send</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Streams</h3>
                  <div className="flex gap-1">
                    {(["all", "live", "upcoming"] as const).map(f => (
                      <button key={f} onClick={() => setFilter(f)} className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${filter === f ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-500 hover:text-white"}`}>{f === "all" ? "All" : f === "live" ? "Live" : "Upcoming"}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {filteredStreams.map(stream => (
                    <button
                      key={stream.id}
                      onClick={() => setSelectedStream(stream)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${selectedStream?.id === stream.id ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-700/30 hover:border-slate-600"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {stream.isLive ? (
                          <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-semibold">LIVE</span>
                        ) : (
                          <span className="text-[9px] bg-slate-700/50 text-slate-500 px-1.5 py-0.5 rounded">UPCOMING</span>
                        )}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${stream.platform === "youtube" ? "bg-red-500/10 text-red-400" : "bg-purple-500/10 text-purple-400"}`}>
                          {stream.platform === "youtube" ? "YT" : "TTV"}
                        </span>
                      </div>
                      <p className="text-xs text-white font-medium truncate">{stream.title}</p>
                      <p className="text-[10px] text-slate-500">{stream.streamerName}</p>
                      {stream.isLive ? (
                        <p className="text-[10px] text-emerald-400 mt-1">{stream.matchInfo.score} ({stream.matchInfo.overs} ov) &middot; {stream.viewerCount} watching</p>
                      ) : stream.scheduledAt ? (
                        <p className="text-[10px] text-slate-500 mt-1">{new Date(stream.scheduledAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "scoring" && (
          <div>
            {scoringPhase === "setup" && renderScoringSetup()}
            {scoringPhase === "scoring" && renderScoringLive()}
            {scoringPhase === "complete" && renderScoringComplete()}
          </div>
        )}
      </div>

      {showGoLive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowGoLive(false)}>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                Go Live
              </h2>
              <button onClick={() => setShowGoLive(false)} className="text-slate-400 hover:text-white text-xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Stream Title *</label>
                <input
                  type="text"
                  value={goLiveForm.title}
                  onChange={e => setGoLiveForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. RSCL T20 Match - Day 3"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Team 1 *</label>
                  <input
                    type="text"
                    value={goLiveForm.team1}
                    onChange={e => setGoLiveForm(f => ({ ...f, team1: e.target.value }))}
                    placeholder="e.g. Lions"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Team 2 *</label>
                  <input
                    type="text"
                    value={goLiveForm.team2}
                    onChange={e => setGoLiveForm(f => ({ ...f, team2: e.target.value }))}
                    placeholder="e.g. Tigers"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Platform</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGoLiveForm(f => ({ ...f, platform: "youtube" }))}
                    className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${
                      goLiveForm.platform === "youtube" ? "border-red-500 bg-red-500/10 text-red-400" : "border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    YouTube
                  </button>
                  <button
                    onClick={() => setGoLiveForm(f => ({ ...f, platform: "twitch" }))}
                    className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${
                      goLiveForm.platform === "twitch" ? "border-purple-500 bg-purple-500/10 text-purple-400" : "border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    Twitch
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Stream URL (optional)</label>
                <input
                  type="text"
                  value={goLiveForm.streamUrl}
                  onChange={e => setGoLiveForm(f => ({ ...f, streamUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=... or leave blank for demo"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={startStream}
                disabled={!goLiveForm.title.trim() || !goLiveForm.team1.trim() || !goLiveForm.team2.trim()}
                className="w-full py-2.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Start Streaming
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
