import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/session";

// ─────────────────────────────────────────
// EDGE MIDDLEWARE CONFIGURATION
// ─────────────────────────────────────────
export const config = {
  matcher: ["/api/v1/:path*", "/dashboard/:path*"],
};

/**
 * The Multi-Tenant Guard
 * High-performance Next.js Edge Middleware route guard enforcing our strict multi-tenant 
 * authority matrix directly at the network boundary layer.
 */
export async function middleware(req: NextRequest) {
  // 1. Extract the secure cryptographic authentication token
  const token = req.cookies.get("session_token")?.value || req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Missing cryptographic session token payload." }, 
      { status: 401 }
    );
  }

  // 2. Perform signature validation
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json(
      { error: "INVALID_SESSION", message: "Session token signature verification failed." }, 
      { status: 401 }
    );
  }

  const { platformRole, tenantId, userId } = session;
  const path = req.nextUrl.pathname;

  // 3. Multi-Tenant Authority Matrix Boundary Guard
  const isHotelRoute = path.startsWith("/api/v1/hotel") || path.startsWith("/dashboard/hotel");
  const isFactorRoute = path.startsWith("/api/v1/factor") || path.startsWith("/dashboard/factor");

  if (platformRole === "SUPPLIER" && (isHotelRoute || isFactorRoute)) {
    console.warn(`[Edge Guard Exception] Boundary penetration attempted by user ${userId} on path ${path}`);

    // Dispatch asynchronous edge-compatible telemetry hook to append AuditLog
    req.waitUntil(
      fetch(`${req.nextUrl.origin}/api/v1/telemetry/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "AUTHORIZATION_BREACH_ATTEMPT",
          entityType: "ROUTE_BOUNDARY",
          entityId: path,
          actorId: userId,
          tenantId: tenantId,
          afterState: JSON.stringify({ 
            message: `Cross-tenant resource access violation. SUPPLIER attempted to penetrate protected boundary: ${path}` 
          })
        })
      }).catch(() => { /* Silent drop if edge logger offline */ })
    );

    return NextResponse.json(
      { 
        error: "AUTHORIZATION_BREACH_ATTEMPT", 
        message: "Strict 403 Forbidden: Tenant lacks the authority matrix clearance to penetrate this route boundary." 
      },
      { status: 403 }
    );
  }

  // 4. Hydrate strict tenant state into headers for downstream ingestion
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant-id", tenantId);
  requestHeaders.set("x-user-id", userId);
  requestHeaders.set("x-platform-role", platformRole);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
