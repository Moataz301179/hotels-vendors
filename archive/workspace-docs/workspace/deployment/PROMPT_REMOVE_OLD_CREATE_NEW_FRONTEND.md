# PROMPT: Remove All Old Frontend Versions + Create New One

> **Scope:** Complete frontend purge and rebuild  
> **Target:** Hotels Vendors marketing site + auth pages + dashboard shell  
> **Goal:** Zero stale content. Zero old colors. Zero cached artifacts.

---

## PART 1: PURGE — Remove Every Old/Stale File

### Step 1.1: Delete Competing Homepages (CRITICAL)
These files override `app/(marketing)/page.tsx` and serve stale content:

```bash
# Delete ALL competing root pages
rm -f app/front-end/page.tsx
rm -rf app/front-end/
rm -f app/(app)/page.tsx
rm -rf app/(app)/
rm -f src/app/page.tsx
rm -rf src/app/
rm -f app/page.tsx          # Only keep app/(marketing)/page.tsx

# Verify only ONE homepage exists
find app -name "page.tsx" -path "*/(marketing)/*"  # Should find exactly 1
```

### Step 1.2: Delete Stale Component Directories
```bash
# Old component libraries
rm -rf components/openclaw/
rm -rf components/ai-insights/
rm -rf components/grok-brain/

# Old marketing sections (if they exist separately)
rm -rf app/(marketing)/components/

# Old dashboard pages that were deleted but may have stale builds
rm -f app/(dashboard)/ai-insights/page.tsx
rm -f app/(dashboard)/explorer/page.tsx
rm -f app/(dashboard)/grok-brain/page.tsx
rm -f app/(dashboard)/orchestrator/page.tsx
```

### Step 1.3: Purge Build Artifacts
```bash
# Delete ALL build caches
rm -rf .next/
rm -rf node_modules/.cache/
rm -rf node_modules/.vite/
rm -f tsconfig.tsbuildinfo

# Delete archived files from tsconfig
# Ensure tsconfig.json excludes: "archive", "oldfiles", "dist", "*.bak"
```

### Step 1.4: Purge Service Worker Cache
```bash
# Update public/sw.js — bump cache version to force browser refresh
# Change ALL v1/v2/v3 cache names to a NEW version (e.g., v10)
```

**`public/sw.js` must contain:**
```javascript
const STATIC_CACHE = "hv-static-v10";
const API_CACHE = "hv-api-v10";
const IMAGE_CACHE = "hv-images-v10";
```

### Step 1.5: Verify Nothing Old Remains
```bash
# Search for old crimson color (should return ZERO results)
grep -rn "#8B0000\|#800000\|crimson\|burgundy" app/ components/ lib/ --include="*.tsx" --include="*.ts" --include="*.css"

# Search for old page overrides
grep -rn "front-end\|front_end\|FrontEnd" app/ --include="*.tsx"

# Search for old HERMES branding
grep -rn "HERMES\|ProcurementHub\|front-end" app/ components/ --include="*.tsx"
```

**Expected: All commands return ZERO matches.**

---

## PART 2: CREATE — Build New Frontend

### Step 2.1: Design System (CSS)

**File:** `app/globals.css`

Must define these CSS custom properties:
```css
:root {
  --accent-base: #F97316;        /* Orange (default) */
  --accent-orange: #F97316;       /* Orange fixed */
  --lime-base: #84CC16;           /* Lime fixed */
  --bg-canvas: #0B0F1A;           /* Deep navy-black */
  --bg-surface-1: #121212;        /* Card backgrounds */
  --bg-surface-2: #1a1a1a;
  --bg-surface-3: #222222;
  --text-primary: #ffffff;
  --text-secondary: #A1A1AA;
  --text-muted: #71717A;
  --border-subtle: rgba(255,255,255,0.06);
  --border-visible: rgba(255,255,255,0.12);
}

html[data-accent="lime"] {
  --accent-base: #84CC16;
}
```

**CRITICAL RULES:**
- NO `#8B0000` anywhere
- NO `bg-[#0B0F1A]` hardcoded in components — use `var(--bg-canvas)`
- NO `text-[#C9A227]` gold accents
- All accent colors must flow through `var(--accent-base)`

### Step 2.2: Theme Provider + Toggle

**File:** `components/theme/theme-provider.tsx`
- Context provider for `accent` state ("orange" | "lime")
- Persist to `localStorage` key: `hv-accent-mode`
- Set `data-accent` attribute on `<html>`
- Default: "orange"

**File:** `components/theme/theme-toggle.tsx`
- Two circular buttons side by side
- Left: lime green (#84CC16) — active = filled + glow
- Right: orange (#F97316) — active = filled + glow
- Must be visible in nav (desktop + mobile)

### Step 2.3: Marketing Homepage

**File:** `app/(marketing)/page.tsx` (ONLY homepage file)

**Must contain these exact sections:**

#### Section 1: Hero
- Badge: "B2B PROCUREMENT EGYPT"
- Headline: "Control Your Hotel's Supply Chain Before It Controls You."
- Subhead: "From F&B to capital equipment: track every dirham, automate every order, and get AI demand forecasting that prevents waste before it happens."
- CTAs: "Start Free — No Credit Card" + "Watch How It Works"
- Trust badges: "5-STAR" | "BOUTIQUE" | "RESORT" | "BUSINESS"

#### Section 2: Stats Bar
| Value | Label |
|---|---|
| 10–20 | Daily supplier deliveries per hotel. Operations halt every morning without a system. |
| 60% | Kitchen food waste before a guest sees their meal. 45-73% is avoidable with demand forecasting. |
| ~20% | Of F&B inventory lost to spoilage from poor FIFO and over-ordering. |
| EGP 100K | ETA penalty exposure per hotel. Paper invoices are legally invalid since 2022. |

#### Section 3: How It Works (3 steps)
| # | Title | Description |
|---|---|---|
| 01 | Connect Your Suppliers | Onboard existing suppliers onto the platform. They get a free dashboard to manage orders, invoices, and payments. |
| 02 | AI Forecasts Your Needs | Our engine analyzes occupancy, seasonality, consumption patterns, and events to predict exactly what you need before you run out. |
| 03 | Order, Track & Pay Compliant | Create POs with pre-order cost estimates. Track deliveries in real time. Every invoice is ETA e-invoicing compliant automatically. |

#### Section 4: Platform Categories (5 cards, alternating lime/orange)
| Icon | Title | Description | Accent |
|---|---|---|---|
| F&B | F&B Procurement | AI-powered demand forecasting. Predict what you need before you need it. Real-time price comparison across verified suppliers. | lime |
| HSK | Housekeeping | Consumables tracking with automated reorder points. Never run out of linens, toiletries, or cleaning supplies. | orange |
| ENG | Engineering | Maintenance scheduling, spare parts inventory, and MRO procurement all in one compliant workflow. | orange |
| AMN | Amenities | Guest experience supplies managed with par-level automation. Seasonal adjustments built into your forecast. | lime |
| CAP | Capital Equipment | Track high-value asset purchases, depreciation schedules, and vendor warranties. Compare supplier quotes. | orange |

#### Section 5: Features Grid (6 cards)
- AI Demand Forecasting (lime)
- Authority Matrix (orange)
- Native ETA Compliance (lime)
- Supplier Factoring (orange)
- Shared Logistics (lime)
- Supply Chain Finance (orange)

#### Section 6: For Hotels
- AI Demand Forecasting
- Cost Estimation Pre-Order
- Reorder Alerts
- Spend Analytics Dashboard

#### Section 7: For Suppliers
- Instant InstaPay Settlement
- Non-Recourse Factoring
- Purchase Order Visibility

#### Section 8: CTA
- "Stop Leaking Money Into Your Supply Chain."
- "Join 2,400+ Egyptian hotels that have turned procurement from a cost center into a competitive advantage."
- CTA: "Get Started Free"

#### Section 9: Footer
- HotelsVendors branding
- Platform, Company, Legal links
- Copyright 2026

### Step 2.4: Marketing Navigation

**File:** `components/layout/marketing-nav.tsx`

- Logo: HotelsVendors (horse icon, white)
- Links: Platform, For Hotels, For Suppliers, Pricing
- Right side: **Theme Toggle** → Sign In → Get Started
- Mobile: hamburger menu with same items
- Scroll behavior: transparent → solid background

### Step 2.5: Auth Pages

**Files:**
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/reset-password/page.tsx`

**All must use:**
- `var(--bg-canvas)` background
- `var(--accent-base)` for CTAs and active states
- No crimson. No gold. No old branding.

### Step 2.6: Dashboard Shell

**File:** `components/layout/dashboard-shell.tsx`
- Sidebar: `#121212` background
- Active indicator: `var(--accent-base)` left border
- Header: search, theme toggle, notifications, user dropdown

### Step 2.7: Root Layout

**File:** `app/layout.tsx`
- Must wrap app with `<ThemeProvider>`
- Must include `public/sw.js` registration script
- Must load `app/globals.css`

---

## PART 3: VERIFY — Checklist Before Deployment

### Content Verification
```bash
# Build locally first
npm run build

# Verify these strings exist in the built HTML
grep -r "Stop Leaking Money" .next/server/
grep -r "Before It Controls You" .next/server/
grep -r "2,400+ Hotels" .next/server/
grep -r "AI Demand Forecasting" .next/server/
grep -r "Authority Matrix" .next/server/

# Verify NO old colors
grep -r "#8B0000" .next/server/  # MUST return nothing
grep -r "#C9A227" .next/server/  # MUST return nothing
```

### File Count Verification
```bash
# Exactly ONE homepage should exist
find app -name "page.tsx" | grep -v "\(" | wc -l   # Should be 0
find app -name "page.tsx" | grep "(marketing)" | wc -l  # Should be 1

# No competing directories
ls app/front-end/ 2>/dev/null || echo "GOOD: front-end deleted"
ls app/(app)/ 2>/dev/null || echo "GOOD: (app) deleted"
ls src/app/ 2>/dev/null || echo "GOOD: src/app deleted"
```

---

## PART 4: DEPLOY — Clean Deployment

### Server Access
```
SSH Key: .ssh/kimi_deploy
Server: root@187.77.181.3
App: /var/www/hotelsvendors-v2
```

### Pre-Deploy (CRITICAL)
```bash
# 1. Stop respawn daemon
systemctl stop hv-health-monitor
systemctl disable hv-health-monitor

# 2. Kill ALL old processes
pm2 delete all 2>/dev/null || true
pkill -9 -f "next-server"
pkill -9 -f "next start"
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 3002/tcp 2>/dev/null || true
sleep 2

# 3. Verify clean
ss -tlnp | grep -E "3000|3002" || echo "PORTS FREE"
```

### Build & Start
```bash
cd /var/www/hotelsvendors-v2
rm -rf .next
NODE_OPTIONS="--max-old-space-size=1536" node node_modules/next/dist/bin/next build

# Update nginx to NEW port (e.g., 3003)
sed -i 's/127.0.0.1:300[0-2]/127.0.0.1:3003/g' /etc/nginx/sites-enabled/*
nginx -t && nginx -s reload

# Start with tmux (prevents SSH disconnect)
tmux new-session -d -s hv "cd /var/www/hotelsvendors-v2 && NODE_ENV=production PORT=3003 node node_modules/next/dist/bin/next start"
```

### Post-Deploy Verification
```bash
# Content check
curl -s http://127.0.0.1:3003 | grep -c "Stop Leaking Money"   # = 1
curl -s http://127.0.0.1:3003 | grep -c "2,400+ Hotels"         # = 1
curl -s http://127.0.0.1:3003 | grep -c "Before It Controls"    # = 1

# Service worker check
curl -s http://127.0.0.1:3003/sw.js | grep -c "hv-static-v10"   # >= 1

# No old colors
curl -s http://127.0.0.1:3003 | grep -c "#8B0000"               # = 0

# Public check
curl -s "https://hotelsvendors.com/?_=$(date +%s)" | grep -c "Hotels Onboarded"  # = 1
```

---

## SUMMARY: What Success Looks Like

| Check | Expected |
|---|---|
| Only ONE `page.tsx` in `app/(marketing)/` | ✅ |
| No `app/front-end/` directory | ✅ |
| No `src/app/` directory | ✅ |
| No `#8B0000` in any file | ✅ |
| `sw.js` cache version is NEW (not v1/v2) | ✅ |
| Build completes with zero TypeScript errors | ✅ |
| Server starts on port 3003 and stays running | ✅ |
| Public site shows "Stop Leaking Money" | ✅ |
| Theme toggle visible in nav (lime + orange) | ✅ |

---

*End of prompt. If anything is ambiguous, read `/docs/HANDOFF_DEPLOY.md` for full business context.*
