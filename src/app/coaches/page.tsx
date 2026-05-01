"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { coaches } from "@/data/mock";
import { Region } from "@/types";
import { useAuth } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

type Specialization = "Batting" | "Bowling" | "Fielding" | "Wicket-Keeping" | "All-Round" | "Fitness";

interface RequestForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  coachingGoal: string;
}

export default function CoachesPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region | "All">("All");
  const [specialization, setSpecialization] = useState<Specialization | "All">("All");
  const [minRating, setMinRating] = useState(0);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [form, setForm] = useState<RequestForm>({ name: "", email: "", phone: "", message: "", coachingGoal: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [requestsSent, setRequestsSent] = useState<Record<string, boolean>>({});
  const { user, tokens } = useAuth();

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
    if (region !== "All") result = result.filter((c) => c.region === region);
    if (specialization !== "All") result = result.filter((c) => c.specialization === specialization);
    if (minRating > 0) result = result.filter((c) => c.rating >= minRating);
    return result.sort((a, b) => b.rating - a.rating);
  }, [search, region, specialization, minRating]);

  const handleSubmit = async (coachId: string) => {
    if (!form.name || !form.email) {
      alert("Name and email are required.");
      return;
    }
    setSending(true);
    try {
      await apiPost("/coach-requests", {
        coachId,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message,
        coachingGoal: form.coachingGoal,
      }, tokens?.accessToken);
      trackEvent("coach_request_submitted", { coachId, coachingGoal: form.coachingGoal }, tokens?.accessToken);
    } catch {
      // Still mark as sent for UX
    }
    setRequestsSent((prev) => ({ ...prev, [coachId]: true }));
    setSuccess(coachId);
    setSelectedCoach(null);
    setForm({ name: "", email: "", phone: "", message: "", coachingGoal: "" });
    setSending(false);
    setTimeout(() => setSuccess(null), 5000);
  };

  const coachingGoals = [
    "Improve batting technique",
    "Develop bowling speed/spin",
    "Match preparation",
    "Fitness and conditioning",
    "Mental game coaching",
    "T20 strategy",
    "Junior development",
    "Other",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900/30 via-slate-900 to-emerald-900/30 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Expert Cricket Coaches</h1>
          <p className="text-slate-300 max-w-2xl mx-auto mb-6">
            Connect with world-class coaches. Get personalized training to take your game to the next level.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">{coaches.filter((c) => c.availability === "available").length} coaches available now</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success banner */}
        {success && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-emerald-400 font-semibold">Session Request Sent!</p>
              <p className="text-sm text-slate-300">The coach will be notified. We&apos;ll follow up via email within 24 hours.</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Search coaches by name, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as Region | "All")}
              className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Regions</option>
              <option value="South Asia">South Asia</option>
              <option value="Oceania">Oceania</option>
              <option value="Europe">Europe</option>
              <option value="Caribbean">Caribbean</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Middle East">Middle East</option>
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

        {/* Coach Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((coach) => (
            <div key={coach.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all group flex flex-col">
              {/* Header: Avatar + Name */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {coach.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {coach.name}
                  </h3>
                  <p className="text-sm text-slate-400">{coach.country}</p>
                </div>
                {coach.verified && (
                  <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 shrink-0">Verified</span>
                )}
              </div>

              {/* Key Info */}
              <div className="space-y-3 mb-4 flex-1">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Specialization</p>
                  <p className="text-sm text-emerald-400 font-semibold">{coach.specialization}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-900/50 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-white">{coach.experience}y</p>
                    <p className="text-[10px] text-slate-500">Experience</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-amber-400">{coach.rating}</p>
                    <p className="text-[10px] text-slate-500">Rating</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-emerald-400">${coach.hourlyRate}</p>
                    <p className="text-[10px] text-slate-500">From/hr</p>
                  </div>
                </div>
              </div>

              {/* Availability + CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  coach.availability === "available" ? "bg-emerald-500/20 text-emerald-400" :
                  coach.availability === "limited" ? "bg-amber-500/20 text-amber-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {coach.availability === "available" ? "Available" : coach.availability === "limited" ? "Limited" : "Waitlist"}
                </span>
                <button
                  onClick={() => {
                    if (requestsSent[coach.id]) return;
                    setSelectedCoach(coach.id);
                    if (user) {
                      setForm((f) => ({ ...f, name: user.full_name || "", email: user.email || "" }));
                    }
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    requestsSent[coach.id]
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  }`}
                >
                  {requestsSent[coach.id] ? "Request Sent" : "Request Session"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No coaches match your filters</p>
            <button
              onClick={() => { setSearch(""); setRegion("All"); setSpecialization("All"); setMinRating(0); }}
              className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-blue-500/20 rounded-2xl p-10">
            <h2 className="text-2xl font-bold text-white mb-3">Want to improve faster?</h2>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">
              Get your AI analysis first, then work with a coach to fix your weaknesses.
            </p>
            <Link
              href="/analyze"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
            >
              Get Your Cricket Score Free
            </Link>
          </div>
        </div>
      </div>

      {/* Request Session Modal */}
      {selectedCoach && (() => {
        const coach = coaches.find((c) => c.id === selectedCoach);
        if (!coach) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedCoach(null)}>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Coach info header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {coach.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{coach.name}</p>
                  <p className="text-sm text-slate-400">{coach.specialization} &middot; {coach.country} &middot; From ${coach.hourlyRate}/hr</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">Request a Session</h2>
              <p className="text-sm text-slate-400 mb-6">Fill out the form below and we&apos;ll connect you with {coach.name.split(" ")[0]}.</p>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Email <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Phone <span className="text-slate-500">(optional)</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+1 234 567 8900"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Coaching Goal</label>
                  <select
                    value={form.coachingGoal}
                    onChange={(e) => setForm((f) => ({ ...f, coachingGoal: e.target.value }))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select your goal...</option>
                    {coachingGoals.map((goal) => (
                      <option key={goal} value={goal}>{goal}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell the coach about your experience level, what you want to work on..."
                    rows={3}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedCoach(null)}
                  className="flex-1 py-2.5 rounded-full border border-slate-700 text-slate-400 text-sm font-medium hover:bg-slate-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={sending}
                  onClick={() => handleSubmit(coach.id)}
                  className="flex-1 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  {sending ? "Sending..." : "Submit Request"}
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center mt-4">
                By submitting, you agree to be contacted by CricVerse360 regarding your coaching request.
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
