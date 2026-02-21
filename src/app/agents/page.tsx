"use client";

import { useState } from "react";
import Link from "next/link";
import { agents, players } from "@/data/mock";

export default function AgentsPage() {
  const [requestAgent, setRequestAgent] = useState<string | null>(null);
  const [requestMsg, setRequestMsg] = useState("");
  const [requestsSent, setRequestsSent] = useState<Record<string, boolean>>({});
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Agent Marketplace</h1>
        <p className="text-slate-400">
          Verified representation agents connecting talent with T20 leagues worldwide
        </p>
      </div>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">How the Agent Marketplace Works</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-emerald-400 font-bold">1</span>
            </div>
            <p className="text-sm text-slate-300 font-medium">Players Get Discovered</p>
            <p className="text-xs text-slate-500 mt-1">Agents browse verified profiles from across the globe</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-400 font-bold">2</span>
            </div>
            <p className="text-sm text-slate-300 font-medium">Data-Backed Representation</p>
            <p className="text-xs text-slate-500 mt-1">Agents use verified stats to negotiate placements</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-400 font-bold">3</span>
            </div>
            <p className="text-sm text-slate-300 font-medium">Platform Commission</p>
            <p className="text-xs text-slate-500 mt-1">Platform fee on successful T20 contracts and sponsorships</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const agentPlayers = players.filter((p) => agent.playerIds.includes(p.id));
          return (
            <Link key={agent.id} href={`/agents/${agent.id}`}>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all group h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {agent.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {agent.name}
                      </h3>
                      {agent.verified && (
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{agent.agency}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{agent.bio}</p>

                <div className="bg-slate-900/50 rounded-lg p-3 mb-2">
                  <p className="text-xs text-slate-500 mb-1">Specialization</p>
                  <p className="text-sm text-emerald-400">{agent.specialization}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-slate-500 mb-1">Based in</p>
                  <p className="text-sm text-white">{agent.country} &middot; {agent.region}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                  <div>
                    <p className="text-lg font-bold text-white">{agent.placements}</p>
                    <p className="text-xs text-slate-500">Placements</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{agent.successRate}%</p>
                    <p className="text-xs text-slate-500">Success</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-400">{agent.rating}</p>
                    <p className="text-xs text-slate-500">Rating</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-2">Current Stable ({agentPlayers.length} players)</p>
                  <div className="flex -space-x-2">
                    {agentPlayers.slice(0, 5).map((p) => (
                      <div key={p.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-slate-800">
                        {p.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    ))}
                    {agentPlayers.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs border-2 border-slate-800">
                        +{agentPlayers.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!requestsSent[agent.id]) { setRequestAgent(agent.id); setRequestMsg(""); } }}
                  className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    requestsSent[agent.id]
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30 cursor-default"
                      : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {requestsSent[agent.id] ? "Request Sent" : "Request Representation"}
                </button>
              </div>
            </Link>
          );
        })}
      </div>

      {requestAgent && (() => {
        const agent = agents.find((a) => a.id === requestAgent);
        if (!agent) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setRequestAgent(null)}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {agent.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-white font-semibold">{agent.name}</p>
                  <p className="text-xs text-slate-400">{agent.agency} &middot; {agent.country}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3">Request representation from {agent.name.split(" ")[0]}:</p>
              <textarea
                value={requestMsg}
                onChange={(e) => setRequestMsg(e.target.value)}
                placeholder="Hi, I'm a player looking for representation. Here's why I'd be a great fit..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 h-24 resize-none"
              />
              <div className="flex gap-2 mt-4">
                <button onClick={() => setRequestAgent(null)} className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:bg-slate-700/50 transition-colors">Cancel</button>
                <button
                  onClick={() => { setRequestsSent((prev) => ({ ...prev, [agent.id]: true })); setRequestAgent(null); }}
                  className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                >Send Request</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
