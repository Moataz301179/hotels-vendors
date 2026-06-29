# Hotels Vendors — Platform Architecture & Execution Roadmap

> **Last Updated:** 2026-06-29  
> **Manager:** AI Supervisor (Kimi 2.6 Swarm Orchestrator)  
> **Status:** MVP Skeleton → Production Hardening (Phase 1.5)

---

## What Exists Now (MVP+ Skeleton)

### Backend ✅ (Production-Grade Foundation)
- **29+ API endpoints** across v1 routes: auth, hotels, suppliers, products, orders, invoices, users, authority, ETA, analytics, intelligence, cart, checkout, factoring, payments
- **Prisma schema** with 20+ models including SwarmJob, SwarmEvent, ModelHealth
- **PostgreSQL** database with full migration history
- **Auto-posting accounting journal entries** with double-entry safeguards
- **Role-based module filtering** (Hotel / Supplier / Factoring / Shipping / Admin)
- **Authority Matrix** v1 with multi-level approval chains
- **File upload** system with document storage
- **Real-time notifications** via email + WhatsApp workers

### Frontend ✅ (Functional Dashboards)
- Landing page (marketplace hero with live product grid)
- App shell (sidebar, header, role switcher)
- Dashboard, Catalog, Supplier Central, Orders, Invoices, Accounting, AI Inventory, Hotels, Intelligence
- **Swarm Command Center** (admin) — agent grid, job queue, health metrics, orchestrator
- 5 product categories: F&B, Consumables, Guest Supplies, FF&E, Services
- **Glassmorphism dark theme** with Tailwind v4

### Swarm Infrastructure ✅ (The Missing Piece — NOW FIXED)
- **28 specialized agents** across 8 squads with system prompts, capabilities, tools
- **BullMQ job queues** per squad with Redis backend
- **Director orchestrator** (The Winning Horse) — battle plans, mission assignment, performance review
- **Agent executor** with autonomous tool use (3-round ReAct loop)
- **Memory system** — hybrid Prisma persistent + Redis hot cache
- **Monitoring & event logging** — health dashboard, squad performance
- **Model router** — Ollama primary → Groq → OpenRouter → Kimi fallback chain
- **Scheduled jobs** — Director daily, lead scout every 4h, price benchmark daily, health check every 2h
- **Docker Compose swarm** — full stack: app, postgres, redis, ollama, openclaw, agent0, swarm-worker, nginx

---

## What Was Broken (Fixed 2026-05-23)

| Issue | Impact | Fix |
|---|---|---|
| Swarm workers only initialized in Docker worker container | Jobs queued but never processed. Only 1 agent "worked" via direct API calls. | `lib/swarm/dev-bootstrap.ts` + `npm run swarm` + auto-bootstrap on orchestrate API call |
| No multi-agent task dispatcher | Kimi 2.6 UI sent 1 prompt → got 1 response. No parallel agent execution. | `lib/swarm/orchestrator.ts` — analyzes task, assigns multiple agents, dispatches in parallel |
| ROADMAP.md was 3 weeks stale | P0 features marked "Not started" despite being built | This document — updated to reflect actual state |
| No orchestrator UI in admin dashboard | Admins could only trigger Director cycle or single agents | Swarm dashboard now has "🎯 Orchestrate" tab — type task → dispatch swarm |

---

## Current Execution Priorities

### Phase 1 — Foundation (IN PROGRESS → 80% Complete)

| # | Task | Owner | Status | Blockers |
|---|---|---|---|---|
| 1.1 | PostgreSQL + Prisma schema for all core models | db-architect | ✅ Done | — |
| 1.2 | Auth.js v5 sessions + JWT + RBAC middleware | api-security | ✅ Done | — |
| 1.3 | Authority Matrix v1 — approval chains | authority-enforcer | ✅ Done | Needs UI polish |
| 1.4 | ETA API sandbox integration + UUID signing | eta-officer | 🔄 In Progress | Waiting for ETA sandbox access |
| 1.5 | Design system v1 — glassmorphism, bento grids | procurement-designer | ✅ Done | — |
| 1.6 | Master registry schema + seed data | catalog-curator | ✅ Done | 50+ suppliers seeded |
| 1.7 | **Swarm infrastructure — workers, orchestrator, monitoring** | cto-director | ✅ **FIXED** | — |
| 1.8 | Shopping cart + PO builder + checkout | order-engineer | ✅ Done | Needs payment gateway hook |

### Phase 2 — Pilot (Days 31–60)

| # | Task | Owner | Status |
|---|---|---|---|
| 2.1 | Sign 5 pilot hotel groups (20+ properties) | growth-lead | 🔄 Lead scout active |
| 2.2 | Landing pages targeting "hotel procurement Egypt" | seo-strategist | ✅ Done |
| 2.3 | Hotel Procurement Portal MVP | procurement-designer | ✅ Done |
| 2.4 | Fee-calculation service with idempotency keys | fee-engineer | ✅ Done |
| 2.5 | **Product Detail Page** with specs, MOQ, lead time, bulk pricing | procurement-designer | ✅ Done |
| 2.6 | **RFQ (Request for Quote)** flow — list, create, detail, API | hotel-lead | ✅ Done |
| 2.7 | **Supplier onboarding** KYC + document verification | onboarding-specialist | 🔄 Partial (form + admin review done, doc upload stubbed) |
| 2.8 | Mobile responsive tables below 1024px | procurement-designer | ✅ Handled via overflow-x-auto |

### Phase 3 — Compliance & Scale (Days 61–90)

| # | Task | Owner | Status |
|---|---|---|---|
| 3.1 | Production ETA submission pipeline + dead-letter queue | eta-officer | 🔄 Waiting sandbox |
| 3.2 | Route-level authorization + field-level permission checks | api-security | ✅ Done (middleware.ts — JWT, RBAC, security headers) |
| 3.3 | Cross-module dependency audit + Zod on all v1 routes | the-auditor | 🔄 In Progress (~70%) |
| 3.4 | Close first factoring company term sheet | growth-lead | ❌ Not started |
| 3.5 | Search engine (Meilisearch/Elasticsearch) for 10K+ products | ai-architect | ❌ Not started |
| 3.6 | Analytics Dashboard with Recharts | hotel-analyst | ❌ Not started |
| 3.7 | Payment / Factoring Workflow (Paymob integration) | fintech-lead | ✅ Done (deposit, callback, status, dashboard API) |
| 3.8 | Review / Rating System | trust-assessor | ❌ Not started |

---

## Swarm Execution Protocol

### For Development Tasks

When you assign a task to the swarm via Kimi 2.6 or the admin dashboard:

```
1. Type task description in the Orchestrator input
2. Orchestrator analyzes: taskType, domains, complexity, deliverables
3. Agents assigned in PARALLEL:
   - Lead agent (primary domain) — owns architecture
   - Contributors (secondary domains) — specialty input
   - Auditor (critical/high complexity) — review gate
4. Jobs dispatched to BullMQ queues simultaneously
5. Workers process jobs with autonomous tool use
6. Results aggregated in memory + dashboard
```

### To Activate the Swarm

```bash
# Terminal 1: Start the dev server
npm run dev

# Terminal 2: Start the swarm workers
npm run swarm

# Or trigger via API (workers auto-bootstrap on first call)
curl -X POST http://localhost:3000/api/v1/swarm/orchestrate \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION" \
  -d '{"task":"Build RFQ flow with Authority Matrix approval"}'
```

### To Deploy on VPS

```bash
# Copy this file to VPS and run:
docker compose -f docker-compose.swarm.yml up -d

# The swarm-worker container auto-starts all workers
# Director cycle runs daily at 6 AM Cairo time
```

---

## Success Metrics

| Metric | Target | Current |
|---|---|---|---|
| API endpoints with Zod + RBAC | 100% | ~70% |
| Test coverage (business logic) | 80% | 0% |
| Pilot hotels signed | 5 groups (20 properties) | 0 |
| Suppliers onboarded | 200 | 50 (seeded) |
| Swarm jobs completed (24h) | 50+ | 0 (workers now fixed) |
| ETA sandbox integration | Live | Pending access |
| Platform build passes | Always | ✅ Passing |

---

## Decision Log

| Date | Decision | Owner | Status |
|---|---|---|---|
| 2026-05-01 | Vertical hospitality focus vs. horizontal B2B | COO / Business Strategist | **Approved** |
| 2026-05-01 | Transaction fee tier structure (2.5% → 1.5%) | COO / Fintech Architect | **Approved** |
| 2026-05-19 | Paymob integration for payment processing | Fintech Lead | **In Progress** |
| 2026-05-23 | Swarm dev bootstrapper + orchestrator | AI Supervisor | **Implemented** |
| 2026-05-23 | ROADMAP updated to reflect actual codebase state | AI Supervisor | **Approved** |

---

## Next Manager Review

**Scheduled:** 2026-05-30  
**Agenda:**
1. Swarm job completion rates (target: 50+ jobs/day)
2. Pilot hotel acquisition progress (target: 1 signed)
3. ETA sandbox access status
4. Test framework installation (Vitest + React Testing Library)
5. Product Detail Page + RFQ flow completion
