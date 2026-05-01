import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_COGNITO_DOMAIN: 'https://cricverse360.auth.us-east-1.amazoncognito.com',
    NEXT_PUBLIC_COGNITO_CLIENT_ID: '2uu2g8kefui5meeb410280elpf',
  },
};

export default nextConfig;
