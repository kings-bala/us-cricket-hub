import type { NextConfig } from "next";

// Content-Security-Policy in Report-Only mode for the first week.
// Flip to enforcing (remove -Report-Only suffix) after confirming no
// legitimate resources are blocked in production.
const cspDirectives = [
  "default-src 'self'",
  // Next.js requires 'unsafe-inline' for its runtime scripts and 'unsafe-eval'
  // for dev mode. In production only 'unsafe-inline' is needed (no nonce support
  // in pages router without custom server). Also allow Google Sign-In.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
  // Tailwind and inline styles require 'unsafe-inline'.
  "style-src 'self' 'unsafe-inline'",
  // Images from self, data URIs (base64 placeholders), blob (video thumbnails),
  // and any HTTPS source (user avatars, external images).
  "img-src 'self' data: blob: https:",
  // Video preview from blob URLs and self-hosted.
  "media-src 'self' blob:",
  // API endpoints, Cognito, Google APIs, Stripe, MediaPipe CDN.
  "connect-src 'self' https://*.execute-api.us-east-1.amazonaws.com https://*.amazoncognito.com https://cognito-idp.us-east-1.amazonaws.com https://generativelanguage.googleapis.com https://accounts.google.com https://storage.googleapis.com https://cdn.jsdelivr.net https://api.stripe.com",
  // Google Sign-In popup and Stripe checkout (if ever loaded as iframe).
  "frame-src https://accounts.google.com https://js.stripe.com",
  // Prevent this site from being framed (clickjacking protection).
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
  // MediaPipe WASM workers loaded from CDN.
  "worker-src 'self' blob: https://cdn.jsdelivr.net",
].join("; ");

const securityHeaders = [
  {
    // Report-Only mode: logs violations without blocking.
    // Change to "Content-Security-Policy" to enforce after validation.
    key: "Content-Security-Policy-Report-Only",
    value: cspDirectives,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    // camera needed for /analyze/live, payment for Stripe; deny everything else.
    value: "camera=(self), microphone=(), geolocation=(), payment=(self)",
  },
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_COGNITO_DOMAIN: 'https://cricverse360.auth.us-east-1.amazoncognito.com',
    NEXT_PUBLIC_COGNITO_CLIENT_ID: '2uu2g8kefui5meeb410280elpf',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: '885628792053-agt7quig3m6h4gb53o7oi24aauhqvol1.apps.googleusercontent.com',
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
