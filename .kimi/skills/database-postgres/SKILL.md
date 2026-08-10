# Database PostgreSQL Skill
## Hotels Vendors — PostgreSQL Prisma Best Practices

### Purpose
Reusable database patterns for all agents writing schemas, migrations, or queries.

### Non-Negotiable Rules
1. **PostgreSQL in development AND production.** Use Docker Compose for local dev. NEVER write SQLite-specific code.
2. **Indexes on all query-heavy columns.** Every FK, polymorphic lookup, and search field MUST have an index.
3. **Full-Text Search (FTS).** Use PostgreSQL `tsvector` for product catalog search instead of `LIKE` queries.
4. **Connection pooling.** Use `pgBouncer` or Prisma Accelerate in production. Never exceed connection limits.
5. **Row-Level Security (RLS).** Enable RLS policies on tenant-scoped tables for defense-in-depth.
6. **Migrations are additive only in production.** Never drop columns in production migrations. Use deprecation + backfill pattern.
7. **JSON fields are for unstructured data ONLY.** Relational data must use proper models and FKs.
8. **Enum types in PostgreSQL.** Use Prisma enums (mapped to PostgreSQL native enums) for status fields.

### Tech Stack
- PostgreSQL 16
- Prisma 7.x with `prisma-client-js`
- `pg` (node-postgres driver)
- Docker Compose for local dev

### Patterns
```prisma
// CORRECT — index on polymorphic lookup
model Document {
  id         String @id @default(cuid())
  entityType String
  entityId   String
  tenantId   String

  @@index([entityType, entityId])
  @@index([tenantId])
}

// CORRECT — FTS for product search
model Product {
  id        String @id @default(cuid())
  name      String
  searchVector Unsupported("tsvector")?

  @@index([searchVector], type: Gin)
}
```

### PostgreSQL RLS Policy (Add After Tenant Migration)
```sql
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON "Order"
  USING ("tenantId" = current_setting('app.current_tenant')::TEXT);
```

### Files You Must Read Before Writing
- `prisma/schema.prisma`
- `docker-compose.yml`
- `lib/prisma.ts`
