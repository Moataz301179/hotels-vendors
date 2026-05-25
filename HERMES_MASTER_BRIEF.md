# HOTELS VENDORS — MASTER BRIEF v3
## Updated: 2026-05-25 | Classification: INTERNAL — MOZI EYES ONLY

---

## 1. AGENT ROLE SEPARATION (NON-NEGOTIABLE)

### Kimi (CLI Agent)
- **Role**: DevOps Executor
- **Workspace**: `/var/www/hotelsvendors-v2/.workspace/kimi`
- **Capabilities**: Direct root SSH, Docker, PM2, Redis, PostgreSQL, file deployment
- **Scope**: Build, deploy, execute, restart services, run tests
- **DO NOT**: Write architecture docs, design systems, or business logic specs
- **DO NOT**: Touch files in Hermes workspace
- **Reports to**: Mission Control Dashboard (auto-sync every 30s)

### Alisa / Hermes (CTO Agent)
- **Role**: Architect & Planner
- **Workspace**: `/opt/data/workspace-hermes`
- **Capabilities**: Code generation, architecture design, documentation, planning
- **Scope**: Write specs, generate code packages, design schemas, create mockups
- **DO NOT**: Execute builds, restart services, or deploy directly
- **DO NOT**: Touch files in Kimi workspace
- **Reports to**: Mission Control Dashboard (POST sync every 30s)

### ZERO FILE OVERRIDE RULE
- Kimi writes to: `/var/www/hotelsvendors-v2/`, `/docker/`, `/etc/systemd/system/`
- Hermes writes to: `/opt/data/workspace-hermes/`, then notifies Kimi to deploy
- If both agents need the same file: Hermes generates → Kimi reviews → Kimi deploys
- ANY conflict = stop and escalate to Mozi

---

## 2. THEME COLOR PALETTE (ABSOLUTELY UNTOUCHABLE)

The current website theme is LOCKED. No agent may modify these colors under any circumstance.

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#050508` | Page backgrounds |
| `--bg-card` | `#0a0a12` | Card/component backgrounds |
| `--accent-primary` | `#7c3aed` | Primary buttons, links, highlights |
| `--accent-hover` | `#8b5cf6` | Hover states |
| `--accent-light` | `#a78bfa` | Labels, tags, secondary accents |
| `--text-primary` | `white` | Headings, primary text |
| `--text-muted` | `white/30` | Body text, descriptions |
| `--text-faint` | `white/20` | Captions, metadata |
| `--text-ghost` | `white/15` | Disabled, placeholders |
| `--border-subtle` | `border-white/[0.04]` | Card borders |
| `--border-hover` | `border-[#7c3aed]/20` | Hover borders |
| `--success` | `#34d399` | ETA compliance, success states |
| `--info` | `#60a5fa` | Finance, info states |
| `--warning` | `#fbbf24` | Network, warnings |

**OLD WRONG VALUES (NEVER USE):** #0B0F1A, #E8ECF3, #3B82F6 — these were from an earlier draft and are NOT the current theme.

**VIOLATION = IMMEDIATE HALT. No exceptions.**

---

## 3. MISSION CONTROL DASHBOARD

**URL**: `http://187.77.181.3:3000/mission-control`

### Real-time Monitoring
- Kimi auto-reports: PM2 processes, BullMQ queues, build status, agent tasks
- Hermes auto-reports: Container status, active subagents, current task, completion %
- Refresh interval: 5 seconds
- Both workspaces shown side-by-side on same screen

### Sync Endpoints
- `GET /api/mission-control/status` — Read combined status
- `POST /api/mission-control/sync` — Write agent status (body: `{workspace, agents, containerStatus}`)

### Agent Status Schema
```json
{
  "name": "agent-name",
  "status": "running|idle|error|completed",
  "task": "What this agent is currently doing",
  "lastUpdate": "ISO timestamp",
  "workspace": "kimi|hermes"
}
```

---

## 4. SWARM AGENT STATUS PIPELINE

Every subagent spawned by either Kimi or Hermes MUST report progress through the pipeline:

1. **Task Identified** → Report to parent agent
2. **Agent Assigned** → Report to Mission Control
3. **In Progress** → Update every 30s with `% complete` and `ETA`
4. **Blocked** → Report blocker immediately, escalate if >5min
5. **Completed** → Report result, mark agent as `completed`
6. **Review** → Parent agent validates output before marking done

### Subagent Reporting Format
```json
{
  "parentAgent": "kimi|hermes",
  "subagentName": "string",
  "phase": "identified|assigned|in-progress|blocked|completed|review",
  "progressPercent": 0-100,
  "currentTask": "string",
  "blocker": "string|null",
  "deliverable": "string|null",
  "timestamp": "ISO"
}
```

---

## 5. EXECUTION PHASES

### PHASE 1 — PROJECT ESSENTIALS (Hermes leads, Kimi deploys)
Create `/opt/data/workspace-hermes/project-essentials/` with these 10 documents:

1. **market-intelligence-report.md**
   - Egyptian hospitality sector: $6.1B market, 1,000+ target hotels (3-5 star)
   - 95% still use manual procurement
   - Oliv partnership = game changer (reversed factoring)
   - Real data from CAPMAS, Ministry of Tourism

2. **target-audience-analysis.md**
   - 3 hotel segments, 3 personas (Ahmed Procurement Director, Sara GM, Hassan Owner)
   - 7 pain points mapped
   - Market entry strategy by segment

3. **swot-analysis.md**
   - 6 strengths, 6 weaknesses, 6 opportunities, 6 threats
   - Strategic action matrix (SO/WO/ST/WT)

4. **legal-compliance-assessment.md**
   - ETA e-invoicing requirements
   - FRA registration for digital factoring
   - PCI DSS compliance
   - Budget: $37K for compliance

5. **feasibility-study.md**
   - Score: 7.8/10 — HIGHLY FEASIBLE
   - Break-even: Month 10-14
   - Year 3 revenue: $10M-$20M
   - ROI: 300%+

6. **marketing-plan.md**
   - 4-phase strategy: Stealth → Pilot → Growth → Scale
   - Budget: $50K Year 1
   - Channel strategy: LinkedIn, Google Ads, hospitality events
   - Content calendar and sales strategy

7. **project-guide.md**
   - Architecture diagram
   - Development workflow
   - Deployment procedures
   - Monitoring & troubleshooting

8. **environment-template.md**
   - All credentials, APIs, services config
   - Database, Redis, AI models
   - Oliv, payment gateways, ETA APIs

9. **mission-control-dashboard.md**
   - Real-time project status
   - Agent assignments & progress
   - Sprint tracking
   - Key metrics & alerts

10. **README.md** — Master index with quick commands

Hermes writes to `/opt/data/workspace-hermes/project-essentials/`
Kimi copies to `/var/www/hotelsvendors-v2/project-essentials/` after Mozi approval

### PHASE 2 — 5 PORTALS (Parallel tracks)
| Portal | Users | Key Features | Lead Agent |
|--------|-------|-------------|------------|
| Hotel | Procurement Directors | RFQ, catalog, cost analytics, Oliv financing | Kimi |
| Supplier | Vendors | Catalog mgmt, quotes, ETA invoicing | Kimi |
| Shipping | Freight forwarders | Tracking, customs, ETA integration | Kimi |
| Financing | Oliv, Banks, NBFIs | Credit scoring, factoring, risk assessment | Kimi |
| Admin | Platform managers | User mgmt, compliance, swarm control | Kimi |
| **Specs** | — | — | Hermes |

### PHASE 3 — OLIV INTEGRATION (PRIORITY SPRINT)
1. Research Oliv API — sandbox access, documentation
2. Reversed Factoring Flow:
   Hotel initiates → Oliv scores → Supplier paid immediately → Hotel pays at maturity (30/60/90 days)
3. API Endpoints needed:
   - POST /api/v1/factoring/apply
   - GET /api/v1/factoring/status
   - POST /api/v1/factoring/oliv/webhook
4. Draft partnership email → WAIT FOR MOZI APPROVAL before sending
5. Pitch: First-mover hospitality, 1,000+ hotels, ETA compliance

### PHASE 4 — AI SWARM ENHANCEMENTS
1. Add Groq API as fast fallback (free tier: 20 req/min)
2. Agent registry per portal
3. Memory system with embeddings (nomic-embed-text)
4. Learning loop for cost reduction analytics
5. SSE notifications for real-time updates

### PHASE 5 — UI/UX (KEEP CURRENT THEME)
- Background: #050508 (dark)
- Text: white
- Accent: #7c3aed (purple)
- Cards: #0a0a12 with border-white/[0.04]
- RTL Arabic support
- WCAG 2.2 AA

Preview 3 design concepts per portal → WAIT FOR MOZI APPROVAL → then code.

### PHASE 6 — SIMULATION
- Sim 1 (Pre-Production): Full user journey, 100 concurrent users, OWASP test
- Sim 2 (Pre-Launch): 1,000 hotels, 500 suppliers, 10,000 transactions

---

## 6. NON-NEGOTIABLE RULES (12 TOTAL)

1. **Zero Hallucination** — Every fact, API, and data point must be verifiable. Ask Mozi if uncertain.
2. **Zero Generic Output** — No placeholder text, no Lorem Ipsum, no "example.com". Custom-built only.
3. **Zero Fake Certificates** — All compliance docs must reference real Egyptian regulations. Real credentials only.
4. **Website vs SaaS Separation** — Marketing site ≠ application. Two distinct designs. Never mix them.
5. **UI Preview Before Code** — Hermes generates visual mockup → Mozi approves → Kimi builds. Mozi approval REQUIRED.
6. **Two Simulation Runs** — Pre-prod + pre-launch, both must pass before go-live.
7. **Real Data Only** — No synthetic data in production-facing code. 50+ real products, real suppliers.
8. **Logo Untouchable** — The HotelsVendors logo and brand identity are sacred. Existing logo on every page.
9. **External Correspondence Requires Mozi Approval** — No emails, API registrations, or vendor contact without explicit Mozi sign-off. WAIT FOR MOZI APPROVAL before sending ANY email/API request.
10. **Theme Colors Untouchable** — The palette in Section 2 is immutable. Old wrong values (#0B0F1A, #E8ECF3, #3B82F6) must NEVER be used.
11. **Workspace Separation** — Kimi never writes to Hermes workspace. Hermes never writes to Kimi workspace.
12. **Mission Control Mandatory** — Both agents must report status. Silent agents = dead agents.

---

## 7. DAILY REPORT REQUIREMENTS

Both agents must report daily:
- Tasks completed today
- Tasks in progress (%)
- Blockers (with proposed solutions)
- Agent assignments and status
- KPI checklist compliance score
- Next 24h planned work

---

## 8. HERMES CONTAINER CONFIG

Hermes now has enhanced capabilities:
- Docker socket mounted → `docker` commands work
- SSH keys mounted → `ssh root@187.77.181.3` works
- `/var/www` mounted → File editing works
- Host network mode → Full network access
- Workspace env: `HERMES_WORKSPACE=/opt/data/workspace-hermes`

### Hermes Quick Start Commands
```bash
# Read your master brief
cat /opt/data/MASTER_BRIEF.md

# Report status to Mission Control
curl -X POST http://187.77.181.3:3000/api/mission-control/sync \
  -H "Content-Type: application/json" \
  -d '{
    "workspace": "hermes",
    "agents": [{"name": "Alisa-CTO", "status": "running", "task": "current task", "lastUpdate": "'$(date -Iseconds)'", "workspace": "hermes"}],
    "containerStatus": "running"
  }'

# Write to your workspace
mkdir -p /opt/data/workspace-hermes/project-essentials
echo "your spec" > /opt/data/workspace-hermes/project-essentials/feature.md
```

---

## 9. ESCALATION MATRIX

| Issue | Action |
|-------|--------|
| File conflict detected | STOP. Both agents freeze. Escalate to Mozi. |
| Build fails | Kimi fixes. Hermes does NOT touch build config. |
| Theme color changed | REVERT immediately. Agent responsible is flagged. |
| Agent goes silent >10min | Check Mission Control. Restart if needed. |
| Hermes backend fails | Kimi fixes container. Hermes continues planning. |
| External API needed | Hermes drafts request. Mozi approves. Kimi executes. |

---

## 10. EXISTING DOCUMENTS TO READ

- `/var/www/hotelsvendors-v2/AGENTS.md`
- `/var/www/hotelsvendors-v2/DESIGN_BRIEF.md`
- `/var/www/hotelsvendors-v2/GOOGLE_AI_STUDIO_PROMPT.md`
- `/var/www/hotelsvendors-v2/ROADMAP.md`
- `/var/www/hotelsvendors-v2/prisma/schema.prisma`

---

*This brief is binding. Deviation requires Mozi approval.*
*Last updated by: Kimi CLI Agent*
*Timestamp: 2026-05-25T05:55:00Z*
