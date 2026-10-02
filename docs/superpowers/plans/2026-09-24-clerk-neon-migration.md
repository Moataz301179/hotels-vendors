# HotelsVendors Clerk + Neon Migration Plan

> **Goal:** Replace custom JWT session auth with Clerk authentication and switch database from local PostgreSQL to Neon serverless Postgres.

**Architecture:** Clerk handles auth (sessions, users, organizations). Neon stores app data. Prisma ORM unchanged — only `DATABASE_URL` differs. RBAC/permissions remain in app layer (Clerk provides user identity, app provides authorization).

**Tech Stack:** Next.js 16 App Router, Prisma 6.19.3, Clerk (@clerk/nextjs 6.x), Neon serverless Postgres, Vercel AI SDK, Framer Motion.

**Spec:** `/Users/Moatazi/hotels-vendors/hotels-vendors/AGENTS.md` § G2 (RBAC server-side only), G6 (AI assistant role-specific), G11 § before-you-write (auth/RBAC changes require reading ARCHITECTURE_OVERHAUL_PLAN.md).

---

## Global Constraints

1. No client-side role state — Clerk org metadata or DB lookups for role only
2. Every API route must call `requirePermission(ctx, code)` — this stays, identity source changes
3. No credential exposure in code or commits — Clerk keys only via env
4. Keep existing Prisma schema unchanged — only connection string changes
5. Preserve all existing route groups: `(marketing)`, `(auth)`, `(dashboard)`, `api/v1/`
6. No WebSocket changes
7. No financial/payment logic changes
8. Tenant isolation (G1) remains — Clerk org maps to tenant
9. WCAG 2.2 AA — Clerk components are accessible by default
10. Must work with existing PM2 + Nginx deploy (no Vercel-proprietary features)

---

## Review Focus

1. Cross-tenant data leakage via Clerk `orgId` mismatch with DB `tenantId`
2. Session cookie name collision (`hv_session` vs Clerk cookies)
3. RBAC permission evaluation with Clerk user object instead of custom JWT claims
4. API route auth extraction when request has no Clerk session (API tokens, webhooks)
5. Clerk middleware matcher config — must not block static assets or public routes

---

## Task 1: Install Clerk SDK & Configure Environment

**Files:**
- Modify: `package.json` (add `@clerk/nextjs`)
- Modify: `.env.local` (Clerk keys already added in prior turn)
- Create: `.env.example` additions (document Clerk keys without values)

**Interfaces:**
- Consumes: Nothing
- Produces: Clerk SDK available for import, env vars loaded

- [ ] **Step 1:** Install Clerk SDK

```bash
npm install @clerk/nextjs@^6 --legacy-peer-deps
```

- [ ] **Step 2:** Verify installation

```bash
grep "@clerk/nextjs" package.json
```

Expected: `"@clerk/nextjs": "^6.x.x"`

- [ ] **Step 3:** Commit

```bash
git add package.json package-lock.json
git commit -m "feat(auth): install Clerk SDK"
```

---

## Task 2: Add ClerkProvider to Root Layout

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `@clerk/nextjs` ClerkProvider
- Produces: App wrapped in Clerk provider

- [ ] **Step 1:** Read current `app/layout.tsx`

- [ ] **Step 2:** Add ClerkProvider wrapper

```tsx
import { ClerkProvider } from "@clerk/nextjs";

// Inside <html><body>:
<ClerkProvider>
  {/* existing children */}
</ClerkProvider>
```

- [ ] **Step 3:** Verify TypeScript compiles

```bash
npx tsc --noEmit
```

Expected: 0 errors

- [ ] **Step 4:** Commit

```bash
git add app/layout.tsx
git commit -m "feat(auth): wrap app in ClerkProvider"
```

---

## Task 3: Create Clerk Middleware

**Files:**
- Create: `middleware.ts` (replaces/augments existing)

**Interfaces:**
- Consumes: `clerkMiddleware` from `@clerk/nextjs/server`
- Produces: Auth middleware protecting non-public routes

- [ ] **Step 1:** Read existing `middleware.ts` if present

- [ ] **Step 2:** Create new middleware

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/v1/(.*)",
  "/supplier-central(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

- [ ] **Step 3:** Commit

```bash
git add middleware.ts
git commit -m "feat(auth): add Clerk middleware with protected route matcher"
```

---

## Task 4: Create Auth Routes (Clerk Handles UI)

**Files:**
- Create: `app/sign-in/[[...sign-in]]/page.tsx`
- Create: `app/sign-up/[[...sign-up]]/page.tsx`

**Interfaces:**
- Consumes: Clerk `<SignIn />` / `<SignUp />` components
- Produces: Auth pages at `/sign-in` and `/sign-up`

- [ ] **Step 1:** Create sign-in page

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignIn />
    </main>
  );
}
```

- [ ] **Step 2:** Create sign-up page

```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignUp />
    </main>
  );
}
```

- [ ] **Step 3:** Verify TypeScript

```bash
npx tsc --noEmit
```

- [ ] **Step 4:** Commit

```bash
git add app/sign-in app/sign-up
git commit -m "feat(auth): add Clerk sign-in and sign-up pages"
```

---

## Task 5: Replace Session Extraction in API Utilities

**Files:**
- Modify: `lib/api-utils.ts`

**Interfaces:**
- Consumes: Clerk `auth()` helper from `@clerk/nextjs/server`
- Produces: `authenticate()` reads Clerk session instead of custom JWT

- [ ] **Step 1:** Read current `lib/api-utils.ts`

- [ ] **Step 2:** Replace JWT verification with Clerk auth

```ts
import { auth } from "@clerk/nextjs/server";

export async function authenticate(request: NextRequest) {
  const { userId, orgId, orgRole, sessionClaims } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  return {
    userId,
    tenantId: orgId ?? sessionClaims?.tenantId,
    platformRole: orgRole ?? sessionClaims?.role,
    orgId,
    sessionClaims,
  };
}
```

- [ ] **Step 3:** Verify all consumers still type-check

```bash
npx tsc --noEmit
```

- [ ] **Step 4:** Commit

```bash
git add lib/api-utils.ts
git commit -m "feat(auth): replace custom JWT with Clerk session in API utils"
```

---

## Task 6: Update Dashboard Layout for Clerk

**Files:**
- Modify: `app/(dashboard)/layout.tsx`
- Modify: `components/AppShell.tsx` (UserButton integration)

**Interfaces:**
- Consumes: Clerk `<UserButton />`, `useUser()` hook
- Produces: Dashboard shows Clerk user controls

- [ ] **Step 1:** Add user button to AppShell header

```tsx
import { UserButton } from "@clerk/nextjs";

// In header controls:
<UserButton afterSignOutUrl="/login" />
```

- [ ] **Step 2:** Verify TypeScript

```bash
npx tsc --noEmit
```

- [ ] **Step 3:** Commit

```bash
git add components/AppShell.tsx app/(dashboard)/layout.tsx
git commit -m "feat(auth): integrate Clerk UserButton in dashboard"
```

---

## Task 7: Update All API Routes to Use Clerk Identity

**Files:**
- Modify: All files in `app/api/v1/` that import `authenticate` from `@/lib/api-utils`

**Interfaces:**
- Consumes: Updated `authenticate()` from Task 5
- Produces: API routes use Clerk identity

- [ ] **Step 1:** Find all consumers

```bash
grep -rl "from.*api-utils" app/api/v1/
```

- [ ] **Step 2:** Verify each route compiles

```bash
npx tsc --noEmit
```

- [ ] **Step 3:** Commit

```bash
git add app/api/v1/
git commit -m "feat(auth): API routes use Clerk identity"
```

---

## Task 8: Remove Legacy Session Code

**Files:**
- Remove: `lib/session.ts`
- Remove: `lib/security/csrf.ts` (if Clerk handles CSRF)
- Modify: Any remaining files importing from `lib/session`

**Interfaces:**
- Consumers of `lib/session`: All API routes, api-utils — already migrated

- [ ] **Step 1:** Verify no remaining imports

```bash
grep -rn "from.*lib/session" app/ lib/ --include="*.ts" --include="*.tsx"
```

Expected: empty

- [ ] **Step 2:** Remove session file

```bash
rm lib/session.ts
```

- [ ] **Step 3:** Commit

```bash
git add -A
git commit -m "feat(auth): remove legacy JWT session code"
```

---

## Task 9: Switch Database to Neon

**Files:**
- No code changes — only `.env.local` (already done in prior turn)

**Interfaces:**
- Consumes: Neon `DATABASE_URL` from env
- Produces: Prisma connects to Neon

- [ ] **Step 1:** Verify DATABASE_URL points to Neon

```bash
grep DATABASE_URL .env.local
# Expected: postgresql://neondb_owner:...@ep-rough-sea-b5bluya4-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require
```

- [ ] **Step 2:** Verify Prisma can connect

```bash
npx prisma db execute --stdin <<< "SELECT 1;" 2>&1 || echo "Cannot connect (expected if Neon requires VPN)"
```

---

## Task 10: Build Verification

**Files:**
- None — verification task only

**Interfaces:**
- Consumes: All above tasks complete
- Produces: Clean build

- [ ] **Step 1:** Clean build

```bash
rm -rf .next
npm run build
```

Expected: BUILD_ID generated, no SESSION_SECRET error, no Clerk import errors

- [ ] **Step 2:** If build fails, fix errors and re-verify

---

## Task 11: Add SSO Callback Route (if using SSO)

**Files:**
- Create: `app/sso-callback/[[...sso-callback]]/page.tsx`

**Interfaces:**
- Conserves: Clerk `AuthenticateWithRedirectCallback`
- Produces: SSO callback handler

- [ ] **Step 1:** Create SSO callback page

```tsx
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return <AuthenticateWithRedirectCallback redirectUrl="/dashboard" />;
}
```

- [ ] **Step 2:** Commit

```bash
git add app/sso-callback
git commit -m "feat(auth): add SSO callback route"
```

---

## Task 12: Final Verification & Deploy Prep

**Files:**
- None

**Interfaces:**
- Consumes: All tasks complete
- Produces: Build artifacts ready for PM2 deploy

- [ ] **Step 1:** Run full quality gates

```bash
npx tsc --noEmit && npx prisma validate && npx next lint && npm run build
```

Expected: all pass

- [ ] **Step 2:** Verify standalone output exists

```bash
ls .next/standalone/.next/BUILD_ID
```

Expected: file exists

- [ ] **Step 3:** Commit any remaining changes

```bash
git add -A && git commit -m "feat(auth): Clerk + Neon migration complete" || echo "Nothing to commit"
```

---

## Migration Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Clerk org ≠ DB tenant | Map Clerk `orgId` to `TenantId` in a sync step or onboarding flow |
| Existing users lose sessions | Re-import users to Clerk via CSV or Clerk API before switching |
| API token auth breaks | Clerk supports bearer tokens; update `authenticate()` to check both |
| Neon cold start | Connection pooling via Neon serverless; Prisma connection limit configured |
| Clerk rate limits | Clerk free tier has limits; monitor after deploy |
| PM2 + Clerk | Clerk SDK works with any Node.js server; no Vercel lock-in |

---

## Post-Migration (Future Tasks)

These are NOT part of this plan:

1. Sync existing DB users to Clerk (data migration script)
2. Clerk webhook to mirror user events to DB
3. Replace `lib/store` client-side user state with Clerk `useUser()`
4. Implement Clerk Organizations for multi-property hotel groups
5. Add MFA via Clerk dashboard settings
6. Audit logging for Clerk auth events
