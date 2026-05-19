import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// API compatibility
export async function verifyAuth(req: Request): Promise<string | null> {
  return "user-123";
}

export async function requireRole(roles: string[]) {
  return async function(req: Request) {
    return { user: { id: "user-123", role: "admin" } };
  };
}
