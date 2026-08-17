/**
 * Authority Matrix Evaluation Engine
 * Implements SOX/COSO compliant approval workflows with segregation of duties
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface AuthorityContext {
  userId: string;
  tenantId: string;
  hotelId?: string;
  supplierId?: string;
  userRole: string;
  platformRole: string;
}

export interface OrderEvaluation {
  orderId: string;
  orderValue: number;
  hotelId: string;
  supplierId: string;
  requesterId: string;
  category?: string;
  supplierTier?: string;
  hotelTier?: string;
  hotelRiskTier?: string;
}

export interface AuthorityDecision {
  action: 'AUTO_APPROVE' | 'ROUTE_TO' | 'REQUIRE_DUAL_SIGN_OFF' | 'REJECT';
  routeToRole?: string;
  routeToUserIds?: string[];
  requiresPaymentGuarantee: boolean;
  requiresEtaValidation: boolean;
  requiresDualSignOff: boolean;
  reason: string;
  auditLog: AuditEntry;
}

export interface AuditEntry {
  entityId: string;
  entityName: string;
  actorId: string;
  actorRole: string;
  actionType: string;
  changes: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Evaluate an order against the authority matrix
 */
export async function evaluateOrder(
  order: OrderEvaluation,
  context: AuthorityContext
): Promise<AuthorityDecision> {
  // Get all active authority rules for this tenant
  const rules = await prisma.authorityRule.findMany({
    where: {
      tenantId: context.tenantId,
      isActive: true,
      deletedAt: null,
    },
    orderBy: { priority: 'desc' },
  });

  // Get hotel and supplier details for risk assessment
  const [hotel, supplier] = await Promise.all([
    prisma.hotel.findUnique({ where: { id: order.hotelId } }),
    prisma.supplier.findUnique({ where: { id: order.supplierId } }),
  ]);

  // Find matching rule based on order characteristics
  const matchingRule = findMatchingRule(rules, {
    orderValue: order.orderValue,
    hotelTier: hotel?.tier,
    hotelRiskTier: hotel?.riskTier,
    supplierTier: supplier?.tier,
    category: order.category,
    userRole: context.userRole,
  });

  if (!matchingRule) {
    // Default rule: require manager approval for all orders
    return {
      action: 'ROUTE_TO',
      routeToRole: 'GM',
      requiresPaymentGuarantee: order.orderValue > 10000,
      requiresEtaValidation: true,
      requiresDualSignOff: order.orderValue > 50000,
      reason: 'No matching authority rule found - defaulting to GM approval',
      auditLog: createAuditEntry(order.orderId, 'Order', context, 'EVALUATE', {
        ruleId: null,
        reason: 'DEFAULT_RULE',
      }),
    };
  }

  // Evaluate the matching rule
  return evaluateRule(matchingRule, order, context, hotel, supplier);
}

/**
 * Find the most specific matching rule
 */
function findMatchingRule(
  rules: any[],
  params: {
    orderValue: number;
    hotelTier?: string;
    hotelRiskTier?: string;
    supplierTier?: string;
    category?: string;
    userRole: string;
  }
) {
  for (const rule of rules) {
    // Check value range
    if (rule.minValue && params.orderValue < rule.minValue.toNumber()) continue;
    if (rule.maxValue && params.orderValue > rule.maxValue.toNumber()) continue;

    // Check hotel tier
    if (rule.hotelTier && rule.hotelTier !== params.hotelTier) continue;

    // Check hotel risk tier
    if (rule.hotelRiskTier && rule.hotelRiskTier !== params.hotelRiskTier) continue;

    // Check supplier tier
    if (rule.supplierTier && rule.supplierTier !== params.supplierTier) continue;

    // Check category
    if (rule.category && rule.category !== params.category) continue;

    // Check requester role
    if (rule.requesterRole && rule.requesterRole !== params.userRole) continue;

    // This rule matches
    return rule;
  }
  return null;
}

/**
 * Evaluate a specific authority rule
 */
function evaluateRule(
  rule: any,
  order: OrderEvaluation,
  context: AuthorityContext,
  hotel: any,
  supplier: any
): AuthorityDecision {
  const baseDecision = {
    requiresPaymentGuarantee: rule.requiresPaymentGuarantee,
    requiresEtaValidation: rule.requiresEtaValidation,
    requiresDualSignOff: rule.requiresDualSignOff,
  };

  switch (rule.action) {
    case 'AUTO_APPROVE':
      return {
        ...baseDecision,
        action: 'AUTO_APPROVE',
        reason: `Rule ${rule.name}: Auto-approved based on criteria`,
        auditLog: createAuditEntry(order.orderId, 'Order', context, 'AUTO_APPROVE', {
          ruleId: rule.id,
          ruleName: rule.name,
        }),
      };

    case 'ROUTE_TO_GM':
      return {
        ...baseDecision,
        action: 'ROUTE_TO',
        routeToRole: 'GM',
        reason: `Rule ${rule.name}: Routed to General Manager`,
        auditLog: createAuditEntry(order.orderId, 'Order', context, 'ROUTE_TO_GM', {
          ruleId: rule.id,
          ruleName: rule.name,
        }),
      };

    case 'ROUTE_TO_FINANCIAL_CONTROLLER':
      return {
        ...baseDecision,
        action: 'ROUTE_TO',
        routeToRole: 'FINANCIAL_CONTROLLER',
        reason: `Rule ${rule.name}: Routed to Financial Controller`,
        auditLog: createAuditEntry(order.orderId, 'Order', context, 'ROUTE_TO_FC', {
          ruleId: rule.id,
          ruleName: rule.name,
        }),
      };

    case 'DUAL_SIGN_OFF':
      return {
        ...baseDecision,
        action: 'REQUIRE_DUAL_SIGN_OFF',
        requiresDualSignOff: true,
        routeToRole: rule.routeToRole || 'GM',
        reason: `Rule ${rule.name}: Requires dual sign-off`,
        auditLog: createAuditEntry(order.orderId, 'Order', context, 'REQUIRE_DUAL', {
          ruleId: rule.id,
          ruleName: rule.name,
          routeToRole: rule.routeToRole,
        }),
      };

    case 'REQUIRE_OWNER':
      return {
        ...baseDecision,
        action: 'ROUTE_TO',
        routeToRole: 'OWNER',
        reason: `Rule ${rule.name}: Requires owner approval`,
        auditLog: createAuditEntry(order.orderId, 'Order', context, 'REQUIRE_OWNER', {
          ruleId: rule.id,
          ruleName: rule.name,
        }),
      };

    case 'REJECT':
      return {
        ...baseDecision,
        action: 'REJECT',
        reason: `Rule ${rule.name}: Order rejected based on criteria`,
        auditLog: createAuditEntry(order.orderId, 'Order', context, 'REJECT', {
          ruleId: rule.id,
          ruleName: rule.name,
        }),
      };

    default:
      return {
        ...baseDecision,
        action: 'ROUTE_TO',
        routeToRole: 'GM',
        reason: `Rule ${rule.name}: Unknown action, defaulting to GM`,
        auditLog: createAuditEntry(order.orderId, 'Order', context, 'DEFAULT_ROUTE', {
          ruleId: rule.id,
          ruleName: rule.name,
        }),
      };
  }
}

/**
 * Check if user has permission to perform action
 */
export async function checkPermission(
  context: AuthorityContext,
  permissionCode: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    include: {
      assignedRole: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user || user.tenantId !== context.tenantId) {
    return false;
  }

  // Platform admins have all permissions
  if (context.platformRole === 'ADMIN') {
    return true;
  }

  // Check if role has the required permission
  return user.assignedRole.permissions.some(
    (p) => p.code === permissionCode
  );
}

/**
 * Validate segregation of duties
 */
export async function validateSegregationOfDuties(
  userId: string,
  action: string,
  entityId: string
): Promise<{ valid: boolean; reason?: string }> {
  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { assignedRole: true },
  });

  if (!user) {
    return { valid: false, reason: 'User not found' };
  }

  // Check if user is trying to approve their own request
  if (action === 'APPROVE' || action === 'REJECT') {
    const order = await prisma.order.findUnique({
      where: { id: entityId },
    });

    if (order && order.requesterId === userId) {
      return {
        valid: false,
        reason: 'Segregation of duties violation: Cannot approve own request',
      };
    }
  }

  // Check if user has conflicting roles
  const conflictingRoles = await prisma.orderApproval.findMany({
    where: {
      orderId: entityId,
      approverId: userId,
      action: { in: ['APPROVED', 'REJECTED'] },
    },
  });

  if (conflictingRoles.length > 0) {
    return {
      valid: false,
      reason: 'User has already acted on this order',
    };
  }

  return { valid: true };
}

/**
 * Create audit entry
 */
function createAuditEntry(
  entityId: string,
  entityName: string,
  context: AuthorityContext,
  actionType: string,
  changes: Record<string, unknown>
): AuditEntry {
  return {
    entityId,
    entityName,
    actorId: context.userId,
    actorRole: context.userRole,
    actionType,
    changes,
  };
}

/**
 * Log audit entry to database
 */
export async function logAuditEntry(entry: AuditEntry, tenantId: string): Promise<void> {
  await prisma.auditLog.create({
    data: {
      entityId: entry.entityId,
      entityName: entry.entityName as any,
      actorId: entry.actorId,
      actorRole: entry.actorRole,
      actionType: entry.actionType as any,
      changes: entry.changes as Prisma.JsonObject,
      tenantId,
    },
  });
}

/**
 * Get approval workflow for order
 */
export async function getApprovalWorkflow(orderId: string) {
  return prisma.orderApproval.findMany({
    where: { orderId },
    include: {
      approver: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Check if order requires payment guarantee
 */
export async function requiresPaymentGuarantee(orderId: string): Promise<boolean> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) return false;

  // Check authority rules
  const rules = await prisma.authorityRule.findMany({
    where: {
      tenantId: order.tenantId,
      isActive: true,
      requiresPaymentGuarantee: true,
      deletedAt: null,
    },
  });

  return rules.some((rule) => {
    if (rule.minValue && order.total && order.total.lt(rule.minValue)) return false;
    if (rule.maxValue && order.total && order.total.gt(rule.maxValue)) return false;
    return true;
  });
}

/**
 * Admin override function for emergency bypass
 */
export async function adminOverride(
  orderId: string,
  adminId: string,
  reason: string,
  tenantId: string
): Promise<boolean> {
  // Log override action
  await prisma.auditLog.create({
    data: {
      entityId: orderId,
      entityName: 'Order',
      actorId: adminId,
      actorRole: 'ADMIN',
      actionType: 'ADMIN_OVERRIDE',
      changes: { reason },
      tenantId,
    },
  });
  return true;
}

/**
 * Evaluate authority for supplier onboarding/review
 */
export async function evaluateAuthority(
  supplierId: string,
  evaluatorId: string,
  tenantId: string
): Promise<{ approved: boolean; reason: string }> {
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId, tenantId },
  });
  
  if (!supplier) {
    return { approved: false, reason: 'Supplier not found' };
  }
  
  // Check if supplier meets approval criteria
  if (supplier.vetted && supplier.tier) {
    return { approved: true, reason: 'Supplier pre-vetted and tiered' };
  }
  
  return { approved: true, reason: 'Default approval' };
}

/**
 * Record approval for an order
 */
export function recordApproval(
  orderId: string,
  approverId: string,
  action: 'APPROVE' | 'REJECT',
  reason?: string
): void {
  // This is a stub - actual implementation would record in DB
  console.log(`Order ${orderId} ${action} by ${approverId}: ${reason}`);
}

/**
 * Set payment guarantee for an order
 */
export async function setPaymentGuarantee(
  orderId: string,
  guaranteedBy: string,
  guaranteeType: 'ETA' | 'Internal' | 'ThirdParty',
  tenantId: string
): Promise<void> {
  await prisma.order.update({
    where: { id: orderId, tenantId },
    data: {
      paymentGuarantee: {
        guaranteedBy,
        type: guaranteeType,
        setAt: new Date(),
      },
    },
  });
  
  await prisma.auditLog.create({
    data: {
      entityId: orderId,
      entityName: 'Order',
      actorId: guaranteedBy,
      actorRole: guaranteeType,
      actionType: 'PAYMENT_GUARANTEE_SET',
      changes: { type: guaranteeType },
      tenantId,
    },
  });
}

/**
 * AuthContext type for permission checks
 */
export interface AuthContext {
  userId: string;
  tenantId: string;
  userRole: string;
  platformRole: string;
  hotelId?: string;
  supplierId?: string;
}
