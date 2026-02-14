import Link from "next/link";
import Image from "next/image";
import { agents, players, regionColors } from "@/data/mock";
import PlayerCard from "@/components/PlayerCard";
import StatCard from "@/components/StatCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentProfilePage({ params }: PageProps) {
  const { id } = await params;
  const agent = agents.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Agent not found</h1>
        <Link href="/agents" className="text-emerald-400 mt-4 inline-block">Back to Agents</Link>
      </div>
    );
  }

  const agentPlayers = players.filter((p) => agent.playerIds.includes(p.id));
  const totalRuns = agentPlayers.reduce((sum, p) => sum + p.stats.runs, 0);
  const totalWickets = agentPlayers.reduce((sum, p) => sum + p.stats.wickets, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/agents" className="text-sm text-slate-400 hover:text-white mb-6 inline-block">&larr; Back to Agents</Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="text-center">
              {agent.avatar ? (
                <Image src={agent.avatar} alt={agent.name} width={80} height={80} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {agent.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
              <div className="flex items-center justify-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                {agent.verified && (
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-slate-400 text-sm">{agent.agency}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${regionColors[agent.region] || "bg-slate-700/50 text-slate-300"}`}>{agent.country} &middot; {agent.region}</span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">About</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{agent.bio}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Contact</h3>
            <p className="text-sm text-emerald-400">{agent.contactEmail}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Placements" value={agent.placements} color="emerald" />
            <StatCard label="Success Rate" value={`${agent.successRate}%`} color="blue" />
            <StatCard label="Rating" value={agent.rating} color="amber" />
            <StatCard label="Active Players" value={agentPlayers.length} color="purple" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Specialization</h2>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-emerald-400 font-medium">{agent.specialization}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Stable Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total Runs" value={totalRuns} color="emerald" />
              <StatCard label="Total Wickets" value={totalWickets} color="red" />
              <StatCard label="Verified Players" value={agentPlayers.filter((p) => p.verified).length} color="blue" />
              <StatCard label="Elite Profiles" value={agentPlayers.filter((p) => p.profileTier === "Elite").length} color="amber" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Player Stable</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {agentPlayers.map((p, i) => (
                <PlayerCard key={p.id} player={p} rank={i + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}
