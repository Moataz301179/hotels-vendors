# Invo UX Screen Specifications — Detailed User Flows

This document supplements §5 of ARCHITECTURE_AUDIT_REPORT.md with pixel-level screen specs.

---

## Screen 1: Onboarding Gateway (First Launch)

### Purpose
Role selection → direct to appropriate home experience.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Status Bar (iOS: time, battery; Android: notch)        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│      [INVO Logo]                                        │
│      "Operational Layer for Hotels Vendors"             │
│                                                         │
│      ┌─────────────────────────────────────┐           │
│      │        🏨  Hotel Buyer              │           │
│      │    "I procure for my hotel"         │           │
│      └─────────────────────────────────────┘           │
│                                                         │
│      ┌─────────────────────────────────────┐           │
│      │        📦  Supplier                 │           │
│      │    "I supply to hotels"             │           │
│      └─────────────────────────────────────┘           │
│                                                         │
│      Small text: "By continuing, you agree to Terms"  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Home Indicator / Nav Bar                               │
└─────────────────────────────────────────────────────────┘
```

### Interactions
- **Hotel Buyer tap** → Navigate to Hotel Home (Tab Navigator)
- **Supplier tap** → Navigate to OlivActivationScreen (KYC flow)
- **No back button** — this is the entry point

### Accessibility
- VoiceOver/TalkBack labels on both cards
- Minimum tap target 48×48dp
- Color contrast: gold on navy ≥ 4.5:1

---

## Screen 2: Hotel Home — Scan-First Dashboard

### Purpose
Primary action: scan barcode/QR. Secondary: quick stats, recent activity.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  INVO                              🔔  👤  (Header)    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  💡 Smart Insight                                │   │
│  │  "Housekeeping scan shows 40% increase in       │   │
│  │   towel requests this week. Consider reorder."  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────┬───────────────────────────┐   │
│  │  📋 My Requisitions │  ⏳ Pending Approvals     │   │
│  │       3             │          2                │   │
│  │  [View All →]       │  [View All →]             │   │
│  └─────────────────────┴───────────────────────────┘   │
│                                                         │
│                    ┌─────────────────┐                  │
│                    │                 │                  │
│                    │      [SCAN]     │  ← 72×72dp FAB  │
│                    │   Barcode / QR  │     centered    │
│                    │                 │                  │
│                    └─────────────────┘                  │
│                                                         │
│  Recent Activity                          [See All →]   │
│  ─────────────────────────────────────────────────────  │
│  📋 REQ-0042  Kitchen Towels      Submitted 2h ago     │
│  ✅ REQ-0041  Pool Bar Stock      Approved 1d ago      │
│  🚚 PO-1023   F&B Delivery        Delivered 3d ago     │
│  💰 INV-2026-001234               Paid via Credit Line │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Home] [Catalog] [Approvals] [Invoices] [More]         │
│   ●       ○        ○           ○          ○            │
└─────────────────────────────────────────────────────────┘
```

### States
| State | Scan FAB | Insight Card | Stats |
|-------|----------|--------------|-------|
| **Empty** (new hotel) | Enabled | "Start by scanning your first item" | Zeros |
| **Active** | Enabled | Dynamic (AI-generated) | Live counts |
| **Offline** | Enabled (queues locally) | Cached | Last synced |
| **Loading** | Disabled (spinner) | Skeleton | Skeletons |

### Interactions
- **Scan FAB tap** → Camera/Barcode Scanner screen
- **Stat card tap** → Navigate to Approvals / Requisitions tab
- **Activity item tap** → Detail screen for that entity
- **Tab tap** → Switch tab
- **Notification bell** → Notification center screen
- **Profile avatar** → Profile/menu drawer

---

## Screen 3: Camera / Barcode Scanner

### Purpose
Scan product barcode/QR → identify product → pre-fill requisition.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  ← Back                    Scan Product            ✕   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│        ┌─────────────────────────────────┐             │
│        │                                 │             │
│        │         CAMERA PREVIEW          │             │
│        │                                 │             │
│        │    ┌─────────────────────┐      │             │
│        │    │  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  │      │  ← Scan area │
│        │    │  █ ▄▄▄ ▄▄▄ ▄▄▄ █   │      │     with     │
│        │    │  █ ███ ███ ███ █   │      │   animated   │
│        │    │  █ ▄▄▄ ▄▄▄ ▄▄▄ █   │      │   corners    │
│        │    │  █ ███ ███ ███ █   │      │             │
│        │    │  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  │      │             │
│        │    └─────────────────────┘      │             │
│        │                                 │             │
│        └─────────────────────────────────┘             │
│                                                         │
│        "Position barcode within frame"                 │
│                                                         │
│        [Flash: 🔦]  [Flip Camera: 🔄]  [Gallery: 🖼️]  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Home Indicator                                         │
└─────────────────────────────────────────────────────────┘
```

### Success Flow
```
Scan Success → Haptic feedback + sound
              ↓
Product lookup via API (sku/barcode)
              ↓
┌─────────────────────────────────────────────────────────┐
│  Product Found                                    ✕    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🧴  Toilet Paper - 2-ply, 400 sheets           │   │
│  │  SKU: TP-001  |  Supplier: Nile Trading Co.     │   │
│  │  Price: EGP 45/roll  |  Stock: 2,400 rolls      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Quantity:  [ 12 ]  (-) [input] (+)   Unit: Roll      │
│                                                         │
│  Outlet:    [ Kitchen ▼ ]                              │
│                                                         │
│  Note:      [____________________________]             │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │  Cancel          │  │  Submit Requisition     │   │
│  └──────────────────┘  └──────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Error States
| Error | UI Treatment |
|-------|--------------|
| **Product not found** | "No product matched. Add manually?" → Manual entry form |
| **Camera permission denied** | System prompt + fallback "Enter SKU manually" |
| **Network error** | "Offline — queued for sync" + local storage |
| **Multiple matches** | List picker: "Which product?" |

---

## Screen 4: Requisition Review (Post-Scan)

### Purpose
Confirm details before submitting to manager.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  ← Back              New Requisition              ✓    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📋 Requisition Summary                          │   │
│  │  Outlet: Kitchen  |  Property: Main Resort      │   │
│  │  Requested by: Ahmed Hassan (Staff)             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Items (2)                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🧴 Toilet Paper × 12 rolls     EGP 540         │   │
│  │  🧼 Hand Soap × 24 bottles       EGP 720         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Total: EGP 1,260                                       │
│                                                         │
│  Note: "Urgent — pool towels running low"              │
│                                                         │
│  ⚠️ This will be sent to Kitchen Manager for approval  │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │  Edit            │  │  Submit for Approval    │   │
│  └──────────────────┘  └──────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Validation Rules
- At least 1 item
- Quantity > 0 per item
- Outlet selected
- Note optional but encouraged

---

## Screen 5: Approvals Tab (Manager View)

### Purpose
Manager reviews/approves/rejects team requisitions with budget context.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Approvals                    🔍 Filter          👤    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Monthly Budget: EGP 45,000 / 120,000 (37.5%)      │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                         │
│  ⏳ PENDING (2)                              [All →]   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  REQ-0043  Kitchen                          ⏰2h │   │
│  │  12× Toilet Paper (EGP 540)                   │   │
│  │  Requested by: Ahmed (Staff)                  │   │
│  │  Outlet budget: EGP 8,000 / 15,000            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐   │   │
│  │  │ Approve  │  │ Reject   │  │ View Detail │   │   │
│  │  └──────────┘  └──────────┘  └────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  REQ-0042  Pool Bar                           ⏰4h │   │
│  │  24× Beer Bottles (EGP 1,200)                 │   │
│  │  Requested by: Sara (Staff)                   │   │
│  │  ⚠️ Over outlet budget by EGP 200             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐   │   │
│  │  │ Approve  │  │ Reject   │  │ View Detail │   │   │
│  │  └──────────┘  └──────────┘  └────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ✅ APPROVED THIS WEEK (5)                    [All →]   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  REQ-0041  Housekeeping      Approved 2h ago   │   │
│  │  → Converted to PO-1025      [View PO]         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Home] [Catalog] [Approvals] [Invoices] [More]         │
│   ○       ○        ●           ○          ○            │
└─────────────────────────────────────────────────────────┘
```

### Reject Flow
```
Tap Reject → Modal:
┌─────────────────────────────────────────────────────────┐
│  Reject Requisition                                ✕   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Reason:                                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [___________________________________________]   │   │
│  │ "Budget exceeded — reduce quantity"             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌────────────┐  ┌────────────────────┐               │
│  │  Cancel    │  │  Confirm Reject    │               │
│  └────────────┘  └────────────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Screen 6: Catalog Tab (Visual, Searchable)

### Purpose
Browse products with real photography, add to cart or create requisition.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Catalog                      🔍 Search            👤  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [F&B] [Consumables] [Guest Sup.] [FF&E] [Services]   │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │                 │  │                 │             │
│  │   🍅 PHOTO      │  │   🧴 PHOTO      │             │
│  │                 │  │                 │             │
│  │  Tomatoes       │  │  Shampoo 30ml   │             │
│  │  EGP 25/kg      │  │  EGP 18/ea      │             │
│  │  Nile Farm      │  │  Nile Chemicals │             │
│  │  [+ Add]        │  │  [+ Add]        │             │
│  └─────────────────┘  └─────────────────┘             │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │                 │  │                 │             │
│  │   🛏️ PHOTO      │  │   🪑 PHOTO      │             │
│  │                 │  │                 │             │
│  │  Hotel Linens   │  │  Lounge Chair   │             │
│  │  EGP 120/set    │  │  EGP 4,500      │             │
│  │  Cairo Textiles │  │  Cairo FF&E     │             │
│  │  [Request]      │  │  [Request]      │             │
│  └─────────────────┘  └─────────────────┘             │
│                                                         │
│  (Infinite scroll)                                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Home] [Catalog] [Approvals] [Invoices] [More]         │
│   ○       ●        ○           ○          ○            │
└─────────────────────────────────────────────────────────┘
```

### Product Card Variants
| Product Type | Primary Action | Secondary |
|--------------|----------------|-----------|
| **Consumable (F&B, Chemicals)** | `+ Add` → adds to cart | Long press → requisition |
| **Guest Supplies** | `+ Add` → cart | Long press → requisition |
| **FF&E (Capital)** | `Request` → requisition directly | — |
| **Services** | `Request` → requisition | — |

### Search/Filter
- **Search**: Debounced 300ms, searches name, SKU, supplier
- **Category chips**: Single select, "All" default
- **Sort**: Price ↕, Stock ↕, Relevance (default)
- **Supplier filter**: Multi-select dropdown

---

## Screen 7: Supplier Dashboard — PO Actions

### Purpose
Supplier sees incoming POs, acts on them, manages deliveries/invoices.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Supplier Central              📊 Analytics        🔔  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  💰 Credit Facility: EGP 2,500,000                     │
│  Available: EGP 1,800,000  [Request Factoring →]      │
│                                                         │
│  📥 INCOMING POs (3)                          [All →]  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  PO-1025  Stella Di Mare Sharm              🔴  │   │
│  │  45 items  •  EGP 125,000  •  Due: Aug 7       │   │
│  │  Status: PENDING_ACCEPTANCE                     │   │
│  │  ┌─────────┐  ┌─────────┐  ┌───────────────┐    │   │
│  │  │ Accept  │  │ Reject  │  │ View Details  │    │   │
│  │  └─────────┘  └─────────┘  └───────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🚚 TO DELIVER (2)                            [All →]  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  PO-1023  Jaz Resort Hurghada                🟢  │   │
│  │  Delivered 2h ago  •  EGP 89,000               │   │
│  │  ┌────────────────┐  ┌─────────┐                │   │
│  │  │ Upload Invoice │  │ Capture POD │            │   │
│  │  └────────────────┘  └─────────┘                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ✅ COMPLETED THIS WEEK (8)                   [All →]  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  PO-1021  Sunrise Resort  •  Paid EGP 45,000   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Dashboard] [Orders] [Finance] [Invoices]              │
│   ●           ○        ○         ○                     │
└─────────────────────────────────────────────────────────┘
```

### Accept/Reject PO Flow
```
Accept → Confirm modal → API call → Status: ACCEPTED
         → Auto-create Invoice draft (supplier edits)
         → Notify hotel procurement

Reject → Reason required (dropdown + text)
         → Status: REJECTED
         → Notify hotel procurement
```

---

## Screen 8: Invoice Upload (Supplier)

### Purpose
Supplier uploads digital invoice (PDF) for accepted PO → ETA submission.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  ← Back              Upload Invoice               ✓    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Linked PO: PO-1025  •  Stella Di Mare  •  EGP 125,000 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │        [  📄  Tap to Upload PDF  ]              │   │
│  │                                                 │   │
│  │        Supports: PDF, JPG, PNG                  │   │
│  │        Max: 10MB                                │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ────────────────────────────────────────────────────  │
│                                                         │
│  Invoice Details (auto-filled from PO, editable)       │
│                                                         │
│  Invoice Number:    [ INV-2026-001234        ]        │
│  Issue Date:        [ 2026-08-04            ▼ ]        │
│  Due Date:          [ 2026-09-03            ▼ ]        │
│  Payment Terms:     [ Net-30              ▼ ]        │
│                                                         │
│  Line Items: (from PO, editable)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  1. Tomatoes 25kg × 100     EGP 2,500          │   │
│  │  2. Olive Oil 5L × 50        EGP 12,500         │   │
│  │  ...                                               │   │
│  │  Subtotal: EGP 106,000                            │   │
│  │  VAT (14%): EGP 14,840                            │   │
│  │  Total: EGP 120,840                               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ☑️ Submit to ETA automatically after upload           │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │  Save Draft      │  │  Submit & Send to ETA    │   │
│  └──────────────────┘  └──────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### ETA Submission Flow
```
Submit → Show spinner "Submitting to ETA..."
       → Background: POST /api/v1/eta/submit
       → Success: "Invoice submitted — ETA UUID: 123e4567..."
       → Error: "ETA submission failed — queued for retry"
```

---

## Screen 9: Credit-Line Payment Redirect (Hotel Finance)

### Purpose
Finance user taps "Pay via Credit Line" → deep-links to Oliv → returns with result.

### Layout: Invoice Detail (Finance View)
```
┌─────────────────────────────────────────────────────────┐
│  ← Back              Invoice INV-2026-001234       👤  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Status: VALIDATED (ETA ✓)                      │   │
│  │  PO: PO-1025  •  Supplier: Nile Trading        │   │
│  │  Amount: EGP 120,840                            │   │
│  │  Due: 2026-09-03                                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ────────────────────────────────────────────────────  │
│                                                         │
│  Payment Options:                                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  💳  Pay via Credit Line (Oliv)                 │   │
│  │     Available: EGP 3,200,000                    │   │
│  │     This payment: EGP 120,840                   │   │
│  │     [Authorize Payment →]                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🏦  Bank Transfer                               │   │
│  │     IBAN: EG00 0000 0000 0000 0000 0000 000    │   │
│  │     Reference: INV-2026-001234                  │   │
│  │     [Copy Details]                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Oliv Redirect Flow (Mobile)
```
1. Tap "Authorize Payment"
   ↓
2. POST /api/v1/fintech/oliv-checkout { invoiceId, amount }
   ↓
3. Response: { checkoutUrl, reference }
   ↓
4. expo-web-browser.openAuthSessionAsync(checkoutUrl)
   ↓
5. Oliv App/Web opens → User completes KYC/approval
   ↓
6. Oliv redirects to: invo://payment-return?reference=oliv_abc&status=success
   ↓
7. App handles deep link → Poll /api/v1/fintech/oliv-status?reference=...
   ↓
8. Show result:
   ┌─────────────────────────────────────────────────────────┐
   │  ✅ Payment Authorized                                  │
   │  Invoice INV-2026-001234                                │
   │  Paid via Credit Line                                   │
   │  Reference: oliv_abc123                                 │
   │  [View Receipt]  [Done]                                 │
   └─────────────────────────────────────────────────────────┘
```

### Web Equivalent
```
1. Click "Authorize Payment"
2. POST /api/v1/fintech/oliv-checkout → { checkoutUrl }
3. window.location.href = checkoutUrl
4. Oliv redirects to: https://www.hotelsvendors.com/payment/oliv-return?reference=...
5. Server handles callback → Redirect to /dashboard/hotel/invoices?paid=INV-...
```

---

## Screen 10: Notifications Center

### Purpose
Unified inbox for all role-relevant alerts.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Notifications                              🔍 Mark All │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📍 TODAY                                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🔔 REQ-0045 approved by Kitchen Manager       │   │
│  │  2h ago  •  [View Requisition]                  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🚚 PO-1026 delivered to Main Resort           │   │
│  │  4h ago  •  [View Delivery]                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📍 YESTERDAY                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  💰 INV-2026-001234 paid via Credit Line       │   │
│  │  1d ago  •  [View Invoice]                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📍 THIS WEEK                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ⚠️ Credit facility 80% utilized               │   │
│  │  3d ago  •  [View Facility]                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Home] [Catalog] [Approvals] [Invoices] [More ●]       │
└─────────────────────────────────────────────────────────┘
```

### Notification Types by Role
| Role | Relevant Types |
|------|----------------|
| Hotel Staff | REQUISITION_APPROVED, REQUISITION_REJECTED, PO_DELIVERED |
| Hotel Manager | REQUISITION_SUBMITTED, PO_CREATED, DELIVERY_SCHEDULED |
| Hotel Procurement | PO_ACCEPTED, PO_REJECTED, INVOICE_RECEIVED, INVOICE_APPROVED |
| Hotel Finance | PAYMENT_DUE, PAYMENT_RECEIVED, CREDIT_LINE_AVAILABLE |
| Supplier Sales | PO_CREATED, PO_ACCEPTED, INVOICE_APPROVED, PAYMENT_RECEIVED |
| Supplier Delivery | DELIVERY_SCHEDULED, DELIVERY_COMPLETED |

---

## Component Specifications

### Button Variants
```typescript
// Primary: Gold on Navy
primary: { bg: '#C9A84C', text: '#0B1426', border: 'none' }

// Secondary: Outlined Gold
secondary: { bg: 'transparent', text: '#C9A84C', border: '1px solid #C9A84C' }

// Destructive: Red on Navy
destructive: { bg: '#EF4444', text: '#FFFFFF', border: 'none' }

// Ghost: Transparent, Gold text
ghost: { bg: 'transparent', text: '#C9A84C', border: 'none' }
```

### Input Fields
```typescript
input: {
  bg: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderFocus: '#C9A84C',
  text: '#FFFFFF',
  placeholder: 'rgba(255,255,255,0.45)',
  radius: 12,
  padding: 16,
}
```

### Status Badges
```typescript
badges: {
  draft: { bg: 'rgba(107,114,128,0.2)', text: '#9CA3AF' },
  submitted: { bg: 'rgba(59,130,246,0.2)', text: '#60A5FA' },
  approved: { bg: 'rgba(34,197,94,0.2)', text: '#4ADE80' },
  rejected: { bg: 'rgba(239,68,68,0.2)', text: '#F87171' },
  pending: { bg: 'rgba(245,158,11,0.2)', text: '#FBBF24' },
  paid: { bg: 'rgba(34,197,94,0.2)', text: '#4ADE80' },
  factored: { bg: 'rgba(139,92,246,0.2)', text: '#A78BFA' },
}
```

---

## Animation Specs

| Interaction | Animation | Duration |
|-------------|-----------|----------|
| Tab switch | Slide + fade | 250ms |
| Modal open | Scale 0.95→1 + fade | 200ms |
| Scan success | Pulse + haptic | 300ms |
| List item press | Ripple (Android) / highlight (iOS) | 100ms |
| FAB press | Scale 0.9 | 100ms |
| Pull-to-refresh | Spinner + elastic | 300ms |
| Deep link transition | Slide from right | 300ms |

---

## Offline Behavior

| Action | Online | Offline |
|--------|--------|---------|
| Scan barcode | API lookup → pre-fill | Queue scan locally, lookup when online |
| Submit requisition | POST → success/error | Queue → sync indicator in header |
| Approve/Reject | POST → real-time | Queue → sync when online |
| Upload invoice | Upload → ETA submit | Queue file → upload when online |
| Payment redirect | Deep link → Oliv | N/A (requires network) |

### Sync Indicator
```
Header: ☁️ Synced 2m ago    →    ☁️⏳ Syncing...    →    ☁️❌ Offline (3 pending)
```

---

## Accessibility Checklist

- [ ] All interactive elements ≥ 48×48dp
- [ ] Color contrast ≥ 4.5:1 (text), 3:1 (UI elements)
- [ ] VoiceOver/TalkBack labels on all controls
- [ ] Dynamic Type support (text scales)
- [ ] Reduce Motion respected
- [ ] Focus order logical (top→bottom, left→right)
- [ ] Screen reader announcements for async events
- [ ] Landscape mode supported on tablets