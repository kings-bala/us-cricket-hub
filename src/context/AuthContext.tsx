"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AuthUser = {
  email: string;
  name: string;
  role: "player" | "admin";
  playerId?: string;
  avatar?: string;
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

const LOGIN_LOG_KEY = "cricverse_login_log";
const BLOCKED_KEY = "cricverse_blocked_users";
const REINSTATE_KEY = "cricverse_reinstatement_requests";

function getLoginLog(): LoginRecord[] {
  try {
    return JSON.parse(localStorage.getItem(LOGIN_LOG_KEY) || "[]");
  } catch { return []; }
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
  localStorage.setItem(LOGIN_LOG_KEY, JSON.stringify(log));
}

function getBlockedUsers(): string[] {
  try {
    return JSON.parse(localStorage.getItem(BLOCKED_KEY) || "[]");
  } catch { return []; }
}

function isBlocked(email: string): boolean {
  return getBlockedUsers().some((e) => e.toLowerCase() === email.toLowerCase());
}

function getReinstatementRequests(): ReinstatementRequest[] {
  try {
    return JSON.parse(localStorage.getItem(REINSTATE_KEY) || "[]");
  } catch { return []; }
}

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
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

const AUTH_KEY = "cricverse_auth_user";

const accounts: { email: string; password: string; user: AuthUser }[] = [
  { email: "arjun@cricverse.com", password: "player123", user: { email: "arjun@cricverse.com", name: "Arjun Patel", role: "player", playerId: "p1", avatar: "/avatars/player1.jpg" } },
  { email: "jake@cricverse.com", password: "player123", user: { email: "jake@cricverse.com", name: "Jake Thompson", role: "player", playerId: "p2", avatar: "/avatars/player2.jpg" } },
  { email: "rashid@cricverse.com", password: "player123", user: { email: "rashid@cricverse.com", name: "Rashid Mohammed", role: "player", playerId: "p3", avatar: "/avatars/player3.jpg" } },
  { email: "rahul@cricverse.com", password: "player123", user: { email: "rahul@cricverse.com", name: "Rahul Desai", role: "player", playerId: "p8", avatar: "/avatars/player8.jpg" } },
  { email: "vikram.singh.cricket@gmail.com", password: "Cricket2026!", user: { email: "vikram.singh.cricket@gmail.com", name: "Vikram Singh", role: "player", playerId: "p9" } },
  { email: "admin@cricverse.com", password: "admin123", user: { email: "admin@cricverse.com", name: "Master Admin", role: "admin" } },
];

const AuthContext = createContext<AuthContextType>({
  user: null, login: () => "Not initialized", logout: () => {}, isLoading: true,
  getUsers: () => [], blockUser: () => {}, unblockUser: () => {}, isUserBlocked: () => false, removeUser: () => {},
  requestReinstatement: () => null, getReinstatementRequests: () => [], approveReinstatement: () => {}, denyReinstatement: () => {}, hasPendingRequest: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): string | null => {
    if (isBlocked(email)) return "Your account has been suspended. Contact admin.";
    const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (account) {
      setUser(account.user);
      localStorage.setItem(AUTH_KEY, JSON.stringify(account.user));
      saveLoginRecord(account.user);
      return null;
    }
    try {
      const profiles = JSON.parse(localStorage.getItem("cricverse_profiles") || "[]");
      const registered = profiles.find(
        (p: { basic: { email: string; password: string } }) =>
          p.basic.email.toLowerCase() === email.toLowerCase() && p.basic.password === password
      );
      if (registered) {
        const u: AuthUser = {
          email: registered.basic.email,
          name: registered.basic.fullName,
          role: "player",
          playerId: `reg_${Date.now()}`,
        };
        setUser(u);
        localStorage.setItem(AUTH_KEY, JSON.stringify(u));
        saveLoginRecord(u);
        return null;
      }
    } catch {}
    return "Invalid email or password";
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const getUsers = (): LoginRecord[] => getLoginLog();

  const blockUser = (email: string) => {
    const blocked = getBlockedUsers();
    if (!blocked.some((e) => e.toLowerCase() === email.toLowerCase())) {
      blocked.push(email.toLowerCase());
      localStorage.setItem(BLOCKED_KEY, JSON.stringify(blocked));
    }
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      logout();
    }
  };

  const unblockUser = (email: string) => {
    const blocked = getBlockedUsers().filter((e) => e.toLowerCase() !== email.toLowerCase());
    localStorage.setItem(BLOCKED_KEY, JSON.stringify(blocked));
  };

  const isUserBlocked = (email: string): boolean => isBlocked(email);

  const removeUser = (email: string) => {
    const log = getLoginLog().filter((r) => r.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem(LOGIN_LOG_KEY, JSON.stringify(log));
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
    localStorage.setItem(REINSTATE_KEY, JSON.stringify(requests));
    return null;
  };

  const approveReinstatement = (email: string) => {
    const requests = getReinstatementRequests().map((r) =>
      r.email.toLowerCase() === email.toLowerCase() && r.status === "pending" ? { ...r, status: "approved" as const } : r
    );
    localStorage.setItem(REINSTATE_KEY, JSON.stringify(requests));
    unblockUser(email);
  };

  const denyReinstatement = (email: string) => {
    const requests = getReinstatementRequests().map((r) =>
      r.email.toLowerCase() === email.toLowerCase() && r.status === "pending" ? { ...r, status: "denied" as const } : r
    );
    localStorage.setItem(REINSTATE_KEY, JSON.stringify(requests));
  };

  const hasPendingRequest = (email: string): boolean => {
    return getReinstatementRequests().some((r) => r.email.toLowerCase() === email.toLowerCase() && r.status === "pending");
  };

  return <AuthContext.Provider value={{ user, login, logout, isLoading, getUsers, blockUser, unblockUser, isUserBlocked, removeUser, requestReinstatement, getReinstatementRequests: () => getReinstatementRequests(), approveReinstatement, denyReinstatement, hasPendingRequest }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
