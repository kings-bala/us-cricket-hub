"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getHistory, type SavedAnalysis } from "@/lib/analysis-history";
import {
  SKILL_TAXONOMY,
  getLabels,
  saveLabel,
  removeLabel,
  getLabelForAnalysis,
  getDatasetStats,
  exportDataset,
  type SkillCategory,
  type DatasetLabel,
} from "@/lib/labeling";

export default function LabelingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [labels, setLabels] = useState<DatasetLabel[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unlabeled" | "labeled">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | SkillCategory>("all");
  const [skillId, setSkillId] = useState("");
  const [confidence, setConfidence] = useState<"high" | "medium" | "low">("medium");
  const [notes, setNotes] = useState("");
  const [showExport, setShowExport] = useState(false);

  const refresh = useCallback(() => {
    setAnalyses(getHistory());
    setLabels(getLabels());
  }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/auth");
      return;
    }
    refresh();
  }, [user, router, refresh]);

  if (!user || user.role !== "admin") return null;

  const stats = getDatasetStats();

  const filtered = analyses.filter((a) => {
    const hasLabel = labels.some((l) => l.analysisId === a.id);
    if (filter === "labeled" && !hasLabel) return false;
    if (filter === "unlabeled" && hasLabel) return false;
    if (typeFilter !== "all" && a.summary.type !== typeFilter) return false;
    return true;
  });

  const selected = analyses.find((a) => a.id === selectedId) || null;
  const existingLabel = selectedId ? getLabelForAnalysis(selectedId) : null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const existing = getLabelForAnalysis(id);
    if (existing) {
      setSkillId(existing.skillId);
      setConfidence(existing.confidence);
      setNotes(existing.notes);
    } else {
      setSkillId("");
      setConfidence("medium");
      setNotes("");
    }
  };

  const handleSave = () => {
    if (!selected || !skillId) return;
    const taxonomy = SKILL_TAXONOMY[selected.summary.type];
    const skill = taxonomy.skills.find((s) => s.id === skillId);
    if (!skill) return;
    saveLabel({
      analysisId: selected.id,
      fileName: selected.fileName,
      analysisType: selected.summary.type,
      skillId,
      skillName: skill.name,
      confidence,
      labeledBy: user.email,
      labeledAt: new Date().toISOString(),
      notes,
      overallScore: selected.summary.overallScore,
    });
    refresh();
  };

  const handleRemove = (analysisId: string) => {
    removeLabel(analysisId);
    refresh();
  };

  const handleExport = () => {
    const data = exportDataset();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cricverse360-dataset-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scoreColor = (score: number) =>
    score >= 75 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";

  const scoreBg = (score: number) =>
    score >= 75 ? "bg-emerald-500/20 border-emerald-500/30" : score >= 60 ? "bg-amber-500/20 border-amber-500/30" : "bg-red-500/20 border-red-500/30";

  const confidenceColor = (c: string) =>
    c === "high" ? "text-emerald-400" : c === "medium" ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin" className="text-sm text-slate-400 hover:text-white">&larr; Admin Dashboard</Link>
            </div>
            <h1 className="text-2xl font-bold text-white">Dataset Labeling</h1>
            <p className="text-sm text-slate-400 mt-1">Label analysis clips with cricket skills for ML training</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExport(!showExport)}
              className="text-xs px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
            >
              Dataset Stats
            </button>
            <button
              onClick={handleExport}
              disabled={stats.total === 0}
              className={`text-xs px-4 py-2 rounded-lg transition-colors ${stats.total > 0 ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}
            >
              Export JSON ({stats.total})
            </button>
          </div>
        </div>

        {showExport && (
          <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-blue-400 mb-4">Dataset Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-slate-400">Total Labels</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <p className="text-2xl font-bold text-white">{analyses.length}</p>
                <p className="text-xs text-slate-400">Total Analyses</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <p className="text-2xl font-bold text-white">{analyses.length > 0 ? Math.round((stats.total / analyses.length) * 100) : 0}%</p>
                <p className="text-xs text-slate-400">Labeled</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <p className="text-2xl font-bold text-white">{Object.keys(stats.bySkill).length}</p>
                <p className="text-xs text-slate-400">Unique Skills</p>
              </div>
            </div>
            {stats.total > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">By Type</p>
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between py-1">
                      <span className="text-sm text-slate-300 capitalize">{type}</span>
                      <span className="text-sm text-white font-medium">{count}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">By Confidence</p>
                  {Object.entries(stats.byConfidence).map(([conf, count]) => (
                    <div key={conf} className="flex items-center justify-between py-1">
                      <span className={`text-sm capitalize ${confidenceColor(conf)}`}>{conf}</span>
                      <span className="text-sm text-white font-medium">{count}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Top Skills</p>
                  {Object.entries(stats.bySkill).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([skill, count]) => (
                    <div key={skill} className="flex items-center justify-between py-1">
                      <span className="text-sm text-slate-300">{skill}</span>
                      <span className="text-sm text-white font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as "all" | "unlabeled" | "labeled")}
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All ({analyses.length})</option>
                  <option value="unlabeled">Unlabeled ({analyses.length - labels.length})</option>
                  <option value="labeled">Labeled ({labels.length})</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as "all" | SkillCategory)}
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Types</option>
                  <option value="batting">Batting</option>
                  <option value="bowling">Bowling</option>
                  <option value="fielding">Fielding</option>
                </select>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                {filtered.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500">No analyses found.</p>
                    <p className="text-xs text-slate-600 mt-1">Upload and analyze videos first.</p>
                  </div>
                ) : (
                  filtered.map((a) => {
                    const label = getLabelForAnalysis(a.id);
                    const isSelected = a.id === selectedId;
                    return (
                      <button
                        key={a.id}
                        onClick={() => handleSelect(a.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-slate-700/50 bg-slate-900/30 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{a.fileName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded border ${scoreBg(a.summary.overallScore)}`}>
                                <span className={scoreColor(a.summary.overallScore)}>{a.summary.overallScore}</span>
                              </span>
                              <span className="text-xs text-slate-500 capitalize">{a.summary.type}</span>
                              <span className="text-xs text-slate-600">{new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                            </div>
                          </div>
                          {label ? (
                            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {label.skillName}
                            </span>
                          ) : (
                            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-500 border border-slate-600/50">
                              Unlabeled
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {!selected ? (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <p className="text-slate-400">Select an analysis from the left to start labeling</p>
                <p className="text-xs text-slate-600 mt-1">Labels are used to build the cricket ML training dataset</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">{selected.fileName}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 capitalize">{selected.summary.type} analysis</span>
                        <span className="text-xs text-slate-600">{new Date(selected.date).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${scoreColor(selected.summary.overallScore)}`}>
                      {selected.summary.overallScore}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {selected.summary.categories.map((cat) => (
                      <div key={cat.category} className={`rounded-lg p-3 border ${scoreBg(cat.score)}`}>
                        <p className="text-xs text-slate-400">{cat.category}</p>
                        <p className={`text-lg font-bold ${scoreColor(cat.score)}`}>{cat.score}</p>
                      </div>
                    ))}
                  </div>

                  {selected.summary.keyFrames.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Key Moments</p>
                      <div className="space-y-1">
                        {selected.summary.keyFrames.slice(0, 3).map((kf, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="text-slate-600">{kf.timestamp.toFixed(1)}s</span>
                            <span className="text-slate-400">{kf.issue}</span>
                            <span className={scoreColor(kf.score)}>{kf.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {existingLabel && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-400 font-medium">Currently labeled:</span>
                          <span className="text-sm text-white font-semibold">{existingLabel.skillName}</span>
                          <span className={`text-xs ${confidenceColor(existingLabel.confidence)}`}>({existingLabel.confidence})</span>
                        </div>
                        <button onClick={() => handleRemove(selected.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                      </div>
                      {existingLabel.notes && <p className="text-xs text-slate-400 mt-1">{existingLabel.notes}</p>}
                    </div>
                  )}
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
                    {existingLabel ? "Update Label" : "Assign Label"}
                  </h3>

                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">
                      {SKILL_TAXONOMY[selected.summary.type].label} — select the skill demonstrated
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {SKILL_TAXONOMY[selected.summary.type].skills.map((skill) => (
                        <button
                          key={skill.id}
                          onClick={() => setSkillId(skill.id)}
                          className={`text-left p-2.5 rounded-lg border transition-all ${
                            skillId === skill.id
                              ? "border-emerald-500 bg-emerald-500/10"
                              : "border-slate-700/50 hover:border-slate-600"
                          }`}
                        >
                          <p className={`text-xs font-medium ${skillId === skill.id ? "text-emerald-400" : "text-white"}`}>{skill.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{skill.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Confidence Level</p>
                      <div className="flex gap-2">
                        {(["high", "medium", "low"] as const).map((c) => (
                          <button
                            key={c}
                            onClick={() => setConfidence(c)}
                            className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-all ${
                              confidence === c
                                ? c === "high" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                  : c === "medium" ? "border-amber-500 bg-amber-500/10 text-amber-400"
                                  : "border-red-500 bg-red-500/10 text-red-400"
                                : "border-slate-700 text-slate-400 hover:border-slate-600"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Notes (optional)</p>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Good example of textbook cover drive"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={!skillId}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                      skillId
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {existingLabel ? "Update Label" : "Save Label"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
