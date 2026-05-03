import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://zig9f1eaqf.execute-api.us-east-1.amazonaws.com/v1";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("__refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Use refresh token to get a fresh access token from Cognito via our backend
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    // Refresh token expired or invalid — clear cookie
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.set("__refresh_token", "", { ...COOKIE_OPTIONS, maxAge: 0 });
    response.cookies.set("__auth", "", { ...COOKIE_OPTIONS, httpOnly: false, maxAge: 0 });
    return response;
  }

  const data = await res.json();

  // Return fresh access token in response body (stays in memory only)
  const response = NextResponse.json({
    accessToken: data.accessToken,
    idToken: data.idToken || "",
    authenticated: true,
  });

  // Rotate refresh token if the backend issued a new one
  if (data.refreshToken) {
    response.cookies.set("__refresh_token", data.refreshToken, COOKIE_OPTIONS);
  }

  return response;
}
