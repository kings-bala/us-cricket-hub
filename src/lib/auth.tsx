"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiPost, apiGet, setTokenUpdateCallback } from "./api";
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

// Legacy keys to clean up during migration
const LEGACY_TOKENS_KEY = "cricverse360_tokens";
const LEGACY_USER_KEY = "cricverse360_user";

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
  // tokens in memory only — refresh token is "" (stored in HttpOnly cookie, never exposed to JS)
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    setTokens(null);
    clearApiUser();
    // Clean up any legacy localStorage entries
    if (typeof window !== "undefined") {
      localStorage.removeItem(LEGACY_TOKENS_KEY);
      localStorage.removeItem(LEGACY_USER_KEY);
      localStorage.removeItem("cricverse360_user_email");
      localStorage.removeItem("cricverse360_user_name");
      localStorage.removeItem("cricverse360_google_access_token");
    }
  }, []);

  const setInMemoryTokens = useCallback((accessToken: string, idToken: string) => {
    // Store tokens in React state (memory) only — never localStorage
    // refreshToken is always "" because it lives in an HttpOnly cookie
    const t: AuthTokens = { accessToken, refreshToken: "", idToken };
    setTokens(t);
    setAccessToken(accessToken);
    // Set non-HttpOnly __auth presence cookie for Next.js middleware gating
    if (typeof document !== "undefined") {
      document.cookie = "__auth=1; path=/; max-age=604800; SameSite=Lax";
    }
  }, []);

  // Register the token refresh callback so api.ts can update memory tokens on 401 retry
  useEffect(() => {
    setTokenUpdateCallback((newAccessToken: string) => {
      setInMemoryTokens(newAccessToken, tokens?.idToken || "");
    });
  }, [setInMemoryTokens, tokens?.idToken]);

  const fetchUser = useCallback(async (accessToken: string, idToken?: string) => {
    setInMemoryTokens(accessToken, idToken || "");
    try {
      const userData = await apiGet<User>("/auth/me", accessToken);
      setUser(userData);
      setApiUser(userData.email, userData.full_name);
    } catch {
      // API call failed — try to use ID token data (e.g., Google OAuth users)
      if (idToken) {
        const idUser = parseIdToken(idToken);
        if (idUser && idUser.email) {
          const fallbackUser: User = {
            id: idUser.id || "google-user",
            email: idUser.email,
            full_name: idUser.full_name || idUser.email,
            role: idUser.role || "player",
          };
          setUser(fallbackUser);
          setApiUser(fallbackUser.email, fallbackUser.full_name);
          return;
        }
      }
      clearAuth();
    }
  }, [clearAuth, setInMemoryTokens]);

  // Initialize auth state from HttpOnly cookie session
  useEffect(() => {
    async function initAuth() {
      // Step 1: Migrate legacy localStorage tokens to HttpOnly cookies
      if (typeof window !== "undefined") {
        const legacyTokens = localStorage.getItem(LEGACY_TOKENS_KEY);
        if (legacyTokens) {
          try {
            const parsed = JSON.parse(legacyTokens);
            if (parsed.refreshToken) {
              await fetch("/api/auth/migrate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: parsed.refreshToken }),
              });
            }
            // Clear legacy storage regardless of migration success
            localStorage.removeItem(LEGACY_TOKENS_KEY);
            localStorage.removeItem(LEGACY_USER_KEY);
          } catch {
            localStorage.removeItem(LEGACY_TOKENS_KEY);
            localStorage.removeItem(LEGACY_USER_KEY);
          }
        }
      }

      // Step 2: Try to restore session from HttpOnly cookie
      try {
        const res = await fetch("/api/auth/session", { credentials: "same-origin" });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.accessToken) {
            await fetchUser(data.accessToken, data.idToken);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Session endpoint failed — user is not authenticated
      }

      // Not authenticated — clear cookie
      if (typeof document !== "undefined") {
        document.cookie = "__auth=; path=/; max-age=0";
      }
      setLoading(false);
    }
    initAuth();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    // Call our secure proxy endpoint which sets HttpOnly cookie
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "same-origin",
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Login failed (${res.status})`);
    }
    // Access token is in response body (stored in memory only, not localStorage)
    await fetchUser(data.accessToken, data.idToken);
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

  const logout = async () => {
    clearAuth();
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } catch {
      // Best effort — cookie will expire anyway
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
