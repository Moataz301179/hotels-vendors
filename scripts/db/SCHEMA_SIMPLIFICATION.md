# Schema Simplification Guide
## From Multi-Tenant to Single-Tenant + Org Hierarchy

### What's Changing

| Before (Multi-Tenant) | After (Single-Tenant + Org) |
|---|---|
| `Tenant` table with isolated data | `Organization` table with optional isolation |
| Row-level security per tenant | Org ID filter in queries (manual) |
| Complex tenant switching | Simple org context |
| `user.tenantId` required everywhere | `user.orgId` optional, defaults to user's org |

### Why

- We have 0 organizations today
- Multi-tenancy adds 30% complexity for 0% benefit
- Add it back when we have 10+ hotel groups

### Org Hierarchy

```
Organization (e.g., "Nile Hospitality Group")
  └── Properties (e.g., "Nile Resort Sharm", "Nile Plaza Cairo")
        └── Departments (e.g., "F&B", "Housekeeping", "Engineering")
              └── Users (e.g., "GM Sharm", "F&B Manager")
```

### Migration Steps

1. Backup SQLite database
2. Run setup-postgres.sh
3. Update schema.prisma (simplified version)
4. Run `prisma migrate dev`
5. Run seed script
6. Update `lib/prisma.ts` to use PostgreSQL
7. Test all API routes

### Rollback Plan

- SQLite file preserved in `prisma/dev.db.backup`
- Connection string saved in `.env.local.backup`
- If PostgreSQL fails, revert to SQLite in < 5 minutes
