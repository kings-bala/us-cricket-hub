"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { getHistory, type SavedAnalysis } from "@/lib/analysis-history";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = getHistory();
    setAnalyses(h);
    if (h.length > 0) setSelectedAnalysis(h[0]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim(), timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const body: Record<string, unknown> = { message: userMsg.content };
      if (selectedAnalysis) {
        body.analysisContext = {
          type: selectedAnalysis.summary.type,
          overallScore: selectedAnalysis.summary.overallScore,
          categories: selectedAnalysis.summary.categories.map((c) => ({
            category: c.category,
            score: c.score,
            comment: c.comment,
          })),
          drills: selectedAnalysis.summary.drills,
        };
      }

      const res = await fetch("/api/cricket-coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();

      if (data.error === "no_api_key") {
        setMessages((prev) => [...prev, { role: "assistant", content: "AI Coach is not configured yet. Please add GOOGLE_AI_API_KEY to your Vercel environment variables.", timestamp: new Date().toISOString() }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, I encountered an error: ${data.message}. Please try again.`, timestamp: new Date().toISOString() }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply, timestamp: new Date().toISOString() }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please check your connection and try again.", timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, selectedAnalysis]);

  const quickQuestions = [
    "How do I improve my cover drive?",
    "What drills can fix my bowling action?",
    "How should I position my feet for defense?",
    "Tips for better wicketkeeping stance?",
    "How to increase bat speed?",
    "Best exercises for fast bowling?",
  ];

  const scoreColor = (s: number) => s >= 75 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3">
        <Link href="/analyze" className="text-sm text-slate-400 hover:text-white">&larr; Back to Analysis</Link>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">AI Cricket Coach</h1>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30">Gemini-Powered</span>
        </div>
        <p className="text-sm text-slate-400">Ask questions about technique, get personalized drills, and improve your game with AI coaching.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Analysis Context</h3>
            {analyses.length === 0 ? (
              <p className="text-xs text-slate-500">No analyses yet. The coach can still answer general questions.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {analyses.slice(0, 5).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAnalysis(a)}
                    className={`w-full text-left p-2 rounded-lg border text-xs transition-all ${
                      selectedAnalysis?.id === a.id ? "border-purple-500 bg-purple-500/10" : "border-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <p className="text-white font-medium truncate">{a.fileName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={scoreColor(a.summary.overallScore)}>{a.summary.overallScore}</span>
                      <span className="text-slate-500 capitalize">{a.summary.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick Questions</h3>
            <div className="space-y-1.5">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); }} className="w-full text-left text-xs text-slate-300 hover:text-purple-400 p-2 rounded-lg hover:bg-purple-500/5 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col">
          <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col" style={{ minHeight: "500px" }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <p className="text-slate-400 font-medium">Ask your AI Cricket Coach anything</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedAnalysis
                        ? `Coaching based on your ${selectedAnalysis.summary.type} analysis (Score: ${selectedAnalysis.summary.overallScore})`
                        : "Select an analysis for personalized coaching, or ask general questions"}
                    </p>
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-purple-500/20 border border-purple-500/30 text-white"
                      : "bg-slate-700/50 border border-slate-600/50 text-slate-200"
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-slate-700/50 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask about technique, drills, or anything cricket..."
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    input.trim() && !loading ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
