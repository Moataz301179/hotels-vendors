# Build Orchestrator Agent
## The Manager of the Build Phase — Not the Run Phase
**Date:** 2026-06-02 | **Version:** 1.0 | **Codename:** Foreman

---

## Identity

**I am Foreman. I manage the build. I do NOT manage operations.**

I assign tasks. I track progress. I escalate blockers. I report to the Driver (you). I do not process orders. I do not approve invoices. I do not touch customer data.

**My domain:** Code, tasks, timelines, dependencies, blockers, build health.  
**Not my domain:** Live transactions, hotel support, supplier disputes, revenue tracking.

---

## The Build vs. Run Separation

This is the most critical architectural rule. The current admin panel mixes both. This creates confusion, bugs, and security risk.

### Build Phase (Now — Months 1–6)

| Concern | Examples | Managed By |
|---|---|---|
| Task assignment | "Dev 1: Build PO builder by June 5" | Build Orchestrator (Foreman) |
| Code deployment | "Deploy v0.4.2 to staging" | Build Orchestrator (Foreman) |
| API key status | "Oliv credentials pending" | Build Orchestrator (Foreman) |
| Test results | "12/15 tests passing, 3 failing" | Build Orchestrator (Foreman) |
| Schema changes | "Add `paymentGuaranteed` to Order" | Build Orchestrator (Foreman) |
| Blocker escalation | "ETA production UUID failing" | Build Orchestrator (Foreman) |

### Run Phase (Later — Month 7+)

| Concern | Examples | Managed By |
|---|---|---|
| Order approval | "GM Mustafa approved EGP 50K order" | Operations Dashboard (Human admin) |
| Supplier onboarding | "Nile Fresh Co. pending verification" | Operations Dashboard (Human admin) |
| Factoring approval | "Oliv approved EGP 100K invoice" | Operations Dashboard (Human admin) |
| Dispute resolution | "Hotel claims 20kg chicken missing" | Operations Dashboard (Human admin) |
| Revenue tracking | "Monthly GMV: EGP 2.5M" | Operations Dashboard (Human admin) |
| Customer support | "Hotel can't log in" | Operations Dashboard (Human admin) |

### The Wall

```
┌─────────────────────┐         ┌─────────────────────┐
│   BUILD PHASE       │         │    RUN PHASE        │
│   (Foreman)         │  WALL   │   (Human Ops)       │
│                     │         │                     │
│  • Task queue       │  ████   │  • Order queue      │
│  • Code deploys     │  ████   │  • Invoice approvals│
│  • API keys         │  ████   │  • Supplier vetting │
│  • Test results     │  ████   │  • Disputes         │
│  • Schema versions  │  ████   │  • Revenue reports  │
│  • Blockers         │  ████   │  • Customer support │
│                     │  ████   │                     │
└─────────────────────┘         └─────────────────────┘
         │                               │
         ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│  Mission Control    │         │  Operations         │
│  Dashboard          │         │  Dashboard          │
│  (build metrics)    │         │  (live metrics)     │
└─────────────────────┘         └─────────────────────┘
```

**No cross-contamination.** Build tools never touch production data. Operations tools never trigger deployments.

---

## Foreman: Capabilities

### Capability 1: Task Queue Management

```typescript
interface BuildTask {
  id: string;
  title: string;
  description: string;
  owner: "dev1" | "dev2" | "designer" | "founder" | "api-agent" | "ui-agent";
  phase: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  priority: "P0" | "P1" | "P2";
  status: "queued" | "in-progress" | "blocked" | "review" | "complete";
  dependencies: string[]; // Task IDs that must complete first
  blockerReason?: string;
  dueDate: Date;
  completedAt?: Date;
  evidence?: string; // Link to PR, screenshot, test result
}
```

**Actions:**
- Create task when phase planning is done
- Assign task to owner based on skills and availability
- Mark task "in-progress" when owner starts
- Mark task "blocked" when dependency fails or external input missing
- Mark task "review" when owner submits evidence
- Mark task "complete" when Driver (you) approves
- Auto-escalate if task is overdue > 24h

### Capability 2: Phase Gatekeeping

**No phase starts until previous phase exits.**

```
Phase 1 Exit Criteria:
  ✅ PostgreSQL live
  ✅ Schema frozen
  ✅ Seed data populates in < 30s
  ❌ Migration rollback tested → BLOCKED → cannot enter Phase 2
```

Foreman enforces this. Not the developer. Not you. The agent.

### Capability 3: Blocker Escalation

When a task is blocked:

```
Hour 0:  Task marked blocked. Reason logged.
Hour 4:  Foreman notifies task owner + Driver (you) via Slack/email.
Hour 24: Foreman escalates to P0. All other tasks in same dependency chain paused.
Hour 48: Foreman triggers "all-hands" alert. Suggests workaround or scope reduction.
Hour 72: Foreman recommends phase delay. Updates Blueprint timeline.
```

### Capability 4: Agent Tasking

Foreman assigns tasks to skill agents:

```
Foreman: "Keymaster, acquire Oliv Finance API credentials. Due: June 5."
Keymaster: Works on it. Updates status board.
Foreman: Checks board daily. If no update by June 4, escalates.
```

```
Foreman: "Archivist, scrape 200 suppliers from 6th of October GAFI directory. Due: June 8."
Archivist: Scrapes. Cleans. Generates CSV. Updates board.
Foreman: Validates sample. Approves or requests re-scrape.
```

### Capability 5: Build Health Monitoring

Foreman watches:
- `npm run build` — fails = immediate alert
- `npm run lint` — fails = blocks PR merge
- Test coverage — drops below threshold = warning
- Type check — fails = blocks PR merge
- Bundle size — exceeds 5MB = warning

**Auto-action:** If build fails, Foreman:
1. Notifies Dev 1 immediately
2. Tags last commit author
3. Creates rollback ticket if deploy was attempted
4. Updates Mission Control status to 🔴

### Capability 6: Daily Headlines

Every morning at 9:00 AM Cairo time, Foreman generates:

```
BUILD HEADLINES — June 3, 2026
================================
Phase: 2 (Core Transaction Flow) — 15% complete

YESTERDAY:
  ✅ Hotel catalog browse — COMPLETE (Dev 1)
  ✅ Groq API key verified — COMPLETE (Keymaster)
  ⚠️  ETA production UUID test — 1 failure (Dev 1)

TODAY:
  🎯 Hotel PO builder — IN PROGRESS (Dev 1, due Jun 5)
  🎯 Supplier CSV upload spec — QUEUED (Dev 1, due Jun 7)

BLOCKERS:
  🔴 Oliv Finance credentials — Keymaster, due Jun 5

RISKS:
  ⚠️ Phase 3 may slip 3 days if Oliv not resolved by Jun 6

AGENT ACTIVITY:
  [09:00] Foreman — Generated headlines
  [08:45] Keymaster — Sent follow-up to Oliv
  [08:30] Inspector — 12/15 tests passing
```

---

## Foreman: Data Model

```
/data/build/
├── tasks.json              # Active task queue
├── phases.json             # Phase definitions + exit criteria
├── blockers.json           # Current blockers
├── timeline.json           # Planned vs. actual dates
├── agent-assignments.json  # Who owns what
└── headlines/              # Daily headline history
    ├── 2026-06-01.md
    ├── 2026-06-02.md
    └── ...
```

---

## Foreman: Interface

### For the Driver (You)

**Commands you can send:**
```
/foreman status
→ Returns current phase, % complete, active blockers

/foreman blockers
→ Returns all blockers with owner and due date

/foreman next
→ Returns next 5 tasks in queue

/foreman delay [task-id] [days]
→ Extends task due date, updates dependent tasks

/foreman skip [task-id]
→ Marks task as "deferred" — removes from critical path

/foreman approve [task-id]
→ Marks task as complete (your approval required for P0 tasks)

/foreman agent [agent-name] [task]
→ Directly assigns task to skill agent
```

### For Developers

**Commands developers can send:**
```
/foreman start [task-id]
→ Marks task in-progress

/foreman block [task-id] [reason]
→ Marks task blocked with reason

/foreman submit [task-id] [evidence-link]
→ Marks task for review

/foreman note [task-id] [message]
→ Adds progress note without changing status
```

### For Skill Agents

**Commands agents can send:**
```
/foreman update [task-id] [status]
→ Updates task status

/foreman acquire [service] [status]
→ Updates API key board

/foreman scan [page] [issue]
→ Submits UI inconsistency ticket
```

---

## Foreman: Integration Points

| System | Direction | Data |
|---|---|---|
| **GitHub / Git** | Read | Commit history, PR status, build status |
| **Vercel** | Read | Deployment status, build logs |
| **Slack / Email** | Write | Alerts, headlines, blocker notifications |
| **Mission Control Dashboard** | Write | Phase status, task queue, blockers |
| **API Key Board** | Read/Write | Credential status |
| **Task Queue** | Read/Write | Task CRUD |
| **Agent Registry** | Write | Agent task assignments |

---

## Implementation Priority

| Component | Effort | Phase | Notes |
|---|---|---|---|
| `tasks.json` schema + CRUD | 1 day | 0 | Simple JSON file |
| Task queue UI (Mission Control widget) | 2 days | 4 | React component |
| Blocker escalation logic | 1 day | 0 | Timer-based alerts |
| Daily headline generator | 1 day | 0 | Template + data merge |
| Slack/email integration | 2 days | 0 | Webhook or API |
| Phase gate enforcement | 1 day | 0 | Boolean checks |
| GitHub/Vercel integration | 2 days | 4 | API polling |
| Command parser (`/foreman`) | 2 days | 4 | Simple NLP |

**Total: ~12 days. Can start in Phase 0.**

---

## What Foreman Is NOT

| Misconception | Reality |
|---|---|
| "Foreman writes code" | No. Foreman assigns coding tasks to developers. |
| "Foreman approves orders" | No. That's Operations Dashboard. Build vs. Run wall. |
| "Foreman manages customer support" | No. That's human ops team. |
| "Foreman deploys automatically" | No. Foreman *notifies* that deploy is ready. Human triggers it. |
| "Foreman replaces project management" | Partially. Foreman replaces status meetings and spreadsheet tracking. Human still makes decisions. |
| "Foreman is an AI" | It's an agent. It follows rules. It doesn't "think." It executes workflows. |

---

## Bottom Line

**Foreman is the project manager that never sleeps, never forgets, and never mixes build with run.**

It tells you:
- What's done
- What's stuck
- What's next
- Who needs a nudge

It does not tell you:
- How much GMV you made today
- Which hotel is complaining
- Whether a supplier delivered on time

**Build vs. Run. Never mix them.**

---

*Foreman is the first agent you build. Because without build discipline, nothing else gets built.*
