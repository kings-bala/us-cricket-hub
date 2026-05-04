"use client";

import Link from "next/link";

export default function CoachesPage() {
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

      {/* Empty state */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
    </div>
  );
}
