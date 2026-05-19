import { jwtVerify } from "jose";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error(
    'FATAL SECURITY ERROR: SESSION_SECRET environment variable is required. ' +
    'Application cannot start without secure session configuration. ' +
    'Refer to SECURITY_AUDIT_RISK_REGISTER_P0.md for remediation steps.'
  );
}
const SECRET = new TextEncoder().encode(sessionSecret);

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
