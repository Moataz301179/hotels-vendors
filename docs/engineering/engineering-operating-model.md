# HotelsVendors Engineering Operating Model

**Version:** 1.0  
**Created:** 2026-09-23  
**Status:** Bootstrap phase — infrastructure/organization setup only, no MVP code changes  
**Owner:** ENGINEERING ORCHESTRATOR  

---

## 1. Purpose

This document describes how the HotelsVendors engineering organization operates. It defines the relationship between employees, skills, tools, tasks, evidence, verification, and gates.

**This is not a prompt engineering document.** It is an operational contract.

---

## 2. Core Concepts

### EMPLOYEE
A persistent role with a defined mission, scope, skills, tools, permissions, inputs, outputs, evidence requirements, verification authority, and escalation path.

Employees are not chatbots. They are not personas. They are owned execution contexts with accountability.

### SKILL
A reusable capability packaged as a `SKILL.md` file with frontmatter (name, description, version, author, license, platforms, tags).

A skill teaches an employee HOW to do something. It is not the employee itself.

### TOOL
A Hermes runtime capability: `read_file`, `write_file`, `patch`, `terminal`, `browser_exec`, `delegate_task`, `web_search`, `web_extract`, `skill_view`, `execute_code`, etc.

Tools are what employees use to get work done.

### TASK
A unit of work assigned to an employee. Has: goal, context, allowed scope, expected output, evidence requirement.

### EVIDENCE
The proof that work was done correctly. Evidence is specific:
- Exact files changed (paths, line numbers)
- Exact implementation (code diff, config change)
- Tests executed (command, suite, name)
- Test results (pass/fail counts, output)
- Browser/API/database verification (screenshots, HTTP status, query results)
- Remaining limitations
- Commit SHA where appropriate

**Evidence rule:** Never report "implemented," "fixed," "complete," "production ready," or "working" without evidence. Use `UNKNOWN` when something cannot be verified.

### VERIFICATION
Independent confirmation that evidence supports the claim. Verification is not the same as the work itself.

- The person who does the work is not the person who verifies it (when possible).
- Verification for runtime behavior requires runtime evidence, not source inspection.
- Security claims require security-specific verification (cross-tenant tests, auth bypass attempts, etc.).

### GATE
An evidence requirement that must be satisfied before progression. Gates are not checkboxes. Gates are proof points.

Gate status values:
- `NOT STARTED` — no work done
- `IN PROGRESS` — work underway, not yet verified
- `PASS` — evidence satisfies gate requirements
- `FAIL` — evidence shows gate not met
- `BLOCKED` — cannot proceed without resolving a dependency or human decision
- `UNKNOWN` — cannot assess (insufficient evidence)

---

## 3. The Execution Cycle

```
OBSERVE
  ↓
PLAN — decompose into tasks, build dependency graph
  ↓
SELECT SPECIALIST — assign employee based on responsibility
  ↓
LOAD RELEVANT SKILLS — skill_view before execution
  ↓
EXECUTE — do the work within scope
  ↓
TEST — run appropriate tests
  ↓
INDEPENDENTLY VERIFY — confirm evidence supports claim
  ↓
RECORD EVIDENCE — update execution ledger
  ↓
PASS/FAIL GATE — assess against gate criteria
  ↓
UNLOCK NEXT TASK — identify what becomes executable
```

This cycle repeats. It does not end at one task. After every verified task, look for the next dependency that has become executable.

---

## 4. Parallelization Rules

**Parallelize when safe:**
- Independent investigations (different files, different systems)
- Read-only audits (no mutations)
- Tasks with no shared dependencies
- Different employees working in different scopes

**Do NOT parallelize when:**
- Two tasks modify the same file or schema
- Task B depends on Task A's output
- A security change and a feature change touch the same API route
- Two employees would write conflicting code

**Coordinate ownership explicitly.** When two employees' scopes overlap, the orchestrator assigns primary ownership and the other employee provides review/verification.

---

## 5. Employee → Skill → Tool → Task Flow

```
┌─────────────────────────────────────────────────┐
│                 ENGINEERING ORCHESTRATOR          │
│  (owns execution state, gates, dependencies)     │
├─────────────────────────────────────────────────┤
                                                 │
    ┌────────────────────────────────────────────┤
    │  OBSERVE: what needs doing?                │
    │  PLAN: decompose, build dependency graph   │
    │  SELECT: which employee owns this?         │
    │  LOAD: skill_view(employee_skill)          │
    └────────────────────────────────────────────┘
                                                 │
              ┌──────────────────────────────────┼──────────────────────────────────┐
              │                                  │                                  │
    ┌─────────┴─────────┐          ┌────────────┴────────────┐          ┌──────────┴──────────┐
    │ BACKEND ENGINEER  │          │  FRONTEND ENGINEER     │          │ SECURITY ENGINEER   │
    │ (lib/, prisma/,   │          │  (app/*, components/)  │          │ (lib/auth, RBAC,    │
    │  app/api/, tests/)│          │                        │          │  tenant isolation)  │
    └─────────┬─────────┘          └────────────┬────────────┘          └──────────┬──────────┘
              │                                  │                                  │
    ┌─────────┴─────────┐          ┌────────────┴────────────┐          ┌──────────┴──────────┐
    │ SKILLS:           │          │ SKILLS:                │          │ SKILLS:             │
    │ systematic-debugging│         │ Nextjs App Router     │          │ systematic-debugging │
    │ test-driven-dev   │          │ Audit, grill-with-docs│          │ code-review,        │
    │ prisma, tdd       │          │                        │          │ requesting-code-rev │
    │ diagnosing-bugs   │          │ TOOLS: read/write/     │          │ security-and-hardening│
    └─────────┬─────────┘          │ patch/terminal/browser │          └──────────┬──────────┘
              │                     └────────────┬────────────┘                     │
    ┌─────────┴─────────┐                       │                                  │
    │ TOOLS:            │                       │ TOOLS:                          │
    │ read/write/patch/ │                       │ read/write/patch/terminal/      │
    │ terminal/test/    │                       │ browser/vision/                 │
    │ delegate_task/    │                       │ delegate_task/                  │
    │ web_search/       │                       │ web_search/                    │
    │ execute_code/     │                       │ skill_view/                    │
    └─────────┬─────────┘                       └────────────┬────────────┘
              │                                                  │
    ┌─────────┴────────────────────────────────────────────────┴──────────┐
    │                     TASK EXECUTION                          │
    │  - Read codebase (read_file, search_files)                      │
    │  - Run diagnostics (terminal, execute_code)                     │
    │  - Write code/docs (write_file, patch)                           │
    │  - Run tests (terminal)                                         │
    │  - Verify behavior (browser_exec, API calls)                    │
    └─────────────────────────────────────────────────────────────────┘
                                                 │
    ┌────────────────────────────────────────────┴────────────────────────────┐
    │                     EVIDENCE RECORDING                               │
    │  - File: exact path + change                                       │
    │  - Test: command + result                                          │
    │  - Runtime: verification method + outcome                          │
    │  - Limitations: what was NOT verified                              │
    └──────────────────────────────────────────────────────────────────────┘
                                                 │
    ┌────────────────────────────────────────────┴────────────────────────────┐
    │                     GATE ASSESSMENT                                  │
    │  - Does evidence satisfy gate criteria? → PASS                      │
    │  - Does evidence show gate not met? → FAIL                         │
    │  - Is a dependency unresolved? → BLOCKED                           │
    │  - Was work done but not verified? → IN PROGRESS                   │
    └──────────────────────────────────────────────────────────────────────┘
                                                 │
    ┌────────────────────────────────────────────┴────────────────────────────┐
    │                     NEXT UNLOCKED WORK                               │
    │  - What dependency just became satisfied?                           │
    │  - Which employee should pick it up?                                │
    │  - Are there parallel tasks now executable?                         │
    └──────────────────────────────────────────────────────────────────────┘
```

---

## 6. Gate System

| Gate | Name | Evidence Required | Owner |
|------|------|-------------------|-------|
| GATE 0 | Repository takeover / factual baseline | git status, branch, HEAD, file count, build state, test state | Orchestrator |
| GATE 1 | Architecture and dependency baseline | Architecture audit report, dependency graph, build strategy | Architecture Engineer |
| GATE 2 | Authentication + tenant isolation + RBAC | Security audit with runtime tests (cross-tenant, auth bypass attempts) | Security Engineer |
| GATE 3 | Core backend/data/business workflows | `tsc --noEmit = 0`, test results, API route audit (Zod + RBAC + tenant scoping) | Backend Engineer + QA |
| GATE 4 | Frontend/user journeys | Page inventory, link validation, browser verification of key pages | Frontend Engineer + QA |
| GATE 5 | MVP procurement functionality | End-to-end order flow test (create order → invoice → payment → factoring) | Backend Engineer + QA |
| GATE 6 | Integration/API connectivity foundation | Connector framework design doc, webhook chain implementation, sync job model | Integration Engineer |
| GATE 7 | AI/workflow controls and non-autonomous approval boundaries | AI safety audit, prompt limitation verification, autonomy boundary definitions | AI/Agent Engineer + Security Engineer |
| GATE 8 | Full browser/API/E2E/security regression | E2E test results, security regression tests, API contract tests, no regressions | QA/Verification Engineer |
| GATE 9 | Production build/runtime/deployment verification | Production build success + BUILD_ID, VPS health (HTTP 200, PM2, DB, Redis, Ollama), deployment provenance | DevOps/Runtime Engineer + QA |
| GATE 10 | MVP release readiness | All prior gates PASS, no open HIGH/CRITICAL findings, deployment verified | Orchestrator + all employees |

**Gate rule:** Do NOT blindly follow gate ordering if repository evidence shows a different dependency order. The actual dependency graph controls execution.

---

## 7. Evidence Hierarchy

Evidence quality levels (highest to lowest):

1. **Runtime verification** — test passes against live system, browser confirms behavior, API returns expected response, database query shows correct state
2. **Test suite evidence** — unit/integration/E2E tests pass, test output captured
3. **Static analysis** — `tsc --noEmit` passes, lint passes, build succeeds with BUILD_ID
4. **Source inspection** — code review confirms implementation, file reads confirm structure
5. **Documentation** — ADR, design doc, or report describes the system

**Rule:** A gate that requires runtime behavior (e.g., "orders can be created") cannot be marked PASS with only source inspection. It requires runtime verification.

---

## 8. Skill Loading Protocol

Before executing any task, the assigned employee must:

1. `skill_view(name=<relevant_skill>)` — load the skill's SKILL.md
2. Read the skill's "When to Use" section
3. Apply the skill's process to the task
4. Reference the skill by name in the execution ledger

Skills are not optional flavor text. They are the operating procedure.

**Available skill sources:**
- Built-in (ships with Hermes, no install needed): `systematic-debugging`, `test-driven-development`, `requesting-code-review`, `architecture-decision-records`, `simplify-code`, `github`, `web-deployment-verification`, `codebase-inspection`, `plan`, `spike`, `dogfood`
- Skills Hub (install via `hermes skills install <identifier>`): `code-review` (clawhub), `prisma` (clawhub), `Nextjs App Router Audit` (clawhub)
- npx skills (install via `npx skills@latest add`): Matt Pocock bundle — `grill-with-docs`, `wayfinder`, `tdd`, `diagnosing-bugs`, `domain-modeling`
- Official optional catalog (opt-in via `hermes skills opt-in`): `subagent-driven-development`

See `docs/engineering/employee-skill-manifest.json` for the full manifest with security assessments and installation status.

---

## 9. Employee Activation Protocol

To activate an employee for a task:

1. Orchestrator identifies the task and which employee owns it
2. Orchestrator loads the employee's registry entry from `docs/engineering/employee-registry.json`
3. Orchestrator loads the employee's assigned skills via `skill_view`
4. Orchestrator dispatches the employee via `delegate_task` with:
   - `goal`: the specific task
   - `context`: relevant file paths, error messages, constraints, gate status
   - The employee's mission and scope as guidance
5. Employee executes within their permitted scope
6. Employee returns findings with evidence
7. Orchestrator records evidence in the ledger and assesses gate impact

**Employees are not spawned and forgotten.** The orchestrator tracks their work and integrates their findings into the gate system.

---

## 10. Security / Supply-Chain Check

Before installing any third-party skill:

1. Inspect the source repository (README, SKILL.md, any install scripts)
2. Check for network/tool access requirements
3. Check for credential requirements
4. Identify any suspicious shell commands
5. Identify any arbitrary file/system modification
6. Identify any hidden external services
7. Check the author/maintainer reputation
8. Check the license (MIT is preferred; avoid proprietary/cryptic licenses)
9. Reject unsafe or opaque skills

**Installed skills must be recorded in `docs/engineering/employee-skill-manifest.json` with their security assessment.**

---

## 11. Forbidden Patterns

The following patterns are forbidden in this operating model:

- **The repeated build loop:** inspect → fix → build → wait 60 minutes → fail → repeat. Replace with root-cause diagnosis first.
- **Source inspection as runtime evidence:** claiming a gate passes because the code looks right, without running it.
- **Silent security weakening:** bypassing auth/RBAC/tenant isolation to make a test pass.
- **Unbacked completion claims:** "implemented," "fixed," "done," "production ready" without evidence.
- **Speculation as fact:** treating assumptions as verified state. Use `UNKNOWN`.
- **Scope drift:** an employee doing work outside their permitted scope without orchestrator approval.
- **Orchestrator writing application code:** the orchestrator coordinates. It does not implement.

---

## 12. Current State (Bootstrap Phase)

**Phase:** Infrastructure/organization setup  
**MVP code changes:** NONE — this phase creates the employee system only  
**Skills installed:** 7 built-in skills confirmed available + 3 hub skills pending install + 5 Matt Pocock skills pending install  
**Employees defined:** 9 (orchestrator + 8 specialists) in `docs/engineering/employee-registry.json`  
**Skill manifest:** `docs/engineering/employee-skill-manifest.json`  
**Operating model:** this document  

**Next action after bootstrap verification:** Activate employees and begin Gate 0 → Gate 1 progression.

---

## 13. File Index

| File | Purpose |
|------|---------|
| `docs/engineering/employee-skill-manifest.json` | Curated skill inventory with source, security assessment, installation status |
| `docs/engineering/employee-registry.json` | Employee definitions: role, mission, skills, tools, permissions, verification authority, escalation |
| `docs/engineering/engineering-operating-model.md` | This document — the complete architecture |

---

*This operating model is the single source of truth for how the HotelsVendors engineering organization operates. It supersedes any previous informal working conventions.*
