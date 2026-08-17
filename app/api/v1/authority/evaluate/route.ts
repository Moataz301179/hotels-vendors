/**
 * Authority Matrix Evaluation API
 * POST /api/v1/authority/evaluate
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission, AuthContext } from '@/lib/auth/rbac';
import { evaluateOrder, logAuditEntry, AuthorityContext } from '@/lib/auth/authority-matrix';
import { z } from 'zod';

const evaluateSchema = z.object({
  orderId: z.string(),
  orderValue: z.number().positive(),
  hotelId: z.string(),
  supplierId: z.string(),
  category: z.string().optional(),
});

export const POST = withPermission(
  'order:create',
  async (request: NextRequest, context: AuthContext) => {
    try {
      const body = await request.json();
      const validation = evaluateSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.errors },
          { status: 400 }
        );
      }

      const { orderId, orderValue, hotelId, supplierId, category } = validation.data;

      // Create authority context
      const authorityContext: AuthorityContext = {
        userId: context.userId,
        tenantId: context.tenantId,
        hotelId: context.hotelId,
        supplierId: context.supplierId,
        userRole: context.userRole,
        platformRole: context.platformRole,
      };

      // Evaluate order against authority matrix
      const decision = await evaluateOrder(
        {
          orderId,
          orderValue,
          hotelId,
          supplierId,
          requesterId: context.userId,
          category,
        },
        authorityContext
      );

      // Log audit entry
      await logAuditEntry(decision.auditLog, context.tenantId);

      return NextResponse.json({
        success: true,
        decision: {
          action: decision.action,
          routeToRole: decision.routeToRole,
          requiresPaymentGuarantee: decision.requiresPaymentGuarantee,
          requiresEtaValidation: decision.requiresEtaValidation,
          requiresDualSignOff: decision.requiresDualSignOff,
          reason: decision.reason,
        },
      });
    } catch (error) {
      console.error('Authority evaluation error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);