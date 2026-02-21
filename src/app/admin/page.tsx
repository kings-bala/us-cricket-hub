"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";
import type { LoginRecord, ReinstatementRequest } from "@/context/AuthContext";

type BackendUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  academy: string | null;
  created_at: string;
};

type AuditEntry = {
  id: string;
  admin_id: string;
  action: string;
  target_id: string;
  details: Record<string, string> | null;
  created_at: string;
};

type DashboardStats = {
  totalUsers: number;
  totalSessions: number;
  totalAnalyses: number;
};

export default function AdminDashboard() {
  const { user, getUsers, blockUser, unblockUser, isUserBlocked, removeUser, getReinstatementRequests, approveReinstatement, denyReinstatement } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<LoginRecord[]>([]);
  const [backendUsers, setBackendUsers] = useState<BackendUser[]>([]);
  const [search, setSearch] = useState("");
  const [confirmAction, setConfirmAction] = useState<{ email: string; userId?: string; action: "block" | "unblock" | "remove" } | null>(null);
  const [requests, setRequests] = useState<ReinstatementRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "audit">("users");

  const refresh = useCallback(() => {
    setUsers(getUsers());
    setRequests(getReinstatementRequests());
  }, [getUsers, getReinstatementRequests]);

  const fetchBackendData = useCallback(async () => {
    const [usersRes, statsRes, auditRes] = await Promise.all([
      apiRequest<BackendUser[]>("/admin/users"),
      apiRequest<DashboardStats>("/admin/dashboard"),
      apiRequest<AuditEntry[]>("/admin/audit-log"),
    ]);
    if (usersRes.ok && Array.isArray(usersRes.data)) setBackendUsers(usersRes.data);
    if (statsRes.ok && statsRes.data) setStats(statsRes.data);
    if (auditRes.ok && Array.isArray(auditRes.data)) setAuditLog(auditRes.data);
  }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/auth");
      return;
    }
    refresh();
    fetchBackendData();
  }, [user, router, refresh, fetchBackendData]);

  if (!user || user.role !== "admin") return null;


  const handleAction = async () => {
    if (!confirmAction) return;
    const userId = confirmAction.userId || backendUsers.find((u) => u.email === confirmAction.email)?.id;
    if (confirmAction.action === "block") {
      blockUser(confirmAction.email);
      if (userId) {
        await apiRequest(`/admin/users/${userId}/block`, { method: "PUT", body: { blocked: true } });
      }
    } else if (confirmAction.action === "unblock") {
      unblockUser(confirmAction.email);
      if (userId) {
        await apiRequest(`/admin/users/${userId}/block`, { method: "PUT", body: { blocked: false } });
      }
    } else if (confirmAction.action === "remove") {
      removeUser(confirmAction.email);
      if (userId) {
        await apiRequest(`/admin/users/${userId}/block`, { method: "PUT", body: { blocked: true } });
      }
    }
    setConfirmAction(null);
    refresh();
    fetchBackendData();
  };

  const mergedUsers = backendUsers.length > 0
    ? backendUsers.map((bu) => {
        const local = users.find((u) => u.email.toLowerCase() === bu.email.toLowerCase());
        return {
          email: bu.email,
          name: bu.full_name || (local ? local.name : bu.email),
          role: bu.role || (local ? local.role : "player"),
          loginAt: local?.loginAt || bu.created_at,
          lastActive: local?.lastActive || bu.created_at,
          id: bu.id,
        };
      })
    : users.map((u) => ({ ...u, id: "" }));

  const totalUsers = stats?.totalUsers ?? mergedUsers.length;
  const activeUsers = stats ? totalUsers - (mergedUsers.filter((u) => isUserBlocked(u.email)).length) : mergedUsers.filter((u) => !isUserBlocked(u.email)).length;
  const blockedUsers = mergedUsers.filter((u) => isUserBlocked(u.email)).length;
  const totalSessions = stats?.totalSessions ?? 0;
  const totalAnalyses = stats?.totalAnalyses ?? 0;

  const filtered = mergedUsers.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Manage user access and monitor activity</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-sm text-slate-400">Signed in as <span className="text-white font-medium">{user.name}</span></span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/labeling" className="flex items-center gap-2 bg-slate-800/50 border border-purple-500/30 rounded-xl px-5 py-3 hover:border-purple-500/50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">Dataset Labeling</p>
              <p className="text-xs text-slate-500">Label analysis clips for ML training</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalUsers}</p>
                <p className="text-xs text-slate-400">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{activeUsers}</p>
                <p className="text-xs text-slate-400">Active Users</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{blockedUsers}</p>
                <p className="text-xs text-slate-400">Blocked Users</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalSessions}</p>
                <p className="text-xs text-slate-400">Total Sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalAnalyses}</p>
                <p className="text-xs text-slate-400">Total Analyses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setActiveTab("users")} className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${activeTab === "users" ? "bg-emerald-500 text-white" : "bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50"}`}>Users</button>
          <button onClick={() => setActiveTab("audit")} className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${activeTab === "audit" ? "bg-emerald-500 text-white" : "bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50"}`}>Audit Log {auditLog.length > 0 && <span className="ml-1 text-xs opacity-70">({auditLog.length})</span>}</button>
        </div>

        {activeTab === "audit" && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <div className="p-5 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">Audit Log</h2>
              <p className="text-xs text-slate-500 mt-1">Admin actions synced from backend database</p>
            </div>
            {auditLog.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-400 text-sm">No audit entries yet. Actions like blocking users will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/30">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="px-5 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        entry.action.includes("block") ? "bg-red-500/20 text-red-400" :
                        entry.action.includes("unblock") ? "bg-emerald-500/20 text-emerald-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {entry.action.includes("block") ? "B" : entry.action.includes("role") ? "R" : "A"}
                      </div>
                      <div>
                        <p className="text-sm text-white">{entry.action.replace(/_/g, " ")}</p>
                        <p className="text-xs text-slate-500">by {entry.admin_id} {entry.details && Object.keys(entry.details).length > 0 ? `• ${JSON.stringify(entry.details)}` : ""}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 shrink-0">{new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl">
          <div className="p-5 border-b border-slate-700/50 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white whitespace-nowrap">User Activity Log</h2>
            <div className="relative flex-1 max-w-sm">
              <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-slate-400 text-sm">No users found. Users will appear here once they log in.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">First Login</th>
                    <th className="px-5 py-3">Last Active</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filtered.map((u) => {
                    const blocked = isUserBlocked(u.email);
                    const isAdmin = u.role === "admin";
                    return (
                      <tr key={u.email} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${blocked ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${u.role === "admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">
                          {new Date(u.loginAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">
                          {new Date(u.lastActive).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-5 py-4">
                          {blocked ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Blocked</span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {isAdmin ? (
                            <span className="text-xs text-slate-600">Protected</span>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              {blocked ? (
                                <button
                                  onClick={() => setConfirmAction({ email: u.email, userId: u.id, action: "unblock" })}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                                >
                                  Restore
                                </button>
                              ) : (
                                <button
                                  onClick={() => setConfirmAction({ email: u.email, userId: u.id, action: "block" })}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                                >
                                  Suspend
                                </button>
                              )}
                              <button
                                onClick={() => setConfirmAction({ email: u.email, userId: u.id, action: "remove" })}
                                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>}

        {requests.filter((r) => r.status === "pending").length > 0 && (
          <div className="bg-slate-800/50 border border-amber-500/30 rounded-xl">
            <div className="p-5 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-400">Reinstatement Requests</h2>
                  <p className="text-xs text-slate-400">{requests.filter((r) => r.status === "pending").length} pending request(s)</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-700/30">
              {requests.filter((r) => r.status === "pending").map((req) => (
                <div key={req.email + req.requestedAt} className="p-5 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-400">{req.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="text-sm font-medium text-white">{req.name}</p>
                        <p className="text-xs text-slate-500">{req.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-xs text-slate-500 mb-1">Reason:</p>
                      <p className="text-sm text-slate-300">{req.reason}</p>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">Requested {new Date(req.requestedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { approveReinstatement(req.email); refresh(); }}
                      className="text-xs px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => { denyReinstatement(req.email); refresh(); }}
                      className="text-xs px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${confirmAction.action === "unblock" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                <svg className={`w-5 h-5 ${confirmAction.action === "unblock" ? "text-emerald-400" : "text-red-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {confirmAction.action === "unblock" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  )}
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {confirmAction.action === "block" && "Suspend User Access"}
                  {confirmAction.action === "unblock" && "Restore User Access"}
                  {confirmAction.action === "remove" && "Remove User"}
                </h3>
                <p className="text-sm text-slate-400">{confirmAction.email}</p>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              {confirmAction.action === "block" && "This user will not be able to log in until you restore their access."}
              {confirmAction.action === "unblock" && "This will restore the user's ability to log in."}
              {confirmAction.action === "remove" && "This will remove the user from the activity log and block their access. This cannot be undone."}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  confirmAction.action === "unblock"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {confirmAction.action === "block" && "Suspend"}
                {confirmAction.action === "unblock" && "Restore"}
                {confirmAction.action === "remove" && "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
