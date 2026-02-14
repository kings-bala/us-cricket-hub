"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { players, t20Teams, t20Leagues, regionColors, roleIcons, leagueBrandColors } from "@/data/mock";
import { AgeGroup, PlayerRole, BowlingStyle } from "@/types";

export default function ScoutingPage() {
  const [country, setCountry] = useState<string>("All");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "All">("All");
  const [role, setRole] = useState<PlayerRole | "All">("All");
  const [bowlingStyle, setBowlingStyle] = useState<BowlingStyle | "All">("All");
  const [maxEconomy, setMaxEconomy] = useState<number>(10);
  const [minRuns, setMinRuns] = useState<number>(0);
  const [minWickets, setMinWickets] = useState<number>(0);
  const [minBowlingSpeed, setMinBowlingSpeed] = useState<number>(0);
  const [draftReady, setDraftReady] = useState(false);

  const filtered = useMemo(() => {
    let result = players.filter((p) => p.verified);

    if (country !== "All") result = result.filter((p) => p.country === country);
    if (ageGroup !== "All") result = result.filter((p) => p.ageGroup === ageGroup);
    if (role !== "All") result = result.filter((p) => p.role === role);
    if (bowlingStyle !== "All") result = result.filter((p) => p.bowlingStyle === bowlingStyle);
    if (maxEconomy < 10) result = result.filter((p) => p.stats.economy > 0 && p.stats.economy <= maxEconomy);
    if (minRuns > 0) result = result.filter((p) => p.stats.runs >= minRuns);
    if (minWickets > 0) result = result.filter((p) => p.stats.wickets >= minWickets);
    if (minBowlingSpeed > 0) result = result.filter((p) => p.fitnessData.bowlingSpeed && p.fitnessData.bowlingSpeed >= minBowlingSpeed);
    if (draftReady) result = result.filter((p) => p.ageGroup === "U19" || p.ageGroup === "U21");

    return result;
  }, [country, ageGroup, role, bowlingStyle, maxEconomy, minRuns, minWickets, minBowlingSpeed, draftReady]);

  const countries = useMemo(() => {
    const set = new Set(players.filter((p) => p.verified).map((p) => p.country));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Pro Scouting Dashboard</h1>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30">T20 Owners</span>
          </div>
          <p className="text-slate-400">Advanced global talent search for T20 franchise scouting</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {t20Leagues.map((league) => {
          return (
            <div key={league.id} className="flex-shrink-0">
              <div className={`relative rounded-xl overflow-hidden h-20 w-32 cursor-pointer group`}>
                <Image src={league.bgImage} alt={league.name} fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="128px" />
                <div className={`absolute inset-0 bg-gradient-to-t ${league.brandColor} opacity-80`} />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center">
                  {league.logo ? (
                    <Image src={league.logo} alt={league.name} width={36} height={36} className="object-contain drop-shadow-lg mb-1" />
                  ) : (
                    <p className="text-sm font-extrabold text-white drop-shadow-lg">{league.id}</p>
                  )}
                  <p className="text-[10px] text-white/70">{league.teams} teams</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-4 gap-4 mb-6">
        {t20Teams.slice(0, 4).map((team) => {
          const colors = leagueBrandColors[team.league] || { gradient: "from-purple-500 to-blue-500", bg: "bg-slate-500/20", text: "text-slate-400" };
          return (
            <div key={team.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-3 mb-2">
                {team.logo ? (
                  <Image src={team.logo} alt={team.name} width={40} height={40} className="w-10 h-10 object-contain" />
                ) : (
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                    {team.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{team.name}</p>
                  <p className="text-xs text-slate-400">{team.city} <span className={`${colors.text} font-medium`}>{team.league}</span></p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Local Quota</span>
                <span className={`font-semibold ${team.localFilled >= team.localQuota ? "text-emerald-400" : "text-amber-400"}`}>
                  {team.localFilled}/{team.localQuota}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                <div
                  className={`h-1.5 rounded-full ${team.localFilled >= team.localQuota ? "bg-emerald-500" : "bg-amber-500"}`}
                  style={{ width: `${(team.localFilled / team.localQuota) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Advanced Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
              <option value="All">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Age Group</label>
            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as AgeGroup | "All")} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
              <option value="All">All Ages</option>
              <option value="U15">U15</option>
              <option value="U17">U17</option>
              <option value="U19">U19</option>
              <option value="U21">U21</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as PlayerRole | "All")} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
              <option value="All">All Roles</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
              <option value="Wicket-Keeper">Wicket-Keeper</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Bowling Style</label>
            <select value={bowlingStyle} onChange={(e) => setBowlingStyle(e.target.value as BowlingStyle | "All")} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
              <option value="All">All Styles</option>
              <option value="Right-arm Fast">Right-arm Fast</option>
              <option value="Left-arm Fast">Left-arm Fast</option>
              <option value="Right-arm Medium">Right-arm Medium</option>
              <option value="Left-arm Medium">Left-arm Medium</option>
              <option value="Right-arm Off-spin">Right-arm Off-spin</option>
              <option value="Left-arm Orthodox">Left-arm Orthodox</option>
              <option value="Right-arm Leg-spin">Right-arm Leg-spin</option>
              <option value="Left-arm Chinaman">Left-arm Chinaman</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Max Economy</label>
            <input type="number" value={maxEconomy} onChange={(e) => setMaxEconomy(Number(e.target.value))} step={0.5} min={0} max={15} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Min Runs</label>
            <input type="number" value={minRuns} onChange={(e) => setMinRuns(Number(e.target.value))} step={100} min={0} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Min Wickets</label>
            <input type="number" value={minWickets} onChange={(e) => setMinWickets(Number(e.target.value))} step={5} min={0} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Min Bowl Speed (km/h)</label>
            <input type="number" value={minBowlingSpeed} onChange={(e) => setMinBowlingSpeed(Number(e.target.value))} step={5} min={0} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 w-full">
              <input type="checkbox" checked={draftReady} onChange={(e) => setDraftReady(e.target.checked)} className="rounded border-slate-600 bg-slate-900 text-emerald-500" />
              Draft-Ready Only
            </label>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">{filtered.length} players match your criteria</span>
          <button onClick={() => { setCountry("All"); setAgeGroup("All"); setRole("All"); setBowlingStyle("All"); setMaxEconomy(10); setMinRuns(0); setMinWickets(0); setMinBowlingSpeed(0); setDraftReady(false); }} className="text-xs text-emerald-400 hover:text-emerald-300">
            Reset Filters
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs text-slate-400 font-medium uppercase">#</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 font-medium uppercase">Player</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 font-medium uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 font-medium uppercase">Country</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 font-medium uppercase">Age</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 font-medium uppercase">Mat</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 font-medium uppercase">Runs</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 font-medium uppercase">Bat Avg</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 font-medium uppercase">SR</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 font-medium uppercase">Wkts</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 font-medium uppercase">Econ</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 font-medium uppercase">Speed</th>
                <th className="text-center px-4 py-3 text-xs text-slate-400 font-medium uppercase">Tier</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/players/${p.id}`} className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                      {p.avatar ? (
                        <Image src={p.avatar} alt={p.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {p.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.city}, {p.country}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{roleIcons[p.role]} {p.role}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${regionColors[p.region] || "bg-slate-700/50 text-slate-300"}`}>{p.country}</span></td>
                  <td className="px-4 py-3 text-slate-300">{p.ageGroup}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{p.stats.matches}</td>
                  <td className="px-4 py-3 text-right text-white font-medium">{p.stats.runs}</td>
                  <td className="px-4 py-3 text-right text-white">{p.stats.battingAverage}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{p.stats.strikeRate}</td>
                  <td className="px-4 py-3 text-right text-white font-medium">{p.stats.wickets}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{p.stats.economy || "-"}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{p.fitnessData.bowlingSpeed ? `${p.fitnessData.bowlingSpeed}` : "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.profileTier === "Elite" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                      {p.profileTier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No players match your scouting criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
