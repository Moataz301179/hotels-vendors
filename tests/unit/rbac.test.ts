import { describe, it, expect, vi, beforeEach } from "vitest";
import type { TenantContext } from "@/lib/tenant/scope";

// ── vi.hoisted keeps refs available inside vi.mock factories ──

const { mockUserFindUnique, mockRolePermFindFirst, mockRolePermFindMany, mockPermFindMany } =
  vi.hoisted(() => ({
    mockUserFindUnique: vi.fn(),
    mockRolePermFindFirst: vi.fn(),
    mockRolePermFindMany: vi.fn(),
    mockPermFindMany: vi.fn(),
  }));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: mockUserFindUnique },
    rolePermission: { findFirst: mockRolePermFindFirst, findMany: mockRolePermFindMany },
    permission: { findMany: mockPermFindMany },
  },
}));

// ── Imports AFTER mocks ──

import {
  hasPermission,
  requirePermission,
  requireAnyPermission,
  getUserPermissions,
  PermissionDeniedError,
} from "@/lib/auth/rbac";

// ── Helpers ──

function makeCtx(overrides: Partial<TenantContext> = {}): TenantContext {
  return {
    userId: "user-1",
    tenantId: "tenant-hotel-1",
    platformRole: "MEMBER",
    ...overrides,
  };
}

/** Stub user lookup → returns { roleId } */
function stubUser(roleId: string) {
  mockUserFindUnique.mockResolvedValueOnce({ roleId });
}

/** Stub user lookup → user not found */
function stubUserNotFound() {
  mockUserFindUnique.mockResolvedValueOnce(null);
}

/** Stub rolePermission.findFirst → permission found */
function stubPermFound(code: string) {
  mockRolePermFindFirst.mockResolvedValueOnce({ permission: { code } });
}

/** Stub rolePermission.findFirst → no match */
function stubPermDenied() {
  mockRolePermFindFirst.mockResolvedValueOnce(null);
}

// ── Tests ──

describe("RBAC Permission Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── hasPermission ──

  describe("hasPermission", () => {
    it("should grant platform admin all permissions without DB lookup", async () => {
      const ctx = makeCtx({ platformRole: "ADMIN" });

      const result = await hasPermission(ctx, "orders:create");

      expect(result).toBe(true);
      expect(mockUserFindUnique).not.toHaveBeenCalled();
      expect(mockRolePermFindFirst).not.toHaveBeenCalled();
    });

    it("should grant permission when user role has matching rolePermission", async () => {
      const ctx = makeCtx();
      stubUser("role-hotel-admin");
      stubPermFound("orders:create");

      const result = await hasPermission(ctx, "orders:create");

      expect(result).toBe(true);
    });

    it("should deny permission when user role lacks matching rolePermission", async () => {
      const ctx = makeCtx();
      stubUser("role-hotel-procurement");
      stubPermDenied();

      const result = await hasPermission(ctx, "orders:approve");

      expect(result).toBe(false);
    });

    it("should deny permission when user is not found", async () => {
      const ctx = makeCtx({ userId: "nonexistent-user" });
      stubUserNotFound();

      const result = await hasPermission(ctx, "orders:create");

      expect(result).toBe(false);
      expect(mockRolePermFindFirst).not.toHaveBeenCalled();
    });

    it("should deny permission for unknown role with no rolePermission entries", async () => {
      const ctx = makeCtx();
      stubUser("role-unknown");
      stubPermDenied();

      const result = await hasPermission(ctx, "invoices:read");

      expect(result).toBe(false);
    });

    it("should check exact permission code match", async () => {
      const ctx = makeCtx();
      stubUser("role-1");
      stubPermFound("orders:read");

      const result = await hasPermission(ctx, "orders:read");

      expect(result).toBe(true);
    });

    it("should deny partial permission code match", async () => {
      const ctx = makeCtx();
      stubUser("role-1");
      stubPermDenied();

      const result = await hasPermission(ctx, "orders:read:detail");

      expect(result).toBe(false);
    });

    it("should deny wildcard-style permission patterns (no wildcard support)", async () => {
      const ctx = makeCtx();
      stubUser("role-1");
      stubPermDenied();

      const result = await hasPermission(ctx, "orders:*");

      expect(result).toBe(false);
    });

    it("should treat empty permission code as a normal lookup (denied if no match)", async () => {
      const ctx = makeCtx();
      stubUser("role-1");
      stubPermDenied();

      const result = await hasPermission(ctx, "");

      expect(result).toBe(false);
    });

    it("should pass correct arguments to rolePermission.findFirst", async () => {
      const ctx = makeCtx();
      stubUser("role-hotel-admin");
      stubPermFound("orders:create");

      await hasPermission(ctx, "orders:create");

      expect(mockRolePermFindFirst).toHaveBeenCalledWith({
        where: {
          roleId: "role-hotel-admin",
          permission: { code: "orders:create" },
        },
      });
    });
  });

  // ── requirePermission ──

  describe("requirePermission", () => {
    it("should not throw when user has required permission", async () => {
      const ctx = makeCtx();
      stubUser("role-hotel-admin");
      stubPermFound("orders:create");

      await expect(
        requirePermission(ctx, "orders:create")
      ).resolves.toBeUndefined();
    });

    it("should throw PermissionDeniedError when user lacks permission", async () => {
      const ctx = makeCtx();
      stubUser("role-hotel-procurement");
      stubPermDenied();

      await expect(
        requirePermission(ctx, "orders:approve")
      ).rejects.toThrow(PermissionDeniedError);
    });

    it("should throw PermissionDeniedError with descriptive message", async () => {
      const ctx = makeCtx();
      stubUser("role-hotel-procurement");
      stubPermDenied();

      try {
        await requirePermission(ctx, "invoices:issue");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(PermissionDeniedError);
        expect((err as Error).message).toContain("invoices:issue");
      }
    });

    it("should not throw for platform admin even without rolePermission", async () => {
      const ctx = makeCtx({ platformRole: "ADMIN" });

      await expect(
        requirePermission(ctx, "admin:manage_tenants")
      ).resolves.toBeUndefined();
    });

    it("should throw for non-admin user when user not found in DB", async () => {
      const ctx = makeCtx({ userId: "ghost-user" });
      stubUserNotFound();

      await expect(
        requirePermission(ctx, "orders:create")
      ).rejects.toThrow(PermissionDeniedError);
    });
  });

  // ── requireAnyPermission ──

  describe("requireAnyPermission", () => {
    it("should not throw when user has at least one of the listed permissions", async () => {
      const ctx = makeCtx();
      // Promise.all runs hasPermission calls in parallel.
      // Each hasPermission call: user.findUnique → rolePermission.findFirst
      // We need 2 user lookups + 2 permission lookups (4 total on mockUserFindUnique, but
      // they share the mock). Since Promise.all is parallel, order is non-deterministic.
      // Safest: use .mockResolved (persistent) for user lookup so both calls succeed.
      mockUserFindUnique.mockResolvedValue({ roleId: "role-1" });
      // First permission check → denied, second → granted
      mockRolePermFindFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ permission: { code: "orders:read" } });

      await expect(
        requireAnyPermission(ctx, ["orders:create", "orders:read"])
      ).resolves.toBeUndefined();
    });

    it("should throw when user has none of the listed permissions", async () => {
      const ctx = makeCtx();
      // Both permission checks → denied
      mockUserFindUnique.mockResolvedValue({ roleId: "role-1" });
      mockRolePermFindFirst
        .mockResolvedValue(null);

      await expect(
        requireAnyPermission(ctx, ["orders:create", "orders:approve"])
      ).rejects.toThrow(PermissionDeniedError);
    });

    it("should throw with message listing all required permissions", async () => {
      const ctx = makeCtx();
      mockUserFindUnique.mockResolvedValue({ roleId: "role-1" });
      mockRolePermFindFirst.mockResolvedValue(null);

      try {
        await requireAnyPermission(ctx, ["perm:a", "perm:b"]);
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(PermissionDeniedError);
        expect((err as Error).message).toContain("perm:a");
        expect((err as Error).message).toContain("perm:b");
      }
    });

    it("should not throw for platform admin without any DB lookups", async () => {
      const ctx = makeCtx({ platformRole: "ADMIN" });

      await expect(
        requireAnyPermission(ctx, ["anything:at_all", "another:perm"])
      ).resolves.toBeUndefined();

      expect(mockUserFindUnique).not.toHaveBeenCalled();
    });

    it("should throw for empty permission list (no permissions to satisfy)", async () => {
      const ctx = makeCtx();

      // Promise.all([]) → [], [].some(Boolean) → false → throws
      await expect(
        requireAnyPermission(ctx, [])
      ).rejects.toThrow(PermissionDeniedError);
    });
  });

  // ── getUserPermissions ──

  describe("getUserPermissions", () => {
    it("should return all permission codes for platform admin", async () => {
      const ctx = makeCtx({ platformRole: "ADMIN" });
      mockPermFindMany.mockResolvedValueOnce([
        { code: "orders:create" },
        { code: "orders:read" },
        { code: "invoices:read" },
        { code: "invoices:issue" },
      ]);

      const perms = await getUserPermissions(ctx);

      expect(perms).toEqual([
        "orders:create",
        "orders:read",
        "invoices:read",
        "invoices:issue",
      ]);
      expect(mockPermFindMany).toHaveBeenCalledTimes(1);
    });

    it("should return role-specific permissions for non-admin user", async () => {
      const ctx = makeCtx();
      stubUser("role-hotel-admin");
      mockRolePermFindMany.mockResolvedValueOnce([
        { permission: { code: "orders:create" } },
        { permission: { code: "orders:read" } },
        { permission: { code: "orders:approve" } },
      ]);

      const perms = await getUserPermissions(ctx);

      expect(perms).toEqual(["orders:create", "orders:read", "orders:approve"]);
    });

    it("should return empty array when user not found", async () => {
      const ctx = makeCtx({ userId: "nonexistent" });
      mockUserFindUnique.mockResolvedValueOnce(null);

      const perms = await getUserPermissions(ctx);

      expect(perms).toEqual([]);
    });

    it("should return empty array when user has no role permissions", async () => {
      const ctx = makeCtx();
      stubUser("role-empty");
      mockRolePermFindMany.mockResolvedValueOnce([]);

      const perms = await getUserPermissions(ctx);

      expect(perms).toEqual([]);
    });

    it("should return all permission codes as-is from DB (no client-side dedup)", async () => {
      const ctx = makeCtx({ platformRole: "ADMIN" });
      mockPermFindMany.mockResolvedValueOnce([
        { code: "orders:create" },
        { code: "orders:read" },
        { code: "orders:create" },
        { code: "orders:read" },
      ]);

      const perms = await getUserPermissions(ctx);

      expect(perms).toHaveLength(4);
      expect(perms).toContain("orders:create");
      expect(perms).toContain("orders:read");
    });
  });

  // ── PermissionDeniedError ──

  describe("PermissionDeniedError", () => {
    it("should be an instance of Error", () => {
      const err = new PermissionDeniedError();
      expect(err).toBeInstanceOf(Error);
      expect(err.name).toBe("PermissionDeniedError");
    });

    it("should default message to 'Permission denied'", () => {
      const err = new PermissionDeniedError();
      expect(err.message).toBe("Permission denied");
    });

    it("should accept custom message", () => {
      const err = new PermissionDeniedError("Custom denial reason");
      expect(err.message).toBe("Custom denial reason");
    });
  });

  // ── Tenant isolation ──

  describe("Tenant isolation", () => {
    it("should use userId from context for user lookup (not tenantId)", async () => {
      const ctx = makeCtx({
        userId: "user-tenant-A",
        tenantId: "tenant-A",
      });
      stubUser("role-1");
      stubPermFound("orders:create");

      await hasPermission(ctx, "orders:create");

      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: "user-tenant-A" },
        select: { roleId: true },
      });
    });

    it("should not filter by tenantId in RBAC (tenant scope enforced elsewhere)", async () => {
      const ctx = makeCtx({
        userId: "user-cross-tenant",
        tenantId: "tenant-B",
      });
      stubUserNotFound();

      await hasPermission(ctx, "orders:create");

      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: "user-cross-tenant" },
        select: { roleId: true },
      });
    });
  });

  // ── Edge cases ──

  describe("Edge cases", () => {
    it("should handle case-sensitive permission codes", async () => {
      const ctx = makeCtx();
      stubUser("role-1");
      stubPermDenied();

      const result = await hasPermission(ctx, "ORDERS:CREATE");

      expect(result).toBe(false);
    });

    it("should handle permission codes with multiple colons", async () => {
      const ctx = makeCtx();
      stubUser("role-1");
      stubPermFound("orders:items:create");

      const result = await hasPermission(ctx, "orders:items:create");

      expect(result).toBe(true);
    });

    it("should handle very long permission codes", async () => {
      const ctx = makeCtx();
      const longCode = "a".repeat(200);
      stubUser("role-1");
      stubPermDenied();

      const result = await hasPermission(ctx, longCode);

      expect(result).toBe(false);
    });

    it("should handle special characters in permission code", async () => {
      const ctx = makeCtx();
      stubUser("role-1");
      stubPermDenied();

      const result = await hasPermission(ctx, "orders/create&delete");

      expect(result).toBe(false);
    });

    it("requireAnyPermission should handle single-element array with match", async () => {
      const ctx = makeCtx();
      stubUser("role-1");
      stubPermFound("orders:read");

      await expect(
        requireAnyPermission(ctx, ["orders:read"])
      ).resolves.toBeUndefined();
    });

    it("requireAnyPermission should handle single-element array with no match", async () => {
      const ctx = makeCtx();
      stubUser("role-1");
      stubPermDenied();

      await expect(
        requireAnyPermission(ctx, ["orders:write"])
      ).rejects.toThrow(PermissionDeniedError);
    });
  });
});
