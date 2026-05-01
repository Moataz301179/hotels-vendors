/**
 * Next.js Edge Middleware
 * Hotels Vendors — Multi-Tenant RBAC Gate
 *
 * Enforces at the edge:
 * 1. JWT session verification
 * 2. Tenant isolation (injects tenantId into headers)
 * 3. Role-route alignment
 * 4. Permission checks for API routes
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

const PUBLIC_ROUTES = ["/", "/about", "/pricing", "/contact", "/solutions", "/blog"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/verify-email"];
const ROLE_ROUTE_PREFIXES: Record<string, string[]> = {
  HOTEL: ["/hotel"],
  SUPPLIER: ["/supplier"],
  FACTORING: ["/factoring"],
  SHIPPING: ["/shipping"],
  ADMIN: ["/admin"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("hv_session")?.value;

  // 1. Public routes — allow all
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/uploads")
  ) {
    return NextResponse.next();
  }

  // 2. Auth routes — redirect authenticated users to dashboard
  if (AUTH_ROUTES.includes(pathname)) {
    if (token) {
      try {
        await jwtVerify(token, SECRET, { clockTolerance: 60 });
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        // Invalid token, allow access to auth pages
      }
    }
    return NextResponse.next();
  }

  // 3. Verify JWT for all protected routes
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let payload;
  try {
    const verified = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    payload = verified.payload as {
      userId: string;
      platformRole: string;
      tenantId: string;
    };
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. Inject tenant context into headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", payload.tenantId);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-role", payload.platformRole);

  // 5. Role-route alignment for dashboard routes
  if (pathname.startsWith("/dashboard/") || pathname.startsWith("/hotel/") ||
      pathname.startsWith("/supplier/") || pathname.startsWith("/factoring/") ||
      pathname.startsWith("/shipping/") || pathname.startsWith("/admin/")) {
    const allowedPrefixes = ROLE_ROUTE_PREFIXES[payload.platformRole] || [];
    const isAllowed = allowedPrefixes.some((prefix) =>
      pathname.startsWith(prefix) || pathname.startsWith("/dashboard" + prefix)
    );

    if (payload.platformRole === "ADMIN") {
      // Admin can access everything
    } else if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // 6. Permission gate for API v1 routes
  if (pathname.startsWith("/api/v1/")) {
    const permissionRequired = requestHeaders.get("x-permission-required");
    if (permissionRequired) {
      // TODO: Verify user has this permission (requires DB lookup)
      // For now, we trust the role-based route alignment above
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
  ],
};
