import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication. The __auth cookie (set by the
// client-side auth lib) is used as a lightweight presence check.
const PROTECTED_ROUTES = ["/admin", "/dashboard", "/profile"];

// API routes under /api/admin return 401 instead of redirect.
const PROTECTED_API_ROUTES = ["/api/admin"];

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("base64");
}

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://accounts.google.com https://apis.google.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob:",
    "connect-src 'self' https://*.execute-api.us-east-1.amazonaws.com https://*.amazoncognito.com https://cognito-idp.us-east-1.amazonaws.com https://generativelanguage.googleapis.com https://accounts.google.com https://storage.googleapis.com https://cdn.jsdelivr.net https://api.stripe.com",
    "frame-src https://accounts.google.com https://js.stripe.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
    "worker-src 'self' blob: https://cdn.jsdelivr.net",
    "report-uri https://zig9f1eaqf.execute-api.us-east-1.amazonaws.com/v1/csp-report",
    "report-to csp-endpoint",
  ].join("; ");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuth = request.cookies.get("__auth")?.value === "1";

  // Check protected API routes first
  for (const prefix of PROTECTED_API_ROUTES) {
    if (pathname.startsWith(prefix)) {
      if (!hasAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
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
    }
  }

  // Generate nonce and set CSP + security headers on all responses
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // CSP enforcement: flip via env var after 7 days of clean Report-Only logs.
  // Set NEXT_PUBLIC_CSP_ENFORCE=true to activate. Rollback: unset the env var.
  const enforceCSP = process.env.NEXT_PUBLIC_CSP_ENFORCE === "true";
  const cspHeader = enforceCSP ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";
  response.headers.set(cspHeader, csp);

  // Always keep report-only in parallel during enforcement rollout
  if (enforceCSP) {
    response.headers.set("Content-Security-Policy-Report-Only", csp);
  }

  // Report-To header for CSP reporting API
  response.headers.set(
    "Report-To",
    JSON.stringify({
      group: "csp-endpoint",
      max_age: 31536000,
      endpoints: [{ url: "https://zig9f1eaqf.execute-api.us-east-1.amazonaws.com/v1/csp-report" }],
    })
  );

  // Other security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(), geolocation=(), payment=(self)"
  );

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
