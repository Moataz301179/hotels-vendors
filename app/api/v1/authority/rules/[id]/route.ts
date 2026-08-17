/**
 * Authority Rule API
 * GET /api/v1/authority/rules/[id] - Get rule by ID
 * PUT /api/v1/authority/rules/[id] - Update rule
 * PATCH /api/v1/authority/rules/[id] - Partially update rule
 * DELETE /api/v1/authority/rules/[id] - Delete rule
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission, AuthContext } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateRuleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  role: z.string().optional(),
  category: z.string().optional(),
  minValue: z.number().min(0).optional(),
  maxValue: z.number().positive().optional(),
  action: z
    .enum([
      'AUTO_APPROVE',
      'ROUTE_TO_GM',
      'ROUTE_TO_FINANCIAL_CONTROLLER',
      'DUAL_SIGN_OFF',
      'REQUIRE_OWNER',
      'REJECT',
    ])
    .optional(),
  routeToRole: z.string().optional(),
  requiresPaymentGuarantee: z.boolean().optional(),
  requiresEtaValidation: z.boolean().optional(),
  requiresDualSignOff: z.boolean().optional(),
  priority: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const GET = withPermission(
  'admin:view_authority_matrix',
  async (
    request: NextRequest,
    context: AuthContext,
    { params }: { params: { id: string } }
  ) => {
    try {
      const rule = await prisma.authorityRule.findFirst({
        where: {
          id: params.id,
          tenantId: context.tenantId,
          deletedAt: null,
        },
      });

      if (!rule) {
        return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        rule: {
          id: rule.id,
          name: rule.name,
          description: rule.description,
          role: rule.role,
          category: rule.category,
          minValue: rule.minValue?.toNumber() || 0,
          maxValue: rule.maxValue?.toNumber() || 0,
          action: rule.action,
          routeToRole: rule.routeToRole,
          requiresPaymentGuarantee: rule.requiresPaymentGuarantee,
          requiresEtaValidation: rule.requiresEtaValidation,
          requiresDualSignOff: rule.requiresDualSignOff,
          isActive: rule.isActive,
          priority: rule.priority,
          createdAt: rule.createdAt,
          updatedAt: rule.updatedAt,
        },
      });
    } catch (error) {
      console.error('Failed to fetch authority rule:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);

export const PUT = withPermission(
  'admin:manage_authority_matrix',
  async (
    request: NextRequest,
    context: AuthContext,
    { params }: { params: { id: string } }
  ) => {
    try {
      const body = await request.json();
      const validation = updateRuleSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.errors },
          { status: 400 }
        );
      }

      // Check if rule exists
      const existingRule = await prisma.authorityRule.findFirst({
        where: {
          id: params.id,
          tenantId: context.tenantId,
          deletedAt: null,
        },
      });

      if (!existingRule) {
        return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
      }

      const ruleData = validation.data;

      // Check for overlapping rules (excluding current rule)
      if (ruleData.minValue !== undefined || ruleData.maxValue !== undefined) {
        const minValue = ruleData.minValue ?? existingRule.minValue?.toNumber() ?? 0;
        const maxValue = ruleData.maxValue ?? existingRule.maxValue?.toNumber() ?? 0;

        const overlappingRule = await prisma.authorityRule.findFirst({
          where: {
            id: { not: params.id },
            tenantId: context.tenantId,
            isActive: true,
            deletedAt: null,
            role: (ruleData.role as any) || existingRule.role,
            category: ruleData.category || existingRule.category,
            OR: [
              {
                minValue: { lte: maxValue },
                maxValue: { gte: minValue },
              },
            ],
          },
        });

        if (overlappingRule) {
          return NextResponse.json(
            {
              error: 'Overlapping rule exists',
              overlappingRuleId: overlappingRule.id,
            },
            { status: 409 }
          );
        }
      }

      // Update the rule
      const updatedRule = await prisma.authorityRule.update({
        where: { id: params.id },
        data: {
          ...(ruleData.name && { name: ruleData.name }),
          ...(ruleData.description !== undefined && {
            description: ruleData.description,
          }),
          ...(ruleData.role && { role: ruleData.role as any }),
          ...(ruleData.category !== undefined && { category: ruleData.category }),
          ...(ruleData.minValue !== undefined && { minValue: ruleData.minValue }),
          ...(ruleData.maxValue !== undefined && { maxValue: ruleData.maxValue }),
          ...(ruleData.action && { action: ruleData.action as any }),
          ...(ruleData.routeToRole !== undefined && {
            routeToRole: ruleData.routeToRole as any,
          }),
          ...(ruleData.requiresPaymentGuarantee !== undefined && {
            requiresPaymentGuarantee: ruleData.requiresPaymentGuarantee,
          }),
          ...(ruleData.requiresEtaValidation !== undefined && {
            requiresEtaValidation: ruleData.requiresEtaValidation,
          }),
          ...(ruleData.requiresDualSignOff !== undefined && {
            requiresDualSignOff: ruleData.requiresDualSignOff,
          }),
          ...(ruleData.priority !== undefined && { priority: ruleData.priority }),
          ...(ruleData.isActive !== undefined && { isActive: ruleData.isActive }),
        },
      });

      return NextResponse.json({
        success: true,
        rule: {
          id: updatedRule.id,
          name: updatedRule.name,
          description: updatedRule.description,
          role: updatedRule.role,
          category: updatedRule.category,
          minValue: updatedRule.minValue?.toNumber() || 0,
          maxValue: updatedRule.maxValue?.toNumber() || 0,
          action: updatedRule.action,
          routeToRole: updatedRule.routeToRole,
          requiresPaymentGuarantee: updatedRule.requiresPaymentGuarantee,
          requiresEtaValidation: updatedRule.requiresEtaValidation,
          requiresDualSignOff: updatedRule.requiresDualSignOff,
          isActive: updatedRule.isActive,
          priority: updatedRule.priority,
          createdAt: updatedRule.createdAt,
          updatedAt: updatedRule.updatedAt,
        },
      });
    } catch (error) {
      console.error('Failed to update authority rule:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);

export const PATCH = withPermission(
  'admin:manage_authority_matrix',
  async (
    request: NextRequest,
    context: AuthContext,
    { params }: { params: { id: string } }
  ) => {
    try {
      const body = await request.json();
      const validation = updateRuleSchema.partial().safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.errors },
          { status: 400 }
        );
      }

      // Check if rule exists
      const existingRule = await prisma.authorityRule.findFirst({
        where: {
          id: params.id,
          tenantId: context.tenantId,
          deletedAt: null,
        },
      });

      if (!existingRule) {
        return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
      }

      const ruleData = validation.data;

      // Update the rule
      const updatedRule = await prisma.authorityRule.update({
        where: { id: params.id },
        data: {
          ...(ruleData.name && { name: ruleData.name }),
          ...(ruleData.description !== undefined && {
            description: ruleData.description,
          }),
          ...(ruleData.role && { role: ruleData.role as any }),
          ...(ruleData.category !== undefined && { category: ruleData.category }),
          ...(ruleData.minValue !== undefined && { minValue: ruleData.minValue }),
          ...(ruleData.maxValue !== undefined && { maxValue: ruleData.maxValue }),
          ...(ruleData.action && { action: ruleData.action as any }),
          ...(ruleData.routeToRole !== undefined && {
            routeToRole: ruleData.routeToRole as any,
          }),
          ...(ruleData.requiresPaymentGuarantee !== undefined && {
            requiresPaymentGuarantee: ruleData.requiresPaymentGuarantee,
          }),
          ...(ruleData.requiresEtaValidation !== undefined && {
            requiresEtaValidation: ruleData.requiresEtaValidation,
          }),
          ...(ruleData.requiresDualSignOff !== undefined && {
            requiresDualSignOff: ruleData.requiresDualSignOff,
          }),
          ...(ruleData.priority !== undefined && { priority: ruleData.priority }),
          ...(ruleData.isActive !== undefined && { isActive: ruleData.isActive }),
        },
      });

      return NextResponse.json({
        success: true,
        rule: {
          id: updatedRule.id,
          name: updatedRule.name,
          description: updatedRule.description,
          role: updatedRule.role,
          category: updatedRule.category,
          minValue: updatedRule.minValue?.toNumber() || 0,
          maxValue: updatedRule.maxValue?.toNumber() || 0,
          action: updatedRule.action,
          routeToRole: updatedRule.routeToRole,
          requiresPaymentGuarantee: updatedRule.requiresPaymentGuarantee,
          requiresEtaValidation: updatedRule.requiresEtaValidation,
          requiresDualSignOff: updatedRule.requiresDualSignOff,
          isActive: updatedRule.isActive,
          priority: updatedRule.priority,
          createdAt: updatedRule.createdAt,
          updatedAt: updatedRule.updatedAt,
        },
      });
    } catch (error) {
      console.error('Failed to update authority rule:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);

export const DELETE = withPermission(
  'admin:manage_authority_matrix',
  async (
    request: NextRequest,
    context: AuthContext,
    { params }: { params: { id: string } }
  ) => {
    try {
      // Check if rule exists
      const existingRule = await prisma.authorityRule.findFirst({
        where: {
          id: params.id,
          tenantId: context.tenantId,
          deletedAt: null,
        },
      });

      if (!existingRule) {
        return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
      }

      // Soft delete the rule
      await prisma.authorityRule.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        message: 'Rule deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete authority rule:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);