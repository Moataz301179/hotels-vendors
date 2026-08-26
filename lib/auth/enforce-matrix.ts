/**
 * Authority Matrix Enforcement Gate (Chunk 6A)
 *
 * Single choke-point that MUST run before any order STATUS-CHANGING
 * mutation. Wraps evaluateAuthority() and converts a non-proceeding
 * evaluation into a structured 403 response carrying the reason and
 * the AuthorityAction that fired.
 */

import { NextResponse } from "next/server";
import {
  evaluateAuthority,
  type AuthorityContext,
  type AuthorityEvaluationResult,
} from "./authority-matrix";

export interface EnforceMatrixArgs {
  orderId: string;
  ctx: AuthorityContext;
  /** Optional: the status the caller intends to transition to (audit context only). */
  targetStatus?: string;
}

export type MatrixGate =
  | { ok: true; evaluation: AuthorityEvaluationResult }
  | { ok: false; response: NextResponse };

export async function enforceAuthorityMatrix(
  orderId: string,
  ctx: AuthorityContext,
  targetStatus?: string
): Promise<MatrixGate> {
  const evaluation = await evaluateAuthority(orderId, ctx);

  if (!evaluation.canProceed) {
    // Audit the blocked attempt (best-effort; never block on audit failure).
    try {
      const { appendAuditEntry } = await import("@/lib/audit/tamper-proof");
      await appendAuditEntry({
        entityName: "ORDER",
        entityId: orderId,
        actionType: "UPDATE",
        tenantId: ctx.tenantId,
        actorId: ctx.userId,
        changes: {
          blockedByAuthorityMatrix: true,
          authorityAction: evaluation.action,
          reason: evaluation.reason ?? null,
          targetStatus: targetStatus ?? null,
        },
      });
    } catch {
      // Audit sink unavailable - the gate decision still stands.
    }

    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            evaluation.reason ??
            "Blocked by the Authority Matrix governance rules",
          action: evaluation.action,
          ruleId: evaluation.rule?.id ?? null,
          ...(evaluation.smartFixes ? { smartFixes: evaluation.smartFixes } : {}),
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true, evaluation };
}
