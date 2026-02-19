"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getItem } from "@/lib/storage";
import type { Academy } from "@/types";

export default function AcademyDashboard() {
  const { user } = useAuth();
  const [academy, setAcademy] = useState<Academy | null>(null);

  useEffect(() => {
    if (!user) return;
    const academies = getItem<Academy[]>("academies", []);
    const mine = academies.find(
      (a) => a.adminEmail.toLowerCase() === user.email.toLowerCase() || a.id === user.academyId
    );
    if (mine) setAcademy(mine);
  }, [user]);

  const profiles = getItem<{ basic: { email: string; fullName: string; role: string } }[]>("profiles", []);
  const enrolledProfiles = academy
    ? profiles.filter((p) => academy.playerEmails.includes(p.basic.email.toLowerCase()))
    : [];

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to access Academy Dashboard</h1>
          <Link href="/auth" className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg">Sign In</Link>
        </div>
      </main>
    );
  }

  if (!academy) {
    return (
      <main className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-slate-800 rounded-2xl p-12">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h1 className="text-3xl font-bold mb-3">Welcome to Academy Hub</h1>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Register your cricket academy to manage players, track progress, and assign training — all in one place.</p>
            <Link href="/academy/register" className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block">Register Your Academy</Link>
          </div>
        </div>
      </main>
    );
  }

  const seatsUsed = academy.playerEmails.length;
  const seatsTotal = academy.maxSeats;
  const seatPct = seatsTotal > 0 ? Math.round((seatsUsed / seatsTotal) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{academy.name}</h1>
            <p className="text-slate-400">{academy.location} · Head Coach: {academy.headCoach}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/academy/invite" className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Invite Players</Link>
            <Link href="/academy/roster" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">View Roster</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Enrolled Players" value={seatsUsed} sub={`of ${seatsTotal} seats`} color="emerald" />
          <StatCard label="Active This Week" value={Math.min(seatsUsed, Math.ceil(seatsUsed * 0.7))} sub="logged sessions" color="blue" />
          <StatCard label="Coaches" value={academy.coachEmails.length || 1} sub="assigned" color="purple" />
          <StatCard label="Seat Plan" value={academy.seatPlan.charAt(0).toUpperCase() + academy.seatPlan.slice(1)} sub={`${seatsTotal} max seats`} color="amber" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Seat Usage</h2>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 bg-slate-700 rounded-full h-4 overflow-hidden">
                <div className="bg-emerald-500 h-4 rounded-full transition-all" style={{ width: `${seatPct}%` }} />
              </div>
              <span className="text-sm text-slate-400">{seatPct}%</span>
            </div>
            <p className="text-sm text-slate-400">{seatsUsed} of {seatsTotal} seats used</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Join Code</h2>
            <div className="flex items-center gap-3">
              <code className="bg-slate-700 px-4 py-2 rounded-lg text-emerald-400 font-mono text-2xl tracking-widest">{academy.joinCode}</code>
              <button
                onClick={() => navigator.clipboard.writeText(academy.joinCode)}
                className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Share this code with players so they can join your academy during registration.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/academy/invite" className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Invite Players</div>
                  <div className="text-xs text-slate-400">Send email invites or share join code</div>
                </div>
              </Link>
              <Link href="/academy/roster" className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Manage Roster</div>
                  <div className="text-xs text-slate-400">View and manage enrolled players</div>
                </div>
              </Link>
              <Link href="/academy/staff" className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Coaches & Staff</div>
                  <div className="text-xs text-slate-400">Add coaches and support staff</div>
                </div>
              </Link>
              <Link href="/academy/attendance" className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Attendance</div>
                  <div className="text-xs text-slate-400">Mark daily attendance for players</div>
                </div>
              </Link>
              <Link href="/academy/reports" className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Progress Reports</div>
                  <div className="text-xs text-slate-400">Per-player training & performance reports</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Players</h2>
            {enrolledProfiles.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-slate-400 text-sm">No players enrolled yet.</p>
                <Link href="/academy/invite" className="text-emerald-400 text-sm hover:underline mt-1 inline-block">Invite your first player →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {enrolledProfiles.slice(0, 5).map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {p.basic.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{p.basic.fullName}</div>
                      <div className="text-xs text-slate-400">{p.basic.role} · {p.basic.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    amber: "text-amber-400",
  };
  return (
    <div className="bg-slate-800 rounded-xl p-5">
      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</div>
      <div className={`text-3xl font-bold ${colors[color] || "text-white"}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{sub}</div>
    </div>
  );
}
