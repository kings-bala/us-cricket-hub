import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_COGNITO_DOMAIN: 'https://cricverse360.auth.us-east-1.amazoncognito.com',
    NEXT_PUBLIC_COGNITO_CLIENT_ID: '2uu2g8kefui5meeb410280elpf',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: '885628792053-agt7quig3m6h4gb53o7oi24aauhqvol1.apps.googleusercontent.com',
  },
};

export default nextConfig;
