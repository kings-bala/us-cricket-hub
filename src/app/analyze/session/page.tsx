"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { getItem, setItem } from "@/lib/storage";

type DeliveryType = "pace" | "inswing" | "outswing" | "offspin" | "legspin" | "yorker" | "bouncer" | "slower";
type ShotResult = "dot" | "1" | "2" | "3" | "4" | "6" | "wicket" | "wide" | "noball";

interface Delivery {
  id: string;
  speed: number;
  type: DeliveryType;
  pitchX: number;
  pitchY: number;
  wagonX: number;
  wagonY: number;
  result: ShotResult;
  timestamp: string;
}

interface NetSession {
  id: string;
  date: string;
  deliveries: Delivery[];
}

const DELIVERY_TYPES: { value: DeliveryType; label: string; color: string }[] = [
  { value: "pace", label: "Pace", color: "bg-red-500" },
  { value: "inswing", label: "Inswing", color: "bg-orange-500" },
  { value: "outswing", label: "Outswing", color: "bg-amber-500" },
  { value: "offspin", label: "Off Spin", color: "bg-blue-500" },
  { value: "legspin", label: "Leg Spin", color: "bg-purple-500" },
  { value: "yorker", label: "Yorker", color: "bg-pink-500" },
  { value: "bouncer", label: "Bouncer", color: "bg-rose-500" },
  { value: "slower", label: "Slower Ball", color: "bg-teal-500" },
];

const RESULTS: { value: ShotResult; label: string; color: string }[] = [
  { value: "dot", label: "Dot", color: "bg-slate-500" },
  { value: "1", label: "1", color: "bg-blue-500" },
  { value: "2", label: "2", color: "bg-cyan-500" },
  { value: "3", label: "3", color: "bg-emerald-500" },
  { value: "4", label: "4", color: "bg-amber-500" },
  { value: "6", label: "6", color: "bg-red-500" },
  { value: "wicket", label: "W", color: "bg-red-600" },
  { value: "wide", label: "Wd", color: "bg-purple-500" },
  { value: "noball", label: "Nb", color: "bg-pink-500" },
];

function getSessions(): NetSession[] {
  return getItem<NetSession[]>("net_sessions", []);
}

function saveSession(session: NetSession) {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  setItem("net_sessions", sessions);
}

export default function NetSessionTracker() {
  const [session, setSession] = useState<NetSession>(() => ({
    id: `ns_${Date.now()}`,
    date: new Date().toISOString(),
    deliveries: [],
  }));

  const [speed, setSpeed] = useState(130);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("pace");
  const [result, setResult] = useState<ShotResult>("dot");
  const [pitchSpot, setPitchSpot] = useState<{ x: number; y: number } | null>(null);
  const [wagonSpot, setWagonSpot] = useState<{ x: number; y: number } | null>(null);
  const [activeMap, setActiveMap] = useState<"pitch" | "wagon">("pitch");
  const [pastSessions, setPastSessions] = useState<NetSession[]>(() => getSessions());
  const [viewingSession, setViewingSession] = useState<NetSession | null>(null);

  const pitchRef = useRef<SVGSVGElement>(null);
  const wagonRef = useRef<SVGSVGElement>(null);

  const handleMapClick = useCallback((e: React.MouseEvent<SVGSVGElement>, map: "pitch" | "wagon") => {
    const svg = map === "pitch" ? pitchRef.current : wagonRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (map === "pitch") setPitchSpot({ x, y });
    else setWagonSpot({ x, y });
  }, []);

  const addDelivery = useCallback(() => {
    if (!pitchSpot) return;
    const delivery: Delivery = {
      id: `d_${Date.now()}`,
      speed,
      type: deliveryType,
      pitchX: pitchSpot.x,
      pitchY: pitchSpot.y,
      wagonX: wagonSpot?.x ?? 50,
      wagonY: wagonSpot?.y ?? 50,
      result,
      timestamp: new Date().toISOString(),
    };
    const updated = { ...session, deliveries: [...session.deliveries, delivery] };
    setSession(updated);
    saveSession(updated);
    setPitchSpot(null);
    setWagonSpot(null);
  }, [pitchSpot, wagonSpot, speed, deliveryType, result, session]);

  const endSession = useCallback(() => {
    if (session.deliveries.length === 0) return;
    saveSession(session);
    setPastSessions(getSessions());
    setSession({ id: `ns_${Date.now()}`, date: new Date().toISOString(), deliveries: [] });
    setPitchSpot(null);
    setWagonSpot(null);
  }, [session]);

  const removeLastDelivery = useCallback(() => {
    if (session.deliveries.length === 0) return;
    const updated = { ...session, deliveries: session.deliveries.slice(0, -1) };
    setSession(updated);
    saveSession(updated);
  }, [session]);

  const displaySession = viewingSession ?? session;
  const deliveries = displaySession.deliveries;

  const avgSpeed = deliveries.length > 0 ? Math.round(deliveries.reduce((s, d) => s + d.speed, 0) / deliveries.length) : 0;
  const maxSpeed = deliveries.length > 0 ? Math.max(...deliveries.map((d) => d.speed)) : 0;
  const minSpeed = deliveries.length > 0 ? Math.min(...deliveries.map((d) => d.speed)) : 0;
  const totalRuns = deliveries.reduce((s, d) => {
    if (d.result === "dot" || d.result === "wicket") return s;
    if (d.result === "wide" || d.result === "noball") return s + 1;
    return s + parseInt(d.result);
  }, 0);
  const wickets = deliveries.filter((d) => d.result === "wicket").length;
  const dots = deliveries.filter((d) => d.result === "dot").length;
  const boundaries = deliveries.filter((d) => d.result === "4" || d.result === "6").length;

  const typeBreakdown = DELIVERY_TYPES.map((t) => ({
    ...t,
    count: deliveries.filter((d) => d.type === t.value).length,
  })).filter((t) => t.count > 0);

  const getDeliveryColor = (d: Delivery) => {
    const found = DELIVERY_TYPES.find((t) => t.value === d.type);
    return found?.color ?? "bg-slate-500";
  };

  const getResultColor = (r: ShotResult) => {
    const found = RESULTS.find((res) => res.value === r);
    return found?.color ?? "bg-slate-500";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3 flex items-center gap-4">
        <Link href="/analyze" className="text-sm text-slate-400 hover:text-white">&larr; Full Track AI</Link>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Net Session Tracker</h1>
          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/30">Pocket Hawk-Eye</span>
        </div>
        <p className="text-slate-400">Track every delivery — speed, pitch map, wagon wheel, and session analytics.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {!viewingSession && (
            <>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Speed (km/h)</h2>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={40}
                    max={160}
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="flex-1 accent-emerald-500"
                  />
                  <input
                    type="number"
                    min={40}
                    max={160}
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-16 bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1 text-center text-white text-sm"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{Math.round(speed * 0.621371)} mph</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Delivery Type</h2>
                <div className="grid grid-cols-2 gap-2">
                  {DELIVERY_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setDeliveryType(t.value)}
                      className={`text-xs py-2 px-3 rounded-lg border font-medium transition-all ${
                        deliveryType === t.value
                          ? "border-emerald-500 bg-emerald-500/10 text-white"
                          : "border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Result</h2>
                <div className="flex flex-wrap gap-2">
                  {RESULTS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setResult(r.value)}
                      className={`text-xs py-1.5 px-3 rounded-lg border font-medium transition-all ${
                        result === r.value
                          ? "border-emerald-500 bg-emerald-500/10 text-white"
                          : "border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addDelivery}
                disabled={!pitchSpot}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  pitchSpot
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                {pitchSpot ? "Log Delivery" : "Tap pitch map first"}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={removeLastDelivery}
                  disabled={session.deliveries.length === 0}
                  className="flex-1 py-2 rounded-xl text-sm font-medium border border-slate-600 text-slate-300 hover:border-slate-500 transition-colors disabled:opacity-30"
                >
                  Undo Last
                </button>
                <button
                  onClick={endSession}
                  disabled={session.deliveries.length === 0}
                  className="flex-1 py-2 rounded-xl text-sm font-medium border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-30"
                >
                  End Session
                </button>
              </div>
            </>
          )}

          {viewingSession && (
            <button
              onClick={() => setViewingSession(null)}
              className="w-full py-3 rounded-xl font-semibold bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              Back to Current Session
            </button>
          )}

          {pastSessions.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Past Sessions</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pastSessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setViewingSession(s.id === viewingSession?.id ? null : s)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      viewingSession?.id === s.id
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <p className="text-sm text-white">{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    <p className="text-xs text-slate-500">{s.deliveries.length} deliveries</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setActiveMap("pitch")}
              className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                activeMap === "pitch" ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Pitch Map
            </button>
            <button
              onClick={() => setActiveMap("wagon")}
              className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                activeMap === "wagon" ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Wagon Wheel
            </button>
          </div>

          {activeMap === "pitch" && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-sm font-semibold text-white">Pitch Map</h3>
                <p className="text-xs text-slate-500">Tap where the ball pitched</p>
              </div>
              <div className="p-4 flex justify-center">
                <svg
                  ref={pitchRef}
                  viewBox="0 0 200 400"
                  className="w-full max-w-[240px] cursor-crosshair"
                  onClick={(e) => handleMapClick(e, "pitch")}
                >
                  <defs>
                    <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2d5016" />
                      <stop offset="100%" stopColor="#3d6b1e" />
                    </linearGradient>
                  </defs>
                  <rect x="10" y="10" width="180" height="380" rx="4" fill="url(#pitchGrad)" stroke="#4a7c26" strokeWidth="1" />
                  <rect x="70" y="15" width="60" height="370" fill="rgba(194,178,128,0.15)" rx="2" />
                  <line x1="10" y1="80" x2="190" y2="80" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
                  <text x="195" y="83" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="start">Short</text>
                  <line x1="10" y1="160" x2="190" y2="160" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
                  <text x="195" y="163" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="start">Good</text>
                  <line x1="10" y1="240" x2="190" y2="240" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
                  <text x="195" y="243" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="start">Full</text>
                  <line x1="10" y1="320" x2="190" y2="320" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
                  <text x="195" y="323" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="start">Yorker</text>
                  <rect x="85" y="355" width="30" height="5" fill="rgba(255,255,255,0.3)" rx="1" />
                  <rect x="85" y="20" width="30" height="5" fill="rgba(255,255,255,0.3)" rx="1" />
                  {deliveries.map((d, i) => (
                    <circle
                      key={i}
                      cx={(d.pitchX / 100) * 200}
                      cy={(d.pitchY / 100) * 400}
                      r="6"
                      fill={d.result === "wicket" ? "#ef4444" : d.result === "4" || d.result === "6" ? "#f59e0b" : "#3b82f6"}
                      stroke="white"
                      strokeWidth="1"
                      opacity="0.85"
                    />
                  ))}
                  {pitchSpot && (
                    <circle
                      cx={(pitchSpot.x / 100) * 200}
                      cy={(pitchSpot.y / 100) * 400}
                      r="8"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  )}
                </svg>
              </div>
            </div>
          )}

          {activeMap === "wagon" && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-sm font-semibold text-white">Wagon Wheel</h3>
                <p className="text-xs text-slate-500">Tap where the shot went</p>
              </div>
              <div className="p-4 flex justify-center">
                <svg
                  ref={wagonRef}
                  viewBox="0 0 400 400"
                  className="w-full max-w-[400px] cursor-crosshair"
                  onClick={(e) => handleMapClick(e, "wagon")}
                >
                  <circle cx="200" cy="200" r="190" fill="#1a3a1a" stroke="#2d5016" strokeWidth="1" />
                  <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <rect x="195" y="185" width="10" height="30" fill="rgba(194,178,128,0.3)" rx="1" />
                  <line x1="200" y1="10" x2="200" y2="390" stroke="rgba(255,255,255,0.06)" />
                  <line x1="10" y1="200" x2="390" y2="200" stroke="rgba(255,255,255,0.06)" />
                  <line x1="65" y1="65" x2="335" y2="335" stroke="rgba(255,255,255,0.06)" />
                  <line x1="335" y1="65" x2="65" y2="335" stroke="rgba(255,255,255,0.06)" />
                  <text x="200" y="25" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">Straight</text>
                  <text x="375" y="205" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="end">Point</text>
                  <text x="25" y="205" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="start">Mid-on</text>
                  <text x="200" y="395" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">Fine Leg</text>
                  {deliveries.map((d, i) => {
                    const dx = (d.wagonX / 100) * 400;
                    const dy = (d.wagonY / 100) * 400;
                    const isB = d.result === "4" || d.result === "6";
                    const isW = d.result === "wicket";
                    return (
                      <g key={i}>
                        <line x1="200" y1="200" x2={dx} y2={dy} stroke={isW ? "#ef4444" : isB ? "#f59e0b" : "#3b82f6"} strokeWidth="1.5" opacity="0.5" />
                        <circle cx={dx} cy={dy} r="5" fill={isW ? "#ef4444" : isB ? "#f59e0b" : "#3b82f6"} stroke="white" strokeWidth="1" opacity="0.85" />
                      </g>
                    );
                  })}
                  {wagonSpot && (
                    <circle
                      cx={(wagonSpot.x / 100) * 400}
                      cy={(wagonSpot.y / 100) * 400}
                      r="8"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  )}
                </svg>
              </div>
            </div>
          )}

          {deliveries.length > 0 && (
            <div className="grid sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{deliveries.length}</p>
                <p className="text-xs text-slate-500">Deliveries</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{avgSpeed}</p>
                <p className="text-xs text-slate-500">Avg Speed (km/h)</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-red-400">{maxSpeed}</p>
                <p className="text-xs text-slate-500">Top Speed (km/h)</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{minSpeed}</p>
                <p className="text-xs text-slate-500">Min Speed (km/h)</p>
              </div>
            </div>
          )}

          {deliveries.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Speed Chart</h3>
                <div className="flex items-end gap-1 h-32">
                  {deliveries.map((d, i) => {
                    const pct = maxSpeed > 0 ? ((d.speed - 30) / (maxSpeed - 30 + 10)) * 100 : 50;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] text-slate-500">{d.speed}</span>
                        <div
                          className={`w-full rounded-t ${d.speed >= 140 ? "bg-red-500" : d.speed >= 120 ? "bg-amber-500" : "bg-blue-500"}`}
                          style={{ height: `${Math.max(pct, 5)}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-slate-600">1</span>
                  <span className="text-[9px] text-slate-600">{deliveries.length}</span>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Session Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Runs Scored</span>
                    <span className="text-white font-medium">{totalRuns}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Wickets</span>
                    <span className="text-red-400 font-medium">{wickets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Dot Balls</span>
                    <span className="text-slate-300 font-medium">{dots}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Boundaries</span>
                    <span className="text-amber-400 font-medium">{boundaries}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Dot %</span>
                    <span className="text-slate-300 font-medium">{deliveries.length > 0 ? Math.round((dots / deliveries.length) * 100) : 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {typeBreakdown.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Delivery Breakdown</h3>
              <div className="flex flex-wrap gap-3">
                {typeBreakdown.map((t) => (
                  <div key={t.value} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${t.color}`} />
                    <span className="text-sm text-slate-300">{t.label}</span>
                    <span className="text-xs text-slate-500">({t.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deliveries.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Delivery Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-700/50">
                      <th className="py-2 text-left">#</th>
                      <th className="py-2 text-left">Type</th>
                      <th className="py-2 text-center">Speed</th>
                      <th className="py-2 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {deliveries.map((d, i) => (
                      <tr key={d.id} className="hover:bg-slate-700/20">
                        <td className="py-2 text-slate-400">{i + 1}</td>
                        <td className="py-2">
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${getDeliveryColor(d)}`} />
                            <span className="text-slate-300">{DELIVERY_TYPES.find((t) => t.value === d.type)?.label}</span>
                          </span>
                        </td>
                        <td className="py-2 text-center text-white font-medium">{d.speed} km/h</td>
                        <td className="py-2 text-center">
                          <span className={`inline-block w-6 h-6 rounded-full text-white text-xs font-bold leading-6 ${getResultColor(d.result)}`}>
                            {RESULTS.find((r) => r.value === d.result)?.label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {deliveries.length === 0 && !viewingSession && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">Start a Net Session</p>
              <p className="text-sm text-slate-500 mt-1">
                Set speed &amp; delivery type, tap the pitch map, then log each delivery
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Speed tracking</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Pitch map</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Wagon wheel</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Session analytics</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
