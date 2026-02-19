"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getItem, setItem } from "@/lib/storage";
import type { Academy } from "@/types";

export default function AcademyInvitePage() {
  const { user } = useAuth();
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [emails, setEmails] = useState("");
  const [invited, setInvited] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const academies = getItem<Academy[]>("academies", []);
    const mine = academies.find(
      (a) => a.adminEmail.toLowerCase() === user.email.toLowerCase() || a.id === user.academyId
    );
    if (mine) setAcademy(mine);
  }, [user]);

  const handleInvite = () => {
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
    for (const email of emailList) {
      if (!academies[idx].playerEmails.includes(email)) {
        academies[idx].playerEmails.push(email);
        newEmails.push(email);
      }
    }
    setItem("academies", academies);
    setAcademy({ ...academy, playerEmails: academies[idx].playerEmails });
    setInvited(newEmails);
    setEmails("");
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
        <h1 className="text-2xl font-bold mb-2">Invite Players</h1>
        <p className="text-slate-400 text-sm mb-8">{seatsLeft} seats remaining on your {academy.seatPlan} plan</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-1">Option 1: Share Join Code</h2>
            <p className="text-xs text-slate-400 mb-4">Players enter this code during registration to join your academy.</p>
            <div className="flex items-center gap-3 mb-3">
              <code className="bg-slate-700 px-4 py-3 rounded-lg text-emerald-400 font-mono text-2xl tracking-widest flex-1 text-center">{academy.joinCode}</code>
              <button onClick={copyJoinCode} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-3 rounded-lg text-sm font-medium transition-colors shrink-0">Copy</button>
            </div>
            <p className="text-xs text-slate-500">Share this code via WhatsApp, email, or in-person.</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-1">Option 2: Add by Email</h2>
            <p className="text-xs text-slate-400 mb-4">Add player emails directly to pre-approve their seat.</p>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder={"player1@email.com\nplayer2@email.com\nplayer3@email.com"}
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none resize-none mb-3"
            />
            {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
            <button onClick={handleInvite} className="w-full bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg text-sm font-medium transition-colors">Add Players</button>
          </div>
        </div>

        {invited.length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8">
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">Players Added Successfully</h3>
            <div className="flex flex-wrap gap-2">
              {invited.map((email) => (
                <span key={email} className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-xs">{email}</span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Current Roster ({academy.playerEmails.length} players)</h2>
          {academy.playerEmails.length === 0 ? (
            <p className="text-slate-400 text-sm">No players enrolled yet.</p>
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
