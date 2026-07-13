/**
 * CSRF Protection — Double-Submit Cookie Pattern
 *
 * How it works:
 * 1. On GET requests, set a random CSRF token in a cookie (not httpOnly)
 * 2. Client reads the cookie and sends the token in a header (X-CSRF-Token)
 * 3. On state-changing requests, server compares cookie value vs header value
 * 4. Since attacker-controlled subdomains can't read cookies from different origins,
 *    they can't set the matching header — CSRF is blocked.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";

const CSRF_COOKIE = "hv_csrf";
const CSRF_HEADER = "x-csrf-token";
const CSRF_SECRET = process.env.CSRF_SECRET || process.env.SESSION_SECRET || "";

/**
 * Generate a CSRF token signed with HMAC.
 */
export function generateCsrfToken(): string {
  const payload = randomBytes(16).toString("hex");
  const signature = createHash("sha256")
    .update(`${payload}:${CSRF_SECRET}`)
    .digest("hex")
    .slice(0, 16);
  return `${payload}.${signature}`;
}

/**
 * Validate a CSRF token against the cookie value.
 */
export function validateCsrfToken(cookieValue: string, headerValue: string): boolean {
  if (!cookieValue || !headerValue) return false;
  if (cookieValue !== headerValue) return false;

  // Verify HMAC signature
  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return false;

  const expectedSig = createHash("sha256")
    .update(`${payload}:${CSRF_SECRET}`)
    .digest("hex")
    .slice(0, 16);

  // Timing-safe comparison
  if (signature.length !== expectedSig.length) return false;
  let diff = 0;
  for (let i = 0; i < signature.length; i++) {
    diff |= signature.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Middleware helper: set CSRF cookie on GET, validate on POST/PUT/DELETE/PATCH.
 */
export function csrfMiddleware(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase();
  const isStateChanging = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

  if (!isStateChanging) {
    // GET/HEAD/OPTIONS — set CSRF cookie if not present
    const existingToken = request.cookies.get(CSRF_COOKIE)?.value;
    if (!existingToken) {
      const response = NextResponse.next();
      response.cookies.set(CSRF_COOKIE, generateCsrfToken(), {
        httpOnly: false, // Client must be able to read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      });
      return response;
    }
    return null; // No response modification needed
  }

  // State-changing request — validate CSRF
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);

  if (!validateCsrfToken(cookieToken || "", headerToken || "")) {
    return NextResponse.json(
      { success: false, error: "CSRF token validation failed" },
      { status: 403 }
    );
  }

  return null; // Validation passed
}
