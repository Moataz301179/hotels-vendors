(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__11ru_ap._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
/**
 * Edge Middleware — Authentication, Tenant Injection, Role-Based Route Guards
 *
 * G2: RBAC IS SERVER-SIDE ONLY
 * - Every request to protected routes is verified at the edge
 * - Tenant ID is injected into headers ( NEVER trust client-sent headers )
 * - Role-based route access enforced before reaching any page or API
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [middleware-edge] (ecmascript)");
;
;
const SESSION_COOKIE = "hv_session";
const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || "dev-secret-change-in-production");
/* ── Route Configuration ── */ const PUBLIC_PATHS = [
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
    "/pricing",
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
    "/api/v1/supplier/onboard",
    "/api/v1/cms/content",
    "/api/v1/ai/public",
    "/api/health"
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
    "/sitemap"
];
const ROLE_ROUTES = {
    ADMIN: [
        "/admin",
        "/hotel",
        "/supplier",
        "/factoring",
        "/shipping",
        "/marketing",
        "/analytics",
        "/ai-agents",
        "/procurement",
        "/orders",
        "/payments",
        "/scheduler",
        "/security",
        "/dispute",
        "/settings",
        "/eta"
    ],
    HOTEL: [
        "/hotel"
    ],
    SUPPLIER: [
        "/supplier"
    ],
    FACTORING: [
        "/factoring"
    ],
    SHIPPING: [
        "/shipping"
    ],
    MARKETING: [
        "/marketing"
    ]
};
const ROLE_DEFAULT_PATH = {
    ADMIN: "/admin",
    HOTEL: "/hotel",
    SUPPLIER: "/supplier",
    FACTORING: "/factoring",
    SHIPPING: "/shipping",
    MARKETING: "/marketing"
};
/* ── Helpers ── */ function isPublicPath(path) {
    if (PUBLIC_PATHS.includes(path)) return true;
    return PUBLIC_PREFIXES.some((prefix)=>path.startsWith(prefix));
}
function isProtectedPath(path) {
    return path.startsWith("/hotel") || path.startsWith("/supplier") || path.startsWith("/factoring") || path.startsWith("/shipping") || path.startsWith("/admin") || path.startsWith("/marketing") || path.startsWith("/analytics") || path.startsWith("/ai-agents") || path.startsWith("/procurement") || path.startsWith("/orders") || path.startsWith("/payments") || path.startsWith("/scheduler") || path.startsWith("/security") || path.startsWith("/dispute") || path.startsWith("/settings") || path.startsWith("/eta");
}
function isApiPath(path) {
    return path.startsWith("/api/");
}
async function verifySession(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtVerify"])(token, SECRET, {
            clockTolerance: 60
        });
        const userId = payload.userId;
        const platformRole = payload.platformRole;
        const tenantId = payload.tenantId;
        if (!userId || !platformRole || !tenantId) return null;
        return {
            userId,
            platformRole,
            tenantId
        };
    } catch  {
        return null;
    }
}
async function middleware(request) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get("host") || "";
    // ── INVO Subdomain Routing ──
    // invo.hotelsvendors.com/ → serves /invo page
    // invo.hotelsvendors.com/docs → serves /invo/docs page
    if (host.startsWith("invo.")) {
        const url = request.nextUrl.clone();
        // Root path → rewrite to /invo
        if (pathname === "/") {
            url.pathname = "/invo";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(url);
        }
        // API paths under subdomain → route to /api/v1/invo
        if (pathname.startsWith("/api/") && !pathname.startsWith("/api/v1/invo")) {
            // Allow API calls on invo subdomain to reach the INVO API routes
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        }
        // Other paths → prepend /invo if not already
        if (!pathname.startsWith("/invo") && !pathname.startsWith("/api/")) {
            url.pathname = `/invo${pathname}`;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(url);
        }
    }
    // Allow public paths without auth
    if (isPublicPath(pathname)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Read session cookie
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    // ── API routes: require valid session ──
    if (isApiPath(pathname)) {
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const session = await verifySession(token);
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Invalid or expired session"
            }, {
                status: 401
            });
        }
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", session.userId);
        requestHeaders.set("x-tenant-id", session.tenantId);
        requestHeaders.set("x-platform-role", session.platformRole);
        requestHeaders.set("x-session-token", token);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
            request: {
                headers: requestHeaders
            }
        });
    }
    // No token on protected route → redirect to login
    if (!token && isProtectedPath(pathname)) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    // No token on non-protected route → allow through
    if (!token) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Verify token
    const session = await verifySession(token);
    // Invalid/expired token on protected route → clear cookie, redirect to login
    if (!session && isProtectedPath(pathname)) {
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", request.url));
        response.cookies.delete(SESSION_COOKIE);
        return response;
    }
    // Invalid token on non-protected route → allow through (will fail at API layer if needed)
    if (!session) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(target, request.url));
    }
    // Role-based route guards
    if (isProtectedPath(pathname)) {
        // ADMIN can access everything
        if (platformRole === "ADMIN") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
                request: {
                    headers: requestHeaders
                }
            });
        }
        // Check if user has access to this route
        const allowedRoutes = ROLE_ROUTES[platformRole] || [];
        const hasAccess = allowedRoutes.some((route)=>pathname.startsWith(route));
        if (!hasAccess) {
            // Redirect to their default dashboard
            const target = ROLE_DEFAULT_PATH[platformRole] || "/hotel";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(target, request.url));
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request: {
            headers: requestHeaders
        }
    });
}
const config = {
    matcher: [
        /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (handled by web server)
     */ "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__11ru_ap._.js.map