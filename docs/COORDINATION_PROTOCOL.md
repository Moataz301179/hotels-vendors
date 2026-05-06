# Kimi × OpenClaw Coordination Protocol

> **Version:** 1.0  
> **Date:** 2026-05-06  
> **Status:** Active

---

## 1. Architecture Overview

```
┌─────────────────┐     design/research      ┌─────────────────┐
│   OpenClaw      │ ◄──────────────────────► │   Kimi (CLI)    │
│  (Port 18789)   │    swarm job queue       │  (This session) │
│  (Port 8000)    │ ◄──────────────────────► │                 │
└─────────────────┘                          └─────────────────┘
         │                                            │
         ▼                                            ▼
┌─────────────────┐                          ┌─────────────────┐
│  Browser Agent  │                          │  Backend / API  │
│  - Navigate     │                          │  - Prisma       │
│  - Extract      │                          │  - BullMQ       │
│  - Screenshot   │                          │  - TypeScript   │
│  - Scrape       │                          │  - RBAC         │
└─────────────────┘                          └─────────────────┘
         │                                            │
         └────────────────┬───────────────────────────┘
                          ▼
                   ┌─────────────┐
                   │   Vercel    │
                   │  Production │
                   │   (Live)    │
                   └─────────────┘
```

---

## 2. Division of Labor

### OpenClaw Owns
| Domain | Examples |
|---|---|
| **Visual Design** | Landing page iterations, dashboard layouts, component styling, responsive behavior |
| **Web Research** | Competitor analysis, supplier directory scraping, pricing benchmarking |
| **Browser Automation** | Form testing, KYC flow validation, screenshot comparisons |
| **SEO & Content** | Keyword research, meta tag optimization, structured data validation |
| **UX Validation** | Accessibility audits, Core Web Vitals measurement, cross-browser testing |

### Kimi Owns
| Domain | Examples |
|---|---|
| **Database Schema** | Prisma migrations, indexing, tenant isolation, RLS |
| **API Routes** | Zod validation, RBAC enforcement, error handling, versioning |
| **Business Logic** | Fee calculations, authority matrix, ETA compliance, factoring flows |
| **System Integration** | OpenClaw tool wiring, webhook handlers, queue workers |
| **Code Quality** | TypeScript strictness, test coverage, refactoring, security audits |
| **Deployment** | Vercel builds, env var management, CI/CD pipelines |

---

## 3. Communication Bus: The Swarm Job Queue

Instead of real-time chat between AIs, we use the **BullMQ job queue** as the handoff mechanism.

### How It Works
1. **OpenClaw completes research** → stores findings in its workspace
2. **Kimi creates a Swarm Job** → dispatches to the appropriate agent
3. **Agent executes autonomously** → uses OpenClaw tools via the automation engine
4. **Results stored in memory** → both systems can read from Prisma + Redis

### Example Workflow
```
You: "Find 50 suppliers from GAFI directory"
  → OpenClaw scrapes directory, saves to workspace
  → You: "Kimi, build an import API for supplier data"
  → Kimi creates /api/v1/suppliers/bulk-import
  → Kimi dispatches swarm job: "Validate import UI flow"
  → OpenClaw navigates to /admin/suppliers, tests upload, reports back
```

---

## 4. Where to Type Requests

### Type in OpenClaw Chat (`http://127.0.0.1:18789/chat`)
- *"Redesign the hotel dashboard with a bento grid like Linear"*
- *"Scrape supplier data from [URL]"*
- *"Compare our landing page to FutureLog's"*
- *"Test the onboarding flow and report UX issues"*
- *"Optimize the catalog page for mobile"*

### Type in Kimi CLI (this interface)
- *"Build the fee-calculation API with idempotency keys"*
- *"Add tenant isolation to the orders query"*
- *"Fix TypeScript errors in the auth module"*
- *"Write a Prisma migration for Authority Matrix rules"*
- *"Deploy the latest changes to Vercel"*
- *"Merge the design changes from OpenClaw's workspace"*

### Type in Admin Panel (`/admin/openclaw`)
- Monitor all 15 agents, their status, recent jobs
- Trigger manual agent runs
- View OpenClaw health and connection status

---

## 5. Sync Ritual

### Daily Rhythm
| Time | Action | Owner |
|---|---|---|
| Morning | Give OpenClaw a design/research task | You |
| Midday | Give Kimi a backend/implementation task | You |
| Evening | Review outputs, decide what merges | You |

### Merge Rule
When OpenClaw finishes a design you approve:
```bash
# Preview what changed
npx tsx scripts/sync-openclaw.ts --dry-run app/(dashboard)/

# Interactive merge
npx tsx scripts/sync-openclaw.ts app/(dashboard)/

# Or auto-merge everything
npx tsx scripts/sync-openclaw.ts --auto
```

**Kimi will then:**
1. Review the merged code for TypeScript errors
2. Ensure it follows the UI System skill (glassmorphism, shadcn/ui)
3. Wire any new components to existing data APIs
4. Run `npm run build` to verify
5. Deploy to Vercel

---

## 6. Phase 1 Execution Plan (Days 1–30)

### Week 1: Infrastructure Lockdown
| Day | Kimi | OpenClaw |
|---|---|---|
| 1–2 | Fix Prisma version (7.8.0 → 6.x), add Docker Compose with PG + Redis | Design system v2 audit, reference site research |
| 3–4 | Auth.js v5 migration, session management, middleware guards | Landing page CRO analysis, competitor UX audit |
| 5–7 | RBAC enforcement on all v1 API routes, `requirePermission` gates | Scrape 200+ suppliers from 6th of October directories |

### Week 2: Tenant & Data Layer
| Day | Kimi | OpenClaw |
|---|---|---|
| 8–10 | Multi-tenant schema finalization, `tenantId` injection on all queries | Supplier onboarding UX flow design |
| 11–12 | Authority Matrix v1 implementation (database-driven rules) | Hotel procurement portal wireframes |
| 13–14 | Seed data scripts, Prisma seed with 50+ suppliers | Mobile responsiveness audit |

### Week 3: Fintech Foundation
| Day | Kimi | OpenClaw |
|---|---|---|
| 15–17 | Fee-calculation service with idempotency keys | Payment flow UX, factoring dashboard mockups |
| 18–19 | Double-entry ledger schema, non-recourse factoring logic | Catalog page optimization |
| 20–21 | Credit gate + risk engine, Smart Fix autonomy | Cross-browser testing |

### Week 4: Integration & Compliance
| Day | Kimi | OpenClaw |
|---|---|---|
| 22–24 | ETA API sandbox integration, UUID generation, digital signing | SEO content generation, structured data |
| 25–26 | BullMQ queues for ETA submission, dead-letter handling | Performance audit (Core Web Vitals) |
| 27–28 | Install Vitest + Sentry, write first test suites | Accessibility audit (WCAG 2.2 AA) |
| 29–30 | End-to-end integration test, fix critical bugs, deploy | Final design polish, asset optimization |

---

## 7. Deployment Status

| Service | URL / Port | Status |
|---|---|---|
| **Production** | https://hotels-vendors.vercel.app | ✅ Live |
| **OpenClaw Gateway** | http://127.0.0.1:18789 | ✅ Online |
| **OpenClaw Automation** | http://localhost:8000 | ✅ Healthy |
| **Next.js Dev** | http://localhost:3000 | ✅ Running |
| **PostgreSQL** | localhost:5432 | ✅ Connected |
| **Redis** | localhost:6379 | ✅ Connected |

---

## 8. Next Immediate Actions

1. **Verify production deployment** — visit https://hotels-vendors.vercel.app
2. **Run first proactive swarm job** — trigger Lead Scout to scrape suppliers
3. **Start OpenClaw design iteration** — give it a specific design task
4. **Begin Phase 1 Week 1** — Kimi starts Auth.js migration while OpenClaw researches

---

*This protocol is a living document. Update it as the workflow evolves.*
