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
  sample_analysis_viewed: "Sample Analysis",
  signup_completed: "Signup",
  video_uploaded: "Video Upload",
  analysis_completed: "Analysis Done",
  report_viewed: "Report Viewed",
  paywall_viewed: "Paywall Shown",
  checkout_started: "Checkout Started",
  purchase_completed: "Purchase Done",
  subscription_completed: "Subscription",
  share_card_created: "Card Created",
  share_card_shared: "Card Shared",
  leaderboard_viewed: "Leaderboard",
  coach_request_submitted: "Coach Request",
};

export default function AdminDashboardPage() {
  const { user, tokens, loading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);
  const [tab, setTab] = useState<"overview" | "funnel" | "events">("overview");

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
      <div className="flex gap-2 mb-8">
        {(["overview", "funnel", "events"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t
                ? "bg-emerald-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            {t === "overview" ? "Overview" : t === "funnel" ? "Conversion Funnel" : "Event Log"}
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

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Landing to Signup",
                value: analytics.funnel[0]?.count && analytics.funnel[2]?.count
                  ? ((analytics.funnel[2].count / analytics.funnel[0].count) * 100).toFixed(1) + "%"
                  : "0%",
                color: "text-blue-400",
              },
              {
                label: "Signup to Upload",
                value: analytics.funnel[2]?.count && analytics.funnel[3]?.count
                  ? ((analytics.funnel[3].count / analytics.funnel[2].count) * 100).toFixed(1) + "%"
                  : "0%",
                color: "text-purple-400",
              },
              {
                label: "Paywall to Purchase",
                value: analytics.funnel[6]?.count && (analytics.funnel[8]?.count + analytics.funnel[9]?.count)
                  ? (((analytics.funnel[8].count + analytics.funnel[9].count) / analytics.funnel[6].count) * 100).toFixed(1) + "%"
                  : "0%",
                color: "text-emerald-400",
              },
              {
                label: "Analysis to Share",
                value: analytics.funnel[4]?.count && analytics.funnel[11]?.count
                  ? ((analytics.funnel[11].count / analytics.funnel[4].count) * 100).toFixed(1) + "%"
                  : "0%",
                color: "text-amber-400",
              },
            ].map((m) => (
              <div key={m.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{m.label}</p>
                <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
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
    </div>
  );
}
