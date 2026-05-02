# API Security Skill
## Hotels Vendors — RBAC, Tenant Isolation, and Route Protection

### Purpose
Reusable security patterns for all agents writing API routes, middleware, or auth logic.

### Non-Negotiable Rules
1. **NO client-side role/tenant/permission state.** Role, tenant, and permissions are server-side only.
2. **Tenant ID from JWT Session ONLY.** Extract `tenantId` from the authenticated session payload. NEVER trust client-sent headers (`x-tenant-id`), query params, or `localStorage`.
3. **middleware.ts is mandatory.** All private routes MUST be protected at the edge by `middleware.ts`.
4. **requirePermission() before business logic.** Every API route MUST call `requirePermission(ctx, "code")` before executing.
5. **NO fallback secrets.** Session secrets MUST be 32+ character random strings. NO defaults like `"dev-secret-change-in-production"`.
6. **Rate Limiting via Redis.** Use Upstash Redis or Vercel KV for distributed rate limiting. NEVER use in-memory `Map` for rate limits on serverless.
7. **HMAC Verification.** All webhook callbacks MUST verify signatures using `crypto.timingSafeEqual`.
8. **MFA for sensitive roles.** ADMIN and FACTORING_COMPANY users MUST have MFA enabled.
9. **Zod on ALL inputs.** Every API route MUST validate input with Zod before touching the database.
10. **No secrets in client bundles.** Server-only modules and env vars must never be imported into client components.

### Tech Stack
- Auth.js v5 (NextAuth) for session management
- bcryptjs for password hashing
- Redis for sessions and rate limiting
- Zod for input validation
- jose or Auth.js for JWT verification

### Patterns
```typescript
// CORRECT — tenant from session
const session = await auth();
const tenantId = session.user.tenantId;

// FORBIDDEN — trusting client header
const tenantId = request.headers.get("x-tenant-id"); // NEVER

// CORRECT — permission check
await requirePermission(ctx, "order:approve");

// FORBIDDEN — manual role check
if (auth.platformRole !== "ADMIN") { ... } // Use requirePermission instead
```

### Files You Must Read Before Writing
- `middleware.ts` (create if missing)
- `lib/api-utils.ts`
- `lib/session.ts`
- `lib/auth/rbac.ts` (create if missing)
- `docs/ARCHITECTURE_OVERHAUL_PLAN.md`
