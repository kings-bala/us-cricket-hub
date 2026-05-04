"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://zig9f1eaqf.execute-api.us-east-1.amazonaws.com/v1";

function CallbackInner() {
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Signing you in...");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (errorParam) {
      const msg = errorDescription || "Google sign-in was cancelled or failed.";
      setError(msg);
      setTimeout(() => router.push("/auth"), 3000);
      return;
    }

    if (!code) {
      router.push("/auth");
      return;
    }

    // Determine auth flow: state param > sessionStorage > env-var default
    const stateParam = searchParams.get("state");
    let authFlow = sessionStorage.getItem("cricverse360_auth_flow");
    let stateRedirect: string | null = null;

    if (stateParam) {
      try {
        const parsed = JSON.parse(atob(stateParam));
        if (parsed.flow) authFlow = parsed.flow;
        if (parsed.redirect) stateRedirect = parsed.redirect;
      } catch {
        // Invalid state param — fall through to other sources
      }
    }

    // Default to google_direct when Google Client ID is configured,
    // since the app uses direct Google OAuth (not Cognito-brokered)
    if (!authFlow && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      authFlow = "google_direct";
    }

    if (authFlow === "google_direct") {
      handleDirectGoogleAuth(code, stateRedirect);
    } else {
      handleCognitoAuth(code, stateRedirect);
    }

    async function handleDirectGoogleAuth(authCode: string, overrideRedirect: string | null) {
      try {
        setStatus("Exchanging Google authorization code...");
        const redirectUri = `${window.location.origin}/auth/callback`;

        const res = await fetch(`${API_BASE}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: authCode, redirect_uri: redirectUri }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Token exchange failed (${res.status})`);
        }

        // Google access token is stored server-side in the users table by the
        // /auth/google backend handler. No need to keep in localStorage.
        // The backend reads it from DB during analysis (lines 2400-2433 of index.mjs).

        // Store session via HttpOnly cookie
        if (data.google_access_token) {
          await fetch("/api/auth/migrate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: data.google_access_token }),
          });
        }

        trackEvent("signup_completed", { method: "google_direct" });
        setStatus("Sign-in successful! Redirecting...");
        sessionStorage.removeItem("cricverse360_auth_flow");
        const redirectTo = overrideRedirect || sessionStorage.getItem("cricverse360_auth_redirect") || "/analyze";
        sessionStorage.removeItem("cricverse360_auth_redirect");
        window.location.href = redirectTo;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(`Sign-in failed: ${message}`);
        sessionStorage.removeItem("cricverse360_auth_flow");
        setTimeout(() => router.push("/auth"), 5000);
      }
    }

    async function handleCognitoAuth(authCode: string, overrideRedirect: string | null) {
      try {
        const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
        const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/callback`;

        if (!cognitoDomain || !clientId) {
          setError("Google Sign-In is not fully configured.");
          setTimeout(() => router.push("/auth"), 3000);
          return;
        }

        setStatus("Exchanging authorization code...");

        const tokenRes = await fetch(`${cognitoDomain}/oauth2/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: clientId,
            redirect_uri: redirectUri,
            code: authCode,
          }),
        });

        if (!tokenRes.ok) {
          const errorBody = await tokenRes.text();
          throw new Error(`Token exchange failed (${tokenRes.status}): ${errorBody}`);
        }

        const tokens = await tokenRes.json();

        if (tokens.access_token) {
          // Store refresh token via HttpOnly cookie
          await fetch("/api/auth/migrate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: tokens.refresh_token || tokens.access_token }),
          });

          trackEvent("signup_completed", { method: "google" });
          setStatus("Sign-in successful! Redirecting...");
          const redirectTo = overrideRedirect || sessionStorage.getItem("cricverse360_auth_redirect") || "/analyze";
          sessionStorage.removeItem("cricverse360_auth_redirect");
          window.location.href = redirectTo;
        } else {
          throw new Error("No access token in response");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(`Sign-in failed: ${message}`);
        // Log OAuth error (no sensitive data in localStorage)
        setTimeout(() => router.push("/auth"), 5000);
      }
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {error ? (
          <div>
            <p className="text-red-400 mb-2">{error}</p>
            <p className="text-slate-500 text-sm">Redirecting to sign-in page...</p>
          </div>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">{status}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
