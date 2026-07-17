# HotelsVendors Mobile App — Development Plan
## Aligned with MVP + Oliv Phase 1 Partnership

**Last Updated:** 2026-07-15
**Status:** Recommended Approach

---

## EXECUTIVE SUMMARY

HotelsVendors should build a **React Native mobile app** that extends the web MVP into a native mobile experience. The app focuses on the **core transaction loop**: registration → invoice upload → factoring → delivery tracking. This aligns with Phase 1 (Oliv partnership) and avoids over-engineering.

---

## RECOMMENDED STACK

| Layer | Technology | Why |
|---|---|---|
| Framework | **React Native + Expo** | Share 70%+ code with Next.js web. Expo simplifies builds. |
| Navigation | **Expo Router** | File-based routing (mirrors Next.js App Router) |
| State | **Zustand** | Lightweight, matches web patterns |
| UI Kit | **NativeWind + Custom** | Tailwind-like styling, matches web glassmorphism |
| Auth | **Expo SecureStore** | JWT tokens stored securely on device |
| Camera | **expo-camera** | Barcode scanning for PO receiving |
| Push | **Expo Notifications** | Order status, factoring updates |
| OTA Updates | **EAS Update** | Push updates without app store review |

---

## PHASED FEATURE MAP

### Phase 1: Core Transaction Loop (Week 1-4)
**Goal:** Supplier can register, upload invoice, get funded on mobile

| Feature | Screen | Priority | Aligns With |
|---|---|---|---|
| Registration | `/(auth)/signup` | P0 | Web signup flow |
| Login | `/(auth)/login` | P0 | JWT auth |
| Supplier Dashboard | `/(supplier)/dashboard` | P0 | Order overview |
| Invoice Upload | `/(supplier)/invoice/upload` | P0 | ETA invoice submission |
| Invoice Camera | `/(supplier)/invoice/camera` | P0 | Camera capture + OCR |
| Factor via Oliv | `/(supplier)/factoring/activate` | P0 | Oliv referral token |
| Credit Facility View | `/(supplier)/credit` | P0 | OlivCreditFacility display |
| Order Tracking | `/(supplier)/orders/[id]` | P0 | Order status timeline |
| Profile | `/(profile)/edit` | P1 | Company info, KYC status |
| Notifications | `/(notifications)` | P1 | Order + factoring updates |

### Phase 2: Hotel Buyer Experience (Week 5-6)
**Goal:** Hotel procurement on mobile

| Feature | Screen | Priority | Aligns With |
|---|---|---|---|
| Hotel Dashboard | `/(hotel)/dashboard` | P0 | Order overview |
| Catalog Browse | `/(hotel)/catalog` | P0 | Product search |
| PO Builder | `/(hotel)/po/create` | P0 | Multi-supplier PO |
| PO Approval | `/(hotel)/po/approve` | P0 | Authority Matrix |
| Order History | `/(hotel)/orders` | P0 | Past orders |
| Spend Analytics | `/(hotel)/analytics` | P1 | Cost tracking |

### Phase 3: Logistics & Delivery (Week 7-8)
**Goal:** Delivery tracking + GRN

| Feature | Screen | Priority | Aligns With |
|---|---|---|---|
| Delivery Tracker | `/(shipping)/track/[id]` | P0 | Real-time GPS |
| Barcode Scanner | `/(shipping)/scan` | P0 | PO receiving |
| GRN Capture | `/(shipping)/grn` | P0 | Photo + signature |
| Dispute Flow | `/(shipping)/dispute` | P1 | Damage reports |

### Phase 4: Advanced Features (Week 9-12)
**Goal:** Full platform parity

| Feature | Screen | Priority | Aligns With |
|---|---|---|---|
| Multi-property Switcher | `/(profile)/properties` | P1 | Hotel groups |
| Offline Mode | `/(offline)` | P1 | PWA fallback |
| AR Product View | `/(catalog)/ar` | P2 | Product visualization |
| Voice Ordering | `/(orders)/voice` | P2 | AI-powered ordering |

---

## TECHNICAL ARCHITECTURE

### Shared Code with Web

```
hotels-vendors/
├── app/                          # Next.js (Web)
├── mobile/                       # React Native (Mobile)
│   ├── app/                      # Expo Router screens
│   │   ├── (auth)/               # Login, signup, forgot-password
│   │   ├── (supplier)/           # Supplier portal
│   │   ├── (hotel)/              # Hotel portal
│   │   ├── (shipping)/           # Delivery tracking
│   │   └── (profile)/            # User profile
│   ├── components/               # Shared components (adapted)
│   ├── lib/                      # Shared utilities
│   │   ├── api.ts                # API client (same endpoints)
│   │   ├── auth.ts               # JWT management
│   │   └── utils.ts              # Shared helpers
│   └── package.json
├── lib/                          # Shared business logic
│   ├── fintech/anti-bypass/      # Referral token (reused)
│   └── validators/               # Zod schemas (reused)
└── prisma/                       # Shared schema
```

### API Compatibility

Mobile app uses the **same API endpoints** as web:
- `POST /api/v1/auth/login` — JWT auth
- `POST /api/v1/oliv/onboard-supplier` — Oliv KYC
- `POST /api/v1/oliv/initiate-factoring` — Factor via Oliv
- `POST /api/v1/oliv/payout-callback` — Oliv callback
- `GET /api/v1/fintech/cashflow` — Cashflow data
- `GET /api/v1/fintech/oliv-facility` — Credit facility

### Auth Flow

```
1. User opens app → Check SecureStore for JWT
2. No JWT → Show login screen
3. Login → POST /api/v1/auth/login → Store JWT in SecureStore
4. JWT expired → Refresh via /api/v1/auth/refresh
5. All API calls include Authorization: Bearer <JWT>
```

---

## UI/UX DESIGN GUIDELINES

### Theme (Matches Web)

```css
/* Mobile glassmorphism theme */
background: #0c0c12;
surface: #12121a;
border: rgba(255,255,255,0.10);
green: #39ff7e;
orange: #ff7e1a;
purple: #c455ff;
blue: #64b5f6;
```

### Navigation Structure

```
Bottom Tab Bar
├── Home (Dashboard)
├── Orders
├── Scan (Camera - centered, prominent)
├── Finance (Credit + Factoring)
└── Profile
```

### Key Interactions

1. **Invoice Upload** — Tap camera → Scan QR/barcode → Auto-fill → Confirm
2. **Factor via Oliv** — Swipe up modal → Review terms → Biometric confirm
3. **Delivery Tracking** — Real-time map with ETA countdown
4. **Push Notifications** — Order status, factoring approval, delivery alerts

---

## DEVELOPMENT TIMELINE

| Week | Milestone | Deliverable |
|---|---|---|
| 1 | Project Setup | Expo project, navigation, auth flow |
| 2 | Supplier Core | Dashboard, invoice upload, order list |
| 3 | Oliv Integration | Factoring activation, credit view |
| 4 | Camera + Scan | Barcode scanner, GRN capture |
| 5 | Hotel Core | Catalog, PO builder, approval flow |
| 6 | Delivery | Tracking map, dispute flow |
| 7 | Polish | Animations, offline mode, testing |
| 8 | Beta Release | TestFlight + Google Play beta |

---

## ESTIMATED COST

| Item | Cost (EGP) | Notes |
|---|---|---|
| React Native Development | 180,000 - 250,000 | 8 weeks, 1 developer |
| UI/UX Design | 30,000 - 50,000 | Figma + prototypes |
| Backend API Adaptation | 20,000 - 30,000 | JWT auth, mobile endpoints |
| Testing + QA | 15,000 - 25,000 | Device testing, automation |
| App Store Fees | 5,000 | Apple + Google |
| **Total** | **250,000 - 360,000** | ~$5,000 - $7,200 USD |

---

## RECOMMENDED NEXT STEPS

1. **Approve this plan** — Confirm scope and timeline
2. **Start Phase 1** — Supplier mobile experience (Week 1-4)
3. **Design sprint** — Create mobile-specific wireframes
4. **Set up Expo project** — Initialize with authentication flow
5. **API adaptation** — Add JWT endpoints for mobile auth

---

## WHY REACT NATIVE + EXPO

| Factor | React Native + Expo | Flutter | Native (iOS + Android) |
|---|---|---|---|
| Code Sharing with Web | 70%+ (same business logic) | 30% (Dart) | 0% |
| Development Speed | Fast (Expo managed) | Medium | Slow (2 codebases) |
| Web Compatibility | High (shared APIs, validators) | Low | None |
| Learning Curve | Low (React/TypeScript) | Medium (Dart) | High (Swift + Kotlin) |
| OTA Updates | Yes (EAS Update) | No | Limited |
| Cost | Lowest | Medium | Highest |

**Verdict:** React Native + Expo is the optimal choice given the existing Next.js web stack. Shared business logic, API endpoints, and Zod validators reduce development time by 40%.
