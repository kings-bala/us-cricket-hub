"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ShareCard from "@/components/ShareCard";

interface AnalysisResult {
  analysisId: string;
  player_type: string;
  analysis_type: string;
  overall_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  technical_feedback: Record<string, string>;
  recommended_drills: { name: string; purpose: string; instructions: string }[];
  next_steps: string[];
  confidence: string;
}

export default function AnalysisResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("latestAnalysis");
    if (stored) {
      try { setResult(JSON.parse(stored)); } catch { /* noop */ }
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">No Analysis Found</h1>
          <p className="text-slate-400 mb-6">Upload a video to get your analysis.</p>
          <Link href="/analyze" className="text-emerald-400 hover:text-emerald-300">Go to AI Analysis</Link>
        </div>
      </div>
    );
  }

  const a = result;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex items-center gap-3">
        <span className={`text-xs px-3 py-1 rounded-full ${a.confidence === "high" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}`}>
          {a.confidence === "high" ? "AI Analysis" : "Estimated Analysis"}
        </span>
        <Link href="/analyze" className="text-sm text-slate-400 hover:text-white transition-colors">
          Analyze Another Video
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-4 border-emerald-500 flex items-center justify-center shrink-0">
          <span className="text-4xl font-bold text-emerald-400">{a.overall_score}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 capitalize">{a.analysis_type} Analysis</h1>
          <p className="text-slate-400 mb-4 capitalize">Player type: {a.player_type?.replace("_", " ")}</p>
          <p className="text-slate-300">{a.summary}</p>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-emerald-400 mb-4">Strengths</h2>
          <ul className="space-y-3">
            {a.strengths.map((s) => (
              <li key={s} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-red-400 mb-4">Areas for Improvement</h2>
          <ul className="space-y-3">
            {a.weaknesses.map((w) => (
              <li key={w} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="w-2 h-2 bg-red-400 rounded-full" />
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technical Feedback */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-6">Technical Feedback</h2>
        <div className="space-y-4">
          {Object.entries(a.technical_feedback).map(([key, value]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-1">{key.replace("_", " ")}</h3>
              <p className="text-sm text-slate-300">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drills */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6">Recommended Drills</h2>
        <div className="grid gap-4">
          {a.recommended_drills.map((drill) => (
            <div key={drill.name} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">{drill.name}</h3>
              <p className="text-sm text-emerald-400 mb-3">{drill.purpose}</p>
              <p className="text-sm text-slate-300">{drill.instructions}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Next Steps</h2>
        <ol className="space-y-2">
          {a.next_steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 shrink-0 text-blue-400 text-xs font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Shareable Card */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Share Your Analysis</h2>
        <ShareCard
          playerName="Player"
          role={a.player_type}
          overallScore={a.overall_score}
          topStrength={a.strengths[0] || ""}
          topImprovement={a.weaknesses[0] || ""}
          analysisType={a.analysis_type}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/analyze" className="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
          Analyze Another Video
        </Link>
        <Link href="/pricing" className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold border border-white/20 transition-colors">
          Upgrade for More Analyses
        </Link>
      </div>
    </div>
  );
}
