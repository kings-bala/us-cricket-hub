"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiPost, apiGet } from "./api";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  subscription_status?: string;
  analysis_credits?: number;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: string) => Promise<{ message: string }>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKENS_KEY = "cricverse360_tokens";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  const saveTokens = (t: AuthTokens) => {
    setTokens(t);
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKENS_KEY, JSON.stringify(t));
    }
  };

  const clearAuth = () => {
    setUser(null);
    setTokens(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKENS_KEY);
    }
  };

  const fetchUser = useCallback(async (accessToken: string) => {
    try {
      const userData = await apiGet<User>("/auth/me", accessToken);
      setUser(userData);
    } catch {
      clearAuth();
    }
  }, []);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(TOKENS_KEY) : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthTokens;
        setTokens(parsed);
        fetchUser(parsed.accessToken).finally(() => setLoading(false));
      } catch {
        clearAuth();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const result = await apiPost<AuthTokens & { accessToken: string }>("/auth/login", { email, password });
    saveTokens(result);
    await fetchUser(result.accessToken);
  };

  const register = async (email: string, password: string, fullName: string, role = "player") => {
    const result = await apiPost<{ message: string }>("/auth/register", { email, password, fullName, role });
    return result;
  };

  const verifyEmail = async (email: string, code: string) => {
    await apiPost("/auth/verify", { email, code });
  };

  const forgotPassword = async (email: string) => {
    await apiPost("/auth/forgot-password", { email });
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    await apiPost("/auth/reset-password", { email, code, newPassword });
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, tokens, loading, login, register, verifyEmail, forgotPassword, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
