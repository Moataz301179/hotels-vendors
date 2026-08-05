import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getRedis } from "./redis";
import { prisma } from "./prisma";
import { createHash, randomBytes } from "crypto";

const SESSION_COOKIE = "hv_session";

/**
 * Returns the JWT signing secret. Throws in production if missing.
 * ALL session/auth code must import from here — never inline a fallback.
 */
export function getJwtSecret(): Uint8Array {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FATAL: SESSION_SECRET environment variable is required in production. " +
        "Generate one with: openssl rand -hex 32"
      );
    }
    console.warn("[Auth] WARNING: Using development fallback for SESSION_SECRET. Do NOT deploy without setting SESSION_SECRET.");
  }
  return new TextEncoder().encode(sessionSecret || "dev-secret-do-not-use-in-production");
}

const SECRET = getJwtSecret();

// ── Token Blacklist ──
const memoryBlacklist = new Set<string>();

async function isBlacklisted(token: string): Promise<boolean> {
  const r = getRedis();
  if (r) {
    try {
      const exists = await r.exists(`session:blacklist:${token}`);
      if (exists === 1) return true;
      // Also check user-level revocation (password reset invalidates all sessions)
      const payload = await jwtVerify(token, SECRET, { clockTolerance: 60 }).catch(() => null);
      if (payload?.payload?.userId) {
        const revoked = await r.exists(`session:user-revoked:${payload.payload.userId}`);
        if (revoked === 1) return true;
      }
      return false;
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

/**
 * Private helper to sign a JWT token with given parameters
 */
async function signToken(
  userId: string,
  platformRole: string,
  tenantId: string,
  ttl: string,
  type: "access" | "refresh"
): Promise<string> {
  return new SignJWT({ userId, platformRole, tenantId, type })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(SECRET);
}

export async function createSession(
  userId: string,
  platformRole: string,
  tenantId: string
): Promise<string> {
  const token = await signToken(userId, platformRole, tenantId, "24h", "access");

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

/**
 * Create a session pair (access token + refresh token) for mobile/API clients
 * Does NOT set cookies - returns tokens for client to store
 */
export async function createSessionPair(
  userId: string,
  platformRole: string,
  tenantId: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = await signToken(userId, platformRole, tenantId, "24h", "access");
  const refreshToken = await signToken(userId, platformRole, tenantId, "30d", "refresh");

  // Store refresh token hash on user for rotation validation
  const refreshTokenHash = createHash("sha256").update(refreshToken).digest("hex");
  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash },
  });

  return { accessToken, refreshToken };
}

export async function verifySession(
  token: string
): Promise<{ userId: string; platformRole: string; tenantId: string } | null> {
  // Check blacklist first
  if (await isBlacklisted(token)) {
    return null;
  }

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

/**
 * Verify a refresh token and return its payload
 */
export async function verifyRefreshToken(token: string): Promise<{ userId: string; platformRole: string; tenantId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      clockTolerance: 60,
    });

    // Must be a refresh token
    if (payload.type !== "refresh") return null;

    const userId = payload.userId as string;
    const platformRole = payload.platformRole as string;
    const tenantId = payload.tenantId as string;
    if (!userId || !platformRole || !tenantId) return null;

    // Verify the token hash matches what's stored on the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { refreshTokenHash: true, status: true },
    });

    if (!user || user.status !== "ACTIVE") return null;
    if (!user.refreshTokenHash) return null;

    const tokenHash = createHash("sha256").update(token).digest("hex");
    if (tokenHash !== user.refreshTokenHash) return null;

    return { userId, platformRole, tenantId };
  } catch {
    return null;
  }
}

/**
 * Rotate session pair: verify refresh token, issue new pair, update hash
 */
export async function rotateSessionPair(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) return null;

  // Revoke the old refresh token by clearing the hash (new one will be set)
  await prisma.user.update({
    where: { id: payload.userId },
    data: { refreshTokenHash: null },
  });

  // Create new session pair
  const { accessToken, refreshToken: newRefreshToken } = await createSessionPair(
    payload.userId,
    payload.platformRole,
    payload.tenantId
  );

  return { accessToken, refreshToken: newRefreshToken };
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
