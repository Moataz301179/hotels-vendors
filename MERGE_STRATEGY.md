# MERGE STRATEGY: feature/enterprise-renovation → main

## Executive Summary

**Merge Target**: `feature/enterprise-renovation` → `main`  
**Scope**: Complete B2B enterprise platform renovation + Agent0 Swarm architecture refresh  
**Files Changed**: 74 files (+9334 insertions, -1177 deletions)  
**Risk Level**: 🔴 HIGH (Major schema changes, API additions, architectural pivot)

---

## Branch Analysis

### Source Branch: `origin/feature/enterprise-renovation`
**Commits**: 2 commits ahead of main
- `7114f09`: Documentation (Agent0 Swarm directive + Developer Agent planning)
- `8a1ffd0`: Complete B2B sandbox-g100 platform + TypeScript fixes

### Target Branch: `main` (HEAD: 9cf3afc)
Current state: Original platform infrastructure with Grok Brain features

---

## File Change Matrix

### 🔴 HIGH CONFLICT RISK (Modified Files - 8 files)

| File | Change Level | Risk | Conflict Resolution Strategy |
|------|-------------|------|------------------------------|
| `lib/swarm/scheduler.ts` | ⚠️ MAJOR | HIGH | Take renovated version - complete refactor (452→78 lines) |
| `prisma/schema.prisma` | ⚠️ MAJOR | HIGH | Take renovated version - new tables & relations |
| `lib/tenant/scope.ts` | ⚠️ SIGNIFICANT | MEDIUM | Take renovated version - cleaned up scope utilities |
| `app/(dashboard)/hotel/catalog/page.tsx` | ⚠️ MAJOR | MEDIUM | Take renovated version - UI overhaul |
| `app/api/v1/factoring/requests/route.ts` |🔄 MINOR | LOW | Merge conservatively - may have tiny conflicts |
| `app/api/v1/orders/[id]/approve/route.ts` |🔄 MINOR | LOW | Take renovated version |
| `app/api/v1/orders/route.ts` |🔄 MINOR | LOW | Take renovated version |
| `prisma/migrations/migration_lock.toml` |🔄 METADATA | LOW | Take renovated version |

### 🟢 NEW FILES (Added - 48 files)

#### Core UI Components (B2B Sandbox)
```
app/sandbox-g100/
├── page.tsx              # Entry point
├── ArbitrationDashboard.tsx
├── DeliveryHandshake.tsx
├── HotelOrderingMatrix.tsx
├── MarketplaceFront.tsx
├── PaymentRailSelector.tsx
├── ThemeProvider.tsx
├── ThemeSettings.tsx
├── actions.ts

app/sandbox/ (Legacy/duplicate - verify if needed)
├── page.tsx
├── ArbitrationDashboard.tsx
├── DeliveryHandshake.tsx
├── HotelOrderingMatrix.tsx
├── MarketplaceFront.tsx
├── PaymentRailSelector.tsx
├── ThemeProvider.tsx
├── ThemeSettings.tsx
├── actions.ts
```

#### Dashboard Components
```
components/dashboards/
├── factoring/index.tsx   # New factoring dashboard
├── hotel/index.tsx       # New hotel dashboard
├── supplier/index.tsx    # New supplier dashboard
```

#### New API Routes (10 new endpoints)
```
app/api/v1/
├── copilot/query/route.ts              # AI copilot endpoint
├── factoring/consolidated/[id]/approve/route.ts
├── factoring/consolidated/[id]/factor/route.ts
├── pipelines/trace/route.ts            # Pipeline trace endpoint
├── receivables/aggregate/route.ts      # Bulk receivables
├── supplier/activate/route.ts          # Supplier activation
├── webhooks/factor/route.ts            # Factoring webhooks
```

#### Core Library Modules
```
lib/auth/
├── four-eyes.ts          # 4-eyes approval workflow
├── session.ts            # Session management

lib/eta/
├── signer.ts             # ETA signing utilities
├── token-manager.ts      # ETA token lifecycle

lib/fintech/
├── accounting-ledger.ts  # Double-entry ledger
├── bulk-uploader.ts       # Bulk upload processor
├── idempotency.ts         # Idempotency keys
├── key-vault.ts           # Encryption key management
├── vault-keys.ts          # Key storage utilities

lib/onboarding/
├── hydrator.ts           # Tenant data hydration

lib/supplier/
├── shell-onboard.ts      # Shell onboarding flow

lib/swarm/
├── agents/cashflow-advisor.ts
├── agents/compliance-scanner.ts
├── assistants/cashflow-advisor.ts
├── assistants/compliance-scanner.ts
├── types/commands.ts     # Typed command definitions
├── types/ui-spec.ts      # UI specification types
```

#### Documentation
```
docs/
├── AGENT0_SWARM_DIRECTIVE.md
├── DEVELOPER_AGENT_PLANNING_PROMPT.md
├── SYSTEM_RENOVATION_FRAMEWORK.md
```

#### Configuration & Scripts
```
app/middleware.ts              # New middleware layer
app/preview/page.tsx           # Preview page
next.config.js                 # Next.js configuration
tailwind.config.js             # Tailwind CSS configuration
scripts/simulate-enterprise-loop.ts  # Enterprise simulation
```

### 🟡 RENAMED FILES (8 files - SQLITE backup)
```
prisma/migrations_sqlite_backup/
├── 20260501082822_init/migration.sql
├── 20260501102449_add_intelligence_layer/migration.sql
├── 20260501121709_add_accounting_inventory/migration.sql
├── 20260501133850_update_categories_roles/migration.sql
├── 20260501161123_add_coastal_models/migration.sql
├── 20260501203253_add_fintech_risk_layer/migration.sql
├── 20260501210526_add_audit_hash_chain/migration.sql
├── 20260502000000_add_tenant_rbac_schema/migration.sql
└── migration_lock.toml

-- ORIGINAL: All in prisma/migrations/
```

### 🟣 NEW DATABASE SCHEMAS

#### New Tables (Enterprise Renovation Migration: `20260517144131_init_enterprise_renovation`)
1. **Wallet** - Multi-rail wallet system
2. **WalletTransaction** - Wallet transaction log
3. **PromoCode** - Growth engine promotional codes
4. **Dispute** - Arbitration & conflict resolution
5. **HotelSupplier** - Hotel-supplier mandate relationships
6. **ConsolidatedInvoice** - Reverse factoring aggregation

#### Schema Additions to Existing Tables
- **Tenant**: `wallet`, `walletTransactions`, `promoCodes`, `disputes`, `hotelSuppliers`, `consolidatedInvoices`
- **Hotel**: `consolidatedInvoices`, `mandatedSuppliers`
- **Supplier**: `type`, `isVerified`, `returnPolicyDays`, `saasSubscriptionPlan`, `saasSubscriptionStatus`, `hotelMandates`
- **Order**: `disputes` relation
- **OrderItem**: `receivedQuantity`, `returnedQuantity`, `returnReason`
- **Invoice**: `returnedAmount`, `retentionRate`, `retentionAmount`, `netPayable`, `retentionReleaseDate`, `consolidatedInvoiceId`, `supplierDiscountRate`, `acceleratedCashRate`, `cashDiscountDelta`

---

## Database Migration Strategy

### ⚠️ CRITICAL: Migration Order

1. **BACKUP DATABASE** - Mandatory before migration
2. **NEW MIGRATION**: `prisma/migrations/20260517144131_init_enterprise_renovation/migration.sql`
   - Contains full schema with new tables
   - Renamed SQLite backup migrations to `prisma/migrations_sqlite_backup/`
   - This is the authoritative PostgreSQL schema

### Migration Risk Assessment
| Risk | Level | Note |
|------|-------|------|
| Data Loss | 🟡 Medium | SQLite → PostgreSQL or schema evolution required |
| Rollback | 🟡 Medium | Backup migrations available in `migrations_sqlite_backup/` |
| Downtime | 🔴 High | Schema changes require app restart |

---

## Dependency Changes

### Package Dependencies
**Status**: No changes to `package.json`
**Interpretation**: Renovated branch uses existing dependencies (good sign)

### New Configuration Files
- `next.config.js` - New Next.js config (replaces next.config.ts?)
- `tailwind.config.js` - New Tailwind configuration (different format)
- `app/middleware.ts` - Middleware layer (new)

---

## Environment Variables Assessment

### Likely NEW Variables Needed (from codebase analysis)
```
# ETA Integration (new auth/ modules)
ETA_API_KEY=
ETA_API_SECRET=

# Key Vault (new fintech modules)
ENCRYPTION_KEY=
KEY_VAULT_PROVIDER=

# Webhook Security (new webhooks/factor)
FACTOR_WEBHOOK_SECRET=

# Copilot AI (new copilot/query)
COPILOT_API_KEY=

# Enhanced Redis (if not already set)
REDIS_URL=redis://localhost:6379
REDIS_MAX_RETRIES=null
```

---

## Breaking Changes

### 🚨 BREAKING LIST

1. **lib/swarm/scheduler.ts REFACTOR**
   - Old API: `swarmQueues = { director, platform, fintech, supplier, hotel, logistics, intelligence, growth }`
   - NEW API: `IntelligenceQueue, ExecutionQueue, ComplianceQueue`
   - BREAKS: Any code importing from old swarmQueues structure

2. **Fintech Queue Changes**
   - `lib/factoring/queue.ts` - Modified signature
   - Check imports in `lib/fintech/factoring-orchestrator.ts`

3. **Database Relations**
   - New required relations: `Tenant.hotelSuppliers`, `Tenant.consolidatedInvoices`
   - Old code may fail without these relationships

4. **Middleware Layer**
   - New `app/middleware.ts` - May conflict with existing middleware
   - Check `middleware.ts` in root (currently exists)

---

## Manual Review Checklist

### Code Review Required
- [ ] `lib/swarm/scheduler.ts` - Verify all imports updated
- [ ] `app/middleware.ts` vs `middleware.ts` - Determine correct file
- [ ] Old SQLite migrations moved to backup - verify data integrity
- [ ] `docs/` new files - ensure no sensitive info
- [ ] Scripts verification - ensure no dev-only code in production

### Functional Review Required
- [ ] B2B Dashboard components render correctly
- [ ] New API routes handle errors gracefully
- [ ] ETA signer/token-manager security review
- [ ] Four-eyes approval workflow logic
- [ ] Key vault encryption implementation

---

## Merge Execution Plan

### Phase 1: Preparation
1. ✅ Stash local changes (already done)
2. ✅ Fetch feature branch (already done)
3. Create working branch: `git checkout -b merge/renovated-to-main`

### Phase 2: Merge
4. Attempt merge: `git merge origin/feature/enterprise-renovation`
5. If conflicts exist, resolve using `theirs` strategy (renovated version)

### Phase 3: Verification
6. `npm install`
7. `npx prisma generate`
8. `npm run build`
9. `npm run lint`

### Phase 4: Documentation
10. Update MERGE_STATUS.md with results
11. Commit with message: `Merge feature/enterprise-renovation into main (B2B platform + enterprise renovation)`

---

## Rollback Strategy

If merge fails critically:
```bash
git checkout main
git branch -D merge/renovated-to-main  # Delete failed merge branch
# Recreate from main if needed: git checkout -b merge/renovated-to-main
```

---

## Approval Requirements

- [ ] Database schema changes reviewed
- [ ] API breaking changes documented
- [ ] Security review for new auth modules
- [ ] Performance review for new tables/indexes

---

*Document created: 2026-05-19*  
*Agent: Master Developer (Agent Zero)*
