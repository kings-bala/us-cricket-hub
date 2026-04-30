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

export default function AdminDashboardPage() {
  const { user, tokens, loading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    apiGet<DashboardData>("/admin/dashboard", tokens?.accessToken)
      .then((d) => { setData(d); setFetching(false); })
      .catch((e) => { setError(e.message || "Access denied"); setFetching(false); });
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Users */}
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
                  <td className="py-2 pr-4">{u.name || "—"}</td>
                  <td className="py-2 pr-4 capitalize">{u.role}</td>
                  <td className="py-2 text-slate-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Analyses */}
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
                let score = "—";
                try { const s = JSON.parse(a.scores); score = s.overall || "—"; } catch { /* noop */ }
                return (
                  <tr key={a.id} className="text-slate-300 border-b border-slate-800">
                    <td className="py-2 pr-4">{a.email}</td>
                    <td className="py-2 pr-4 capitalize">{a.analysis_type}</td>
                    <td className="py-2 pr-4 text-emerald-400 font-semibold">{score}</td>
                    <td className="py-2 text-slate-500">{a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
