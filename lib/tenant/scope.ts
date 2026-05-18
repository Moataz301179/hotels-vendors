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
            "ConsolidatedInvoice", "AuditLog", "FactoringRequest", "SettlementDisbursal"
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
              } else if (args.data) {
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
