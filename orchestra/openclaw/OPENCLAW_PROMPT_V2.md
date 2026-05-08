# OpenClaw Frontend Design Agent — Content & Architecture Prompt

Paste this ENTIRE prompt into your OpenClaw UI agent conversation. This is a **content-first, architecture-driven** prompt. You handle the layout, structure, wording, and interaction patterns. Exact colors and pixel specs will be refined by Kimi later.

---

## PROMPT START

You are the **Lead Product Designer & UX Architect** for Hotels Vendors, a B2B Digital Procurement Hub for Egyptian hospitality. Think of this as **"The Amazon of Egyptian Hospitality"** — a four-sided marketplace connecting Hotels, Suppliers, Logistics Providers, and Factoring Companies.

### Your Task
Design **complete static HTML mockups** for the entire platform. Focus on:
1. **Amazon-inspired layout patterns** (search-centric, category-driven, card-based)
2. **Professional fintech tone** — institutional, authoritative, precise
3. **Clean, scannable information architecture** — no clutter, no marketing fluff inside dashboards
4. **Clear component hierarchy** — every section, tab, menu, and control unit must be logically organized
5. **Exact content wording** — use the professional copy provided below, not placeholder text

Save all files to `/Users/Moataz/hotels-vendors/orchestra/openclaw/design-output/`

---

## DESIGN PHILOSOPHY: AMAZON FOR B2B HOSPITALITY

### Core Layout Principles (Amazon-Inspired)
1. **Search is King**: The search bar is the primary navigation element. Always prominent, always accessible.
2. **Category-First Discovery**: Users browse by category first (F&B, Housekeeping, etc.), then filter, then search.
3. **Card-Dense Grids**: Product/service cards are the atomic unit. Dense information in a scannable format.
4. **Buy Box Pattern**: Product detail pages have a clear "action box" on the right — price, stock, delivery estimate, primary CTA.
5. **Breadcrumb Trails**: Every page below top level shows breadcrumbs (Home > Category > Subcategory > Product).
6. **Filter Sidebar**: Left-side collapsible filters on all listing pages (Amazon's pattern, not top-bar filters).
7. **Sticky Action Bars**: Compare bars, cart summaries, and bulk-action toolbars stick to the bottom.
8. **Account Dashboard Hub**: A centralized "Your Account" style hub with order history, saved lists, settings, and analytics.
9. **One-Click Actions**: Where possible, reduce actions to single clicks (reorder, approve, track).
10. **Status Badges as Trust Signals**: "ETA-Compliant," "Verified Supplier," "48h Delivery," "Non-Recourse Factoring" — badges that reduce decision friction.

### Information Density
- **Dashboards**: Medium-high density. Tables are primary. Cards show 4-6 metrics max.
- **Marketing Pages**: Medium density. White space is strategic, not excessive.
- **Forms**: Low density. One field per row. Clear labels. Helper text where needed.

---

## TYPOGRAPHY & FONT SYSTEM

Use these Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
```

| Role | Font | Weight | Usage |
|---|---|---|---|
| **Primary UI** | Inter | 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold) | All UI text, tables, buttons, forms, navigation |
| **Brand Headlines** | Playfair Display | 600, 700 | Marketing page H1/H2, hero headlines, section titles |
| **Data/Numbers** | Inter | 600 (Tabular nums) | Prices, metrics, order numbers, dates — always use tabular figures |

### Type Scale
- **H1 (Hero)**: Playfair Display, 48–64px, weight 700, tight line-height (1.1), tight letter-spacing (-0.02em)
- **H2 (Section)**: Inter, 32px, weight 700, line-height 1.2
- **H3 (Card Title)**: Inter, 20px, weight 600, line-height 1.3
- **H4 (Subsection)**: Inter, 16px, weight 600, line-height 1.4
- **Body**: Inter, 14px, weight 400, line-height 1.6
- **Caption / Meta**: Inter, 12px, weight 500, line-height 1.5, uppercase with wide tracking (0.08em) for labels like "IN STOCK", "PENDING"
- **Data / Numbers**: Inter, 14–24px, weight 600, tabular-nums

---

## MACRO TONE INSTRUCTIONS

### Voice & Tone
- **Authoritative but accessible**: You are a platform that handles millions in procurement. Speak with confidence, never arrogance.
- **Institutional, not corporate-boring**: This is fintech infrastructure, not a bank from 1995. Precision + modernity.
- **Action-oriented**: Every headline, button, and label implies forward motion. "Procure smarter," not "We help you procure."
- **Egypt-centric, globally competent**: Root the copy in Egyptian hospitality reality (coastal clusters, ETA compliance, EGP currency) but signal world-class execution.

### Word Choice Rules
| ❌ Avoid | ✅ Use Instead |
|---|---|
| "Cheap" / "Discount" | "Cost-optimized" / "Competitive pricing" |
| "Buy" / "Shop" (B2C terms) | "Procure" / "Source" / "Place Order" |
| "Chat" / "Talk to us" | "Inquire" / "Contact Account Manager" |
| "Sign up" | "Register" / "Onboard" / "Get Started" |
| "Money" / "Cash" | "Liquidity" / "Working Capital" / "Funds" |
| "Loan" | "Factoring Facility" / "Credit Line" |
| "Admin panel" | "Control Center" / "Operations Hub" |
| "AI bot" | "Intelligence Engine" / "Smart Assistant" |
| "Settings" (alone) | "Workspace Settings" / "Account Configuration" |
| "Delete" | "Remove" / "Archive" |

### Sentence Structure
- Use **imperative verbs** for CTAs: "Submit Purchase Order", "Review Authority Matrix", "Fund Invoice"
- Use **third-person passive** for compliance/status: "Order approved by Financial Controller", "Invoice submitted to ETA"
- Use **quantified claims only**: "Reduce procurement overhead by up to 40%" — not "Save a lot of money"
- **No exclamation marks** in dashboards. One max per marketing page.

---

## GLOBAL NAVIGATION STRUCTURE

### Marketing Site Header (Sticky, 64px)
```
[Logo: Hotels Vendors wordmark + HV icon]    [Search: "Search 10,000+ hospitality SKUs..."]

Solutions ▾    Suppliers ▾    Pricing    About    [Log In]    [Get Started — Primary]
```
- **Solutions dropdown**: Hotel Procurement, Supplier Central, Logistics Network, Factoring Marketplace, ETA Compliance
- **Suppliers dropdown**: Browse by Category, Browse by City, Verified Suppliers, Become a Supplier
- **Search bar**: Prominent, auto-suggest enabled icon. Placeholder: "Search products, suppliers, SKUs..."

### Dashboard Sidebar (240px, collapsible to 72px icons-only)
Role-specific navigation. Each role sees ONLY its relevant sections.

**Hotel Buyer Sidebar:**
```
Dashboard
Catalog (with search inline)
Orders
  ├─ All Orders
  ├─ Pending Approval
  ├─ In Transit
  └─ Delivered
Invoices
  ├─ All Invoices
  ├─ Awaiting Payment
  └─ ETA Submissions
Reports
  ├─ Spend Analysis
  ├─ Price Benchmarks
  └─ Savings Report
Saved Lists
Smart Assistant
Settings
```

**Supplier Sidebar:**
```
Dashboard
Inventory
  ├─ All Products
  ├─ Low Stock Alerts
  └─ AI Catalog Upload
Orders
  ├─ Incoming Orders
  ├─ RFQs
  └─ Delivery Confirmations
Invoices
Analytics
  ├─ Demand Forecast
  ├─ Pricing Insights
  └─ Trust Score
Smart Assistant
Settings
```

**Factoring Sidebar:**
```
Dashboard
Portfolio
  ├─ Active Facilities
  ├─ Pending Inquiries
  └─ Funded Invoices
Risk Center
  ├─ Heatmap
  ├─ Trust Scores
  └─ Alerts
Liquidity
Smart Assistant
Settings
```

**Logistics Sidebar:**
```
Dashboard
Trips
  ├─ Active
  ├─ Scheduled
  └─ Completed
Route Optimization
Delivery Zones
Fleet
Smart Assistant
Settings
```

**Admin Sidebar:**
```
Dashboard
Tenants
Users & Roles
Authority Matrix
Audit Log
Revenue & Fees
ETA Bridge Monitor
Swarm Control
  ├─ Agent Status
  ├─ Job Queue
  └─ Memory
Smart Assistant
Settings
```

### Dashboard Top Bar (56px, sticky)
```
[Breadcrumb: Home > Category > Page]                    [Global Search]    [Notifications 🔔]    [Language: EN / AR]    [User: Name ▾]
```
- **Notifications dropdown**: Categorized — Orders, Invoices, Approvals, System. Unread badge count.
- **User dropdown**: Profile, Switch Role (if multi-role), Workspace Settings, Log Out.

---

## PAGE-BY-PAGE CONTENT & ARCHITECTURE

### 1. `index.html` — Marketing Landing Page
**Route:** `app/(marketing)/page.tsx`

#### Section: Header
- White background. Clean shadow on scroll.
- Logo left, nav center, CTAs right.
- **Content**: "Hotels Vendors" wordmark. Nav: Solutions, Suppliers, Pricing, About.

#### Section: Hero
- Dark background. No photos — abstract geometric composition (floating product cards, orbiting connection lines).
- **Headline**: "The procurement platform built for Egyptian hospitality"
- **Subheadline**: "Connect your properties to 1,200+ verified suppliers. Reduce procurement costs by up to 40%. Ensure ETA compliance on every invoice. Get coastal delivery in 48 hours."
- **Primary CTA**: "Register Your Hotel" (for buyers) / "Become a Supplier" (for sellers) — toggle or dual buttons.
- **Secondary CTA**: "Explore the Catalog"
- **Stats bar** (below fold, 4 columns):
  - "10,000+ SKUs" / "Hospitality-specific taxonomy"
  - "1,200+ Verified Suppliers" / "Across 6th of October, 10th of Ramadan, and coastal clusters"
  - "2.4B EGP Annual GMV" / "Processed through the platform"
  - "48-Hour Delivery" / "Shared logistics to Red Sea and North Coast"

#### Section: Trust Bar
- **Title**: "Trusted by Egypt's leading hotel groups"
- Logos (text-based placeholders): Marriott International, Four Seasons Hotels, Hilton Worldwide, Mövenpick Hotels, Steigenberger Hotels, Pickalbatros, Sunrise Resorts, Baron Group.

#### Section: Category Discovery (Amazon Grid Style)
- **Title**: "Source by Category"
- 6 cards in a 3x2 grid. Each card:
  - Large Lucide icon
  - Category name
  - Subcategory count (e.g., "240+ products")
  - "Explore →" link
- **Categories & copy**:
  1. **Food & Beverage** — "Dry goods, fresh produce, beverages, and specialty ingredients. From 6th of October manufacturers direct to your kitchen."
  2. **Housekeeping** — "Industrial cleaning chemicals, equipment, and consumables. ISO-certified suppliers only."
  3. **Linens & Textiles** — "Egyptian cotton, towels, bed sheets, and uniform fabrics. Direct from textile mills."
  4. **Engineering & Maintenance** — "Pool chemicals, HVAC parts, electrical supplies, and tools. Capital equipment available."
  5. **Room Amenities** — "Toiletries, guestroom accessories, minibar items, and welcome gifts. Custom branding available."
  6. **IT & Technology** — "POS hardware, Wi-Fi infrastructure, smart room systems, and cybersecurity."

#### Section: Platform Features (Bento Grid)
- **Title**: "One platform. Four stakeholders. Zero friction."
- 6 cards in a bento-style layout (some cards span 2 columns):
  1. **Unified Catalog** — "A hospitality-specific SKU taxonomy that actually makes sense. No more industrial shampoo next to consumer shampoo."
  2. **Shared Logistics** — "Consolidated delivery routes to coastal clusters. Reduce freight costs by 35% through route optimization."
  3. **Embedded Factoring** — "Non-recourse invoice factoring integrated at checkout. Suppliers get paid in 24 hours. Hotels keep 60-day terms."
  4. **ETA E-Invoicing** — "Native Egyptian Tax Authority integration. Every invoice is digitally signed, UUID-tagged, and submitted in real time."
  5. **Authority Matrix** — "Multi-level approval chains based on order value, hotel hierarchy, and supplier tier. Compliance without bureaucracy."
  6. **AI Intelligence** — "Demand forecasting, price benchmarking, and reorder alerts trained on Egyptian hospitality seasonality."

#### Section: How It Works
- **Title**: "From catalog to delivery in three steps"
- 3 horizontal steps with connector line:
  1. **Discover** — "Browse 10,000+ SKUs across six categories. Filter by supplier tier, city, stock status, and ETA compliance."
  2. **Order** — "Build purchase orders with automatic approval routing. Embedded factoring and payment guarantee at checkout."
  3. **Fulfill** — "Track delivery in real time. Confirm receipt, auto-generate invoice, submit to ETA — all in one flow."

#### Section: Metrics Banner
- Dark band. 4 large numbers:
  - "200+" Hotels Onboarded
  - "6" Coastal Clusters Served
  - "48h" Average Delivery Time
  - "40%" Average Cost Reduction

#### Section: Pricing
- **Title**: "Transparent pricing for every stage of growth"
- 3 tiers:
  - **Starter** — "For independent hotels and boutique suppliers" / Free / "Up to 3 users, 50 orders/month, standard support"
  - **Professional** — "For mid-size hotel groups and growing suppliers" / EGP 4,500/month / "Unlimited users, unlimited orders, priority support, factoring access, analytics" [HIGHLIGHTED]
  - **Enterprise** — "For international chains and industrial suppliers" / Custom / "Dedicated account manager, API access, custom integrations, SLA guarantee, co-selling"
- CTA below: "Schedule a procurement audit" — secondary button.

#### Section: Final CTA
- **Headline**: "Ready to transform your procurement operation?"
- **Subhead**: "Join 200+ hotels already replacing WhatsApp and Excel with structured procurement."
- **CTA**: "Start Free Trial" + "Speak to an Account Manager"

#### Section: Footer
- 4 columns:
  - **Brand**: Logo + one-line description: "The digital procurement hub for Egyptian hospitality." + social icons.
  - **Product**: Catalog, Orders, Invoices, Reports, ETA Compliance, Factoring, Logistics, AI Assistant
  - **Company**: About, Careers, Press, Contact, Privacy Policy, Terms of Service
  - **Support**: Help Center, API Documentation, System Status, Security
- Bottom bar: "© 2026 Hotels Vendors. All rights reserved." + "Made in Egypt. Built for scale."

---

### 2. `login.html` + `register.html` — Authentication
**Routes:** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`

#### Login Page
- Centered card. Clean, no distractions.
- **Title**: "Sign in to your workspace"
- Fields: Email address, Password, "Remember this device" checkbox.
- **Primary action**: "Sign In"
- **Secondary links**: "Forgot password?", "Don't have an account? Register"
- **Security note** (small text below form): "Protected by JWT session encryption and tenant-scoped access controls."

#### Register Page
- **Title**: "Register your organization"
- **Step 1 — Select Role** (tabbed):
  - Hotel / Resort Group
  - Supplier / Manufacturer
  - Logistics Provider
  - Factoring Company
- **Step 2 — Organization Details**: Legal company name, commercial registration number, tax ID, city, governorate, address.
- **Step 3 — Contact Details**: Full name, work email, phone number, job title.
- **Step 4 — Account Setup**: Password, confirm password, terms acceptance.
- **Progress indicator**: Steps 1–4 with labels.
- **Primary action**: "Create Account"
- **Helper text**: "By registering, you agree to our Terms of Service and acknowledge our Privacy Policy. Your data is encrypted and tenant-isolated."

---

### 3. `dashboard-hotel.html` — Hotel Buyer Dashboard
**Route:** `app/(dashboard)/hotel/page.tsx`

#### Layout
- Sidebar + main content area.
- **Breadcrumb**: Workspace / Dashboard

#### Section: Metrics Row (4 cards)
- **Total Spend** (MTD) — EGP 2,400,000 — "+12.5% vs last month" — green up arrow
- **Active Orders** — 18 — "+3 this week" — blue indicator
- **Pending Approval** — 4 — "2 urgent, 1 approaching deadline" — yellow alert
- **Budget Utilized** — 68% — "On track, EGP 312K remaining this quarter" — neutral

#### Section: Spend Trend Chart
- **Title**: "Procurement Spend — Last 12 Months"
- Line chart area. X-axis: months. Y-axis: EGP (thousands).
- Toggle: "By Category" / "By Supplier" / "By Property"

#### Section: Recent Orders Table
- **Title**: "Recent Purchase Orders" — "View All →" link top-right.
- Table columns: PO Number, Supplier, Items, Total (EGP), Status, Order Date, Est. Delivery, Actions.
- **Status labels** (professional, not colorful):
  - "Delivered" — green dot
  - "In Transit" — blue dot
  - "Pending Approval" — amber dot
  - "Approved" — maroon dot
  - "Rejected" — red dot
- **Row actions** (hover-reveal): View Details, Track Delivery, Download PDF.
- **Empty state**: "No orders this period. Browse the catalog to place your first order."

#### Section: Budget Breakdown
- **Title**: "Budget Allocation vs. Actual"
- Horizontal stacked bar per category:
  - F&B Dry Goods: Allocated EGP 800K | Spent EGP 624K (78%)
  - Housekeeping: Allocated EGP 350K | Spent EGP 212K (61%)
  - Linens & Textiles: Allocated EGP 280K | Spent EGP 198K (71%)
  - Engineering: Allocated EGP 200K | Spent EGP 134K (67%)
  - Guest Amenities: Allocated EGP 150K | Spent EGP 98K (65%)
- Alert: "F&B Dry Goods approaching budget limit — EGP 176K remaining"

#### Section: Quick Actions
- Button row: "Create Purchase Order", "Browse Catalog", "View Reports", "Request Factoring"

#### Section: Reorder Alerts
- Card list: Products approaching reorder point.
- Each item: Product name, Current stock, Reorder point, Suggested supplier, "Reorder" button.

#### Section: AI Assistant Teaser
- Small card at bottom: "Smart Assistant detected 3 price drops in your frequent purchase list. Review savings opportunities →"

---

### 4. `catalog.html` — Marketplace Catalog Browse
**Route:** `app/(dashboard)/hotel/catalog/page.tsx`

#### Layout
- Left sidebar: Filters (collapsible on mobile)
- Right: Product grid

#### Top Bar
- **Title**: "Procurement Catalog"
- **Search**: "Search products, SKUs, or suppliers..."
- **View toggle**: Grid (default) / List
- **Sort**: Relevance, Price: Low to High, Price: High to Low, Supplier Rating, Stock Availability

#### Category Pills (horizontal scroll)
- All Categories | Food & Beverage | Housekeeping | Linens & Textiles | Engineering | Room Amenities | IT & Technology | Safety & Security
- Active pill has underline.

#### Filter Sidebar
- **Price Range**: Min / Max input + slider
- **Supplier Tier**: Verified Premier, Verified Standard, Registered
- **City**: 6th of October, 10th of Ramadan, Alexandria, Hurghada, Sharm El-Sheikh, etc.
- **Stock Status**: In Stock, Low Stock, Made to Order
- **ETA Compliance**: ETA-Ready Invoices, Non-ETA (legacy)
- **Delivery Time**: Same Day, 24h, 48h, 1 Week
- **Rating**: 4★ & up, 3★ & up
- Clear Filters button at bottom.

#### Product Grid Card
Each card contains:
- **Image area**: CSS gradient placeholder (no photos)
- **Category tag**: Small pill (e.g., "F&B Dry Goods")
- **Product name**: 2-line max truncation
- **Supplier name**: With verification badge (checkmark icon)
- **Price**: "EGP 185.00" per unit — bold, prominent
- **MOQ**: "Min. order: 50 units" — caption text
- **Rating**: Star icon + "4.8" + "(124 reviews)"
- **Stock badge**: "In Stock" (green) / "Low Stock: 45 units" (amber) / "Made to Order" (blue)
- **Delivery estimate**: "Delivery by May 12" or "48h to Hurghada"
- **Hover state**: "Add to Cart" button appears. "Add to Compare" icon.

#### Pagination
- "Showing 1–24 of 1,247 products"
- Page numbers: 1, 2, 3, ... 12. Prev / Next arrows.

#### Floating Compare Bar (appears when 2+ items selected)
- "2 items selected · Compare · Clear All"
- Sticky bottom, full width, height 56px.

---

### 5. `catalog-detail.html` — Product Detail Page
**Route:** `app/(dashboard)/hotel/catalog/[id]/page.tsx`

#### Layout: Two-column (60/40 split)

**Left Column:**
- **Breadcrumb**: Catalog > Food & Beverage > Dry Goods > [Product Name]
- Large product image placeholder (CSS gradient, 400x400)
- Thumbnail strip (4 smaller placeholders)
- **Tabs**:
  - **Overview**: Full description, specifications table, compliance certificates.
  - **Supplier Info**: Company name, location, years on platform, trust score, response rate, "View Profile" link.
  - **Reviews**: Star breakdown, recent review cards, "Write a Review" (if purchased).
  - **Related Documents**: SDS sheets, ETA compliance docs, catalog PDF.

**Right Column — The Buy Box** (Amazon pattern, sticky on scroll):
- **Supplier name** + verification badge
- **Product name** (H2)
- **Rating**: Stars + score + review count
- **Price**: "EGP 185.00" per unit — large, bold
- **MOQ**: "Minimum order quantity: 50 units"
- **Stock status**: "In Stock — 450 units available"
- **Delivery estimate**: "Delivery to Hurghada by May 12 (48h)"
- **Quantity selector**: Dropdown or stepper (multiples of MOQ)
- **Primary action**: "Add to Purchase Order" (not "Add to Cart" — B2B language)
- **Secondary action**: "Add to Saved List" + "Add to Compare"
- **Trust badges row**: "ETA-Compliant Invoicing" / "Verified Supplier" / "Non-Recourse Factoring Available"
- **Bulk pricing hint**: "Prices drop at 100, 500, and 1,000 units. Request volume quote →"

**Below fold:**
- **Frequently Procured Together**: 3 product cards
- **Comparable Products**: 3 product cards from different suppliers
- **Price History Sparkline**: "Price trend — last 90 days"

---

### 6. `order-builder.html` — Create Purchase Order
**Route:** `app/(dashboard)/hotel/order/page.tsx`

#### Step Indicator (top of page)
1. **Select Supplier** (active) → 2. **Build Order** → 3. **Review & Submit**
- Progress bar connects the steps.

#### Step 1: Select Supplier
- **Search**: "Search your approved suppliers..."
- **Supplier cards**: Logo placeholder, name, location, avg. delivery time, trust score, "Select" button.
- **Selected state**: Card highlights, "Selected" badge.
- **New supplier option**: "Procure from a new supplier →" (triggers onboarding flow warning)

#### Step 2: Build Order
- **Delivery details**: Delivery address dropdown (properties/outlets), Requested delivery date (calendar picker), Special instructions (textarea).
- **Items table**:
  - Columns: #, Product (name + SKU), Quantity, Unit Price (EGP), Total (EGP), Actions (remove)
  - "Add Item" button → opens catalog mini-search modal.
  - Inline editing for quantity.
- **Running totals** (sticky right panel or bottom bar):
  - Subtotal: EGP 0.00
  - VAT (14%): EGP 0.00
  - **Grand Total: EGP 0.00**
- **Factoring toggle**: "Enable embedded factoring? Supplier gets paid in 24h. You keep 60-day terms." (Yes/No)

#### Step 3: Review & Submit
- **Order summary card**: Supplier, delivery address, requested date, item list, subtotal, VAT, total.
- **Authority Matrix Evaluation** (automatic):
  - "This order requires approval from: Financial Controller (EGP 50K+ threshold)"
  - Approver chain: Department Manager → Financial Controller → General Manager
  - Status indicators: Pending / Approved / Rejected for each level.
- **Terms checkbox**: "I confirm this order complies with our procurement policy and the supplier's terms."
- **Submit button**: "Submit Purchase Order"
- **Cancel link**: "Save as Draft" (secondary)

---

### 7. `dashboard-supplier.html` — Supplier Central
**Route:** `app/(dashboard)/supplier/page.tsx`

#### Metrics Row
- **Active Listings**: 124 — "+8 this week"
- **Pending Orders**: 23 — "+5 since yesterday"
- **Open RFQs**: 7 — "2 due today"
- **Average Rating**: 4.7 — "+0.2 this month"

#### Section: Inventory Management Table
- **Title**: "Product Catalog"
- **Actions**: "Add Product", "Bulk Upload", "Sync Inventory", "AI Catalog Upload"
- Table columns: SKU, Product Name, Category, Unit Price (EGP), Stock Level, MOQ, Rating, Views, Status, Actions.
- **Stock level indicators**:
  - Green: "Healthy — 450 units"
  - Amber: "Low — reorder suggested"
  - Red: "Critical — 12 units"
- **Row actions**: Edit, View Analytics, Pause Listing, Delete.
- **Filter tabs**: All, Active, Paused, Low Stock, Pending Review.

#### Section: Incoming RFQs
- **Title**: "Request for Quotations"
- Card list. Each card:
  - RFQ ID, Hotel name, Item count, Deadline, Status, Response count.
  - Status: "Open" (blue), "Responded" (maroon), "Closed" (gray), "Awarded" (green).
  - Action: "View Details" / "Submit Response"

#### Section: Incoming Orders
- **Title**: "Orders Awaiting Confirmation"
- Table: PO Number, Hotel, Items, Total, Order Date, Delivery Deadline, Actions.
- Actions: "Confirm Availability", "Suggest Alternative", "Decline with Reason".

#### Section: Performance Analytics
- Mini charts:
  - "Monthly Revenue Trend" (line)
  - "Top Performing Products" (horizontal bar)
  - "View-to-Order Conversion" (percentage with trend)

---

### 8. `dashboard-factoring.html` — Factoring Company Portal
**Route:** `app/(dashboard)/factoring/page.tsx`

#### Metrics Row
- **Total Portfolio**: EGP 45.2M — "12 active facilities"
- **Weighted Avg. Discount Rate**: 8.4% — "-0.3% vs Q1"
- **Active Invoices**: 89 — "3 awaiting decision"
- **Portfolio Risk Score**: 2.1 / 5.0 — "Low risk"

#### Section: Invoices Awaiting Funding
- **Title**: "Available for Factoring"
- Table columns: Invoice #, Hotel, Supplier, Amount (EGP), Due Date, Days Outstanding, Risk Rating, Trust Score, Actions.
- **Risk rating pills**: "Low" (green), "Medium" (amber), "High" (red).
- **Actions**: "Fund Now" (primary), "Request More Info", "Decline".
- **Bulk actions**: Select multiple → "Fund Selected Invoices".

#### Section: Active Facilities
- **Title**: "Funded Portfolio"
- Table: Facility ID, Hotel, Supplier, Funded Amount, Discount Rate, Funding Date, Expected Repayment, Status.
- Status: "Active" (green), "Repaid" (blue), "Overdue" (red).

#### Section: Risk Heatmap
- **Title**: "Risk by Segment"
- Grid/matrix: Rows = Hotel tiers (Luxury, Upscale, Midscale). Columns = Supplier tiers (Premier, Standard, New).
- Cell color = risk level. Cell value = exposure (EGP).
- Hover: Tooltip showing count of invoices and average days to payment.

#### Section: Liquidity Monitor
- **Title**: "Available Liquidity"
- Progress bar: "EGP 12.5M deployed / EGP 20M facility limit"
- Alert if approaching limit: "Facility utilization at 62.5%. Consider increasing limit or pausing new inquiries."

---

### 9. `dashboard-shipping.html` — Logistics Provider Portal
**Route:** `app/(dashboard)/shipping/page.tsx`

#### Metrics Row
- **Active Trips**: 14 — "6 on North Coast route"
- **On-Time Delivery Rate**: 94.2% — "+2.1% this week"
- **Fuel Saved via Optimization**: 18% — "vs. unoptimized routes"
- **Coastal Clusters Covered**: 6 — "All active"

#### Section: Route Map Visualization
- **Title**: "Live Delivery Network"
- Stylized CSS map (not a real map library). Abstract zones:
  - Greater Cairo (hub)
  - Alexandria / North Coast
  - Hurghada / Red Sea
  - Sharm El-Sheikh
  - Luxor / Aswan
  - El Gouna
- Active trip lines connecting hubs to destinations.
- Color-coded: Green (on time), Amber (delayed), Red (critical).

#### Section: Active Trips Table
- **Title**: "Trip Manifest"
- Table: Trip ID, Route, Orders, Driver, Vehicle, Departure, Est. Arrival, Status.
- **Status**: "In Transit", "At Hub", "Delivering", "Completed", "Delayed".
- Actions: "Track Live", "Contact Driver", "Update ETA".

#### Section: Route Optimization
- **Title**: "Optimize Delivery Routes"
- Input: Select cluster, select date, load orders.
- Output preview: Before vs. After comparison.
  - Distance saved: "-142 km"
  - Fuel saved: "-28 liters"
  - Time saved: "-3.5 hours"
  - Cost saved: "EGP 4,200"
- **Action**: "Apply Optimized Route" + "Export to Driver App"

#### Section: Delivery Performance
- Charts: On-time % by cluster, Avg. delivery time trend, Fuel consumption per trip.

---

### 10. `dashboard-admin.html` — Platform Control Center
**Route:** `app/(dashboard)/admin/page.tsx`

#### Metrics Row
- **Active Tenants**: 47 — "+3 this month"
- **Monthly Platform Revenue**: EGP 186,500 — "Fees + Subscriptions"
- **System Health**: "All systems operational" (green) / Or specific degraded service.
- **Pending Authority Overrides**: 2 — "Requires dual authorization"

#### Section: System Health Dashboard
- **Title**: "Platform Pulse"
- 4 status cards:
  - API Gateway: Operational (latency 42ms)
  - Database: Operational (99.9% uptime)
  - Job Queue (BullMQ): 12 pending, 0 failed
  - ETA Bridge: Operational (last submission 3 min ago)
- Alert banner if any service degraded.

#### Section: Revenue & Fees
- **Title**: "Revenue Analytics"
- Line chart: Platform fees collected (daily, monthly, quarterly).
- Breakdown table: Transaction fees, Subscription fees, Sponsored listings, Logistics markup, Factoring spread.

#### Section: Audit Log
- **Title**: "Recent Audit Events"
- Table: Timestamp, Actor, Action, Target, Status, IP Address.
- Filter: By action type, by actor, by date range.
- Export: "Export to CSV" button.

#### Section: Tenant Overview
- **Title**: "Registered Organizations"
- Table: Tenant Name, Type (Hotel/Supplier/Logistics/Factoring), Users, Orders (MTD), Status.
- Actions: "View Details", "Suspend", "Manage Roles".

#### Section: Alerts & Anomalies
- **Title**: "Requires Attention"
- Card list:
  - "Authority Matrix Override Requested: Order PO-2026-0156 by Admin user Ahmed Hassan"
  - "ETA Submission Failed: Invoice INV-2026-0042 — Dead letter queue"
  - "Risk Anomaly: Factoring exposure to Supplier 'Cairo Star Trading' exceeded threshold"
  - "Swarm Job Stuck: Lead enrichment job #4821 in queue for 45 minutes"

#### Section: Swarm Control Unit
- **Title**: "Agent Swarm Status"
- Grid of agent cards:
  - Agent name, Squad, Status (Active/Idle/Error), Last run, Jobs completed today.
  - Actions: "View Logs", "Pause Agent", "Trigger Manual Run".
- Job queue summary: Pending, Processing, Completed, Failed counts.
- Memory status: "Redis hot cache: 1,247 entries. Prisma persistent: 45,892 records."

---

### 11. `leads-crm.html` — Lead Management (Growth Squad)
**Route:** `app/(dashboard)/marketing/leads/page.tsx`

#### Layout
- Kanban board (main view) + list view toggle.

#### Top Controls
- **Title**: "Lead Pipeline"
- **Search**: "Search by company name, city, or contact..."
- **Filters**: Entity Type (Hotel/Supplier/Factor/Logistics), City, Priority (1–10), Source, Date Range.
- **Actions**: "Add Lead", "Bulk Import", "Export", "Run AI Enrichment".

#### Kanban Columns
1. **Discovered** — New leads from scraping, referrals, or manual entry.
2. **Enriched** — AI has populated company data, contact info, and priority score.
3. **Contacted** — Outreach email or call made.
4. **Qualified** — Meets criteria (size, location, category).
5. **Meeting Scheduled** — Demo or discovery call booked.
6. **Proposal Sent** — Commercial terms shared.
7. **Negotiating** — Terms under discussion.
8. **Converted** — Became a registered tenant.
9. **Lost** — Disqualified or chose competitor.
10. **Paused** — Temporarily on hold.

#### Lead Card Content
- **Company name** (bold)
- **Entity type pill**: HOTEL / SUPPLIER / FACTOR / LOGISTICS
- **Location**: City, Governorate
- **Priority score**: "P8" (large number, color by score: 8-10 red, 5-7 amber, 1-4 gray)
- **Last activity**: "Enriched 2 hours ago" / "Email opened 1 day ago"
- **Assigned to**: Avatar + name
- **Quick actions** (hover): Enrich, Outreach, Convert, Edit, Archive.

#### Lead Detail Slide-over (when card clicked)
- **Header**: Company name + entity type + priority + status dropdown.
- **Tabs**:
  - **Overview**: Contact info, address, website, source, assigned owner, tags.
  - **Activity Timeline**: "AI Enriched — 3 data points added", "Email sent to gm@company.com — opened", "Call scheduled for May 10".
  - **Notes**: Free-text notes with timestamps.
  - **Documents**: Attachments, proposals, contracts.
- **Actions**: "Send Outreach", "Schedule Meeting", "Convert to Tenant", "Mark as Lost".

---

### 12. `ai-assistant.html` — Smart Assistant Panel
**Route:** Component used across all dashboards.

#### Floating Trigger Button
- Bottom-right corner. Circle. Sparkle icon. Maroon accent.
- Badge: Unread count if messages pending.

#### Expanded Panel (400px × 600px)
- **Header**: "Smart Assistant" + role indicator ("Hotel Mode" / "Supplier Mode" / etc.) + minimize/close.
- **Message area**: Scrollable. Bubbles:
  - **User**: White/light bg, right-aligned.
  - **Assistant**: Dark bg with subtle left border accent. Typing indicator shows three dots.
- **Suggested prompts** (chips above input):
  - Hotel: "Find F&B suppliers in 6th of October", "Check status of PO-2026-0042", "What's my budget utilization?", "Suggest reorder for low-stock items"
  - Supplier: "Forecast demand for next month", "Which products need price adjustment?", "Summarize pending orders", "Generate invoice from delivered orders"
  - Factoring: "Assess risk of Hotel X", "Portfolio yield this quarter", "Flag overdue invoices"
  - Logistics: "Optimize tomorrow's North Coast route", "Fuel cost forecast", "Delivery bottleneck alerts"
  - Admin: "System health summary", "Fee anomaly detection", "Cross-tenant audit flags"
- **Input**: Text field with placeholder "Ask anything about your workspace..." + send button.
- **Footer**: "Powered by Hotels Vendors Intelligence Engine"

---

### 13. `design-system.html` — Design Tokens & Component Reference
A single reference page showing:

#### Colors (swatches with names)
- Background Primary, Background Secondary, Background Elevated
- Text Primary, Text Secondary, Text Tertiary, Text Inverse
- Accent Primary, Accent Secondary
- Success, Warning, Error, Info
- Border Default, Border Hover, Border Active

#### Typography
- Show each heading level with actual text sample.
- Show body, caption, overline, button text, data/numbers.

#### Spacing Scale
- Visual blocks showing 4, 8, 12, 16, 24, 32, 48, 64, 96px.

#### Components
- **Buttons**: Primary, Secondary, Ghost, Danger — default, hover, active, disabled, loading states.
- **Inputs**: Text, Password, Select, Textarea, Search, With icon, With error, With helper text.
- **Cards**: Default, Hover state, Selected, Featured, With header image placeholder.
- **Badges**: Default, Success, Warning, Error, Info, Maroon.
- **Table**: Header row, data rows, hover row, selected row, empty state, loading skeleton.
- **Modals / Slide-overs**: Header, body, footer with actions.
- **Toast / Alert**: Success, Warning, Error, Info — with icon, title, message, action link.
- **Tabs**: Underline style, pill style.
- **Pagination**: Page numbers, prev/next, "Showing X of Y".
- **Dropdown / Select**: Default, open state, with groups, with search.
- **Toggle / Switch**: On, Off, Disabled.
- **Checkbox / Radio**: Default, checked, indeterminate, disabled.
- **Skeleton Loaders**: Text line, card, table row.
- **Progress bars**: Determinate, indeterminate, with label.
- **Tooltips**: Top, bottom, left, right.

---

## INTERACTION PATTERNS & HOVER STATES

### General Hover Rules
- **Cards**: Lift by 2px (`translateY(-2px)`), subtle shadow increase, border brightens. Duration: 200ms, ease-out.
- **Buttons**: Primary — darken by 10%. Secondary — fill with subtle bg color. Ghost — bg fills with white/5.
- **Table rows**: Background shifts to white/3. Action icons fade in (hidden by default, visible on hover).
- **Links**: Underline slides in from left. Color shifts to accent.
- **Icons in nav**: Scale to 1.1, color shifts to accent.

### Focus States
- All interactive elements: 2px ring offset by 2px. Ring color = accent.
- Inputs: Border color = accent, subtle glow shadow.

### Active / Pressed States
- Buttons: Scale to 0.98. Shadow reduces.
- Cards: Scale to 0.99.

### Loading States
- Buttons: Text fades, spinner icon appears (centered).
- Cards: Skeleton shimmer effect.
- Tables: Skeleton rows (3–5) where data will appear.

### Empty States
- Icon (large, muted) + headline + description + CTA.
- Example: "No orders yet" + "Browse the catalog to place your first purchase order." + "Explore Catalog" button.

---

## INTEGRATION ANNOTATIONS (For Kimi)

Every interactive element MUST have an HTML comment annotation. This is how Kimi will wire the frontend to the backend.

### Annotation Format

```html
<!-- WIRE:
  page: dashboard-hotel.html
  component: RecentOrdersTable
  route: app/(dashboard)/hotel/page.tsx
  data_source: GET /api/v1/hotel/orders?page=1&limit=10
  response_shape: { orders: [{ id, orderNumber, supplier: { name }, items: [...], total, status, createdAt, estimatedDelivery }], pagination: { page, limit, total, totalPages } }
  refresh: 30s
  permissions: ["order:read"]
  actions:
    - View: navigate to /dashboard/hotel/orders/[id]
    - Track: open tracking modal (GET /api/v1/shipping/trips?orderId=...)
    - Download: GET /api/v1/orders/[id]/pdf
  empty_state: "No orders this period. Browse the catalog to place your first order."
-->
```

For static navigation:
```html
<!-- NAV:
  element: "Catalog" sidebar link
  target: /dashboard/hotel/catalog
  route: app/(dashboard)/hotel/catalog/page.tsx
  icon: LayoutGrid
-->
```

For forms:
```html
<!-- FORM:
  page: order-builder.html
  route: app/(dashboard)/hotel/order/page.tsx
  endpoint: POST /api/v1/orders
  schema: { hotelId, supplierId, propertyId, outletId, items: [{ productId, quantity, unitPrice }], deliveryDate, notes, enableFactoring: boolean }
  validation: Required: supplierId, items (min 1), deliveryDate. Unit price ≥ 0. Quantity ≥ MOQ.
  idempotency: true (header: X-Idempotency-Key)
  onSuccess: redirect /dashboard/hotel/orders?created=PO-2026-XXXX
  onError: toast error message from response
  steps: 3 (Select Supplier → Build Order → Review & Submit)
-->
```

---

## OUTPUT FILES

Save to `/Users/Moataz/hotels-vendors/orchestra/openclaw/design-output/`:

```
design-output/
├── index.html                 (Marketing landing)
├── login.html                 (Auth login)
├── register.html              (Auth register)
├── dashboard-hotel.html       (Hotel buyer dashboard)
├── catalog.html               (Catalog browse)
├── catalog-detail.html        (Product detail — Buy Box)
├── order-builder.html         (3-step PO creation)
├── dashboard-supplier.html    (Supplier central)
├── dashboard-factoring.html   (Factoring portal)
├── dashboard-shipping.html    (Logistics portal)
├── dashboard-admin.html       (Admin control center)
├── leads-crm.html             (Lead pipeline kanban)
├── ai-assistant.html          (Smart assistant panel)
└── design-system.html         (Component reference)
```

---

## CRITICAL RULES

1. **NO stock photos.** CSS gradients, geometric shapes, icons only.
2. **NO placeholder text.** Use the exact professional copy provided above.
3. **NO "Lorem ipsum."** Every headline, label, button, and description must be real.
4. **Amazon-inspired patterns**: Search-first, category pills, filter sidebar, buy box, card grids, sticky action bars, breadcrumb trails.
5. **B2B language**: "Procure" not "buy", "Source" not "shop", "Purchase Order" not "cart".
6. **Professional tone**: Authoritative, institutional, action-oriented. No exclamation marks in dashboards.
7. **Clean build**: Logical grouping, clear hierarchy, no visual clutter. Whitespace is intentional.
8. **Fonts**: Inter for all UI. Playfair Display for marketing headlines only.
9. **Annotations**: Every interactive element MUST have a WIRE, NAV, or FORM comment block.
10. **Tech**: Inline CSS in `<style>`. Lucide icons via CDN. No external CSS files.

## PROMPT END

---

## After OpenClaw Finishes

1. OpenClaw creates the mockup HTML files with annotations.
2. Review in browser: `file:///Users/Moataz/hotels-vendors/orchestra/openclaw/design-output/index.html`
3. Tell Kimi: "OpenClaw designs are ready"
4. Kimi reads the HTML, extracts design tokens + WIRE/NAV/FORM annotations, and implements React + Tailwind pages with full API integration.
