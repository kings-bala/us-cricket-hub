"use client";

import { useState } from "react";
import Link from "next/link";

interface DrillVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: "batting" | "bowling" | "fielding" | "fitness";
  skill: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
}

const DRILL_LIBRARY: DrillVideo[] = [
  { id: "b1", title: "Front Foot Drive Masterclass", description: "Learn the fundamentals of front foot driving with proper weight transfer and head position.", youtubeId: "dQw4w9WgXcQ", category: "batting", skill: "Cover Drive", level: "beginner", duration: "8 min" },
  { id: "b2", title: "Pull Shot Technique", description: "Master the pull shot against short-pitched bowling with correct body rotation.", youtubeId: "dQw4w9WgXcQ", category: "batting", skill: "Pull Shot", level: "intermediate", duration: "10 min" },
  { id: "b3", title: "Defensive Technique Drills", description: "Build a solid defense with front foot and back foot blocking drills.", youtubeId: "dQw4w9WgXcQ", category: "batting", skill: "Defense", level: "beginner", duration: "12 min" },
  { id: "b4", title: "Backlift Correction Drill", description: "Fix a crooked backlift with stump batting and guided practice.", youtubeId: "dQw4w9WgXcQ", category: "batting", skill: "Backlift", level: "beginner", duration: "6 min" },
  { id: "b5", title: "Sweep Shot Variations", description: "Learn conventional sweep, reverse sweep, and paddle sweep techniques.", youtubeId: "dQw4w9WgXcQ", category: "batting", skill: "Sweep", level: "advanced", duration: "15 min" },
  { id: "b6", title: "Footwork Against Spin", description: "Drills for using your feet to get to the pitch of spin bowling.", youtubeId: "dQw4w9WgXcQ", category: "batting", skill: "Footwork", level: "intermediate", duration: "10 min" },
  { id: "w1", title: "Fast Bowling Run-Up", description: "Build a consistent and rhythmic run-up for pace bowling.", youtubeId: "dQw4w9WgXcQ", category: "bowling", skill: "Run-Up", level: "beginner", duration: "8 min" },
  { id: "w2", title: "Bowling Arm Action Check", description: "Drills to maintain a legal bowling action and maximize arm speed.", youtubeId: "dQw4w9WgXcQ", category: "bowling", skill: "Arm Action", level: "intermediate", duration: "10 min" },
  { id: "w3", title: "Spin Bowling Basics", description: "Learn finger spin and wrist spin fundamentals with grip and release drills.", youtubeId: "dQw4w9WgXcQ", category: "bowling", skill: "Spin", level: "beginner", duration: "12 min" },
  { id: "w4", title: "Yorker Practice Drill", description: "Improve your yorker accuracy with target-based practice methods.", youtubeId: "dQw4w9WgXcQ", category: "bowling", skill: "Yorker", level: "advanced", duration: "8 min" },
  { id: "w5", title: "Front Knee Brace Drill", description: "Strengthen your front knee brace for more power at the crease.", youtubeId: "dQw4w9WgXcQ", category: "bowling", skill: "Brace", level: "intermediate", duration: "7 min" },
  { id: "f1", title: "Ground Fielding Basics", description: "Low body position, soft hands, and clean pick-up techniques.", youtubeId: "dQw4w9WgXcQ", category: "fielding", skill: "Ground Fielding", level: "beginner", duration: "10 min" },
  { id: "f2", title: "High Catch Drills", description: "Practice high catches with sun simulation and pressure scenarios.", youtubeId: "dQw4w9WgXcQ", category: "fielding", skill: "Catching", level: "intermediate", duration: "8 min" },
  { id: "f3", title: "Throwing Accuracy", description: "Improve direct hit accuracy with target-based throwing drills.", youtubeId: "dQw4w9WgXcQ", category: "fielding", skill: "Throwing", level: "intermediate", duration: "10 min" },
  { id: "f4", title: "Slip Catching Technique", description: "Master slip catching with reaction drills and proper hand positioning.", youtubeId: "dQw4w9WgXcQ", category: "fielding", skill: "Slip Catching", level: "advanced", duration: "12 min" },
  { id: "x1", title: "Cricket-Specific Warm-Up", description: "Dynamic warm-up routine targeting muscles used in cricket.", youtubeId: "dQw4w9WgXcQ", category: "fitness", skill: "Warm-Up", level: "beginner", duration: "10 min" },
  { id: "x2", title: "Fast Bowler Strength Program", description: "Gym exercises for fast bowlers focusing on core and shoulder stability.", youtubeId: "dQw4w9WgXcQ", category: "fitness", skill: "Strength", level: "intermediate", duration: "20 min" },
  { id: "x3", title: "Agility & Reaction Drills", description: "Improve fielding reflexes and lateral movement speed.", youtubeId: "dQw4w9WgXcQ", category: "fitness", skill: "Agility", level: "intermediate", duration: "15 min" },
];

export default function DrillsPage() {
  const [categoryFilter, setCategoryFilter] = useState<"all" | "batting" | "bowling" | "fielding" | "fitness">("all");
  const [levelFilter, setLevelFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [selectedDrill, setSelectedDrill] = useState<DrillVideo | null>(null);

  const filtered = DRILL_LIBRARY.filter((d) => {
    if (categoryFilter !== "all" && d.category !== categoryFilter) return false;
    if (levelFilter !== "all" && d.level !== levelFilter) return false;
    return true;
  });

  const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
    batting: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    bowling: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    fielding: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    fitness: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  };

  const levelColors: Record<string, string> = {
    beginner: "text-emerald-400",
    intermediate: "text-amber-400",
    advanced: "text-red-400",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3">
        <Link href="/analyze" className="text-sm text-slate-400 hover:text-white">&larr; Back to Analysis</Link>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">Drill Library</h1>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">{DRILL_LIBRARY.length} Drills</span>
        </div>
        <p className="text-sm text-slate-400">Curated cricket coaching drills organized by skill and difficulty level.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1.5">
          {(["all", "batting", "bowling", "fielding", "fitness"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === cat ? "bg-white/10 text-white border border-white/20" : "text-slate-400 hover:text-white border border-transparent"
              }`}
            >
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="border-l border-slate-700 mx-2" />
        <div className="flex gap-1.5">
          {(["all", "beginner", "intermediate", "advanced"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                levelFilter === lvl ? "bg-white/10 text-white border border-white/20" : "text-slate-400 hover:text-white border border-transparent"
              }`}
            >
              {lvl === "all" ? "All Levels" : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {selectedDrill && (
        <div className="mb-6 bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="aspect-video bg-black flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">{selectedDrill.title}</p>
              <p className="text-xs text-slate-500 mt-1">Video player placeholder — connect YouTube API or embed videos here</p>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{selectedDrill.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{selectedDrill.description}</p>
              </div>
              <button onClick={() => setSelectedDrill(null)} className="text-xs text-slate-500 hover:text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((drill) => {
          const colors = categoryColors[drill.category];
          return (
            <button
              key={drill.id}
              onClick={() => setSelectedDrill(drill)}
              className={`text-left bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all ${
                selectedDrill?.id === drill.id ? "ring-2 ring-emerald-500/30" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
                  {drill.category}
                </span>
                <span className={`text-xs ${levelColors[drill.level]}`}>{drill.level}</span>
                <span className="text-xs text-slate-600 ml-auto">{drill.duration}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{drill.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{drill.description}</p>
              <div className="flex items-center gap-1 mt-3">
                <span className="text-xs text-slate-500">{drill.skill}</span>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
          <p className="text-slate-400">No drills match your filters.</p>
          <button onClick={() => { setCategoryFilter("all"); setLevelFilter("all"); }} className="text-xs text-emerald-400 hover:text-emerald-300 mt-2">Reset Filters</button>
        </div>
      )}
    </div>
  );
}
