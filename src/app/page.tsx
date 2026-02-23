"use client";

import Link from "next/link";
import { useCatalogMulti } from "@/hooks/useCatalog";
import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  const { data } = useCatalogMulti("players", "tournaments", "leagues", "coaches");
  const players = data.players;
  const tournaments = data.tournaments;
  const t20Leagues = data.leagues;
  const coaches = data.coaches;
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming").slice(0, 3);

  return (
    <div>
      <section className="relative">
        <HeroSlider />
        <div className="flex justify-center -mt-6 relative z-20">
          <Link
            href="/players?tab=profile"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg shadow-emerald-500/30"
          >
            My Profile
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Global Players", value: `${players.length}+` },
            { label: "T20 Leagues", value: t20Leagues.length },
            { label: "World-Class Coaches", value: coaches.length },
            { label: "Countries", value: "12+" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-white mb-2">Your CricVerse360 Toolkit</h2>
        <p className="text-slate-400 mb-8">Everything you need to track, train, and grow as a cricketer</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "My Profile", desc: "See your batting and bowling stats, strengths, weaknesses, and fitness scores all in one place. Know exactly where you stand.", icon: "📊", href: "/players?tab=profile", tag: "Your Stats" },
            { title: "Training", desc: "Track your practice sessions, get personalized drills, and follow fitness plans designed to improve your game.", icon: "💪", href: "/players?tab=training", tag: "Stay Fit" },
            { title: "AI Video Analysis", desc: "Upload a video of your batting or bowling and get instant AI feedback on your technique. Works right in your browser.", icon: "🎥", href: "/analyze", tag: "AI-Powered" },
            { title: "Store", desc: "Find the right gear for your game. Bats, pads, shoes, and more from trusted brands without wasting time.", icon: "🛒", href: "/players?tab=store", tag: "Gear Up" },
            { title: "Payments", desc: "Keep track of your academy fees, payment history, and receipts. Everything in one place.", icon: "💳", href: "/payments", tag: "Fees" },
            { title: "Pro Scouting", desc: "Get discovered by scouts, agents, and T20 franchise owners looking for the next big talent.", icon: "🔍", href: "/scouting", tag: "Get Noticed" },
          ].map((item) => (
            <Link key={item.title} href={item.href}>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-200 h-full group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">{item.tag}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
        <p className="text-slate-400 mb-8">Six pillars connecting the global cricket ecosystem</p>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { title: "Players", desc: "Upload your profile from any country. Street cricketers to academy stars.", icon: "🏏", href: "/players" },
            { title: "AI Analysis", desc: "Upload videos and get AI-powered technique feedback on batting, bowling, and fielding.", icon: "🤖", href: "/analyze" },
            { title: "Coaches", desc: "Connect with world-class coaches. Learn from legends like Kumble, Brett Lee, and Lara.", icon: "🎓", href: "/coaches" },
            { title: "Agents", desc: "Get discovered by international agents with connections to T20 leagues worldwide.", icon: "🤝", href: "/agents" },
            { title: "T20 Owners", desc: "Scout global talent for IPL, BBL, PSL, CPL, SA20, and more T20 leagues.", icon: "🏟️", href: "/scouting" },
            { title: "Sponsors", desc: "Back rising stars and tournaments across 8 regions worldwide.", icon: "💰", href: "/sponsors" },
          ].map((pillar) => (
            <Link key={pillar.title} href={pillar.href}>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-200 h-full group">
                <div className="text-3xl mb-3">{pillar.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{pillar.title}</h3>
                <p className="text-sm text-slate-400">{pillar.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>


      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-white mb-2">Upcoming Global Showcases</h2>
        <p className="text-slate-400 mb-8">International camps and tournaments across all regions</p>
        <div className="grid md:grid-cols-3 gap-4">
          {upcomingTournaments.map((t) => (
            <div key={t.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">{t.status}</span>
                <span className="text-xs text-slate-400">{t.ageGroup}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{t.name}</h3>
              <div className="space-y-1 text-sm text-slate-400">
                <p>📍 {t.venue}</p>
                <p>📅 {t.startDate} to {t.endDate}</p>
                {t.teams > 0 && <p>🏏 {t.teams} teams</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-white mb-6">T20 Leagues Worldwide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {t20Leagues.map((league) => (
            <div key={league.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center hover:border-emerald-500/50 transition-all">
              <img src={league.logo} alt={league.name} className="mx-auto w-14 h-14 rounded-lg mb-2 object-contain" />
              <p className="text-sm font-bold text-white">{league.name}</p>
              <p className="text-xs text-slate-400 mt-1">{league.country}</p>
              <p className="text-xs text-emerald-400 mt-1">{league.teams} teams</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Go Global?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Whether you&apos;re a street cricketer in Mumbai, a coach in Sydney, or a T20 franchise owner&mdash;join the platform connecting cricket talent worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Create Free Account
            </Link>
            <Link href="/scouting" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold border border-white/20 transition-colors">
              Try Pro Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
