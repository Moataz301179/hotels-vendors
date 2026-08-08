import { describe, it, expect, vi, beforeEach } from "vitest";

// ── vi.hoisted keeps refs available inside vi.mock factories (hoisted to top) ──

const {
  mockFindUnique,
  mockFindMany,
  mockCreate,
  mockUpdate,
  mockQueryRaw,
  mockTransaction,
  mockAssessRisk,
  mockGenerateSmartFixes,
  mockValidateForFactoring,
  mockAppendAuditEntry,
} = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockFindMany: vi.fn(),
  mockCreate: vi.fn(),
  mockUpdate: vi.fn(),
  mockQueryRaw: vi.fn().mockResolvedValue([{ id: "order-1", status: "DRAFT" }]),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockTransaction: vi.fn((cb: any) => cb({
    user: { findUnique: mockFindUnique },
    order: { findUnique: mockFindUnique, update: mockUpdate },
    orderApproval: { create: mockCreate },
    auditLog: { create: mockCreate },
    $queryRaw: mockQueryRaw,
  })),
  mockAssessRisk: vi.fn(),
  mockGenerateSmartFixes: vi.fn(),
  mockValidateForFactoring: vi.fn(),
  mockAppendAuditEntry: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: mockFindUnique },
    order: {
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
    authorityRule: { findMany: mockFindMany },
    orderApproval: { create: mockCreate },
    auditLog: { create: mockCreate },
    $transaction: mockTransaction,
    $queryRaw: mockQueryRaw,
  },
}));

vi.mock("@/lib/fintech/risk-engine", () => ({
  assessRisk: (...args: unknown[]) => mockAssessRisk(...args),
  generateSmartFixes: (...args: unknown[]) => mockGenerateSmartFixes(...args),
}));

vi.mock("@/lib/eta/validator", () => ({
  validateForFactoring: (...args: unknown[]) => mockValidateForFactoring(...args),
}));

vi.mock("@/lib/audit/tamper-proof", () => ({
  appendAuditEntry: (...args: unknown[]) => mockAppendAuditEntry(...args),
}));

// ── Imports AFTER mocks ──

import {
  evaluateAuthority,
  recordApproval,
  adminOverride,
  setPaymentGuarantee,
} from "@/lib/auth/authority-matrix";

// ── Helpers ──

function makeOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: "order-1",
    total: 10000,
    status: "DRAFT",
    paymentGuaranteed: false,
    paymentGuaranteeMethod: null,
    hotelId: "hotel-1",
    supplierId: "supplier-1",
    requesterId: "user-req-1",
    hotel: {
      tier: "PLATINUM",
      riskTier: "LOW",
      properties: [],
      creditFacilities: [],
    },
    supplier: { tier: "TIER_1" },
    invoices: [],
    approvals: [],
    ...overrides,
  };
}

function makeCtx(overrides: Record<string, unknown> = {}) {
  return {
    userId: "user-1",
    userRole: "CLERK" as const,
    tenantId: "tenant-1",
    ...overrides,
  };
}

function builtInRuleIds() {
  return [
    "rule_critical_block",
    "rule_eta_invalid",
    "rule_payment_guarantee_gate",
    "rule_smart_fix",
    "rule_high_value_dual",
    "rule_gm_route",
    "rule_auto_approve",
    "rule_fc_route",
    "rule_owner_route",
    "rule_default",
  ];
}

function setupDefaultMocks(orderOverrides: Record<string, unknown> = {}) {
  const order = makeOrder(orderOverrides);
  mockFindUnique.mockResolvedValue(order);

  mockAssessRisk.mockResolvedValue({
    hotelId: order.hotelId,
    compositeScore: 20,
    riskTier: order.hotel.riskTier ?? "LOW",
    factors: {
      paymentHistoryScore: 80,
      creditUtilizationScore: 30,
      disputeRateScore: 90,
      etaComplianceScore: 95,
      scaleScore: 70,
      reputationScore: 85,
    },
    creditAvailable: 500000,
    creditLimit: 1000000,
    creditUsed: 500000,
    totalExposure: 500000,
    assessedAt: new Date(),
  });

  // Include a valid invoice so ETA validation can pass
  if (!orderOverrides.invoices) {
    order.invoices = [{ id: "inv-1", etaStatus: "ACCEPTED" }];
  }

  // BUG FINDING: Multiple built-in rules have NO dimensional filters and act as
  // catch-alls at high priority, preventing any lower-priority rule from executing:
  //   - rule_eta_invalid (950): action=REJECT, catches everything
  //   - rule_payment_guarantee_gate (900): action=REQUIRE_PAYMENT_GUARANTEE
  //   - rule_owner_route (600): action=REQUIRE_OWNER
  //   - rule_default (500): action=APPROVE
  //
  // We override all catch-alls to CRITICAL-only so that rules with actual dimensional
  // filters (rule_high_value_dual, rule_gm_route, rule_auto_approve, etc.) can be tested.
  // In production, only rule_critical_block and rule_eta_invalid ever execute.
  mockFindMany.mockResolvedValue([
    {
      id: "rule_eta_invalid",
      name: "ETA Invalid Block (scoped to CRITICAL for testing)",
      priority: 950, minValue: 0, maxValue: 999_999_999,
      hotelRiskTier: "CRITICAL", hotelTier: null, supplierTier: null, requesterRole: null,
      requiresPaymentGuarantee: true, requiresEtaValidation: true, requiresDualSignOff: false,
      action: "REJECT", routeToRole: null, tenantId: null, isActive: true,
    },
    {
      id: "rule_payment_guarantee_gate",
      name: "Payment Guarantee Gate (scoped to CRITICAL for testing)",
      priority: 900, minValue: 0, maxValue: 999_999_999,
      hotelRiskTier: "CRITICAL", hotelTier: null, supplierTier: null, requesterRole: null,
      requiresPaymentGuarantee: true, requiresEtaValidation: false, requiresDualSignOff: false,
      action: "REQUIRE_PAYMENT_GUARANTEE", routeToRole: null, tenantId: null, isActive: true,
    },
    {
      id: "rule_owner_route",
      name: "Owner Route (scoped to CRITICAL for testing)",
      priority: 600, minValue: 0, maxValue: 999_999_999,
      hotelRiskTier: "CRITICAL", hotelTier: null, supplierTier: null, requesterRole: null,
      requiresPaymentGuarantee: true, requiresEtaValidation: true, requiresDualSignOff: false,
      action: "REQUIRE_OWNER", routeToRole: null, tenantId: null, isActive: true,
    },
    {
      id: "rule_default",
      name: "Default (scoped to CRITICAL for testing)",
      priority: 500, minValue: 0, maxValue: 999_999_999,
      hotelRiskTier: "CRITICAL", hotelTier: null, supplierTier: null, requesterRole: null,
      requiresPaymentGuarantee: true, requiresEtaValidation: true, requiresDualSignOff: false,
      action: "APPROVE", routeToRole: null, tenantId: null, isActive: true,
    },
  ]);

  mockValidateForFactoring.mockResolvedValue({
    valid: true,
    message: "ETA validation passed",
  });
}

// ── Tests ──

describe("Authority Matrix", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("evaluateAuthority", () => {
    it("returns REJECT when order not found", async () => {
      mockFindUnique.mockResolvedValue(null);
      mockAssessRisk.mockResolvedValue({ riskTier: "LOW" });

      const result = await evaluateAuthority("nonexistent", makeCtx());

      expect(result.action).toBe("REJECT");
      expect(result.canProceed).toBe(false);
      expect(result.reason).toBe("Order not found");
    });

    it("returns SMART_FIX_REQUIRED when HIGH risk hotel has no payment guarantee", async () => {
      setupDefaultMocks({ paymentGuaranteed: false });
      mockAssessRisk.mockResolvedValue({
        hotelId: "hotel-1",
        compositeScore: 75,
        riskTier: "HIGH",
        factors: {} as never,
        creditAvailable: 100000,
        creditLimit: 500000,
        creditUsed: 400000,
        totalExposure: 400000,
        assessedAt: new Date(),
      });
      mockGenerateSmartFixes.mockResolvedValue([
        {
          type: "DEPOSIT_20",
          title: "Pay 20% deposit",
          description: "Pay 20% upfront",
          action: "HOLD_ORDER",
          orderId: "order-1",
          hotelId: "hotel-1",
          hotelRiskTier: "HIGH",
        },
      ]);

      const result = await evaluateAuthority("order-1", makeCtx());

      expect(result.action).toBe("SMART_FIX_REQUIRED");
      expect(result.canProceed).toBe(false);
      expect(result.smartFixes).toHaveLength(1);
      expect(result.smartFixes![0].type).toBe("DEPOSIT_20");
      expect(result.paymentGuaranteeRequired).toBe(true);
    });

    it("returns REQUIRE_PAYMENT_GUARANTEE when LOW risk hotel has no payment guarantee", async () => {
      setupDefaultMocks({ paymentGuaranteed: false });

      const result = await evaluateAuthority("order-1", makeCtx());

      expect(result.action).toBe("REQUIRE_PAYMENT_GUARANTEE");
      expect(result.canProceed).toBe(false);
      expect(result.paymentGuaranteeRequired).toBe(true);
    });

    it("returns DUAL_SIGN_OFF for CORE hotel with order >= 500k", async () => {
      setupDefaultMocks({
        total: 500000,
        paymentGuaranteed: true,
        hotel: {
          tier: "CORE",
          riskTier: "LOW",
          properties: [],
          creditFacilities: [],
        },
      });

      const result = await evaluateAuthority("order-1", makeCtx());

      expect(result.action).toBe("DUAL_SIGN_OFF");
      expect(result.rule?.id).toBe("rule_high_value_dual");
      expect(result.canProceed).toBe(false);
    });

    it("returns REJECT for CRITICAL risk hotel", async () => {
      setupDefaultMocks({ paymentGuaranteed: true });
      mockAssessRisk.mockResolvedValue({
        hotelId: "hotel-1",
        compositeScore: 95,
        riskTier: "CRITICAL",
        factors: {} as never,
        creditAvailable: 0,
        creditLimit: 500000,
        creditUsed: 500000,
        totalExposure: 500000,
        assessedAt: new Date(),
      });

      const result = await evaluateAuthority("order-1", makeCtx());

      expect(result.action).toBe("REJECT");
      expect(result.canProceed).toBe(false);
      expect(result.rule?.id).toBe("rule_critical_block");
    });

    it("routes CLERK to GM for orders >= 100k", async () => {
      setupDefaultMocks({
        total: 100000,
        paymentGuaranteed: true,
      });

      const result = await evaluateAuthority("order-1", makeCtx({ userRole: "CLERK" }));

      expect(result.action).toBe("ROUTE_TO_GM");
      expect(result.routeToRole).toBe("GM");
      expect(result.rule?.id).toBe("rule_gm_route");
    });

    it("routes DEPARTMENT_HEAD to FC for orders >= 50k", async () => {
      setupDefaultMocks({
        total: 60000,
        paymentGuaranteed: true,
      });

      const result = await evaluateAuthority("order-1", makeCtx({ userRole: "DEPARTMENT_HEAD" }));

      expect(result.action).toBe("ROUTE_TO_FINANCIAL_CONTROLLER");
      expect(result.routeToRole).toBe("FINANCIAL_CONTROLLER");
      expect(result.rule?.id).toBe("rule_fc_route");
    });

    it("returns REQUIRE_OWNER for orders >= 1M (GM role, non-CORE hotel)", async () => {
      setupDefaultMocks({
        total: 1_000_000,
        paymentGuaranteed: true,
      });
      // Override to include rule_owner_route without CRITICAL filter
      mockFindMany.mockResolvedValue([
        {
          id: "rule_eta_invalid",
          name: "ETA Invalid Block (scoped)", priority: 950,
          minValue: 0, maxValue: 999_999_999,
          hotelRiskTier: "CRITICAL", hotelTier: null, supplierTier: null, requesterRole: null,
          requiresPaymentGuarantee: true, requiresEtaValidation: true, requiresDualSignOff: false,
          action: "REJECT", routeToRole: null, tenantId: null, isActive: true,
        },
        {
          id: "rule_payment_guarantee_gate",
          name: "Payment Guarantee Gate (scoped)", priority: 900,
          minValue: 0, maxValue: 999_999_999,
          hotelRiskTier: "CRITICAL", hotelTier: null, supplierTier: null, requesterRole: null,
          requiresPaymentGuarantee: true, requiresEtaValidation: false, requiresDualSignOff: false,
          action: "REQUIRE_PAYMENT_GUARANTEE", routeToRole: null, tenantId: null, isActive: true,
        },
        {
          id: "rule_owner_route",
          name: "Owner Route Critical Value", priority: 600,
          minValue: 1_000_000, maxValue: 999_999_999,
          hotelRiskTier: null, hotelTier: null, supplierTier: null, requesterRole: null,
          requiresPaymentGuarantee: true, requiresEtaValidation: true, requiresDualSignOff: false,
          action: "REQUIRE_OWNER", routeToRole: null, tenantId: null, isActive: true,
        },
      ]);

      // GM role doesn't match rule_gm_route (CLERK only) or rule_fc_route (DEPARTMENT_HEAD only)
      const result = await evaluateAuthority("order-1", makeCtx({ userRole: "GM" }));

      expect(result.action).toBe("REQUIRE_OWNER");
      expect(result.rule?.id).toBe("rule_owner_route");
      expect(result.canProceed).toBe(true);
    });

    it("returns AUTO_APPROVE for LOW risk hotel with order <= 50k", async () => {
      setupDefaultMocks({
        total: 30000,
        paymentGuaranteed: true,
      });

      const result = await evaluateAuthority("order-1", makeCtx());

      expect(result.action).toBe("AUTO_APPROVE");
      expect(result.rule?.id).toBe("rule_auto_approve");
      expect(result.canProceed).toBe(true);
    });

    it("returns REJECT when ETA validation fails", async () => {
      setupDefaultMocks({
        paymentGuaranteed: true,
        invoices: [{ id: "inv-1", etaStatus: "REJECTED" }],
      });
      mockValidateForFactoring.mockResolvedValue({
        valid: false,
        message: "ETA UUID missing",
      });

      const result = await evaluateAuthority("order-1", makeCtx());

      expect(result.action).toBe("REJECT");
      expect(result.canProceed).toBe(false);
      expect(result.etaValidationRequired).toBe(true);
      expect(result.reason).toContain("ETA validation failed");
    });

    it("falls back to APPROVE when no built-in rules match", async () => {
      setupDefaultMocks({
        total: 75000,
        paymentGuaranteed: true,
        hotel: {
          tier: "PLATINUM",
          riskTier: "MEDIUM",
          properties: [],
          creditFacilities: [],
        },
      });
      // MEDIUM risk — only rule_auto_approve (LOW) and rule_smart_fix (HIGH) have risk tiers
      // rule_gm_route only matches CLERK+>=100k; rule_fc_route only matches DEPARTMENT_HEAD+>=50k
      // So for a non-CLERK, non-DEPARTMENT_HEAD user with MEDIUM risk, order falls to default
      const result = await evaluateAuthority("order-1", makeCtx({ userRole: "GM" }));

      expect(result.action).toBe("APPROVE");
      expect(result.rule).toBeNull();
      expect(result.canProceed).toBe(true);
    });

    it("DB rules are merged with built-in rules (DB takes precedence on same id)", async () => {
      setupDefaultMocks({
        total: 40000,
        paymentGuaranteed: true,
      });
      // Include catch-all overrides PLUS the custom rule that overrides rule_auto_approve
      mockFindMany.mockResolvedValue([
        {
          id: "rule_eta_invalid", name: "ETA Invalid Block (scoped)", priority: 950,
          minValue: 0, maxValue: 999_999_999,
          hotelRiskTier: "CRITICAL", hotelTier: null, supplierTier: null, requesterRole: null,
          requiresPaymentGuarantee: true, requiresEtaValidation: true, requiresDualSignOff: false,
          action: "REJECT", routeToRole: null, tenantId: null, isActive: true,
        },
        {
          id: "rule_payment_guarantee_gate", name: "PG Gate (scoped)", priority: 900,
          minValue: 0, maxValue: 999_999_999,
          hotelRiskTier: "CRITICAL", hotelTier: null, supplierTier: null, requesterRole: null,
          requiresPaymentGuarantee: true, requiresEtaValidation: false, requiresDualSignOff: false,
          action: "REQUIRE_PAYMENT_GUARANTEE", routeToRole: null, tenantId: null, isActive: true,
        },
        {
          id: "rule_auto_approve",
          name: "Custom Auto-Approve",
          priority: 700,
          minValue: 0,
          maxValue: 50000,
          hotelRiskTier: "LOW",
          hotelTier: null,
          supplierTier: null,
          requesterRole: null,
          requiresPaymentGuarantee: true,
          requiresEtaValidation: true,
          requiresDualSignOff: false,
          action: "REJECT",
          routeToRole: null,
          tenantId: "tenant-1",
          isActive: true,
        },
      ]);

      const result = await evaluateAuthority("order-1", makeCtx());

      // DB rule overrides built-in: same id "rule_auto_approve" but action = REJECT
      expect(result.action).toBe("REJECT");
      expect(result.rule?.name).toBe("Custom Auto-Approve");
    });

    it("G10 enforced: payment guarantee and ETA validation always true even if DB tries false", async () => {
      setupDefaultMocks({
        total: 30000,
        paymentGuaranteed: true,
      });
      mockFindMany.mockResolvedValue([
        {
          id: "rule_custom_no_gate",
          name: "Custom No Gate",
          priority: 999,
          minValue: 0,
          maxValue: 50000,
          hotelRiskTier: "LOW",
          requiresPaymentGuarantee: false,
          requiresEtaValidation: false,
          requiresDualSignOff: false,
          action: "AUTO_APPROVE",
          routeToRole: null,
          tenantId: "tenant-1",
          isActive: true,
        },
      ]);

      const result = await evaluateAuthority("order-1", makeCtx());

      // The rule should still match and return AUTO_APPROVE since payment is guaranteed
      // But the G10 enforcement forces requiresPaymentGuarantee=true in the merged rule
      expect(result.action).toBe("AUTO_APPROVE");
      expect(result.paymentGuaranteeRequired).toBe(true);
      expect(result.etaValidationRequired).toBe(true);
    });

    it("applies default fallback for unmatched risk tier (MEDIUM)", async () => {
      setupDefaultMocks({
        total: 20000,
        paymentGuaranteed: true,
        hotel: {
          tier: "PLATINUM",
          riskTier: "MEDIUM",
          properties: [],
          creditFacilities: [],
        },
      });
      // MEDIUM risk doesn't match rule_auto_approve (LOW only) or rule_smart_fix (HIGH only)
      // For a CLERK with order < 100k, no role-specific rule matches either
      // Should fall through to default rule (rule_default → APPROVE)
      const result = await evaluateAuthority("order-1", makeCtx({ userRole: "CLERK" }));

      expect(result.action).toBe("APPROVE");
      expect(result.canProceed).toBe(true);
    });
  });

  describe("recordApproval", () => {
    it("creates approval record and updates order status to APPROVED", async () => {
      mockCreate.mockResolvedValue({});
      mockUpdate.mockResolvedValue({});
      mockAppendAuditEntry.mockResolvedValue({});

      await recordApproval("order-1", "approver-1", "tenant-1", "APPROVED", "Looks good");

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          orderId: "order-1",
          approverId: "approver-1",
          action: "APPROVED",
          reason: "Looks good",
        },
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: { status: "APPROVED" },
      });
    });

    it("updates order status to REJECTED on rejection", async () => {
      mockCreate.mockResolvedValue({});
      mockUpdate.mockResolvedValue({});
      mockAppendAuditEntry.mockResolvedValue({});

      await recordApproval("order-1", "approver-1", "tenant-1", "REJECTED", "Over budget");

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: { status: "REJECTED" },
      });
    });

    it("updates order status to PENDING_APPROVAL on escalation", async () => {
      mockCreate.mockResolvedValue({});
      mockUpdate.mockResolvedValue({});
      mockAppendAuditEntry.mockResolvedValue({});

      await recordApproval("order-1", "approver-1", "tenant-1", "ESCALATED");

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: { status: "PENDING_APPROVAL" },
      });
    });

    it("updates order status to APPROVED on admin override", async () => {
      mockCreate.mockResolvedValue({});
      mockUpdate.mockResolvedValue({});
      mockAppendAuditEntry.mockResolvedValue({});

      await recordApproval("order-1", "admin-1", "tenant-1", "ADMIN_OVERRIDE", "Emergency");

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: { status: "APPROVED" },
      });
    });

    it("appends audit entry with correct changes", async () => {
      mockCreate.mockResolvedValue({});
      mockUpdate.mockResolvedValue({});
      mockAppendAuditEntry.mockResolvedValue({});

      await recordApproval("order-1", "approver-1", "tenant-1", "APPROVED", "OK");

      expect(mockAppendAuditEntry).toHaveBeenCalledWith({
        entityName: "ORDER",
        entityId: "order-1",
        actionType: "UPDATE",
        tenantId: "tenant-1",
        actorId: "approver-1",
        changes: { status: "APPROVED", action: "APPROVED" },
      });
    });
  });

  describe("adminOverride", () => {
    const makeOverrideReq = (overrides: Record<string, unknown> = {}) => ({
      orderId: "order-1",
      action: "ADMIN_OVERRIDE" as const,
      reason: "Override reason must be at least 20 chars long",
      waivePaymentGuarantee: false,
      authorizerId: "admin-1",
      coAuthorizerId: "admin-2",
      tenantId: "tenant-1",
      ...overrides,
    });

    it("rejects when reason is shorter than 20 characters", async () => {
      const result = await adminOverride(makeOverrideReq({ reason: "Too short" }));

      expect(result.success).toBe(false);
      expect(result.error).toContain("20 characters");
    });

    it("rejects when authorizers are the same person", async () => {
      mockFindUnique.mockResolvedValue({
        id: "admin-1",
        platformRole: "ADMIN",
        canOverride: true,
      });

      const result = await adminOverride(
        makeOverrideReq({ coAuthorizerId: "admin-1" })
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("two distinct admins");
    });

    it("rejects when one authorizer not found", async () => {
      mockFindUnique
        .mockResolvedValueOnce({ id: "admin-1", platformRole: "ADMIN", canOverride: true })
        .mockResolvedValueOnce(null);

      const result = await adminOverride(makeOverrideReq());

      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });

    it("rejects when authorizer lacks admin privileges", async () => {
      mockFindUnique
        .mockResolvedValueOnce({ id: "admin-1", platformRole: "CLERK", canOverride: false })
        .mockResolvedValueOnce({ id: "admin-2", platformRole: "ADMIN", canOverride: true });

      const result = await adminOverride(makeOverrideReq());

      expect(result.success).toBe(false);
      expect(result.error).toContain("admin privileges");
    });

    it("succeeds with valid dual authorization", async () => {
      mockFindUnique
        .mockResolvedValueOnce({ id: "admin-1", platformRole: "ADMIN", canOverride: true })
        .mockResolvedValueOnce({ id: "admin-2", platformRole: "ADMIN", canOverride: true });

      mockTransaction.mockImplementation(async (fn: () => Promise<unknown>) => {
        const tx = {
          $queryRaw: vi.fn().mockResolvedValue([{ id: "order-1", status: "DRAFT", paymentGuaranteed: false, paymentGuaranteeMethod: null, tenantId: "tenant-1" }]),
          order: { update: vi.fn().mockResolvedValue({}) },
          orderApproval: { create: vi.fn().mockResolvedValue({}) },
          auditLog: { create: vi.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });

      const result = await adminOverride(makeOverrideReq());

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("allows canOverride=true even without ADMIN platformRole", async () => {
      mockFindUnique
        .mockResolvedValueOnce({ id: "admin-1", platformRole: "GM", canOverride: true })
        .mockResolvedValueOnce({ id: "admin-2", platformRole: "FINANCIAL_CONTROLLER", canOverride: true });

      mockTransaction.mockImplementation(async (fn: () => Promise<unknown>) => {
        const tx = {
          $queryRaw: vi.fn().mockResolvedValue([{ id: "order-1", status: "DRAFT", paymentGuaranteed: false, paymentGuaranteeMethod: null, tenantId: "tenant-1" }]),
          order: { update: vi.fn().mockResolvedValue({}) },
          orderApproval: { create: vi.fn().mockResolvedValue({}) },
          auditLog: { create: vi.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });

      const result = await adminOverride(makeOverrideReq());

      expect(result.success).toBe(true);
    });

    it("waives payment guarantee when waivePaymentGuarantee=true", async () => {
      mockFindUnique
        .mockResolvedValueOnce({ id: "admin-1", platformRole: "ADMIN", canOverride: true })
        .mockResolvedValueOnce({ id: "admin-2", platformRole: "ADMIN", canOverride: true });

      let capturedUpdateData: Record<string, unknown> = {};
      mockTransaction.mockImplementation(async (fn: () => Promise<unknown>) => {
        const tx = {
          $queryRaw: vi.fn().mockResolvedValue([
            { id: "order-1", status: "DRAFT", paymentGuaranteed: false, paymentGuaranteeMethod: null, tenantId: "tenant-1" },
          ]),
          order: {
            update: vi.fn().mockImplementation((args: { data: Record<string, unknown> }) => {
              capturedUpdateData = args.data;
              return Promise.resolve({});
            }),
          },
          orderApproval: { create: vi.fn().mockResolvedValue({}) },
          auditLog: { create: vi.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });

      await adminOverride(makeOverrideReq({ waivePaymentGuarantee: true }));

      expect(capturedUpdateData.paymentGuaranteed).toBe(true);
      expect(capturedUpdateData.paymentGuaranteeMethod).toBe("WAIVED");
    });
  });

  describe("setPaymentGuarantee", () => {
    it("sets paymentGuaranteed=true with method", async () => {
      mockUpdate.mockResolvedValue({});
      mockAppendAuditEntry.mockResolvedValue({});

      await setPaymentGuarantee({
        orderId: "order-1",
        tenantId: "tenant-1",
        method: "FACTORING",
        etaValidated: true,
        etaUuid: "abc-123",
        verifiedBy: "user-1",
        verifiedAt: new Date(),
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: {
          paymentGuaranteed: true,
          paymentGuaranteeMethod: "FACTORING",
        },
      });
    });

    it("writes audit entry with verification details", async () => {
      mockUpdate.mockResolvedValue({});
      mockAppendAuditEntry.mockResolvedValue({});

      await setPaymentGuarantee({
        orderId: "order-1",
        tenantId: "tenant-1",
        method: "DEPOSIT",
        depositAmount: 5000,
        etaValidated: true,
        verifiedBy: "user-1",
        verifiedAt: new Date(),
      });

      expect(mockAppendAuditEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          entityName: "ORDER",
          entityId: "order-1",
          actionType: "UPDATE",
          tenantId: "tenant-1",
          actorId: "user-1",
        })
      );
    });
  });
});
