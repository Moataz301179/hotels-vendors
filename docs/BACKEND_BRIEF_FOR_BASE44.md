# Hotels Vendors — Backend Technical Brief for Base44

> **Date:** 2026-05-08  
> **Version:** 3.0  
> **Purpose:** Complete backend architecture snapshot for Base44 to take over development  
> **VPS:** Hostinger Ubuntu 22.04 @ `187.77.181.3`  
> **Live URLs:** https://hotelsvendors.com | https://www.hotelsvendors.com

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        HOSTINGER VPS                             │
│  Ubuntu 22.04 | 4 vCPU | 8GB RAM | Docker Compose                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────────┐   │
│  │  App    │  │OpenClaw │  │ Agent0  │  │ Swarm Workers x2 │   │
│  │ :3000   │  │ :8000   │  │ :9000   │  │ (BullMQ)         │   │
│  │ Next.js │  │ Browser │  │ LLM     │  │ Background Jobs  │   │
│  │ Stand.  │  │ Auto.   │  │ Router  │  │ 41 Agents        │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬─────────┘   │
│       │            │            │                 │             │
│  ┌────┴────────────┴────────────┴─────────────────┘             │
│  │              Docker Network: hv-network                       │
│  └────┬────────────┬───────────────────────────────────────────┘
│       │            │
│  ┌────┴────┐  ┌────┴────┐
│  │ Postgres│  │  Redis  │
│  │ :5432   │  │ :6379   │
│  │ v16     │  │ v7      │
│  └─────────┘  └─────────┘
│
│  ┌─────────┐  ┌─────────┐
│  │  Nginx  │  │ Ollama  │
│  │ :80/443 │  │ :11434  │
│  │ SSL/TLS │  │ LLM CPU │
│  └─────────┘  └─────────┘
│
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16.2.4 |
| Runtime | React | 18.3.1 |
| Language | TypeScript | 5.x (strict: true) |
| Database | PostgreSQL | 16 (Alpine) |
| ORM | Prisma | 6.x |
| Cache/Queue | Redis | 7 (Alpine) + BullMQ |
| Auth | Custom JWT + bcryptjs | — |
| LLM | Ollama (local) + Groq + OpenRouter + Kimi + xAI | — |
| Browser Auto | OpenClaw (Playwright + FastAPI) | 3.0 |
| LLM Router | Agent0 (FastAPI) | — |
| Reverse Proxy | Nginx | — |
| SSL | Let's Encrypt (Certbot) | — |
| Deployment | Docker Compose | — |

---

## 3. Project Structure

```
/var/www/hotelsvendors/
├── app/                          # Next.js App Router (ACTIVE)
│   ├── (marketing)/              # Public pages: /, /about, /hotels, /marketplace
│   ├── (auth)/                   # Login, register, forgot-password
│   ├── (dashboard)/              # Role-based dashboards (hotel, supplier, admin, etc.)
│   │   ├── admin/                # Mission Control, Swarm, OpenClaw, ETA, Settings
│   │   ├── hotel/                # Procurement portal, catalog, orders
│   │   ├── supplier/             # Inventory, orders, analytics
│   │   ├── factoring/            # Credit, liquidity dashboards
│   │   └── shipping/             # Logistics, delivery tracking
│   ├── api/v1/                   # ALL API routes (versioned)
│   │   ├── auth/                 # Login, register, session
│   │   ├── swarm/                # Agent jobs, health, director
│   │   ├── openclaw/             # Browser automation proxy
│   │   ├── eta/                  # Egyptian Tax Authority e-invoicing
│   │   └── ...
│   └── ...
├── components/
│   ├── marketplace/              # Product cards, catalog, search, compare
│   ├── dashboards/               # Role-specific dashboard modules
│   ├── ai-assistant/             # Chatbot widget (Vercel AI SDK)
│   ├── admin/                    # ETA, financial insights, review system
│   └── layout/                   # Marketing nav, dashboard shell, footer
├── lib/
│   ├── marketplace/              # Categories, product-images.ts, real-suppliers.ts
│   ├── swarm/                    # Agent definitions, scheduler, memory, model-router
│   ├── auth/                     # Password, session, RBAC, authority-matrix
│   ├── fintech/                  # Fee calc, credit gate, ledger, risk-engine
│   ├── eta/                      # ETA e-invoicing bridge (NO UI)
│   ├── inventory/                # Inventory sync engine
│   ├── prisma.ts                 # Prisma singleton (tenant-scoped)
│   └── tenant/                   # Tenant isolation, query scoping
├── prisma/
│   ├── schema.prisma             # Full DB schema (multi-tenant)
│   ├── migrations/               # Applied migrations
│   └── seed.ts / seed-extended.ts
├── services/
│   └── openclaw/                 # Python FastAPI browser automation
├── deploy/
│   ├── nginx.conf                # Nginx reverse proxy config
│   ├── hostinger-v2.sh           # Full VPS deployment script
│   └── pm2-config.json           # PM2 config (fallback)
├── docker-compose.swarm.yml      # Docker Compose (all services)
├── Dockerfile                    # Next.js standalone build
└── .env                          # Environment variables
```

---

## 4. Database Schema (Prisma)

**28 tables** in PostgreSQL. Key entities:

| Model | Purpose |
|-------|---------|
| `Tenant` | Multi-tenant isolation root |
| `User` | Authentication + role per tenant |
| `Role` | RBAC roles (tenant-scoped) |
| `Hotel` | 52 real Egyptian hotels |
| `Supplier` | 68+ Egyptian suppliers |
| `Order` | Purchase orders with approval chain |
| `OrderApproval` | Authority Matrix approvals |
| `OrderItem` | Line items |
| `Invoice` | ETA e-invoices |
| `Cart` / `CartItem` | Shopping cart |
| `Product` | Catalog products (124 items) |
| `CreditFacility` | Per-hotel credit terms |
| `FactoringRequest` | Factoring liquidity requests |
| `AgentRun` | Agent execution logs |
| `AuditLog` | Immutable audit trail |
| `Lead` | CRM leads |
| `OutreachLog` | Sales outreach tracking |
| `Competitor` | Competitor price monitoring |
| `MarketInsight` | AI-generated market intel |
| `ModelHealth` | LLM provider health tracking |
| `AuthorityRule` | Authority Matrix rules (DB-driven) |
| `ConsolidatedOrder` | Bulk order consolidation |
| `DeliveryZone` | Logistics zones |
| `LogisticsHub` | Hub management |
| `JournalEntry` | Double-entry ledger |
| `CreditTransaction` | Credit mutations |
| `InventorySnapshot` | Inventory sync cache |
| `Document` | Uploaded documents |
| `FeatureProposal` | Feature requests |

**Critical constraint:** Every query MUST be tenant-scoped via `lib/tenant/scope.ts`. Cross-tenant access is a security incident.

---

## 5. API Structure (v1)

All routes under `app/api/v1/`. Legacy flat routes are deprecated.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/v1/auth/login` | POST | Public | JWT login |
| `/api/v1/auth/register` | POST | Public | User registration |
| `/api/v1/auth/session` | GET | Cookie | Current session |
| `/api/v1/auth/logout` | POST | Cookie | Logout |
| `/api/v1/swarm/health` | GET | Admin | Swarm health dashboard |
| `/api/v1/swarm/agents` | GET | Admin | List all 41 agents |
| `/api/v1/swarm/jobs` | GET | Admin | Job queue status |
| `/api/v1/swarm/director/plan` | POST | Admin | Trigger Director cycle |
| `/api/v1/openclaw/proxy` | POST | Admin | Browser automation proxy |
| `/api/v1/openclaw/health` | GET | Admin | OpenClaw health |
| `/api/v1/eta/submit` | POST | System | Submit invoice to ETA |
| `/api/v1/eta/status/:id` | GET | System | Check ETA status |
| `/api/v1/health` | GET | Public | App health check |

---

## 6. Swarm Agent System (41 Agents)

**4 Squads** with scheduled jobs:

| Squad | Agents | Schedule | Purpose |
|-------|--------|----------|---------|
| **Growth** | LeadScout, ContentStrategist, SEOOptimizer, PartnershipBroker | Every 4h | Lead gen, content, SEO, partnerships |
| **Operations** | HealthMonitor, IncidentResponder, CapacityPlanner, ComplianceAuditor | Every 2h | System health, incidents, capacity |
| **Intelligence** | PriceAnalyst, CompetitorWatcher, MarketResearcher, DemandForecaster | Daily 8AM | Price intel, competitor tracking |
| **Execution** | OrderProcessor, InvoiceValidator, DeliveryCoordinator, PaymentReconciler | On-demand | Order pipeline execution |
| **Director** | StrategicDirector | Daily 6AM | Orchestrates all squads |

**Services:**
- `hv-ollama` (port 11434) — Local LLM, zero API cost
- `hv-openclaw` (port 8000) — Browser automation (Playwright)
- `hv-agent0` (port 9000) — LLM router with circuit breaker
- `hotelsvendors-swarm-worker-{1,2}` — BullMQ job processors

---

## 7. OpenClaw Browser Automation

Python FastAPI service at `services/openclaw/main.py`

**Skills:**
- `navigation` — Visit URLs, wait for elements
- `form_filling` — Fill forms with human-like delays
- `data_extraction` — Extract structured data via selectors
- `deep_scraping` — Multi-page scraping
- `account_creation` — Auto-create accounts
- `workflow_automation` — Multi-step workflows
- `session_persistence` — Save/restore browser sessions
- `human_like_behavior` — Random delays, mouse movements
- `llm_guidance` — LLM-guided navigation
- `export` — CSV/JSON export

**Endpoints:**
- `POST /navigate` — Navigate to URL
- `POST /fill-form` — Fill and submit forms
- `POST /extract` — Extract data
- `POST /deep-scrape` — Multi-page scraping
- `GET /health` — Health check

---

## 8. Environment Variables (`.env`)

```bash
# Database
DATABASE_URL=postgresql://hotels_vendors:YOUR_DB_PASSWORD_HERE@postgres:5432/hotels_vendors

# Redis
REDIS_URL=redis://redis:6379

# Session
SESSION_SECRET=<32-char-random>

# LLM Providers (Ollama is PRIMARY — zero cost)
OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=llama3.2:3b

# Fallbacks (optional)
GROQ_API_KEY=
OPENROUTER_API_KEY=
KIMI_API_KEY=
XAI_API_KEY=

# Internal Services
OPENCLAW_URL=http://openclaw:8000
AGENT0_URL=http://agent0:9000

# Email (SendGrid)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=
EMAIL_FROM=noreply@hotelsvendors.com

# App
APP_URL=https://hotelsvendors.com
```

---

## 9. Deployment Commands

```bash
# SSH to VPS
ssh root@187.77.181.3

# Pull latest code
cd /var/www/hotelsvendors
git pull origin main

# Rebuild app
docker compose -f docker-compose.swarm.yml build --no-cache app
docker compose -f docker-compose.swarm.yml up -d app

# Restart all
docker compose -f docker-compose.swarm.yml restart

# View logs
docker compose -f docker-compose.swarm.yml logs -f app
docker compose -f docker-compose.swarm.yml logs -f swarm-worker

# Database
docker exec -e PGPASSWORD=YOUR_DB_PASSWORD_HERE hv-postgres psql -U hotels_vendors -d hotels_vendors

# Redis
docker exec hv-redis redis-cli
```

---

## 10. Known Issues / Next Steps for Base44

1. **Redis config persistence** — `slave-read-only` needs to be set to `no` permanently in `docker-compose.swarm.yml` (currently set via runtime command)
2. **Prisma migrate** — `prisma.config.ts` expects `DATABASE_URL` env but `docker exec` doesn't always pass it correctly. Fix: add `--env-file .env` to migrate commands
3. **Agent scheduling** — Director cycle runs at 6AM daily. Verify cron expressions in `lib/swarm/scheduler.ts`
4. **OpenClaw browser pool** — Playwright browsers need periodic restart to prevent memory leaks
5. **Ollama model** — Currently running `llama3.2:3b` (CPU-optimized). If GPU added, upgrade to `llama3.1:8b`
6. **SSL renewal** — Certbot auto-renews but verify with `docker logs hv-certbot`
7. **TypeScript strict** — Do NOT disable `strict` mode. Fix errors properly.
8. **NO client-side role state** — Roles/tenants are server-side only. Remove any localStorage-based role switching.

---

## 11. File Map for Base44

| File | Purpose |
|------|---------|
| `app/api/v1/swarm/*` | Agent orchestration APIs |
| `app/api/v1/openclaw/*` | Browser automation proxy |
| `app/api/v1/eta/*` | Egyptian Tax Authority e-invoicing |
| `app/(dashboard)/admin/swarm/page.tsx` | Mission Control dashboard |
| `app/(dashboard)/admin/openclaw/page.tsx` | OpenClaw control panel |
| `lib/swarm/scheduler.ts` | BullMQ job scheduling |
| `lib/swarm/agents/index.ts` | 41 agent definitions |
| `lib/swarm/director.ts` | Strategic Director orchestrator |
| `lib/swarm/model-router.ts` | LLM provider fallback chain |
| `lib/marketplace/product-images.ts` | Product image resolver (real Unsplash) |
| `lib/marketplace/categories.ts` | Product categories |
| `lib/marketplace/real-suppliers.ts` | 68 Egyptian suppliers |
| `lib/auth/authority-matrix.ts` | Order approval engine |
| `lib/eta/*` | ETA e-invoicing bridge (no UI) |
| `lib/fintech/*` | Fee calc, risk engine, ledger |
| `lib/prisma.ts` | Prisma client singleton |
| `lib/tenant/scope.ts` | Tenant query scoping |
| `services/openclaw/main.py` | Browser automation service |
| `docker-compose.swarm.yml` | Full Docker stack |
| `prisma/schema.prisma` | Database schema |

---

## 12. Contacts / Access

| Resource | Value |
|----------|-------|
| VPS IP | `187.77.181.3` |
| SSH User | `root` |
| SSH Key | `kimi_deploy` (in repo `.ssh/`) |
| Domain | `hotelsvendors.com`, `www.hotelsvendors.com` |
| GitHub | `https://github.com/Moataz301179/hotels-vendors` |
| App Dir | `/var/www/hotelsvendors` |
| Postgres | `hotels_vendors:YOUR_DB_PASSWORD_HERE@localhost:5432` |
| Redis | `localhost:6379` |

---

*Document generated for Base44 handoff. Last updated: 2026-05-08*
