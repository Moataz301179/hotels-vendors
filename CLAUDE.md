# Hotels Vendors — Platform Context for Agents

## Business Model
- **Fixed-price catalogs** (no bidding/auctions)
- **Per-hotel negotiated credit limits** (Net-30, Net-60 terms)
- **Embedded invoice factoring** (suppliers get paid early, platform takes a spread)
- **Shark-Breaker shared coastal logistics** (consolidated delivery to Red Sea resorts)
- **ETA e-invoicing compliance mandatory** (Egyptian Tax Authority digital invoice integration)

## Target Market (CRITICAL)
- **Primary**: Coastal hotels in **Sharm El-Sheikh** and **Hurghada** (Red Sea)
- **Secondary**: Cairo, Alexandria, North Coast
- **Customer type**: Local branded hotel chains (Stella Di Mare, Sunrise, Jaz, Baron, etc.) — NOT just international 5-star brands
- **Properties**: Resorts with 100-500 rooms, multiple F&B outlets, pools, spas, water sports

## Geography Implications
- Supply chain is **coastal-centric**: seafood, pool chemicals, beach equipment, diving gear, linen turnover
- **Seasonality**: High season Oct-Apr, low season May-Sep (affects inventory forecasting)
- **Logistics**: Long distance from Cairo suppliers → Shark-Breaker hub model essential
- **Payment cycles**: Coastal hotels often have cash-flow seasonality → factoring is critical

## Product Categories (5 max)
1. **F&B** — food, beverages, kitchen equipment
2. **Consumables** — housekeeping chemicals, linens, toiletries, cleaning supplies
3. **Guest Supplies** — amenities, room accessories, guest room FF&E
4. **FF&E** — furniture, fixtures, equipment (capital purchases)
5. **Services** — maintenance, pest control, laundry, security, consulting

## User Roles
- **Hotel Buyer** — procurement teams at individual properties
- **Supplier** — food suppliers, linen vendors, chemical manufacturers, equipment dealers
- **Factoring Company** — financial institutions buying receivables
- **Shipping/Logistics** — Shark-Breaker coastal delivery partners
- **Admin** — platform operators

## Competitive Context
- Amazon Business (generic, not hospitality-focused)
- Local wholesalers (Al-Gomhouria, etc.) — manual, no digital
- Hotel ERP systems (Opera, etc.) — procurement modules are weak
- **Gap**: No Egypt-focused, hospitality-specific B2B marketplace with ETA compliance

## Technical Stack
- Next.js 16 App Router + Turbopack
- React 18 + TypeScript strict
- Tailwind CSS v4
- Prisma 7 + SQLite (dev) → PostgreSQL (prod)
- No external UI libraries (no shadcn, no MUI)
