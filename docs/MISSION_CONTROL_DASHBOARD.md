# Mission Control Dashboard
## Build Progress Monitoring — Headlines for the Driver
**Date:** 2026-06-02 | **Version:** 1.0 | **Syncs to:** `app/(dashboard)/admin/mission-control/`

---

## Dashboard Philosophy

**One screen. One truth. No noise.**

The Mission Control dashboard answers three questions:
1. **Where are we?** — Current phase, % complete, what's done, what's blocked.
2. **What's broken?** — API keys missing, integrations down, build failures.
3. **What's next?** — Next 3 tasks, who owns them, when they're due.

**Build metrics ONLY.** No runtime metrics (orders, GMV, revenue). Those belong to the Operations dashboard (separate, launched in Phase 7).

---

## Widget Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  MISSION CONTROL — BUILD PHASE: [Phase 2: Core Transaction]     │
│  Overall Progress: ████████░░░░ 62%                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ PHASE STATUS    │  │ API KEY BOARD   │  │ BLOCKERS        │ │
│  │                 │  │                 │  │                 │ │
│  │ Phase 0: ✅     │  │ PostgreSQL: ✅  │  │ Oliv API:       │ │
│  │ Phase 1: ✅     │  │ ETA Sandbox: ✅ │  │ Waiting for     │ │
│  │ Phase 2: 🔄     │  │ ETA Prod: 🔄    │  │ credentials     │ │
│  │ Phase 3: ⏳     │  │ Oliv Finance: ❌│  │                 │ │
│  │ Phase 4: ⏳     │  │ Paymob: ✅      │  │                 │ │
│  │ Phase 5: ⏳     │  │ Groq AI: ✅     │  │                 │ │
│  │ Phase 6: ⏳     │  │                 │  │                 │ │
│  │ Phase 7: ⏳     │  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ INTEGRATION     │  │ BUILD HEALTH    │  │ NEXT 3 TASKS    │ │
│  │ HEALTH          │  │                 │  │                 │ │
│  │                 │  │ Build: ✅ Pass  │  │ 1. Hotel PO     │ │
│  │ ETA Pipeline:   │  │ Tests: ⚠️ 12/15 │  │    builder      │ │
│  │   ✅ Healthy    │  │ Lint: ✅ Pass   │  │    [Dev 1]      │ │
│  │                 │  │ TypeCheck: ✅   │  │    Due: Jun 5   │ │
│  │ Factoring:      │  │                 │  │                 │ │
│  │   ⏳ Not Ready  │  │ Coverage: 34%   │  │ 2. Supplier     │ │
│  │                 │  │                 │  │    catalog      │ │
│  │ Auth/RBAC:      │  │ Last Deploy:    │  │    upload       │ │
│  │   ✅ Enforced   │  │   2 hours ago   │  │    [Dev 1]      │ │
│  │                 │  │                 │  │    Due: Jun 7   │ │
│  │ Payments:       │  │                 │  │                 │ │
│  │   ✅ Connected  │  │                 │  │ 3. Authority    │ │
│  │                 │  │                 │  │    Matrix       │ │
│  │                 │  │                 │  │    threshold    │ │
│  │                 │  │                 │  │    [Dev 1]      │ │
│  │                 │  │                 │  │    Due: Jun 9   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  AGENT ACTIVITY LOG                                      │   │
│  │  [14:32] API Key Agent: Acquired Groq API key           │   │
│  │  [14:15] Build Orchestrator: Phase 2 task 4 complete    │   │
│  │  [13:58] UI Agent: Design system v2 audit submitted     │   │
│  │  [13:20] API Key Agent: Sent follow-up to Oliv Finance  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Widget Specifications

### Widget 1: Phase Status

| Phase | Status Icon | % Complete | Exit Criteria Met |
|---|---|---|---|
| 0: Foundation Cleanup | ✅ | 100% | Build passes, 341 files |
| 1: Database Lock | ⏳ | 0% | PostgreSQL live, schema frozen |
| 2: Core Transaction Flow | ⏳ | 0% | Test order end-to-end |
| 3: Fintech Layer | ⏳ | 0% | Supplier paid in 48h |
| 4: Admin & Mission Control | ⏳ | 0% | Dashboard live |
| 5: UI/UX Unification | ⏳ | 0% | All pages consistent |
| 6: Integration & Testing | ⏳ | 0% | 5 pilots, 50 orders |
| 7: Pilot Launch | ⏳ | 0% | EGP 1M GMV/month |

**Data Source:** Build Orchestrator Agent writes status to `build_status.json` after each task completion.

---

### Widget 2: API Key Status Board

| Service | Key Acquired | Sandbox Working | Production Working | Owner | Last Update |
|---|---|---|---|---|---|
| PostgreSQL | ✅ | N/A | ✅ | Dev 1 | Jun 2 |
| ETA (Egypt Tax Authority) | ✅ | ✅ | ⏳ | API Agent | Jun 2 |
| Oliv Finance | ❌ | ❌ | ❌ | API Agent | Jun 2 |
| EFG Hermes Factoring | ⏳ | ⏳ | ⏳ | API Agent | Jun 2 |
| Paymob (payments) | ✅ | ✅ | ⏳ | API Agent | Jun 1 |
| Groq (AI) | ✅ | ✅ | ✅ | API Agent | Jun 1 |
| xAI/Grok (AI fallback) | ✅ | ✅ | ✅ | API Agent | Jun 1 |
| Google Maps (logistics) | ⏳ | ⏳ | ⏳ | API Agent | Jun 2 |
| FawryPay (fallback) | ⏳ | ⏳ | ⏳ | API Agent | Jun 2 |

**Data Source:** API Key Acquisition Agent updates this board via `api_keys.json`.

**Color coding:**
- ✅ Green: Working in production
- 🔄 Yellow: Sandbox working, production pending
- ⏳ Gray: In progress
- ❌ Red: Blocked / failed

---

### Widget 3: Blockers

| Priority | Blocker | Owner | Impact | Resolution Target |
|---|---|---|---|---|
| 🔴 P0 | Oliv Finance API credentials not received | API Agent | Phase 3 blocked | Jun 5 |
| 🟡 P1 | ETA production UUID generation failing | Dev 1 | Phase 2 delayed | Jun 6 |
| 🟡 P1 | Hotel portal mobile-responsive issues | UI Agent | Phase 5 prep | Jun 10 |
| 🟢 P2 | Design system v2 not applied to auth pages | UI Agent | Phase 5 | Jun 12 |

**Data Source:** Build Orchestrator Agent escalates blockers. Any task overdue by > 24h becomes a blocker.

---

### Widget 4: Integration Health

| Integration | Status | Last Test | Notes |
|---|---|---|---|
| ETA Submission | ✅ Healthy | 2h ago | 48/50 invoices accepted |
| ETA Callback | ✅ Healthy | 2h ago | Webhook responding |
| Factoring (Mock) | ✅ Healthy | 1h ago | Ready for Oliv switch |
| Factoring (Oliv) | ❌ Down | N/A | Waiting for credentials |
| Paymob Deposit | ✅ Healthy | 3h ago | Test deposits successful |
| Auth/RBAC | ✅ Healthy | 1h ago | All routes enforcing |
| PostgreSQL | ✅ Healthy | 5m ago | Connection pool at 12% |

**Data Source:** Health check cron job runs every 5 minutes. Results stored in `integration_health.json`.

---

### Widget 5: Build Health

| Metric | Target | Current | Status |
|---|---|---|---|
| Build Pass | 100% | 100% | ✅ |
| Type Check Pass | 100% | 100% | ✅ |
| Lint Pass | 100% | 100% | ✅ |
| Test Pass | 100% | 80% (12/15) | ⚠️ |
| Test Coverage | 60% | 34% | ⚠️ |
| Last Deploy | < 24h | 2h ago | ✅ |
| Bundle Size | < 5MB | 3.2MB | ✅ |

**Data Source:** CI/CD pipeline writes metrics to `build_health.json` after each commit.

---

### Widget 6: Next 3 Tasks

| # | Task | Owner | Phase | Due | Status |
|---|---|---|---|---|---|
| 1 | Hotel portal: PO builder with cart | Dev 1 | 2 | Jun 5 | 🔄 In Progress |
| 2 | Supplier portal: CSV catalog upload | Dev 1 | 2 | Jun 7 | ⏳ Queued |
| 3 | Authority Matrix: GM threshold approval | Dev 1 | 2 | Jun 9 | ⏳ Queued |

**Data Source:** Build Orchestrator Agent manages task queue in `task_queue.json`.

---

### Widget 7: Agent Activity Log

**Real-time feed of agent actions:**
- Timestamp
- Agent name
- Action taken
- Result (success/failure)
- Link to detail (if applicable)

**Example entries:**
```
[14:32:15] API Key Agent → Acquired Groq API key → SUCCESS
[14:15:03] Build Orchestrator → Marked task "Hotel catalog browse" as complete → SUCCESS
[13:58:44] UI Agent → Submitted design system v2 audit report → SUCCESS
[13:20:11] API Key Agent → Sent follow-up email to Oliv Finance partnerships → PENDING
[12:45:00] Build Orchestrator → Detected blocker: ETA production failing → ESCALATED
```

**Data Source:** All agents write to shared `agent_activity.log` via `logger.ts`.

---

## Data Architecture

```
app/(dashboard)/admin/mission-control/
├── page.tsx                    # Dashboard shell
├── components/
│   ├── phase-status.tsx        # Phase 0–7 progress
│   ├── api-key-board.tsx       # API credentials grid
│   ├── blockers.tsx            # Escalated blockers
│   ├── integration-health.tsx  # Service status
│   ├── build-health.tsx        # CI/CD metrics
│   ├── next-tasks.tsx          # Task queue (top 3)
│   └── agent-log.tsx           # Activity feed
└── lib/
    ├── data-fetchers.ts        # Reads from JSON files
    └── types.ts                # Dashboard type definitions

# Data sources (written by agents, read by dashboard):
/data/mission-control/
├── build_status.json           # Written by Build Orchestrator
├── api_keys.json               # Written by API Key Agent
├── blockers.json               # Written by Build Orchestrator
├── integration_health.json     # Written by health cron
├── build_health.json           # Written by CI/CD pipeline
├── task_queue.json             # Written by Build Orchestrator
└── agent_activity.log          # Written by all agents
```

---

## Build vs. Run Separation

| | Mission Control (BUILD) | Operations Dashboard (RUN) |
|---|---|---|
| **Audience** | Developer, Founder, Build Orchestrator | Hotel GMs, Suppliers, Admin |
| **Metrics** | Build progress, API keys, test coverage, blockers | GMV, orders, deliveries, revenue |
| **Actions** | Assign tasks, escalate blockers, deploy code | Approve orders, track shipments, generate reports |
| **Time Horizon** | Days/weeks (build phases) | Hours/minutes (live operations) |
| **Data Source** | `build_status.json`, `task_queue.json` | `prisma` database (real transactions) |
| **Launch Phase** | Phase 4 (admin setup) | Phase 7 (pilot launch) |

**Critical Rule:** Mission Control NEVER touches production order data. Operations Dashboard NEVER touches build task data.

---

## Headlines for the Driver (Daily Standup Format)

Every morning, the Build Orchestrator Agent generates a headline summary:

```
MISSION CONTROL HEADLINES — June 3, 2026

🎯 PHASE: 2 (Core Transaction Flow) — 15% complete
   Yesterday: Hotel catalog browse ✅ | PO builder 🔄
   Today: Complete PO builder + start Supplier catalog upload

🔴 BLOCKERS: 1
   Oliv Finance API credentials — follow-up sent, awaiting response

✅ WINS:
   • Groq API key acquired and tested
   • PostgreSQL migration script ready for review
   • ETA sandbox passing 96% of test invoices

⚠️ RISKS:
   • Oliv delay may push Phase 3 by 1 week
   • Test coverage at 34%, target 60% by Phase 6

📋 NEXT 3 TASKS:
   1. Hotel PO builder (Dev 1, due Jun 5)
   2. Supplier CSV upload (Dev 1, due Jun 7)
   3. Authority Matrix threshold (Dev 1, due Jun 9)
```

---

*This dashboard is the cockpit for the build phase. It tells you where the plane is, what's working, what's broken, and where to land next.*
