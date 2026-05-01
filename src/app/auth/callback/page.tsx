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

    const authFlow = sessionStorage.getItem("cricverse360_auth_flow");

    if (authFlow === "google_direct") {
      handleDirectGoogleAuth(code);
    } else {
      handleCognitoAuth(code);
    }

    async function handleDirectGoogleAuth(authCode: string) {
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

        // Store Google access token separately for Gemini API usage
        if (data.google_access_token) {
          localStorage.setItem("cricverse360_google_access_token", data.google_access_token);
        }

        // Store user info and create a synthetic auth token set
        const userInfo = data.user;
        if (userInfo) {
          localStorage.setItem("cricverse360_user", JSON.stringify({
            id: userInfo.id,
            email: userInfo.email,
            full_name: userInfo.full_name,
            role: "player",
            auth_provider: "google",
          }));
          localStorage.setItem("cricverse360_user_email", userInfo.email);
          localStorage.setItem("cricverse360_user_name", userInfo.full_name);

          // Store tokens (use google_access_token as the access token for API calls)
          localStorage.setItem("cricverse360_tokens", JSON.stringify({
            accessToken: data.google_access_token || "",
            refreshToken: "",
            idToken: "",
          }));
        }

        trackEvent("signup_completed", { method: "google_direct" });
        setStatus("Sign-in successful! Redirecting...");
        sessionStorage.removeItem("cricverse360_auth_flow");
        const redirectTo = sessionStorage.getItem("cricverse360_auth_redirect") || "/analyze";
        sessionStorage.removeItem("cricverse360_auth_redirect");
        window.location.href = redirectTo;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(`Sign-in failed: ${message}`);
        sessionStorage.removeItem("cricverse360_auth_flow");
        setTimeout(() => router.push("/auth"), 5000);
      }
    }

    async function handleCognitoAuth(authCode: string) {
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
          localStorage.setItem(
            "cricverse360_tokens",
            JSON.stringify({
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token || "",
              idToken: tokens.id_token || "",
            })
          );

          if (tokens.id_token) {
            try {
              const payload = JSON.parse(atob(tokens.id_token.split(".")[1]));
              if (payload.email) {
                localStorage.setItem("cricverse360_user_email", payload.email);
              }
              if (payload.name) {
                localStorage.setItem("cricverse360_user_name", payload.name);
              }
            } catch {
              // ID token parsing is optional
            }
          }

          trackEvent("signup_completed", { method: "google" });
          setStatus("Sign-in successful! Redirecting...");
          const redirectTo = sessionStorage.getItem("cricverse360_auth_redirect") || "/analyze";
          sessionStorage.removeItem("cricverse360_auth_redirect");
          window.location.href = redirectTo;
        } else {
          throw new Error("No access token in response");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(`Sign-in failed: ${message}`);
        localStorage.setItem("cricverse360_oauth_error", message);
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
