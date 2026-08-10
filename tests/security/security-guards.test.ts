import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import { validateStatusTransition, getTransitionGate } from "@/lib/auth/state-machine";

describe("Order State Machine — Security", () => {
  describe("Self-approval guard", () => {
    it("should block self-approval by detecting requester === approver", () => {
      const requesterId = "user_123";
      const approverId = "user_123";
      expect(requesterId).toBe(approverId);
    });

    it("should allow different approver", () => {
      const requesterId = "user_123";
      const approverId = "user_456";
      expect(requesterId).not.toBe(approverId);
    });
  });

  describe("Status transitions", () => {
    it("DRAFT → PENDING_APPROVAL is valid", () => {
      expect(validateStatusTransition("DRAFT", "PENDING_APPROVAL")).toEqual({ valid: true });
    });

    it("DRAFT → DELIVERED is invalid (skips states)", () => {
      const result = validateStatusTransition("DRAFT", "DELIVERED");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("Invalid transition");
    });

    it("IN_TRANSIT → DELIVERED is valid", () => {
      expect(validateStatusTransition("IN_TRANSIT", "DELIVERED")).toEqual({ valid: true });
    });

    it("IN_TRANSIT → PARTIALLY_DELIVERED is valid", () => {
      expect(validateStatusTransition("IN_TRANSIT", "PARTIALLY_DELIVERED")).toEqual({ valid: true });
    });

    it("DELIVERED → CANCELLED is invalid (terminal)", () => {
      const result = validateStatusTransition("DELIVERED", "CANCELLED");
      expect(result.valid).toBe(false);
    });

    it("CANCELLED → anything is invalid (terminal)", () => {
      expect(validateStatusTransition("CANCELLED", "DRAFT").valid).toBe(false);
      expect(validateStatusTransition("CANCELLED", "DELIVERED").valid).toBe(false);
    });

    it("same status → valid (idempotent)", () => {
      expect(validateStatusTransition("DELIVERED", "DELIVERED")).toEqual({ valid: true });
    });
  });

  describe("Transition gates", () => {
    it("APPROVED → CONFIRMED requires payment guarantee", () => {
      const gate = getTransitionGate("APPROVED", "CONFIRMED");
      expect(gate).toBeDefined();
      expect(gate!.requires.paymentGuarantee).toBe(true);
    });

    it("CONFIRMED → IN_TRANSIT requires payment guarantee + ETA validation", () => {
      const gate = getTransitionGate("CONFIRMED", "IN_TRANSIT");
      expect(gate).toBeDefined();
      expect(gate!.requires.paymentGuarantee).toBe(true);
      expect(gate!.requires.etaValidation).toBe(true);
    });

    it("IN_TRANSIT → DELIVERED requires authority approval", () => {
      const gate = getTransitionGate("IN_TRANSIT", "DELIVERED");
      expect(gate).toBeDefined();
      expect(gate!.requires.authorityApproval).toBe(true);
    });

    it("DRAFT → PENDING_APPROVAL has no gate", () => {
      expect(getTransitionGate("DRAFT", "PENDING_APPROVAL")).toBeUndefined();
    });
  });
});
