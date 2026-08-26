# Chunk 0 — Environment Baseline Audit (HotelsVendors)

Date: 2026-08-26 · Sandbox: Linux, Node v20.20.2, repo /tmp/hv

## Install & Generate
- `npm ci --legacy-peer-deps`: OK (994 packages; 30 npm audit vulns: 5 low / 11 moderate / 14 high). Engine warning: neon-init@0.14.0 requires Node >=22.
- `npx prisma generate`: FAILED - sandbox network blocks binaries.prisma.sh (ECONNRESET on engine download, retried 6x). Client TS stubs (node_modules/.prisma/client) exist from postinstall, so tsc runs; runtime DB queries will fail without the query engine binary. Deprecation notice: package.json#prisma config -> migrate to prisma.config.ts (Prisma 7).

## TypeScript Baseline (npx tsc --noEmit)
- 393 errors across ~60 files. Saved: /tmp/baseline-typecheck.txt.
- Top error patterns:
  1. TS7006 Parameter implicitly has an 'any' type — 299
  2. TS2305 Module has no exported member — 43
  3. TS2339 Property does not exist on type — 34
  4. TS2306 File is not a module — 8
  5. TS18046/TS2322/TS2694 'never'/not-assignable/namespace-export — 7
- Hottest files: app/api/v1/fintech/cashflow/route.ts (34), lib/fintech/risk-engine.ts (29), lib/zod.ts (20), lib/inventory/stock-guard.ts (16).

## Lint Baseline
- npx next lint: broken in this Next version ("Invalid project directory ... /tmp/hv/lint"). Used `npx eslint .` instead.
- 165 errors, 456 warnings (621 problems). Saved: /tmp/baseline-lint2.txt.
- Top rules: no-unused-vars (422), no-explicit-any (114), react-hooks/set-state-in-effect (23), react-hooks/exhaustive-deps (18), @next/next/no-img-element (15). Only 2 errors + 1 warning auto-fixable.

## Build & Test Scripts
- build: "prisma generate && next build" — NO --turbopack flag in build or dev scripts (despite repo docs mentioning Turbopack).
- Tests present: vitest (test, test:unit, test:integration, test:coverage), Playwright config + e2e/.

## Env Var Gap Analysis (.env.example exists)
| Var | Referenced in code | In .env.example | Gap |
|-----|-----|-----|-----|
| SESSION_SECRET | 5 files | yes | none |
| HOTELSVENDORS_HMAC_SECRET | 3 files | yes | none |
| ENCRYPTION_MASTER_KEY | 1 file | NO | MISSING from .env.example |
| NEXT_PUBLIC_APP_URL | 5 files | yes | none |

## Action Items
1. Fix sandbox egress to binaries.prisma.sh (or vendor the engine) before any runtime/DB work.
2. Replace `npx next lint` usage with eslint; consider a lint:fix pass.
3. Add ENCRYPTION_MASTER_KEY to .env.example.
4. TS cleanup should start with implicit-any params (76% of all errors) in fintech routes.
