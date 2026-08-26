import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

if (!process.env.SESSION_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "FATAL: SESSION_SECRET environment variable is required in production. " +
      "Generate one with: openssl rand -hex 32"
    );
  }
  console.warn("[next.config] WARNING: Using development fallback for SESSION_SECRET. Do NOT deploy without setting SESSION_SECRET.");
}

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "**.gravatar.com" },
    ],
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
      // Global CORS for all /api/v1/ routes
      {
        source: "/api/v1/:path*",
        headers: [
          {
            // SEC-06 fail-closed: empty string would allow ALL origins.
            // In production NEXT_PUBLIC_APP_URL must be set; middleware.ts bootstrap
            // throws if missing. Dev falls back to localhost only when NODE_ENV!=production.
            key: "Access-Control-Allow-Origin",
            value: getCorsOrigin(),
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Idempotency-Key",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
      // CORS for AI streaming endpoints — tighter origin (fail-closed)
      {
        source: "/api/v1/ai/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : process.env.NEXT_PUBLIC_APP_URL ?? "",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
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


/**
 * SEC-06: CORS origin must never resolve to "" (which browsers treat as a wildcard).
 * Fail-closed in production: middleware.ts throws at bootstrap if NEXT_PUBLIC_APP_URL is unset,
 * so this helper only needs to handle dev fallback + defensive localhost restriction.
 */
function getCorsOrigin(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (url) return url;
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  // Production without APP_URL: emit no ACAO header value at all rather than ""
  throw new Error(
    "FATAL: NEXT_PUBLIC_APP_URL is required for CORS in production builds. " +
    "Set it before running `next build`."
  );
}

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
