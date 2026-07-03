# Skills Scan & Agent Task Assignment
## Who Does What: API Keys, Correspondence, Database, Build
**Date:** 2026-06-02 | **Version:** 1.0

---

## Philosophy

**Humans build. Agents acquire.**

The developer writes code. You make decisions. Agents do everything else:
- Acquire API keys
- Send follow-up emails
- Fill out sandbox registration forms
- Scan documentation
- Verify credentials
- Update status boards

**Agents are procurement specialists for the build process.**

---

## Agent Registry

### Agent 1: API Key Acquisition Agent
**Codename:** Keymaster  
**Squad:** Growth  
**Avatar:** 🔑

**Purpose:** Acquire, verify, and maintain all third-party API credentials. No coding. Pure correspondence and form-filling.

**Skills:**
| Skill | Description | Tool |
|---|---|---|
| `form_completion` | Fill out online registration forms for sandbox access | Web browsing |
| `email_drafting` | Draft professional follow-up emails to partnership teams | Email templates |
| `credential_scanning` | Scan received emails for API keys, credentials, documentation links | Email + OCR |
| `sandbox_verification` | Test acquired credentials with basic API calls | cURL / fetch |
| `status_updating` | Update `api_keys.json` and Mission Control board | File write |
| `escalation_detection` | Detect when a credential request is stalled > 48h | Timer + alert |

**Task Queue:**

| # | Task | Target | Status | Due |
|---|---|---|---|---|
| 1 | Register for Oliv Finance developer sandbox | Oliv Finance | ⏳ Not started | Jun 3 |
| 2 | Follow up on Oliv Finance partnership email | Oliv Finance | ⏳ Not started | Jun 5 |
| 3 | Acquire ETA production API credentials | Egyptian Tax Authority | ⏳ Not started | Jun 4 |
| 4 | Verify Paymob production API keys | Paymob | ⏳ Not started | Jun 3 |
| 5 | Register for Google Maps Platform API | Google Cloud | ⏳ Not started | Jun 6 |
| 6 | Acquire FawryPay merchant account credentials | FawryPay | ⏳ Not started | Jun 7 |
| 7 | Verify Groq API key rate limits | Groq | ✅ Complete | Jun 2 |
| 8 | Verify xAI API key balance | xAI | ✅ Complete | Jun 2 |
| 9 | Acquire EFG Hermes Factoring API docs | EFG Hermes | ⏳ Not started | Jun 5 |
| 10 | Register for AWS SES (email delivery) | AWS | ⏳ Not started | Jun 6 |

**Email Templates:**
```
Subject: Partnership Inquiry — Hotels Vendors Procurement Platform

Dear [Partner] Partnership Team,

Hotels Vendors is a digital procurement platform for the Egyptian hospitality 
sector. We are integrating [service] into our payment/compliance/logistics 
workflow and would like to request:

1. Developer sandbox access
2. API documentation
3. Integration support contact

Our platform currently serves [X] hotel properties and [Y] suppliers with 
[Z] monthly transaction volume.

Please let us know the next steps for partnership approval.

Best regards,
[Name]
Hotels Vendors
[Email] | [Phone]
```

---

### Agent 2: Database Collection Agent
**Codename:** Archivist  
**Squad:** Platform  
**Avatar:** 🗄️

**Purpose:** Gather, clean, and seed all reference data needed for the platform to function. Supplier contacts, hotel directories, industrial zone mappings, commodity prices.

**Skills:**
| Skill | Description | Tool |
|---|---|---|
| `web_scraping` | Extract supplier data from GAFI, industrial zone directories | Puppeteer / cheerio |
| `data_cleaning` | Normalize names, addresses, phone numbers, tax IDs | Python / OpenRefine |
| `csv_generation` | Generate seed files for Prisma import | Node.js scripts |
| `validation` | Verify tax IDs against ETA registry, phone numbers via SMS | API calls |
| `categorization` | Map suppliers to hospitality categories (F&B, linens, chemicals) | AI classification |
| `geo_tagging` | Assign lat/lng to suppliers for logistics optimization | Google Maps Geocoding |

**Data Targets:**

| Dataset | Source | Records | Status |
|---|---|---|---|
| 6th of October suppliers | GAFI directory + manual research | 200 | ⏳ Not started |
| 10th of Ramadan suppliers | GAFI directory + manual research | 200 | ⏳ Not started |
| Cairo chain hotels | HACE membership + LinkedIn | 50 | ⏳ Not started |
| Red Sea resort hotels | Egyptian Tourism Authority | 30 | ⏳ Not started |
| North Coast hotels | Summer resort directories | 25 | ⏳ Not started |
| Commodity price benchmarks | Local market prices (poultry, rice, fuel) | Daily feed | ⏳ Not started |
| SKU taxonomy master list | Hospitality procurement standards | 500 SKUs | ⏳ Not started |

**Seed File Format:**
```csv
name,cr_number,tax_id,phone,email,category,zone,lat,lng,contact_name
Nile Fresh Co.,12345,9876543210,01001234567,info@nilefresh.com,F&B,6th_October,29.970,30.950,Ahmed Hassan
```

---

### Agent 3: Third-Party Correspondence Agent
**Codename:** Diplomat  
**Squad:** Growth  
**Avatar:** 📬

**Purpose:** Handle all external communication that isn't API-key-related. Partnership inquiries, legal questions, regulatory clarifications, event invitations.

**Skills:**
| Skill | Description | Tool |
|---|---|---|
| `partnership_outreach` | Send templated partnership emails to logistics, fintech, ERP companies | Email + CRM |
| `regulatory_inquiry` | Submit questions to ETA, FRA, CBE | Government portals |
| `event_coordination` | Register for HACE Hotel Expo, Food Africa, industry roadshows | Event websites |
| `press_release` | Draft and distribute launch announcements | Email + LinkedIn |
| `supplier_roadshow` | Coordinate "Supplier Onboarding Roadshows" in industrial zones | Calendar + email |

**Active Conversations:**

| Party | Topic | Status | Next Action | Due |
|---|---|---|---|---|
| Oliv Finance | Factoring partnership term sheet | ⏳ Awaiting response | Follow-up email | Jun 5 |
| EFG Hermes | Backup factoring partnership | ⏳ Not started | Intro email | Jun 6 |
| TruKKer | Logistics partnership LOI | ⏳ Not started | Intro email | Jun 8 |
| MEDLOG | Coastal dry port access | ⏳ Not started | Research contact | Jun 10 |
| GAFI | Supplier directory access | ⏳ Not started | Formal request | Jun 7 |
| HACE Hotel Expo | Sponsorship + booth | ⏳ Not started | Inquiry email | Jun 10 |
| Opera PMS | Integration partnership | ⏳ Not started | Developer portal registration | Jun 12 |

---

### Agent 4: UI/UX Audit Agent
**Codename:** Stylist  
**Squad:** Platform  
**Avatar:** 🎨

**Purpose:** Audit every page for design consistency. Flag inconsistencies. Generate fix tickets. Do NOT write CSS — flag problems for the developer/designer.

**Skills:**
| Skill | Description | Tool |
|---|---|---|
| `screenshot_comparison` | Capture screenshots of all pages, compare against design system v2 | Puppeteer |
| `inconsistency_detection` | Identify color mismatches, font variations, spacing issues, broken layouts | Image diff |
| `component_inventory` | Map all UI components to design system primitives | Code analysis |
| `accessibility_scan` | Check contrast ratios, keyboard nav, ARIA labels | Lighthouse |
| `mobile_responsive_check` | Test all dashboards at 320px, 768px, 1440px | Browser devtools |
| `ticket_generation` | Create structured fix tickets with before/after screenshots | Markdown |

**Audit Checklist:**

| Page | Front Page Match? | Mobile OK? | Accessibility OK? | Ticket |
|---|---|---|---|---|
| `/login` | ❌ No | ⚠️ Partial | ❌ No contrast | UI-001 |
| `/register` | ❌ No | ⚠️ Partial | ❌ No contrast | UI-002 |
| `/dashboard/hotel` | ❌ No | ❌ No | ⚠️ Partial | UI-003 |
| `/dashboard/supplier` | ❌ No | ❌ No | ⚠️ Partial | UI-004 |
| `/dashboard/admin` | ❌ No | ❌ No | ❌ No | UI-005 |
| `/dashboard/factoring` | ❌ No | ❌ No | ❌ No | UI-006 |
| `/about` | ❌ No | ✅ Yes | ✅ Yes | UI-007 |
| `/pricing` | ❌ No | ✅ Yes | ✅ Yes | UI-008 |
| `/solutions` | ❌ No | ✅ Yes | ✅ Yes | UI-009 |

**Note:** Marketing pages (`/`, `/about`, `/pricing`, `/solutions`) were updated. All other pages lag behind.

---

### Agent 5: Documentation Agent
**Codename:** Scribe  
**Squad:** Intelligence  
**Avatar:** 📚

**Purpose:** Keep all docs in sync with code. API docs, setup guides, integration specs. If code changes, docs update automatically.

**Skills:**
| Skill | Description | Tool |
|---|---|---|
| `api_doc_generation` | Generate OpenAPI specs from Zod schemas + route handlers | Code analysis |
| `changelog_tracking` | Maintain `CHANGELOG.md` from commit messages | Git hooks |
| `setup_guide_maintenance` | Update developer onboarding docs when dependencies change | File diff |
| `env_variable_tracking` | Keep `.env.example` in sync with actual env usage | Code grep |
| `architecture_diagram` | Auto-generate C4 diagrams from directory structure | PlantUML |

---

### Agent 6: Testing Agent
**Codename:** Inspector  
**Squad:** Intelligence  
**Avatar:** 🧪

**Purpose:** Write and run tests. Not manual QA — automated test generation and execution.

**Skills:**
| Skill | Description | Tool |
|---|---|---|
| `unit_test_generation` | Generate Jest/Vitest tests from TypeScript functions | AI + AST |
| `e2e_test_generation` | Generate Playwright tests from user flows | Playwright codegen |
| `api_test_generation` | Generate API contract tests from Zod schemas | Zod → test |
| `coverage_reporting` | Track coverage per module, flag regressions | Istanbul / V8 |
| `security_scan` | Run static analysis for secrets, SQL injection, XSS | Semgrep / trivy |
| `load_test` | Simulate 100 concurrent orders | k6 / Artillery |

**Test Targets:**

| Module | Unit Tests | E2E Tests | API Tests | Coverage Target |
|---|---|---|---|---|
| `lib/auth/authority-matrix.ts` | 10 | 3 | 5 | 80% |
| `lib/eta/validator.ts` | 15 | 2 | 8 | 90% |
| `lib/fintech/risk-engine.ts` | 20 | 2 | 5 | 85% |
| `lib/fintech/smart-fix-executor.ts` | 10 | 3 | 5 | 80% |
| `app/api/v1/orders/*` | 0 | 5 | 10 | 70% |
| `app/api/v1/eta/*` | 0 | 3 | 8 | 80% |
| `app/api/v1/factoring/*` | 0 | 3 | 5 | 75% |

---

## Human Roles vs. Agent Roles

| Task | Human | Agent | Notes |
|---|---|---|---|
| Write code | ✅ Developer | ❌ | Agents don't code. They acquire, audit, correspond. |
| Make architectural decisions | ✅ Founder | ❌ | Agents recommend. Humans decide. |
| Debug complex bugs | ✅ Developer | ❌ | Agents can flag, not fix. |
| Acquire API keys | ❌ | ✅ Keymaster | Pure correspondence. |
| Send follow-up emails | ❌ | ✅ Diplomat | Templates + tracking. |
| Collect supplier data | ❌ | ✅ Archivist | Scraping + cleaning. |
| Audit UI consistency | ❌ | ✅ Stylist | Screenshots + flagging. |
| Write tests | ⚠️ Developer | ✅ Inspector | Agents generate, humans review. |
| Update documentation | ⚠️ Developer | ✅ Scribe | Agents maintain, humans approve. |
| Run load tests | ❌ | ✅ Inspector | Automated. |
| Security scans | ❌ | ✅ Inspector | Automated. |

---

## Agent Orchestration

**Build Orchestrator Agent** assigns tasks to these skill agents.

```
Build Orchestrator
    ├── API Key Acquisition Agent (Keymaster)
    │       ├── Acquires Oliv credentials
    │       ├── Verifies ETA production access
    │       └── Updates Mission Control API board
    ├── Database Collection Agent (Archivist)
    │       ├── Scrapes GAFI supplier directory
    │       ├── Seeds Prisma database
    │       └── Generates CSV imports
    ├── Third-Party Correspondence Agent (Diplomat)
    │       ├── Sends partnership emails
    │       ├── Registers for events
    │       └── Tracks response status
    ├── UI/UX Audit Agent (Stylist)
    │       ├── Screenshots all pages
    │       ├── Generates inconsistency tickets
    │       └── Tracks design system adoption
    ├── Documentation Agent (Scribe)
    │       ├── Generates API docs
    │       ├── Maintains CHANGELOG
    │       └── Updates env examples
    └── Testing Agent (Inspector)
            ├── Generates unit tests
            ├── Runs E2E suites
            ├── Reports coverage
            └── Flags security issues
```

---

## Success Metrics (Per Agent)

| Agent | KPI | Target |
|---|---|---|
| Keymaster | API keys acquired on time | 90% of keys acquired before phase dependency |
| Archivist | Seed data accuracy | 95% of supplier records valid (phone, email, tax ID) |
| Diplomat | Partnership response rate | 30% of outreach emails receive response within 7 days |
| Stylist | UI inconsistency tickets closed | 100% of P0/P1 tickets resolved before Phase 5 exit |
| Scribe | Doc freshness | 100% of API docs match current code within 24h of change |
| Inspector | Test coverage | 60% by Phase 5, 80% by Phase 6 |

---

*Agents are not replacements for developers. They are force multipliers for everything that isn't code.*
