# Carbon Footprint Measurement — HotelsVendors Platform

**Document ID:** ESG-CF-001  
**Version:** 1.0  
**Date:** 2026-05-14  
**Owner:** Integration Lead + Business Strategist  

---

## 1. Infrastructure Components & Estimated Emissions

### 1.1 Hosting Stack

| Component | Provider | Host | Est. Annual kWh | Est. kgCO2e/yr | Notes |
|---|---|---|---|---|---|
| **Vercel (Frontend)** | Vercel | Google Cloud (US/EU) | ~200 | ~0 (carbon-neutral) | Vercel runs on Google Cloud, carbon-neutral since 2007 |
| **Hostinger VPS (Backend)** | Hostinger | EU/NL datacenter | ~1,500 | ~600-750 | Shared Intel Xeon; no published renewable energy mix |
| **PostgreSQL (Docker)** | Self-hosted on VPS | EU/NL | ~200 | ~80-100 | Runs on existing VPS hardware |
| **Redis (Docker)** | Self-hosted on VPS | EU/NL | ~50 | ~20-25 | In-memory, low CPU |
| **Ollama LLM (llama3.2:3b)** | Self-hosted on VPS | EU/NL | ~500-800 | ~200-320 | CPU inference; ~5-10s per call; varies with query volume |
| **Resend (Email)** | Resend | US cloud | ~50 | ~20 | Transactional email only |
| **Total** | | | **~2,500-2,800** | **~920-1,215** | Pre-scale estimates |

### 1.2 Key Assumptions

- EU average grid emission factor: 0.23-0.30 kgCO2/kWh (2026 estimate)
- VPS utilization: ~60% average (scale-up path)
- Ollama inference: ~0.5-1 kWh/hour of active use at 3B parameter scale
- Vercel: zero direct emissions (carbon-neutral hosting)

### 1.3 Scale Projections

| Scenario | Hotels | Suppliers | Monthly Orders | Est. Annual kWh | Est. kgCO2e/yr |
|---|---|---|---|---|---|
| **Pilot** | 20 | 50 | 500 | 3,000 | ~1,100-1,500 |
| **Growth** | 80 | 300 | 3,000 | 5,500 | ~2,000-2,750 |
| **Scale** | 150 | 1,000 | 10,000 | 9,000 | ~3,300-4,500 |
| **Full** | 300+ | 2,000+ | 30,000+ | 15,000+ | ~5,500-7,500 |

---

## 2. Per-Delivery Emissions Estimation

### 2.1 Methodology

Each delivery's estimated CO2 is calculated as:

```
CO2 (kg) = distance_km × vehicle_factor × weight_factor
```

Where:
- `distance_km`: Origin-to-destination distance (detected via `lib/logistics/load-pooler.ts`)
- `vehicle_factor`: kgCO2/km by vehicle type (truck: 0.9, van: 0.5, motorcycle: 0.15)
- `weight_factor`: Multiplier for load weight (0.5-1.5x based on tonnage)

### 2.2 Shared-Route Impact

Without shared routes (individual delivery):
- Avg. 45 km delivery distance × 0.9 kgCO2/km = **40.5 kgCO2 per delivery**

With shared routes (load pooling):
- Avg. 12 km per stop (shared last-mile) × 0.9 kgCO2/km × 4 deliveries = **43.2 kgCO2 for 4 deliveries**
- Per-delivery: **10.8 kgCO2** (73% reduction)

### 2.3 Target KPIs

| Metric | Pilot | Growth | Scale |
|---|---|---|---|
| Deliveries consolidated/month | 200 | 2,000 | 10,000 |
| CO2 saved vs. individual (kg/mo) | 6,000 | 60,000 | 300,000 |
| CO2 saved vs. individual (tons/yr) | 72 | 720 | 3,600 |

---

## 3. LLM Inference Emissions

### 3.1 Ollama (Primary — llama3.2:3b)

| Metric | Value |
|---|---|
| Model size | 3B parameters |
| Inference method | CPU (Intel Xeon) |
| Avg. time per call | 5-10 seconds |
| Est. power per call | ~0.005-0.01 kWh |
| Calls per day (pilot) | ~100 |
| Calls per day (scale) | ~2,000 |
| Est. annual kWh (pilot) | ~200-365 |
| Est. annual kWh (scale) | ~4,000-7,300 |

### 3.2 Groq Fallback (Free Tier)

- Cloud-hosted, Groq claims 85%+ renewable energy sourcing
- Est. marginal emissions per call: ~0.0001-0.0003 kgCO2
- Only invoked during Ollama downtime

### 3.3 OpenRouter / Kimi / xAI (Paid Fallbacks)

- Cloud providers with varying sustainability commitments
- Only invoked when primary + secondary providers are unavailable
- Estimated <1% of total inference volume

---

## 4. Measurement Framework

### 4.1 Implementation Plan

| Phase | Timeline | Action |
|---|---|---|
| **Phase 1: Baseline** | Q3 2026 | Manual estimation using the methodology above; publish baseline report |
| **Phase 2: Automated Tracking** | Q4 2026 | Add CO2 estimation to `lib/logistics/load-pooler.ts` for per-delivery tracking |
| **Phase 3: Dashboard** | Q1 2027 | Add "Environmental Impact" widget to Admin Dashboard showing: deliveries consolidated, CO2 saved, paper reduced |
| **Phase 4: Verified Reporting** | Q2 2027 | Publish first verified Sustainability Report with third-party audit |

### 4.2 Data Collection Points

| Data Point | Source | Frequency |
|---|---|---|
| VPS energy consumption | Hostinger monitoring panel | Monthly |
| Ollama inference count | Application logs | Daily |
| Delivery distances | `load-pooler.ts` zone detection | Per delivery |
| Orders processed | Prisma database queries | Daily |
| LLM fallback invocations | `lib/swarm/model-router.ts` | Daily |

### 4.3 Reporting Format

```json
{
  "period": "2026-Q3",
  "infrastructure": {
    "vps_kwh": 375,
    "vercel_kwh": 50,
    "total_kwh": 425,
    "total_kgco2e": 165
  },
  "logistics": {
    "deliveries_total": 500,
    "deliveries_consolidated": 200,
    "co2_saved_kg": 6000
  },
  "platform_benefits": {
    "paper_sheets_eliminated": 250000,
    "storage_freed_sqft": 43200
  }
}
```

---

## 5. Reduction Roadmap

| Action | Timeline | Est. CO2 Reduction |
|---|---|---|
| Migrate VPS to Hetzner (renewable energy) | Q2 2027 | -300 to -400 kgCO2/yr |
| Optimize Ollama model (distill to 1.5B) | Q3 2027 | -100 to -200 kgCO2/yr |
| Enable response compression (Brotli/gzip) | Q3 2026 | -50 to -100 kgCO2/yr |
| Bundle splitting / dynamic imports | Q3 2026 | -30 to -60 kgCO2/yr |
| VPS auto-scaling (power down idle) | Q1 2027 | -150 to -200 kgCO2/yr |

---

*This document establishes the measurement framework. Actual measurements begin in Q3 2026 upon pilot deployment.*
