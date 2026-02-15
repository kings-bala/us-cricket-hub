"use client";

import { useState } from "react";
import Link from "next/link";
import { players, agents, t20Teams, tournaments, sponsors, coaches } from "@/data/mock";
import StatCard from "@/components/StatCard";
import { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  player: "Player Dashboard",
  agent: "Agent Dashboard",
  owner: "T20 Owner Dashboard",
  sponsor: "Sponsor Dashboard",
  coach: "Coach Dashboard",
};

function PlayerDashboard() {
  const player = players[0];
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
            {player.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{player.name}</h2>
            <p className="text-sm text-slate-400">{player.role} &middot; {player.ageGroup} &middot; {player.country}</p>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full mt-1 inline-block">{player.profileTier} Profile</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Matches" value={player.stats.matches} color="emerald" />
        <StatCard label="Runs" value={player.stats.runs} color="blue" />
        <StatCard label="Average" value={player.stats.battingAverage} color="purple" />
        <StatCard label="Wickets" value={player.stats.wickets} color="amber" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Profile Visibility</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-400">Profile Views (30d)</span><span className="text-white font-medium">247</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Shortlisted by Scouts</span><span className="text-white font-medium">8</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Agent Interest</span><span className="text-emerald-400 font-medium">3 new</span></div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Upcoming Events</h3>
          <div className="space-y-2">
            {tournaments.filter((t) => t.status === "upcoming").slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{t.name}</span>
                <span className="text-xs text-slate-500">{t.startDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-emerald-400 mb-2">Upgrade to Premium</h3>
        <p className="text-sm text-slate-400 mb-3">Get professional video analysis, verified speed-gun data, and priority visibility to scouts.</p>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">Upgrade Now - $9.99/mo</button>
      </div>
    </div>
  );
}

function AgentDashboard() {
  const agent = agents[0];
  const agentPlayers = players.filter((p) => agent.playerIds.includes(p.id));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Players" value={agentPlayers.length} color="emerald" />
        <StatCard label="Placements" value={agent.placements} color="blue" />
        <StatCard label="Success Rate" value={`${agent.successRate}%`} color="purple" />
        <StatCard label="Rating" value={agent.rating} color="amber" />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Your Stable</h3>
        <div className="space-y-3">
          {agentPlayers.map((p) => (
            <Link key={p.id} href={`/players/${p.id}`} className="flex items-center justify-between hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.role} &middot; {p.ageGroup}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white">{p.stats.runs} runs</p>
                <p className="text-xs text-slate-400">{p.stats.matches} matches</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2"><span className="text-emerald-400">+</span><span className="text-slate-300">New inquiry from Mumbai Indians for talent review</span></div>
            <div className="flex gap-2"><span className="text-blue-400">i</span><span className="text-slate-300">Player profiles viewed 340 times this week globally</span></div>
            <div className="flex gap-2"><span className="text-amber-400">!</span><span className="text-slate-300">IPL Pre-Draft Camp registration closing soon</span></div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Pending Opportunities</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-300">Mumbai Indians - Trial invite</span><span className="text-amber-400">Pending</span></div>
            <div className="flex justify-between"><span className="text-slate-300">Sydney Sixers - Contract talk</span><span className="text-emerald-400">Active</span></div>
            <div className="flex justify-between"><span className="text-slate-300">CricGear Pro - Endorsement</span><span className="text-blue-400">Review</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnerDashboard() {
  const team = t20Teams[0];
  const draftEligible = players.filter((p) => (p.ageGroup === "U19" || p.ageGroup === "U21") && p.verified);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {team.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{team.name}</h2>
            <p className="text-sm text-slate-400">{team.city} &middot; {team.league}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Roster Size" value={team.rosterSize} color="emerald" />
        <StatCard label="Local Quota" value={`${team.localFilled}/${team.localQuota}`} color="blue" />
        <StatCard label="Draft Eligible" value={draftEligible.length} color="purple" />
        <StatCard label="Shortlisted" value={5} color="amber" />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Draft-Ready Prospects</h3>
          <Link href="/scouting" className="text-xs text-emerald-400 hover:text-emerald-300">Open Pro Dashboard &rarr;</Link>
        </div>
        <div className="space-y-2">
          {draftEligible.slice(0, 5).map((p) => (
            <Link key={p.id} href={`/players/${p.id}`} className="flex items-center justify-between hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.role} &middot; {p.country}</p>
                </div>
              </div>
              <div className="text-right text-xs">
                <p className="text-white">{p.stats.runs}r / {p.stats.wickets}w</p>
                <p className="text-slate-500">{p.stats.matches} matches</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-purple-400 mb-2">Homegrown Quota Alert</h3>
        <p className="text-sm text-slate-400">You need {team.localQuota - team.localFilled} more local players to meet the quota. Use the Pro Scouting Dashboard to find global talent.</p>
      </div>
    </div>
  );
}

function CoachDashboard() {
  const coach = coaches[0];
  const myPlayers = players.slice(0, 6);
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
            {coach.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{coach.name}</h2>
            <p className="text-sm text-slate-400">{coach.specialization} • {coach.experience}+ yrs • {coach.region}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Players Developed" value={coach.playersDeveloped} color="emerald" />
        <StatCard label="Rating" value={coach.rating} color="amber" />
        <StatCard label="Certifications" value={coach.certifications.length} color="blue" />
        <StatCard label="Review Count" value={coach.reviewCount} color="purple" />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">My Trainees</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {myPlayers.map((p) => (
            <Link key={p.id} href={`/players/${p.id}`} className="flex items-center gap-3 hover:bg-slate-700/30 rounded-lg p-2 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {p.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{p.name}</p>
                <p className="text-xs text-slate-400">{p.role} • {p.ageGroup}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function SponsorDashboard() {
  const sponsor = sponsors[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Sponsorships" value={sponsor.sponsoredAssets.length} color="amber" />
        <StatCard label="Total Investment" value="$75K" color="emerald" />
        <StatCard label="Brand Impressions" value="125K" color="blue" />
        <StatCard label="Engagement Rate" value="4.2%" color="purple" />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Your Sponsorships</h3>
        <div className="space-y-3">
          {sponsor.sponsoredAssets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
              <div>
                <p className="text-sm font-medium text-white">{asset.name}</p>
                <p className="text-xs text-slate-400">{asset.description}</p>
              </div>
              <span className="text-sm font-bold text-emerald-400">${asset.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Performance Metrics</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Leaderboard Views</span><span className="text-white">45,230</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Brand Click-throughs</span><span className="text-white">2,180</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Social Mentions</span><span className="text-white">340</span></div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">ROI Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Cost per Impression</span><span className="text-white">$0.60</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Cost per Click</span><span className="text-white">$34.40</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Est. Brand Value</span><span className="text-emerald-400">$112K</span></div>
          </div>
        </div>
      </div>

      <Link href="/sponsors">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 hover:border-amber-500/40 transition-colors">
          <h3 className="text-sm font-semibold text-amber-400 mb-2">Expand Your Portfolio</h3>
          <p className="text-sm text-slate-400">Browse available sponsorship opportunities to increase your brand presence in the global cricket ecosystem.</p>
        </div>
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole>("player");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3">
        <Link href="/players?tab=profile" className="text-sm text-slate-400 hover:text-white">← Back to Players Home</Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">{roleLabels[role]}</h1>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="player">Player View</option>
          <option value="agent">Agent View</option>
          <option value="owner">T20 Owner View</option>
          <option value="sponsor">Sponsor View</option>
          <option value="coach">Coach View</option>
        </select>
      </div>

      {role === "player" && <PlayerDashboard />}
      {role === "agent" && <AgentDashboard />}
      {role === "owner" && <OwnerDashboard />}
      {role === "sponsor" && <SponsorDashboard />}
      {role === "coach" && <CoachDashboard />}
    </div>
  );
}
