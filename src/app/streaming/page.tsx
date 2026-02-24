"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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

export default function StreamingPage() {
  const { user } = useAuth();
  const isStreamer = user?.role === "academy_admin" || user?.role === "coach" || user?.role === "admin";
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">Match Streaming</h1>
              {liveStreams.length > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse">
                  {liveStreams.length} LIVE
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">Watch live cricket matches and upcoming stream schedule</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">&larr; Dashboard</Link>
            {isStreamer && !myLiveStream && (
              <button onClick={() => setShowGoLive(true)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Go Live
              </button>
            )}
            {myLiveStream && (
              <button onClick={stopStream} className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-red-400 font-medium transition-colors flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                End Stream
              </button>
            )}
          </div>
        </div>

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
