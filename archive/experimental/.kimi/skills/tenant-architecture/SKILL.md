# Tenant Architecture Skill
## Hotels Vendors — Multi-Tenant Data Isolation

### Purpose
Reusable multi-tenancy patterns for all agents writing database queries, schemas, or API routes.

### Non-Negotiable Rules
1. **Every user belongs to exactly one Tenant.** There is no "global" user except the Platform Admin.
2. **Every database query MUST be tenant-scoped.** Use `tenantWhereClause(ctx)` to inject `tenantId` filters.
3. **Cross-tenant data access is a security incident.** The only exception is Platform Admin with explicit `admin:manage_tenants` permission.
4. **API routes extract tenant from the authenticated session.** Never from client-sent headers or query params.
5. **Row-Level Security (RLS) in PostgreSQL.** Once migrated to PostgreSQL, enable RLS policies on tenant-scoped tables.
6. **Tenant model is the root of isolation.** All tenant-scoped models MUST have a required `tenantId` FK.

### Tech Stack
- Prisma with PostgreSQL
- `lib/tenant/scope.ts` for query scoping
- PostgreSQL RLS policies for defense-in-depth

### Patterns
```typescript
// CORRECT — tenant-scoped query
const orders = await prisma.order.findMany({
  where: { ...tenantWhereClause(ctx), status: "PENDING" }
});

// FORBIDDEN — missing tenant scope
const orders = await prisma.order.findMany({ where: { status: "PENDING" } });

// CORRECT — tenant in create
const order = await prisma.order.create({
  data: { ...data, tenantId: ctx.tenantId }
});
```

### Tenant-Scoped Models
All these MUST have `tenantId`:
- `User`, `Order`, `Invoice`, `Product`, `Hotel`, `Supplier`, `AuditLog`, `AuthorityRule`, `Cart`, `Document`, `JournalEntry`

### Files You Must Read Before Writing
- `prisma/schema.prisma`
- `lib/tenant/scope.ts` (create if missing)
- `docs/ARCHITECTURE_OVERHAUL_PLAN.md`
