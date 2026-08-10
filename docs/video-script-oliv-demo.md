# HotelsVendors × Oliv Finance — Product Demo Video Script
## "From Registration to Funding in 60 Seconds"

**Duration:** 3:45 minutes
**Style:** Screen recording with voiceover, dark UI glassmorphism theme
**Resolution:** 1920×1080 (16:9)
**Tone:** Professional, confident, technical but accessible

---

## SCENE 1: INTRO (0:00 – 0:15)

**Visual:** Dark background with HotelsVendors logo animating in. Text: "Digital Procurement Hub for Egyptian Hospitality".

**Narration:**
> "HotelsVendors is the digital procurement hub for Egyptian hospitality. Today, we'll walk through how a supplier registers, uploads an invoice, and gets funded through Oliv Finance — all in one flow."

**On-screen text:** `hotelsvendors.com`

---

## SCENE 2: SUPPLIER REGISTRATION (0:15 – 0:45)

**Visual:** Browser navigates to `hotelsvendors.com/signup`. Supplier fills registration form.

**Step 1:** Show signup page
- **URL:** `hotelsvendors.com/signup`
- **Form fields visible:** Company Name, Email, Password, Phone, Role selector
- **User selects:** "I'm a Supplier"

**Step 2:** Fill registration form
- Company Name: "ABC Cleaning Supplies LLC"
- Email: "supplier@abccleaning.com"
- Phone: "+20-100-1234567"
- Password: (masked)

**Step 3:** Click "Create Account"

**Narration:**
> "A supplier visits hotelsvendors.com and creates an account. They select 'Supplier' as their role and fill in their company details. The system creates their tenant-isolated workspace."

**On-screen text:** `Step 1: Supplier Registration`

---

## SCENE 3: KYC & CONSENT (OLIV ONBOARDING) (0:45 – 1:30)

**Visual:** Supplier dashboard loads. Modal appears: "Activate Oliv Financing".

**Step 1:** Show supplier dashboard
- **URL:** `hotelsvendors.com/supplier`
- **Dashboard shows:** Welcome message, empty state, "Activate Oliv Financing" CTA

**Step 2:** Click "Activate Oliv Financing"
- **Modal opens:** Consent screen with PDPL-compliant data sharing terms
- **Consent text visible:** "I authorize HotelsVendors to share my business data with Oliv Finance for credit assessment..."
- **Checkboxes:** Business Registration, Tax Records, Bank Details
- **User checks all boxes**

**Step 3:** Click "Grant Consent"
- **System sends pre-fill payload to Oliv:**
  ```
  POST /api/v1/oliv/onboard-supplier
  partner_id: "HOTELSVENDORS_GLOBAL_001"
  attribution_type: "permanent_origin_account"
  ```

**Step 4:** Redirect to Oliv app
- **Oliv app opens with pre-filled data:**
  - Company Name: "ABC Cleaning Supplies LLC"
  - CR Number: "CR-12345"
  - Tax ID: "MS-12345-67890"
  - Signatory: "Ahmed Mohamed Ali"

**Narration:**
> "The supplier clicks 'Activate Oliv Financing'. They see a PDPL-compliant consent screen. After granting consent, HotelsVendors sends their KYC data to Oliv with our permanent attribution tag. The supplier is redirected to Oliv's app where their data is pre-filled. Oliv runs their own e-KYC as required by FRA rules."

**On-screen text:** `Step 2: KYC & Consent (PDPL-Compliant)`

**On-screen highlight:** `partner_id: "HOTELSVENDORS_GLOBAL_001"` (pulsing glow)

---

## SCENE 4: INVOICE UPLOAD (1:30 – 2:00)

**Visual:** Back on HotelsVendors dashboard. Supplier clicks "Upload Invoice".

**Step 1:** Navigate to invoice upload
- **URL:** `hotelsvendors.com/supplier/financing`
- **Page shows:** "Upload Invoice for Factoring"

**Step 2:** Upload ETA invoice
- **Method:** "Upload PDF" or "Enter Manually"
- **User selects:** "Upload PDF"
- **File picker:** Selects invoice PDF
- **System extracts:** ETA UUID, Supplier Tax ID, Hotel Tax ID, Total, VAT

**Step 3:** Invoice details displayed
- ETA UUID: `eta-uuid-123456`
- Supplier: "ABC Cleaning Supplies LLC"
- Hotel: "Marriott Cairo"
- Invoice Total: EGP 50,000
- VAT: EGP 7,000

**Step 4:** Click "Submit Invoice"

**Narration:**
> "The supplier uploads their ETA invoice. HotelsVendors validates the invoice against the Egyptian Tax Authority portal. The invoice details are extracted and displayed for confirmation."

**On-screen text:** `Step 3: Invoice Upload & ETA Validation`

---

## SCENE 5: FACTOR VIA OLIV (2:00 – 2:45)

**Visual:** Invoice card shows "Factor via Oliv" button. Supplier clicks it.

**Step 1:** Show invoice card
- **Status:** "Validated"
- **Button:** "Factor via Oliv" (green, prominent)

**Step 2:** Click "Factor via Oliv"
- **System generates referral token (Layer 1):**
  ```
  HotelsVendors_Referral_Token:
    signature: "a1b2c3d4e5f6..."
    partner_id: "HOTELSVENDORS_GLOBAL_001"
    attribution_type: "permanent_origin_account"
  ```

**Step 3:** Confirmation modal
- **Shows:**
  - Invoice: EGP 50,000
  - Advance Rate: 85%
  - Platform Fee: 2% (EGP 1,000)
  - Net Disbursement: EGP 41,500
  - Financing Days: 30

**Step 4:** Click "Confirm Factoring"
- **System sends to Oliv:**
  ```
  POST https://api.olivfinance.com/invoice/factor
  Headers:
    X-HotelsVendors-Referral-Token: "a1b2c3d4e5f6..."
    X-Partner-ID: "HOTELSVENDORS_GLOBAL_001"
    X-Attribution-Type: "permanent_origin_account"
    X-Callback-URL: "https://www.hotelsvendors.com/api/v1/oliv/payout-callback"
  ```

**Narration:**
> "The supplier clicks 'Factor via Oliv'. HotelsVendors generates an immutable referral token using HMAC-SHA256. This token is the digital signature that proves the transaction originated from our platform. The token is sent to Oliv with the invoice data."

**On-screen text:** `Step 4: Referral Token Generation (Layer 1)`

**On-screen animation:** Token being generated with HMAC signature (visual metaphor: lock being created)

---

## SCENE 6: OLIV PROCESSES FACTORING (2:45 – 3:00)

**Visual:** Oliv's internal processing (mockup/slide).

**Step 1:** Oliv receives the request
- **Oliv's screen shows:**
  - Invoice received from HotelsVendors
  - Referral token verified
  - Supplier KYC data pre-filled
  - Credit assessment in progress

**Step 2:** Oliv approves
- **Oliv's screen shows:**
  - Credit limit: EGP 500,000
  - Available: EGP 458,500
  - Factoring approved

**Step 3:** Oliv sends callback
- **POST to HotelsVendors:**
  ```
  POST https://www.hotelsvendors.com/api/v1/oliv/payout-callback
  Headers:
    x-oliv-signature: "oliv-hmac-signature"
    x-oliv-timestamp: "2026-07-15T12:00:00Z"
  Body:
    olivTransactionId: "OLIV-TXN-2026-0715-001"
    referralToken: { ... }  ← MUST echo back
    payoutStatus: "DISBURSED"
    disbursedAmount: 42500
    factoringFee: 1062.5
  ```

**Narration:**
> "Oliv receives the invoice, verifies the referral token, and runs their e-KYC. Once approved, Oliv disburses the funds and sends a payout callback to HotelsVendors. The callback MUST include our referral token."

**On-screen text:** `Step 5: Oliv Processing & Payout`

---

## SCENE 7: LAYER 2 VERIFICATION (3:00 – 3:20)

**Visual:** HotelsVendors webhook handler processes the callback.

**Step 1:** Webhook receives callback
- **Code shows:**
  ```
  verifyReferralToken(callback.referralToken)
  → { valid: true, payload: { etaUuid: "...", hotelTaxId: "..." } }
  ```

**Step 2:** Platform fee deducted
- **System calculates:**
  - Disbursed Amount: EGP 42,500
  - Platform Fee (2%): EGP 850
  - Net to Supplier: EGP 41,650

**Step 3:** Ledger entry created
- **Audit log:**
  ```
  ACTION: FACTORIZATION_RECONCILED
  ETA UUID: eta-uuid-123456
  Platform Fee: EGP 850
  Net Disbursement: EGP 41,650
  ```

**Narration:**
> "HotelsVendors verifies the referral token. The HMAC signature matches — the transaction is authentic. The 2% platform fee is deducted before disbursement. An immutable ledger entry is created."

**On-screen text:** `Step 6: Layer 2 Verification & Fee Deduction`

**On-screen animation:** Checkmark appearing on referral token (verification success)

---

## SCENE 8: DASHBOARD VIEW (3:20 – 3:40)

**Visual:** Supplier views their dashboard.

**Step 1:** Cashflow dashboard
- **URL:** `hotelsvendors.com/supplier/cashflow`
- **Shows:**
  - Total Revenue: EGP 50,000
  - Platform Fees: EGP 850
  - Net Received: EGP 41,650
  - Pending Factoring: 1

**Step 2:** Credit facility
- **URL:** `hotelsvendors.com/supplier/credit-facility`
- **Shows:**
  - Credit Limit: EGP 500,000
  - Utilized: EGP 42,500
  - Available: EGP 457,500
  - Utilization: 8.5%

**Narration:**
> "The supplier can track everything on their dashboard. Cashflow, credit facility, payment schedule — all in one place. No need to leave the platform."

**On-screen text:** `Step 7: Real-Time Dashboard`

---

## SCENE 9: ANTI-BYPASS GUARANTEE (3:40 – 3:45)

**Visual:** Dark background with 3 layers visualized as shields.

**Text on screen:**
```
LAYER 1: IMMUTABLE REFERRAL TOKEN
  → Oliv cannot forge without our secret key

LAYER 2: PAYOUT BLOCKING
  → Oliv cannot reconcile without valid token

LAYER 3: CRM ATTRIBUTION
  → Future manual entries trigger commission
```

**Narration:**
> "Three layers of protection. HotelsVendors is the middleman — not a funder, not a marketplace. The referral token is our lock. The payout callback is our guard. The attribution tag is our insurance."

**On-screen text:** `Anti-Bypass Architecture — Built for CR Compliance`

---

## SCENE 10: END CARD (3:45)

**Visual:** HotelsVendors logo + "HotelsVendors × Oliv Finance"

**Text:**
```
Digital Procurement Hub for Egyptian Hospitality
hotelsvendors.com

Powered by Oliv Finance
Licensed by FRA — Fintech Law No. 5/2022
```

**Narration:**
> "HotelsVendors. From registration to funding. One platform. One flow. One lock."

---

## TECHNICAL NOTES FOR VIDEO GENERATION

### Color Palette
- Background: `#0c0c12`
- Surface: `#12121a`
- Border: `rgba(255,255,255,0.10)`
- Green: `#39ff7e`
- Orange: `#ff7e1a`
- Purple: `#c455ff`
- Blue: `#64b5f6`

### Fonts
- Headings: Plus Jakarta Sans (tracking: 0.18em)
- Code: Fira Code
- Body: Inter

### UI Elements
- Cards: Rounded-2xl, backdrop-blur, bg-white/5, border-white/10
- Buttons: Rounded-xl, bg-[#39ff7e] text-black
- Inputs: Rounded-xl, border-white/10, bg-white/5

### Animation Style
- Smooth transitions (ease-in-out)
- Subtle glow effects on green elements
- Token generation: lock icon appearing
- Verification: checkmark animation
- Dashboard: data flowing in

### Music
- Ambient electronic, low tempo
- Builds during technical sections
- Resolves at end card

### Voiceover
- Male/female, professional, clear
- Pace: 150 words per minute
- Tone: Confident, technical but accessible
