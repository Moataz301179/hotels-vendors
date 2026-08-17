/**
 * Authority Rules API
 * GET /api/v1/authority/rules - List all rules
 * POST /api/v1/authority/rules - Create new rule
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission, AuthContext } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createRuleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  role: z.string(),
  category: z.string().optional(),
  minValue: z.number().min(0),
  maxValue: z.number().positive(),
  action: z.enum([
    'AUTO_APPROVE',
    'ROUTE_TO_GM',
    'ROUTE_TO_FINANCIAL_CONTROLLER',
    'DUAL_SIGN_OFF',
    'REQUIRE_OWNER',
    'REJECT',
  ]),
  routeToRole: z.string().optional(),
  requiresPaymentGuarantee: z.boolean().default(false),
  requiresEtaValidation: z.boolean().default(true),
  requiresDualSignOff: z.boolean().default(false),
  priority: z.number().default(0),
});

export const GET = withPermission(
  'admin:view_authority_matrix',
  async (request: NextRequest, context: AuthContext) => {
    try {
      const rules = await prisma.authorityRule.findMany({
        where: {
          tenantId: context.tenantId,
          deletedAt: null,
        },
        orderBy: { priority: 'desc' },
      });

      return NextResponse.json({
        success: true,
        rules: rules.map((rule) => ({
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
        })),
      });
    } catch (error) {
      console.error('Failed to fetch authority rules:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);

export const POST = withPermission(
  'admin:manage_authority_matrix',
  async (request: NextRequest, context: AuthContext) => {
    try {
      const body = await request.json();
      const validation = createRuleSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.errors },
          { status: 400 }
        );
      }

      const ruleData = validation.data;

      // Check for overlapping rules
      const overlappingRule = await prisma.authorityRule.findFirst({
        where: {
          tenantId: context.tenantId,
          isActive: true,
          deletedAt: null,
          role: ruleData.role,
          category: ruleData.category || null,
          OR: [
            {
              minValue: { lte: ruleData.maxValue },
              maxValue: { gte: ruleData.minValue },
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

      // Create the rule
      const rule = await prisma.authorityRule.create({
        data: {
          tenantId: context.tenantId,
          name: ruleData.name,
          description: ruleData.description,
          role: ruleData.role as any,
          category: ruleData.category,
          minValue: ruleData.minValue,
          maxValue: ruleData.maxValue,
          action: ruleData.action as any,
          routeToRole: ruleData.routeToRole as any,
          requiresPaymentGuarantee: ruleData.requiresPaymentGuarantee,
          requiresEtaValidation: ruleData.requiresEtaValidation,
          requiresDualSignOff: ruleData.requiresDualSignOff,
          priority: ruleData.priority,
        },
      });

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
        },
      });
    } catch (error) {
      console.error('Failed to create authority rule:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);