# Mobile Monorepo Structure & Migration Plan

## Target Layout (Turborepo + pnpm Workspaces)

```
hotels-vendors-monorepo/
├── apps/
│   ├── web/                          # Current hotels-vendors (Next.js 16)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── prisma/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/                       # Current hotels-vendors-mobile (Expo 57)
│       ├── src/
│       ├── assets/
│       ├── app.json
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── api-contracts/                # SHARED: Zod schemas, TypeScript types
│   │   ├── src/
│   │   │   ├── hotel/
│   │   │   │   ├── index.ts          # Exports all hotel buyer types
│   │   │   │   ├── requisition.ts    # InternalRequisition schemas
│   │   │   │   ├── purchase-order.ts # PurchaseOrder schemas
│   │   │   │   ├── approval.ts       # Approval workflow types
│   │   │   │   ├── invoice.ts        # Invoice schemas
│   │   │   │   └── credit.ts         # Credit-line payment types
│   │   │   ├── supplier/
│   │   │   │   ├── index.ts
│   │   │   │   ├── catalog.ts        # Product/Inventory types
│   │   │   │   ├── purchase-order.ts # Incoming PO types
│   │   │   │   ├── invoice.ts        # Invoice upload/types
│   │   │   │   ├── delivery.ts       # Delivery status types
│   │   │   │   └── credit.ts         # Credit facility/factoring types
│   │   │   ├── factoring/
│   │   │   │   ├── index.ts
│   │   │   │   ├── facility.ts
│   │   │   │   ├── invoice.ts
│   │   │   │   └── risk.ts
│   │   │   ├── shipping/             # Reserved for future phase
│   │   │   │   ├── index.ts
│   │   │   │   ├── trip.ts
│   │   │   │   ├── quote.ts
│   │   │   │   └── tracking.ts
│   │   │   ├── common/
│   │   │   │   ├── index.ts
│   │   │   │   ├── pagination.ts
│   │   │   │   ├── errors.ts
│   │   │   │   ├── enums.ts          # Shared enums (OrderStatus, etc.)
│   │   │   │   └── pagination.ts
│   │   │   └── index.ts              # Barrel export
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui-primitives/                # SHARED: Design tokens (colors, spacing, typography)
│   │   ├── src/
│   │   │   ├── tokens.ts             # Platform-agnostic design tokens
│   │   │   ├── web/
│   │   │   │   ├── index.ts          # Tailwind v4 config extension
│   │   │   │   ├── colors.css.ts     # CSS custom properties for web
│   │   │   │   └── components/       # shadcn/ui primitives (optional)
│   │   │   ├── mobile/
│   │   │   │   ├── index.ts          # StyleSheet helpers for RN
│   │   │   │   ├── colors.ts         # RN color object
│   │   │   │   ├── spacing.ts        # RN spacing scale
│   │   │   │   ├── typography.ts     # RN typography scale
│   │   │   │   └── hooks/            # useColorScheme, etc.
│   │   │   └── index.ts              # Barrel export
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── auth/                         # SHARED: Auth utilities
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── jwt.ts                # JWT decode/verify (edge-compatible)
│   │   │   ├── tokens.ts             # Token refresh logic
│   │   │   ├── permissions.ts        # Permission checking helpers
│   │   │   └── types.ts              # Auth-related types
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── utils/                        # SHARED: Common utilities
│       ├── src/
│       │   ├── index.ts
│       │   ├── currency.ts           # EGP formatting
│       │   ├── date.ts               # Date formatting, relative time
│       │   ├── validation.ts         # Common Zod schemas (email, phone, etc.)
│       │   └── constants.ts          # App constants
│       ├── package.json
│       └── tsconfig.json
│
├── turbo.json                        # Turborepo pipeline config
├── package.json                      # Root workspace config
├── pnpm-workspace.yaml               # pnpm workspace definition
├── .gitignore
└── README.md
```

## Migration Steps

### Step 1: Initialize Monorepo (Day 1)
```bash
# From hotels-vendors root
mkdir -p ../hotels-vendors-monorepo
cd ../hotels-vendors-monorepo

# Copy current repos
cp -r ../hotels-vendors ./apps/web
cp -r ../hotels-vendors-mobile ./apps/mobile

# Create package structure
mkdir -p packages/{api-contracts,ui-primitives,auth,utils}/src
```

### Step 2: Configure Root Package (Day 1)
```json
// package.json (root)
{
  "name": "hotels-vendors-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "turbo run dev --filter=web",
    "dev:mobile": "turbo run dev --filter=mobile",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "db:push": "turbo run db:push --filter=web",
    "db:seed": "turbo run db:seed --filter=web"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {},
    "db:push": {},
    "db:seed": {}
  }
}
```

### Step 3: Extract API Contracts (Day 2-3)
1. **Web → Contracts**: Move Zod schemas from `apps/web/app/api/v1/**/route.ts` to `packages/api-contracts/src/`
2. **Mobile → Contracts**: Move types from `apps/mobile/src/types/index.ts` to `packages/api-contracts/src/common/`
3. **Unify**: Merge into single source of truth per domain
4. **Update Web**: Import from `@hotels-vendors/api-contracts` in API routes
5. **Update Mobile**: Import from `@hotels-vendors/api-contracts` in `src/api/index.ts`

### Step 4: Extract UI Primitives (Day 3-4)
1. **Web Tokens**: Extract from `apps/web/app/globals.css` (Tailwind v4 `@theme`)
2. **Mobile Tokens**: Extract from `apps/mobile/src/theme/index.ts`
3. **Unify**: Create platform-agnostic `tokens.ts` with both representations
4. **Generate**: Web CSS custom properties + Mobile StyleSheet objects
5. **Update Both Apps**: Import from `@hotels-vendors/ui-primitives`

### Step 5: Update Mobile Dependencies (Day 4)
```json
// apps/mobile/package.json additions
{
  "dependencies": {
    "@hotels-vendors/api-contracts": "*",
    "@hotels-vendors/ui-primitives": "*",
    "@hotels-vendors/auth": "*",
    "@hotels-vendors/utils": "*",
    "expo-camera": "~15.0.0",
    "expo-barcode-scanner": "~13.0.0",
    "expo-web-browser": "~13.0.0",
    "expo-linking": "~7.0.0",
    "expo-notifications": "~0.28.0",
    "expo-background-fetch": "~12.0.0",
    "expo-task-manager": "~12.0.0",
    "expo-secure-store": "^13.0.0"
  }
}
```

```json
// apps/mobile/app.json - Add deep link scheme
{
  "expo": {
    "scheme": "invo",
    "ios": { "bundleIdentifier": "com.hotelsvendors.invo" },
    "android": { "package": "com.hotelsvendors.invo" },
    "plugins": [
      "expo-camera",
      "expo-barcode-scanner",
      "expo-notifications"
    ]
  }
}
```

### Step 6: Configure TypeScript Paths (Day 4)
```json
// apps/mobile/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@hotels-vendors/api-contracts": ["../../packages/api-contracts/src"],
      "@hotels-vendors/ui-primitives": ["../../packages/ui-primitives/src"],
      "@hotels-vendors/auth": ["../../packages/auth/src"],
      "@hotels-vendors/utils": ["../../packages/utils/src"]
    }
  }
}
```

```json
// apps/web/tsconfig.json (add to existing)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@hotels-vendors/api-contracts": ["../../packages/api-contracts/src"],
      "@hotels-vendors/ui-primitives": ["../../packages/ui-primitives/src/web"],
      "@hotels-vendors/auth": ["../../packages/auth/src"],
      "@hotels-vendors/utils": ["../../packages/utils/src"]
    }
  }
}
```

### Step 7: Verify Build (Day 5)
```bash
# From monorepo root
pnpm install
pnpm typecheck
pnpm build
```

## Benefits Achieved

| Benefit | Before | After |
|---------|--------|-------|
| **Type Safety** | Drift between web/mobile types | Single source of truth |
| **Design Consistency** | Separate theme files | Shared tokens, guaranteed parity |
| **Auth Logic** | Duplicated in both apps | Shared JWT/token utilities |
| **Build Speed** | Separate `node_modules` | Hoisted dependencies, turbo caching |
| **Deploy** | Two separate pipelines | Coordinated releases |
| **New Features** | Implement twice | Implement once in contracts |

## Rollback Plan
If issues arise:
1. Keep original repos intact at `../hotels-vendors` and `../hotels-vendors-mobile`
2. Monorepo is additive — original repos unchanged
3. Can revert to separate repos at any time