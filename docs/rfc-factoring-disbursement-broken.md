# RFC: Factoring Disbursement Pipeline Is Non-Functional

> **Status:** BLOCKING — requires user direction before any code change
> **Date:** 2026-07-18
> **Owner:** Fintech Architect / The Auditor
> **References:**
> - `docs/architecture-review-2026-07.md` §3, finding A3
> - `AGENTS.md` G10 (Fintech & Risk Layer), G11 (read spec before touching factoring)
> - `docs/fintech-engine-spec.md`

## Summary

The factoring disbursement pipeline is **broken in production**. The BullMQ
worker that processes factoring funding jobs (`createFactoringWorker` in
`lib/factoring/queue.ts`) is never instantiated anywhere in the codebase.
Jobs are enqueued by the live invoice-factor route but never consumed.

This was discovered during the architecture-review refactor and is the reason
the originally-planned "factoring consolidation" task (consolidating the
duplicate journal/ledger writes between the worker and the inline manual path)
was **deferred** rather than executed. Consolidating would change behavior —
the manual path would start actually funding — and there are no tests to
guard the change, so per the "do not change functionality" constraint and
AGENTS.md G11, this RFC is being filed instead.

## Evidence

### 1. The worker is never started

`grep -rln "createFactoringWorker"` matches only the definition file:
```
./lib/factoring/queue.ts:50:export function createFactoringWorker(): Worker {
```

There is no worker bootstrap file, no `start()` call, no long-running process
script, no Vercel Cron entry, and no test that imports `createFactoringWorker`.

### 2. The enqueue side is live

`app/api/v1/invoices/[id]/factor/route.ts` is the only importer of
`lib/factoring/queue`. It calls `addFactoringJob({ action: "FUND", ... })`
and returns `jobId` to the client as if funding is queued for disbursement.

### 3. The expected lifecycle

Per `lib/factoring/queue.ts` lines 118–252, the `FUND` action should:
1. Call `fundThroughPartner()` against the factoring company's API.
2. Mark `FactoringRequest.status = "DISBURSED"`.
3. Mark `invoice.factoringStatus = "PAID"`.
4. Write three `CreditTransaction` ledger entries (advance, platform fee,
   partner fee).
5. Write a `JournalEntry` (Dr Bank / Cr Factoring Liability).
6. Increment `CreditFacility.utilized`.
7. Send the `factoringDisbursedTemplate` email to the supplier.

### 4. What actually happens today

Because the worker never runs, **none** of steps 1–7 execute. The
`FactoringRequest` row is created with `status: "APPROVED"` (set inline at
line 69 of the factor route) and stays there indefinitely. The invoice is
marked `factoringStatus: "ACCEPTED"` (line 93) but never advanced to `PAID`.
The supplier never receives funds or the disbursement email. The credit
facility utilization is never updated. No ledger or journal entry is written.

The API response still reports `"Factoring queued for disbursement"` with a
`jobId`, which is misleading — the job will never run.

## Why I did not fix this in Phase 1

1. **Behavioral change.** Today, no money moves. If I instantiate the worker
   (or consolidate the worker's body into the inline request path), money
   *will* start moving via `fundThroughPartner()`. That is a functional
   change to a monetary flow, which the explicit constraint on this refactor
   forbids: *"Do not change functionality. Only upgrade the code quality,
   scalability, and maintainability."*

2. **No tests.** There are no unit or integration tests for the factoring
   pipeline. Refactoring an untested monetary path that is also silently
   broken is how outages happen. AGENTS.md (Testing row) confirms no test
   framework is installed.

3. **External dependency.** `fundThroughPartner()` calls a real factoring
   partner adapter. Enabling it without a sandbox/dry-run flag in production
   could trigger real disbursements.

4. **G10/G11 require sign-off.** AGENTS.md G11 explicitly says: *"If your
   change touches factoring, risk scoring, or payment guarantees, you MUST
   read `docs/fintech-engine-spec.md` and `docs/authority-matrix-spec.md`."*
   and *"If unsure, write an RFC in `/docs/` and ask for user direction
   before touching production code."*

## Options for the user to choose from

### Option A — Leave it broken, document loudly (no code change)
Add a runtime warning when `addFactoringJob` is called and a banner in the
admin dashboard. Cheapest, safest, and the most honest about current state.
Recommended only if factoring is not yet a live product.

### Option B — Instantiate the worker behind a feature flag
Wire `createFactoringWorker()` into a worker bootstrap process (e.g. a
separate `worker.ts` entrypoint or a Vercel Cron + Queue Consumer) guarded
by a `FACTORING_DISBURSEMENT_ENABLED` env flag (default `false`). This makes
the pipeline *ready* without turning it on. Requires deciding where long-running
BullMQ workers live in the deployment topology (Vercel is serverless — BullMQ
workers need a persistent process, so this also implies a VPS/container).

### Option C — Consolidate into an inline transactional path
Remove the queue indirection entirely and perform the disbursement inline
inside `POST /api/v1/invoices/[id]/factor` inside a single `prisma.$transaction`
with `SELECT ... FOR UPDATE` on the invoice/factoring request. Eliminates the
dead worker, the duplicate journal-write logic, and the misleading "queued"
response. This is the cleanest architecture but is the largest behavioral
change (factoring becomes synchronous).

### Option D — Full fix with tests first
Add a test framework (per AGENTS.md, none exists), write integration tests
for the factoring pipeline against a sandbox partner, *then* pick B or C.
Highest effort, lowest risk. This is what the Fintech Architect agent should
eventually own.

## Recommendation

**Option B now, Option D next sprint.** Wiring the worker behind a disabled
flag is low-risk, makes the dead code reachable, and surfaces the real
deployment-topology question (where do BullMQ workers run?) without moving
money. Then invest in tests before flipping the flag or consolidating.

## What I need from you

1. Confirm factoring is **not** currently live (no real suppliers are
   expecting disbursements). If it *is* live, this escalates to a P0
   incident, not an RFC.
2. Pick an option (A/B/C/D) or direct me otherwise.
3. If B, tell me where long-running workers should live in your deployment
   (VPS, a separate container, Vercel Cron + external consumer, etc.).
