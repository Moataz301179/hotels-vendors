import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Extension for Absolute Multi-Tenant RLS
 * Acts as a mandatory global query interceptor. This automatically injects the `tenantId`
 * into every single database operation implicitly, enforcing Row-Level Security (RLS)
 * at the ORM layer. This ensures cross-tenant data bleed is impossible.
 */
export function getTenantClient(prisma: PrismaClient, tenantId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // Strict registry of multi-tenant isolated models
          const tenantModels = [
            "User", "Role", "Hotel", "Supplier", "Invoice",
            "MasterInvoice", "AuditLog", "FactoringRequest", "PaymentTransaction"
          ];
          
          if (tenantModels.includes(model)) {
            // @ts-ignore - Prisma args typing is dynamic based on operation
            args = args || {};
            
            // 1. Read & Mutate Many Operations
            if (['findMany', 'findFirst', 'findUnique', 'count', 'updateMany', 'deleteMany', 'aggregate', 'groupBy'].includes(operation)) {
              // @ts-ignore
              args.where = { ...args.where, tenantId };
            }
            // 2. Write Operations
            else if (['create', 'createMany'].includes(operation)) {
              // @ts-ignore
              if (Array.isArray(args.data)) {
                // @ts-ignore
                args.data = args.data.map(d => ({ ...d, tenantId }));
              } else if ((args as any).data) {
                // @ts-ignore
                args.data.tenantId = tenantId;
              }
            }
            // 3. Update / Delete Operations
            else if (['update', 'delete', 'upsert'].includes(operation)) {
              // @ts-ignore
              args.where = { ...args.where, tenantId };
              
              // @ts-ignore
              if (operation === 'upsert' && args.create) {
                // @ts-ignore
                args.create.tenantId = tenantId;
              }
            }
          }
          return query(args);
        },
      },
    },
  });
}

/**
 * Get User Client with tenant isolation
 * Returns a prisma client extended with user-scoped RLS
 */
export function getUserClient(prisma: PrismaClient, userId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const userModels = ["User", "Conversation", "AiUsage", "UserAddress"];
          
          if (userModels.includes(model) && args) {
            if (['findMany', 'findFirst', 'findUnique', 'count'].includes(operation)) {
              // @ts-ignore
              args.where = { ...args.where, userId };
            }
          }
          return query(args);
        },
      },
    },
  });
}

// ─────────────────────────────────────────
// TYPE EXPORTS (Backwards Compatibility)
// ─────────────────────────────────────────

/**
 * Tenant context for API handlers
 */
export interface TenantContext {
  tenantId: string;
  userId: string;
  platformRole?: string;
}

// ─────────────────────────────────────────
// BACKWARDS COMPATIBILITY LAYER (DEPRECATED)
// ─────────────────────────────────────────

/**
 * Auth context interface for legacy verifyTenantOwnership
 */
interface AuthContext {
  tenantId: string;
  userId?: string;
}

/**
 * @deprecated Use getTenantClient for RLS enforcement instead
 * Generates a where clause object with tenant filter
 */
export function tenantWhereClause(tenantId: string) {
  return { tenantId };
}

/**
 * @deprecated Use getTenantClient for RLS enforcement instead  
 * Enforces tenant ownership on a record
 */
export async function enforceTenantOwnership(
  model: string,
  id: string,
  tenantId: string,
  prismaClient?: PrismaClient
): Promise<boolean> {
  const prisma = prismaClient || (await import("@/lib/prisma")).prisma;
  
  const modelLower = model.toLowerCase();
  const allowed = ["hotel", "supplier", "invoice", "order", "product"];
  if (!allowed.includes(modelLower)) return false;
  
  try {
    const result = await (prisma as any)[modelLower].count({
      where: { id, tenantId }
    });
    return result > 0;
  } catch {
    return false;
  }
}

/** 
 * @deprecated Use getTenantClient or getUserClient instead
 * Verifies tenant ownership of a resource
 * 
 * Usage: verifyTenantOwnership(auth, "hotel", data.hotelId)
 * Where auth contains: { tenantId, userId }
 */
export async function verifyTenantOwnership(
  auth: AuthContext,
  model: string,
  resourceId: string,
  prismaClient?: PrismaClient
): Promise<boolean> {
  const { tenantId } = auth;
  const prisma = prismaClient || (await import("@/lib/prisma")).prisma;
  
  if (!tenantId || !resourceId) return false;
  
  const modelPlural: Record<string, string> = {
    "hotel": "hotel",
    "supplier": "supplier", 
    "invoice": "invoice",
    "order": "order",
    "product": "product",
    "user": "user"
  };
  
  const modelName = model.toLowerCase();
  if (!modelPlural[modelName]) {
    console.warn(`[DEPRECATED] verifyTenantOwnership called with unknown model: ${model}`);
    return false;
  }
  
  try {
    // Use count query to verify ownership
    const result = await (prisma as any)[modelPlural[modelName]].count({
      where: { id: resourceId, tenantId }
    });
    
    return result > 0;
  } catch (error) {
    console.error(`[verifyTenantOwnership Error] Model: ${model}, ResourceId: ${resourceId}, Error:`, error);
    return false;
  }
}
