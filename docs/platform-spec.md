# Hotels Vendors — Complete Platform Specification

## Platform Identity
**Name:** Hotels Vendors
**Tagline:** Smarter Together
**Industry:** B2B Digital Procurement for Egyptian Hospitality
**Target Users:** Hotel procurement managers, suppliers, logistics providers, factoring companies, platform admins
**Core Value:** One platform connecting hotels, suppliers, logistics, and factoring — fixed pricing, ETA e-invoicing, AI intelligence.

## Four-Sided Marketplace
1. **Hotels (Buyers)** — Procure goods and services
2. **Suppliers (Sellers)** — List fixed-price inventory
3. **Logistics Providers** — Fulfill shared-route delivery
4. **Factoring Companies** — Provide invoice financing and liquidity

## User Roles & Portals

### 1. Hotel Procurement Portal
**Users:** Hotel procurement managers, CFOs, department heads
**Goal:** Discover, order, track, and pay for hospitality supplies

**Pages & Features:**
- **Dashboard (Command Center)**
  - Live metric cards: Active Orders, Pending Approvals, Monthly Spend, Inventory Alerts, ETA Submissions, Team Members
  - Purchase Orders table: PO #, Supplier, Amount, Status, Date
  - Approval Queue: orders awaiting Authority Matrix approval
  - Team list with roles
  - Authority Rules summary
  - Quick-action buttons: New Order, Browse Catalog, View Reports

- **Properties** — Multi-property hotel group management
- **Suppliers** — Verified supplier directory, ratings, contact
- **Catalog** — 10,000+ SKU browse, search, category filters, product cards with price/MOQ
- **Orders** — PO builder, cart, checkout, status tracking
- **Invoices** — Invoice history, ETA submission status, download PDF
- **Accounting** — Spend reports, budget tracking, cost centers
- **AI Inventory** — Demand forecasting, reorder alerts, stock levels
- **ETA Demo** — Egyptian Tax Authority e-invoicing preview
- **Intelligence** — Price benchmarking, market insights, spend optimization

### 2. Supplier Central Portal
**Users:** Supplier owners, sales managers, inventory managers
**Goal:** List products, manage orders, get paid fast

**Pages & Features:**
- **Dashboard** — Revenue, Active Orders, Product Count, Fulfillment Rate
- **Products** — SKU management, pricing, quantities, categories (F&B, Housekeeping, Linens, Engineering, Amenities, Capital Equipment)
- **Orders** — Incoming POs, fulfillment workflow, shipping labels
- **Catalog Visibility** — Sponsored listings, search ranking
- **Financing** — Factoring requests, payment status

### 3. Factoring Portal
**Users:** Factoring company analysts, risk officers
**Goal:** Assess credit risk, fund invoices, manage portfolio

**Pages & Features:**
- **Dashboard** — Portfolio value, Active Facilities, Yield, Risk Distribution
- **Credit Requests** — Hotel credit applications, risk scores
- **Invoices** — Fundable invoices, funding history, repayment tracking
- **Risk Heatmap** — Geographic and sector risk visualization
- **Liquidity** — Available capital, deployed capital, returns

### 4. Logistics Portal
**Users:** Route planners, delivery coordinators, drivers
**Goal:** Optimize delivery routes, track shipments

**Pages & Features:**
- **Dashboard** — Active Trips, Delivery Success Rate, Fleet Status, Fuel Costs
- **Trips** — Route planning, multi-drop optimization, coastal cluster consolidation
- **Tracking** — Real-time delivery tracking for hotels
- **Route Optimization** — AI-powered route suggestions

### 5. Admin Portal
**Users:** Platform administrators, auditors, compliance officers
**Goal:** Monitor platform health, manage users, track fees

**Pages & Features:**
- **Dashboard** — Platform GMV, Active Users, Transaction Volume, Fee Revenue
- **Suppliers** — Supplier onboarding, verification, tier management
- **Security** — RBAC management, permission matrix, audit logs
- **Authority Matrix** — Approval rule configuration, override logs
- **Cron Jobs** — Automated price checks, report generation
- **Audit Log** — Immutable record of all order mutations and admin actions
- **Risk Heatmap** — Cross-tenant risk visualization
- **Liquidity Monitor** — Factoring partner capital tracking
- **Pulse** — Real-time platform health metrics

---

## Public Pages (No Login Required)

### Landing Page (Home)
**Purpose:** Convert visitors into registered hotels/suppliers
**Content:**
- Hero: Value proposition, two CTAs (Start Free, Explore Catalog)
- Trust bar: 8+ Egyptian hotel brand names/logos
- Features grid: 6 core capabilities with icons
- How It Works: 3-step flow (Discover → Order → Fulfill)
- Pricing: 3 tiers (Starter free, Professional EGP 4,500/mo, Enterprise custom)
- CTA section: Final conversion push
- Footer: Product, Company, Legal links + social icons

### About Page
**Purpose:** Establish credibility and trust
**Content:**
- Founder & CEO bio (Moataz Abdel Ghani)
- Big 4 experience badges (EY, Deloitte, KPMG)
- Professional journey timeline
- Mission statement
- Contact CTA

### Help Center
**Purpose:** Self-service support and onboarding
**Content:**
- Search bar for help topics
- Video guide cards: Hotel Portal, Supplier Portal, Admin Portal, Factoring Portal
- FAQ accordion
- Support contact: email, phone, chat hours
- Status page link

### Catalog (Marketplace)
**Purpose:** Public product discovery
**Content:**
- Search bar
- Category filters: F&B, Housekeeping, Linens, Engineering, Amenities, Capital Equipment
- Product grid: image, name, supplier, price, MOQ
- Product detail: specifications, supplier info, add to cart

### Settings (Public)
**Purpose:** Theme customization
**Content:**
- Theme presets: Crimson, Indigo, Emerald, Violet, Cyan, Gold
- Custom color picker
- Typography: Font family, size scale
- Layout density: Compact, Default, Spacious
- Reset button

---

## Core Features to Represent Visually

### 1. Fixed Pricing
No bidding. Suppliers list exact prices and available quantities.

### 2. Authority Matrix
Multi-level approval chains for purchase orders based on:
- Order value threshold
- Hotel hierarchy
- Supplier tier
- Dual-authorization for admin overrides

### 3. ETA E-Invoicing
Real-time submission to Egyptian Tax Authority:
- Digitally signed invoices
- UUID tracking
- Full compliance automation
- Dead-letter queue for failed submissions

### 4. Embedded Factoring
Non-recourse invoice financing at checkout:
- Suppliers paid in 48 hours
- Hotel pays on their normal cycle
- Factoring company takes the credit risk

### 5. Shared Logistics
Coastal-cluster delivery optimization:
- Route consolidation
- 40% cost reduction
- Real-time tracking
- Seasonal supply management

### 6. AI Procurement Intelligence
- Demand forecasting by season
- Price benchmarking across suppliers
- Smart reorder alerts
- Spend optimization recommendations

---

## Navigation Structure

**Public Nav:**
Product | Solutions | Pricing | Enterprise | About | Settings | Sign In | Get Started

**Hotel Dashboard Sidebar:**
OPERATIONS: Dashboard | Hotels | Suppliers | Catalog | Orders | Invoices | Accounting | AI Inventory
COMPLIANCE: ETA Demo
INTELLIGENCE: Intelligence
SUPPORT: Help & Guides

**Supplier Dashboard Sidebar:**
OPERATIONS: Dashboard | Products | Orders
SUPPORT: Help & Guides

**Admin Dashboard Sidebar:**
OPERATIONS: Dashboard | Suppliers | Security
SUPPORT: Help & Guides

---

## Icons Needed (Lucide React)
- LayoutDashboard, Building2, Users, PackageSearch, ClipboardList, FileText, Calculator, BarChart3
- Zap, BrainCircuit, Settings, HelpCircle, ArrowRight, CheckCircle2, Menu, X
- Truck, CreditCard, Landmark, ShieldCheck, Globe, Sparkles, Clock, Star
- Search, ChevronRight, CheckCircle, Monitor, Smartphone, Tablet
- Palette, Type, LayoutTemplate, RotateCcw, PlayCircle, BookOpen, MessageCircle
- Mail, Phone, Megaphone, Camera, Briefcase, Share2, CalendarDays

---

## Data & Stats to Display
- 10,000+ Verified SKUs
- 1,200+ Suppliers
- EGP 2.4B GMV Processed
- 48h Average Delivery
- 200+ Egyptian Hotels
- 6th of October City → 10th of Ramadan → Coastal Clusters
- 15-property chain saves ~$780K/year in storage costs
- Transaction fees: 1.5%–2.5%

---

## Authentication Flow
- Login (email/password or OTP)
- Register (role selection: Hotel, Supplier, Logistics, Factoring)
- Email verification
- Role-specific onboarding wizard

## Responsive Requirements
- Desktop: Full sidebar + main content
- Tablet: Collapsible sidebar
- Mobile: Bottom nav or hamburger menu

## Key User Flows
1. **Hotel Buyer:** Login → Browse Catalog → Add to Cart → Build PO → Authority Matrix Approval → Order Confirmed → Track Delivery → Receive Invoice → ETA Submitted
2. **Supplier:** Login → Upload Products → Receive PO → Confirm Order → Arrange Delivery → Get Paid (48h via factoring)
3. **Factoring Company:** Login → Review Credit Requests → Assess Risk → Fund Invoices → Track Repayments
4. **Logistics:** Login → View Active Trips → Optimize Routes → Confirm Deliveries → Update Status
