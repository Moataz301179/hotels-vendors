# ETA Compliance Skill
## Hotels Vendors — Egyptian Tax Authority E-Invoicing Bridge

### Purpose
Reusable ETA e-invoicing rules for the Integration Lead and any agent touching invoice compliance.

### Non-Negotiable Rules
1. **The ETA Bridge is INVISIBLE.** Zero UI routes. Zero client code references to ETA API keys, endpoints, or payloads.
2. **Background Jobs Only.** ETA submission is triggered by invoice lifecycle events via BullMQ queue (`lib/eta/queue.ts`). NEVER make synchronous ETA API calls in HTTP request handlers.
3. **Dead-Letter Queue.** Failed submissions land in `lib/eta/queue.ts` with:
   - Exponential backoff retry (1min, 5min, 15min, 1hr, 4hr)
   - Max 5 retries
   - After max retries: manual resolution path with alert
4. **Digital Signature.** Every invoice payload MUST be digitally signed with the platform's private key before submission.
5. **UUID + Serial Number.** Every invoice MUST include the ETA-required UUID and serial number.
6. **Idempotent Callbacks.** The ETA callback webhook (`/api/v1/eta/callback`) MUST handle duplicate delivery gracefully. Use `etaUuid` + `callbackId` uniqueness check.
7. **Immutable Audit Log.** Every ETA submission, callback, and retry MUST write to `AuditLog` with before/after state.
8. **No ETA Secrets in Client Bundles.** ETA API keys live in server-only environment variables.

### Tech Stack
- BullMQ for submission queue and retry logic
- `crypto` module for digital signing
- Prisma for invoice state tracking
- Pino for structured logging

### Patterns
```typescript
// CORRECT — background job trigger
await etaQueue.add("submit-invoice", { invoiceId }, {
  attempts: 5,
  backoff: { type: "exponential", delay: 60000 },
});

// FORBIDDEN — synchronous API call
const response = await etaClient.submit(invoice); // Blocks HTTP request!
```

### Files You Must Read Before Writing
- `lib/eta/client.ts`
- `lib/eta/validator.ts`
- `lib/eta/queue.ts` (create if missing)
- `docs/eta-integration.md` (create if missing)
