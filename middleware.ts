import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "hv_session";
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/register/hotel",
  "/register/supplier",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/about",
  "/pricing",
  "/solutions",
  "/partners",
  "/partner",
  "/become-supplier",
  "/social-media",
  "/help",
  "/api",
  "/_next",
  "/favicon.ico",
  "/logo",
  "/images",
  "/sw.js",
  "/preview",
];

const ROLE_PATHS: Record<string, string> = {
  ADMIN: "/admin",
  HOTEL: "/hotel",
  SUPPLIER: "/supplier",
  FACTORING: "/factoring",
  SHIPPING: "/shipping",
  MARKETING: "/marketing",
};

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    return payload as { userId: string; platformRole: string; tenantId: string };
  } catch {
    return null;
  }
}

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some((pp) => path === pp || path.startsWith(pp + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const session = await verifyToken(token);
  if (!session) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
  const role = session.platformRole;
  if (role === "ADMIN") {
    return NextResponse.next();
  }
  const allowedPrefix = ROLE_PATHS[role];
  for (const [r, prefix] of Object.entries(ROLE_PATHS)) {
    if (pathname.startsWith(prefix) && r !== role) {
      return NextResponse.redirect(new URL(allowedPrefix || "/hotel", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json|woff|woff2|ttf)).*)",
  ],
};
