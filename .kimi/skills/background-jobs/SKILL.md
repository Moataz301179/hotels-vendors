# Background Jobs Skill
## Hotels Vendors — Async Processing with BullMQ

### Purpose
Reusable patterns for all agents implementing background processing, queues, retries, and scheduling.

### Non-Negotiable Rules
1. **NO synchronous external API calls in HTTP handlers.** ETA submission, factoring disbursement, email sending, and inventory sync MUST be background jobs.
2. **BullMQ is the job processor.** Use Redis-backed queues for durability and retry logic.
3. **Idempotency in jobs.** Every job MUST check if the work was already done before executing.
4. **Dead-Letter Queue.** After max retries, jobs move to a dead-letter queue with manual resolution path.
5. **Structured Logging.** Every job start, success, failure, and retry MUST be logged with Pino.
6. **Sentry Integration.** Job failures MUST be captured by Sentry after max retries.
7. **Job Types:**
   - `eta:submit` — Invoice ETA submission
   - `eta:retry` — Failed ETA retry
   - `factoring:disburse` — Factoring fund release
   - `factoring:notify` — Factoring status updates
   - `email:send` — All transactional emails
   - `inventory:sync` — Inventory webhook processing
   - `audit:compress` — Audit log archival
   - `report:generate` — TCP and spend reports

### Tech Stack
- BullMQ (Redis-backed)
- ioredis (already installed)
- Pino for logging
- Sentry for error tracking

### Patterns
```typescript
// CORRECT — add job to queue
await etaQueue.add("submit-invoice", { invoiceId }, {
  jobId: `eta-submit-${invoiceId}`, // idempotency
  attempts: 5,
  backoff: { type: "exponential", delay: 60000 },
  removeOnComplete: { age: 86400 }, // keep 24h
});

// CORRECT — job processor
const worker = new Worker("eta", async (job) => {
  logger.info({ jobId: job.id, invoiceId: job.data.invoiceId }, "Processing ETA submission");
  try {
    await submitToEta(job.data.invoiceId);
    logger.info({ jobId: job.id }, "ETA submission completed");
  } catch (error) {
    logger.error({ jobId: job.id, error }, "ETA submission failed");
    throw error; // BullMQ will retry
  }
}, { connection: redis });
```

### Files You Must Read Before Writing
- `lib/redis.ts`
- `lib/eta/queue.ts` (create if missing)
- `lib/notifications/email.ts`
