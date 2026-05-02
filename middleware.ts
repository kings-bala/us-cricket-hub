import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication. The __auth cookie (set by the
// client-side auth lib) is used as a lightweight presence check.
const PROTECTED_ROUTES = ["/admin", "/dashboard", "/profile"];

// API routes under /api/admin return 401 instead of redirect.
const PROTECTED_API_ROUTES = ["/api/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuth = request.cookies.get("__auth")?.value === "1";

  // Check protected API routes first
  for (const prefix of PROTECTED_API_ROUTES) {
    if (pathname.startsWith(prefix)) {
      if (!hasAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.next();
    }
  }

  // Check protected page routes
  for (const prefix of PROTECTED_ROUTES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      if (!hasAuth) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url, 307);
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/profile/:path*", "/api/admin/:path*"],
};
