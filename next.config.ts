import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  output: "standalone",

  experimental: {
    turbopack: {
      root: __dirname,
    },
  },

  // Enable React DevTools and source-map-backed editing in Chrome DevTools
  // Allows "Save for Overrides" to persist changes from browser to local filesystem
  productionBrowserSourceMaps: false,
  compiler: {
    // Preserve component names in production for easier debugging
    reactRemoveProperties: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "**.gravatar.com" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/logo-icon.png",
        permanent: false,
      },
    ];
  },

  // Disable aggressive static page caching — we control cache at nginx level
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        ],
      },
      // CORS for hybrid Vercel + VPS setup — AI streaming endpoints
      {
        source: "/api/v1/ai/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : process.env.NEXT_PUBLIC_APP_URL || "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, x-session-token",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
})(nextConfig);
