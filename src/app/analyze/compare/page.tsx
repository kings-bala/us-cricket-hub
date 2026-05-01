"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getHistory, type SavedAnalysis } from "@/lib/analysis-history";

const PRO_BENCHMARKS: Record<string, { name: string; country: string; scores: Record<string, number>; tips: string }[]> = {
  batting: [
    { name: "Elite Classical Batsman", country: "International", scores: { "Stance & Setup": 95, "Backlift & Grip": 93, "Head Position": 97, "Balance & Weight Transfer": 95, "Footwork": 93 }, tips: "Still head position, textbook front-foot play, and aggressive weight transfer into drives. Classical technique with minimal pre-delivery movement." },
    { name: "Unorthodox Power Hitter", country: "International", scores: { "Stance & Setup": 78, "Backlift & Grip": 82, "Head Position": 94, "Balance & Weight Transfer": 93, "Footwork": 88 }, tips: "Unconventional stance compensated by exceptional balance. Deep crease movement and strong bottom hand generate power from unusual positions." },
    { name: "Textbook Technician", country: "International", scores: { "Stance & Setup": 94, "Backlift & Grip": 92, "Head Position": 96, "Balance & Weight Transfer": 94, "Footwork": 92 }, tips: "Minimal backlift and late shot selection. Excellent at leaving deliveries outside off stump. Relies on timing over power." },
  ],
  bowling: [
    { name: "Express Pace Bowler", country: "International", scores: { "Bowling Arm Action": 95, "Front Arm Drive": 93, "Trunk Rotation": 94, "Front Knee Brace": 96, "Hip-Shoulder Separation": 93 }, tips: "Textbook side-on action with smooth run-up. Strong front arm pull-through generates pace consistently. Hyperextended front knee at delivery." },
    { name: "Swing Specialist", country: "International", scores: { "Bowling Arm Action": 93, "Front Arm Drive": 90, "Trunk Rotation": 91, "Front Knee Brace": 92, "Hip-Shoulder Separation": 90 }, tips: "High release point with upright seam position. Uses angle across batsmen and generates late swing through wrist position." },
    { name: "Elite Spin Bowler", country: "International", scores: { "Bowling Arm Action": 90, "Front Arm Drive": 86, "Trunk Rotation": 88, "Front Knee Brace": 85, "Hip-Shoulder Separation": 91 }, tips: "Quick arm speed with disguised variations. Minimal change in bowling action between deliveries makes reading difficult." },
  ],
  fielding: [
    { name: "Athletic Ground Fielder", country: "International", scores: { "Ready Position": 95, "Ground Fielding": 96, "Throwing Accuracy": 97, "Catching": 93, "Agility": 95 }, tips: "Elite arm strength and accuracy. Lightning quick release on direct hits. Low center of gravity for clean pick-ups." },
    { name: "Safe-Hands Specialist", country: "International", scores: { "Ready Position": 92, "Ground Fielding": 93, "Throwing Accuracy": 92, "Catching": 96, "Agility": 93 }, tips: "Exceptional catching under pressure. Good anticipation and positioning in the slip cordon. Reliable in high-pressure moments." },
  ],
};

export default function ComparePage() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [selected, setSelected] = useState<SavedAnalysis | null>(null);
  const [selectedPro, setSelectedPro] = useState<string>("");

  useEffect(() => {
    const h = getHistory();
    setAnalyses(h);
    if (h.length > 0) setSelected(h[0]);
  }, []);

  const type = selected?.summary.type || "batting";
  const pros = PRO_BENCHMARKS[type] || [];
  const pro = pros.find((p) => p.name === selectedPro) || pros[0];

  useEffect(() => {
    if (pros.length > 0 && !pros.find((p) => p.name === selectedPro)) {
      setSelectedPro(pros[0].name);
    }
  }, [type, pros, selectedPro]);

  const scoreColor = (s: number) => s >= 75 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400";
  const barColor = (s: number) => s >= 75 ? "bg-emerald-500" : s >= 60 ? "bg-amber-500" : "bg-red-500";

  const getGapAnalysis = (playerScore: number, proScore: number) => {
    const gap = proScore - playerScore;
    if (gap <= 5) return { label: "On Par", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (gap <= 15) return { label: "Close", color: "text-amber-400", bg: "bg-amber-500/10" };
    return { label: "Gap to Close", color: "text-red-400", bg: "bg-red-500/10" };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3">
        <Link href="/analyze" className="text-sm text-slate-400 hover:text-white">&larr; Back to Analysis</Link>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">Pro Comparison</h1>
          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/30">Side-by-Side</span>
        </div>
        <p className="text-sm text-slate-400">Compare your technique scores against professional cricket players.</p>
        <p className="text-xs text-slate-500 mt-1">Benchmark scores represent typical technique ranges for elite-level players based on coaching literature. These are reference standards, not individual player profiles.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Your Analysis</h3>
            {analyses.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-slate-500">No analyses yet.</p>
                <Link href="/analyze" className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 inline-block">Analyze a video first</Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {analyses.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className={`w-full text-left p-2 rounded-lg border text-xs transition-all ${
                      selected?.id === a.id ? "border-cyan-500 bg-cyan-500/10" : "border-slate-700/50 hover:border-slate-600"
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
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Compare With</h3>
            <div className="space-y-2">
              {pros.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPro(p.name)}
                  className={`w-full text-left p-2 rounded-lg border text-xs transition-all ${
                    selectedPro === p.name ? "border-cyan-500 bg-cyan-500/10" : "border-slate-700/50 hover:border-slate-600"
                  }`}
                >
                  <p className="text-white font-medium">{p.name}</p>
                  <p className="text-slate-500">{p.country}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {!selected ? (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <p className="text-slate-400">Analyze a video first to compare with pros</p>
            </div>
          ) : pro ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 text-center">
                  <p className="text-xs text-slate-500 mb-1">Your Score</p>
                  <p className={`text-3xl font-bold ${scoreColor(selected.summary.overallScore)}`}>{selected.summary.overallScore}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">{selected.fileName}</p>
                </div>
                <div className="bg-slate-800/50 border border-cyan-500/30 rounded-xl p-5 text-center">
                  <p className="text-xs text-slate-500 mb-1">Gap</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    {(() => { const avg = Object.values(pro.scores).reduce((a, b) => a + b, 0) / Object.values(pro.scores).length; return Math.round(avg - selected.summary.overallScore); })()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">points to close</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 text-center">
                  <p className="text-xs text-slate-500 mb-1">Pro Score</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {Math.round(Object.values(pro.scores).reduce((a, b) => a + b, 0) / Object.values(pro.scores).length)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{pro.name}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Category Breakdown</h3>
                <div className="space-y-4">
                  {selected.summary.categories.map((cat) => {
                    const proScore = pro.scores[cat.category] || 90;
                    const gap = getGapAnalysis(cat.score, proScore);
                    return (
                      <div key={cat.category}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-white font-medium">{cat.category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${gap.bg} ${gap.color}`}>{gap.label}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-500">You</span>
                              <span className={`text-xs font-bold ${scoreColor(cat.score)}`}>{cat.score}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className={`h-2 rounded-full transition-all duration-700 ${barColor(cat.score)}`} style={{ width: `${cat.score}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-500">{pro.name}</span>
                              <span className="text-xs font-bold text-emerald-400">{proScore}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className="h-2 rounded-full transition-all duration-700 bg-emerald-500" style={{ width: `${proScore}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-cyan-400 mb-2">Pro Insight: {pro.name}</h3>
                <p className="text-sm text-slate-300">{pro.tips}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Priority Areas</h3>
                <div className="space-y-2">
                  {selected.summary.categories
                    .map((cat) => ({ category: cat.category, gap: (pro.scores[cat.category] || 90) - cat.score, suggestion: cat.suggestion }))
                    .sort((a, b) => b.gap - a.gap)
                    .slice(0, 3)
                    .map((item, i) => (
                      <div key={i} className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-amber-400">{i + 1}.</span>
                          <span className="text-sm text-white font-medium">{item.category}</span>
                          <span className="text-xs text-red-400">(-{item.gap} pts)</span>
                        </div>
                        <p className="text-xs text-slate-400">{item.suggestion}</p>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
