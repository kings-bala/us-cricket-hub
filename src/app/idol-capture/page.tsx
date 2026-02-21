"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { legends, skillColors, type Skill, type Legend, type Routine } from "@/data/legends";
import { apiRequest } from "@/lib/api-client";

export default function IdolCapturePage() {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState<Skill | "All">("All");
  const [selected, setSelected] = useState<Record<Skill, Legend | null>>({
    Batting: null,
    Bowling: null,
    Fielding: null,
    "Wicket-Keeping": null,
  });
  const [savedIds, setSavedIds] = useState<string>("");
  const [saveFlash, setSaveFlash] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("idol-selections");
      if (saved) {
        const ids: Record<string, string> = JSON.parse(saved);
        const restored: Record<Skill, Legend | null> = { Batting: null, Bowling: null, Fielding: null, "Wicket-Keeping": null };
        for (const [skill, legendId] of Object.entries(ids)) {
          const legend = legends.find((l) => l.id === legendId);
          if (legend) restored[skill as Skill] = legend;
        }
        setSelected(restored);
        setSavedIds(saved);
      }
    } catch {}
    apiRequest<{ selections?: Record<string, string> }>("/idol/selections").then((res) => {
      if (res.ok && res.data?.selections) {
        const ids = res.data.selections;
        const restored: Record<Skill, Legend | null> = { Batting: null, Bowling: null, Fielding: null, "Wicket-Keeping": null };
        for (const [skill, legendId] of Object.entries(ids)) {
          const legend = legends.find((l) => l.id === legendId);
          if (legend) restored[skill as Skill] = legend;
        }
        setSelected(restored);
        const json = JSON.stringify(ids);
        setSavedIds(json);
        try { localStorage.setItem("idol-selections", json); } catch {}
      }
    });
  }, []);

  const filtered = useMemo(() => {
    let result = [...legends];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.name.toLowerCase().includes(q) || l.country.toLowerCase().includes(q));
    }
    if (skillFilter !== "All") result = result.filter((l) => l.skills.includes(skillFilter));
    return result;
  }, [search, skillFilter]);

  const currentIds = useMemo(() => {
    const ids: Record<string, string> = {};
    for (const [skill, legend] of Object.entries(selected)) {
      if (legend) ids[skill] = legend.id;
    }
    return JSON.stringify(ids);
  }, [selected]);

  const hasUnsaved = currentIds !== savedIds;

  const saveSelections = () => {
    try { localStorage.setItem("idol-selections", currentIds); } catch {}
    setSavedIds(currentIds);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
    apiRequest("/idol/selections", {
      method: "POST",
      body: { selections: JSON.parse(currentIds) },
    });
  };

  const selectIdol = (legend: Legend, skill: Skill) => {
    setSelected((prev) => ({ ...prev, [skill]: legend }));
  };

  const removeIdol = (skill: Skill) => {
    setSelected((prev) => ({ ...prev, [skill]: null }));
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const groupedRoutines = useMemo(() => {
    const groups: Record<string, { routine: Routine; idol: string; skill: Skill }[]> = { Daily: [], Weekly: [], Monthly: [] };
    for (const skill of ["Batting", "Bowling", "Fielding", "Wicket-Keeping"] as Skill[]) {
      const idol = selected[skill];
      if (!idol) continue;
      const routines = idol.routines[skill] || [];
      for (const r of routines) {
        const entry = { routine: r, idol: idol.name, skill };
        if (r.frequency === "Daily") groups.Daily.push(entry);
        else if (r.frequency === "Monthly") groups.Monthly.push(entry);
        else groups.Weekly.push(entry);
      }
    }
    return groups;
  }, [selected]);

  const totalRoutines = groupedRoutines.Daily.length + groupedRoutines.Weekly.length + groupedRoutines.Monthly.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/players?tab=training" className="text-sm text-slate-400 hover:text-white">&larr; Back to Training</Link></div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Idol Capture</h1>
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30">Pick Your Legends</span>
        </div>
        <p className="text-slate-400">Search former cricket legends and select one as your idol for each skill. Mirror their technique and routines.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(["Batting", "Bowling", "Fielding", "Wicket-Keeping"] as Skill[]).map((skill) => {
          const idol = selected[skill];
          const colors = skillColors[skill];
          return (
            <div key={skill} className={`rounded-xl p-4 border ${idol ? colors.border : "border-slate-700/50"} ${idol ? colors.bg : "bg-slate-800/50"}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${colors.text}`}>{skill} Idol</p>
              {idol ? (
                <div>
                  <p className="text-white font-semibold text-sm">{idol.name}</p>
                  <p className="text-xs text-slate-400">{idol.country}</p>
                  <button onClick={() => removeIdol(skill)} className="mt-2 text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Not selected</p>
              )}
            </div>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={saveSelections}
            disabled={!hasUnsaved}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              saveFlash
                ? "bg-emerald-500 text-white"
                : hasUnsaved
                  ? "bg-amber-500 hover:bg-amber-400 text-black"
                  : "bg-slate-700 text-slate-400 cursor-default"
            }`}
          >
            {saveFlash ? "Saved!" : hasUnsaved ? "Save Selections" : "Selections Saved"}
          </button>
          {hasUnsaved && <span className="text-xs text-amber-400">You have unsaved changes</span>}
        </div>
      )}

      {selectedCount === 4 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6 text-center">
          <p className="text-emerald-400 font-semibold">All idols selected! Your training routines will be tailored to match their techniques.</p>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search legends by name or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value as Skill | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Skills</option>
            <option value="Batting">Batting</option>
            <option value="Bowling">Bowling</option>
            <option value="Fielding">Fielding</option>
            <option value="Wicket-Keeping">Wicket-Keeping</option>
          </select>
          <p className="text-sm text-slate-500 self-center">Showing {filtered.length} legends</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((legend) => (
          <div key={legend.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-amber-500/40 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <img src={legend.photo} alt={legend.name} className="w-12 h-12 rounded-full object-cover shrink-0 bg-slate-700" />
              <div>
                <h3 className="font-semibold text-white">{legend.name}</h3>
                <p className="text-xs text-slate-400">{legend.country} &middot; {legend.era}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-3">{legend.highlights}</p>
            <div className="flex flex-wrap gap-2">
              {legend.skills.map((skill) => {
                const colors = skillColors[skill];
                const alreadySelected = selected[skill]?.id === legend.id;
                return (
                  <button
                    key={skill}
                    onClick={() => alreadySelected ? removeIdol(skill) : selectIdol(legend, skill)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                      alreadySelected
                        ? `${colors.bg} ${colors.text} ${colors.border} ring-1 ring-offset-0`
                        : `bg-slate-900/50 text-slate-400 border-slate-700 hover:${colors.text} hover:${colors.border}`
                    }`}
                  >
                    {alreadySelected ? `✓ ${skill} Idol` : `Select for ${skill}`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No legends match your search</p>
          <button onClick={() => { setSearch(""); setSkillFilter("All"); }} className="mt-4 text-amber-400 hover:text-amber-300 text-sm">Clear filters</button>
        </div>
      )}

      {selectedCount > 0 && totalRoutines > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Consolidated Training Schedule</h2>
            <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">{totalRoutines} total routines</span>
          </div>

          {(["Daily", "Weekly", "Monthly"] as const).map((freq) => {
            const items = groupedRoutines[freq];
            if (items.length === 0) return null;
            const freqColors = { Daily: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", badge: "bg-emerald-500/20" }, Weekly: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", badge: "bg-blue-500/20" }, Monthly: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", badge: "bg-purple-500/20" } };
            const fc = freqColors[freq];
            return (
              <div key={freq} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className={`text-lg font-semibold ${fc.text}`}>{freq} Routines</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${fc.badge} ${fc.text}`}>{items.length} routines</span>
                </div>
                <div className={`border rounded-xl ${fc.border} ${fc.bg} overflow-hidden`}>
                  <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-slate-700/40 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    <div className="col-span-3">Routine</div>
                    <div className="col-span-2">Idol</div>
                    <div className="col-span-1">Skill</div>
                    <div className="col-span-1">Duration</div>
                    <div className="col-span-1">Frequency</div>
                    <div className="col-span-4">Description</div>
                  </div>
                  {items.map((item, i) => {
                    const sc = skillColors[item.skill];
                    return (
                      <div key={i} className={`grid grid-cols-12 gap-2 px-5 py-3 items-center ${i < items.length - 1 ? "border-b border-slate-700/20" : ""}`}>
                        <div className="col-span-3">
                          <p className="text-sm font-semibold text-white">{item.routine.name}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-slate-300">{item.idol}</p>
                        </div>
                        <div className="col-span-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{item.skill}</span>
                        </div>
                        <div className="col-span-1">
                          <p className="text-xs text-slate-400">{item.routine.duration}</p>
                        </div>
                        <div className="col-span-1">
                          <p className={`text-xs ${fc.text}`}>{item.routine.frequency}</p>
                        </div>
                        <div className="col-span-4">
                          <p className="text-xs text-slate-400 leading-relaxed">{item.routine.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
