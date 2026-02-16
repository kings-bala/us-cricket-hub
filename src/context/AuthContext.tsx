"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AuthUser = {
  email: string;
  name: string;
  role: "player" | "admin";
  playerId?: string;
  avatar?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  isLoading: boolean;
};

const AUTH_KEY = "cricverse_auth_user";

const accounts: { email: string; password: string; user: AuthUser }[] = [
  { email: "arjun@cricverse.com", password: "player123", user: { email: "arjun@cricverse.com", name: "Arjun Patel", role: "player", playerId: "p1", avatar: "/avatars/player1.jpg" } },
  { email: "jake@cricverse.com", password: "player123", user: { email: "jake@cricverse.com", name: "Jake Thompson", role: "player", playerId: "p2", avatar: "/avatars/player2.jpg" } },
  { email: "rashid@cricverse.com", password: "player123", user: { email: "rashid@cricverse.com", name: "Rashid Mohammed", role: "player", playerId: "p3", avatar: "/avatars/player3.jpg" } },
  { email: "rahul@cricverse.com", password: "player123", user: { email: "rahul@cricverse.com", name: "Rahul Desai", role: "player", playerId: "p8", avatar: "/avatars/player8.jpg" } },
  { email: "admin@cricverse.com", password: "admin123", user: { email: "admin@cricverse.com", name: "Master Admin", role: "admin" } },
];

const AuthContext = createContext<AuthContextType>({ user: null, login: () => "Not initialized", logout: () => {}, isLoading: true });

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
    const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (!account) return "Invalid email or password";
    setUser(account.user);
    localStorage.setItem(AUTH_KEY, JSON.stringify(account.user));
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
