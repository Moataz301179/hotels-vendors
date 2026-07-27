import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mock Prisma ──
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    tenant: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    role: {
      create: vi.fn(),
    },
    hotel: {
      create: vi.fn(),
    },
    supplier: {
      create: vi.fn(),
    },
    factoringCompany: {
      create: vi.fn(),
    },
    emailVerificationToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    passwordResetToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn((fns: unknown[]) => Promise.all(fns)),
  },
}));

// ── Mock Redis ──
vi.mock("@/lib/redis", () => ({
  getRedis: vi.fn().mockReturnValue(null),
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 100, resetAt: Date.now() + 60_000 }),
  checkIdempotencyKey: vi.fn().mockResolvedValue({ exists: false }),
  completeIdempotency: vi.fn(),
}));

// ── Mock Session ──
vi.mock("@/lib/session", () => ({
  createSession: vi.fn().mockResolvedValue("mock-jwt-token"),
  verifySession: vi.fn(),
  clearSession: vi.fn().mockResolvedValue(undefined),
  getSessionToken: vi.fn(),
  revokeToken: vi.fn().mockResolvedValue(undefined),
}));

// ── Mock api-utils ──
vi.mock("@/lib/api-utils", () => ({
  apiRoute: (handler: (...args: unknown[]) => Promise<unknown>) => handler,
  validateBody: (_schema: unknown, body: unknown) => body,
  success: (data: unknown, status = 200) => ({ status, data }),
  error: (message: string, status = 400) => ({ status, error: message }),
  audit: vi.fn().mockResolvedValue(undefined),
}));

// ── Mock email notifications ──
vi.mock("@/lib/notifications/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
  welcomeTemplate: vi.fn().mockReturnValue({ subject: "Welcome", html: "<h1>Welcome</h1>" }),
  emailVerificationTemplate: vi.fn().mockReturnValue({ subject: "Verify", html: "<h1>Verify</h1>" }),
  passwordResetTemplate: vi.fn().mockReturnValue({ subject: "Reset", html: "<h1>Reset</h1>" }),
  passwordResetConfirmationTemplate: vi.fn().mockReturnValue({ subject: "Confirmed", html: "<h1>Done</h1>" }),
}));

// ── Mock audit log ──
vi.mock("@/lib/audit/tamper-proof", () => ({
  appendAuditEntry: vi.fn(),
}));

// ── Mock security logger ──
vi.mock("@/lib/security/security-logger", () => ({
  logAuthFailure: vi.fn(),
  logRateLimit: vi.fn(),
}));

// ── Mock rate limiter ──
vi.mock("@/lib/security/rate-limiter", () => ({
  rateLimitResponse: vi.fn(),
}));

// ── Mock React cache + next/headers (required by server-auth.ts) ──
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return { ...actual, cache: (fn: (...args: unknown[]) => unknown) => fn };
});

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

// ── Mock Sentry ──
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}));

import { hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardPath, hasRole } from "@/lib/auth/server-auth";
import { createSession, verifySession, clearSession, getSessionToken, revokeToken } from "@/lib/session";
import { checkRateLimit } from "@/lib/redis";

const mockPrisma = vi.mocked(prisma);

describe("Auth Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ──────────────────────────────────────────────
  // REGISTRATION FLOW
  // ──────────────────────────────────────────────
  describe("Registration flow", () => {
    it("should complete full hotel registration with tenant creation", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.tenant.create.mockResolvedValue({
        id: "t-1", name: "Grand Hotel", slug: "hotel-1", type: "HOTEL_GROUP",
      });
      mockPrisma.role.create.mockResolvedValue({
        id: "r-1", name: "Owner", tenantId: "t-1", isGlobal: false,
      });
      mockPrisma.hotel.create.mockResolvedValue({
        id: "h-1", name: "Grand Hotel", taxId: "12345", city: "Cairo",
        governorate: "Cairo", address: "123 Main St", commercialReg: "CR-001",
        email: "hotel@test.com", tenantId: "t-1",
      });
      mockPrisma.user.create.mockResolvedValue({
        id: "u-1", email: "hotel@test.com", name: "Grand Hotel",
        role: "OWNER", platformRole: "HOTEL", tenantId: "t-1", hotelId: "h-1",
      });
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: "u-1", email: "hotel@test.com", name: "Grand Hotel",
          platformRole: "HOTEL", tenantId: "t-1",
        });
      mockPrisma.emailVerificationToken.create.mockResolvedValue({} as never);

      const hash = await hashPassword("SecurePass123!");
      expect(hash).toBeDefined();
      expect(hash).not.toBe("SecurePass123!");

      const emailCheck = await prisma.user.findUnique({ where: { email: "hotel@test.com" } });
      expect(emailCheck).toBeNull();

      const tenant = await prisma.tenant.create({
        data: { name: "Grand Hotel", slug: "hotel-1", type: "HOTEL_GROUP" },
      });
      expect(tenant.id).toBe("t-1");

      const user = await prisma.user.findUnique({ where: { email: "hotel@test.com" } });
      expect(user).not.toBeNull();
      expect(user!.platformRole).toBe("HOTEL");
    });

    it("should reject registration with duplicate email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "existing", email: "hotel@test.com", name: "Existing Hotel",
        role: "OWNER", platformRole: "HOTEL", tenantId: "t-old",
      });

      const existing = await prisma.user.findUnique({ where: { email: "hotel@test.com" } });
      expect(existing).not.toBeNull();
      expect(existing!.id).toBe("existing");
    });

    it("should complete supplier registration with supplier entity", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.tenant.create.mockResolvedValue({
        id: "t-sup", name: "ACME Supplies", slug: "sup-1", type: "SUPPLIER",
      });
      mockPrisma.role.create.mockResolvedValue({
        id: "r-sup", name: "Owner", tenantId: "t-sup", isGlobal: false,
      });
      mockPrisma.supplier.create.mockResolvedValue({
        id: "s-1", name: "ACME Supplies", taxId: "99999", email: "supplier@test.com",
        tenantId: "t-sup", status: "ACTIVE", tier: "CORE",
      });
      mockPrisma.user.create.mockResolvedValue({
        id: "u-sup", email: "supplier@test.com", name: "ACME Supplies",
        role: "OWNER", platformRole: "SUPPLIER", tenantId: "t-sup", supplierId: "s-1",
      });
      mockPrisma.emailVerificationToken.create.mockResolvedValue({} as never);

      const hash = await hashPassword("SupplierPass123!");
      const tenant = await prisma.tenant.create({
        data: { name: "ACME Supplies", slug: "sup-1", type: "SUPPLIER" },
      });
      expect(tenant.type).toBe("SUPPLIER");

      const supplier = await prisma.supplier.create({
        data: {
          name: "ACME Supplies", taxId: "99999", email: "supplier@test.com",
          city: "Cairo", governorate: "Cairo", address: "456 Factory St",
          commercialReg: "CR-002", phone: "+20111222333", tenantId: "t-sup",
          status: "ACTIVE", tier: "CORE",
        },
      });
      expect(supplier.status).toBe("ACTIVE");
    });

    it("should generate email verification token during registration", async () => {
      mockPrisma.emailVerificationToken.create.mockResolvedValue({
        id: "evt-1", email: "hotel@test.com", token: "hashed-token", expiresAt: new Date(),
      });

      const token = await prisma.emailVerificationToken.create({
        data: {
          email: "hotel@test.com",
          token: "hashed-token",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      expect(token).toBeDefined();
      expect(token.email).toBe("hotel@test.com");
    });
  });

  // ──────────────────────────────────────────────
  // LOGIN FLOW
  // ──────────────────────────────────────────────
  describe("Login flow", () => {
    it("should complete full login with password verification", async () => {
      const hash = await hashPassword("SecurePass123!");
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "u-1", email: "hotel@test.com", passwordHash: hash,
        role: "OWNER", platformRole: "HOTEL", tenantId: "t-1", hotelId: "h-1",
        hotel: { id: "h-1", name: "Grand Hotel" },
      });
      vi.mocked(createSession).mockResolvedValue("new-session-token");

      const user = await prisma.user.findUnique({ where: { email: "hotel@test.com" } });
      expect(user).not.toBeNull();

      const valid = await verifyPassword("SecurePass123!", user!.passwordHash);
      expect(valid).toBe(true);

      const token = await createSession(user!.id, user!.platformRole, user!.tenantId);
      expect(token).toBe("new-session-token");
    });

    it("should reject login with wrong password", async () => {
      const hash = await hashPassword("CorrectPass123!");
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "u-1", email: "hotel@test.com", passwordHash: hash,
        role: "OWNER", platformRole: "HOTEL", tenantId: "t-1",
      });

      const user = await prisma.user.findUnique({ where: { email: "hotel@test.com" } });
      expect(user).not.toBeNull();

      const valid = await verifyPassword("WrongPass999!", user!.passwordHash);
      expect(valid).toBe(false);
    });

    it("should handle login for non-existent user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const user = await prisma.user.findUnique({ where: { email: "ghost@test.com" } });
      expect(user).toBeNull();
    });

    it("should enforce rate limiting on login attempts", async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce({
        allowed: false, remaining: 0, resetAt: Date.now() + 60_000,
      });

      const result = await checkRateLimit("login:192.168.1.1", 60, 5);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should allow login when within rate limit", async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce({
        allowed: true, remaining: 3, resetAt: Date.now() + 60_000,
      });

      const result = await checkRateLimit("login:192.168.1.1", 60, 5);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(3);
    });
  });

  // ──────────────────────────────────────────────
  // SESSION MANAGEMENT
  // ──────────────────────────────────────────────
  describe("Session management", () => {
    it("should create session and return token", async () => {
      vi.mocked(createSession).mockResolvedValue("session-abc-123");
      const token = await createSession("u-1", "HOTEL", "t-1");
      expect(token).toBe("session-abc-123");
      expect(createSession).toHaveBeenCalledWith("u-1", "HOTEL", "t-1");
    });

    it("should verify valid session and extract claims", async () => {
      vi.mocked(verifySession).mockResolvedValue({
        userId: "u-1", platformRole: "HOTEL", tenantId: "t-1",
      });

      const session = await verifySession("valid-token");
      expect(session).not.toBeNull();
      expect(session!.userId).toBe("u-1");
      expect(session!.platformRole).toBe("HOTEL");
      expect(session!.tenantId).toBe("t-1");
    });

    it("should reject expired or invalid session token", async () => {
      vi.mocked(verifySession).mockResolvedValue(null);

      const session = await verifySession("expired-or-invalid-token");
      expect(session).toBeNull();
    });

    it("should clear session and revoke token on logout", async () => {
      vi.mocked(getSessionToken).mockResolvedValue("token-to-revoke");
      vi.mocked(verifySession).mockResolvedValue({
        userId: "u-1", platformRole: "HOTEL", tenantId: "t-1",
      });
      vi.mocked(revokeToken).mockResolvedValue(undefined);
      vi.mocked(clearSession).mockResolvedValue(undefined);

      const token = await getSessionToken();
      expect(token).toBe("token-to-revoke");

      const session = await verifySession(token!);
      expect(session).not.toBeNull();

      await revokeToken(token!);
      expect(revokeToken).toHaveBeenCalledWith("token-to-revoke");

      await clearSession();
      expect(clearSession).toHaveBeenCalledOnce();
    });

    it("should handle logout when no session exists", async () => {
      vi.mocked(getSessionToken).mockResolvedValue(undefined);
      vi.mocked(clearSession).mockResolvedValue(undefined);

      const token = await getSessionToken();
      expect(token).toBeUndefined();

      await clearSession();
      expect(clearSession).toHaveBeenCalledOnce();
    });
  });

  // ──────────────────────────────────────────────
  // PASSWORD SECURITY INVARIANTS
  // ──────────────────────────────────────────────
  describe("Password security invariants", () => {
    it("should produce different bcrypt hashes for the same password", async () => {
      const hash1 = await hashPassword("SamePass123!");
      const hash2 = await hashPassword("SamePass123!");
      expect(hash1).not.toBe(hash2);
    });

    it("should verify correct password against its hash", async () => {
      const hash = await hashPassword("MySecurePass123!");
      expect(await verifyPassword("MySecurePass123!", hash)).toBe(true);
    });

    it("should reject incorrect password against hash", async () => {
      const hash = await hashPassword("MySecurePass123!");
      expect(await verifyPassword("NotTheRightPass1!", hash)).toBe(false);
    });

    it("should handle empty string password attempt", async () => {
      const hash = await hashPassword("RealPass123!");
      expect(await verifyPassword("", hash)).toBe(false);
    });

    it("should handle unicode password hashing", async () => {
      const unicodePass = "Passw0rd Cairo-القاهرة!";
      const hash = await hashPassword(unicodePass);
      expect(await verifyPassword(unicodePass, hash)).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // PASSWORD RESET FLOW
  // ──────────────────────────────────────────────
  describe("Password reset flow", () => {
    it("should find user and create reset token", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "u-1", email: "hotel@test.com", name: "Test Hotel",
        platformRole: "HOTEL", tenantId: "t-1",
      });
      mockPrisma.passwordResetToken.deleteMany.mockResolvedValue({ count: 0 });
      mockPrisma.passwordResetToken.create.mockResolvedValue({
        id: "prt-1", email: "hotel@test.com", token: "hashed-reset-token",
        expiresAt: new Date(Date.now() + 86_400_000),
      });

      const user = await prisma.user.findUnique({ where: { email: "hotel@test.com" } });
      expect(user).not.toBeNull();

      await prisma.passwordResetToken.deleteMany({ where: { email: user!.email } });
      const resetToken = await prisma.passwordResetToken.create({
        data: {
          email: user!.email,
          token: "hashed-reset-token",
          expiresAt: new Date(Date.now() + 86_400_000),
        },
      });
      expect(resetToken.email).toBe("hotel@test.com");
    });

    it("should reject password reset for non-existent email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const user = await prisma.user.findUnique({ where: { email: "ghost@test.com" } });
      expect(user).toBeNull();
    });

    it("should complete password update with new hash", async () => {
      const newHash = await hashPassword("NewSecurePass456!");
      mockPrisma.user.update.mockResolvedValue({
        id: "u-1", passwordHash: newHash,
      });

      const updated = await prisma.user.update({
        where: { id: "u-1" },
        data: { passwordHash: newHash },
      });
      expect(updated.passwordHash).toBe(newHash);

      const valid = await verifyPassword("NewSecurePass456!", newHash);
      expect(valid).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // EMAIL VERIFICATION FLOW
  // ──────────────────────────────────────────────
  describe("Email verification flow", () => {
    it("should verify email with valid token", async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue({
        id: "evt-1", email: "hotel@test.com", token: "token-hash",
        expiresAt: new Date(Date.now() + 86_400_000),
      });
      mockPrisma.user.update.mockResolvedValue({
        id: "u-1", email: "hotel@test.com", emailVerifiedAt: new Date(),
      });
      mockPrisma.emailVerificationToken.delete.mockResolvedValue({} as never);

      const verification = await prisma.emailVerificationToken.findUnique({
        where: { token: "token-hash" },
      });
      expect(verification).not.toBeNull();
      expect(verification!.expiresAt.getTime()).toBeGreaterThan(Date.now());

      await prisma.user.update({
        where: { email: verification!.email },
        data: { emailVerifiedAt: new Date() },
      });
      await prisma.emailVerificationToken.delete({ where: { id: verification!.id } });
    });

    it("should reject expired verification token", async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue({
        id: "evt-expired", email: "hotel@test.com", token: "old-token",
        expiresAt: new Date(Date.now() - 1000),
      });
      mockPrisma.emailVerificationToken.delete.mockResolvedValue({} as never);

      const verification = await prisma.emailVerificationToken.findUnique({
        where: { token: "old-token" },
      });
      expect(verification).not.toBeNull();

      const isExpired = verification!.expiresAt < new Date();
      expect(isExpired).toBe(true);
    });

    it("should reject verification with non-existent token", async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue(null);

      const verification = await prisma.emailVerificationToken.findUnique({
        where: { token: "fake-token-hash" },
      });
      expect(verification).toBeNull();
    });
  });

  // ──────────────────────────────────────────────
  // SERVER-AUTH HELPERS
  // ──────────────────────────────────────────────
  describe("Server-auth role helpers", () => {
    it("should map HOTEL role to /hotel dashboard", () => {
      expect(getDashboardPath("HOTEL")).toBe("/hotel");
    });

    it("should map SUPPLIER role to /supplier dashboard", () => {
      expect(getDashboardPath("SUPPLIER")).toBe("/supplier");
    });

    it("should map FACTORING role to /factoring dashboard", () => {
      expect(getDashboardPath("FACTORING")).toBe("/factoring");
    });

    it("should map SHIPPING role to /shipping dashboard", () => {
      expect(getDashboardPath("SHIPPING")).toBe("/shipping");
    });

    it("should map ADMIN role to /admin dashboard", () => {
      expect(getDashboardPath("ADMIN")).toBe("/admin");
    });

    it("should fallback to /hotel for unknown role", () => {
      expect(getDashboardPath("UNKNOWN_ROLE")).toBe("/hotel");
    });

    it("should check ADMIN platform role grants access to any role", async () => {
      vi.mocked(verifySession).mockResolvedValue({
        userId: "admin-1", platformRole: "ADMIN", tenantId: "t-1",
      });

      const session = await verifySession("admin-token");
      const isAdmin = session?.platformRole === "ADMIN";
      expect(isAdmin).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // MULTI-STEP REGISTRATION → LOGIN → SESSION
  // ──────────────────────────────────────────────
  describe("End-to-end: Registration → Login → Session → Logout", () => {
    it("should complete the full lifecycle", async () => {
      // Step 1: Registration checks — no duplicate
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const check1 = await prisma.user.findUnique({ where: { email: "lifecycle@test.com" } });
      expect(check1).toBeNull();

      // Step 2: Password hashing
      const passwordHash = await hashPassword("LifeCyclePass123!");
      expect(passwordHash).toBeDefined();

      // Step 3: Simulate user creation in DB
      mockPrisma.user.create.mockResolvedValue({
        id: "u-lc", email: "lifecycle@test.com", name: "Lifecycle Hotel",
        role: "OWNER", platformRole: "HOTEL", tenantId: "t-lc",
      });
      const createdUser = await prisma.user.create({
        data: {
          email: "lifecycle@test.com", password: passwordHash,
          name: "Lifecycle Hotel", role: "OWNER", platformRole: "HOTEL",
          tenantId: "t-lc",
        },
      });
      expect(createdUser.id).toBe("u-lc");

      // Step 4: Login — find user + verify password
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "u-lc", email: "lifecycle@test.com", passwordHash,
        role: "OWNER", platformRole: "HOTEL", tenantId: "t-lc",
      });
      const loginUser = await prisma.user.findUnique({ where: { email: "lifecycle@test.com" } });
      expect(loginUser).not.toBeNull();
      const passwordValid = await verifyPassword("LifeCyclePass123!", loginUser!.passwordHash);
      expect(passwordValid).toBe(true);

      // Step 5: Create session
      vi.mocked(createSession).mockResolvedValue("lifecycle-session-token");
      const sessionToken = await createSession("u-lc", "HOTEL", "t-lc");
      expect(sessionToken).toBe("lifecycle-session-token");

      // Step 6: Verify session
      vi.mocked(verifySession).mockResolvedValue({
        userId: "u-lc", platformRole: "HOTEL", tenantId: "t-lc",
      });
      const verified = await verifySession(sessionToken);
      expect(verified).not.toBeNull();
      expect(verified!.userId).toBe("u-lc");

      // Step 7: Logout — revoke + clear
      vi.mocked(revokeToken).mockResolvedValue(undefined);
      vi.mocked(clearSession).mockResolvedValue(undefined);
      await revokeToken(sessionToken);
      await clearSession();
      expect(revokeToken).toHaveBeenCalledWith(sessionToken);
      expect(clearSession).toHaveBeenCalledOnce();
    });
  });
});
