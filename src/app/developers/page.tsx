"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getItem, setItem } from "@/lib/storage";

interface ApiKey {
  key: string;
  name: string;
  createdAt: string;
  lastUsed: string | null;
}

export default function DevelopersPage() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>(() => {
    if (typeof window === "undefined") return [];
    return getItem<ApiKey[]>("api_keys", []);
  });
  const [newKeyName, setNewKeyName] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const generateKey = useCallback(() => {
    if (!newKeyName.trim()) return;
    const key: ApiKey = {
      key: `cv360_${crypto.randomUUID().replace(/-/g, "")}`,
      name: newKeyName.trim(),
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };
    const updated = [...keys, key];
    setKeys(updated);
    setItem("api_keys", updated);
    setNewKeyName("");
  }, [newKeyName, keys]);

  const revokeKey = useCallback(
    (keyStr: string) => {
      const updated = keys.filter((k) => k.key !== keyStr);
      setKeys(updated);
      setItem("api_keys", updated);
    },
    [keys]
  );

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/players",
      description: "List players with optional filters",
      params: [
        { name: "role", type: "string", desc: "Filter by role: Batsman, Bowler, All-Rounder, Wicket-Keeper" },
        { name: "region", type: "string", desc: "Filter by region: Americas, South Asia, etc." },
        { name: "limit", type: "number", desc: "Max results (default 50, max 100)" },
        { name: "offset", type: "number", desc: "Pagination offset" },
      ],
    },
    {
      method: "GET",
      path: "/api/v1/stats",
      description: "Get player statistics",
      params: [{ name: "playerId", type: "string", desc: "Player ID (required)" }],
    },
    {
      method: "GET",
      path: "/api/v1/leaderboard",
      description: "Get leaderboard rankings",
      params: [
        { name: "category", type: "string", desc: "Category: overall, batting, bowling, fielding" },
        { name: "limit", type: "number", desc: "Max results (default 20, max 50)" },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Developer API</h1>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
            Beta
          </span>
        </div>
        <p className="text-slate-400">
          Access CricVerse360 cricket data programmatically. Build apps, integrations, and analytics on top of our platform.
        </p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">API Keys</h2>
        {!user ? (
          <p className="text-slate-400 text-sm">Sign in to generate API keys.</p>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key name (e.g. My App)"
                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => { if (e.key === "Enter") generateKey(); }}
              />
              <button
                onClick={generateKey}
                disabled={!newKeyName.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Generate Key
              </button>
            </div>
            {keys.length > 0 ? (
              <div className="space-y-2">
                {keys.map((k) => (
                  <div key={k.key} className="flex items-center justify-between bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium">{k.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-xs text-slate-400 font-mono truncate">{k.key}</code>
                        <button
                          onClick={() => copyKey(k.key)}
                          className="text-xs text-blue-400 hover:text-blue-300 shrink-0"
                        >
                          {copied === k.key ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => revokeKey(k.key)}
                      className="text-xs text-red-400 hover:text-red-300 ml-4"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No API keys yet. Generate one to get started.</p>
            )}
          </>
        )}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">Authentication</h2>
        <p className="text-sm text-slate-400 mb-4">
          Include your API key in the <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">x-api-key</code> header with every request.
        </p>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <p className="text-slate-500"># Example request</p>
          <p className="text-emerald-400">
            curl -H &quot;x-api-key: cv360_your_key_here&quot; \
          </p>
          <p className="text-emerald-400 pl-4">
            https://cricverse360.com/api/v1/players?role=Batsman
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Endpoints</h2>
        {endpoints.map((ep) => (
          <div key={ep.path} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                {ep.method}
              </span>
              <code className="text-white font-mono text-sm">{ep.path}</code>
            </div>
            <p className="text-sm text-slate-400 mb-4">{ep.description}</p>
            {ep.params.length > 0 && (
              <div className="bg-slate-900/50 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left px-4 py-2 text-xs text-slate-500 font-medium">Parameter</th>
                      <th className="text-left px-4 py-2 text-xs text-slate-500 font-medium">Type</th>
                      <th className="text-left px-4 py-2 text-xs text-slate-500 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ep.params.map((p) => (
                      <tr key={p.name} className="border-b border-slate-700/30">
                        <td className="px-4 py-2 font-mono text-blue-400">{p.name}</td>
                        <td className="px-4 py-2 text-slate-500">{p.type}</td>
                        <td className="px-4 py-2 text-slate-400">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Rate Limits</h3>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Free tier: 100 requests/day. Pro tier: 10,000 requests/day. Academy tier: 50,000 requests/day.
          Need more? Contact us for enterprise access.
        </p>
      </div>
    </div>
  );
}
