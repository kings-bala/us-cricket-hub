"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getItem, setItem } from "@/lib/storage";
import type { Academy, AcademyAttendance } from "@/types";

type PlayerProfile = {
  basic: { email: string; fullName: string; role: string };
};

export default function AttendancePage() {
  const { user } = useAuth();
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState<AcademyAttendance[]>([]);
  const [saved, setSaved] = useState(false);

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

  const allAttendance = getItem<AcademyAttendance[]>("academy_attendance", []);

  const loadDay = useCallback(
    (d: string) => {
      const dayRecords = allAttendance.filter((r) => r.date === d);
      const merged = enrolled.map((p) => {
        const existing = dayRecords.find((r) => r.playerEmail === p.basic.email.toLowerCase());
        return existing || { date: d, playerEmail: p.basic.email.toLowerCase(), present: false };
      });
      setRecords(merged);
      setSaved(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [academy, enrolled.length]
  );

  useEffect(() => {
    if (academy) loadDay(date);
  }, [academy, date, loadDay]);

  const toggle = (email: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.playerEmail === email ? { ...r, present: !r.present } : r))
    );
    setSaved(false);
  };

  const markAll = (present: boolean) => {
    setRecords((prev) => prev.map((r) => ({ ...r, present })));
    setSaved(false);
  };

  const save = () => {
    const rest = allAttendance.filter((r) => r.date !== date);
    setItem("academy_attendance", [...rest, ...records]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const presentCount = records.filter((r) => r.present).length;
  const totalCount = records.length;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  const weeklyStats = last7.map((d) => {
    const dayRecs = allAttendance.filter((r) => r.date === d);
    const p = dayRecs.filter((r) => r.present).length;
    return { date: d, present: p, total: dayRecs.length || enrolled.length };
  });

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/academy" className="text-sm text-slate-400 hover:text-white mb-4 inline-block">← Academy Dashboard</Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Attendance</h1>
            <p className="text-slate-400 text-sm">Mark daily attendance for your players</p>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{presentCount}</div>
            <div className="text-xs text-slate-400">Present</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{totalCount - presentCount}</div>
            <div className="text-xs text-slate-400">Absent</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%</div>
            <div className="text-xs text-slate-400">Rate</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => markAll(true)} className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors">All Present</button>
              <button onClick={() => markAll(false)} className="text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-colors">All Absent</button>
            </div>
          </div>

          {enrolled.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No players enrolled yet.</p>
              <Link href="/academy/invite" className="text-emerald-400 text-sm hover:underline mt-1 inline-block">Invite players →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {enrolled.map((p) => {
                const rec = records.find((r) => r.playerEmail === p.basic.email.toLowerCase());
                const isPresent = rec?.present ?? false;
                return (
                  <button
                    key={p.basic.email}
                    onClick={() => toggle(p.basic.email.toLowerCase())}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      isPresent ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-slate-700 border border-slate-600"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      isPresent ? "bg-emerald-500" : "bg-slate-600"
                    }`}>
                      {p.basic.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{p.basic.fullName}</div>
                      <div className="text-xs text-slate-400">{p.basic.role}</div>
                    </div>
                    <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isPresent ? "bg-emerald-500 text-white" : "bg-slate-600 text-slate-300"
                    }`}>
                      {isPresent ? "Present" : "Absent"}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {enrolled.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={save}
                className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Save Attendance
              </button>
              {saved && <span className="text-sm text-emerald-400">Saved!</span>}
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Last 7 Days</h2>
          <div className="grid grid-cols-7 gap-2">
            {weeklyStats.reverse().map((s) => {
              const pct = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
              const dayLabel = new Date(s.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
              const isToday = s.date === new Date().toISOString().slice(0, 10);
              return (
                <button
                  key={s.date}
                  onClick={() => setDate(s.date)}
                  className={`text-center p-2 rounded-lg transition-colors ${
                    s.date === date ? "bg-emerald-500/20 border border-emerald-500/40" : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  <div className="text-xs text-slate-400">{dayLabel}</div>
                  <div className={`text-lg font-bold ${pct > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                    {s.total > 0 ? `${pct}%` : "—"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {s.total > 0 ? `${s.present}/${s.total}` : "N/A"}
                  </div>
                  {isToday && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mx-auto mt-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
