# Parallel Execution Plan
## Option D: Database + UI + Foreman — All Three at Once
**Date:** 2026-06-02 | **Version:** 1.0 | **Status:** ACTIVE

---

## The Parallel Architecture

Three workstreams. Zero blocking. Coordinated by Foreman.

```
Week 1–2
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  WORKSTREAM 1       │  WORKSTREAM 2       │  WORKSTREAM 3       │
│  Database Lock      │  UI Component Lock  │  Foreman Setup      │
│  (Dev 1)            │  (Designer + Dev 2) │  (Dev 1, 2-3 days)  │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ • PostgreSQL setup  │ • Audit all pages   │ • Task queue JSON   │
│ • Schema simplify   │ • Lock components/  │ • Command parser    │
│ • Seed script       │ • Create shared/    │ • Daily headlines   │
│ • Migration test    │ • Design tokens     │ • Status board API  │
│                     │                     │ • Slack webhook     │
└─────────────────────┴─────────────────────┴─────────────────────┘
         │                     │                     │
         └─────────────────────┴─────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │   FOREMAN SYNC      │
                    │   Friday 6PM Cairo  │
                    └─────────────────────┘

Week 3–4
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  WORKSTREAM 1       │  WORKSTREAM 2       │  WORKSTREAM 3       │
│  Core Transaction   │  Shell + Auth Pages │  Foreman Live       │
│  (Dev 1)            │  (Designer + Dev 2) │  (Dev 1, 1 day/wk)  │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ • Hotel catalog     │ • Unified shell     │ • Agent tasking     │
│ • PO builder        │ • Login page        │ • Blocker detect    │
│ • Order tracking    │ • Register page     │ • Headline gen      │
│ • Supplier portal   │ • Mobile pass       │ • Mission Control   │
│   catalog upload    │   (auth only)       │   widget wiring     │
└─────────────────────┴─────────────────────┴─────────────────────┘

Week 5–6
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  WORKSTREAM 1       │  WORKSTREAM 2       │  WORKSTREAM 3       │
│  ETA + Authority    │  Hotel + Supplier   │  Mission Control    │
│  (Dev 1)            │  Dashboards         │  Dashboard          │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ • ETA production    │ • Hotel dashboard   │ • Build health      │
│ • Authority Matrix  │ • Supplier dash     │   widget            │
│ • Payment Guarantee │ • Factoring dash    │ • API key board     │
│ • Admin tables      │ • Admin dash        │ • Integration       │
│                     │ • Accessibility     │   health widget     │
└─────────────────────┴─────────────────────┴─────────────────────┘

Week 7–8
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  WORKSTREAM 1       │  WORKSTREAM 2       │  WORKSTREAM 3       │
│  Fintech Layer      │  Mobile + Polish    │  Monitoring         │
│  (Dev 1)            │  (Designer + Dev 2) │  (Dev 1, 1 day)     │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ • Oliv integration  │ • Mobile responsive │ • Health checks     │
│ • Risk Engine       │   (all dashboards)  │ • Coverage tracking │
│ • Smart Fixes       │ • Final accessibility│ • Load test setup   │
│ • Factoring portal  │ • Component compliance│ • Alert tuning      │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

---

## Workstream 1: Database Lock + Core Transaction (Dev 1)

### Owner: Developer 1 (Platform Engineer)
**Skills:** Next.js, Prisma, PostgreSQL, API design, RBAC, ETA

### Week 1: PostgreSQL + Schema Lock

| Day | Task | Deliverable | Blocks |
|---|---|---|---|
| 1 | Install PostgreSQL locally + staging | `psql` connects, user created | Day 2 |
| 2 | Create simplified schema (single-tenant) | `schema-simplified.prisma` | Day 3 |
| 3 | Migrate dev database | `prisma migrate dev` succeeds | Day 4 |
| 4 | Write seed script: 20 suppliers, 5 hotels | `prisma/seed-simplified.ts` | Day 5 |
| 5 | Test seed + backup pipeline | Seed runs in < 30s, backup works | Week 2 |

### Week 2: Hotel + Supplier Portal Foundations

| Day | Task | Deliverable | Blocks |
|---|---|---|---|
| 6 | Hotel portal: Catalog browse API + UI | `/dashboard/hotel/catalog` loads | Day 7 |
| 7 | Hotel portal: Catalog search + filters | Search works, filters apply | Day 8 |
| 8 | Supplier portal: Catalog upload API | CSV + manual upload works | Day 9 |
| 9 | Supplier portal: Product management | Add/edit/delete products | Day 10 |
| 10 | Integration test: Hotel browses → Supplier lists | End-to-end flow works | Week 3 |

### Week 3: PO Builder + Order Lifecycle

| Day | Task | Deliverable | Blocks |
|---|---|---|---|
| 11 | PO builder: Add to cart, multi-SKU | Cart persists, quantities editable | Day 12 |
| 12 | PO builder: Submit order API | Order creates with status DRAFT | Day 13 |
| 13 | Authority Matrix: 1-level approval | GM approves orders > threshold | Day 14 |
| 14 | Order tracking: Status transitions | DRAFT → PENDING → APPROVED → CONFIRMED | Day 15 |
| 15 | Supplier portal: Order management | Accept/reject/ship orders | Week 4 |

### Week 4: ETA + Payment Guarantee

| Day | Task | Deliverable | Blocks |
|---|---|---|---|
| 16 | ETA production pipeline | Invoice submits to ETA, gets UUID | Day 17 |
| 17 | ETA callback handler | Status updates: SUBMITTED → ACCEPTED | Day 18 |
| 18 | Payment Guarantee gate | No order moves to CONFIRMED without guarantee | Day 19 |
| 19 | Admin dashboard: Orders table | View all orders, filter by status | Day 20 |
| 20 | Integration test: Full flow | Hotel → Supplier → ETA → CONFIRMED | Week 5 |

---

## Workstream 2: UI Unification (Designer + Dev 2)

### Owner: UI/UX Designer (Part-time) + Developer 2 (Frontend-focused)
**Skills:** Figma/Design, React, Tailwind, Accessibility

### Week 1: Component Lock + Shell

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| 1 | Audit all pages, screenshot inventory | Designer | Audit report with screenshots |
| 2 | Lock design tokens (colors, typography, spacing) | Designer | `app/globals.css` update |
| 3 | Create `components/shared/` directory | Dev 2 | `dashboard-shell.tsx`, `sidebar.tsx` |
| 4 | Build locked button, card, input, table | Dev 2 | 4 components in `components/ui/` |
| 5 | Build `page-header.tsx`, `stat-card.tsx`, `data-table.tsx` | Dev 2 | 3 shared components |

### Week 2: Auth Pages (Priority 0)

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| 6 | Design auth pages (login, register, forgot) | Designer | Figma mockups |
| 7 | Build login page with new shell | Dev 2 | `/login` glassmorphism |
| 8 | Build register page | Dev 2 | `/register` matching login |
| 9 | Build forgot-password + verify-email | Dev 2 | Both pages styled |
| 10 | Mobile pass (auth pages only) | Dev 2 | Works on 320px |

### Week 3: Hotel Dashboard

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| 11 | Design hotel dashboard pages | Designer | Figma mockups |
| 12 | Build hotel dashboard shell + home | Dev 2 | `/dashboard/hotel` unified |
| 13 | Build catalog page | Dev 2 | `/dashboard/hotel/catalog` |
| 14 | Build orders page | Dev 2 | `/dashboard/hotel/orders` |
| 15 | Mobile pass (hotel pages) | Dev 2 | Works on 768px |

### Week 4: Supplier + Admin Dashboards

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| 16 | Design supplier dashboard | Designer | Figma mockups |
| 17 | Build supplier shell + home | Dev 2 | `/dashboard/supplier` unified |
| 18 | Build products + orders pages | Dev 2 | Supplier pages styled |
| 19 | Build admin dashboard | Dev 2 | `/dashboard/admin` unified |
| 20 | Mobile pass (supplier + admin) | Dev 2 | All responsive |

### Week 5–6: Factoring + Accessibility

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| 21–22 | Design factoring dashboard | Designer | Figma mockups |
| 23–24 | Build factoring pages | Dev 2 | `/dashboard/factoring` styled |
| 25–26 | Accessibility pass | Dev 2 | Lighthouse ≥ 90 all pages |
| 27–28 | Component compliance check | Dev 2 | Zero custom components outside locked dirs |
| 29–30 | Final polish + bug fixes | Dev 2 | All pages pixel-perfect |

---

## Workstream 3: Foreman (Build Orchestrator)

### Owner: Developer 1 (2–3 days initial setup, then 1 day/week maintenance)

### Week 1: Foundation

| Day | Task | Deliverable | Blocks |
|---|---|---|---|
| 1 | Create `data/build/` directory structure | `tasks.json`, `phases.json`, `blockers.json` | Day 2 |
| 2 | Build task queue JSON schema + CRUD API | `app/api/v1/admin/build/tasks/route.ts` | Day 3 |
| 3 | Build phase gate logic | `app/api/v1/admin/build/phases/route.ts` | Day 4 |
| 4 | Build blocker escalation logic | Auto-escalation after 24h | Day 5 |
| 5 | Build daily headline generator | Template engine for headlines | Week 2 |

### Week 2: Mission Control Widgets

| Day | Task | Deliverable | Blocks |
|---|---|---|---|
| 6 | Build Phase Status widget | React component | Day 7 |
| 7 | Build API Key Board widget | React component | Day 8 |
| 8 | Build Blockers widget | React component | Day 9 |
| 9 | Build Next Tasks widget | React component | Day 10 |
| 10 | Wire all widgets to JSON data sources | Dashboard loads real data | Week 3 |

### Week 3+: Maintenance Mode

- 1 day per week: Review task queue, update headlines, escalate blockers
- Agent tasking: Assign tasks to Keymaster, Archivist, etc.
- Status reporting: Generate daily headlines for Driver (you)

---

## Dependency Matrix

| Dependency | From | To | Mitigation |
|---|---|---|---|
| PostgreSQL schema | Workstream 1 Day 2 | Workstream 1 Day 3 | Dev 1 owns both — no external block |
| Seed data | Workstream 1 Day 4 | Workstream 1 Day 6 | Dev 1 owns both |
| Hotel catalog API | Workstream 1 Day 6 | Workstream 2 Day 12 | UI uses mock data until API ready |
| Auth pages styled | Workstream 2 Day 10 | Phase 6 pilot | Pilot can start with unstyled auth if needed |
| ETA production | Workstream 1 Day 16 | Phase 3 fintech | Use sandbox until production ready |
| Foreman task queue | Workstream 3 Day 2 | Workstream 3 Day 6 | Dev 1 owns both |

**Mock data strategy:** Workstream 2 uses mock API responses until Workstream 1 delivers real APIs. No blocking.

---

## Sync Points (All Hands)

| When | Who | Purpose |
|---|---|---|
| **Daily 9:00 AM** | Dev 1 + Dev 2 + You | 5-minute standup: yesterday, today, blockers |
| **Friday 6:00 PM** | Everyone + Foreman headline | Week review: what shipped, what's stuck, next week plan |
| **End of Week 2** | Everyone | Phase 0 exit review: build passes, 341 files, schema locked |
| **End of Week 4** | Everyone | Phase 2 midpoint: hotel catalog + PO builder working? |
| **End of Week 6** | Everyone | Phase 2 exit: end-to-end flow complete? |
| **End of Week 8** | Everyone | Phase 3 + UI exit: factoring works, all pages styled |

---

## Risk Mitigation for Parallel Work

| Risk | Probability | Mitigation |
|---|---|---|
| Dev 1 blocked waiting for Dev 2 | Low | Dev 1 uses mock UI. Dev 2 uses mock APIs. |
| Dev 2 blocked waiting for Dev 1 | Low | Dev 2 builds with static data. APIs plugged in later. |
| Designer delays | Medium | Designer starts 1 week before Dev 2. Figma-first workflow. |
| Foreman becomes distraction | Medium | Cap at 3 days initial + 1 day/week. No feature creep. |
| PostgreSQL migration breaks | Low | Full backup before migration. Rollback tested. |
| UI rewrite breaks existing features | Medium | Component lock prevents drift. Code review enforces compliance. |

---

## Resource Allocation

| Role | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 | Week 7 | Week 8 |
|---|---|---|---|---|---|---|---|---|
| **Dev 1** | DB 100% | Features 100% | Features 100% | ETA 80% + Foreman 20% | Features 80% + Foreman 20% | Features 80% + Foreman 20% | Fintech 80% + Foreman 20% | Fintech 80% + Foreman 20% |
| **Dev 2** | UI 100% | UI 100% | UI 100% | UI 100% | UI 100% | UI 80% + Tests 20% | Polish 100% | Polish 100% |
| **Designer** | Audit 100% | Auth 100% | Hotel 100% | Supplier 100% | Factoring 100% | Review 100% | — | — |
| **You** | Strategy 50% | Hotels 50% | Hotels 50% | Hotels 50% | Hotels 50% | Hotels 50% | Hotels 50% | Hotels 50% |

**Designer is part-time (3 days/week). Dev 2 is full-time. You spend 50% time on hotel relationship building.**

---

## Success Criteria by Week

| Week | Workstream 1 | Workstream 2 | Workstream 3 |
|---|---|---|---|
| 1 | PostgreSQL connects, schema simplified | Component library locked, shell built | Task queue JSON + CRUD API |
| 2 | Hotel catalog + supplier upload works | Auth pages styled, mobile OK | Phase status + blockers widgets |
| 3 | PO builder + order tracking works | Hotel dashboard styled | API key board + next tasks widgets |
| 4 | ETA production + Authority Matrix | Supplier + admin styled | Mission Control dashboard live |
| 5 | Payment Guarantee + admin tables | Factoring styled | Agent tasking active |
| 6 | Oliv integration (mock) | Accessibility ≥ 90 | Daily headlines generating |
| 7 | Risk Engine + Smart Fixes | Mobile responsive all pages | Health checks running |
| 8 | Full fintech flow | Component compliance 100% | Monitoring + alerts tuned |

---

## Foreman: Daily Headline Example (Week 3)

```
BUILD HEADLINES — June 17, 2026 (Week 3, Day 3)

🎯 PHASE: 2 (Core Transaction Flow) — 35% complete

WORKSTREAM 1 (Dev 1):
  ✅ PO builder: Add to cart — COMPLETE
  🔄 PO builder: Submit order — IN PROGRESS (due Jun 18)
  ⏳ Authority Matrix: GM threshold — QUEUED (due Jun 20)

WORKSTREAM 2 (Dev 2 + Designer):
  ✅ Hotel dashboard shell — COMPLETE
  🔄 Hotel catalog page — IN PROGRESS (due Jun 18)
  ⏳ Hotel orders page — QUEUED (due Jun 19)

WORKSTREAM 3 (Foreman):
  ✅ Mission Control widgets — COMPLETE
  🔄 Agent tasking to Keymaster — IN PROGRESS

BLOCKERS:
  🟡 Oliv Finance: Still awaiting credentials (Day 4 of request)

AGENT ACTIVITY:
  [08:00] Foreman — Generated headlines
  [07:45] Keymaster — Sent 2nd follow-up to Oliv
  [07:30] Stylist — Submitted hotel catalog page design
```

---

## Bottom Line

**Three workstreams. Eight weeks. One goal: Hotel buys chicken, supplier gets paid, ETA is happy, UI looks premium.**

No blocking. Mock data where APIs aren't ready. Component lock prevents drift. Foreman keeps everyone aligned.

---

*Parallel execution plan by Agent Swarm — Business Strategist + Technical Auditor.*
