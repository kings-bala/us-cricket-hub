import Link from "next/link";
import { players, agents, regionColors, roleIcons, t20Leagues } from "@/data/mock";
import StatCard from "@/components/StatCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const player = players.find((p) => p.id === id);

  if (!player) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Player not found</h1>
        <Link href="/players" className="text-emerald-400 mt-4 inline-block">Back to Players</Link>
      </div>
    );
  }

  const agent = player.agentId ? agents.find((a) => a.id === player.agentId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/players" className="text-sm text-slate-400 hover:text-white mb-6 inline-block">&larr; Back to Players</Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                {player.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{player.name}</h1>
                {player.verified && (
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-slate-400 text-sm">{player.city}, {player.country}</p>
              {player.streetCricketer && (
                <span className="inline-block mt-1 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Street Cricketer</span>
              )}
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full text-slate-300">
                  {roleIcons[player.role]} {player.role}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${regionColors[player.region] || "bg-slate-700/50 text-slate-300"}`}>{player.region}</span>
                <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full text-slate-300">{player.ageGroup} &middot; Age {player.age}</span>
              </div>
              <div className="mt-3">
                <span className={`text-xs px-3 py-1 rounded-full ${player.profileTier === "Elite" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : player.profileTier === "Premium" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-600/50 text-slate-400 border border-slate-600"}`}>
                  {player.profileTier} Profile
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Player Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Country</span><span className="text-white">{player.country}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Region</span><span className="text-white">{player.region}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Batting</span><span className="text-white">{player.battingStyle}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Bowling</span><span className="text-white">{player.bowlingStyle}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Matches</span><span className="text-white">{player.stats.matches}</span></div>
            </div>
          </div>

          {player.targetLeagues && player.targetLeagues.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Target Leagues</h3>
              <div className="flex flex-wrap gap-2">
                {player.targetLeagues.map((leagueId) => {
                  const league = t20Leagues.find((l) => l.id === leagueId);
                  return (
                    <span key={leagueId} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                      {league ? league.name : leagueId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {agent && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Representation</h3>
              <Link href={`/agents/${agent.id}`} className="flex items-center gap-3 hover:bg-slate-700/30 rounded-lg p-2 -m-2 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {agent.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{agent.name}</p>
                  <p className="text-xs text-slate-400">{agent.agency}</p>
                </div>
              </Link>
            </div>
          )}

          {player.achievements.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Achievements</h3>
              <div className="space-y-2">
                {player.achievements.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-400 mt-0.5">🏆</span>
                    <span className="text-slate-300">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Batting Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Runs" value={player.stats.runs} color="emerald" />
              <StatCard label="Average" value={player.stats.battingAverage} color="emerald" />
              <StatCard label="Strike Rate" value={player.stats.strikeRate} color="blue" />
              <StatCard label="Innings" value={player.stats.innings} color="blue" />
              <StatCard label="50s" value={player.stats.fifties} color="purple" />
              <StatCard label="100s" value={player.stats.hundreds} color="amber" />
              <StatCard label="Catches" value={player.stats.catches} color="purple" />
              <StatCard label="Stumpings" value={player.stats.stumpings} color="blue" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Bowling Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Wickets" value={player.stats.wickets} color="red" />
              <StatCard label="Bowl Avg" value={player.stats.bowlingAverage || "-"} color="red" />
              <StatCard label="Economy" value={player.stats.economy || "-"} color="amber" />
              <StatCard label="Best" value={player.stats.bestBowling} color="amber" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Fitness Data</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Sprint (60m)" value={`${player.fitnessData.sprintSpeed}s`} color="emerald" />
              <StatCard label="Yo-Yo Test" value={player.fitnessData.yoYoTest} color="blue" />
              <StatCard label="Throw Dist" value={`${player.fitnessData.throwDistance}m`} color="purple" />
              <StatCard label="Beep Test" value={`Lvl ${player.fitnessData.beepTestLevel}`} color="amber" />
              {player.fitnessData.bowlingSpeed && (
                <StatCard label="Bowling Speed" value={`${player.fitnessData.bowlingSpeed} km/h`} subtitle="Speed gun verified" color="red" />
              )}
            </div>
          </div>

          {player.highlights.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Video Highlights</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {player.highlights.map((h) => (
                  <div key={h.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden group cursor-pointer hover:border-emerald-500/50 transition-all">
                    <div className="h-36 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-white">{h.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-slate-400">{h.event}</p>
                        <p className="text-xs text-slate-500">{h.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {player.showcaseEvents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Showcase Participation</h2>
              <div className="flex flex-wrap gap-2">
                {player.showcaseEvents.map((e, i) => (
                  <span key={i} className="text-sm bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full text-slate-300">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return players.map((p) => ({ id: p.id }));
}
