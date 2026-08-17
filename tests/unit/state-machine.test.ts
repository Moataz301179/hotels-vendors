import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

import {
  validateStatusTransition,
  getTransitionGate,
  atomicStatusUpdate,
} from "@/lib/auth/state-machine";

type OrderStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CONFIRMED"
  | "IN_TRANSIT"
  | "PARTIALLY_DELIVERED"
  | "DELIVERED"
  | "DISPUTED"
  | "CANCELLED";

const ALL_STATES: OrderStatus[] = [
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "CONFIRMED",
  "IN_TRANSIT",
  "PARTIALLY_DELIVERED",
  "DELIVERED",
  "DISPUTED",
  "CANCELLED",
];

describe("Order State Machine", () => {
  describe("Valid transitions", () => {
    it("DRAFT → PENDING_APPROVAL", () => {
      expect(validateStatusTransition("DRAFT", "PENDING_APPROVAL")).toEqual({ valid: true });
    });

    it("DRAFT → CANCELLED", () => {
      expect(validateStatusTransition("DRAFT", "CANCELLED")).toEqual({ valid: true });
    });

    it("PENDING_APPROVAL → APPROVED", () => {
      expect(validateStatusTransition("PENDING_APPROVAL", "APPROVED")).toEqual({ valid: true });
    });

    it("PENDING_APPROVAL → REJECTED", () => {
      expect(validateStatusTransition("PENDING_APPROVAL", "REJECTED")).toEqual({ valid: true });
    });

    it("PENDING_APPROVAL → CANCELLED", () => {
      expect(validateStatusTransition("PENDING_APPROVAL", "CANCELLED")).toEqual({ valid: true });
    });

    it("APPROVED → CONFIRMED", () => {
      expect(validateStatusTransition("APPROVED", "CONFIRMED")).toEqual({ valid: true });
    });

    it("APPROVED → CANCELLED", () => {
      expect(validateStatusTransition("APPROVED", "CANCELLED")).toEqual({ valid: true });
    });

    it("REJECTED → DRAFT (resubmit)", () => {
      expect(validateStatusTransition("REJECTED", "DRAFT")).toEqual({ valid: true });
    });

    it("CONFIRMED → IN_TRANSIT", () => {
      expect(validateStatusTransition("CONFIRMED", "IN_TRANSIT")).toEqual({ valid: true });
    });

    it("CONFIRMED → CANCELLED", () => {
      expect(validateStatusTransition("CONFIRMED", "CANCELLED")).toEqual({ valid: true });
    });

    it("IN_TRANSIT → PARTIALLY_DELIVERED", () => {
      expect(validateStatusTransition("IN_TRANSIT", "PARTIALLY_DELIVERED")).toEqual({ valid: true });
    });

    it("IN_TRANSIT → DELIVERED", () => {
      expect(validateStatusTransition("IN_TRANSIT", "DELIVERED")).toEqual({ valid: true });
    });

    it("IN_TRANSIT → DISPUTED", () => {
      expect(validateStatusTransition("IN_TRANSIT", "DISPUTED")).toEqual({ valid: true });
    });

    it("PARTIALLY_DELIVERED → DELIVERED", () => {
      expect(validateStatusTransition("PARTIALLY_DELIVERED", "DELIVERED")).toEqual({ valid: true });
    });

    it("PARTIALLY_DELIVERED → DISPUTED", () => {
      expect(validateStatusTransition("PARTIALLY_DELIVERED", "DISPUTED")).toEqual({ valid: true });
    });

    it("DELIVERED → DISPUTED", () => {
      expect(validateStatusTransition("DELIVERED", "DISPUTED")).toEqual({ valid: true });
    });

    it("DISPUTED → DELIVERED (resolution)", () => {
      expect(validateStatusTransition("DISPUTED", "DELIVERED")).toEqual({ valid: true });
    });

    it("DISPUTED → CANCELLED", () => {
      expect(validateStatusTransition("DISPUTED", "CANCELLED")).toEqual({ valid: true });
    });
  });

  describe("Invalid transitions", () => {
    it("DRAFT → DELIVERED (skipping steps)", () => {
      const result = validateStatusTransition("DRAFT", "DELIVERED");
      expect(result.valid).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it("DELIVERED → DRAFT (going backwards)", () => {
      expect(validateStatusTransition("DELIVERED", "DRAFT").valid).toBe(false);
    });

    it("REJECTED → APPROVED (can't un-reject directly)", () => {
      expect(validateStatusTransition("REJECTED", "APPROVED").valid).toBe(false);
    });

    it("REJECTED → IN_TRANSIT", () => {
      expect(validateStatusTransition("REJECTED", "IN_TRANSIT").valid).toBe(false);
    });

    it("CANCELLED → DRAFT (terminal state)", () => {
      expect(validateStatusTransition("CANCELLED", "DRAFT").valid).toBe(false);
    });

    it("CANCELLED → IN_TRANSIT (terminal state)", () => {
      expect(validateStatusTransition("CANCELLED", "IN_TRANSIT").valid).toBe(false);
    });

    it("CANCELLED → any state is blocked", () => {
      for (const target of ALL_STATES) {
        if (target === "CANCELLED") continue;
        expect(validateStatusTransition("CANCELLED", target).valid).toBe(false);
      }
    });

    it("DRAFT → APPROVED (skipping PENDING_APPROVAL)", () => {
      expect(validateStatusTransition("DRAFT", "APPROVED").valid).toBe(false);
    });

    it("APPROVED → IN_TRANSIT (must go through CONFIRMED)", () => {
      expect(validateStatusTransition("APPROVED", "IN_TRANSIT").valid).toBe(false);
    });

    it("CONFIRMED → DELIVERED (must go through IN_TRANSIT)", () => {
      expect(validateStatusTransition("CONFIRMED", "DELIVERED").valid).toBe(false);
    });

    it("DISPUTED → PENDING_APPROVAL (can't restart flow)", () => {
      expect(validateStatusTransition("DISPUTED", "PENDING_APPROVAL").valid).toBe(false);
    });
  });

  describe("Same-state transitions", () => {
    it("same state returns valid (idempotent)", () => {
      for (const state of ALL_STATES) {
        const result = validateStatusTransition(state, state);
        expect(result.valid).toBe(true);
        expect(result.reason).toBeUndefined();
      }
    });
  });

  describe("getTransitionGate", () => {
    it("APPROVED → CONFIRMED requires payment guarantee", () => {
      const gate = getTransitionGate("APPROVED", "CONFIRMED");
      expect(gate).toBeDefined();
      expect(gate!.requires.paymentGuarantee).toBe(true);
    });

    it("CONFIRMED → IN_TRANSIT requires payment guarantee + ETA", () => {
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

    it("PENDING_APPROVAL → REJECTED has no gate", () => {
      expect(getTransitionGate("PENDING_APPROVAL", "REJECTED")).toBeUndefined();
    });

    it("PENDING_APPROVAL → CANCELLED has no gate", () => {
      expect(getTransitionGate("PENDING_APPROVAL", "CANCELLED")).toBeUndefined();
    });

    it("non-existent transition returns undefined", () => {
      expect(getTransitionGate("DRAFT", "DELIVERED")).toBeUndefined();
    });
  });

  describe("Transition coverage", () => {
    it("every non-terminal state has at least one forward transition", () => {
      const terminalStates: OrderStatus[] = ["CANCELLED"];
      for (const state of ALL_STATES) {
        if (terminalStates.includes(state)) continue;
        const targets = ALL_STATES.filter(
          (t) => t !== state && validateStatusTransition(state, t).valid
        );
        expect(targets.length).toBeGreaterThan(0);
      }
    });

    it("CANCELLED is the only state with zero outgoing transitions", () => {
      for (const state of ALL_STATES) {
        const targets = ALL_STATES.filter(
          (t) => t !== state && validateStatusTransition(state, t).valid
        );
        if (state === "CANCELLED") {
          expect(targets.length).toBe(0);
        }
      }
    });

    it("every transition with a gate is also a valid transition", () => {
      const gatedPairs: [OrderStatus, OrderStatus][] = [
        ["APPROVED", "CONFIRMED"],
        ["CONFIRMED", "IN_TRANSIT"],
        ["IN_TRANSIT", "DELIVERED"],
      ];
      for (const [from, to] of gatedPairs) {
        expect(validateStatusTransition(from, to).valid).toBe(true);
        expect(getTransitionGate(from, to)).toBeDefined();
      }
    });
  });
});
