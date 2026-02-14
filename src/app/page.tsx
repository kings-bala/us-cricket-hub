"use client";

import Link from "next/link";
import Image from "next/image";
import { players, tournaments, t20Leagues, coaches, availableSponsorships } from "@/data/mock";
import { useRole } from "@/context/RoleContext";
import { UserRole } from "@/types";

const heroContent: Record<UserRole, { badge: string; heading: string; highlight: string; desc: string; cta1: { label: string; href: string }; cta2: { label: string; href: string } }> = {
  player: {
    badge: "Your Cricket Journey Starts Here",
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
    cta2: { label: "View Rising Stars", href: "/players" },
  },
};

const rolePillars: Record<UserRole, { title: string; desc: string; icon: string; href: string }[]> = {
  player: [
    { title: "Your Profile", desc: "Upload your profile from any country. Street cricketers to academy stars.", icon: "🏏", href: "/players" },
    { title: "AI Analysis", desc: "Upload videos and get AI-powered technique feedback on batting, bowling, and fielding.", icon: "🤖", href: "/analyze" },
    { title: "Find Coaches", desc: "Connect with world-class coaches. Learn from legends like Kumble, Brett Lee, and Lara.", icon: "🎓", href: "/coaches" },
    { title: "Find an Agent", desc: "Get discovered by international agents with connections to T20 leagues worldwide.", icon: "🤝", href: "/agents" },
  ],
  agent: [
    { title: "Player Registry", desc: "Access verified player profiles with stats, fitness data, and video highlights.", icon: "🏏", href: "/players" },
    { title: "Pro Scouting", desc: "Advanced filters to find talent by country, role, speed, economy, and draft readiness.", icon: "🔍", href: "/scouting" },
    { title: "Manage Stable", desc: "Track your players, negotiate contracts, and manage placements across T20 leagues.", icon: "📋", href: "/dashboard" },
    { title: "League Network", desc: "Connect with IPL, BBL, PSL, CPL, SA20, and more T20 franchise owners.", icon: "🏟️", href: "/scouting" },
  ],
  owner: [
    { title: "Pro Scouting", desc: "Scout global talent with advanced filters. Find draft-ready players instantly.", icon: "🔍", href: "/scouting" },
    { title: "Player Database", desc: "Verified players across 12 countries with complete stats and fitness data.", icon: "🏏", href: "/players" },
    { title: "Agent Network", desc: "Connect with licensed agents managing top youth talent worldwide.", icon: "🤝", href: "/agents" },
    { title: "AI Analysis", desc: "Review AI-powered player technique analysis before making draft decisions.", icon: "🤖", href: "/analyze" },
  ],
  sponsor: [
    { title: "Sponsorships", desc: "Browse leaderboard, tournament, player, and showcase sponsorship opportunities.", icon: "💰", href: "/sponsors" },
    { title: "Rising Stars", desc: "Back individual players and attach your brand to the next generation of cricket.", icon: "⭐", href: "/players" },
    { title: "Events", desc: "Sponsor international showcases and tournaments across all cricket regions.", icon: "🏟️", href: "/sponsors" },
    { title: "Analytics", desc: "Track brand impressions, engagement, and ROI across the cricket ecosystem.", icon: "📊", href: "/dashboard" },
  ],
};

const roleStats: Record<UserRole, { label: string; value: string | number }[]> = {
  player: [
    { label: "T20 Leagues", value: 12 },
    { label: "World-Class Coaches", value: 8 },
    { label: "Countries", value: "12+" },
    { label: "Verified Agents", value: 4 },
  ],
  agent: [
    { label: "Global Players", value: "16+" },
    { label: "T20 Leagues", value: 12 },
    { label: "Countries", value: "12+" },
    { label: "Placements Made", value: "100+" },
  ],
  owner: [
    { label: "Draft-Ready Players", value: 11 },
    { label: "T20 Leagues", value: 12 },
    { label: "Countries Scouted", value: "12+" },
    { label: "Licensed Agents", value: 4 },
  ],
  sponsor: [
    { label: "Global Cricket Market", value: "$30B+" },
    { label: "Cricket Fans Worldwide", value: "2.5B+" },
    { label: "Sponsorship Options", value: "8+" },
    { label: "T20 Leagues", value: 12 },
  ],
};

const roleCta: Record<UserRole, { heading: string; desc: string; cta1: { label: string; href: string }; cta2: { label: string; href: string } }> = {
  player: {
    heading: "Ready to Get Discovered?",
    desc: "Create your profile, upload your highlights, and let the world see your talent. Coaches and agents are watching.",
    cta1: { label: "Create Free Account", href: "/auth" },
    cta2: { label: "AI Video Analysis", href: "/analyze" },
  },
  agent: {
    heading: "Start Building Your Stable",
    desc: "Access the global player registry, connect with T20 franchises, and place your talent in the best leagues.",
    cta1: { label: "Create Agent Account", href: "/auth" },
    cta2: { label: "Pro Scouting Dashboard", href: "/scouting" },
  },
  owner: {
    heading: "Find Your Next Star Player",
    desc: "Advanced scouting tools, verified player data, and AI analysis to help you build a championship-winning squad.",
    cta1: { label: "Try Pro Dashboard", href: "/scouting" },
    cta2: { label: "Browse Players", href: "/players" },
  },
  sponsor: {
    heading: "Grow Your Brand in Cricket",
    desc: "Reach 2.5 billion cricket fans worldwide. Sponsor rising stars, tournaments, and leaderboards across the global ecosystem.",
    cta1: { label: "View Opportunities", href: "/sponsors" },
    cta2: { label: "Create Account", href: "/auth" },
  },
};

export default function Home() {
  const { role } = useRole();
  const hero = heroContent[role];
  const pillars = rolePillars[role];
  const stats = roleStats[role];
  const cta = roleCta[role];

  const topPlayers = [...players].sort((a, b) => b.stats.runs - a.stats.runs).slice(0, 4);
  const topCoaches = coaches.slice(0, 4);
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming").slice(0, 3);

  return (
    <div key={role}>
      <section className="relative overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920&h=1080&fit=crop" alt="Cricket stadium" fill className="object-cover opacity-20" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-slate-900/80 to-blue-900/60" />
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
          {stats.map((stat) => (
            <div key={stat.label} className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 overflow-hidden border-y border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h2 className="text-xl font-bold text-white">Powering 12 T20 Leagues Worldwide</h2>
        </div>
        <div className="flex gap-4 animate-scroll px-4">
          {[...t20Leagues, ...t20Leagues].map((league, i) => (
            <div key={`${league.id}-${i}`} className="flex-shrink-0 w-36">
              <div className="group relative rounded-xl overflow-hidden h-24 cursor-pointer">
                <Image src={league.bgImage} alt={league.name} fill className="object-cover" sizes="144px" />
                <div className={`absolute inset-0 bg-gradient-to-t ${league.brandColor} opacity-80`} />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center">
                  {league.logo ? (
                    <Image src={league.logo} alt={league.name} width={40} height={40} className="object-contain drop-shadow-lg mb-1" />
                  ) : (
                    <p className="text-sm font-extrabold text-white drop-shadow-lg">{league.id}</p>
                  )}
                  <p className="text-[10px] text-white/80 mt-0.5">{league.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-white mb-2">
          {role === "player" ? "Your Path to T20 Cricket" : role === "agent" ? "Your Toolkit" : role === "owner" ? "Scouting Tools" : "Sponsorship Channels"}
        </h2>
        <p className="text-slate-400 mb-8">
          {role === "player" ? "Everything you need to get discovered" : role === "agent" ? "Manage talent and connect with franchises" : role === "owner" ? "Find and evaluate global talent" : "Multiple ways to grow your brand in cricket"}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
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

      {role === "player" && (
        <section className="bg-slate-800/30 border-y border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Featured Coaches</h2>
                <p className="text-slate-400">Learn from cricket legends worldwide</p>
              </div>
              <Link href="/coaches" className="text-sm text-emerald-400 hover:text-emerald-300">View All &rarr;</Link>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {topCoaches.map((coach) => (
                <Link key={coach.id} href="/coaches">
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/50 transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      {coach.avatar ? (
                        <Image src={coach.avatar} alt={coach.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {coach.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">{coach.name}</p>
                        <p className="text-xs text-slate-400">{coach.country}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-slate-900/50 rounded p-1.5">
                        <p className="text-xs text-slate-500">Focus</p>
                        <p className="text-xs font-bold text-white truncate">{coach.specialization}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-1.5">
                        <p className="text-xs text-slate-500">Rating</p>
                        <p className="text-sm font-bold text-amber-400">{coach.rating}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {(role === "agent" || role === "owner") && (
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
                      {player.avatar ? (
                        <Image src={player.avatar} alt={player.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {player.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      )}
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
      )}

      {role === "sponsor" && (
        <section className="bg-slate-800/30 border-y border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Available Sponsorships</h2>
                <p className="text-slate-400">Attach your brand to the cricket ecosystem</p>
              </div>
              <Link href="/sponsors" className="text-sm text-emerald-400 hover:text-emerald-300">View All &rarr;</Link>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {availableSponsorships.slice(0, 4).map((asset) => (
                <Link key={asset.id} href="/sponsors">
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 hover:border-amber-500/50 transition-all group">
                    <div className="mb-3">
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full capitalize">{asset.type}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-amber-400 transition-colors">{asset.name}</h3>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">{asset.description}</p>
                    <p className="text-lg font-bold text-emerald-400">${asset.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {(role === "player" || role === "agent") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-2xl font-bold text-white mb-2">Upcoming Global Showcases</h2>
          <p className="text-slate-400 mb-8">
            {role === "player" ? "Register for camps and tournaments to showcase your talent" : "Send your players to international showcases"}
          </p>
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
      )}

      {(role === "owner" || role === "sponsor") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-white mb-6">T20 Leagues Worldwide</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t20Leagues.map((league) => (
              <div key={league.id} className="group relative rounded-xl overflow-hidden h-44 cursor-pointer">
                <Image src={league.bgImage} alt={league.name} fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
                <div className={`absolute inset-0 bg-gradient-to-t ${league.brandColor} opacity-75 group-hover:opacity-85 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {league.logo ? (
                      <Image src={league.logo} alt={league.name} width={32} height={32} className="object-contain drop-shadow-lg" />
                    ) : (
                      <span className="text-lg font-extrabold text-white drop-shadow-lg">{league.id}</span>
                    )}
                    <p className="text-sm font-medium text-white/90">{league.name}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-white/80">{league.country}</span>
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">{league.teams} teams</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{cta.heading}</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">{cta.desc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={cta.cta1.href} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              {cta.cta1.label}
            </Link>
            <Link href={cta.cta2.href} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold border border-white/20 transition-colors">
              {cta.cta2.label}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
