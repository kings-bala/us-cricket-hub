"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { coaches } from "@/data/mock";

type Specialization = "Batting" | "Bowling" | "Fielding" | "Wicket-Keeping" | "All-Round" | "Fitness";

export default function CoachesPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<string>("All");
  const [specialization, setSpecialization] = useState<Specialization | "All">("All");
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    let result = [...coaches];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.specialization.toLowerCase().includes(q)
      );
    }
    if (country !== "All") result = result.filter((c) => c.country === country);
    if (specialization !== "All") result = result.filter((c) => c.specialization === specialization);
    if (minRating > 0) result = result.filter((c) => c.rating >= minRating);

    return result.sort((a, b) => b.rating - a.rating);
  }, [search, country, specialization, minRating]);

  const countries = useMemo(() => {
    const set = new Set(coaches.map((c) => c.country));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Global Coach Directory</h1>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">Worldwide</span>
        </div>
        <p className="text-slate-400">
          Connect with world-class cricket coaches from around the globe. Get personalized training and mentorship.
        </p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search coaches by name, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value as Specialization | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Specializations</option>
            <option value="Batting">Batting</option>
            <option value="Bowling">Bowling</option>
            <option value="Fielding">Fielding</option>
            <option value="Wicket-Keeping">Wicket-Keeping</option>
            <option value="All-Round">All-Round</option>
            <option value="Fitness">Fitness</option>
          </select>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value={0}>Any Rating</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
            <option value={4.8}>4.8+ Stars</option>
          </select>
        </div>
        <div className="mt-3 text-sm text-slate-500">
          Showing {filtered.length} of {coaches.length} coaches
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((coach) => (
          <div key={coach.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all group">
            <div className="flex items-center gap-4 mb-4">
              {coach.avatar ? (
                <Image src={coach.avatar} alt={coach.name} width={56} height={56} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {coach.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {coach.name}
                </h3>
                <p className="text-sm text-slate-400">{coach.country} &middot; {coach.region}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Specialization</p>
                <p className="text-sm text-emerald-400 font-medium">{coach.specialization}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-amber-400">{coach.rating}</p>
                  <p className="text-xs text-slate-500">Rating</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-white">{coach.experience}y</p>
                  <p className="text-xs text-slate-500">Experience</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Certifications</p>
              <div className="flex flex-wrap gap-1">
                {coach.certifications.slice(0, 2).map((cert, i) => (
                  <span key={i} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{cert}</span>
                ))}
                {coach.certifications.length > 2 && (
                  <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded-full">+{coach.certifications.length - 2}</span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Languages</p>
              <p className="text-sm text-slate-300">{coach.languages.join(", ")}</p>
            </div>

            {coach.leagueExperience && coach.leagueExperience.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">League Experience</p>
                <div className="flex flex-wrap gap-1">
                  {coach.leagueExperience.map((league, i) => (
                    <span key={i} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">{league}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <span className={`text-xs px-2 py-1 rounded-full ${coach.availability === "available" ? "bg-emerald-500/20 text-emerald-400" : coach.availability === "limited" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>
                {coach.availability}
              </span>
              <button className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No coaches match your filters</p>
          <button
            onClick={() => { setSearch(""); setCountry("All"); setSpecialization("All"); setMinRating(0); }}
            className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
