/**
 * Order Approval API
 * POST /api/v1/authority/approve
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission, AuthContext } from '@/lib/auth/rbac';
import { validateSegregationOfDuties, logAuditEntry, AuthorityContext } from '@/lib/auth/authority-matrix';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const approveSchema = z.object({
  orderId: z.string(),
  action: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().min(1).max(500),
});

export const POST = withPermission(
  'order:approve',
  async (request: NextRequest, context: AuthContext) => {
    try {
      const body = await request.json();
      const validation = approveSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.errors },
          { status: 400 }
        );
      }

      const { orderId, action, reason } = validation.data;

      // Validate segregation of duties
      const sodValidation = await validateSegregationOfDuties(
        context.userId,
        action,
        orderId
      );

      if (!sodValidation.valid) {
        return NextResponse.json(
          { error: sodValidation.reason },
          { status: 403 }
        );
      }

      // Get order details
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          approvals: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Validate tenant access
      if (order.tenantId !== context.tenantId) {
        return NextResponse.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      // Check if user has already acted on this order
      const existingApproval = order.approvals.find(
        (a) => a.approverId === context.userId
      );

      if (existingApproval) {
        return NextResponse.json(
          { error: 'You have already acted on this order' },
          { status: 400 }
        );
      }

      // Create approval record
      const approval = await prisma.orderApproval.create({
        data: {
          orderId,
          approverId: context.userId,
          action: action as any,
          reason,
          beforeState: order.status,
          afterState: action === 'APPROVED' ? 'APPROVED' : 'REJECTED',
        },
      });

      // Update order status
      const newStatus = action === 'APPROVED' ? 'APPROVED' : 'REJECTED';
      await prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus as any },
      });

      // Log audit entry
      await logAuditEntry(
        {
          entityId: orderId,
          entityName: 'Order',
          actorId: context.userId,
          actorRole: context.userRole,
          actionType: action,
          changes: {
            approvalId: approval.id,
            reason,
            beforeState: order.status,
            afterState: newStatus,
          },
        },
        context.tenantId
      );

      return NextResponse.json({
        success: true,
        approval: {
          id: approval.id,
          action,
          reason,
          approverId: context.userId,
          createdAt: approval.createdAt,
        },
      });
    } catch (error) {
      console.error('Approval error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);