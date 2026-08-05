# EXECUTION PROMPT — Phases 0.5 + 0.7 (refined by opencode reviewer)

You are operating under an approved plan. Read `docs/planning/EXECUTION_PHASES.md` fully before starting. Execute **Phase 0.5 (Deep Cleanup)** then **Phase 0.7 (Product Manager Governance Layer)**, in that order. Do not skip, reorder, or start Phase 1 without explicit approval.

## MANDATORY PROCESS

1. Read the plan, `CLAUDE.md`, and `AGENTS.md` first. State your understanding of Phase 0.5 and 0.7 in 3 bullet points before touching anything.
2. **Phase 0.5**: complete all cleanup items, run every verification gate in the plan, write `docs/planning/CLEANUP_REPORT.md`, commit as a single commit `chore: deep cleanup (dead code, deprecated trees)`. STOP and report.
3. **Phase 0.7**: create the 4 artifacts under `.claude/`:
   - `.claude/PM.md` — Product Manager charter
   - `.claude/skills/design-system/SKILL.md` — locked design tokens
   - `.claude/commands/qa-gate.md` — registration + flow test harness
   - `.claude/commands/ui-audit.md` — anti-generic-AI checker

   **FIX THE REGISTRATION BUG FIRST**: align the role enum end-to-end so ALL 4 roles (`hotel`, `supplier`, `factoring`, `shipping`) pass registration. The current failure: `app/(auth)/register/page.tsx` sends `type: form.role.toLowerCase()` where `LOGISTICS` → `"logistics"`, but `BusinessRegisterSchema` in `lib/zod.ts` (line 283) only allows `["hotel","supplier","factoring","shipping"]`. Do NOT invent a 5th enum value or rename UI labels. Normalize `LOGISTICS → shipping` on the page OR extend the schema — your call — but the QA gate must pass for all 4 roles.
4. Run the QA gate for all 4 roles. Run the ui-audit. Report exact command output (not "it works").
5. Commit Phase 0.7 separately: `feat: product manager governance layer (PM.md, design-system skill, qa-gate, ui-audit)`.

## HARD RULES

- Do not modify code outside the scope of 0.5 and 0.7.
- Do not start migrations, seeds, or any Phase 1 work.
- Do not change colors, fonts, or design tokens beyond the locked token map in `app/globals.css`.
- If you hit an error you cannot resolve in 2 attempts, STOP and report it with the full error message — do not work around it silently.

## REPORT FORMAT (when both phases pass)

```
- CLEANUP: list of removed paths + `git worktree list` output
- REGISTRATION: QA gate output for all 4 roles (status codes)
- ARTIFACTS: list the 4 files created with their line counts
- AUDIT: ui-audit violations found (or "zero")
- COMMITS: the two commit hashes
- BLOCKERS: anything requiring a decision
```
