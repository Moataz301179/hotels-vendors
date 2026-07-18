# RFC v2 (Corrected): Factoring Disbursement Architecture — Partner-Webhook-Driven, Not Queue-Driven

> **Status:** Corrects `rfc-factoring-disbursement-broken.md` (2026-07-18). The v1 framing was wrong.
> **Date:** 2026-07-18
> **Owner:** The Auditor / Fintech Architect
> **Method:** Three parallel autosearch passes (worker bootstrap patterns, fintech specs, factoring caller graph), then direct verification of the Oliv webhook route.

## Why this RFC replaces v1

v1 framed the finding as "factoring disbursement pipeline is broken — a
BullMQ worker is never instantiated, so FUND jobs pile up and suppliers
never get paid." That framing assumed the BullMQ queue was *supposed* to
drive disbursement and was simply mis-wired. A deeper search shows that
assumption is wrong on two counts:

1. **The specs never call for a queue at all.** `fintech-engine-spec.md`
   §3.1/§5.1 and `authority-matrix-spec.md` §5.2 both describe a
   **synchronous inline** disbursement via `factoringBridge.fund()` — no
   job ID, no worker, no queue. The BullMQ worker is an undocumented
   implementation divergence, not a missing wire.
2. **Production disbursement is actually partner-webhook-driven**, not
   platform-queue-driven. The live writers of `FactoringRequest.status
   ∈ {DISBURSED, SETTLED, DEFAULTED}` are inbound webhooks from the
   factoring partner (Oliv Finance) and the Paymob early-payment path.
   The platform does not initiate fund movement at all — by design, per
   the bridge's stated legal stance.

So the BullMQ "FUND" enqueue is **vestigial**, not "broken." Removing the
dead enqueue does not change behavior; it just stops the API from
returning a misleading `"Factoring queued for disbursement"` message.
v1's Option C ("consolidate into an inline transactional path so money
starts moving") was based on a false premise and would have been a real
behavioral change — so its deferral was still the right call, but for the
wrong reason.

## The two correct flows

### A. Intended flow (per specs) — synchronous inline

`docs/fintech-engine-spec.md:54-72, 255-331` and `docs/authority-matrix-spec.md:293-358`:

```
POST /factor
  → ETA validate (validateForFactoring)
  → assessRisk
  → inquireAll → bestOffer
  → calculateHubRevenue
  → FactoringRequest.create({ status: "APPROVED" })
  → factoringBridge.fund(bestOffer.partnerId, ...)   ← direct awaited call
      → returns { disbursedAmount, disbursedAt, expectedSettlementDate }
  → FactoringRequest.update({ status: "DISBURSED", disbursedAt })
  → setPaymentGuarantee(...)
```

No queue, no worker, no `jobId` in the response.

### B. Actual live flow (verified in code) — partner-webhook-driven

```
POST /api/v1/invoices/[id]/factor   [app/api/v1/invoices/[id]/factor/route.ts]
  → ETA validate, assessRisk, inquireAll, calculateHubRevenue   (live)
  → FactoringRequest.create({ status: "APPROVED" })              (live, line 63)
  → addFactoringJob({ action: "FUND", ... })                     (line 82 — VESTIGIAL)
  → Invoice.update({ factoringStatus: "ACCEPTED" })              (line 90, live)
  → returns { message: "Factoring queued for disbursement", jobId }
                                                                  (misleading)

  ─── platform stops here. nothing it enqueued will ever run. ───

  Later, the PARTNER (Oliv Finance) initiates the actual fund transfer
  and reports back via inbound webhook:

POST /api/v1/fintech/oliv-callback   [app/api/v1/fintech/oliv-callback/route.ts]
  event "funding.disbursed" → FactoringRequest.status = "DISBURSED"  (line 117)
  event "funding.settled"   → FactoringRequest.status = "SETTLED"    (line 121)
  event "funding.defaulted" → FactoringRequest.status = "DEFAULTED" (line 125)
  event "hotel.payment_received" → SETTLED + invoice.paymentStatus="PAID" (line 128)

Separately, Paymob early-payment release creates the FactoringRequest
already at status "DISBURSED" (lib/payments/paymob/index.ts:726-731),
also bypassing the factoring queue entirely.
```

This matches `lib/fintech/factoring-bridge.ts`'s header comment:
*"HotelsVendors does NOT hold or transfer cash... the partner handles all
fund transfers directly."*

## What is actually dead vs. live

**Live (route-reachable):** `assessRisk`, `inquireAll`, `calculateHubRevenue`,
`validateForFactoring`, `generateSmartFixes`, `FactoringRequest.create`
(at APPROVED), the inbound Oliv callback writer of DISBURSED/SETTLED/DEFAULTED,
the Paymob early-payment writer of DISBURSED.

**Vestigial (called but does nothing useful):** `addFactoringJob` from the
factor route — enqueues a job that no worker drains. The returned `jobId`
and `"Factoring queued for disbursement"` message are misleading.

**Dead (zero callers):** `createFactoringWorker` and, more broadly, the
**entire BullMQ worker layer**:
- `createEmailWorker`        (`lib/notifications/queue.ts:44`) — 0 callers
- `createEtaWorker`           (`lib/eta/queue.ts:50`)            — 0 callers
- `createEtaDeadLetterWorker` (`lib/eta/queue.ts:190`)          — 0 callers
- `createOrderWorker`         (`lib/orders/queue.ts:50`)         — 0 callers
- `createFactoringWorker`     (`lib/factoring/queue.ts:50`)     — 0 callers
- `createDlqWorker`           (`lib/queues/dead-letter.ts:108`) — 0 callers
- `addOrderJob`               (producer)                         — 0 callers

There is **no worker bootstrap file**. The declared `Dockerfile.worker`
entry point `lib/swarm/worker-entry.ts` does not exist on disk — the
worker container would crash on start. `package.json` has no `worker`
script. `vercel.json` runs only the Next.js web tier.

The only background worker that actually runs is unrelated: an in-process
`setInterval` poller (`lib/ai/workflows/smart-settlement-worker.ts`)
started from `instrumentation.ts`, not a BullMQ consumer.

**Orphaned library code (defined, imported by nobody):**
`orchestrateFactoring`, `batchOrchestrate`, `autoResolveOrderBlocks`,
`batchAutoResolvePendingOrders`, `setSmartFixAutoOptIn` in
`lib/fintech/factoring-orchestrator.ts` — these are the *other* live
callers of `fundThroughPartner` (lines 276, 899), but the module has no
external entry points. v1 RFC wrongly assumed these were a competing
"inline path"; they are not reachable either.

## Revised recommendations

The constraint remains "do not change functionality." Under the corrected
picture, the surgical, behavior-preserving cleanups are:

### R1. Stop the misleading enqueue + response (low risk, behavior-preserving)

In `app/api/v1/invoices/[id]/factor/route.ts`:
- Remove the `addFactoringJob` call (lines 81-87) — nothing consumes it.
- Change the success message from `"Factoring queued for disbursement"` to
  something accurate, e.g. `"Factoring request created; awaiting partner
  disbursement"`. Drop the `jobId` field (or keep it `null` for API shape
  stability).
- Keep the `audit()` call and `completeIdempotency()` — both still correct.

This is the single change that makes the API's contract match reality.
It does **not** change what happens to money — the partner still drives
disbursement via webhook exactly as it does today.

### R2. Remove the entire dead BullMQ worker layer (medium risk, behavior-preserving)

Delete or quarantine: `lib/factoring/queue.ts`, `lib/notifications/queue.ts`,
`lib/eta/queue.ts` (worker factories only — keep `addEtaSubmissionJob`
producer if the eta-submit route relies on it, or migrate that route too),
`lib/orders/queue.ts`, `lib/queues/dead-letter.ts`, and the `Dockerfile.worker`
+ `docker-compose.swarm.yml` `swarm-worker` service that point at a
non-existent entry file.

This is larger and touches the ETA submission producer (`addEtaSubmissionJob`
from `app/api/v1/invoices/[id]/eta-submit/route.ts:31`), which is itself a
live enqueue onto another undrained queue. Per G4 ("ETA bridge is invisible
… triggered by invoice lifecycle events via background queue"), the ETA path
*is* specified to be queue-driven — unlike factoring. So removing the ETA
worker without replacing it WOULD change ETA behavior and is out of scope
here. Recommend: leave `lib/eta/queue.ts` and its producer alone in this
pass, file a separate RFC for wiring the ETA worker (which IS specified to
exist).

### R3. Wire the ETA worker properly (separate RFC, per G4)

The ETA submission queue IS specified (`fintech-engine-spec.md:40`,
`ARCHITECTURE_OVERHAUL_PLAN.md:426`, G4). It needs the missing
`lib/swarm/worker-entry.ts` bootstrap (or an `instrumentation.ts`-started
consumer) to actually drain `eta-submission` and `eta-dead-letter`. This is
the one BullMQ worker that is spec-mandated and currently non-functional.
It deserves its own RFC with deployment-topology sign-off — Vercel cannot
host a persistent BullMQ worker.

## What I will NOT do without your sign-off

- Touch `lib/fintech/factoring-orchestrator.ts` (orphaned but out of scope).
- Wire or remove any BullMQ worker other than the factoring enqueue.
- Modify the Oliv or Paymob webhook paths (these are the *live* disbursement
  path — changing them risks real money flow).
- Add tests (no framework installed; AGENTS.md says testing agents must add
  one — that is its own workstream).

## What I need from you

1. **Approve R1** (remove vestigial enqueue + fix misleading message). This
   is the only change I'm confident is both safe and clearly correct under
   the "do not change functionality" constraint. Reply "do R1" and I'll
   implement it on this branch and commit.

2. **Decide R2 scope.** Delete the dead worker factories wholesale, or
   leave them as latent infrastructure for a future worker-bootstrap? My
   recommendation: leave them (quarantine with a `// DEAD — no bootstrap`
   header) until R3 lands, since they'll need to be revived for the ETA
   worker anyway.

3. **Open a separate workstream for R3** (wire the ETA worker, with
   deployment-topology decision). I'll draft that RFC on request.
