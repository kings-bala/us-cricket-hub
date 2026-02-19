"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { LoginRecord, ReinstatementRequest } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user, getUsers, blockUser, unblockUser, isUserBlocked, removeUser, getReinstatementRequests, approveReinstatement, denyReinstatement } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<LoginRecord[]>([]);
  const [search, setSearch] = useState("");
  const [confirmAction, setConfirmAction] = useState<{ email: string; action: "block" | "unblock" | "remove" } | null>(null);
  const [requests, setRequests] = useState<ReinstatementRequest[]>([]);

  const refresh = useCallback(() => {
    setUsers(getUsers());
    setRequests(getReinstatementRequests());
  }, [getUsers, getReinstatementRequests]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/auth");
      return;
    }
    refresh();
  }, [user, router, refresh]);

  if (!user || user.role !== "admin") return null;

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = () => {
    if (!confirmAction) return;
    if (confirmAction.action === "block") {
      blockUser(confirmAction.email);
    } else if (confirmAction.action === "unblock") {
      unblockUser(confirmAction.email);
    } else if (confirmAction.action === "remove") {
      removeUser(confirmAction.email);
    }
    setConfirmAction(null);
    refresh();
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !isUserBlocked(u.email)).length;
  const blockedUsers = users.filter((u) => isUserBlocked(u.email)).length;

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
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl">
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
                                  onClick={() => setConfirmAction({ email: u.email, action: "unblock" })}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                                >
                                  Restore
                                </button>
                              ) : (
                                <button
                                  onClick={() => setConfirmAction({ email: u.email, action: "block" })}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                                >
                                  Suspend
                                </button>
                              )}
                              <button
                                onClick={() => setConfirmAction({ email: u.email, action: "remove" })}
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
        </div>

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
