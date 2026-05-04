import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://zig9f1eaqf.execute-api.us-east-1.amazonaws.com/v1";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
};

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // Set refresh token as HttpOnly cookie; return access + id token in body
  const response = NextResponse.json({
    accessToken: data.accessToken,
    idToken: data.idToken,
  });

  response.cookies.set("__refresh_token", data.refreshToken, COOKIE_OPTIONS);
  response.cookies.set("__auth", "1", { ...COOKIE_OPTIONS, httpOnly: false });

  return response;
}
