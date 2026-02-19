"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getItem, setItem } from "@/lib/storage";
import type { Academy, AcademyStaff, StaffRole } from "@/types";

const STAFF_ROLES: StaffRole[] = [
  "Head Coach", "Assistant Coach", "Bowling Coach", "Batting Coach",
  "Fielding Coach", "Fitness Trainer", "Physio", "Manager", "Analyst", "Other",
];

const roleColors: Record<string, string> = {
  "Head Coach": "bg-emerald-500",
  "Assistant Coach": "bg-blue-500",
  "Bowling Coach": "bg-purple-500",
  "Batting Coach": "bg-amber-500",
  "Fielding Coach": "bg-cyan-500",
  "Fitness Trainer": "bg-red-500",
  "Physio": "bg-pink-500",
  "Manager": "bg-indigo-500",
  "Analyst": "bg-teal-500",
  "Other": "bg-slate-500",
};

export default function StaffPage() {
  const { user } = useAuth();
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [staff, setStaff] = useState<AcademyStaff[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("Assistant Coach");
  const [specialization, setSpecialization] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const academies = getItem<Academy[]>("academies", []);
    const mine = academies.find(
      (a) => a.adminEmail.toLowerCase() === user.email.toLowerCase() || a.id === user.academyId
    );
    if (mine) {
      setAcademy(mine);
      const allStaff = getItem<AcademyStaff[]>("academy_staff", []);
      setStaff(allStaff.filter((s) => s.academyId === mine.id));
    }
  }, [user]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRole("Assistant Coach");
    setSpecialization("");
    setEditing(null);
    setError("");
    setShowForm(false);
  };

  const handleSave = () => {
    setError("");
    if (!name.trim()) { setError("Name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    if (!academy) return;

    const allStaff = getItem<AcademyStaff[]>("academy_staff", []);

    if (editing) {
      const idx = allStaff.findIndex((s) => s.id === editing);
      if (idx >= 0) {
        allStaff[idx] = { ...allStaff[idx], name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), role, specialization: specialization.trim() };
      }
    } else {
      const duplicate = allStaff.find((s) => s.academyId === academy.id && s.email.toLowerCase() === email.trim().toLowerCase());
      if (duplicate) { setError("A staff member with this email already exists."); return; }

      allStaff.push({
        id: `staff_${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role,
        specialization: specialization.trim(),
        joinedAt: new Date().toISOString(),
        academyId: academy.id,
      });

      const academies = getItem<Academy[]>("academies", []);
      const aIdx = academies.findIndex((a) => a.id === academy.id);
      if (aIdx >= 0 && !academies[aIdx].coachEmails.includes(email.trim().toLowerCase())) {
        academies[aIdx].coachEmails.push(email.trim().toLowerCase());
        setItem("academies", academies);
      }
    }

    setItem("academy_staff", allStaff);
    setStaff(allStaff.filter((s) => s.academyId === academy.id));
    resetForm();
  };

  const handleEdit = (s: AcademyStaff) => {
    setName(s.name);
    setEmail(s.email);
    setPhone(s.phone);
    setRole(s.role);
    setSpecialization(s.specialization);
    setEditing(s.id);
    setShowForm(true);
  };

  const handleRemove = (id: string) => {
    if (!academy) return;
    const allStaff = getItem<AcademyStaff[]>("academy_staff", []);
    const member = allStaff.find((s) => s.id === id);
    const updated = allStaff.filter((s) => s.id !== id);
    setItem("academy_staff", updated);
    setStaff(updated.filter((s) => s.academyId === academy.id));

    if (member) {
      const academies = getItem<Academy[]>("academies", []);
      const aIdx = academies.findIndex((a) => a.id === academy.id);
      if (aIdx >= 0) {
        academies[aIdx].coachEmails = academies[aIdx].coachEmails.filter((e) => e !== member.email);
        setItem("academies", academies);
      }
    }
  };

  const filtered = filter === "all" ? staff : staff.filter((s) => s.role === filter);
  const coachCount = staff.filter((s) => s.role.includes("Coach")).length;
  const supportCount = staff.length - coachCount;

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
            <h1 className="text-2xl font-bold">Coaches & Staff</h1>
            <p className="text-slate-400 text-sm">Manage your academy coaching and support staff</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Add Staff
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{staff.length}</div>
            <div className="text-xs text-slate-400">Total Staff</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{coachCount}</div>
            <div className="text-xs text-slate-400">Coaches</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{supportCount}</div>
            <div className="text-xs text-slate-400">Support Staff</div>
          </div>
        </div>

        {showForm && (
          <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Staff Member" : "Add Staff Member"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Full Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Coach Ravi Kumar" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Email *</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="coach@example.com" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555-123-4567" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Role *</label>
                <select value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  {STAFF_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Specialization / Notes</label>
                <input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Fast bowling technique, Youth development" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
            </div>
            {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                {editing ? "Update" : "Add Staff Member"}
              </button>
              <button onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition-colors">Cancel</button>
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Staff Directory</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-xs focus:outline-none">
              <option value="all">All Roles</option>
              {STAFF_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <p className="text-slate-400 text-sm">No staff members yet.</p>
              <button onClick={() => { resetForm(); setShowForm(true); }} className="text-emerald-400 text-sm hover:underline mt-1">Add your first staff member →</button>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-3 bg-slate-700 rounded-lg">
                  <div className={`w-10 h-10 ${roleColors[s.role] || "bg-slate-500"} rounded-full flex items-center justify-center text-sm font-bold shrink-0`}>
                    {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.email}{s.phone ? ` · ${s.phone}` : ""}</div>
                    {s.specialization && <div className="text-xs text-slate-500 truncate">{s.specialization}</div>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${roleColors[s.role] || "bg-slate-500"}/20 text-white shrink-0`}>
                    {s.role}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleEdit(s)} className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1">Edit</button>
                    <button onClick={() => handleRemove(s.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
