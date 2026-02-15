"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Skill = "Batting" | "Bowling" | "Fielding" | "Wicket-Keeping";

interface Legend {
  id: string;
  name: string;
  country: string;
  era: string;
  skills: Skill[];
  highlights: string;
}

const legends: Legend[] = [
  { id: "l1", name: "Sachin Tendulkar", country: "India", era: "1989–2013", skills: ["Batting"], highlights: "100 international centuries, 34,357 runs across formats" },
  { id: "l2", name: "Brian Lara", country: "West Indies", era: "1990–2007", skills: ["Batting"], highlights: "400* in Tests, 501* in first-class cricket" },
  { id: "l3", name: "Sir Don Bradman", country: "Australia", era: "1928–1948", skills: ["Batting"], highlights: "Test average of 99.94, greatest batsman ever" },
  { id: "l4", name: "Vivian Richards", country: "West Indies", era: "1974–1991", skills: ["Batting", "Fielding"], highlights: "8,540 Test runs, fastest century in ODIs (56 balls)" },
  { id: "l5", name: "Shane Warne", country: "Australia", era: "1992–2007", skills: ["Bowling"], highlights: "708 Test wickets, legendary leg-spinner" },
  { id: "l6", name: "Muttiah Muralitharan", country: "Sri Lanka", era: "1992–2011", skills: ["Bowling"], highlights: "800 Test wickets, all-time leading wicket-taker" },
  { id: "l7", name: "Wasim Akram", country: "Pakistan", era: "1984–2003", skills: ["Bowling"], highlights: "916 international wickets, king of reverse swing" },
  { id: "l8", name: "Glenn McGrath", country: "Australia", era: "1993–2007", skills: ["Bowling"], highlights: "563 Test wickets, relentless line and length" },
  { id: "l9", name: "MS Dhoni", country: "India", era: "2004–2020", skills: ["Wicket-Keeping", "Batting"], highlights: "World Cup-winning captain, lightning-fast stumping" },
  { id: "l10", name: "Adam Gilchrist", country: "Australia", era: "1996–2008", skills: ["Wicket-Keeping", "Batting"], highlights: "Explosive keeper-batsman, 379 dismissals" },
  { id: "l11", name: "Kumar Sangakkara", country: "Sri Lanka", era: "2000–2015", skills: ["Wicket-Keeping", "Batting"], highlights: "12,400 Test runs, elegant stroke-maker" },
  { id: "l12", name: "Jonty Rhodes", country: "South Africa", era: "1992–2003", skills: ["Fielding"], highlights: "Greatest fielder ever, iconic run-out of Inzamam" },
  { id: "l13", name: "AB de Villiers", country: "South Africa", era: "2004–2018", skills: ["Batting", "Fielding"], highlights: "360-degree batsman, 176 international catches" },
  { id: "l14", name: "Jacques Kallis", country: "South Africa", era: "1995–2014", skills: ["Batting", "Bowling", "Fielding"], highlights: "13,289 Test runs + 292 wickets, ultimate all-rounder" },
  { id: "l15", name: "Sir Garfield Sobers", country: "West Indies", era: "1954–1974", skills: ["Batting", "Bowling", "Fielding"], highlights: "8,032 Test runs + 235 wickets, greatest all-rounder" },
  { id: "l16", name: "Imran Khan", country: "Pakistan", era: "1971–1992", skills: ["Batting", "Bowling"], highlights: "3,807 Test runs + 362 wickets, 1992 World Cup winner" },
  { id: "l17", name: "Ricky Ponting", country: "Australia", era: "1995–2012", skills: ["Batting", "Fielding"], highlights: "13,378 Test runs, 196 catches, 2 World Cups as captain" },
  { id: "l18", name: "Rahul Dravid", country: "India", era: "1996–2012", skills: ["Batting"], highlights: "13,288 Test runs, The Wall, 210 catches" },
  { id: "l19", name: "Dale Steyn", country: "South Africa", era: "2004–2021", skills: ["Bowling"], highlights: "439 Test wickets, fastest to 400 Test wickets" },
  { id: "l20", name: "Jeff Thomson", country: "Australia", era: "1972–1985", skills: ["Bowling"], highlights: "Fastest bowler in history, 200 Test wickets" },
];

const skillColors: Record<Skill, { bg: string; text: string; border: string }> = {
  Batting: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  Bowling: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  Fielding: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  "Wicket-Keeping": { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
};

export default function IdolCapturePage() {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState<Skill | "All">("All");
  const [selected, setSelected] = useState<Record<Skill, Legend | null>>({
    Batting: null,
    Bowling: null,
    Fielding: null,
    "Wicket-Keeping": null,
  });

  const filtered = useMemo(() => {
    let result = [...legends];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.name.toLowerCase().includes(q) || l.country.toLowerCase().includes(q));
    }
    if (skillFilter !== "All") result = result.filter((l) => l.skills.includes(skillFilter));
    return result;
  }, [search, skillFilter]);

  const selectIdol = (legend: Legend, skill: Skill) => {
    setSelected((prev) => ({ ...prev, [skill]: legend }));
  };

  const removeIdol = (skill: Skill) => {
    setSelected((prev) => ({ ...prev, [skill]: null }));
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

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
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {legend.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
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
    </div>
  );
}
