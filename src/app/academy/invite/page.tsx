"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getItem, setItem } from "@/lib/storage";
import type { Academy, PlayerLevel, AcademyStaff } from "@/types";

type InviteMode = "kids" | "staff";

export default function AcademyInvitePage() {
  const { user } = useAuth();
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [emails, setEmails] = useState("");
  const [defaultLevel, setDefaultLevel] = useState<PlayerLevel>("Beginner");
  const [invited, setInvited] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<InviteMode>("kids");
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("Assistant Coach");
  const [invitedStaff, setInvitedStaff] = useState<string[]>([]);

  const isOwnerOrAdmin = user?.role === "academy_admin" || user?.role === "admin";

  useEffect(() => {
    if (!user) return;
    const academies = getItem<Academy[]>("academies", []);
    const mine = academies.find(
      (a) => a.adminEmail.toLowerCase() === user.email.toLowerCase() || a.id === user.academyId
    ) || (user.role === "admin" ? academies[0] : undefined);
    if (mine) setAcademy(mine);
  }, [user]);

  const handleInviteKids = () => {
    if (!academy) return;
    setError("");
    const emailList = emails.split(/[,\n]/).map((e) => e.trim().toLowerCase()).filter(Boolean);
    if (emailList.length === 0) { setError("Enter at least one email."); return; }

    const remaining = academy.maxSeats - academy.playerEmails.length;
    if (emailList.length > remaining) {
      setError(`Only ${remaining} seats remaining. Reduce the number of invites or upgrade your plan.`);
      return;
    }

    const academies = getItem<Academy[]>("academies", []);
    const idx = academies.findIndex((a) => a.id === academy.id);
    if (idx < 0) return;

    const newEmails: string[] = [];
    const profiles = getItem<{ basic: { email: string; fullName: string; role: string; ageGroup: string; battingStyle: string; bowlingStyle: string; level?: PlayerLevel }; cric: { totalMatches: string; totalRuns: string; totalWickets: string; battingAverage: string; strikeRate: string } }[]>("profiles", []);
    for (const email of emailList) {
      if (!academies[idx].playerEmails.includes(email)) {
        academies[idx].playerEmails.push(email);
        newEmails.push(email);
        const pIdx = profiles.findIndex((p) => p.basic.email.toLowerCase() === email);
        if (pIdx >= 0) { profiles[pIdx].basic.level = defaultLevel; }
      }
    }
    setItem("profiles", profiles);
    setItem("academies", academies);
    setAcademy({ ...academy, playerEmails: academies[idx].playerEmails });
    setInvited(newEmails);
    setEmails("");
  };

  const handleInviteStaff = () => {
    if (!academy) return;
    setError("");
    const emailList = emails.split(/[,\n]/).map((e) => e.trim().toLowerCase()).filter(Boolean);
    if (emailList.length === 0) { setError("Enter at least one email."); return; }

    const allStaff = getItem<AcademyStaff[]>("academy_staff", []);
    const academies = getItem<Academy[]>("academies", []);
    const aIdx = academies.findIndex((a) => a.id === academy.id);
    const newStaff: string[] = [];

    for (const email of emailList) {
      const exists = allStaff.find((s) => s.academyId === academy.id && s.email === email);
      if (!exists) {
        allStaff.push({
          id: `staff_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: staffName.trim() || email.split("@")[0],
          email,
          phone: "",
          role: staffRole as AcademyStaff["role"],
          specialization: "",
          joinedAt: new Date().toISOString(),
          academyId: academy.id,
        });
        if (aIdx >= 0 && !academies[aIdx].coachEmails.includes(email)) {
          academies[aIdx].coachEmails.push(email);
        }
        newStaff.push(email);
      }
    }

    setItem("academy_staff", allStaff);
    if (aIdx >= 0) setItem("academies", academies);
    setInvitedStaff(newStaff);
    setEmails("");
    setStaffName("");
  };

  const copyJoinCode = () => {
    if (academy) navigator.clipboard.writeText(academy.joinCode);
  };

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

  const seatsLeft = academy.maxSeats - academy.playerEmails.length;

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/academy" className="text-sm text-slate-400 hover:text-white mb-4 inline-block">← Academy Dashboard</Link>
        <h1 className="text-2xl font-bold mb-2">Invite Members</h1>
        <p className="text-slate-400 text-sm mb-6">{academy.name} · {seatsLeft} seats remaining</p>

        {isOwnerOrAdmin && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode("kids"); setInvited([]); setInvitedStaff([]); setError(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "kids" ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
            >
              Invite Kids / Players
            </button>
            <button
              onClick={() => { setMode("staff"); setInvited([]); setInvitedStaff([]); setError(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "staff" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
            >
              Invite Coach / Staff
            </button>
          </div>
        )}

        {mode === "kids" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-1">Option 1: Share Join Code</h2>
                <p className="text-xs text-slate-400 mb-4">Kids enter this code during registration to join the academy.</p>
                <div className="flex items-center gap-3 mb-3">
                  <code className="bg-slate-700 px-4 py-3 rounded-lg text-emerald-400 font-mono text-2xl tracking-widest flex-1 text-center">{academy.joinCode}</code>
                  <button onClick={copyJoinCode} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-3 rounded-lg text-sm font-medium transition-colors shrink-0">Copy</button>
                </div>
                <p className="text-xs text-slate-500">Share this code via WhatsApp, email, or in-person.</p>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-1">Option 2: Add by Email</h2>
                <p className="text-xs text-slate-400 mb-4">Add kid emails directly to pre-approve their seat.</p>
                <textarea
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder={"kid1@email.com\nkid2@email.com\nkid3@email.com"}
                  rows={4}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none resize-none mb-3"
                />
                {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
                <div className="mb-3">
                  <label className="block text-xs text-slate-400 mb-1">Default Level</label>
                  <select value={defaultLevel} onChange={(e) => setDefaultLevel(e.target.value as PlayerLevel)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <button onClick={handleInviteKids} className="w-full bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg text-sm font-medium transition-colors">Add Kids</button>
              </div>
            </div>

            {invited.length > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8">
                <h3 className="text-sm font-semibold text-emerald-400 mb-2">Kids Invited Successfully</h3>
                <div className="flex flex-wrap gap-2">
                  {invited.map((email) => (
                    <span key={email} className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-xs">{email}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {mode === "staff" && (
          <>
            <div className="bg-slate-800 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold mb-1">Invite Coach or Staff Member</h2>
              <p className="text-xs text-slate-400 mb-4">Add coaches and staff to help manage the academy.</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Staff Name (optional)</label>
                  <input
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="e.g. Coach Ravi Kumar"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Role</label>
                  <select value={staffRole} onChange={(e) => setStaffRole(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none">
                    <option value="Head Coach">Head Coach</option>
                    <option value="Assistant Coach">Assistant Coach</option>
                    <option value="Bowling Coach">Bowling Coach</option>
                    <option value="Batting Coach">Batting Coach</option>
                    <option value="Fielding Coach">Fielding Coach</option>
                    <option value="Fitness Trainer">Fitness Trainer</option>
                    <option value="Manager">Manager</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email Address(es)</label>
                  <textarea
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder={"coach@email.com\nstaff@email.com"}
                    rows={3}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>
                {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
                <button onClick={handleInviteStaff} className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-sm font-medium transition-colors">Invite Staff</button>
              </div>
            </div>

            {invitedStaff.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
                <h3 className="text-sm font-semibold text-blue-400 mb-2">Staff Invited Successfully</h3>
                <div className="flex flex-wrap gap-2">
                  {invitedStaff.map((email) => (
                    <span key={email} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">{email}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Current Roster ({academy.playerEmails.length} kids enrolled)</h2>
          {academy.playerEmails.length === 0 ? (
            <p className="text-slate-400 text-sm">No kids enrolled yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {academy.playerEmails.map((email) => (
                <span key={email} className="bg-slate-700 px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center gap-2">
                  {email}
                  <button
                    onClick={() => {
                      const academies = getItem<Academy[]>("academies", []);
                      const idx = academies.findIndex((a) => a.id === academy.id);
                      if (idx >= 0) {
                        academies[idx].playerEmails = academies[idx].playerEmails.filter((e) => e !== email);
                        setItem("academies", academies);
                        setAcademy({ ...academy, playerEmails: academies[idx].playerEmails });
                      }
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
