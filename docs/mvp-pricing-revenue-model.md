# HotelsVendors — MVP Pricing & Revenue Model
## Benchmark Startup Phase: Profitability-First Architecture

**Last Updated:** 2026-07-15
**Status:** Recommended Pricing Structure
**Currency:** EGP (Egyptian Pound)

---

## EXECUTIVE SUMMARY

HotelsVendors generates revenue from **5 independent streams** that compound as the platform scales. The pricing model is designed to:

1. **Maximize AI subscription margin** — LLM cost < 1% of subscription price
2. **Incentivize invoice factoring** — lower platform fee for factoring users
3. **Create switching costs** — credits, data, workflow lock-in
4. **Scale with GMV** — transaction fees grow linearly with marketplace volume

---

## REVENUE STREAM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    REVENUE STACK                             │
├─────────────────────────────────────────────────────────────┤
│  1. AI SUBSCRIPTIONS          → Recurring monthly (highest) │
│  2. PLATFORM FEES (2%)        → Per-transaction (scaling)   │
│  3. FACTORING COMMISSION      → Oliv referral (passive)     │
│  4. ETA PROCESSING            → Per-invoice (compliance)    │
│  5. SUPPLIER LISTINGS         → Premium catalog (optional)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. AI SUBSCRIPTION PRICING

### Cost Analysis (LLM Provider)

| Provider | Use Case | Cost per 1M Tokens | Monthly Cost (500 queries) |
|---|---|---|---|
| **Ollama (local)** | Simple tasks | **$0.00** | **$0.00** |
| **OpenRouter** (Llama 3.3 70B) | Medium tasks | $0.10 input / $0.32 output | ~$0.10 |
| **OpenRouter** (Gemini 2.5 Flash Lite) | Complex tasks | $0.10 input / $0.40 output | ~$0.25 |
| **Groq (free tier)** | Fallback | **$0.00** | **$0.00** |

**Blended Cost per User/Month:** ~$0.15 USD (EGP 7.50) at 500 queries/month

### Subscription Tiers

| Tier | Credits | Price/Month | LLM Cost | **Margin** | Target User |
|---|---|---|---|---|---|
| **FREE** | 50 | EGP 0 | EGP 0 | — | Trial用户 |
| **BASIC** | 500 | EGP 2,500 | EGP 7.50 | **99.7%** | Small hotel/supplier |
| **PRO** | 2,000 | EGP 7,500 | EGP 30 | **99.6%** | Mid-size hotel group |
| **ENTERPRISE** | 10,000 | EGP 25,000 | EGP 150 | **99.4%** | Large chain (Marriott, Hilton) |

### Credit Costs per Query

| Complexity | Credits | LLM Used | Actual Cost |
|---|---|---|---|
| Simple (1 credit) | 1 | Ollama (free) | EGP 0.00 |
| Medium (3 credits) | 3 | Ollama → OpenRouter fallback | EGP 0.50 |
| Complex (5 credits) | 5 | OpenRouter (paid) | EGP 1.25 |

### Key Insight

**AI subscriptions are 99%+ margin.** The LLM cost is negligible because:
- 80% of queries handled by Ollama (FREE, local)
- OpenRouter costs $0.09-0.40 per million tokens (cheaper than SMS)
- Subscription price is based on VALUE delivered, not cost

---

## 2. PLATFORM FEES (Per Transaction)

### Current Structure

| Transaction Type | Fee | Notes |
|---|---|---|
| Standard Order | 2% | No maximum |
| Factoring-Enabled Order | 1.5% | Discount incentivizes factoring |
| Minimum Order | EGP 5,000 | Enforced at checkout |
| Maximum Order | Credit balance limit | Set by funder (Oliv) |

### Fee Incentive for Factoring

```
Standard Order:     2.0% platform fee
Factoring Order:    1.5% platform fee (25% discount)
                    → User saves EGP 500 per EGP 100,000 order
                    → HotelsVendors still earns commission from Oliv
```

**Why this works:**
- Hotels are incentivized to factor (lower fee)
- HotelsVendors earns platform fee + factoring commission
- Oliv gets more business (win-win-win)

---

## 3. FACTORING COMMISSION (From Oliv)

### Revenue Model

| Metric | Value | Notes |
|---|---|---|
| Oliv's Advance Rate | 85% of invoice | Standard |
| Oliv's Factoring Fee | 2.5% of invoice | Oliv's revenue |
| **HotelsVendors Referral Commission** | **0.5% of invoice** | Our cut |
| Minimum Invoice | EGP 5,000 | Enforced |
| Maximum Invoice | Credit limit | Per-supplier |

### Example Revenue

```
Invoice Amount:          EGP 100,000
Oliv Advance (85%):      EGP 85,000
Oliv Fee (2.5%):         EGP 2,500
HotelsVendors Fee (1.5%): EGP 1,500 (platform fee)
HotelsVendors Commission (0.5%): EGP 500 (referral)
─────────────────────────────────────────
Total HotelsVendors Rev:  EGP 2,000 per factored invoice
```

---

## 4. ETA PROCESSING FEES

| Service | Fee | Notes |
|---|---|---|
| Invoice Validation | EGP 25/invoice | ETA UUID check |
| E-Invoice Submission | EGP 50/invoice | Full ETA compliance |
| Batch Processing | EGP 15/invoice | 10+ invoices |
| Failed Submission Retry | EGP 10/retry | Dead letter queue |

---

## 5. SUPPLIER LISTINGS

| Tier | Fee | Features |
|---|---|---|
| **Basic** | Free | Standard listing, 10 products |
| **Premium** | EGP 500/month | Priority search, 100 products, analytics |
| **Enterprise** | EGP 2,000/month | Featured placement, API access, unlimited products |

---

## FINANCIAL PROJECTIONS (MVP Phase — Month 1-6)

### Assumptions

| Metric | Month 1 | Month 3 | Month 6 |
|---|---|---|---|
| Hotels | 10 | 50 | 150 |
| Suppliers | 20 | 100 | 300 |
| Monthly Orders | 50 | 300 | 1,000 |
| Avg Order Value | EGP 25,000 | EGP 30,000 | EGP 35,000 |
| Factoring Rate | 30% | 40% | 50% |
| AI Subscribers (BASIC) | 5 | 25 | 75 |
| AI Subscribers (PRO) | 1 | 5 | 15 |

### Revenue Projections

| Revenue Stream | Month 1 | Month 3 | Month 6 |
|---|---|---|---|
| **AI Subscriptions** | EGP 15,000 | EGP 100,000 | EGP 375,000 |
| **Platform Fees (2%)** | EGP 25,000 | EGP 180,000 | EGP 700,000 |
| **Factoring Commission** | EGP 3,750 | EGP 36,000 | EGP 175,000 |
| **ETA Processing** | EGP 3,750 | EGP 22,500 | EGP 75,000 |
| **Supplier Listings** | EGP 5,000 | EGP 25,000 | EGP 75,000 |
| **Total Revenue** | **EGP 52,500** | **EGP 363,500** | **EGP 1,400,000** |

### Cost Structure

| Cost | Month 1 | Month 3 | Month 6 |
|---|---|---|---|
| **LLM Costs (Ollama + OpenRouter)** | EGP 375 | EGP 1,500 | EGP 3,750 |
| **VPS Hosting** | EGP 1,500 | EGP 1,500 | EGP 3,000 |
| **ETA API Costs** | EGP 500 | EGP 3,000 | EGP 10,000 |
| **Total Costs** | **EGP 2,375** | **EGP 6,000** | **EGP 16,750** |

### Profitability

| Metric | Month 1 | Month 3 | Month 6 |
|---|---|---|---|
| **Gross Margin** | 95.5% | 98.4% | 98.8% |
| **Net Profit** | EGP 50,125 | EGP 357,500 | EGP 1,383,250 |
| **Break-Even** | ✅ Month 1 | — | — |

---

## PRICING PSYCHOLOGY & STRATEGY

### Why EGP 2,500/month for BASIC

1. **Anchor Effect** — EGP 2,500 is < 1% of a typical hotel's monthly procurement spend
2. **Value Multiplier** — AI saves 10+ hours/month → EGP 5,000+ in labor savings
3. **Switching Cost** — Once subscribed, data and workflows lock in
4. **Factoring Incentive** — Subscription fee offset by 0.5% lower platform fee on factored orders

### Factoring Incentive Math

```
Without Factoring:
  Order: EGP 100,000
  Platform Fee (2%): EGP 2,000
  Total Cost: EGP 102,000

With Factoring:
  Order: EGP 100,000
  Platform Fee (1.5%): EGP 1,500
  Factoring Fee (2.5%): EGP 2,500
  Oliv Advance (85%): -EGP 85,000
  Net Cash Out: EGP 19,000 (vs EGP 102,000)
  Savings: EGP 83,000 upfront
```

**Key insight:** Factoring saves the hotel EGP 83,000 in upfront cash. The 0.5% fee reduction makes HotelsVendors the preferred platform.

---

## COMPETITIVE PRICING BENCHMARK

| Platform | Transaction Fee | AI Features | Factoring |
|---|---|---|---|
| **HotelsVendors** | 1.5-2% | ✅ Included in subscription | ✅ Oliv integration |
| MaxAB | 2-3% | ❌ None | ❌ None |
| Amazon Business | 5-15% | ✅ Basic | ❌ None |
| Direct (WhatsApp) | 0% | ❌ None | ❌ None |
| FutureLog | 3-5% | ✅ Limited | ✅ Limited |

**HotelsVendors advantage:** Lowest effective cost when factoring is used.

---

## RECOMMENDED ACTIONS

### Immediate (Month 1)

1. ✅ Launch FREE tier (50 credits) — drives adoption
2. ✅ Launch BASIC tier (EGP 2,500) — primary revenue
3. ✅ Implement 1.5% fee for factoring orders — incentivizes usage
4. ✅ Sign Oliv commission agreement (0.5% referral)

### Month 2-3

5. Launch PRO tier (EGP 7,500) — upsell power users
6. Add supplier premium listings (EGP 500/month)
7. Implement ETA processing fees (EGP 25-50/invoice)

### Month 4-6

8. Launch ENTERPRISE tier (EGP 25,000) — hotel chains
9. Add multi-funder routing (Fawry, Halan) — increase factoring volume
10. Implement loyalty program (credits for early payments)

---

## KEY METRICS TO TRACK

| Metric | Target (Month 6) | Why It Matters |
|---|---|---|
| AI Subscription MRR | EGP 375,000 | Recurring revenue |
| Factoring Conversion Rate | 50% | Revenue multiplier |
| Platform Fee Revenue | EGP 700,000 | Core business |
| LLM Cost Ratio | < 1% | Profitability |
| Customer Acquisition Cost | < EGP 2,500 | Payback in 1 month |
| Net Revenue Retention | > 120% | Expansion revenue |

---

## SUMMARY

| Revenue Stream | Month 6 Projection | Margin |
|---|---|---|
| AI Subscriptions | EGP 375,000 | 99%+ |
| Platform Fees | EGP 700,000 | 95%+ |
| Factoring Commission | EGP 175,000 | 100% (passive) |
| ETA Processing | EGP 75,000 | 80%+ |
| Supplier Listings | EGP 75,000 | 90%+ |
| **Total** | **EGP 1,400,000** | **~97%** |

**The model is profitable from Month 1** because:
- LLM costs are negligible (Ollama = free, OpenRouter = $0.09/M tokens)
- Platform fees scale with GMV (no fixed costs)
- Factoring commission is 100% passive (Oliv does the work)
- Subscription margin is 99%+ (value-based pricing, not cost-based)
