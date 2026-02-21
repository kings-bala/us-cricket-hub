"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getItem, setItem, removeItem } from "@/lib/storage";
import { setApiUser, clearApiUser, setAccessToken, apiRequest } from "@/lib/api-client";
import type { Academy, AcademyStaff } from "@/types";

export type AuthUser = {
  email: string;
  name: string;
  role: "player" | "agent" | "owner" | "sponsor" | "coach" | "admin" | "academy_admin";
  playerId?: string;
  avatar?: string;
  academyId?: string;
  authMode?: "cognito" | "demo";
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
};

export type LoginRecord = {
  email: string;
  name: string;
  role: string;
  loginAt: string;
  lastActive: string;
};

export type ReinstatementRequest = {
  email: string;
  name: string;
  reason: string;
  requestedAt: string;
  status: "pending" | "approved" | "denied";
};

function getLoginLog(): LoginRecord[] {
  return getItem<LoginRecord[]>("login_log", []);
}

function saveLoginRecord(user: AuthUser) {
  const log = getLoginLog();
  const now = new Date().toISOString();
  const idx = log.findIndex((r) => r.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    log[idx].lastActive = now;
    log[idx].name = user.name;
  } else {
    log.push({ email: user.email, name: user.name, role: user.role, loginAt: now, lastActive: now });
  }
  setItem("login_log", log);
}

function getBlockedUsers(): string[] {
  return getItem<string[]>("blocked_users", []);
}

function isBlocked(email: string): boolean {
  return getBlockedUsers().some((e) => e.toLowerCase() === email.toLowerCase());
}

function getReinstatementRequests(): ReinstatementRequest[] {
  return getItem<ReinstatementRequest[]>("reinstatement_requests", []);
}

function seedRisingStarAcademy() {
  const academies = getItem<Academy[]>("academies", []);
  const existing = academies.find((a) => a.id === "academy_risingstar");
  const playerEmails = ["arjun@cricverse360.com", "jake@cricverse360.com", "rashid@cricverse360.com", "rahul@cricverse360.com", "neel@risingstar.com"];
  if (existing) {
    if (existing.playerEmails.length === 0) {
      existing.playerEmails = playerEmails;
      setItem("academies", academies);
    }
    return;
  }
  academies.push({
    id: "academy_risingstar",
    name: "Rising Star Cricket Academy",
    location: "USA",
    logo: "/rising-star-logo.jpg",
    headCoach: "Coach Yashwant",
    contactEmail: "risingstar@cricverse360.com",
    adminEmail: "risingstar@cricverse360.com",
    joinCode: "RSCA26",
    seatPlan: "pro",
    maxSeats: 50,
    playerEmails,
    coachEmails: ["yashwant@risingstar.com", "aji@risingstar.com", "mandar@risingstar.com", "vraj@risingstar.com"],
    createdAt: new Date().toISOString(),
  });
  setItem("academies", academies);
  const staff = getItem<AcademyStaff[]>("academy_staff", []);
  const coaches: { name: string; email: string; role: "Head Coach" | "Assistant Coach" | "Bowling Coach" | "Batting Coach" }[] = [
    { name: "Coach Yashwant", email: "yashwant@risingstar.com", role: "Head Coach" },
    { name: "Coach Aji", email: "aji@risingstar.com", role: "Bowling Coach" },
    { name: "Coach Mandar", email: "mandar@risingstar.com", role: "Batting Coach" },
    { name: "Coach Vraj", email: "vraj@risingstar.com", role: "Assistant Coach" },
  ];
  for (const c of coaches) {
    if (!staff.some((s) => s.email === c.email && s.academyId === "academy_risingstar")) {
      staff.push({ id: `staff_rs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: c.name, email: c.email, phone: "", role: c.role, specialization: "", joinedAt: new Date().toISOString(), academyId: "academy_risingstar" });
    }
  }
  setItem("academy_staff", staff);
}

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  register: (data: { email: string; password: string; fullName: string; role?: string }) => Promise<{ error?: string; needsVerification?: boolean }>;
  verifyEmail: (email: string, code: string) => Promise<string | null>;
  forgotPassword: (email: string) => Promise<string | null>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<string | null>;
  isLoading: boolean;
  getUsers: () => LoginRecord[];
  blockUser: (email: string) => void;
  unblockUser: (email: string) => void;
  isUserBlocked: (email: string) => boolean;
  removeUser: (email: string) => void;
  requestReinstatement: (email: string, reason: string) => string | null;
  getReinstatementRequests: () => ReinstatementRequest[];
  approveReinstatement: (email: string) => void;
  denyReinstatement: (email: string) => void;
  hasPendingRequest: (email: string) => boolean;
};

const SEED_ACCOUNTS: { email: string; password: string; user: AuthUser }[] = [
  { email: "arjun@cricverse360.com", password: "player123", user: { email: "arjun@cricverse360.com", name: "Arjun Patel", role: "player", playerId: "p1", avatar: "/avatars/player1.jpg", academyId: "academy_risingstar" } },
  { email: "jake@cricverse360.com", password: "player123", user: { email: "jake@cricverse360.com", name: "Jake Thompson", role: "player", playerId: "p2", avatar: "/avatars/player2.jpg", academyId: "academy_risingstar" } },
  { email: "rashid@cricverse360.com", password: "player123", user: { email: "rashid@cricverse360.com", name: "Rashid Mohammed", role: "player", playerId: "p3", avatar: "/avatars/player3.jpg", academyId: "academy_risingstar" } },
  { email: "rahul@cricverse360.com", password: "player123", user: { email: "rahul@cricverse360.com", name: "Rahul Desai", role: "player", playerId: "p8", avatar: "/avatars/player8.jpg", academyId: "academy_risingstar" } },
  { email: "vikram.singh.cricket@gmail.com", password: "Cricket2026!", user: { email: "vikram.singh.cricket@gmail.com", name: "Vikram Singh", role: "player", playerId: "p9" } },
  { email: "neel@risingstar.com", password: "player123", user: { email: "neel@risingstar.com", name: "Neel Sharma", role: "player", playerId: "p10", academyId: "academy_risingstar" } },
  { email: "yashwant@risingstar.com", password: "coach123", user: { email: "yashwant@risingstar.com", name: "Coach Yashwant", role: "coach", academyId: "academy_risingstar" } },
  { email: "aji@risingstar.com", password: "coach123", user: { email: "aji@risingstar.com", name: "Coach Aji", role: "coach", academyId: "academy_risingstar" } },
  { email: "admin@cricverse360.com", password: "admin123", user: { email: "admin@cricverse360.com", name: "Master Admin", role: "admin" } },
  { email: "superadmin@cricverse360.com", password: "Super@2026", user: { email: "superadmin@cricverse360.com", name: "Super Admin", role: "admin" } },
  { email: "academy@cricverse360.com", password: "academy123", user: { email: "academy@cricverse360.com", name: "NorCal Cricket Academy", role: "academy_admin", academyId: "academy_demo" } },
  { email: "risingstar@cricverse360.com", password: "risingstar123", user: { email: "risingstar@cricverse360.com", name: "Rising Star Cricket Academy", role: "academy_admin", academyId: "academy_risingstar" } },
  { email: "agent@cricverse360.com", password: "agent123", user: { email: "agent@cricverse360.com", name: "Ravi Mehta", role: "agent" } },
  { email: "owner@cricverse360.com", password: "owner123", user: { email: "owner@cricverse360.com", name: "Vikram Holdings", role: "owner" } },
  { email: "sponsor@cricverse360.com", password: "sponsor123", user: { email: "sponsor@cricverse360.com", name: "CricGear Pro", role: "sponsor" } },
  { email: "coach@cricverse360.com", password: "coach123", user: { email: "coach@cricverse360.com", name: "Coach Kapil", role: "coach" } },
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => "Not initialized",
  logout: () => {},
  register: async () => ({ error: "Not initialized" }),
  verifyEmail: async () => "Not initialized",
  forgotPassword: async () => "Not initialized",
  resetPassword: async () => "Not initialized",
  isLoading: true,
  getUsers: () => [],
  blockUser: () => {},
  unblockUser: () => {},
  isUserBlocked: () => false,
  removeUser: () => {},
  requestReinstatement: () => null,
  getReinstatementRequests: () => [],
  approveReinstatement: () => {},
  denyReinstatement: () => {},
  hasPendingRequest: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = getItem<AuthUser | null>("auth_user", null);
    if (saved) {
      setUser(saved);
      setApiUser(saved.email, saved.name);
      const tokens = getItem<AuthTokens | null>("auth_tokens", null);
      if (tokens?.accessToken) {
        setAccessToken(tokens.accessToken);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    if (isBlocked(email)) return "Your account has been suspended. Contact admin.";

    const profiles = getItem<{ basic: { email: string; password: string; fullName: string } }[]>("profiles", []);
    const registered = profiles.find(
      (p) => p.basic.email.toLowerCase() === email.toLowerCase() && p.basic.password === password
    );
    if (registered) {
      const u: AuthUser = {
        email: registered.basic.email,
        name: registered.basic.fullName,
        role: "player",
        playerId: `reg_${Date.now()}`,
        authMode: "demo",
      };
      setUser(u);
      setItem("auth_user", u);
      setApiUser(u.email, u.name);
      saveLoginRecord(u);
      return null;
    }

    const seed = SEED_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (seed) {
      if (seed.user.academyId === "academy_risingstar") seedRisingStarAcademy();
      setUser(seed.user);
      setItem("auth_user", seed.user);
      setApiUser(seed.user.email, seed.user.name);
      saveLoginRecord(seed.user);
      return null;
    }

    try {
      const res = await apiRequest<{
        accessToken?: string;
        refreshToken?: string;
        idToken?: string;
        expiresIn?: number;
        error?: string;
      }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (res.offline) {
        return "Backend is offline. Use a demo account or try again later.";
      }

      if (!res.ok) {
        return res.data?.error || "Invalid email or password";
      }

      const tokens: AuthTokens = {
        accessToken: res.data.accessToken || "",
        refreshToken: res.data.refreshToken || "",
        idToken: res.data.idToken || "",
        expiresAt: Date.now() + (res.data.expiresIn || 3600) * 1000,
      };
      setItem("auth_tokens", tokens);
      setAccessToken(tokens.accessToken);

      const meRes = await apiRequest<{
        email?: string;
        full_name?: string;
        role?: string;
        id?: string;
        avatar_url?: string;
        academy?: string;
      }>("/auth/me", { token: tokens.accessToken });

      const u: AuthUser = {
        email: meRes.ok && meRes.data?.email ? meRes.data.email : email,
        name: meRes.ok && meRes.data?.full_name ? meRes.data.full_name : email.split("@")[0],
        role: (meRes.ok && meRes.data?.role ? meRes.data.role : "player") as AuthUser["role"],
        playerId: meRes.ok && meRes.data?.id ? meRes.data.id : undefined,
        avatar: meRes.ok && meRes.data?.avatar_url ? meRes.data.avatar_url : undefined,
        academyId: meRes.ok && meRes.data?.academy ? meRes.data.academy : undefined,
        authMode: "cognito",
      };
      setUser(u);
      setItem("auth_user", u);
      setApiUser(u.email, u.name);
      saveLoginRecord(u);
      return null;
    } catch {
      return "Invalid email or password";
    }
  };

  const register = async (data: { email: string; password: string; fullName: string; role?: string }): Promise<{ error?: string; needsVerification?: boolean }> => {
    try {
      const res = await apiRequest<{ message?: string; userId?: string; error?: string }>("/auth/register", {
        method: "POST",
        body: { email: data.email, password: data.password, fullName: data.fullName, role: data.role || "player" },
      });
      if (res.offline) return { error: "Backend is offline. Registration requires an active connection." };
      if (!res.ok) return { error: res.data?.error || "Registration failed" };
      return { needsVerification: true };
    } catch {
      return { error: "Registration failed. Please try again." };
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<string | null> => {
    try {
      const res = await apiRequest<{ message?: string; error?: string }>("/auth/verify", {
        method: "POST",
        body: { email, code },
      });
      if (res.offline) return "Backend is offline. Try again later.";
      if (!res.ok) return res.data?.error || "Verification failed";
      return null;
    } catch {
      return "Verification failed. Please try again.";
    }
  };

  const forgotPassword = async (email: string): Promise<string | null> => {
    try {
      const res = await apiRequest<{ message?: string; error?: string }>("/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
      if (res.offline) return "Backend is offline. Try again later.";
      if (!res.ok) return res.data?.error || "Failed to send reset code";
      return null;
    } catch {
      return "Failed to send reset code. Please try again.";
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string): Promise<string | null> => {
    try {
      const res = await apiRequest<{ message?: string; error?: string }>("/auth/reset-password", {
        method: "POST",
        body: { email, code, newPassword },
      });
      if (res.offline) return "Backend is offline. Try again later.";
      if (!res.ok) return res.data?.error || "Password reset failed";
      return null;
    } catch {
      return "Password reset failed. Please try again.";
    }
  };

  const logout = () => {
    setUser(null);
    removeItem("auth_user");
    removeItem("auth_tokens");
    clearApiUser();
  };

  const getUsers = (): LoginRecord[] => getLoginLog();

  const blockUser = (email: string) => {
    const blocked = getBlockedUsers();
    if (!blocked.some((e) => e.toLowerCase() === email.toLowerCase())) {
      blocked.push(email.toLowerCase());
      setItem("blocked_users", blocked);
    }
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      logout();
    }
  };

  const unblockUser = (email: string) => {
    const blocked = getBlockedUsers().filter((e) => e.toLowerCase() !== email.toLowerCase());
    setItem("blocked_users", blocked);
  };

  const isUserBlocked = (email: string): boolean => isBlocked(email);

  const removeUser = (email: string) => {
    const log = getLoginLog().filter((r) => r.email.toLowerCase() !== email.toLowerCase());
    setItem("login_log", log);
    blockUser(email);
  };

  const requestReinstatement = (email: string, reason: string): string | null => {
    const requests = getReinstatementRequests();
    const existing = requests.find((r) => r.email.toLowerCase() === email.toLowerCase() && r.status === "pending");
    if (existing) return "You already have a pending reinstatement request.";
    const log = getLoginLog();
    const record = log.find((r) => r.email.toLowerCase() === email.toLowerCase());
    const name = record ? record.name : email;
    requests.push({ email: email.toLowerCase(), name, reason, requestedAt: new Date().toISOString(), status: "pending" });
    setItem("reinstatement_requests", requests);
    return null;
  };

  const approveReinstatement = (email: string) => {
    const requests = getReinstatementRequests().map((r) =>
      r.email.toLowerCase() === email.toLowerCase() && r.status === "pending" ? { ...r, status: "approved" as const } : r
    );
    setItem("reinstatement_requests", requests);
    unblockUser(email);
  };

  const denyReinstatement = (email: string) => {
    const requests = getReinstatementRequests().map((r) =>
      r.email.toLowerCase() === email.toLowerCase() && r.status === "pending" ? { ...r, status: "denied" as const } : r
    );
    setItem("reinstatement_requests", requests);
  };

  const hasPendingRequest = (email: string): boolean => {
    return getReinstatementRequests().some((r) => r.email.toLowerCase() === email.toLowerCase() && r.status === "pending");
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, register, verifyEmail, forgotPassword, resetPassword, isLoading,
      getUsers, blockUser, unblockUser, isUserBlocked, removeUser,
      requestReinstatement, getReinstatementRequests: () => getReinstatementRequests(), approveReinstatement, denyReinstatement, hasPendingRequest,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
