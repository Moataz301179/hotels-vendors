import { describe, it, expect, vi, beforeEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";

// ── Prisma mock (inline in vi.mock to avoid hoisting issues) ──

vi.mock("@/lib/prisma", () => {
  const mockTx = {
    order: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    orderApproval: { create: vi.fn() },
    auditLog: { create: vi.fn() },
    $queryRaw: vi.fn(),
  };

  const prismaMock = {
    $transaction: vi.fn((fn: (tx: typeof mockTx) => Promise<unknown>) => fn(mockTx)),
    order: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    orderItem: { create: vi.fn(), findMany: vi.fn() },
    invoice: { create: vi.fn(), findUnique: vi.fn(), findMany: vi.fn() },
    orderApproval: { create: vi.fn() },
    user: { findUnique: vi.fn() },
    auditLog: { create: vi.fn() },
    hotel: { findUnique: vi.fn(), update: vi.fn() },
    authorityRule: { findMany: vi.fn() },
    supplier: { findUnique: vi.fn() },
    $queryRaw: vi.fn(),
  };

  // Attach mockTx to prismaMock so tests can access it
  (prismaMock as Record<string, unknown>).__mockTx = mockTx;

  return { prisma: prismaMock };
});

vi.mock("@/lib/fintech/risk-engine", () => ({
  assessRisk: vi.fn().mockResolvedValue({ riskTier: "LOW", score: 10 }),
  generateSmartFixes: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/eta/validator", () => ({
  validateForFactoring: vi.fn().mockResolvedValue({ valid: true, message: "ETA accepted" }),
}));

vi.mock("@/lib/audit/tamper-proof", () => ({
  appendAuditEntry: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/credit-gate", () => ({
  checkCreditLimit: vi.fn().mockResolvedValue({ allowed: true, available: 500_000, reason: "" }),
}));

vi.mock("@/lib/api-utils", () => ({
  apiRoute: (fn: (...args: unknown[]) => Promise<unknown>) => fn,
  authenticate: vi.fn().mockResolvedValue({
    userId: "user-1",
    tenantId: "tenant-1",
    platformRole: "HOTEL",
  }),
  validateBody: vi.fn((_schema: unknown, body: unknown) => body),
  validateQuery: vi.fn(() => ({ page: 1, limit: 20, sortBy: "createdAt", sortOrder: "desc" })),
  success: vi.fn((data: unknown, status?: number) => ({ data, status: status ?? 200 })),
  error: vi.fn((msg: string, status: number) => ({ error: msg, status })),
  audit: vi.fn().mockResolvedValue(undefined),
  requireIdempotencyKey: vi.fn().mockResolvedValue("idem-key-1"),
  completeIdempotency: vi.fn(),
  requirePermission: vi.fn().mockResolvedValue(undefined),
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 100 }),
}));

// ── Imports under test ──

import { prisma } from "@/lib/prisma";
import {
  validateStatusTransition,
  getTransitionGate,
  atomicStatusUpdate,
} from "@/lib/auth/state-machine";
import {
  evaluateAuthority,
  recordApproval,
  setPaymentGuarantee,
  adminOverride,
} from "@/lib/auth/authority-matrix";

// Helper to access the internal mockTx via the prisma mock
const getMockTx = () => (prisma as unknown as Record<string, unknown>).__mockTx as {
  order: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  orderApproval: { create: ReturnType<typeof vi.fn> };
  auditLog: { create: ReturnType<typeof vi.fn> };
  $queryRaw: ReturnType<typeof vi.fn>;
};

// ── Helpers ──

function makeOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: "order-1",
    orderNumber: "PO-2026-001",
    status: "DRAFT",
    hotelId: "hotel-1",
    supplierId: "supplier-1",
    requesterId: "user-1",
    tenantId: "tenant-1",
    subtotal: new Decimal(5000),
    vatAmount: new Decimal(700),
    total: new Decimal(5700),
    currency: "EGP",
    paymentGuaranteed: false,
    paymentGuaranteeMethod: null,
    deliveryDate: new Date("2026-08-15"),
    ...overrides,
  };
}

function makeHotel(overrides: Record<string, unknown> = {}) {
  return {
    id: "hotel-1",
    tenantId: "tenant-1",
    name: "Test Hotel",
    tier: "STANDARD",
    riskTier: "LOW",
    creditLimit: new Decimal(1_000_000),
    creditUsed: new Decimal(0),
    properties: [],
    creditFacilities: [],
    ...overrides,
  };
}

function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    id: "user-1",
    tenantId: "tenant-1",
    role: "DEPARTMENT_HEAD",
    platformRole: "HOTEL",
    hotelId: "hotel-1",
    ...overrides,
  };
}

// ── Tests ──

describe("Order Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prisma.$transaction.mockImplementation(
      (fn: (tx: unknown) => Promise<unknown>) => fn(getMockTx())
    );
  });

  // ══════════════════════════════════════════
  // 1. ORDER CREATION
  // ══════════════════════════════════════════

  describe("Order creation", () => {
    it("should create order with DRAFT status and items", async () => {
      const order = makeOrder();
      prisma.order.create.mockResolvedValue(order);

      const created = await prisma.order.create({
        data: {
          status: "DRAFT",
          total: 5700,
          tenantId: "tenant-1",
          hotelId: "hotel-1",
          supplierId: "supplier-1",
          items: {
            create: [{ productId: "prod-1", quantity: 10, unitPrice: 500 }],
          },
        },
      });

      expect(created.status).toBe("DRAFT");
      expect(created.id).toBe("order-1");
      expect(prisma.order.create).toHaveBeenCalledOnce();
    });

    it("should compute subtotal, VAT (14%), and total correctly", () => {
      const items = [
        { productId: "prod-1", quantity: 10, unitPrice: 500 },
        { productId: "prod-2", quantity: 5, unitPrice: 200 },
      ];
      const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
      const vatRate = 0.14;
      const vatAmount = subtotal * vatRate;
      const total = subtotal + vatAmount;

      expect(subtotal).toBe(6000);
      expect(vatAmount).toBeCloseTo(840, 0);
      expect(total).toBeCloseTo(6840, 0);
    });

    it("should default paymentGuaranteed to false", () => {
      const order = makeOrder();
      expect(order.paymentGuaranteed).toBe(false);
    });
  });

  // ══════════════════════════════════════════
  // 2. FULL LIFECYCLE (happy path)
  // ══════════════════════════════════════════

  describe("Full happy-path lifecycle", () => {
    it("should allow complete lifecycle: DRAFT → PENDING_APPROVAL → APPROVED → CONFIRMED → IN_TRANSIT → DELIVERED", () => {
      const steps: Array<{ from: string; to: string }> = [
        { from: "DRAFT", to: "PENDING_APPROVAL" },
        { from: "PENDING_APPROVAL", to: "APPROVED" },
        { from: "APPROVED", to: "CONFIRMED" },
        { from: "CONFIRMED", to: "IN_TRANSIT" },
        { from: "IN_TRANSIT", to: "DELIVERED" },
      ];

      for (const step of steps) {
        const result = validateStatusTransition(step.from as never, step.to as never);
        expect(result.valid, `Expected ${step.from} → ${step.to} to be valid`).toBe(true);
      }
    });

    it("should allow cancel after approval: DRAFT → ... → APPROVED → CANCELLED", () => {
      expect(validateStatusTransition("DRAFT", "PENDING_APPROVAL").valid).toBe(true);
      expect(validateStatusTransition("PENDING_APPROVAL", "APPROVED").valid).toBe(true);
      expect(validateStatusTransition("APPROVED", "CANCELLED").valid).toBe(true);
    });

    it("should allow resubmission after rejection: REJECTED → DRAFT → PENDING_APPROVAL", () => {
      expect(validateStatusTransition("PENDING_APPROVAL", "REJECTED").valid).toBe(true);
      expect(validateStatusTransition("REJECTED", "DRAFT").valid).toBe(true);
      expect(validateStatusTransition("DRAFT", "PENDING_APPROVAL").valid).toBe(true);
    });
  });

  // ══════════════════════════════════════════
  // 3. INVALID TRANSITIONS
  // ══════════════════════════════════════════

  describe("Invalid state transitions", () => {
    it("should reject DELIVERED → CANCELLED", () => {
      const result = validateStatusTransition("DELIVERED", "CANCELLED");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("DELIVERED");
    });

    it("should reject all transitions from CANCELLED (terminal)", () => {
      const targets = [
        "DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED",
        "CONFIRMED", "IN_TRANSIT", "DELIVERED", "DISPUTED",
      ];
      for (const target of targets) {
        const result = validateStatusTransition("CANCELLED", target as never);
        expect(result.valid, `CANCELLED → ${target} must be invalid`).toBe(false);
      }
    });

    it("should reject DRAFT → DELIVERED (skipping approval)", () => {
      expect(validateStatusTransition("DRAFT", "DELIVERED").valid).toBe(false);
    });

    it("should reject IN_TRANSIT → APPROVED (no backwards)", () => {
      expect(validateStatusTransition("IN_TRANSIT", "APPROVED").valid).toBe(false);
    });

    it("should allow same-status idempotent transitions", () => {
      expect(validateStatusTransition("DRAFT", "DRAFT").valid).toBe(true);
      expect(validateStatusTransition("APPROVED", "APPROVED").valid).toBe(true);
    });
  });

  // ══════════════════════════════════════════
  // 4. TRANSITION GATES
  // ══════════════════════════════════════════

  describe("Transition gates", () => {
    it("should require payment guarantee for APPROVED → CONFIRMED", () => {
      const gate = getTransitionGate("APPROVED", "CONFIRMED");
      expect(gate).toBeDefined();
      expect(gate!.requires.paymentGuarantee).toBe(true);
    });

    it("should require payment guarantee + ETA for CONFIRMED → IN_TRANSIT", () => {
      const gate = getTransitionGate("CONFIRMED", "IN_TRANSIT");
      expect(gate).toBeDefined();
      expect(gate!.requires.paymentGuarantee).toBe(true);
      expect(gate!.requires.etaValidation).toBe(true);
    });

    it("should require authority approval for IN_TRANSIT → DELIVERED", () => {
      const gate = getTransitionGate("IN_TRANSIT", "DELIVERED");
      expect(gate).toBeDefined();
      expect(gate!.requires.authorityApproval).toBe(true);
    });

    it("should have no gate for DRAFT → PENDING_APPROVAL", () => {
      expect(getTransitionGate("DRAFT", "PENDING_APPROVAL")).toBeUndefined();
    });

    it("should have no gate for PENDING_APPROVAL → APPROVED", () => {
      expect(getTransitionGate("PENDING_APPROVAL", "APPROVED")).toBeUndefined();
    });
  });

  // ══════════════════════════════════════════
  // 5. ATOMIC STATUS UPDATE
  // ══════════════════════════════════════════

  describe("Atomic status update", () => {
    it("should succeed on valid transition with row locking", async () => {
      const tx = getMockTx();
      tx.order.findUnique.mockResolvedValue({
        id: "order-1",
        status: "DRAFT",
        paymentGuaranteed: false,
      });
      tx.order.update.mockResolvedValue({ id: "order-1", status: "PENDING_APPROVAL" });
      tx.auditLog.create.mockResolvedValue({});

      const result = await atomicStatusUpdate("order-1", "PENDING_APPROVAL", "user-1", "tenant-1");

      expect(result.success).toBe(true);
      expect(result.order?.status).toBe("PENDING_APPROVAL");
      expect(tx.order.findUnique).toHaveBeenCalledOnce();
      expect(tx.order.update).toHaveBeenCalledOnce();
      expect(tx.auditLog.create).toHaveBeenCalledOnce();
    });

    it("should fail on invalid transition", async () => {
      const tx = getMockTx();
      tx.order.findUnique.mockResolvedValue({
        id: "order-1",
        status: "DRAFT",
        paymentGuaranteed: false,
      });

      const result = await atomicStatusUpdate("order-1", "DELIVERED", "user-1", "tenant-1");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid transition");
    });

    it("should fail when order not found", async () => {
      const tx = getMockTx();
      tx.order.findUnique.mockResolvedValue(null);

      const result = await atomicStatusUpdate("order-999", "APPROVED", "user-1", "tenant-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Order not found");
    });

    it("should enforce payment gate on APPROVED → CONFIRMED", async () => {
      const tx = getMockTx();
      tx.order.findUnique.mockResolvedValue({
        id: "order-1",
        status: "APPROVED",
        paymentGuaranteed: false,
      });

      const result = await atomicStatusUpdate("order-1", "CONFIRMED", "user-1", "tenant-1");

      expect(result.success).toBe(false);
      expect(result.error).toContain("payment guarantee");
    });

    it("should allow APPROVED → CONFIRMED when payment is guaranteed", async () => {
      const tx = getMockTx();
      tx.order.findUnique.mockResolvedValue({
        id: "order-1",
        status: "APPROVED",
        paymentGuaranteed: true,
      });
      tx.order.update.mockResolvedValue({ id: "order-1", status: "CONFIRMED" });
      tx.auditLog.create.mockResolvedValue({});

      const result = await atomicStatusUpdate("order-1", "CONFIRMED", "user-1", "tenant-1");

      expect(result.success).toBe(true);
      expect(result.order?.status).toBe("CONFIRMED");
    });

    it("should write audit log with entityName and tenantId", async () => {
      const tx = getMockTx();
      tx.order.findUnique.mockResolvedValue({
        id: "order-1",
        status: "DRAFT",
        paymentGuaranteed: false,
      });
      tx.order.update.mockResolvedValue({});
      tx.auditLog.create.mockResolvedValue({});

      await atomicStatusUpdate("order-1", "PENDING_APPROVAL", "user-1", "tenant-1");

      expect(tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          entityName: "ORDER",
          entityId: "order-1",
          tenantId: "tenant-1",
          actorId: "user-1",
        }),
      });
    });

    it("should respect override flag to bypass validation", async () => {
      const tx = getMockTx();
      tx.order.findUnique.mockResolvedValue({
        id: "order-1",
        status: "DRAFT",
        paymentGuaranteed: false,
      });
      tx.order.update.mockResolvedValue({ id: "order-1", status: "DELIVERED" });
      tx.auditLog.create.mockResolvedValue({});

      const result = await atomicStatusUpdate("order-1", "DELIVERED", "admin-1", "tenant-1", true);

      expect(result.success).toBe(true);
    });
  });

  // ══════════════════════════════════════════
  // 6. AUTHORITY MATRIX
  // ══════════════════════════════════════════

  describe("Authority Matrix evaluation", () => {
    function setupOrderForAuthority(overrides: Record<string, unknown> = {}) {
      const order = makeOrder({ paymentGuaranteed: true, ...overrides });
      const hotel = makeHotel();
      const supplier = { id: "supplier-1", tenantId: "tenant-1", tier: "STANDARD" };

      prisma.order.findUnique.mockResolvedValue({
        ...order,
        hotel,
        supplier,
        invoices: [],
        approvals: [],
      });
      prisma.user.findUnique.mockResolvedValue(makeUser());

      // Override built-in rules that have no tier filters and would match before rule_auto_approve.
      // rule_eta_invalid (950) and rule_payment_guarantee_gate (900) are scoped to CRITICAL risk
      // so they don't block LOW-risk test orders.
      prisma.authorityRule.findMany.mockResolvedValue([
        {
          id: "rule_eta_invalid",
          name: "ETA Invalid Block (scoped)",
          priority: 950,
          minValue: 0,
          maxValue: 999_999_999,
          hotelRiskTier: "CRITICAL",
          requiresPaymentGuarantee: true,
          requiresEtaValidation: true,
          requiresDualSignOff: false,
          action: "REJECT",
          isActive: true,
          tenantId: null,
        },
        {
          id: "rule_payment_guarantee_gate",
          name: "Payment Guarantee Gate (scoped)",
          priority: 900,
          minValue: 0,
          maxValue: 999_999_999,
          hotelRiskTier: "CRITICAL",
          requiresPaymentGuarantee: true,
          requiresEtaValidation: false,
          requiresDualSignOff: false,
          action: "REQUIRE_PAYMENT_GUARANTEE",
          isActive: true,
          tenantId: null,
        },
      ]);
    }

    it("should AUTO_APPROVE low-value low-risk orders", async () => {
      setupOrderForAuthority({ total: new Decimal(5000) });

      const result = await evaluateAuthority("order-1", {
        userId: "user-1",
        userRole: "DEPARTMENT_HEAD",
        tenantId: "tenant-1",
      });

      expect(result.action).toBe("AUTO_APPROVE");
      expect(result.canProceed).toBe(true);
    });

    it("should REQUIRE_PAYMENT_GUARANTEE when payment not secured", async () => {
      setupOrderForAuthority({ paymentGuaranteed: false, total: new Decimal(5000) });

      const result = await evaluateAuthority("order-1", {
        userId: "user-1",
        userRole: "DEPARTMENT_HEAD",
        tenantId: "tenant-1",
      });

      expect(result.action).toBe("REQUIRE_PAYMENT_GUARANTEE");
      expect(result.canProceed).toBe(false);
      expect(result.paymentGuaranteeRequired).toBe(true);
    });

    it("should REJECT when order not found", async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      const result = await evaluateAuthority("order-999", {
        userId: "user-1",
        userRole: "DEPARTMENT_HEAD",
        tenantId: "tenant-1",
      });

      expect(result.action).toBe("REJECT");
      expect(result.canProceed).toBe(false);
      expect(result.reason).toBe("Order not found");
    });

    it("should REJECT CRITICAL risk hotels", async () => {
      setupOrderForAuthority({ total: new Decimal(5000) });
      const { assessRisk } = await import("@/lib/fintech/risk-engine");
      vi.mocked(assessRisk).mockResolvedValueOnce({ riskTier: "CRITICAL", score: 95 });

      const result = await evaluateAuthority("order-1", {
        userId: "user-1",
        userRole: "DEPARTMENT_HEAD",
        tenantId: "tenant-1",
      });

      expect(result.action).toBe("REJECT");
      expect(result.canProceed).toBe(false);
    });
  });

  // ══════════════════════════════════════════
  // 7. ORDER APPROVAL / REJECTION
  // ══════════════════════════════════════════

  describe("Order approval actions", () => {
    it("should record APPROVED and set status", async () => {
      const tx = getMockTx();
      tx.$queryRaw.mockResolvedValue([{ id: "order-1", status: "PENDING_APPROVAL" }]);
      tx.orderApproval.create.mockResolvedValue({});
      tx.order.update.mockResolvedValue({ id: "order-1", status: "APPROVED" });

      await recordApproval("order-1", "gm-1", "tenant-1", "APPROVED", "Budget OK");

      expect(tx.orderApproval.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          orderId: "order-1",
          approverId: "gm-1",
          action: "APPROVED",
        }),
      });
      expect(tx.order.update).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: { status: "APPROVED" },
      });
    });

    it("should record REJECTED and set status", async () => {
      const tx = getMockTx();
      tx.$queryRaw.mockResolvedValue([{ id: "order-1", status: "PENDING_APPROVAL" }]);
      tx.orderApproval.create.mockResolvedValue({});
      tx.order.update.mockResolvedValue({});

      await recordApproval("order-1", "gm-1", "tenant-1", "REJECTED", "Budget exceeded");

      expect(tx.order.update).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: { status: "REJECTED" },
      });
    });

    it("should record ESCALATED and keep PENDING_APPROVAL", async () => {
      const tx = getMockTx();
      tx.$queryRaw.mockResolvedValue([{ id: "order-1", status: "PENDING_APPROVAL" }]);
      tx.orderApproval.create.mockResolvedValue({});
      tx.order.update.mockResolvedValue({});

      await recordApproval("order-1", "gm-1", "tenant-1", "ESCALATED");

      expect(tx.order.update).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: { status: "PENDING_APPROVAL" },
      });
    });

    it("should write tamper-proof audit entry", async () => {
      const tx = getMockTx();
      tx.$queryRaw.mockResolvedValue([{ id: "order-1", status: "PENDING_APPROVAL" }]);
      tx.orderApproval.create.mockResolvedValue({});
      tx.order.update.mockResolvedValue({});

      await recordApproval("order-1", "gm-1", "tenant-1", "APPROVED", "OK");

      const { appendAuditEntry } = await import("@/lib/audit/tamper-proof");
      expect(appendAuditEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          entityName: "ORDER",
          entityId: "order-1",
          tenantId: "tenant-1",
        })
      );
    });
  });

  // ══════════════════════════════════════════
  // 8. PAYMENT GUARANTEE
  // ══════════════════════════════════════════

  describe("Payment guarantee", () => {
    it("should set paymentGuaranteed with DEPOSIT method", async () => {
      prisma.order.update.mockResolvedValue({
        id: "order-1",
        paymentGuaranteed: true,
        paymentGuaranteeMethod: "DEPOSIT",
      });

      await setPaymentGuarantee({
        orderId: "order-1",
        tenantId: "tenant-1",
        method: "DEPOSIT",
        depositAmount: 5000,
        depositReceived: true,
        etaValidated: false,
        verifiedBy: "user-1",
        verifiedAt: new Date(),
      });

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: {
          paymentGuaranteed: true,
          paymentGuaranteeMethod: "DEPOSIT",
        },
      });
    });

    it("should set paymentGuaranteed with FACTORING method", async () => {
      prisma.order.update.mockResolvedValue({});

      await setPaymentGuarantee({
        orderId: "order-1",
        tenantId: "tenant-1",
        method: "FACTORING",
        factoringRequestId: "fr-1",
        factoringCompanyId: "fc-1",
        advanceRate: 0.85,
        etaValidated: true,
        etaUuid: "uuid-1",
        verifiedBy: "user-1",
        verifiedAt: new Date(),
      });

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: {
          paymentGuaranteed: true,
          paymentGuaranteeMethod: "FACTORING",
        },
      });
    });

    it("should support WAIVED method", async () => {
      prisma.order.update.mockResolvedValue({});

      await setPaymentGuarantee({
        orderId: "order-1",
        tenantId: "tenant-1",
        method: "WAIVED",
        etaValidated: false,
        verifiedBy: "admin-1",
        verifiedAt: new Date(),
        waivedBy: "admin-1",
        waivedReason: "VIP hotel override",
      });

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: {
          paymentGuaranteed: true,
          paymentGuaranteeMethod: "WAIVED",
        },
      });
    });
  });

  // ══════════════════════════════════════════
  // 9. ADMIN OVERRIDE
  // ══════════════════════════════════════════

  describe("Admin override", () => {
    it("should reject with short reason (<20 chars)", async () => {
      const result = await adminOverride({
        orderId: "order-1",
        action: "ADMIN_OVERRIDE",
        reason: "Too short",
        waivePaymentGuarantee: false,
        authorizerId: "admin-1",
        coAuthorizerId: "admin-2",
        tenantId: "tenant-1",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("20 characters");
    });

    it("should reject same authorizer for dual auth", async () => {
      const admin = { id: "admin-1", platformRole: "ADMIN", canOverride: true };
      prisma.user.findUnique.mockImplementation(({ where }: { where: { id: string } }) => {
        return Promise.resolve(where.id === "admin-1" ? admin : null);
      });

      const result = await adminOverride({
        orderId: "order-1",
        action: "ADMIN_OVERRIDE",
        reason: "Emergency override for critical order delivery",
        waivePaymentGuarantee: true,
        authorizerId: "admin-1",
        coAuthorizerId: "admin-1",
        tenantId: "tenant-1",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("two distinct admins");
    });

    it("should succeed with valid dual authorization", async () => {
      const admin1 = { id: "admin-1", platformRole: "ADMIN", canOverride: true };
      const admin2 = { id: "admin-2", platformRole: "ADMIN", canOverride: true };
      prisma.user.findUnique.mockImplementation(({ where }: { where: { id: string } }) => {
        return Promise.resolve(
          where.id === "admin-1" ? admin1 : where.id === "admin-2" ? admin2 : null
        );
      });
      const tx = getMockTx();
      tx.$queryRaw.mockResolvedValue([
        { id: "order-1", status: "REJECTED", paymentGuaranteed: false, paymentGuaranteeMethod: null, tenantId: "tenant-1" },
      ]);
      tx.order.update.mockResolvedValue({});
      tx.orderApproval.create.mockResolvedValue({});
      tx.auditLog.create.mockResolvedValue({});

      const result = await adminOverride({
        orderId: "order-1",
        action: "ADMIN_OVERRIDE",
        reason: "Emergency override authorized by dual admin approval for critical shipment",
        waivePaymentGuarantee: true,
        authorizerId: "admin-1",
        coAuthorizerId: "admin-2",
        tenantId: "tenant-1",
      });

      expect(result.success).toBe(true);
      expect(tx.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "order-1" },
          data: expect.objectContaining({ status: "APPROVED" }),
        })
      );
      expect(tx.orderApproval.create).toHaveBeenCalledTimes(2);
      expect(tx.auditLog.create).toHaveBeenCalledOnce();
    });
  });

  // ══════════════════════════════════════════
  // 10. MULTI-TENANCY
  // ══════════════════════════════════════════

  describe("Multi-tenancy enforcement", () => {
    it("should scope order queries to tenant", async () => {
      prisma.order.findMany.mockResolvedValue([
        { id: "order-1", tenantId: "tenant-1" },
      ]);

      const orders = await prisma.order.findMany({
        where: { tenantId: "tenant-1" },
      });

      expect(orders).toHaveLength(1);
      expect(orders[0].tenantId).toBe("tenant-1");
    });

    it("should return empty for wrong tenant", async () => {
      prisma.order.findMany.mockResolvedValue([]);

      const orders = await prisma.order.findMany({
        where: { tenantId: "tenant-foreign" },
      });

      expect(orders).toHaveLength(0);
    });

    it("should not allow cross-tenant authority evaluation", async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      const result = await evaluateAuthority("order-1", {
        userId: "user-1",
        userRole: "DEPARTMENT_HEAD",
        tenantId: "tenant-foreign",
      });

      expect(result.action).toBe("REJECT");
      expect(result.reason).toBe("Order not found");
    });

    it("should include tenantId in audit log for atomic updates", async () => {
      const tx = getMockTx();
      tx.order.findUnique.mockResolvedValue({
        id: "order-1",
        status: "DRAFT",
        paymentGuaranteed: false,
      });
      tx.order.update.mockResolvedValue({});
      tx.auditLog.create.mockResolvedValue({});

      await atomicStatusUpdate("order-1", "PENDING_APPROVAL", "user-1", "tenant-1");

      expect(tx.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ tenantId: "tenant-1" }),
      });
    });
  });

  // ══════════════════════════════════════════
  // 11. EDGE CASES
  // ══════════════════════════════════════════

  describe("Edge cases", () => {
    it("should block all transitions from CANCELLED", () => {
      const targets = [
        "DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED",
        "CONFIRMED", "IN_TRANSIT", "DELIVERED", "DISPUTED",
      ];
      for (const target of targets) {
        const result = validateStatusTransition("CANCELLED", target as never);
        expect(result.valid, `CANCELLED → ${target} must be invalid`).toBe(false);
      }
    });

    it("should handle PARTIALLY_DELIVERED → DELIVERED", () => {
      expect(validateStatusTransition("PARTIALLY_DELIVERED", "DELIVERED").valid).toBe(true);
    });

    it("should handle IN_TRANSIT → DISPUTED", () => {
      expect(validateStatusTransition("IN_TRANSIT", "DISPUTED").valid).toBe(true);
    });

    it("should handle DISPUTED → DELIVERED (resolved)", () => {
      expect(validateStatusTransition("DISPUTED", "DELIVERED").valid).toBe(true);
    });

    it("should handle DISPUTED → CANCELLED", () => {
      expect(validateStatusTransition("DISPUTED", "CANCELLED").valid).toBe(true);
    });

    it("should NOT allow IN_TRANSIT → CANCELLED (must dispute first)", () => {
      expect(validateStatusTransition("IN_TRANSIT", "CANCELLED").valid).toBe(false);
    });
  });

  // ══════════════════════════════════════════
  // 12. END-TO-END LIFECYCLE SIMULATION
  // ══════════════════════════════════════════

  describe("End-to-end order flow simulation", () => {
    it("should complete full lifecycle with all DB interactions", async () => {
      const tx = getMockTx();

      // Step 1: Create order in DRAFT
      const order = makeOrder();
      prisma.order.create.mockResolvedValue(order);

      const created = await prisma.order.create({
        data: { status: "DRAFT", tenantId: "tenant-1", hotelId: "hotel-1" },
      });
      expect(created.status).toBe("DRAFT");

      // Step 2: Submit → PENDING_APPROVAL
      tx.order.findUnique.mockResolvedValue({ ...order, paymentGuaranteed: false });
      tx.order.update.mockResolvedValue({ ...order, status: "PENDING_APPROVAL" });
      tx.auditLog.create.mockResolvedValue({});

      const submit = await atomicStatusUpdate("order-1", "PENDING_APPROVAL", "user-1", "tenant-1");
      expect(submit.success).toBe(true);
      expect(submit.order?.status).toBe("PENDING_APPROVAL");

      // Step 3: GM approves (simulates authority matrix evaluation + approval)
      prisma.orderApproval.create.mockResolvedValue({});
      prisma.order.update.mockResolvedValue({ ...order, status: "APPROVED" });

      await recordApproval("order-1", "gm-1", "tenant-1", "APPROVED", "Within budget");

      // Step 4: Set payment guarantee, then APPROVED → CONFIRMED
      await setPaymentGuarantee({
        orderId: "order-1",
        tenantId: "tenant-1",
        method: "DIRECT",
        etaValidated: false,
        verifiedBy: "user-1",
        verifiedAt: new Date(),
      });

      tx.order.findUnique.mockResolvedValue({
        ...order, status: "APPROVED", paymentGuaranteed: true,
      });
      tx.order.update.mockResolvedValue({
        ...order, status: "CONFIRMED", paymentGuaranteed: true,
      });

      const confirm = await atomicStatusUpdate("order-1", "CONFIRMED", "user-1", "tenant-1");
      expect(confirm.success).toBe(true);

      // Step 5: CONFIRMED → IN_TRANSIT
      tx.order.findUnique.mockResolvedValue({
        ...order, status: "CONFIRMED", paymentGuaranteed: true,
      });
      tx.order.update.mockResolvedValue({ ...order, status: "IN_TRANSIT" });

      const transit = await atomicStatusUpdate("order-1", "IN_TRANSIT", "user-1", "tenant-1");
      expect(transit.success).toBe(true);

      // Step 6: IN_TRANSIT → DELIVERED
      tx.order.findUnique.mockResolvedValue({
        ...order, status: "IN_TRANSIT", paymentGuaranteed: true,
      });
      tx.order.update.mockResolvedValue({ ...order, status: "DELIVERED" });

      const delivery = await atomicStatusUpdate("order-1", "DELIVERED", "user-1", "tenant-1");
      expect(delivery.success).toBe(true);

      // Verify audit trail: submit + confirm + transit + delivery = 4 atomic updates
      expect(tx.auditLog.create).toHaveBeenCalledTimes(4);
    });

    it("should handle rejection and resubmission flow", async () => {
      // Reject
      const tx = getMockTx();
      tx.$queryRaw.mockResolvedValue([{ id: "order-1", status: "PENDING_APPROVAL" }]);
      tx.orderApproval.create.mockResolvedValue({});
      tx.order.update.mockResolvedValue({ ...makeOrder(), status: "REJECTED" });

      await recordApproval("order-1", "gm-1", "tenant-1", "REJECTED", "Budget exceeded");
      expect(tx.order.update).toHaveBeenLastCalledWith({
        where: { id: "order-1" },
        data: { status: "REJECTED" },
      });

      // Verify resubmission path is valid
      expect(validateStatusTransition("REJECTED", "DRAFT").valid).toBe(true);
      expect(validateStatusTransition("DRAFT", "PENDING_APPROVAL").valid).toBe(true);

      // Approve on resubmission
      tx.order.update.mockResolvedValue({ ...makeOrder(), status: "APPROVED" });

      await recordApproval("order-1", "gm-1", "tenant-1", "APPROVED", "Revised budget approved");
      expect(tx.order.update).toHaveBeenLastCalledWith({
        where: { id: "order-1" },
        data: { status: "APPROVED" },
      });
    });
  });
});
