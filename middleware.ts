/**
 * Edge Middleware — Authentication, Tenant Injection, Role-Based Route Guards
 *
 * G2: RBAC IS SERVER-SIDE ONLY
 * - Every request to protected routes is verified at the edge
 * - Tenant ID is injected into headers ( NEVER trust client-sent headers )
 * - Role-based route access enforced before reaching any page or API
 */

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "hv_session";
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

/* ── Route Configuration ── */

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/catalog",
  "/eta-demo",
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
  "/api/health",
];

const PUBLIC_PREFIXES = [
  "/_next",
  "/static",
  "/favicon",
  "/logo",
  "/uploads",
  "/api/webhooks",
];

const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ["/admin"],
  HOTEL: ["/hotel"],
  SUPPLIER: ["/supplier"],
  FACTORING: ["/factoring"],
  SHIPPING: ["/shipping"],
};

const ROLE_DEFAULT_PATH: Record<string, string> = {
  ADMIN: "/admin",
  HOTEL: "/hotel",
  SUPPLIER: "/supplier",
  FACTORING: "/factoring",
  SHIPPING: "/shipping",
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
    path.startsWith("/admin")
  );
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths without auth
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Read session cookie
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // No token on protected route → redirect to login
  if (!token && isProtectedPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // No token on non-protected route → allow through
  if (!token) {
    return NextResponse.next();
  }

  // Verify token
  const session = await verifySession(token);

  // Invalid/expired token on protected route → clear cookie, redirect to login
  if (!session && isProtectedPath(pathname)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  // Invalid token on non-protected route → allow through (will fail at API layer if needed)
  if (!session) {
    return NextResponse.next();
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
    const target = ROLE_DEFAULT_PATH[platformRole] || "/hotel";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Role-based route guards
  if (isProtectedPath(pathname)) {
    // ADMIN can access everything
    if (platformRole === "ADMIN") {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // Check if user has access to this route
    const allowedRoutes = ROLE_ROUTES[platformRole] || [];
    const hasAccess = allowedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!hasAccess) {
      // Redirect to their default dashboard
      const target = ROLE_DEFAULT_PATH[platformRole] || "/hotel";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
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
