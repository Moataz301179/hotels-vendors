import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

const publicPaths = [
  "/login",
  "/signup",
  "/verify",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/verify",
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  if (pathname.startsWith("/api/") || pathname.startsWith("/dashboard") || pathname.startsWith("/settings")) {
    const token = req.cookies.get("session")?.value
    if (!token || !verifyToken(token)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/settings/:path*"],
}
