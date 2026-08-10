# ETA E-Invoicing Integration Specification

> **Owner:** Integration Lead  
> **Scope:** `lib/eta/` — INVISIBLE compliance engine (AGENTS.md G4)  
> **Last Updated:** 2026-05-10

---

## 1. Overview

The ETA (Egyptian Tax Authority) e-invoicing bridge is a **background compliance engine**. It has zero UI routes, zero client-side references, and operates entirely via background queues triggered by invoice lifecycle events.

### Trigger Events
- `invoice.status = ISSUED` → auto-queue ETA submission
- `invoice.etaStatus = SUBMITTING` → worker processes submission
- ETA callback received → `processCallback()` updates invoice status

### Architecture
```
Invoice Lifecycle Event
        ↓
   etaQueue.add("submit-invoice", ...)
        ↓
   createEtaWorker() (BullMQ)
        ↓
   etaClient.submitInvoice() → ETA API
        ↓
   Success: invoice.etaStatus = ACCEPTED + etaUuid
   Failure: retry 3× → DLQ after max attempts
```

---

## 2. API Specification

### 2.1 Submission Endpoint
**ETA API:** `POST /api/v1/documentsubmissions`

**Request Payload:**
```json
{
  "issuer": { "type": "B", "id": "TAX_ID", "name": "...", "address": { "country": "EG", ... } },
  "receiver": { "type": "B", "id": "TAX_ID", "name": "...", "address": { "country": "EG", ... } },
  "documentType": "I",
  "documentTypeVersion": "1.0",
  "dateIssued": "2026-05-10T00:00:00Z",
  "internalId": "INV-001",
  "purchaseOrderReference": "PO-001",
  "payment": { "terms": "Net 30" },
  "delivery": { "approach": "By Truck", "terms": "DAP" },
  "invoiceLines": [ ... ]
}
```

**Response:**
```json
{
  "uuid": "eta-uuid-string",
  "status": "Submitted",
  "submissionId": "sub-123"
}
```

### 2.2 Callback Endpoint
**Internal:** `POST /api/v1/eta/callback`

**Request Payload:**
```json
{
  "uuid": "eta-uuid-string",
  "status": "Valid",
  "dateTimeValidated": "2026-05-10T12:00:00Z",
  "rejectionReasons": []
}
```

**Idempotency:** Callbacks are idempotent — replaying the same `(uuid, status)` pair is a no-op.

### 2.3 Status Endpoint
**Internal:** `GET /api/v1/eta/status/[uuid]`

Returns the current ETA status for an invoice UUID.

---

## 3. Queue Configuration

### eta-submission Queue
| Property | Value |
|---|---|
| Name | `eta-submission` |
| Retries | 3 |
| Backoff | Exponential, 10s base |
| Concurrency | 2 |
| removeOnComplete | 100 |
| removeOnFail | false (moved to DLQ) |

### ETA Dead-Letter Queue
| Property | Value |
|---|---|
| Name | `eta-submission-dlq` |
| Handler | `createEtaDeadLetterWorker()` |
| Action | Sets `invoice.etaStatus = MANUAL_RESOLUTION` |
| Persistence | Writes to `Prisma.SwarmJob` for admin visibility |

---

## 4. Error Handling

### Retryable Errors
- ETA API timeout
- ETA API 5xx
- Network failures

### Non-Retryable Errors
- Invalid tax ID format
- Missing required fields
- Digital signature validation failure

### DLQ Behavior
After 3 failed attempts, the job is moved to DLQ via `moveToDeadLetter()`. The DLQ worker:
1. Updates invoice to `MANUAL_RESOLUTION`
2. Writes audit log
3. Persists to `SwarmJob` table

---

## 5. Security

- ETA API credentials (`ETA_CLIENT_ID`, `ETA_CLIENT_SECRET`) are server-only
- No UI route references ETA internals (AGENTS.md G4)
- Callback endpoint validates payload with Zod
- Digital signing is stubbed — **TODO:** implement actual crypto signing before production

---

## 6. Testing

### Unit Tests
- `tests/api/orders.test.ts` — state machine transitions
- **TODO:** Add `tests/eta/queue.test.ts` for submission + DLQ flow

### Manual Testing
1. Create invoice with `status = ISSUED`
2. Verify `etaQueue.add()` is called
3. Verify worker submits to ETA API
4. Simulate callback with `POST /api/v1/eta/callback`
5. Verify invoice status updates to `ACCEPTED`
6. Replay same callback → verify idempotency (no duplicate audit log)

---

## 7. Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-10 | Initial spec | Integration Lead |
| 2026-05-10 | Added idempotency check to callback | Auditor |
| 2026-05-10 | Wired ETA DLQ on failed jobs | Auditor |
