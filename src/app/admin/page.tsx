"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import Link from "next/link";

interface DashboardData {
  totalUsers: number;
  totalPlayerProfiles: number;
  totalUploads: number;
  totalAnalyses: number;
  paidUsers: number;
  freeUsers: number;
  activeSubscriptions: number;
  pendingCoachRequests: number;
  failedVideos: number;
  freeToConversion: string;
  recentUsers: { id: string; email: string; name: string; role: string; created_at: string }[];
  recentAnalyses: { id: string; analysis_type: string; scores: string; created_at: string; email: string }[];
}

interface FunnelStep {
  event: string;
  count: number;
}

interface AnalyticsData {
  funnel: FunnelStep[];
  allEvents: Record<string, number>;
  recentEvents: { id: string; user_id: string; event_name: string; event_data: string; created_at: string }[];
  totalEvents: number;
}

const EVENT_LABELS: Record<string, string> = {
  landing_page_viewed: "Landing Page",
  hero_cta_clicked: "Hero CTA Click",
  sample_analysis_viewed: "Sample Analysis",
  upload_started: "Upload Started",
  video_uploaded: "Video Uploaded",
  analysis_started: "Analysis Started",
  analysis_completed: "Analysis Done",
  report_viewed: "Report Viewed",
  paywall_viewed: "Paywall Shown",
  unlock_clicked: "Unlock Clicked",
  checkout_started: "Checkout Started",
  one_time_purchase_completed: "One-Time Purchase",
  purchase_completed: "Purchase Done",
  subscription_completed: "Subscription",
  share_prompt_viewed: "Share Prompt",
  share_card_created: "Card Created",
  share_card_downloaded: "Card Downloaded",
  share_card_shared: "Card Shared",
  share_link_copied: "Link Copied",
  leaderboard_viewed: "Leaderboard",
  profile_shared: "Profile Shared",
  coach_request_submitted: "Coach Request",
};

interface FeaturedPlayer {
  name: string;
  username: string;
  role: string;
  score: number;
  location: string;
  featured: boolean;
}

// Admin player list will be populated from real user data
const ADMIN_PLAYERS: FeaturedPlayer[] = [];

export default function AdminDashboardPage() {
  const { user, tokens, loading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);
  const [tab, setTab] = useState<"overview" | "funnel" | "events" | "players">("overview");
  const [players, setPlayers] = useState<FeaturedPlayer[]>(ADMIN_PLAYERS);

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    Promise.all([
      apiGet<DashboardData>("/admin/dashboard", tokens?.accessToken),
      apiGet<AnalyticsData>("/admin/analytics", tokens?.accessToken).catch(() => null),
    ]).then(([d, a]) => {
      setData(d);
      if (a) setAnalytics(a);
      setFetching(false);
    }).catch((e) => {
      setError(e.message || "Access denied");
      setFetching(false);
    });
  }, [user, tokens, loading]);

  if (loading || fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-6">Please sign in to access the admin dashboard.</p>
          <Link href="/auth" className="text-emerald-400 hover:text-emerald-300">Sign In</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link href="/" className="text-emerald-400 hover:text-emerald-300">Go Home</Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "Total Users", value: data.totalUsers, color: "text-blue-400" },
    { label: "Player Profiles", value: data.totalPlayerProfiles, color: "text-emerald-400" },
    { label: "Video Uploads", value: data.totalUploads, color: "text-purple-400" },
    { label: "Analyses", value: data.totalAnalyses, color: "text-cyan-400" },
    { label: "Paid Users", value: data.paidUsers, color: "text-emerald-400" },
    { label: "Free Users", value: data.freeUsers, color: "text-slate-400" },
    { label: "Active Subscriptions", value: data.activeSubscriptions, color: "text-emerald-400" },
    { label: "Conversion Rate", value: data.freeToConversion, color: "text-yellow-400" },
    { label: "Pending Coach Requests", value: data.pendingCoachRequests, color: "text-orange-400" },
    { label: "Failed Videos", value: data.failedVideos, color: "text-red-400" },
  ];

  const maxFunnel = analytics ? Math.max(...analytics.funnel.map(f => f.count), 1) : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {(["overview", "funnel", "events", "players"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t
                ? "bg-emerald-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            {t === "overview" ? "Overview" : t === "funnel" ? "Conversion Funnel" : t === "events" ? "Event Log" : "Featured Players"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {stats.map((s) => (
              <div key={s.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-2 pr-4">Email</th>
                    <th className="text-left py-2 pr-4">Name</th>
                    <th className="text-left py-2 pr-4">Role</th>
                    <th className="text-left py-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentUsers.map((u) => (
                    <tr key={u.id} className="text-slate-300 border-b border-slate-800">
                      <td className="py-2 pr-4">{u.email}</td>
                      <td className="py-2 pr-4">{u.name || "\u2014"}</td>
                      <td className="py-2 pr-4 capitalize">{u.role}</td>
                      <td className="py-2 text-slate-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "\u2014"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Analyses</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-2 pr-4">User</th>
                    <th className="text-left py-2 pr-4">Type</th>
                    <th className="text-left py-2 pr-4">Score</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentAnalyses.map((a) => {
                    let score = "\u2014";
                    try { const s = JSON.parse(a.scores); score = s.overall || "\u2014"; } catch { /* noop */ }
                    return (
                      <tr key={a.id} className="text-slate-300 border-b border-slate-800">
                        <td className="py-2 pr-4">{a.email}</td>
                        <td className="py-2 pr-4 capitalize">{a.analysis_type}</td>
                        <td className="py-2 pr-4 text-emerald-400 font-semibold">{score}</td>
                        <td className="py-2 text-slate-500">{a.created_at ? new Date(a.created_at).toLocaleDateString() : "\u2014"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Conversion Funnel Tab */}
      {tab === "funnel" && analytics && (
        <div className="space-y-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Conversion Funnel</h2>
              <span className="text-sm text-slate-400">{analytics.totalEvents} total events</span>
            </div>
            <div className="space-y-3">
              {analytics.funnel.map((step, i) => {
                const prevCount = i > 0 ? analytics.funnel[i - 1].count : step.count;
                const dropoff = prevCount > 0 && i > 0
                  ? ((1 - step.count / prevCount) * 100).toFixed(1)
                  : null;
                const barWidth = maxFunnel > 0 ? (step.count / maxFunnel) * 100 : 0;

                return (
                  <div key={step.event} className="group">
                    <div className="flex items-center gap-4">
                      <div className="w-36 shrink-0">
                        <p className="text-sm text-slate-300 font-medium">{EVENT_LABELS[step.event] || step.event}</p>
                      </div>
                      <div className="flex-1 bg-slate-700/30 rounded-full h-8 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-end pr-3 transition-all"
                          style={{ width: `${Math.max(barWidth, 2)}%` }}
                        >
                          {barWidth > 15 && (
                            <span className="text-xs font-bold text-white">{step.count}</span>
                          )}
                        </div>
                      </div>
                      <div className="w-16 text-right shrink-0">
                        <span className="text-sm font-bold text-white">{step.count}</span>
                      </div>
                      <div className="w-20 text-right shrink-0">
                        {dropoff !== null && parseFloat(dropoff) > 0 ? (
                          <span className="text-xs text-red-400 font-medium">-{dropoff}%</span>
                        ) : dropoff !== null ? (
                          <span className="text-xs text-emerald-400 font-medium">0%</span>
                        ) : (
                          <span className="text-xs text-slate-500">&mdash;</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Conversion Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              const e = analytics.allEvents;
              const pct = (num: number, den: number) => den > 0 ? ((num / den) * 100).toFixed(1) + "%" : "0%";
              return [
                { label: "Upload Conversion", sub: "Landing \u2192 Upload", value: pct(e["video_uploaded"] || 0, e["landing_page_viewed"] || 0), color: "text-blue-400" },
                { label: "Paywall \u2192 Purchase", sub: "Paywall view \u2192 paid", value: pct((e["purchase_completed"] || 0) + (e["subscription_completed"] || 0), e["paywall_viewed"] || 0), color: "text-emerald-400" },
                { label: "Share Card Usage", sub: "Report \u2192 shared", value: pct((e["share_card_downloaded"] || 0) + (e["share_card_shared"] || 0) + (e["share_link_copied"] || 0), e["share_prompt_viewed"] || e["report_viewed"] || 0), color: "text-amber-400" },
                { label: "Free \u2192 Paid", sub: "Signup \u2192 purchase", value: pct((e["purchase_completed"] || 0) + (e["subscription_completed"] || 0), e["signup_completed"] || 0), color: "text-purple-400" },
              ];
            })().map((m) => (
              <div key={m.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-0.5">{m.label}</p>
                <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                <p className="text-[10px] text-slate-500 mt-1">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "funnel" && !analytics && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
          <p className="text-slate-400">No analytics data available yet. Events will appear as users interact with the site.</p>
        </div>
      )}

      {/* Event Log Tab */}
      {tab === "events" && analytics && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2 pr-4">Event</th>
                  <th className="text-left py-2 pr-4">User ID</th>
                  <th className="text-left py-2 pr-4">Data</th>
                  <th className="text-left py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentEvents.map((e) => {
                  let eventDataStr = "";
                  try {
                    const parsed = typeof e.event_data === "string" ? JSON.parse(e.event_data) : e.event_data;
                    eventDataStr = Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join(", ");
                  } catch { eventDataStr = String(e.event_data || ""); }
                  return (
                    <tr key={e.id} className="text-slate-300 border-b border-slate-800">
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          {EVENT_LABELS[e.event_name] || e.event_name}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-slate-500 font-mono text-xs">{e.user_id ? e.user_id.slice(0, 8) + "..." : "anon"}</td>
                      <td className="py-2 pr-4 text-slate-500 text-xs max-w-xs truncate">{eventDataStr || "\u2014"}</td>
                      <td className="py-2 text-slate-500 text-xs whitespace-nowrap">
                        {e.created_at ? new Date(e.created_at).toLocaleString() : "\u2014"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "events" && !analytics && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
          <p className="text-slate-400">No events recorded yet.</p>
        </div>
      )}

      {/* Featured Players Tab */}
      {tab === "players" && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Manage Featured Players</h2>
                <p className="text-sm text-slate-400 mt-1">Toggle featured status for leaderboard players. Featured players get a badge and higher visibility.</p>
              </div>
              <div className="text-sm text-slate-400">
                {players.filter(p => p.featured).length} featured
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-2 pr-4">Player</th>
                    <th className="text-left py-2 pr-4">Role</th>
                    <th className="text-left py-2 pr-4">Score</th>
                    <th className="text-left py-2 pr-4">Location</th>
                    <th className="text-left py-2 pr-4">Status</th>
                    <th className="text-right py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p) => (
                    <tr key={p.username} className="text-slate-300 border-b border-slate-800">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {p.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="font-medium text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 capitalize">{p.role}</td>
                      <td className="py-3 pr-4">
                        <span className={`font-bold ${p.score >= 85 ? "text-emerald-400" : p.score >= 70 ? "text-blue-400" : "text-amber-400"}`}>
                          {p.score}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-400">{p.location}</td>
                      <td className="py-3 pr-4">
                        {p.featured ? (
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">Featured</span>
                        ) : (
                          <span className="text-xs bg-slate-700/50 text-slate-500 border border-slate-600/30 px-2 py-0.5 rounded-full">Standard</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setPlayers(prev => prev.map(pl =>
                              pl.username === p.username ? { ...pl, featured: !pl.featured } : pl
                            ));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            p.featured
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                              : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                          }`}
                        >
                          {p.featured ? "Unfeature" : "Feature"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Badge Guide</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded">Top 10 This Week</span>
                <span className="text-xs text-slate-400">Auto-assigned to top 10 weekly</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">Featured Player</span>
                <span className="text-xs text-slate-400">Admin-toggled featured status</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded">Best Bowling Score</span>
                <span className="text-xs text-slate-400">Highest bowling analysis score</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
