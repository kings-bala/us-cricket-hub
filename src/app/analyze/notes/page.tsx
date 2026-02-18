"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getHistory, type SavedAnalysis } from "@/lib/analysis-history";

interface CoachNote {
  id: string;
  analysisId: string;
  text: string;
  timestamp: string;
  category: "technique" | "fitness" | "mental" | "general";
}

const NOTES_KEY = "cricverse360_coach_notes";

function getNotes(): CoachNote[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveNotes(notes: CoachNote[]) {
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch { /* ignore */ }
}

export default function NotesPage() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [selected, setSelected] = useState<SavedAnalysis | null>(null);
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [noteCategory, setNoteCategory] = useState<CoachNote["category"]>("technique");
  const [exportFormat, setExportFormat] = useState<"text" | "csv">("text");

  useEffect(() => {
    const h = getHistory();
    setAnalyses(h);
    if (h.length > 0) setSelected(h[0]);
    setNotes(getNotes());
  }, []);

  const filteredNotes = selected ? notes.filter((n) => n.analysisId === selected.id) : notes;

  const addNote = useCallback(() => {
    if (!newNote.trim() || !selected) return;
    const note: CoachNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      analysisId: selected.id,
      text: newNote.trim(),
      timestamp: new Date().toISOString(),
      category: noteCategory,
    };
    const updated = [note, ...notes];
    setNotes(updated);
    saveNotes(updated);
    setNewNote("");
  }, [newNote, selected, noteCategory, notes]);

  const deleteNote = useCallback((id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  }, [notes]);

  const exportNotes = useCallback(() => {
    if (!selected) return;
    const sessionNotes = notes.filter((n) => n.analysisId === selected.id);
    let content = "";

    if (exportFormat === "csv") {
      content = "Date,Category,Note,Analysis,Score\n";
      sessionNotes.forEach((n) => {
        content += `"${new Date(n.timestamp).toLocaleDateString()}","${n.category}","${n.text.replace(/"/g, '""')}","${selected.fileName}","${selected.summary.overallScore}"\n`;
      });
    } else {
      content = `Coach Notes Report - ${selected.fileName}\n`;
      content += `Analysis Type: ${selected.summary.type} | Score: ${selected.summary.overallScore}/100\n`;
      content += `Generated: ${new Date().toLocaleDateString()}\n`;
      content += `${"=".repeat(50)}\n\n`;
      content += `ANALYSIS SUMMARY:\n`;
      selected.summary.categories.forEach((c) => {
        content += `  ${c.category}: ${c.score}/100 - ${c.comment}\n`;
      });
      content += `\nCOACH NOTES:\n`;
      sessionNotes.forEach((n) => {
        content += `  [${n.category.toUpperCase()}] ${new Date(n.timestamp).toLocaleDateString()} - ${n.text}\n`;
      });
      content += `\nRECOMMENDED DRILLS:\n`;
      selected.summary.drills.forEach((d, i) => {
        content += `  ${i + 1}. ${d}\n`;
      });
    }

    const blob = new Blob([content], { type: exportFormat === "csv" ? "text/csv" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coach-notes-${selected.fileName.replace(/\.[^.]+$/, "")}.${exportFormat === "csv" ? "csv" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selected, notes, exportFormat]);

  const categoryColors: Record<string, { text: string; bg: string }> = {
    technique: { text: "text-emerald-400", bg: "bg-emerald-500/10" },
    fitness: { text: "text-blue-400", bg: "bg-blue-500/10" },
    mental: { text: "text-purple-400", bg: "bg-purple-500/10" },
    general: { text: "text-slate-400", bg: "bg-slate-500/10" },
  };

  const scoreColor = (s: number) => s >= 75 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3">
        <Link href="/analyze" className="text-sm text-slate-400 hover:text-white">&larr; Back to Analysis</Link>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">Coach Notes & Reports</h1>
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full border border-orange-500/30">Notes</span>
        </div>
        <p className="text-sm text-slate-400">Add coaching notes to analyses and export detailed reports.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Sessions</h3>
            {analyses.length === 0 ? (
              <p className="text-xs text-slate-500">No analyses yet.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {analyses.map((a) => {
                  const noteCount = notes.filter((n) => n.analysisId === a.id).length;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className={`w-full text-left p-2 rounded-lg border text-xs transition-all ${
                        selected?.id === a.id ? "border-orange-500 bg-orange-500/10" : "border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <p className="text-white font-medium truncate">{a.fileName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={scoreColor(a.summary.overallScore)}>{a.summary.overallScore}</span>
                        <span className="text-slate-500 capitalize">{a.summary.type}</span>
                        {noteCount > 0 && <span className="text-orange-400 ml-auto">{noteCount} notes</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {!selected ? (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <p className="text-slate-400">Select an analysis session to add notes</p>
            </div>
          ) : (
            <>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{selected.fileName}</h3>
                    <p className="text-xs text-slate-500">{selected.summary.type} analysis &middot; Score: {selected.summary.overallScore}/100 &middot; {new Date(selected.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as "text" | "csv")} className="bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white">
                      <option value="text">Text Report</option>
                      <option value="csv">CSV Export</option>
                    </select>
                    <button onClick={exportNotes} className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-lg text-xs font-medium hover:bg-orange-500/30 transition-colors">
                      Export
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.summary.categories.map((c, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded-full border ${c.score >= 75 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : c.score >= 60 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                      {c.category}: {c.score}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Add Note</h3>
                <div className="flex gap-2 mb-3">
                  {(["technique", "fitness", "mental", "general"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNoteCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                        noteCategory === cat
                          ? `${categoryColors[cat].bg} ${categoryColors[cat].text} border-current`
                          : "border-slate-700 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add coaching observation, feedback, or drill suggestion..."
                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
                    rows={2}
                  />
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className={`px-4 py-2.5 rounded-lg font-medium text-sm self-end transition-colors ${
                      newNote.trim() ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {filteredNotes.length === 0 ? (
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
                    <p className="text-xs text-slate-500">No notes yet for this session. Add your first coaching note above.</p>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div key={note.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[note.category].bg} ${categoryColors[note.category].text}`}>
                            {note.category}
                          </span>
                          <span className="text-xs text-slate-600">
                            {new Date(note.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {new Date(note.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <button onClick={() => deleteNote(note.id)} className="text-xs text-slate-600 hover:text-red-400 transition-colors">Delete</button>
                      </div>
                      <p className="text-sm text-slate-300">{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
