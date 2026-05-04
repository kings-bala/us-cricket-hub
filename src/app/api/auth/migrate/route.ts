import { NextResponse } from "next/server";
import { headers } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://zig9f1eaqf.execute-api.us-east-1.amazonaws.com/v1";

// Deprecation date: 30 days after deploy. After this date, endpoint returns 410 Gone.
// Update this date when deploying the token migration.
const MIGRATION_DEADLINE = new Date("2026-06-03T00:00:00Z"); // 30 days from ~May 3 deploy

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};

// Simple in-memory rate limiting (per-IP, resets on cold start)
const migrationAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_MIGRATIONS_PER_IP = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = migrationAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    migrationAttempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_MIGRATIONS_PER_IP;
}

/**
 * Migration endpoint: converts a localStorage refresh token to an HttpOnly cookie.
 *
 * Security hardening:
 * 1. Validates the token by attempting a refresh against Cognito (rejects invalid/expired tokens)
 * 2. Rate limited: 5 attempts per IP per 15 minutes
 * 3. Deprecated after MIGRATION_DEADLINE (returns 410 Gone)
 * 4. Logs each migration attempt for volume monitoring
 */
export async function POST(request: Request) {
  // Check deprecation deadline
  if (new Date() > MIGRATION_DEADLINE) {
    console.log("[auth/migrate] DEPRECATED — endpoint past deadline, returning 410");
    return NextResponse.json(
      { error: "Migration window has closed. Please log in again." },
      { status: 410 }
    );
  }

  // Rate limiting
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    console.warn(`[auth/migrate] Rate limited IP: ${ip}`);
    return NextResponse.json(
      { error: "Too many migration attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { refreshToken } = body;

  if (!refreshToken || typeof refreshToken !== "string" || refreshToken.length < 20) {
    return NextResponse.json({ error: "Invalid token format" }, { status: 400 });
  }

  // Validate the token by attempting a refresh against the backend.
  // This confirms the token is a real, unexpired Cognito refresh token
  // (not a fabricated string or stolen stale token).
  try {
    const validateRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!validateRes.ok) {
      console.warn(`[auth/migrate] Token validation failed for IP ${ip}: status ${validateRes.status}`);
      return NextResponse.json(
        { error: "Token is invalid or expired. Please log in again." },
        { status: 401 }
      );
    }

    // Token is valid — Cognito accepted it
    console.log(`[auth/migrate] Successful migration from IP ${ip}`);
  } catch (err) {
    console.error("[auth/migrate] Validation request failed:", err);
    return NextResponse.json(
      { error: "Unable to validate token. Please try again." },
      { status: 503 }
    );
  }

  // Set the validated refresh token as an HttpOnly cookie
  const response = NextResponse.json({ migrated: true });
  response.cookies.set("__refresh_token", refreshToken, COOKIE_OPTIONS);
  response.cookies.set("__auth", "1", { ...COOKIE_OPTIONS, httpOnly: false });

  return response;
}
