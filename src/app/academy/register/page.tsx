"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getItem, setItem } from "@/lib/storage";
import type { Academy, AcademySeatPlan } from "@/types";

const SEAT_LIMITS: Record<AcademySeatPlan, number> = { free: 5, starter: 25, pro: 50, enterprise: 200 };

export default function AcademyRegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [headCoach, setHeadCoach] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [plan, setPlan] = useState<AcademySeatPlan>("free");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !headCoach || !contactEmail) {
      setError("Please fill all required fields.");
      return;
    }
    setSaving(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const academy: Academy = {
      id: `academy_${Date.now()}`,
      name,
      location,
      logo: "",
      headCoach,
      contactEmail,
      adminEmail: user?.email || contactEmail,
      joinCode: code,
      seatPlan: plan,
      maxSeats: SEAT_LIMITS[plan],
      playerEmails: [],
      coachEmails: [],
      createdAt: new Date().toISOString(),
    };
    const academies = getItem<Academy[]>("academies", []);
    academies.push(academy);
    setItem("academies", academies);

    if (user) {
      const profiles = getItem<Record<string, unknown>[]>("profiles", []);
      const reg = profiles.find(
        (p) => (p.basic as { email: string })?.email?.toLowerCase() === user.email.toLowerCase()
      );
      if (reg) {
        (reg as Record<string, unknown>).academyId = academy.id;
        setItem("profiles", profiles);
      }
      setItem("auth_user", { ...user, role: "academy_admin" as const, academyId: academy.id });
    }

    setTimeout(() => router.push("/academy"), 300);
  };

  const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none text-sm";

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-slate-400 hover:text-white mb-4 inline-block">← Back to Home</Link>
        <h1 className="text-3xl font-bold mb-2">Register Your Academy</h1>
        <p className="text-slate-400 mb-8">Onboard your cricket academy and manage your players on CricVerse360.</p>

        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-emerald-400">Academy Details</h2>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Academy Name *</label>
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. NorCal Cricket Academy" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Location *</label>
              <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Jose, CA" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Head Coach *</label>
              <input className={inputClass} value={headCoach} onChange={(e) => setHeadCoach(e.target.value)} placeholder="e.g. Coach Ravi Kumar" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Contact Email *</label>
              <input className={inputClass} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="academy@example.com" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-emerald-400 mb-4">Choose a Seat Plan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                { id: "free" as const, label: "Free", seats: 5, price: "$0/mo" },
                { id: "starter" as const, label: "Starter", seats: 25, price: "$49/mo" },
                { id: "pro" as const, label: "Pro", seats: 50, price: "$89/mo" },
                { id: "enterprise" as const, label: "Enterprise", seats: 200, price: "Custom" },
              ]).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${plan === p.id ? "border-emerald-500 bg-emerald-500/10" : "border-slate-600 bg-slate-700 hover:border-slate-500"}`}
                >
                  <div className="font-semibold text-sm">{p.label}</div>
                  <div className="text-2xl font-bold text-emerald-400 my-1">{p.seats}</div>
                  <div className="text-xs text-slate-400">seats</div>
                  <div className="text-xs text-slate-300 mt-1">{p.price}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? "Creating Academy..." : "Create Academy"}
          </button>
        </form>
      </div>
    </main>
  );
}
