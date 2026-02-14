"use client";

import Link from "next/link";
import { players, tournaments, t20Leagues, coaches } from "@/data/mock";
import { useRole } from "@/context/RoleContext";
import { UserRole } from "@/types";

const heroContent: Record<UserRole, { badge: string; heading: string; highlight: string; desc: string; cta1: { label: string; href: string }; cta2: { label: string; href: string } }> = {
  player: {
    badge: "Discover Cricket Talent Worldwide",
    heading: "From Street Cricket to",
    highlight: "Global T20 Leagues",
    desc: "Upload your profile, get AI video analysis, connect with world-class coaches, and get discovered by T20 leagues worldwide.",
    cta1: { label: "Create Your Profile", href: "/players" },
    cta2: { label: "AI Video Analysis", href: "/analyze" },
  },
  agent: {
    badge: "Global Talent Management Platform",
    heading: "Discover & Manage",
    highlight: "World-Class Cricket Talent",
    desc: "Build your stable of international players. Connect with T20 franchises across IPL, BBL, CPL, PSL, SA20, and more.",
    cta1: { label: "Browse Players", href: "/players" },
    cta2: { label: "Pro Scouting Dashboard", href: "/scouting" },
  },
  owner: {
    badge: "T20 Franchise Scouting Hub",
    heading: "Scout Global Talent for Your",
    highlight: "T20 Franchise",
    desc: "Advanced scouting tools to find draft-ready talent across 12+ countries. Meet local quotas with verified player data and AI analysis.",
    cta1: { label: "Pro Scouting Dashboard", href: "/scouting" },
    cta2: { label: "Browse Players", href: "/players" },
  },
  sponsor: {
    badge: "Global Cricket Sponsorship Platform",
    heading: "Reach 2.5 Billion Cricket Fans",
    highlight: "Worldwide",
    desc: "Sponsor tournaments, back rising stars, and brand your presence across the $30B+ global cricket ecosystem.",
    cta1: { label: "Sponsorship Opportunities", href: "/sponsors" },
    cta2: { label: "View Players", href: "/players" },
  },
};

export default function Home() {
  const { role } = useRole();
  const hero = heroContent[role];
  const topPlayers = [...players].sort((a, b) => b.stats.runs - a.stats.runs).slice(0, 4);
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming").slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900 to-blue-900/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-emerald-400">{hero.badge}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {hero.heading}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                {hero.highlight}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              {hero.desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={hero.cta1.href}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                {hero.cta1.label}
              </Link>
              <Link
                href={hero.cta2.href}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-semibold border border-slate-700 transition-colors"
              >
                {hero.cta2.label}
              </Link>
            </div>
          </div>
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

      <section className="bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Top Prospects</h2>
              <p className="text-slate-400">Highest run-scorers in the registry</p>
            </div>
            <Link href="/players" className="text-sm text-emerald-400 hover:text-emerald-300">View All &rarr;</Link>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {topPlayers.map((player, i) => (
              <Link key={player.id} href={`/players/${player.id}`}>
                <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/50 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl font-bold text-slate-600">#{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {player.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">{player.name}</p>
                      <p className="text-xs text-slate-400">{player.ageGroup} &middot; {player.country}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-900/50 rounded p-1.5">
                      <p className="text-xs text-slate-500">Runs</p>
                      <p className="text-sm font-bold text-white">{player.stats.runs}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-1.5">
                      <p className="text-xs text-slate-500">Avg</p>
                      <p className="text-sm font-bold text-white">{player.stats.battingAverage}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-1.5">
                      <p className="text-xs text-slate-500">SR</p>
                      <p className="text-sm font-bold text-white">{player.stats.strikeRate}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
            <div key={league.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center hover:border-emerald-500/50 transition-all">
              <p className="text-sm font-bold text-white">{league.id}</p>
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
            <Link href="/auth" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
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
