import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "hv_session";
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

export async function createSession(
  userId: string,
  platformRole: string,
  tenantId: string
): Promise<string> {
  const token = await new SignJWT({ userId, platformRole, tenantId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function verifySession(
  token: string
): Promise<{ userId: string; platformRole: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      clockTolerance: 60,
    });
    const userId = payload.userId as string;
    const platformRole = payload.platformRole as string;
    if (!userId || !platformRole) return null;
    return { userId, platformRole };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}
