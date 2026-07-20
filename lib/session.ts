import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getRedis } from "./redis";

// Inline JWT secret — avoid Turbopack cross-module ESM hoisting issues
// that caused "getJwtSecret is not defined" at module init.
function getJwtSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: SESSION_SECRET required in production");
    }
  }
  return new TextEncoder().encode(secret || "dev-secret-do-not-use-in-production");
}

// Keep the export for other modules that import it (middleware, layouts, etc.)
export { getJwtSecret };

const SESSION_COOKIE = "hv_session";

// Lazy-initialized on first use — avoids Turbopack ESM hoisting issues
// where the re-exported getJwtSecret isn't available at module load time.
let _SECRET: Uint8Array | null = null;
function SECRET(): Uint8Array {
  if (!_SECRET) _SECRET = getJwtSecret();
  return _SECRET;
}

// ── Token Blacklist ──
const memoryBlacklist = new Set<string>();

async function isBlacklisted(token: string): Promise<boolean> {
  const r = getRedis();
  if (r) {
    try {
      const exists = await r.exists(`session:blacklist:${token}`);
      return exists === 1;
    } catch {
      return memoryBlacklist.has(token);
    }
  }
  return memoryBlacklist.has(token);
}

export async function revokeToken(token: string): Promise<void> {
  const r = getRedis();
  if (r) {
    try {
      await r.setex(`session:blacklist:${token}`, 604800, "1"); // 7 days
    } catch {
      memoryBlacklist.add(token);
    }
  } else {
    memoryBlacklist.add(token);
  }
}

export async function createSession(
  userId: string,
  platformRole: string,
  tenantId: string
): Promise<string> {
  const token = await new SignJWT({ userId, platformRole, tenantId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return token;
}

export async function verifySession(
  token: string
): Promise<{ userId: string; platformRole: string; tenantId: string } | null> {
  // Check blacklist first
  if (await isBlacklisted(token)) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, SECRET(), {
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

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await revokeToken(token);
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}
