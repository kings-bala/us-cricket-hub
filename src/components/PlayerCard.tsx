import Link from "next/link";
import { Player } from "@/types";
import { zoneColors, roleIcons } from "@/data/mock";

interface PlayerCardProps {
  player: Player;
  rank?: number;
}

export default function PlayerCard({ player, rank }: PlayerCardProps) {
  return (
    <Link href={`/players/${player.id}`}>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {rank && (
              <span className="text-2xl font-bold text-slate-600 w-8">#{rank}</span>
            )}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              {player.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {player.name}
                </h3>
                {player.verified && (
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {player.city}, {player.state}
              </p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${player.profileTier === "Elite" ? "bg-amber-500/20 text-amber-400" : player.profileTier === "Premium" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-600/50 text-slate-400"}`}>
            {player.profileTier}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full text-slate-300">
            {roleIcons[player.role]} {player.role}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${zoneColors[player.zone]}`}>
            {player.zone}
          </span>
          <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full text-slate-300">
            {player.ageGroup} &middot; Age {player.age}
          </span>
          <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full text-slate-300">
            {player.battingStyle}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-900/50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Matches</p>
            <p className="text-sm font-semibold text-white">{player.stats.matches}</p>
          </div>
          {player.role === "Bowler" ? (
            <>
              <div className="bg-slate-900/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">Wickets</p>
                <p className="text-sm font-semibold text-white">{player.stats.wickets}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">Bowl Avg</p>
                <p className="text-sm font-semibold text-white">{player.stats.bowlingAverage}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">Economy</p>
                <p className="text-sm font-semibold text-white">{player.stats.economy}</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-900/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">Runs</p>
                <p className="text-sm font-semibold text-white">{player.stats.runs}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">Bat Avg</p>
                <p className="text-sm font-semibold text-white">{player.stats.battingAverage}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">SR</p>
                <p className="text-sm font-semibold text-white">{player.stats.strikeRate}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
