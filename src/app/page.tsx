import Link from "next/link";
import { players, tournaments, t20Leagues, coaches } from "@/data/mock";
import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming").slice(0, 3);

  return (
    <div>
      <section className="relative">
        <HeroSlider />
      </section>

      <section className="relative z-10 -mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[
              { label: "Global Players", value: `${players.length}+`, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
              { label: "T20 Leagues", value: `${t20Leagues.length}`, icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
              { label: "Expert Coaches", value: `${coaches.length}`, icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
              { label: "Countries", value: "12+", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-5 text-center group">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl mx-auto my-16" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-14 animate-fade-up">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mb-3">Your Toolkit</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Everything You Need to Excel</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">Track, train, analyze, and grow &mdash; all from one platform built for serious cricketers.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: "My Profile", desc: "Your batting and bowling stats, strengths, weaknesses, and fitness scores in one place.", href: "/players?tab=profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            { title: "Training Hub", desc: "Personalized drills, fitness plans, session tracking, and progress analytics.", href: "/players?tab=training", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { title: "AI Video Analysis", desc: "Upload video and get instant AI-powered technique feedback. Runs in your browser.", href: "/analyze", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
            { title: "Pro Scouting", desc: "Get discovered by scouts, agents, and T20 franchise owners worldwide.", href: "/scouting", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
            { title: "Gear Store", desc: "Curated cricket equipment from trusted brands, delivered to your door.", href: "/players?tab=store", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
            { title: "Payments", desc: "Academy fees, payment history, and receipts. Transparent and simple.", href: "/payments", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
          ].map((item) => (
            <Link key={item.title} href={item.href}>
              <div className="glass-card rounded-2xl p-6 h-full group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-5xl mx-auto my-16" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-14">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mb-3">Ecosystem</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">The Global Cricket Network</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">Six pillars connecting players, coaches, scouts, and sponsors across the world.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: "Players", desc: "Upload your profile from any country.", href: "/players", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            { title: "AI Analysis", desc: "AI-powered technique feedback.", href: "/analyze", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { title: "Coaches", desc: "World-class coaching network.", href: "/coaches", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
            { title: "Agents", desc: "International agent connections.", href: "/agents", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { title: "T20 Owners", desc: "Scout talent for global leagues.", href: "/scouting", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
            { title: "Sponsors", desc: "Back rising stars worldwide.", href: "/sponsors", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((pillar) => (
            <Link key={pillar.title} href={pillar.href}>
              <div className="glass-card rounded-2xl p-5 h-full group text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={pillar.icon} />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">{pillar.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-5xl mx-auto my-16" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-14">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mb-3">Events</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Upcoming Global Showcases</h2>
          <p className="text-slate-400 mt-3">International camps and tournaments across all regions</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {upcomingTournaments.map((t) => (
            <div key={t.id} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full font-medium uppercase tracking-wider">{t.status}</span>
                <span className="text-xs text-slate-500">{t.ageGroup}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{t.name}</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{t.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>{t.startDate} &ndash; {t.endDate}</span>
                </div>
                {t.teams > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{t.teams} teams</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-5xl mx-auto my-16" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-14">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mb-3">Leagues</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">T20 Leagues Worldwide</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {t20Leagues.map((league) => (
            <div key={league.id} className="glass-card rounded-2xl p-5 text-center group">
              <img src={league.logo} alt={league.name} className="mx-auto w-14 h-14 rounded-xl mb-3 object-contain" />
              <p className="text-sm font-semibold text-white">{league.name}</p>
              <p className="text-xs text-slate-500 mt-1">{league.country}</p>
              <p className="text-xs text-emerald-400/80 mt-1">{league.teams} teams</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-emerald-800/10 to-cyan-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)]" />
        <div className="section-divider" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">Ready to Go Global?</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Whether you&apos;re a street cricketer in Mumbai, a coach in Sydney, or a T20 franchise owner &mdash; join the platform connecting cricket talent worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40">
              Create Free Account
            </Link>
            <Link href="/scouting" className="bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-semibold border border-white/10 hover:border-white/20 transition-all">
              Explore Pro Scouting
            </Link>
          </div>
        </div>
        <div className="section-divider" />
      </section>
    </div>
  );
}
