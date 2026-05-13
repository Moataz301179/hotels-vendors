# AfrexAI Prospect Research Skill

## Purpose
Autonomously research potential hotel or supplier prospects from minimal starting information (name, city, or website) and produce structured intelligence reports.

## When to Use
- You have a list of hotel names and need full profiles
- You discovered a new supplier and need to verify legitimacy
- A lead was submitted and needs enrichment before outreach
- You need to qualify prospects before sales engagement

## Input
- Prospect name (hotel or supplier)
- City / governorate (optional)
- Website URL (optional)
- Known contact (optional)

## Output
```json
{
  "name": "...",
  "type": "HOTEL|SUPPLIER",
  "verified": true|false,
  "enrichment": {
    "website": "...",
    "phone": "...",
    "email": "...",
    "address": "...",
    "socialProfiles": ["..."],
    "yearsInBusiness": 0,
    "employees": 0
  },
  "trustSignals": {
    "hasWebsite": true|false,
    "hasTaxId": true|false,
    "hasCommercialReg": true|false,
    "yearsInBusiness": 0,
    "onlinePresence": "STRONG|MODERATE|WEAK"
  },
  "procurementProfile": {
    "estimatedMonthlySpend": 0,
    "categories": ["F&B", "Linens", "..."],
    "paymentTerms": "...",
    "existingSuppliers": ["..."]
  },
  "score": 0,
  "priority": "HOT|WARM|COLD"
}
```

## Research Procedure

### Step 1: Web Presence Discovery
```
1. Google search: "{name} Egypt hotel"
2. Check first 5 results
3. Identify official website, booking.com, tripadvisor, facebook
4. Extract: phone, email, address, photos
```

### Step 2: Social Media & Reviews
```
1. Search Facebook page
2. Search Instagram
3. Search Google Reviews
4. Extract: follower count, review count, avg rating, recent activity
```

### Step 3: Business Registration Verification
```
1. If tax ID known, verify via ETA portal (if accessible)
2. Search commercial registry databases
3. Cross-reference address with Maps
```

### Step 4: Procurement Estimation
```
HOTEL formula:
- Rooms × Occupancy (60%) × 365 × avg daily spend per room
- Daily spend: EGP 500 (budget) | EGP 1,500 (mid) | EGP 5,000 (luxury)

SUPPLIER formula:
- If factory: check industrial zone directories
- If distributor: estimate from product range + delivery fleet
```

### Step 5: Scoring
```
+20: Has verified website
+20: Has tax ID
+15: Has commercial registration
+15: 3+ years in business
+10: Active social media
+10: Positive reviews (4+ stars)
+10: Estimated monthly spend > EGP 100K

Score:
80-100: HOT — immediate outreach
50-79: WARM — nurture
<50: COLD — deprioritize
```

## Hotels Vendors Specific

### Hotel Prospect Signals
- Star rating (3, 4, 5)
- Room count (>50 = good, >200 = excellent)
- Chain affiliation (Marriott, Hilton, etc. = high trust)
- Recent renovation (procurement spike expected)
- Online reviews mention cleanliness/amenities (high standards = better client)

### Supplier Prospect Signals
- HACCP certification
- Export license
- Factory location (6th October, 10th Ramadan = industrial)
- Existing hotel clients visible on website
- Cold chain capability (for F&B)
