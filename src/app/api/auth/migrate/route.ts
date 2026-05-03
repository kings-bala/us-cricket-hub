import { NextResponse } from "next/server";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};

// Migrate existing localStorage tokens to HttpOnly cookies.
// Called once on first page load if old tokens are found in localStorage.
export async function POST(request: Request) {
  const body = await request.json();
  const { refreshToken } = body;

  if (!refreshToken) {
    return NextResponse.json({ error: "refreshToken required" }, { status: 400 });
  }

  const response = NextResponse.json({ migrated: true });
  response.cookies.set("__refresh_token", refreshToken, COOKIE_OPTIONS);
  response.cookies.set("__auth", "1", { ...COOKIE_OPTIONS, httpOnly: false });

  return response;
}
