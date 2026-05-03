"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

/**
 * Coach data — ONLY include coaches with signed consent on file.
 * See /docs/legal/coach-consent-template.md for the required agreement.
 * Each entry here MUST have a corresponding signed consent letter.
 */
interface ConsentedCoach {
  id: string;
  name: string;
  country: string;
  specialization: string;
  experience: number;
  hourlyRate: number;
  bio: string;
  availability: "available" | "limited" | "waitlist";
}

// TODO: Product owner to provide real coach data with signed consent letters.
// Replace this empty array with actual consented coaches.
const consentedCoaches: ConsentedCoach[] = [];

interface RequestForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  coachingGoal: string;
}

export default function CoachesPage() {
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [form, setForm] = useState<RequestForm>({ name: "", email: "", phone: "", message: "", coachingGoal: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [requestsSent, setRequestsSent] = useState<Record<string, boolean>>({});
  const { user, tokens } = useAuth();

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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900/30 via-slate-900 to-emerald-900/30 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Expert Cricket Coaches</h1>
          <p className="text-slate-300 max-w-2xl mx-auto mb-6">
            Connect with verified coaches for personalized training to take your game to the next level.
          </p>
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

        {/* Coach Grid — only shows consented coaches */}
        {consentedCoaches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consentedCoaches.map((coach) => (
              <div key={coach.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all group flex flex-col">
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
                  <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 shrink-0">Verified</span>
                </div>

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
                      <p className="text-lg font-bold text-emerald-400">${coach.hourlyRate}</p>
                      <p className="text-[10px] text-slate-500">From/hr</p>
                    </div>
                  </div>
                </div>

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
        ) : (
          /* Empty state — shown when no consented coaches are available */
          <div className="max-w-2xl mx-auto py-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-10 md:p-14 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                We&apos;re onboarding our first verified coaches
              </h2>
              <p className="text-slate-300 max-w-md mx-auto mb-8">
                Are you a coach who wants to be one of CricVerse360&apos;s launch partners?
                Get in touch and be among the first to offer your services on the platform.
              </p>

              <a
                href="mailto:coaches@cricverse360.com"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                coaches@cricverse360.com
              </a>

              <p className="text-slate-500 text-sm mt-6">
                Verified coaches will be listed with their specialization, rates, and availability.
              </p>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-blue-500/20 rounded-2xl p-10">
            <h2 className="text-2xl font-bold text-white mb-3">Want to improve faster?</h2>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">
              Get your AI analysis first — when coaches are available, they can help you fix your weaknesses.
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
        const coach = consentedCoaches.find((c) => c.id === selectedCoach);
        if (!coach) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedCoach(null)}>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
