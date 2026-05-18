import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "production-secure-key-rotation-pending"
);

export interface SessionPayload {
  userId: string;
  tenantId: string;
  role: string; 
  platformRole: "HOTEL" | "SUPPLIER" | "FACTOR" | "ADMIN";
}

/**
 * Validates the cryptographic signature of the session token.
 * Resolves the decoded SessionPayload on success, or null if the signature is breached.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null; // Cryptographic validation failed or token expired
  }
}
