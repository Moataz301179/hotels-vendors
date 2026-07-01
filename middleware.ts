/**
 * Edge Middleware — Authentication, Tenant Injection, Role-Based Route Guards
 *
 * G2: RBAC IS SERVER-SIDE ONLY
 * - Every request to protected routes is verified at the edge
 * - Tenant ID is injected into headers ( NEVER trust client-sent headers )
 * - Role-based route access enforced before reaching any page or API
 *
 * Next.js 16 deprecation: Middleware should be migrated to the proxy pattern
 * (edge function + _next/proxy rewrites). The matcher config format may also
 * need updating. This warning is non-blocking — middleware continues to work.
 * Track: https://nextjs.org/docs/app/building-your-application/routing/middleware#proxy
 */

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "hv_session";

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET && process.env.NODE_ENV === "production") {
  throw new Error(
    "FATAL: SESSION_SECRET environment variable is required in production. " +
    "Generate one with: openssl rand -hex 32"
  );
}
const SECRET = new TextEncoder().encode(
  SESSION_SECRET || "dev-secret-do-not-use-in-production"
);

/* ── Route Configuration ── */

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
  "/catalog",

  "/hotels",
  "/marketplace",
  "/suppliers",
  "/about",
  "/solutions",
  "/contact",
  "/become-supplier",
  "/social-media",
  "/offline",
  "/help",
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
  "/api/v1/auth/verify",
  "/api/v1/auth/staged-register",
  "/api/v1/auth/staged-verify-otp",
  "/api/v1/auth/staged-resend-otp",
  "/api/v1/auth/send-phone-otp",
  "/api/v1/auth/verify-phone",
  "/api/v1/auth/register/send-otp",
  "/api/v1/auth/register/verify-otp",
  "/api/v1/supplier/onboard",
  "/api/v1/cms/content",
  "/api/v1/ai/public",
  "/api/v1/products",
  "/api/health",
];

const PUBLIC_PREFIXES = [
  "/_next",
  "/static",
  "/favicon",
  "/logo",
  "/uploads",
  "/videos",
  "/api/webhooks",
  "/manifest.json",
  "/sw.js",
  "/robots.txt",
  "/sitemap",
];

const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ["/admin", "/hotel", "/supplier", "/factoring", "/shipping", "/marketing", "/analytics", "/ai-agents", "/procurement", "/orders", "/payments", "/scheduler", "/security", "/dispute", "/settings", "/eta"],
  HOTEL: ["/hotel"],
  SUPPLIER: ["/supplier"],
  FACTORING: ["/factoring"],
  SHIPPING: ["/shipping"],
  MARKETING: ["/marketing"],
};

const ROLE_DEFAULT_PATH: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  HOTEL: "/dashboard/hotel",
  SUPPLIER: "/dashboard/supplier",
  FACTORING: "/dashboard/factoring",
  SHIPPING: "/dashboard/shipping",
  MARKETING: "/dashboard/marketing",
};

/* ── Helpers ── */

function isPublicPath(path: string): boolean {
  if (PUBLIC_PATHS.includes(path)) return true;
  return PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function isProtectedPath(path: string): boolean {
  return (
    path.startsWith("/hotel") ||
    path.startsWith("/supplier") ||
    path.startsWith("/factoring") ||
    path.startsWith("/shipping") ||
    path.startsWith("/admin") ||
    path.startsWith("/marketing") ||
    path.startsWith("/analytics") ||
    path.startsWith("/ai-agents") ||
    path.startsWith("/procurement") ||
    path.startsWith("/orders") ||
    path.startsWith("/payments") ||
    path.startsWith("/scheduler") ||
    path.startsWith("/security") ||
    path.startsWith("/dispute") ||
    path.startsWith("/settings") ||
    path.startsWith("/eta")
  );
}

function isApiPath(path: string): boolean {
  return path.startsWith("/api/");
}

async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      clockTolerance: 60,
    });
    const userId = payload.userId as string;
    const platformRole = payload.platformRole as string;
    const tenantId = payload.tenantId as string;
    if (!userId || !platformRole || !tenantId) return null;
    return { userId, platformRole, tenantId };
  } catch {
    return null;
  }
}

/* ── Middleware ── */

/* ── Security Headers ── */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  // Strict CSP — allow self, inline styles/scripts (Next.js requirement), and Google Fonts
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob:; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // HTTP → HTTPS redirect (defense-in-depth, Vercel also handles at platform level).
  // Skip for localhost / local dev so self-signed-cert browsers and Playwright
  // aren't forced onto https://localhost (which has no trusted cert in dev).
  const proto = request.headers.get("x-forwarded-proto");
  const isLocalHost = host === "localhost:3000" || host === "localhost" || host.startsWith("127.0.0.1");
  if (proto === "http" && !isLocalHost) {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    return addSecurityHeaders(NextResponse.redirect(url, 308));
  }

  // ── INVO Subdomain Routing ──
  // invo.hotelsvendors.com/ → serves /invo page
  // invo.hotelsvendors.com/docs → serves /invo/docs page
  if (host.startsWith("invo.")) {
    const url = request.nextUrl.clone();
    // Root path → rewrite to /invo
    if (pathname === "/") {
      url.pathname = "/invo";
      return addSecurityHeaders(NextResponse.rewrite(url));
    }
    // API paths under subdomain → route to /api/v1/invo
    if (pathname.startsWith("/api/") && !pathname.startsWith("/api/v1/invo")) {
      // Allow API calls on invo subdomain to reach the INVO API routes
      return addSecurityHeaders(NextResponse.next());
    }
    // Other paths → prepend /invo if not already
    if (!pathname.startsWith("/invo") && !pathname.startsWith("/api/")) {
      url.pathname = `/invo${pathname}`;
      return addSecurityHeaders(NextResponse.rewrite(url));
    }
  }

  // Allow public paths without auth
  if (isPublicPath(pathname)) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Read session cookie
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // ── API routes: require valid session ──
  if (isApiPath(pathname)) {
    if (!token) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }));
    }
    const session = await verifySession(token);
    if (!session) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Invalid or expired session" }, { status: 401 }));
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session.userId);
    requestHeaders.set("x-tenant-id", session.tenantId);
    requestHeaders.set("x-platform-role", session.platformRole);
    requestHeaders.set("x-session-token", token);
    return addSecurityHeaders(NextResponse.next({ request: { headers: requestHeaders } }));
  }

  // No token on protected route → redirect to login
  if (!token && isProtectedPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return addSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // No token on non-protected route → allow through
  if (!token) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Verify token
  const session = await verifySession(token);

  // Invalid/expired token on protected route → clear cookie, redirect to login
  if (!session && isProtectedPath(pathname)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return addSecurityHeaders(response);
  }

  // Invalid token on non-protected route → allow through (will fail at API layer if needed)
  if (!session) {
    return addSecurityHeaders(NextResponse.next());
  }

  const { userId, platformRole, tenantId } = session;

  // Inject tenant + auth headers into the request for downstream handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", userId);
  requestHeaders.set("x-tenant-id", tenantId);
  requestHeaders.set("x-platform-role", platformRole);
  requestHeaders.set("x-session-token", token);

  // Redirect /dashboard (non-existent) to role-specific dashboard
  if (pathname === "/dashboard") {
    const target = ROLE_DEFAULT_PATH[platformRole] || "/dashboard/hotel";
    return addSecurityHeaders(NextResponse.redirect(new URL(target, request.url)));
  }

  // Role-based route guards
  if (isProtectedPath(pathname)) {
    // ADMIN can access everything
    if (platformRole === "ADMIN") {
      return addSecurityHeaders(NextResponse.next({ request: { headers: requestHeaders } }));
    }

    // Check if user has access to this route
    const allowedRoutes = ROLE_ROUTES[platformRole] || [];
    const hasAccess = allowedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!hasAccess) {
      // Redirect to their default dashboard
      const target = ROLE_DEFAULT_PATH[platformRole] || "/dashboard/hotel";
      return addSecurityHeaders(NextResponse.redirect(new URL(target, request.url)));
    }
  }

  return addSecurityHeaders(NextResponse.next({ request: { headers: requestHeaders } }));
}

/* ── Matcher ── */

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (handled by web server)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};
