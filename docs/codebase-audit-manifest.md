# Codebase Audit Manifest
## Surgical Cleanup Plan — Hybrid Approach (Audit + Archive + Renovate)
**Date:** 2026-06-02 | **Status:** Execution Ready

---

## Audit Methodology

1. **Scanned:** `app/api/v1/` (25 domains), `lib/swarm/` (15+ agents), `lib/openclaw/`, dashboard sections
2. **Rule:** If a module is only consumed by itself or by other archived modules → ARCHIVE
3. **Rule:** If a module is on the critical path (Hotel → Supplier → Order → ETA → Factoring) → KEEP
4. **Rule:** If a module is imported by critical path but is low-value → REFACTOR to remove dependency

---

## Archive List (Move to `archive/` — preserved, not deleted)

### 1. Swarm Agent System (High Complexity, Low Immediate Value)
**Rationale:** 15+ agents orchestrating theoretical tasks. Not on critical transaction flow. Distracts from core marketplace.

| File/Dir | Import Status | Action |
|---|---|---|
| `lib/swarm/agents/` | Imported by `lib/swarm/orchestrator.ts` and API routes only | Archive entire directory |
| `lib/swarm/orchestrator.ts` | Self-contained | Archive |
| `lib/swarm/scheduler.ts` | Used by swarm + openclaw | Archive |
| `lib/swarm/monitoring.ts` | Self-contained | Archive |
| `lib/swarm/acquisition-engine.ts` | Used by leads API + swarm | Archive |
| `lib/swarm/supplier-sources.ts` | Used by acquisition engine | Archive |
| `lib/swarm/toolkit.ts` | Self-contained | Archive |
| `lib/swarm/workflows/` | Used by intelligence API | Archive |
| `lib/swarm/grok-brain.ts` | Used by intelligence API | Archive |
| `lib/swarm/dev-bootstrap.ts` | Self-contained | Archive |
| `lib/swarm/director.ts` | Used by swarm API | Archive |
| `app/api/v1/swarm/` | Entire domain (8 routes) | Archive |
| `app/api/v1/intelligence/workflows/` | Uses swarm workflows | Archive |
| `app/api/v1/intelligence/grok-brain/` | Uses grok-brain | Archive |
| `app/api/v1/intelligence/compass/` | Uses cashflow-compass agent | Archive |
| `app/(dashboard)/admin/ai-insights/` | AI dashboard | Archive |
| `app/(dashboard)/admin/grok-brain/` | Grok brain dashboard | Archive |
| `app/(dashboard)/ai-agents/` | Agent swarm dashboard | Archive |
| `components/ai-assistant/workspace-chatbot.tsx` | Complex chatbot | Simplify later |

### 2. OpenClaw (External Agent Framework)
**Rationale:** Abstraction layer for external agents. Core platform doesn't depend on it.

| File/Dir | Import Status | Action |
|---|---|---|
| `services/openclaw/` | Entire service | Archive |
| `orchestra/openclaw/` | Entire directory | Archive |
| `app/api/v1/openclaw/` | 2 API routes | Archive |
| `app/(dashboard)/admin/openclaw/` | Dashboard page | Archive |
| `components/openclaw/` | 2 components | Archive |
| `lib/social-media/openclaw-client.ts` | Social media client | Archive with social-media |

### 3. Social Media / Marketing Automation (Not Core)
**Rationale:** Social campaigns, content creation, scheduling. Year 2 feature.

| File/Dir | Import Status | Action |
|---|---|---|
| `lib/social-media/` | Entire directory | Archive |
| `app/api/v1/social/` | 3 API routes | Archive |
| `scripts/generate-portal-videos.py` | Video generation | Archive |
| `scripts/generate-demo-video.py` | Demo video | Archive |

### 4. Non-Critical API Domains
**Rationale:** These APIs serve features deferred to Year 2.

| Domain | Files | Action |
|---|---|---|
| `app/api/v1/whatsapp/` | 0 files (empty) | Archive |
| `app/api/v1/waiting-list/` | 1 route | Archive |
| `app/api/v1/leads/` | 5 routes | Archive (or simplify to 1 basic route) |
| `app/api/v1/cms/` | 1 route | Archive |
| `app/api/v1/design/` | 3 routes | Archive |
| `app/api/v1/ai/` | 5 routes (under `app/api/v1/ai/`) | Keep simplified version |
| `app/api/v1/checkout/` | 1 route | Evaluate — may need for payment flow |

### 5. Non-Critical Dashboard Sections
**Rationale:** These dashboards serve features not on the 6-month critical path.

| Dashboard | Action |
|---|---|
| `app/(dashboard)/ai-agents/` | Archive |
| `app/(dashboard)/analytics/` | Archive (admin reports sufficient) |
| `app/(dashboard)/dispute/` | Archive (defer dispute management) |
| `app/(dashboard)/procurement/` | Archive (redundant with hotel/ orders) |
| `app/(dashboard)/scheduler/` | Archive (swarm-related) |
| `app/(dashboard)/security/` | Archive (RBAC in admin is enough) |
| `app/(dashboard)/settings/` | Evaluate — may need basic version |
| `app/(dashboard)/shipping/` | Keep simplified (logistics tracking) |
| `app/(dashboard)/payments/` | Keep (factoring/payment visibility) |
| `app/(dashboard)/factoring/` | Keep (core feature) |
| `app/(dashboard)/eta/` | Keep (compliance visibility) |
| `app/(dashboard)/hotel/` | **KEEP** (critical path) |
| `app/(dashboard)/supplier/` | **KEEP** (critical path) |
| `app/(dashboard)/admin/` | **KEEP** (operations) |

### 6. Experimental / Scripts
**Rationale:** Useful but not production-critical.

| File | Action |
|---|---|
| `scripts/e2e-smoke-test.ts` | Keep (testing is critical) |
| `scripts/check-db.ts` | Keep |
| `scripts/fix-permissions.ts` | Keep |
| `scripts/setup-remote-db.ts` | Keep |
| `scripts/migrate-catalog-to-db.ts` | Keep |
| `scripts/generate-*-video*` | Archive |
| `scripts/deploy-swarm.sh` | Archive |

---

## KEEP List (Critical Path)

### Core Transaction Flow
| Module | Why It's Critical |
|---|---|
| `app/api/v1/auth/` | Authentication — all routes depend on this |
| `app/api/v1/hotel/` | Hotel orders, catalog browse |
| `app/api/v1/supplier/` + `app/api/v1/suppliers/` | Supplier catalog, order management |
| `app/api/v1/orders/` | Order lifecycle — THE core flow |
| `app/api/v1/invoices/` | Invoice generation, history |
| `app/api/v1/eta/` | ETA submission, validation, callback |
| `app/api/v1/factoring/` | Factoring inquiries, funding, bridge |
| `app/api/v1/fintech/` | Financial callbacks (Oliv, etc.) |
| `app/api/v1/payments/` | Payment processing |
| `app/api/v1/products/` | Product catalog API |
| `app/api/v1/admin/` | Operations dashboard APIs |
| `app/api/v1/checkout/` | Evaluate — needed for payment completion |

### Business Logic Libraries
| Module | Why It's Critical |
|---|---|
| `lib/eta/` | ETA compliance engine |
| `lib/fintech/` | Factoring, risk, Smart Fixes, revenue calc |
| `lib/auth/` | Authority Matrix, RBAC, sessions |
| `lib/prisma.ts` | Database singleton |
| `lib/tenant/` | Tenant context (simplify if possible) |
| `lib/validators/` | Zod schemas — input validation |
| `lib/notifications/` | Email alerts for orders |
| `lib/i18n/` | Translations |

### Dashboards
| Module | Why It's Critical |
|---|---|
| `app/(dashboard)/hotel/` | Hotel procurement portal |
| `app/(dashboard)/supplier/` | Supplier Central |
| `app/(dashboard)/admin/` | Operations, GMV tracking |
| `app/(dashboard)/factoring/` | Factoring portal |
| `app/(dashboard)/orders/` | Order management |
| `app/(dashboard)/payments/` | Payment visibility |

### Marketing Site
| Module | Why It's Critical |
|---|---|
| `app/(marketing)/` | Landing, pricing, about, solutions — mostly done, keep all |

---

## REFACTOR List (Imported by Critical Path But Over-Engineered)

### 1. Swarm Model Router
**Problem:** `lib/factoring/credit-lines/[id]/analyze/route.ts` imports `executeLLM` from `lib/swarm/model-router.ts`.
**Solution:** Extract `executeLLM` to `lib/ai/llm.ts` (independent of swarm). Then archive swarm.

### 2. AI Assistant Components
**Problem:** `components/ai-assistant/` has complex workspace chatbot. Some components may be used by hotel dashboard.
**Solution:** Simplify to basic chat interface. Archive advanced features.

### 3. Intelligence API
**Problem:** `app/api/v1/intelligence/` has public AI endpoint used by marketing site chat.
**Solution:** Keep simplified public AI route. Archive grok-brain, workflows, compass.

---

## Execution Order

### Phase 1: Foundation Safety (Do Not Break Build)
1. **Extract** `executeLLM` from swarm to `lib/ai/llm.ts`
2. **Update** factoring route to use new import
3. **Verify** build still compiles

### Phase 2: Archive Self-Contained Modules
4. Move `services/openclaw/` → `archive/openclaw/`
5. Move `orchestra/openclaw/` → `archive/openclaw/orchestra/`
6. Move `lib/social-media/` → `archive/social-media/`
7. Move `scripts/generate-*-video*` → `archive/scripts/`

### Phase 3: Archive Swarm (After Dependency Extraction)
8. Move `lib/swarm/` → `archive/swarm/` (after Phase 1)
9. Move `app/api/v1/swarm/` → `archive/api/swarm/`
10. Move `app/api/v1/intelligence/grok-brain/` → `archive/api/intelligence/grok-brain/`
11. Move `app/api/v1/intelligence/workflows/` → `archive/api/intelligence/workflows/`
12. Move `app/api/v1/intelligence/compass/` → `archive/api/intelligence/compass/`
13. Move `app/(dashboard)/ai-agents/` → `archive/dashboards/ai-agents/`
14. Move `app/(dashboard)/admin/grok-brain/` → `archive/dashboards/admin-grok-brain/`
15. Move `app/(dashboard)/admin/ai-insights/` → `archive/dashboards/admin-ai-insights/`

### Phase 4: Archive Non-Critical APIs
16. Move `app/api/v1/whatsapp/` → `archive/api/whatsapp/`
17. Move `app/api/v1/waiting-list/` → `archive/api/waiting-list/`
18. Move `app/api/v1/leads/` → `archive/api/leads/`
19. Move `app/api/v1/cms/` → `archive/api/cms/`
20. Move `app/api/v1/design/` → `archive/api/design/`
21. Move `app/api/v1/openclaw/` → `archive/api/openclaw/`
22. Move `app/api/v1/social/` → `archive/api/social/`

### Phase 5: Archive Non-Critical Dashboards
23. Move `app/(dashboard)/dispute/` → `archive/dashboards/dispute/`
24. Move `app/(dashboard)/procurement/` → `archive/dashboards/procurement/`
25. Move `app/(dashboard)/scheduler/` → `archive/dashboards/scheduler/`
26. Move `app/(dashboard)/security/` → `archive/dashboards/security/`
27. Move `app/(dashboard)/analytics/` → `archive/dashboards/analytics/`

### Phase 6: Verify & Clean
28. Run `npm run build` — fix any broken imports
29. Remove unused dependencies from `package.json`
30. Update `tsconfig.json` paths if needed
31. Update route manifests / middleware if needed

---

## Estimated Impact

| Metric | Before | After |
|---|---|---|
| **TypeScript files** | ~400+ | ~180–220 |
| **API domains** | 25 | 10–12 |
| **Dashboard sections** | 15+ | 8–10 |
| **Build time** | Slow (many routes to compile) | Faster |
| **Cognitive load** | High (developer navigates 400 files) | Medium (focused scope) |
| **Time to understand codebase** | 2–3 weeks | 3–5 days |

---

## What Survives (The New Scope)

```
app/
  (marketing)/          → Public site (keep all)
  (auth)/              → Login, register (keep)
  (dashboard)/
    hotel/             → Procurement portal (core)
    supplier/          → Supplier Central (core)
    factoring/         → Factoring portal (core)
    admin/             → Operations (simplified)
    orders/            → Order management (core)
    payments/          → Payment visibility (core)
    eta/               → Compliance dashboard (keep)
    settings/          → Basic settings (simplified)
  api/v1/
    auth/              → Auth APIs
    hotel/             → Hotel APIs
    supplier/          → Supplier APIs
    suppliers/         → Supplier directory
    orders/            → Order lifecycle
    invoices/          → Invoice management
    eta/               → ETA submission/validation
    factoring/         → Factoring flow
    fintech/           → Financial callbacks
    payments/          → Payment processing
    products/          → Catalog API
    admin/             → Operations APIs
    ai/                → Simplified public AI (1 route)
    intelligence/      → Simplified (keep public route only)
    checkout/          → Evaluate

lib/
  eta/                 → Compliance engine (keep)
  fintech/             → Factoring, risk, Smart Fixes (keep)
  auth/                → Authority Matrix, RBAC (keep)
  ai/                  → NEW: Simple LLM wrapper (from swarm)
  prisma.ts            → Database (keep)
  tenant/              → Tenant context (simplify)
  validators/          → Zod schemas (keep)
  notifications/       → Email alerts (keep)
  i18n/                → Translations (keep)
  credit-gate.ts       → Credit checks (keep)
  zod.ts               → Shared schemas (keep)
  integrations/        → Third-party integrations (keep)

components/
  ui/                  → shadcn/ui primitives (keep)
  ai-assistant/        → Simplify to basic chat
  dashboards/          → Keep hotel, supplier, factoring, admin
  auth/                → Auth forms (keep)
  layout/              → Dashboard shell, sidebar (keep)
  marketplace/         → Marketing components (keep)
  shared/              → Cross-cutting utilities (keep)
```

---

## Risks

1. **Broken imports:** Some archived modules may be imported by kept modules. Need careful verification.
2. **Middleware references:** `middleware.ts` may reference archived routes or components.
3. **Prisma schema:** Some models may reference archived features. Review schema before cleanup.
4. **Environment variables:** `.env` may have configs for archived services. Clean up.

---

## Recommendation

**Execute this manifest.** Do not debate it further. The codebase is too broad to be buildable by a small team. Archive the theoretical work. Renovate the foundation. Rebuild only the critical path.

The archived code is not deleted — it's in `archive/`. In 12 months, when you have 50 hotels and a team of 5, you can pull pieces back.

---

*Audit complete. Ready for execution.*
