# Hotels Vendors — Blueprint Strategy
## The Master Roadmap: From Archive to Pilot Launch
**Date:** 2026-06-02 | **Version:** 1.0 | **Status:** ACTIVE

---

## 1. Strategic Identity (What We Are Building)

**Not a marketplace. Not a SaaS. Not a fintech.**

We are building the **operating system for Egyptian hospitality commerce** — where demand (hotels), supply (suppliers), fulfillment (logistics), and capital (factoring) are connected by AI orchestration, but the true lock-in comes from encoding the governance, relationships, and compliance of the industry into one platform.

**The Four Wheels:**
1. **Hotels (Demand)** — Procurement portal, Authority Matrix, demand forecasting
2. **Suppliers (Supply)** — Curated catalog, ETA compliance, guaranteed payment
3. **Logistics (Fulfillment)** — Shared routes, coastal optimization, delivery tracking
4. **Factoring (Capital)** — Non-recourse financing, pre-approved credit, risk scoring

**The Driver (You):** Sets policy. AI executes. You intervene on exceptions.

---

## 2. The Build Sequence (7 Phases)

### Phase 0: Foundation Cleanup ✅ IN PROGRESS
**Goal:** Remove dead code. Focus the developer. Make the codebase buildable.

| Deliverable | Status | Owner |
|---|---|---|
| Archive swarm agents, OpenClaw, social media | ✅ Complete | Agent Swarm |
| Archive non-critical APIs and dashboards | ✅ Complete | Agent Swarm |
| Extract LLM to `lib/ai/llm.ts` | ✅ Complete | Agent Swarm |
| Fix broken imports | 🔄 Next | Developer |
| Verify `npm run build` passes | 🔄 Next | Developer |

**Exit Criteria:** `npm run build` passes with zero errors. Codebase < 350 files.

---

### Phase 1: Database Lock
**Goal:** PostgreSQL is live. Schema is frozen for 90 days. Seed data is production-quality.

| Deliverable | Effort | Blocker |
|---|---|---|
| PostgreSQL migration (dev + staging) | 3 days | None |
| Simplify schema: single-tenant + org hierarchy | 2 days | PostgreSQL live |
| Seed data: 20 suppliers, 5 hotels, 3 factoring partners | 2 days | Schema locked |
| Database backup + restore pipeline | 1 day | PostgreSQL live |
| Connection pooling (PgBouncer or Prisma Accelerate) | 1 day | PostgreSQL live |

**Exit Criteria:** `prisma migrate deploy` runs cleanly. Seed script populates dev DB in < 30 seconds.

---

### Phase 2: Core Transaction Flow
**Goal:** One hotel can browse catalog, build PO, get approval, generate ETA invoice, and confirm order — end to end, no manual intervention.

| Deliverable | Effort | Dependencies |
|---|---|---|
| Hotel portal: Catalog browse + search | 5 days | Schema locked |
| Hotel portal: PO builder + cart | 5 days | Catalog browse |
| Hotel portal: Order tracking | 3 days | PO builder |
| Supplier portal: Catalog upload (CSV + manual) | 4 days | Schema locked |
| Supplier portal: Order management (accept/reject/ship) | 4 days | Catalog upload |
| Authority Matrix: 1-level approval (GM threshold) | 3 days | Schema locked |
| ETA production pipeline: Submit → UUID → Validate | 5 days | Schema + ETA credentials |
| Admin dashboard: Orders table + status | 3 days | Order tracking |
| Admin dashboard: Suppliers table | 2 days | Supplier portal |
| Admin dashboard: Hotels table | 2 days | Hotel portal |

**Exit Criteria:** Place test order as Hotel A → Supplier B receives → ETA invoice generates → Order shows "CONFIRMED".

---

### Phase 3: Fintech Layer
**Goal:** Suppliers get paid in 48 hours. Hotels pay on their normal cycle. Platform earns factoring referral fee.

| Deliverable | Effort | Dependencies |
|---|---|---|
| Oliv Finance API adapter (real, not mock) | 5 days | Oliv API credentials |
| Risk Engine: Composite scoring (6 dimensions) | 4 days | Order history data |
| Smart Fix: FACTORING_STANDARD auto-execution | 3 days | Risk Engine |
| Payment Guarantee gate enforcement | 2 days | Authority Matrix |
| Hub Revenue Calculator: Fee computation | 2 days | Schema locked |
| Factoring portal: Credit requests + portfolio view | 4 days | Oliv adapter |
| Factoring portal: Funding history + repayments | 3 days | Oliv adapter |

**Exit Criteria:** Order transitions to CONFIRMED → Factoring inquiry auto-sent → Oliv approves → Supplier receives EGP in 48h.

---

### Phase 4: Admin & Mission Control
**Goal:** Operations team sees everything. Build orchestrator tracks progress. No mixing of build and run.

| Deliverable | Effort | Dependencies |
|---|---|---|
| Admin: GMV + transaction volume widgets | 2 days | Orders flowing |
| Admin: Fee revenue tracking | 2 days | Hub Revenue calc |
| Admin: ETA submission health | 2 days | ETA pipeline |
| Admin: Supplier onboarding queue | 2 days | Supplier portal |
| **Build Orchestrator Dashboard** | 4 days | None |
| **Mission Control: Build Progress View** | 3 days | Build orchestrator |
| **Mission Control: API Key Status Board** | 2 days | Skills scan complete |
| **Mission Control: Third-Party Integration Health** | 2 days | API keys acquired |

**Exit Criteria:** One screen shows: build progress %, API key status, integration health, blockers.

---

### Phase 5: UI/UX Unification
**Goal:** Every page looks like it was designed by the same team. No more "front page vs. everything else" mess.

| Deliverable | Effort | Dependencies |
|---|---|---|
| Audit all existing pages for design inconsistencies | 2 days | Cleanup complete |
| Apply design system v2 to auth pages (login, register) | 3 days | Audit complete |
| Apply design system v2 to hotel dashboard | 4 days | Auth pages done |
| Apply design system v2 to supplier dashboard | 4 days | Hotel dashboard done |
| Apply design system v2 to factoring portal | 3 days | Supplier dashboard done |
| Apply design system v2 to admin dashboard | 3 days | Factoring portal done |
| Mobile-responsive pass (all dashboards) | 3 days | All dashboards styled |
| Remove unused components + dead CSS | 2 days | Styling complete |

**Exit Criteria:** Screenshot any 3 pages side by side — they look like one product.

---

### Phase 6: Integration & Testing
**Goal:** 5 pilot hotels place real orders. 20 suppliers fulfill them. Nothing breaks.

| Deliverable | Effort | Dependencies |
|---|---|---|
| End-to-end test: Hotel → Supplier → ETA → Factoring → Delivery | 3 days | Phase 3 complete |
| Load test: 100 concurrent orders | 2 days | E2E passing |
| Security audit: RBAC enforcement on all API routes | 3 days | Load test passing |
| ETA compliance audit: 100% submission success rate | 2 days | Security audit |
| Pilot hotel onboarding: 5 properties | 5 days | All tests passing |
| Pilot supplier onboarding: 20 suppliers | 5 days | Hotels onboarded |
| Training sessions: Hotel GMs + Supplier owners | 3 days | Onboarding complete |

**Exit Criteria:** 5 hotels place 50+ real orders. 0 stockouts. 0 ETA rejections. Suppliers paid on time.

---

### Phase 7: Pilot Launch
**Goal:** Public announcement. First revenue. Real feedback loop.

| Deliverable | Effort | Dependencies |
|---|---|---|
| Landing page update: Pilot results + testimonials | 2 days | Pilot data |
| PR: "First hospitality procurement platform with ETA + factoring" | 2 days | Landing updated |
| Hotel acquisition campaign: Founding Partner program | 3 days | PR published |
| Supplier acquisition: Roadshow 6th of October City | 5 days | 5 pilot hotels secured |
| Monthly review: Metrics, feedback, iteration plan | 1 day | Ongoing |

**Exit Criteria:** EGP 1M+ monthly GMV. 10+ active hotels. 50+ active suppliers. First factoring referral revenue.

---

## 3. Team Structure

| Role | Responsibility | Phase |
|---|---|---|
| **You (Founder/Driver)** | Strategy, hotel relationships, investor conversations, final decisions | All |
| **Developer 1 (Platform Engineer)** | Next.js, Prisma, PostgreSQL, APIs, RBAC, ETA | 0–5 |
| **Developer 2 (Fintech Engineer)** | Factoring bridge, Risk Engine, Smart Fixes, payment flows | 3–6 |
| **UI/UX Designer (Part-time)** | Design system v2, component library, responsive pass | 5 |
| **Build Orchestrator Agent** | Task assignment, progress tracking, blocker escalation, documentation | 0–7 |
| **API Key Acquisition Agent** | Gather credentials, third-party correspondence, sandbox access | 0–2 |
| **QA / Testing Agent** | E2E tests, load tests, security checks, compliance validation | 6 |

---

## 4. Revenue Timeline

| Phase | Timeline | Revenue Stream | Target |
|---|---|---|---|
| 0–2 | Months 1–2 | $0 | Build |
| 3 | Month 3 | $0 | Fintech integration |
| 4–5 | Months 4–5 | $0 | UI + testing |
| 6 | Month 6 | Transaction fees (2.5%) | EGP 125K/month |
| 7 | Months 7–9 | Transaction fees + subscriptions | EGP 500K/month |
| Scale | Months 10–12 | Multi-stream | EGP 2.5M/month |

---

## 5. Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Developer overwhelmed | High | Critical | Phase-gated. No new features until current phase exits. |
| Oliv Finance API delays | Medium | Critical | Maintain mock adapter as fallback. Parallel contact with EFG Hermes. |
| ETA sandbox → production gap | Medium | High | Start production integration in Week 1, not Week 10. |
| Pilot hotels refuse to join | Medium | High | 0% fees for 6 months. Dedicated onboarding team. |
| UI unification takes longer than planned | Medium | Medium | Designer starts in Phase 4 (parallel), not Phase 5. |
| PostgreSQL migration breaks existing data | Low | Critical | Full backup before migration. Rollback plan tested. |

---

## 6. Decision Log

| Date | Decision | Impact |
|---|---|---|
| 2026-06-02 | Archive swarm, OpenClaw, non-critical APIs/dashboards | Reduced codebase 25%. Focused developer on core flow. |
| 2026-06-02 | Extract LLM to `lib/ai/llm.ts` | Removed swarm dependency from factoring critical path. |
| 2026-06-02 | Build orchestrator ≠ Run orchestrator | Separated development management from operations management. |
| 2026-06-02 | Single-tenant PostgreSQL first, multi-tenant later | Accelerates time to market. Multi-tenancy at 10+ hotel groups. |
| TBD | Oliv Finance vs. EFG Hermes factoring partner | Pending API credential acquisition. |
| TBD | Design system v2 application priority | Auth → Hotel → Supplier → Factoring → Admin. |

---

*This blueprint is the single source of truth. All agent tasks, build decisions, and resource allocations trace back to this document.*
