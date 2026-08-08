/**
 * Unified Authentication Middleware — Edge Runtime
 * HotelsVendors Platform
 *
 * Supports accounts created on either Web or INVO Mobile.
 * Single JWT identity works across both platforms.
 * No account pairing needed — one account, both platforms.
 *
 * JWT claims: { userId, platformRole, tenantId, registeredVia }
 */

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { csrfMiddleware } from "@/lib/security/csrf";

const SESSION_COOKIE = "hv_session";
const CSRF_COOKIE = "hv_csrf";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-do-not-use-in-production"
);

/* ── Public paths (no auth required) ── */
const PUBLIC_PATHS = [
  "/", "/login", "/register", "/pairing", "/forgot-password",
  "/verify-email", "/onboarding", "/catalog", "/sandbox",
  "/hotels", "/hotels/join", "/marketplace", "/suppliers", "/suppliers/join",
  "/about", "/pricing", "/solutions", "/contact", "/become-supplier",
  "/social-media", "/offline", "/help", "/flow",
  "/financing/oliv", "/oliv/referral", "/factoring-service",
  "/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/refresh",
  "/api/v1/auth/verify", "/api/v1/auth/send-otp", "/api/v1/auth/verify-otp",
  "/api/v1/auth/otp-login", "/api/v1/auth/pair", "/api/v1/auth/generate-pairing-code",
  "/api/v1/auth/forgot-password", "/api/v1/auth/reset-password",
  "/api/v1/supplier/onboard", "/api/v1/oliv/referral", "/api/v1/oliv/click",
  "/api/v1/oliv/webhook", "/api/v1/cms/content", "/api/v1/ai/public",
  "/api/v1/contact", "/api/v1/products", "/api/health",
  // NEW: unified register routes
  "/register/hotel", "/register/supplier", "/register/funder", "/register/carrier",
];

const PUBLIC_PREFIXES = ["/_next", "/static", "/favicon", "/logo", "/uploads", "/videos", "/api/webhooks", "/manifest.json", "/sw.js", "/robots.txt", "/sitemap"];

const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ["/admin", "/hotel", "/supplier", "/factoring", "/shipping", "/marketing"],
  HOTEL: ["/hotel"],
  SUPPLIER: ["/supplier"],
  FACTORING: ["/factoring"],
  SHIPPING: ["/shipping"],
  MARKETING: ["/marketing"],
};

const ROLE_DEFAULT_PATH: Record<string, string> = {
  ADMIN: "/admin/page", HOTEL: "/hotel/page", SUPPLIER: "/supplier/page",
  FACTORING: "/factoring/page", SHIPPING: "/shipping/page", MARKETING: "/marketing/page",
};

/* ── Helpers ── */
function isPublicPath(path: string): boolean {
  if (PUBLIC_PATHS.includes(path)) return true;
  return PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function isProtectedPath(path: string): boolean {
  return ["/hotel", "/supplier", "/factoring", "/shipping", "/admin", "/marketing", "/analytics", "/ai-agents", "/procurement", "/orders", "/payments", "/scheduler", "/security", "/dispute", "/settings", "/eta"].some((p) => path.startsWith(p));
}

function isApiPath(path: string): boolean {
  return path.startsWith("/api/");
}

async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    const userId = payload.userId as string;
    const platformRole = payload.platformRole as string;
    const tenantId = payload.tenantId as string;
    if (!userId || !platformRole || !tenantId) return null;
    return { userId, platformRole, tenantId, registeredVia: (payload.registeredVia as string) || "WEB" };
  } catch {
    return null;
  }
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  return response;
}

/* ── Main Middleware ── */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // INVO subdomain routing
  if (host.startsWith("invo.")) {
    const url = request.nextUrl.clone();
    if (pathname === "/") { url.pathname = "/invo"; return addSecurityHeaders(NextResponse.rewrite(url)); }
    if (!pathname.startsWith("/invo") && !pathname.startsWith("/api/")) {
      url.pathname = `/invo${pathname}`;
      return addSecurityHeaders(NextResponse.rewrite(url));
    }
  }

  if (isPublicPath(pathname)) return addSecurityHeaders(NextResponse.next());

  const bearerToken = request.headers.get("authorization")?.startsWith("Bearer ")
    ? request.headers.get("authorization")!.slice(7).trim()
    : undefined;
  const isApi = isApiPath(pathname);
  const token = isApi ? request.cookies.get(SESSION_COOKIE)?.value || bearerToken : request.cookies.get(SESSION_COOKIE)?.value;

  if (isApi) {
    if (!token) return addSecurityHeaders(NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }));
    const session = await verifySession(token);
    if (!session) return addSecurityHeaders(NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 }));

    const headers = new Headers(request.headers);
    headers.set("x-user-id", session.userId);
    headers.set("x-tenant-id", session.tenantId);
    headers.set("x-platform-role", session.platformRole);
    headers.set("x-registered-via", session.registeredVia);

    const isStateChanging = ["POST", "PUT", "DELETE", "PATCH"].includes(request.method);
    const isExempt = pathname === "/api/v1/auth/login" || pathname === "/api/v1/auth/register" || pathname.startsWith("/api/webhooks");
    if (isStateChanging && !isExempt && !bearerToken) {
      const csrfResult = await csrfMiddleware(request);
      if (csrfResult) return addSecurityHeaders(csrfResult);
    }
    return addSecurityHeaders(NextResponse.next({ request: { headers } }));
  }

  if (!token && isProtectedPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return addSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (!token) return addSecurityHeaders(NextResponse.next());

  const session = await verifySession(token);
  if (!session && isProtectedPath(pathname)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return addSecurityHeaders(response);
  }
  if (!session) return addSecurityHeaders(NextResponse.next());

  const headers = new Headers(request.headers);
  headers.set("x-user-id", session.userId);
  headers.set("x-tenant-id", session.tenantId);
  headers.set("x-platform-role", session.platformRole);
  headers.set("x-registered-via", session.registeredVia);

  if (pathname === "/dashboard") {
    return addSecurityHeaders(NextResponse.redirect(new URL(ROLE_DEFAULT_PATH[session.platformRole] || "/hotel", request.url)));
  }

  if (isProtectedPath(pathname) && session.platformRole !== "ADMIN") {
    const allowed = ROLE_ROUTES[session.platformRole] || [];
    if (!allowed.some((r) => pathname.startsWith(r))) {
      return addSecurityHeaders(NextResponse.redirect(new URL(ROLE_DEFAULT_PATH[session.platformRole] || "/hotel", request.url)));
    }
  }

  return addSecurityHeaders(NextResponse.next({ request: { headers } }));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)"],
};