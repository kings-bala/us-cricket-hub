"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getItem } from "@/lib/storage";
import type { Academy } from "@/types";

type PlayerProfile = {
  basic: { email: string; fullName: string; role: string; ageGroup: string; battingStyle: string; bowlingStyle: string };
  cric: { totalMatches: string; totalRuns: string; totalWickets: string; battingAverage: string; bowlingAverage: string; strikeRate: string; economy: string };
};

type SessionLog = { date: string; type: string; duration: string; notes: string; email?: string };

export default function AcademyReportsPage() {
  const { user } = useAuth();
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const academies = getItem<Academy[]>("academies", []);
    const mine = academies.find(
      (a) => a.adminEmail.toLowerCase() === user.email.toLowerCase() || a.id === user.academyId
    );
    if (mine) setAcademy(mine);
  }, [user]);

  const profiles = getItem<PlayerProfile[]>("profiles", []);
  const enrolled = academy
    ? profiles.filter((p) => academy.playerEmails.includes(p.basic.email.toLowerCase()))
    : [];

  const sessions = getItem<SessionLog[]>("session_logs", []);

  const selectedProfile = selected ? enrolled.find((p) => p.basic.email === selected) : null;
  const selectedSessions = selected ? sessions.filter((s) => s.email?.toLowerCase() === selected.toLowerCase()) : [];

  if (!academy) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Academy Found</h1>
          <Link href="/academy/register" className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg">Register Academy</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/academy" className="text-sm text-slate-400 hover:text-white mb-4 inline-block">← Academy Dashboard</Link>
        <h1 className="text-2xl font-bold mb-2">Progress Reports</h1>
        <p className="text-slate-400 text-sm mb-8">View per-player training and performance reports.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Players ({enrolled.length})</h2>
              {enrolled.length === 0 ? (
                <p className="text-sm text-slate-500">No enrolled players.</p>
              ) : (
                <div className="space-y-1">
                  {enrolled.map((p) => (
                    <button
                      key={p.basic.email}
                      onClick={() => setSelected(p.basic.email)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${selected === p.basic.email ? "bg-emerald-500/20 border border-emerald-500/40" : "bg-slate-700 hover:bg-slate-600"}`}
                    >
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {p.basic.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{p.basic.fullName}</div>
                        <div className="text-xs text-slate-400">{p.basic.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            {!selectedProfile ? (
              <div className="bg-slate-800 rounded-xl p-12 text-center">
                <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-slate-400">Select a player to view their report</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-lg font-bold">
                      {selectedProfile.basic.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedProfile.basic.fullName}</h2>
                      <p className="text-sm text-slate-400">{selectedProfile.basic.role} · {selectedProfile.basic.ageGroup || "N/A"} · {selectedProfile.basic.battingStyle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MiniStat label="Matches" value={selectedProfile.cric?.totalMatches || "0"} />
                    <MiniStat label="Runs" value={selectedProfile.cric?.totalRuns || "0"} />
                    <MiniStat label="Wickets" value={selectedProfile.cric?.totalWickets || "0"} />
                    <MiniStat label="Bat Avg" value={selectedProfile.cric?.battingAverage || "0"} />
                    <MiniStat label="Strike Rate" value={selectedProfile.cric?.strikeRate || "0"} />
                    <MiniStat label="Bowl Avg" value={selectedProfile.cric?.bowlingAverage || "0"} />
                    <MiniStat label="Economy" value={selectedProfile.cric?.economy || "0"} />
                    <MiniStat label="Sessions" value={String(selectedSessions.length)} />
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3">Training Sessions</h3>
                  {selectedSessions.length === 0 ? (
                    <p className="text-sm text-slate-400">No training sessions logged yet for this player.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedSessions.slice(0, 10).map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                          <div className="text-xs text-slate-400 w-20 shrink-0">{s.date}</div>
                          <div className="flex-1">
                            <span className="text-sm font-medium">{s.type}</span>
                            {s.duration && <span className="text-xs text-slate-400 ml-2">({s.duration})</span>}
                          </div>
                          {s.notes && <span className="text-xs text-slate-400 truncate max-w-[200px]">{s.notes}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3">Coach Assessment</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <SkillBar label="Batting" value={randomScore(selectedProfile.cric?.totalRuns)} />
                    <SkillBar label="Bowling" value={randomScore(selectedProfile.cric?.totalWickets)} />
                    <SkillBar label="Fielding" value={45 + Math.floor(Math.random() * 30)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700 rounded-lg p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-lg font-bold text-emerald-400">{value}</div>
    </div>
  );
}

function SkillBar({ label, value }: { label: string; value: number }) {
  const capped = Math.min(100, Math.max(0, value));
  const color = capped >= 70 ? "bg-emerald-500" : capped >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{capped}%</span>
      </div>
      <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${capped}%` }} />
      </div>
    </div>
  );
}

function randomScore(stat: string | undefined): number {
  const v = Number(stat) || 0;
  if (v > 500) return 80 + Math.floor(Math.random() * 15);
  if (v > 100) return 60 + Math.floor(Math.random() * 20);
  if (v > 0) return 40 + Math.floor(Math.random() * 20);
  return 30 + Math.floor(Math.random() * 20);
}
