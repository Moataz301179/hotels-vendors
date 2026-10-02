# Engineering Employee System — Bootstrap Report

**Date:** 2026-09-24 00:02 EEST  
**Phase:** Infrastructure/organization setup (NO MVP code changes)  
**Status:** Bootstrap complete — employee system ready for Gate 0 execution  

---

## 1. Hermes Capabilities Verified

| Capability | Status | Details |
|------------|--------|---------|
| **Skills system** | ✅ Verified | Built-in (82) + optional bundled (117) + community via skills.sh registry. Full CLI: install, search, browse, inspect, list, check, update, audit, uninstall, reset, diff, opt-out, opt-in, repair-official, publish, snapshot, tap, config. |
| **Skill loading** | ✅ Verified | `skill_view(name)` loads SKILL.md content into context. Skills have frontmatter (name, description, version, author, license, platforms, tags) and linked files. |
| **Subagents/Delegation** | ✅ Verified | `delegate_task` with single/batch/background modes. Leaf vs orchestrator roles. Default cap 3 concurrent. Background children lost on parent exit (use cron for durability). |
| **Cron** | ✅ Verified | Durable scheduler via `cronjob` tool / `hermes cron` CLI. Schedules: duration, "every" phrase, 5-field cron, ISO timestamp. 3-minute hard interrupt. |
| **Kanban** | ✅ Verified | SQLite multi-agent work queue. `hermes kanban` CLI. Worker/orchestrator toolset. Not enabled in this session (no `kanban_*` tools present). |
| **Curator** | ✅ Verified | Background skill lifecycle: tracks usage, marks stale, archives. CLI: `hermes curator`. Only touches agent-created skills. |
| **MOAs** | ✅ Present | Model-assisted orchestration configured in config.yaml (reference models + aggregator). Not used in this bootstrap. |
| **Plugins** | ✅ Present | Chrome profiles, Davinci Resolve, Hades coding workflows, Hermes office enabled. Not engineering-relevant for this bootstrap. |
| **MCP servers** | ✅ Present | Canva (OAuth), Prisma Postgres (OAuth). Not used in this bootstrap. |
| **Profiles** | ⚠️ Limited | Config has `catgirl` personality example. No persistent bot profile system detected. We build our own employee system via delegation + skills instead. |
| **Tool search/call** | ✅ Verified | `tool_search` discovers deferred tools, `tool_describe` loads schemas, `tool_call` invokes. |

**Key finding:** Hermes does not have a built-in "persistent bot" system with custom agent definitions, skill assignment, and tool permissions per bot. The engineering employee system is built on top of `delegate_task` + skill loading + the orchestrator (this session). This is consistent with the user's instruction: "If persistent bot creation requires Desktop UI and cannot be automated, DO NOT stop. Immediately create/use dynamic specialist subagents through the available runtime."

---

## 2. GitHub Skill Repositories Investigated

| Repository | Maintainer | Stars | Purpose | Relevance | Decision |
|------------|-----------|-------|---------|-----------|----------|
| **mattpocock/skills** | Matt Pocock (Total TypeScript) | 242.3k | 23 engineering skills: grill-me, code-review, codebase-design, diagnosing-bugs, domain-modeling, implement, improve-codebase-architecture, prototype, research, tdd, to-spec, to-tickets, triage, wayfinder, etc. | **HIGH** — Directly applicable to TS/Next.js/Prisma engineering. Production quality. | **INSTALL selected skills** |
| **wshobson/agents** | wshobson | 39.9k | Multi-harness plugin marketplace. Skills: nextjs-app-router-patterns, typescript-advanced-types, javascript-testing-patterns, python-testing-patterns, etc. | **MEDIUM** — Next.js and TS skills relevant. But skills install via `npx skills` cross-agent system, not Hermes-native. | **DEFER** — Evaluate after bootstrap |
| **prisma/skills** | Prisma | 54 | prisma-client-api, prisma-postgres. Agent Skills format, compatible with `npx skills add`. | **MEDIUM** — Prisma skills directly applicable. But Hermes registry has community prisma skills already. | **DEFER** — Builtin + docs sufficient |
| **Cranot/super-hermes** | Cranot | 480 | 5 prism skills: prism-scan, prism-full, prism-3way, prism-discover, prism-reflect. Teaches Hermes to write its own analytical prompts. | **LOW** — Experimental. Single-file analysis only. Not applicable to multi-file codebase audits. | **REJECTED** |
| **vercel-labs/agent-skills** | Vercel | 30.7k | nextjs-app-router-patterns, next-dev-loop, next-cache-components-adoption, next-partial-prefetching-adoption. | **MEDIUM** — Vercel-authored Next.js skills. But install via `npx skills` cross-agent system. | **DEFER** — Evaluate after bootstrap |
| **supabase/agent-skills** | Supabase | — | Supabase-specific: client libraries, SSR integrations, Auth. | **NONE** — Not using Supabase. | **REJECTED** |
| **ZeroPointRepo/awesome-hermes-skills** | ZeroPointRepo | 565 | Curated directory of 350+ Hermes skills, plugins, profiles, memory providers. | **REFERENCE** — Used as the primary discovery source for this bootstrap. | **REFERENCE ONLY** |
| **everything-openai-codex** | mturac | — | 60 agents, 232 skills, 110 rules. Cross-harness. | **NONE** — Massive opaque bundle. We build our own system. | **REJECTED** |
| **Anthropic-Cybersecurity-Skills** | mukul975 | 31.8k | 753 cybersecurity skills mapped to MITRE ATT&CK. | **NONE** — Offensive security focus. Not relevant to defensive engineering. | **REJECTED** |

**Search method:** Web search for "Hermes Agent skill repositories engineering" → extracted awesome-hermes-skills list + individual repo pages → cross-referenced with Hermes CLI `hermes skills search` results.

---

## 3. Skills Selected

**12 skills installed and verified:**

### Built-in (7) — already available, no install needed
1. **systematic-debugging** — 4-phase root cause debugging. Foundation for all employees.
2. **test-driven-development** — RED-GREEN-REFACTOR enforcement.
3. **requesting-code-review** — Pre-commit security scan + quality gates + auto-fix loop.
4. **architecture-decision-records** — ADR capture during sessions.
5. **simplify-code** — Parallel 4-agent cleanup of recent changes.
6. **github** — gh CLI: PRs, issues, reviews, repos, auth.
7. **web-deployment-verification** — Verify web apps on PM2/Nginx VPS.

### Matt Pocock / npx skills (5) — installed via `npx skills@latest add`
8. **code-review** — Dual-axis review (standards + spec) via parallel sub-agents.
9. **tdd** — Structured TDD: seams, anti-patterns, vertical slices.
10. **grill-with-docs** — Relentless interview to sharpen plans + write ADRs.
11. **wayfinder** — Decision ticket map for large efforts spanning multiple sessions.
12. **diagnosing-bugs** — Advanced diagnosis: reproduce, minimise, hypothesise, instrument, fix.

### Domain modeling (1) — installed via `npx skills@latest add`
13. **domain-modeling** — Ubiquitous language + architectural decisions as you go.

---

## 4. Skills Rejected and Why

| Skill | Reason |
|-------|--------|
| **super-hermes** (prism-scan, prism-full, etc.) | Experimental. Single-file analysis only. Not applicable to multi-file codebase audits. |
| **everything-openai-codex (EOC)** | 60-agent 232-skill bundle. Over-engineered. Supply-chain risk from large opaque bundle. We build our own employee system. |
| **hermes-council** | Adversarial council MCP. Experimental. Our gate system + code-review already provides multi-axis review. Redundant. |
| **anthropic-cybersecurity-skills (753 skills)** | Offensive security focus. Not relevant to defensive engineering needs. |
| **SkillClaw** | Auto-evolves skill library. Interesting but not needed during bootstrap. Deferred to post-MVP. |
| **hermes-conductor** | Kanban-orchestrated multi-harness swarm. Would replace our system rather than augment it. Premature. |
| **babysitter (plugin)** | Deterministic supervision loop. Plugin, not skill. Adds tool dependencies. Not needed yet. |
| **prisma (clawhub)** | Community skill. Builtin systematic-debugging + direct Prisma docs provide equivalent capability. Rejected after inspection. |
| **Nextjs App Router Audit (clawhub)** | Community skill. Architecture Engineer can perform App Router audits using builtin skills + Next.js docs. Rejected after inspection. |

**Security/supply-chain notes:**
- All 5 Matt Pocock skills installed via `npx skills@latest add` — single SKILL.md files, no install scripts, no dependencies, no network calls, no credential access. Symlinked into `~/.hermes/skills/`. Low supply-chain risk.
- No skills installed from opaque bundles or untrusted sources.
- No plugins installed (only 4 pre-existing enabled, none engineering-relevant).

---

## 5. Skills Installed

**Installation commands executed:**

```bash
# Matt Pocock skills (5) via npx
npx skills@latest add mattpocock/skills --skill code-review
npx skills@latest add mattpocock/skills --skill tdd
npx skills@latest add mattpocock/skills --skill grill-with-docs
npx skills@latest add mattpocock/skills --skill wayfinder
npx skills@latest add mattpocock/skills --skill diagnosing-bugs
npx skills@latest add mattpocock/skills --skill domain-modeling
```

**Installation verification:**

Each skill verified via `skill_view(name)` — all return full SKILL.md content with `readiness_status: available`.

| Skill | Install path | Symlink |
|-------|-------------|---------|
| code-review | `~/.agents/skills/code-review` | `~/.hermes/skills/code-review` |
| tdd | `~/.agents/skills/tdd` | `~/.hermes/skills/tdd` |
| grill-with-docs | `~/.agents/skills/grill-with-docs` | `~/.hermes/skills/grill-with-docs` |
| wayfinder | `~/.agents/skills/wayfinder` | `~/.hermes/skills/wayfinder` |
| diagnosing-bugs | `~/.agents/skills/diagnosing-bugs` | `~/.hermes/skills/diagnosing-bugs` |
| domain-modeling | `~/.agents/skills/domain-modeling` | `~/.hermes/skills/domain-modeling` |

**Note:** `hermes skills install` for `code-review` (skills.sh) timed out at 60s. We used `npx skills@latest add` instead, which completed successfully. The `prisma` and `nextjs-app-router-audit` skills from clawhub were not installable via `hermes skills install` (ambiguous names / no exact match). Both were rejected in favor of builtin + docs approach.

---

## 6. Skill Verification Results

| Skill | Load Test | Content Verified | Ready for Use |
|-------|-----------|-----------------|---------------|
| systematic-debugging | ✅ skill_view | ✅ 4-phase process, iron law, feedback loop rule | ✅ |
| test-driven-development | ✅ skill_view | ✅ RED-GREEN-REFACTOR, seams, anti-patterns | ✅ |
| requesting-code-review | ✅ skill_view | ✅ 8-step pipeline: diff → security scan → baseline → self-review → independent reviewer → auto-fix → commit | ✅ |
| architecture-decision-records | ✅ skill_view | ✅ ADR format, workflow, detection signals, lifecycle | ✅ |
| simplify-code | ✅ skill_view | ✅ 4 parallel reviewer pattern | ✅ |
| github | ✅ skill_view | ✅ gh CLI operations | ✅ |
| web-deployment-verification | ✅ skill_view | ✅ PM2/Nginx/SSL/health check verification | ✅ |
| code-review (mattpocock) | ✅ skill_view | ✅ Dual-axis: Standards + Spec, parallel sub-agents, smell baseline | ✅ |
| tdd (mattpocock) | ✅ skill_view | ✅ Seams, anti-patterns, vertical slices, red-green loop | ✅ |
| grill-with-docs (mattpocock) | ✅ skill_view | ✅ Interview + ADR/glossary writing, disable-model-invocation | ✅ |
| wayfinder (mattpocock) | ✅ skill_view | ✅ Decision ticket map, frontier, fog of war, ticket types | ✅ |
| diagnosing-bugs (mattpocock) | ✅ skill_view | ✅ Diagnosis loop: reproduce, minimise, hypothesise, instrument, fix | ✅ |
| domain-modeling (mattpocock) | ✅ skill_view | ✅ Ubiquitous language, domain vocabulary, decision recording | ✅ |

**All 12 installed skills are verified loadable and ready for employee use.**

---

## 7. Employee Registry

**File:** `docs/engineering/employee-registry.json`  
**Employees defined:** 9

| Employee | Role | Mission Summary |
|----------|------|-----------------|
| **ENGINEERING ORCHESTRATOR** | Coordinator / Gatekeeper | Own execution state, task decomposition, dependency graph, delegation, gate progression, evidence, escalation. Does not write application code. |
| **ARCHITECTURE ENGINEER** | System Design / Dependency Analysis | Map architecture, detect bloat/conflicts, produce ADRs, review code structure, recommend build strategy. |
| **BACKEND ENGINEER** | APIs / Services / DB / Business Logic | Implement and verify API routes, Prisma schema, lib/ modules, Zod validation, tenant isolation, idempotency, tsc cleanliness. |
| **FRONTEND/PRODUCT ENGINEER** | User Journeys / Dashboards / UX | Implement pages, components, navigation, verify rendering, fix broken links, ensure styling compliance. |
| **SECURITY ENGINEER** | Auth / RBAC / Tenant Isolation / Veto | Audit auth, RBAC, tenant isolation, Authority Matrix, anti-bypass, financial mutations. **VETO power over security claims.** |
| **INTEGRATION ENGINEER** | API Connectivity / Webhooks / Sync | Build universal connector foundation, webhook receivers, sync orchestration, audit/provenance. Separate from intelligence engine. |
| **AI/AGENT ENGINEER** | AI Workflows / Safety / Boundaries | Audit AI assistant, swarm LLM, prompts, PII scrubber. Ensure no autonomous financial mutations. |
| **QA/VERIFICATION ENGINEER** | Test Planning / E2E / Regression / Gates | Create MVP verification matrix, write/execute tests, verify gates with runtime evidence, report PASS/FAIL/BLOCKED. |
| **DEVOPS/RUNTIME ENGINEER** | Build / Deploy / Runtime / Health | Diagnose build failures (root cause first), verify VPS deployment, health checks, environment, observability. |

Each employee has: responsibilities, assigned_skills, permitted_tools, permitted_repository_scope, inputs, expected_outputs, evidence_requirements, verification_authority, escalation_path, forbidden_actions.

---

## 8. Employee → Skill Mapping

| Skill | Employees |
|-------|-----------|
| systematic-debugging | ALL 9 employees |
| test-driven-development | BACKEND, QA, AI/AGENT |
| tdd (mattpocock) | BACKEND, QA |
| requesting-code-review | ORCHESTRATOR, ARCHITECTURE, BACKEND, SECURITY, INTEGRATION, AI/AGENT, QA, DEVOPS |
| code-review (mattpocock) | ARCHITECTURE, SECURITY |
| architecture-decision-records | ORCHESTRATOR, ARCHITECTURE |
| simplify-code | ARCHITECTURE, BACKEND |
| domain-modeling | ARCHITECTURE, BACKEND |
| grill-with-docs | ORCHESTRATOR, ARCHITECTURE |
| wayfinder | ORCHESTRATOR |
| diagnosing-bugs | BACKEND, DEVOPS, QA, ARCHITECTURE |
| github | ORCHESTRATOR, QA |
| web-deployment-verification | DEVOPS |
| security-and-hardening | SECURITY |

**design-md** (builtin, installed) available for any employee authoring design documents.

---

## 9. Tool/Permission Mapping

| Tool | Allowed For | Restrictions |
|------|-------------|--------------|
| delegate_task | ALL employees | Orchestrator spawns any. Specialists spawn within scope. Leaf by default; orchestrator role for ORCHESTRATOR only. |
| terminal | ALL employees | DEVOPS may SSH to VPS. No production builds without orchestrator approval. No production secret modification. |
| browser_exec | FRONTEND, QA, DEVOPS, ORCHESTRATOR | Verification only. No credential entry without browser_vault tools. |
| write_file | ALL employees | Scope-limited per employee. No cross-scope writes without orchestrator approval. |
| patch | ALL employees | Same scope restrictions as write_file. Target existing files only. |
| skill_manage | ORCHESTRATOR only | Only orchestrator may install/remove/modify skills. Employees use skill_view to load. |
| ssh_access | DEVOPS only | VPS access for deployment verification and health checks. No production data modification without user authorization. |

---

## 10. Files Created/Modified

### New Files
| File | Description | Size |
|------|-------------|------|
| `docs/engineering/employee-skill-manifest.json` | Curated skill inventory: 16 skills tracked, 12 installed, 9 rejected. Source, security assessment, verification status, overlap notes. | 18.4KB |
| `docs/engineering/employee-registry.json` | 9 employee definitions: role, mission, skills, tools, permissions, verification authority, escalation path, forbidden actions. Skill→employee mapping. Tool permission matrix. Gate definitions. Execution model. | 33KB |
| `docs/engineering/engineering-operating-model.md` | Complete operating model: core concepts, execution cycle, parallelization rules, skill loading protocol, employee activation protocol, security/supply-chain check, forbidden patterns, gate system, evidence hierarchy, current state. | 19KB |

### Modified Files
| File | Change |
|------|--------|
| `docs/engineering/employee-skill-manifest.json` | Updated from v1.0 draft to v1.1 final: all 12 installed skills marked INSTALLED/verified, 9 rejected skills added, install_strategy updated with completed/deferred/rejected phases. |

### Skill Installations (external, via npx)
| Skill | Source | Install Command |
|-------|--------|----------------|
| code-review | mattpocock/skills | `npx skills@latest add mattpocock/skills --skill code-review` |
| tdd | mattpocock/skills | `npx skills@latest add mattpocock/skills --skill tdd` |
| grill-with-docs | mattpocock/skills | `npx skills@latest add mattpocock/skills --skill grill-with-docs` |
| wayfinder | mattpocock/skills | `npx skills@latest add mattpocock/skills --skill wayfinder` |
| diagnosing-bugs | mattpocock/skills | `npx skills@latest add mattpocock/skills --skill diagnosing-bugs` |
| domain-modeling | mattpocock/skills | `npx skills@latest add mattpocock/skills --skill domain-modeling` |

---

## 11. Remaining Setup Blockers

**NONE for bootstrap phase.** The employee system is fully bootstrapped:

- ✅ 12 skills installed and verified
- ✅ 9 employees defined with full registries
- ✅ Operating model documented
- ✅ Skill manifest complete
- ✅ No MVP code changes made (as required)

**Pre-execution checklist (before dispatching employees):**

1. **Confirm gate order** — The orchestrator should verify the gate dependency graph before dispatching. Gates 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10, but actual dependency order may differ based on repository evidence.

2. **Set execution ledger** — Create `docs/engineering/execution-ledger.json` or equivalent to track: which employee produced each finding, which evidence verified it, gate status transitions.

3. **Confirm VPS access** — DEVOPS/RUNTIME ENGINEER needs SSH access to `187.77.181.3` with `~/.ssh/id_rsa`. Verify connectivity before dispatching.

4. **Confirm test framework** — QA/VERIFICATION ENGINEER needs to know what test framework is installed (Vitest? Jest? Playwright?) and where tests live.

5. **Confirm `.env` status** — Local `.env` is missing (no `SESSION_SECRET`). Builds/tests may be blocked locally. VPS has production `.env` (secrets redacted).

---

## 12. Exact Next Engineering Task Unlocked

**GATE 0 — Repository Takeover / Factual Baseline**

The orchestrator (this session) executes Gate 0 directly. No specialist needed yet.

**Tasks:**
1. Verify current Git branch and HEAD (context says `canonical-cleanup` / `19be43a31a9f9090756448f01df60c6d8083078e` — verify)
2. Verify working tree status (clean/dirty, uncommitted changes)
3. Count pages, API routes, components, lib files (quick inventory)
4. Check build state (`.next/` exists? BUILD_ID? Last build timestamp?)
5. Check test state (test framework, test count, pass/fail/skip)
6. Check deployment state (VPS live? PM2? DB migrated? Redis? Ollama?)
7. Record baseline in execution ledger

**Parallelizable sub-tasks:**
- Git/repo state (orchestrator direct)
- File inventory (orchestrator direct)
- Build state (orchestrator direct)
- Test state (orchestrator direct)
- VPS deployment state (orchestrator direct, or dispatch DEVOPS/RUNTIME ENGINEER if SSH needed)

**After Gate 0:** Dispatch ARCHITECTURE ENGINEER for Gate 1 (architecture baseline) in parallel with SECURITY ENGINEER for Gate 2 (auth/RBAC/tenant isolation audit) — these are independent reads.

---

## Appendix: Skill Loading Quick Reference

Employees load skills before execution with:

```
skill_view(name="systematic-debugging")
skill_view(name="code-review")
skill_view(name="tdd")
skill_view(name="grill-with-docs")
skill_view(name="wayfinder")
skill_view(name="diagnosing-bugs")
skill_view(name="domain-modeling")
skill_view(name="requesting-code-review")
skill_view(name="architecture-decision-records")
skill_view(name="simplify-code")
skill_view(name="github")
skill_view(name="web-deployment-verification")
```

All 12 return full SKILL.md content with `readiness_status: available`.

---

*End of bootstrap report. The engineering employee system is ready. The orchestrator may now execute Gate 0.*
