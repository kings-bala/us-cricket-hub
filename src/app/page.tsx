import Link from "next/link";
import { players, agents, milcTeams, tournaments } from "@/data/mock";

export default function Home() {
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
              <span className="text-sm text-emerald-400">Building the Missing Pathway in US Cricket</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              From Youth Cricket to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                Minor League
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              The digital scouting and management hub connecting U15-U21 talent with MiLC franchises,
              professional agents, and sponsors. Don&apos;t let talent fall off the cliff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/players"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Explore Players
              </Link>
              <Link
                href="/scouting"
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-semibold border border-slate-700 transition-colors"
              >
                Pro Scouting Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Registered Players", value: `${players.length}+` },
            { label: "Verified Agents", value: agents.length },
            { label: "MiLC Teams", value: milcTeams.length },
            { label: "Upcoming Events", value: upcomingTournaments.length },
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
        <p className="text-slate-400 mb-8">Four pillars connecting the US cricket ecosystem</p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "Players", desc: "Create verified profiles with stats, video highlights, and fitness data. Stay on the radar from U15 to U21.", icon: "🏏", href: "/players" },
            { title: "Agents", desc: "Manage talent stables with data-backed proof of player value. Earn commissions through successful placements.", icon: "🤝", href: "/agents" },
            { title: "MiLC Owners", desc: "Search draft-ready local talent with advanced filters. Reduce scouting costs and build homegrown rosters.", icon: "🏟️", href: "/scouting" },
            { title: "Sponsors", desc: "Fund tournaments, sponsor leaderboards, and back Rising Stars. Targeted marketing to cricket fans.", icon: "💰", href: "/sponsors" },
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
                      <p className="text-xs text-slate-400">{player.ageGroup} &middot; {player.zone}</p>
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
        <h2 className="text-2xl font-bold text-white mb-2">Upcoming Showcases</h2>
        <p className="text-slate-400 mb-8">Regional camps and tournaments for the 16-21 age bracket</p>
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

      <section className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Bridge the Gap?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Whether you&apos;re a player, agent, franchise owner, or sponsor, join the platform that&apos;s building the future of American cricket.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Go to Dashboard
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
