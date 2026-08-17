# Execution Plan — Hotels Vendors Enterprise Platform

## Phase 1: Functional Order Lifecycle (CRITICAL — Core Business Flow)
**Why first:** Without working order approvals, the platform is a read-only dashboard. Hotels can't buy. Suppliers can't sell.

1. **Order Approval API** — `POST /api/v1/orders/[id]/approve`
   - Authority Matrix evaluation before approval
   - Audit log snapshot (beforeState/afterState)
   - Update order status → APPROVED
   
2. **Order Reject API** — `POST /api/v1/orders/[id]/reject`
   - Requires reason
   - Audit log snapshot
   - Update order status → REJECTED

3. **Frontend wiring** — Hotel dashboard approve/reject buttons → API calls
   - Server actions for immediate feedback
   - Toast notifications for success/error

## Phase 2: AI Smart Assistant (HIGH VALUE — User Experience)
**Why second:** Every dashboard has the chatbot widget sitting unused. This becomes a competitive differentiator.

1. **Vercel AI SDK backend** — `POST /api/v1/ai/assistant`
   - Role-specific system prompts (hotel, supplier, factoring, shipping, admin)
   - Tenant-scoped context (only show user's tenant data)
   - Tool calling: query orders, products, suppliers

2. **Frontend wiring** — ChatbotWidget → stream responses
   - Streaming UI with markdown support
   - Suggested actions based on role

## Phase 3: Swarm Job Triggers (ORCHESTRATION — Automation)
**Why third:** The agent grid is beautiful but static. Making agents runnable unlocks the "seamless agent orchestration" vision.

1. **Run Agent API** — `POST /api/v1/swarm/agents/[id]/run`
   - Creates SwarmJob in database + BullMQ queue
   - Returns job ID for polling
   
2. **Admin dashboard wiring** — Agent cards get "Run" buttons
   - Job status polling
   - Output display in modal

3. **Scheduler health** — Verify BullMQ workers are processing jobs
   - Execute a test job via Grok API
   - Verify memory write/read cycle

## Phase 4: ETA Bridge End-to-End (COMPLIANCE — Legal Requirement)
**Why last:** Critical for Egypt operations but invisible to daily users. Best to stabilize core flows first.

1. **ETA Sandbox integration** — Test submit with mock UUID
2. **Invoice lifecycle hook** — Auto-trigger ETA on `invoice.status = ISSUED`
3. **Dead-letter queue UI** — Admin can retry failed submissions

---

## Decision: Start Phase 1 Now

All phases are designed to be independently deployable. Phase 1 unblocks the core business loop. Let's build it.
