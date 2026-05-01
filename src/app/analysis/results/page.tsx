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
  fix_first?: { issue: string; why_it_matters: string; how_to_fix: string };
  technical_feedback: Record<string, string>;
  recommended_drills: { name: string; purpose: string; instructions: string }[];
  seven_day_plan?: { day: number; focus: string; drill: string; duration: string }[];
  share_card_summary?: { top_strength: string; top_improvement_area: string };
  next_steps: string[];
  disclaimer?: string;
  confidence: string;
  isPaid?: boolean;
}

function UpgradeCard({ tokens, router }: { tokens: { accessToken?: string } | null; router: ReturnType<typeof useRouter> }) {
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
        <p className="text-slate-300 max-w-lg mx-auto mb-2">
          Your free score shows where you stand. The full report shows how to improve.
        </p>
        <p className="text-sm text-amber-400 font-medium">
          Unlock before your next practice session.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <ul className="space-y-3">
          {[
            "Full technique breakdown",
            "Timestamp-by-timestamp coaching notes",
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
            "7-day improvement plan",
            "Shareable player card",
            "Progress tracking",
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
        Pro includes 5 analyses/month + full reports + shareable cards + progress tracking
      </p>
    </div>
  );
}

function LockedSection({
  title,
  teaser,
  children,
  isFree,
}: {
  title: string;
  teaser: string;
  children: React.ReactNode;
  isFree: boolean;
}) {
  if (!isFree) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
        {children}
      </div>
    );
  }

  return (
    <div className="relative bg-slate-800/50 border border-amber-500/30 rounded-xl p-6 mb-12 overflow-hidden">
      <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
      <div className="filter blur-[6px] pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-10% via-slate-900/70 to-slate-900/95 flex flex-col items-center justify-end pb-8 rounded-xl">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-amber-400 font-semibold text-sm mb-1">{teaser}</p>
        <p className="text-slate-400 text-xs">Upgrade to unlock this section</p>
      </div>
    </div>
  );
}

function StickyMobileCTA({ onCheckout, loading }: { onCheckout: (plan: string) => void; loading: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-emerald-500/30 p-3 md:hidden z-50">
      <div className="max-w-lg mx-auto">
        <p className="text-center text-xs text-slate-400 mb-2">Your full analysis is waiting</p>
        <div className="flex gap-2">
          <button
            onClick={() => onCheckout("one_time")}
            disabled={loading === "one_time"}
            className="flex-1 bg-white text-slate-900 py-3 rounded-full font-bold text-sm disabled:opacity-50"
          >
            {loading === "one_time" ? "..." : "Unlock Full Report \u2013 $4.99"}
          </button>
          <button
            onClick={() => onCheckout("pro")}
            disabled={loading === "pro"}
            className="flex-1 bg-emerald-500 text-white py-3 rounded-full font-bold text-sm disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            {loading === "pro" ? "..." : "Go Pro \u2013 $9.99/mo"}
          </button>
        </div>
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
      try {
        const parsed = JSON.parse(stored);
        setResult(parsed);
        trackEvent("report_viewed", { analysisType: parsed.analysis_type, score: parsed.overall_score, isPaid: !!parsed.isPaid }, tokens?.accessToken);
        if (!parsed.isPaid) {
          trackEvent("paywall_viewed", { analysisType: parsed.analysis_type, score: parsed.overall_score }, tokens?.accessToken);
        }
      } catch { /* noop */ }
    }
  }, [tokens]);

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
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${isFree ? "pb-32 md:pb-12" : ""}`}>
      {/* Badges */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <span className={`text-xs px-3 py-1 rounded-full ${a.confidence === "high" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}`}>
          {a.confidence === "high" ? "AI Analysis" : "Estimated Analysis"}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
          Confidence: {confidenceScore}%
        </span>
        {isFree && (
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
            Free Preview
          </span>
        )}
        <Link href="/analyze" className="text-sm text-slate-400 hover:text-white transition-colors ml-auto">
          Analyze Another Video
        </Link>
      </div>

      {/* Header — FREE: score + confidence + summary */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-4 border-emerald-500 flex items-center justify-center shrink-0">
          <div className="text-center">
            <span className="text-4xl font-bold text-emerald-400">{a.overall_score}</span>
            <span className="block text-xs text-slate-400">/100</span>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 capitalize">{a.analysis_type} Analysis</h1>
          <p className="text-slate-400 mb-1 capitalize">Player type: {playerRole.replace(/_/g, " ")}</p>
          <p className="text-sm text-blue-400 mb-4">AI Confidence: {confidenceScore}%</p>
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
            <div className="mt-4 pt-3 border-t border-slate-700/50">
              <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                +{a.strengths.length - 1} more strengths locked
              </p>
              <p className="text-xs text-slate-500 mt-1">See all your strengths to know what to build on</p>
            </div>
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
            <div className="mt-4 pt-3 border-t border-slate-700/50">
              <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your biggest technical issue is hidden
              </p>
              <p className="text-xs text-slate-500 mt-1">+{a.weaknesses.length - 1} more issues found — upgrade to see what to fix first</p>
            </div>
          )}
        </div>
      </div>

      {/* Fix First — shown to ALL users (issue visible, how_to_fix locked for free) */}
      {a.fix_first && (
        <div className="bg-gradient-to-r from-amber-900/20 to-red-900/20 border border-amber-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">&#x1F3AF;</span>
            <h2 className="text-lg font-bold text-amber-400">Fix This First</h2>
          </div>
          <p className="text-white font-semibold mb-2">{a.fix_first.issue}</p>
          <p className="text-sm text-slate-300 mb-3">{a.fix_first.why_it_matters}</p>
          {isFree ? (
            <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-3">
              <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Upgrade to see exactly how to fix this
              </p>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              <p className="text-xs text-emerald-400 font-semibold mb-1">How to Fix:</p>
              <p className="text-sm text-slate-300">{a.fix_first.how_to_fix}</p>
            </div>
          )}
        </div>
      )}

      {/* === PAYWALL: Upgrade card for free users === */}
      {isFree && <UpgradeCard tokens={tokens} router={router} />}

      {/* Timestamp Observations — LOCKED for free */}
      {a.timestamp_observations && a.timestamp_observations.length > 0 && (
        <LockedSection
          title={`Timestamp Observations (${a.timestamp_observations.length})`}
          teaser="See exactly what to improve before your next match"
          isFree={isFree}
        >
          <div className="space-y-4">
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
        </LockedSection>
      )}

      {/* Technical Feedback — LOCKED for free */}
      <LockedSection
        title="Full Technical Breakdown"
        teaser="Your biggest technical issue is hidden"
        isFree={isFree}
      >
        <div className="space-y-4">
          {(isFree ? Object.entries(a.technical_feedback).slice(0, 3) : Object.entries(a.technical_feedback)).map(([key, value]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-1">{key.replace(/_/g, " ")}</h3>
              <p className="text-sm text-slate-300">{value}</p>
            </div>
          ))}
        </div>
      </LockedSection>

      {/* Drills — LOCKED for free */}
      <LockedSection
        title="Recommended Drills"
        teaser="Unlock the drill plan to fix this"
        isFree={isFree}
      >
        <div className="grid gap-4">
          {(isFree ? a.recommended_drills.slice(0, 2) : a.recommended_drills).map((drill) => (
            <div key={drill.name} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">{drill.name}</h3>
              <p className="text-sm text-emerald-400 mb-3">{drill.purpose}</p>
              <p className="text-sm text-slate-300">{drill.instructions}</p>
            </div>
          ))}
        </div>
      </LockedSection>

      {/* 7-Day Plan — LOCKED for free */}
      <LockedSection
        title="7-Day Improvement Plan"
        teaser="Get your personalized weekly training plan"
        isFree={isFree}
      >
        {a.seven_day_plan ? (
          <div className="space-y-3">
            {a.seven_day_plan.map((day: { day: number; focus: string; drill: string; duration: string }) => (
              <div key={day.day} className="flex gap-4 items-start bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="text-blue-400 text-sm font-bold">D{day.day}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white">{day.focus}</h4>
                    <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">{day.duration}</span>
                  </div>
                  <p className="text-sm text-slate-300">{day.drill}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ol className="space-y-2">
            {a.next_steps.map((step: string, i: number) => (
              <li key={step} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 shrink-0 text-blue-400 text-xs font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        )}
      </LockedSection>

      {/* Share Prompt — shown for ALL users */}
      <div className="bg-gradient-to-br from-emerald-900/30 via-slate-800/80 to-blue-900/30 border border-emerald-500/20 rounded-2xl p-8 mb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            <span className="text-sm text-emerald-400 font-semibold">Share Your Score</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Show Your Cricket Score</h2>
          <p className="text-slate-300 max-w-lg mx-auto">
            Share your player card and challenge others to beat your score.
          </p>
        </div>
        <ShareCard
          playerName={user?.full_name || "Player"}
          role={playerRole}
          overallScore={a.overall_score}
          confidenceScore={confidenceScore}
          topStrength={a.share_card_summary?.top_strength || a.strengths[0] || ""}
          topImprovement={a.share_card_summary?.top_improvement_area || a.weaknesses[0] || ""}
          analysisType={a.analysis_type}
        />
      </div>

      {/* Bottom Upgrade Card for free users */}
      {isFree && <UpgradeCard tokens={tokens} router={router} />}

      {/* Trust + Disclaimer */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {[
          { icon: "\u{1F512}", text: "Secure Upload" },
          { icon: "\u{1F3CF}", text: "Training Guidance" },
          { icon: "\u{1F6E1}", text: "No Guarantees" },
        ].map((b) => (
          <div key={b.text} className="flex items-center gap-1 text-xs text-slate-500">
            <span>{b.icon}</span>
            <span>{b.text}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 text-center mb-8 max-w-2xl mx-auto">
        {a.disclaimer || "CricVerse360 AI analysis is for cricket training guidance only. It does not guarantee selection, scouting, or professional outcomes. Built for aspiring cricket players."}
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
