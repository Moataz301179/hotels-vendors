# DevOps & Monitoring Skill
## Hotels Vendors — Observability, Logging, and Deployment

### Purpose
Reusable patterns for all agents ensuring production visibility, error tracking, and deployment safety.

### Non-Negotiable Rules
1. **NO console.log in production code.** Use Pino structured logging exclusively.
2. **Sentry for error tracking.** All unhandled exceptions and critical failures MUST be captured by Sentry.
3. **Health checks.** The platform MUST expose `/api/health` checking database, Redis, and ETA API connectivity.
4. **Structured logging format.** All logs MUST be JSON with consistent fields: `timestamp`, `level`, `msg`, `tenantId`, `userId`, `requestId`, `durationMs`.
5. **Log levels:**
   - `trace` — Detailed debugging
   - `debug` — Development diagnostics
   - `info` — Normal operations (job completions, API requests)
   - `warn` — Recoverable issues (retryable ETA failure, rate limit hit)
   - `error` — Failures requiring attention (payment failure, auth breach attempt)
   - `fatal` — System-wide outages (database down, Redis unreachable)
6. **Alert thresholds:**
   - 3+ ETA submission failures in 5 minutes → PagerDuty/Slack alert
   - Payment gateway error rate > 5% → Escalated alert
   - Unauthorized access attempts > 10/min → Security alert
7. **Build gates.** `npm run build` and `npm run lint` MUST pass before any deployment.

### Tech Stack
- Sentry (Next.js SDK)
- Pino (structured logging)
- Vercel (deployment platform)
- Docker Compose (local dev)

### Patterns
```typescript
// CORRECT — structured logging
import { logger } from "@/lib/logger";

logger.info({
  tenantId: ctx.tenantId,
  userId: ctx.userId,
  orderId: order.id,
  durationMs: Date.now() - start,
}, "Order created successfully");

// FORBIDDEN — console.log
console.log("Order created:", order.id); // NEVER

// CORRECT — Sentry error capture
import * as Sentry from "@sentry/nextjs";

try {
  await processPayment(payment);
} catch (error) {
  Sentry.captureException(error, {
    tags: { tenantId: ctx.tenantId, orderId: order.id },
    extra: { paymentMethod: payment.method },
  });
  logger.error({ error, orderId: order.id }, "Payment processing failed");
  throw error;
}
```

### Files You Must Read Before Writing
- `lib/logger.ts` (create if missing)
- `app/api/health/route.ts` (create if missing)
- `next.config.ts` (Sentry integration)
