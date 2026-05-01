"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiPost, apiGet } from "./api";
import { setAccessToken, setApiUser, clearApiUser } from "./api-client";

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
const USER_KEY = "cricverse360_user";

function parseIdToken(idToken: string): Partial<User> | null {
  try {
    const payload = JSON.parse(atob(idToken.split(".")[1]));
    return {
      id: payload.sub || "",
      email: payload.email || "",
      full_name: payload.name || payload.email || "",
      role: "player",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  const saveTokens = (t: AuthTokens) => {
    setTokens(t);
    setAccessToken(t.accessToken);
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKENS_KEY, JSON.stringify(t));
    }
  };

  const clearAuth = () => {
    setUser(null);
    setTokens(null);
    clearApiUser();
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKENS_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  const fetchUser = useCallback(async (t: AuthTokens) => {
    try {
      const userData = await apiGet<User>("/auth/me", t.accessToken);
      setUser(userData);
      setApiUser(userData.email, userData.full_name);
      setAccessToken(t.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }
    } catch {
      // API call failed — try to use ID token data (e.g., Google OAuth users)
      if (t.idToken) {
        const idUser = parseIdToken(t.idToken);
        if (idUser && idUser.email) {
          const fallbackUser: User = {
            id: idUser.id || "google-user",
            email: idUser.email,
            full_name: idUser.full_name || idUser.email,
            role: idUser.role || "player",
          };
          setUser(fallbackUser);
          setApiUser(fallbackUser.email, fallbackUser.full_name);
          setAccessToken(t.accessToken);
          if (typeof window !== "undefined") {
            localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
          }
          return;
        }
      }
      // Also check localStorage for previously cached user
      if (typeof window !== "undefined") {
        const cachedUser = localStorage.getItem(USER_KEY);
        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser) as User;
            setUser(parsed);
            setApiUser(parsed.email, parsed.full_name);
            setAccessToken(t.accessToken);
            return;
          } catch {
            // ignore parse error
          }
        }
      }
      clearAuth();
    }
  }, []);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(TOKENS_KEY) : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthTokens;
        setTokens(parsed);
        fetchUser(parsed).finally(() => setLoading(false));
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
    await fetchUser(result);
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
    if (typeof window !== "undefined") {
      localStorage.removeItem("cricverse360_user_email");
      localStorage.removeItem("cricverse360_user_name");
      localStorage.removeItem("cricverse360_google_access_token");
    }
    router.push("/");
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
