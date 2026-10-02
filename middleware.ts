/**
 * Edge Middleware — Clerk Auth + HotelsVendors Security Layer
 *
 * G2: RBAC IS SERVER-SIDE ONLY
 * - Clerk provides authentication (sessions, users, organizations)
 * - HotelsVendors adds: CSP, tenant injection, role-based route guards, INVO subdomain routing
 * - Tenant ID is injected into headers ( NEVER trust client-sent headers )
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { csrfMiddleware } from "@/lib/security/csrf";

const CSRF_COOKIE = "hv_csrf";

/* ── Route Configuration ── */

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
  "/sign-in",
  "/sign-up",
  "/catalog",
  "/sandbox",
  "/demo",
  "/hotels",
  "/hotels/join",
  "/marketplace",
  "/suppliers",
  "/suppliers/join",
  "/about",
  "/pricing",
  "/solutions",
  "/contact",
  "/become-supplier",
  "/social-media",
  "/offline",
  "/help",
  "/flow",
  "/financing/oliv",
  "/oliv/referral",
  "/factoring-service",
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
  "/api/v1/auth/verify",
  "/api/v1/auth/send-otp",
  "/api/v1/auth/verify-otp",
  "/api/v1/auth/otp-login",
  "/api/v1/supplier/onboard",
  "/api/v1/oliv/referral",
  "/api/v1/oliv/click",
  "/api/v1/oliv/webhook",
  "/api/v1/cms/content",
  "/api/v1/ai/public",
  "/api/v1/contact",
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
  ADMIN: ["/admin", "/hotel", "/supplier", "/factoring", "/shipping", "/marketing", "/analytics", "/ai-agents", "/procurement", "/orders", "/payments", "/scheduler", "/security", "/dispute", "/settings", "/eta", "/admin/page", "/hotel/page", "/supplier/page", "/factoring/page", "/shipping/page", "/marketing/page"],
  HOTEL: ["/hotel", "/hotel/page"],
  SUPPLIER: ["/supplier", "/supplier/page"],
  FACTORING: ["/factoring", "/factoring/page"],
  SHIPPING: ["/shipping", "/shipping/page"],
  MARKETING: ["/marketing", "/marketing/page"],
};

const ROLE_DEFAULT_PATH: Record<string, string> = {
  ADMIN: "/admin/page",
  HOTEL: "/hotel/page",
  SUPPLIER: "/supplier/page",
  FACTORING: "/factoring/page",
  SHIPPING: "/shipping/page",
  MARKETING: "/marketing/page",
};

/* ── Clerk Protected Route Matcher ── */

const isClerkProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/hotel(.*)",
  "/supplier(.*)",
  "/factoring(.*)",
  "/shipping(.*)",
  "/admin(.*)",
  "/marketing(.*)",
  "/analytics(.*)",
  "/ai-agents(.*)",
  "/procurement(.*)",
  "/orders(.*)",
  "/payments(.*)",
  "/scheduler(.*)",
  "/security(.*)",
  "/dispute(.*)",
  "/settings(.*)",
  "/eta(.*)",
  "/api/v1/(.*)",
]);

/* ── Helpers ── */

function isPublicPath(path: string): boolean {
  if (PUBLIC_PATHS.includes(path)) return true;
  return PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function isApiPath(path: string): boolean {
  return path.startsWith("/api/");
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

/* ── Security Headers ── */

function addSecurityHeaders(response: NextResponse, nonce: string): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://cdn.jsdelivr.net https://api.qrserver.com https://img.clerk.com https://*.clerk.com",
    "connect-src 'self' https://api.oliv.finance https://sandbox.oliv.finance https://invoicing.eta.gov.eg https://api.fawry.com https://*.clerk.accounts.dev https://*.clerk.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "worker-src 'self' blob:",
    "form-action 'self'",
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);
  return response;
}

/* ── Clerk Middleware ── */

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  // Next.js reads the nonce from the request headers and applies it to its generated
  // script tags. Setting it only on the response CSP is insufficient: strict-dynamic
  // would then block every Next.js bundle and leave only server-rendered fallbacks.
  const nonceHeaders = new Headers(request.headers);
  nonceHeaders.set("x-nonce", nonce);

  // ── INVO Subdomain Routing ──
  if (host.startsWith("invo.")) {
    const url = request.nextUrl.clone();
    if (pathname === "/") {
      url.pathname = "/invo";
      return addSecurityHeaders(NextResponse.rewrite(url, { request: { headers: nonceHeaders } }), nonce);
    }
    if (pathname.startsWith("/api/") && !pathname.startsWith("/api/v1/invo")) {
      return addSecurityHeaders(NextResponse.next({ request: { headers: nonceHeaders } }), nonce);
    }
    if (!pathname.startsWith("/invo") && !pathname.startsWith("/api/")) {
      url.pathname = `/invo${pathname}`;
      return addSecurityHeaders(NextResponse.rewrite(url, { request: { headers: nonceHeaders } }), nonce);
    }
  }

  // Redirect legacy /demo to /sandbox
  if (pathname === "/demo" || pathname.startsWith("/demo/")) {
    return addSecurityHeaders(NextResponse.redirect(new URL("/sandbox", request.url)), nonce);
  }

  // Allow public paths without auth
  if (isPublicPath(pathname)) {
    return addSecurityHeaders(NextResponse.next({ request: { headers: nonceHeaders } }), nonce);
  }

  // Read the Clerk session explicitly. Do not rely on auth.protect()'s
  // internal rewrite, which can produce a 404 outside a full Clerk browser flow.
  const { userId, orgId, orgRole, sessionClaims } = await auth();

  // Protected page routes always redirect to the real Clerk sign-in route.
  // API routes are handled below and return a normal 401 JSON response.
  if (isClerkProtected(request) && !isApiPath(pathname) && !userId) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return addSecurityHeaders(NextResponse.redirect(loginUrl), nonce);
  }

  // API routes: inject headers + CSRF protection
  if (isApiPath(pathname)) {
    if (!userId) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
        nonce
      );
    }

    const requestHeaders = new Headers(nonceHeaders);
    requestHeaders.set("x-user-id", userId);
    requestHeaders.set("x-tenant-id", orgId || (sessionClaims?.tenantId as string) || "");
    requestHeaders.set("x-platform-role", orgRole || (sessionClaims?.role as string) || "");

    // CSRF protection for state-changing API routes
    const isStateChanging = ["POST", "PUT", "DELETE", "PATCH"].includes(request.method);
    const isExemptPath =
      pathname === "/api/v1/auth/login" ||
      pathname === "/api/v1/auth/register" ||
      pathname === "/api/v1/oliv/webhook" ||
      pathname.startsWith("/api/webhooks");

    if (isStateChanging && !isExemptPath) {
      const csrfResult = await csrfMiddleware(request);
      if (csrfResult) return addSecurityHeaders(csrfResult, nonce);
    }

    return addSecurityHeaders(
      NextResponse.next({ request: { headers: requestHeaders } }),
      nonce
    );
  }

  // Page routes: role-based access control
  if (isProtectedPath(pathname)) {
    if (!userId) {
      // Clerk's auth.protect() already redirects to sign-in if unauthenticated
      // This is a fallback
      const loginUrl = new URL("/sign-in", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return addSecurityHeaders(NextResponse.redirect(loginUrl), nonce);
    }

    const platformRole = orgRole || (sessionClaims?.role as string) || "";

    // ADMIN can access everything
    if (platformRole === "ADMIN") {
      const requestHeaders = new Headers(nonceHeaders);
      requestHeaders.set("x-user-id", userId);
      requestHeaders.set("x-tenant-id", orgId || (sessionClaims?.tenantId as string) || "");
      requestHeaders.set("x-platform-role", platformRole);
      return addSecurityHeaders(
        NextResponse.next({ request: { headers: requestHeaders } }),
        nonce
      );
    }

    // Check role-based route access
    const allowedRoutes = ROLE_ROUTES[platformRole] || [];
    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!hasAccess) {
      const target = ROLE_DEFAULT_PATH[platformRole] || "/hotel";
      return addSecurityHeaders(NextResponse.redirect(new URL(target, request.url)), nonce);
    }
  }

  // Build response with auth headers
  const requestHeaders = new Headers(nonceHeaders);
  if (userId) {
    requestHeaders.set("x-user-id", userId);
    requestHeaders.set("x-tenant-id", orgId || (sessionClaims?.tenantId as string) || "");
    requestHeaders.set("x-platform-role", orgRole || (sessionClaims?.role as string) || "");
  }

  const response = addSecurityHeaders(
    NextResponse.next({ request: { headers: requestHeaders } }),
    nonce
  );

  // Set CSRF cookie for page routes
  if (!isApiPath(pathname) && !request.cookies.get(CSRF_COOKIE)?.value) {
    const { generateCsrfToken } = await import("@/lib/security/csrf");
    const csrfToken = await generateCsrfToken();
    response.cookies.set(CSRF_COOKIE, csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });
  }

  return response;
});

/* ── Matcher ── */

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};
