"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShareCard from "@/components/ShareCard";
import { useAuth } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

interface TimestampObservation {
  timestamp: string;
  observation: string;
  coaching_note: string;
}

interface AnalysisResult {
  analysisId: string;
  player_role_detected?: string;
  player_type?: string;
  analysis_type: string;
  overall_score: number;
  confidence_score?: number;
  summary: string;
  video_quality_notes?: string;
  timestamp_observations?: TimestampObservation[];
  strengths: string[];
  weaknesses: string[];
  technical_feedback: Record<string, string>;
  recommended_drills: { name: string; purpose: string; instructions: string }[];
  next_steps: string[];
  disclaimer?: string;
  confidence: string;
  isPaid?: boolean;
}

function UpgradeSection({ tokens, router }: { tokens: { accessToken?: string } | null; router: ReturnType<typeof useRouter> }) {
  const [loading, setLoading] = useState("");

  const handleCheckout = async (planKey: string) => {
    if (!tokens?.accessToken) {
      router.push("/auth");
      return;
    }
    setLoading(planKey);
    trackEvent("checkout_started", { plan: planKey, source: "paywall" }, tokens.accessToken);
    try {
      const data = await apiPost<{ url: string }>("/checkout", {
        plan: planKey,
        successUrl: `${window.location.origin}/analysis/results?upgraded=true`,
        cancelUrl: `${window.location.origin}/analysis/results`,
      }, tokens.accessToken);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900/40 via-slate-800/80 to-blue-900/40 border-2 border-emerald-500/40 rounded-2xl p-8 md:p-10 my-10">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1 mb-4">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-sm text-emerald-400 font-semibold">Premium Content</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Unlock Your Full Cricket Analysis
        </h2>
        <p className="text-slate-300 max-w-lg mx-auto">
          You&apos;re seeing a preview. Unlock the complete report to get actionable coaching insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ul className="space-y-3">
          {[
            "Full technique breakdown",
            "Timestamp coaching insights",
            "Personalized drills",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-slate-200">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
        <ul className="space-y-3">
          {[
            "Progress tracking",
            "Shareable player card",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-slate-200">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => handleCheckout("one_time")}
          disabled={loading === "one_time"}
          className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg disabled:opacity-50"
        >
          {loading === "one_time" ? "Processing..." : "Unlock Full Report \u2013 $4.99"}
        </button>
        <button
          onClick={() => handleCheckout("pro")}
          disabled={loading === "pro"}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          {loading === "pro" ? "Processing..." : "Go Pro \u2013 $9.99/month"}
        </button>
      </div>
      <p className="text-xs text-slate-500 text-center mt-4">
        Pro includes 5 analyses/month + full reports + shareable cards
      </p>
    </div>
  );
}

function LockedOverlay() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900/90 flex items-end justify-center pb-6 rounded-xl">
      <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-full">
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Upgrade to unlock
      </div>
    </div>
  );
}

function StickyMobileCTA({ onCheckout, loading }: { onCheckout: (plan: string) => void; loading: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-700/50 p-3 md:hidden z-50">
      <div className="flex gap-2 max-w-lg mx-auto">
        <button
          onClick={() => onCheckout("one_time")}
          disabled={loading === "one_time"}
          className="flex-1 bg-white text-slate-900 py-2.5 rounded-full font-bold text-sm disabled:opacity-50"
        >
          {loading === "one_time" ? "..." : "Unlock \u2013 $4.99"}
        </button>
        <button
          onClick={() => onCheckout("pro")}
          disabled={loading === "pro"}
          className="flex-1 bg-emerald-500 text-white py-2.5 rounded-full font-bold text-sm disabled:opacity-50"
        >
          {loading === "pro" ? "..." : "Go Pro \u2013 $9.99/mo"}
        </button>
      </div>
    </div>
  );
}

export default function AnalysisResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [stickyLoading, setStickyLoading] = useState("");
  const { user, tokens } = useAuth();
  const router = useRouter();

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
  const isFree = !a.isPaid;
  const playerRole = a.player_role_detected || a.player_type || "unknown";
  const confidenceScore = a.confidence_score || (a.confidence === "high" ? 80 : 50);

  const handleStickyCheckout = async (planKey: string) => {
    if (!tokens?.accessToken) { router.push("/auth"); return; }
    setStickyLoading(planKey);
    trackEvent("checkout_started", { plan: planKey, source: "sticky_cta" }, tokens.accessToken);
    try {
      const data = await apiPost<{ url: string }>("/checkout", {
        plan: planKey,
        successUrl: `${window.location.origin}/analysis/results?upgraded=true`,
        cancelUrl: `${window.location.origin}/analysis/results`,
      }, tokens.accessToken);
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setStickyLoading("");
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${isFree ? "pb-28 md:pb-12" : ""}`}>
      {/* Badges */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <span className={`text-xs px-3 py-1 rounded-full ${a.confidence === "high" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}`}>
          {a.confidence === "high" ? "AI Analysis" : "Estimated Analysis"}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
          Confidence: {confidenceScore}%
        </span>
        {isFree && (
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
            Free Preview
          </span>
        )}
        <Link href="/analyze" className="text-sm text-slate-400 hover:text-white transition-colors ml-auto">
          Analyze Another Video
        </Link>
      </div>

      {/* Header — FREE: score + summary */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-4 border-emerald-500 flex items-center justify-center shrink-0">
          <span className="text-4xl font-bold text-emerald-400">{a.overall_score}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 capitalize">{a.analysis_type} Analysis</h1>
          <p className="text-slate-400 mb-4 capitalize">Player type: {playerRole.replace(/_/g, " ")}</p>
          <p className="text-slate-300">{a.summary}</p>
        </div>
      </div>

      {/* Video Quality Notes — FREE */}
      {a.video_quality_notes && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8">
          <p className="text-sm text-yellow-300"><span className="font-semibold">Video Quality Note:</span> {a.video_quality_notes}</p>
        </div>
      )}

      {/* Strengths & Weaknesses — FREE: show 1 each */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-emerald-400 mb-4">Strengths</h2>
          <ul className="space-y-3">
            {(isFree ? a.strengths.slice(0, 1) : a.strengths).map((s) => (
              <li key={s} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                </span>
                {s}
              </li>
            ))}
          </ul>
          {isFree && a.strengths.length > 1 && (
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              +{a.strengths.length - 1} more strengths — upgrade to see all
            </p>
          )}
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-red-400 mb-4">Areas for Improvement</h2>
          <ul className="space-y-3">
            {(isFree ? a.weaknesses.slice(0, 1) : a.weaknesses).map((w) => (
              <li key={w} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="w-2 h-2 bg-red-400 rounded-full" />
                </span>
                {w}
              </li>
            ))}
          </ul>
          {isFree && a.weaknesses.length > 1 && (
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              +{a.weaknesses.length - 1} more — upgrade to see all
            </p>
          )}
        </div>
      </div>

      {/* === PAYWALL: Upgrade section for free users === */}
      {isFree && <UpgradeSection tokens={tokens} router={router} />}

      {/* Timestamp Observations — LOCKED for free */}
      {a.timestamp_observations && a.timestamp_observations.length > 0 && (
        <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Timestamp Observations</h2>
          <div className={`space-y-4 ${isFree ? "filter blur-[6px] pointer-events-none select-none" : ""}`}>
            {(isFree ? a.timestamp_observations.slice(0, 3) : a.timestamp_observations).map((obs, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-emerald-400 font-mono text-sm whitespace-nowrap mt-0.5">{obs.timestamp}</span>
                <div>
                  <p className="text-sm text-slate-300">{obs.observation}</p>
                  {obs.coaching_note && <p className="text-xs text-blue-400 mt-1">{obs.coaching_note}</p>}
                </div>
              </div>
            ))}
          </div>
          {isFree && <LockedOverlay />}
        </div>
      )}

      {/* Technical Feedback — LOCKED for free */}
      <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-6">Technical Feedback</h2>
        <div className={`space-y-4 ${isFree ? "filter blur-[6px] pointer-events-none select-none" : ""}`}>
          {(isFree ? Object.entries(a.technical_feedback).slice(0, 3) : Object.entries(a.technical_feedback)).map(([key, value]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-1">{key.replace(/_/g, " ")}</h3>
              <p className="text-sm text-slate-300">{value}</p>
            </div>
          ))}
        </div>
        {isFree && <LockedOverlay />}
      </div>

      {/* Drills — LOCKED for free */}
      <div className="relative mb-12">
        <h2 className="text-xl font-bold text-white mb-6">Recommended Drills</h2>
        <div className={`grid gap-4 ${isFree ? "filter blur-[6px] pointer-events-none select-none" : ""}`}>
          {(isFree ? a.recommended_drills.slice(0, 2) : a.recommended_drills).map((drill) => (
            <div key={drill.name} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">{drill.name}</h3>
              <p className="text-sm text-emerald-400 mb-3">{drill.purpose}</p>
              <p className="text-sm text-slate-300">{drill.instructions}</p>
            </div>
          ))}
        </div>
        {isFree && <LockedOverlay />}
      </div>

      {/* Next Steps — LOCKED for free */}
      <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Next Steps</h2>
        <ol className={`space-y-2 ${isFree ? "filter blur-[6px] pointer-events-none select-none" : ""}`}>
          {a.next_steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 shrink-0 text-blue-400 text-xs font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        {isFree && <LockedOverlay />}
      </div>

      {/* Shareable Card — all users */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-2 text-center">Your Player Card</h2>
        <p className="text-sm text-slate-400 text-center mb-6">Download and share to get discovered</p>
        <ShareCard
          playerName={user?.full_name || "Player"}
          role={playerRole}
          overallScore={a.overall_score}
          confidenceScore={confidenceScore}
          topStrength={a.strengths[0] || ""}
          topImprovement={a.weaknesses[0] || ""}
          analysisType={a.analysis_type}
        />
      </div>

      {/* Bottom CTA for free users */}
      {isFree && <UpgradeSection tokens={tokens} router={router} />}

      {/* Disclaimer */}
      <p className="text-xs text-slate-500 text-center mb-8">
        {a.disclaimer || "AI analysis is for training guidance only and does not guarantee selection, scouting, or professional performance outcomes."}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/analyze" className="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
          Analyze Another Video
        </Link>
        {!isFree && (
          <Link href="/pricing" className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold border border-white/20 transition-colors">
            Upgrade for More Analyses
          </Link>
        )}
      </div>

      {/* Sticky Mobile CTA for free users */}
      {isFree && <StickyMobileCTA onCheckout={handleStickyCheckout} loading={stickyLoading} />}
    </div>
  );
}
