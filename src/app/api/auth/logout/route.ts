import { NextResponse } from "next/server";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 0,
};

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("__refresh_token", "", COOKIE_OPTIONS);
  response.cookies.set("__auth", "", { ...COOKIE_OPTIONS, httpOnly: false });
  return response;
}
