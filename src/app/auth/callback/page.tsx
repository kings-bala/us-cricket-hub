"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";

function CallbackInner() {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Google sign-in was cancelled or failed. Redirecting...");
      setTimeout(() => router.push("/auth"), 2000);
      return;
    }

    if (!code) {
      router.push("/auth");
      return;
    }

    const exchangeCode = async () => {
      try {
        const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
        const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/callback`;

        if (!cognitoDomain || !clientId) {
          setError("Google Sign-In is not fully configured.");
          setTimeout(() => router.push("/auth"), 2000);
          return;
        }

        const tokenRes = await fetch(`${cognitoDomain}/oauth2/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: clientId,
            redirect_uri: redirectUri,
            code,
          }),
        });

        if (!tokenRes.ok) {
          throw new Error("Token exchange failed");
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
          trackEvent("signup_completed", { method: "google" });
          window.location.href = "/analyze";
        } else {
          throw new Error("No access token received");
        }
      } catch {
        setError("Sign-in failed. Redirecting...");
        setTimeout(() => router.push("/auth"), 2000);
      }
    };

    exchangeCode();
  }, [searchParams, router, login]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Signing you in...</p>
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
