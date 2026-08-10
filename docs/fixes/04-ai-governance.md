# AI Governance Fixes — HotelsVendors Digital Procurement Hub

**Date:** 2026-07-14
**Scope:** Critical and High findings from `docs/audits/07-ai-governance-audit.md`
**Auditor Reference:** F-PE1, F-DP1, F-HO1, F-TE1, F-BF1, F-AE1, F-HO4

---

## Changes Made

### 1. CRITICAL: Prompt Injection Defense (F-PE1)

**New file:** `lib/ai/sanitization.ts`
- Input sanitization pipeline: strip control characters, limit length, wrap in delimiters
- Injection pattern detection (ignore instructions, role impersonation, system prompt overrides)
- `sanitizeUserInput()` wraps user input in `<|user_input|>` delimiters to prevent LLM confusion
- `sanitizeMessages()` sanitizes entire chat message arrays

**Modified:** `app/api/v1/ai/assistant/route.ts`
- Added `sanitizeUserInput()` call before LLM processing
- Added `sanitizeMessages()` on conversation history
- Injection attempts are logged with user ID for security monitoring

**Modified:** `app/api/v1/ai/public/route.ts`
- Added `sanitizeUserInput()` call before public LLM processing
- Injection attempts logged with IP address

### 2. CRITICAL: PII Stripping for External LLMs (F-DP1)

**New file:** `lib/ai/pii-scrubber.ts`
- Regex-based detection and masking for: emails, Egyptian phone numbers (mobile + landline), tax registration numbers, bank accounts, credit card numbers, national IDs
- `scrubPii()` returns scrubbed text + count of PII items found
- `scrubMessages()` scrubs entire message arrays for external provider calls

**Modified:** `lib/ai/llm.ts`
- Added PII scrubbing before Groq and xAI API calls
- Warning logged when PII is detected and scrubbed
- Ollama (local) calls are NOT scrubbed — only external providers

### 3. CRITICAL: Human Approval for Credit Limit Extensions (F-HO1)

**Modified:** `lib/fintech/smart-fix-executor.ts`
- Added `creditExtensionApprovalThreshold` config (default: 5%)
- `executeAutoLimitExtension()` now checks extension percentage against threshold
- Extensions >5% of current limit require human approval — auto-execution is blocked
- Audit log includes before/after state with percentage increase

### 4. HIGH: Credit Risk Explainability (F-TE1)

**New file:** `lib/ai/explainability.ts`
- `explainRiskAssessment()` — generates human-readable risk summaries with factor breakdowns
- `explainSmartFix()` — explains why a specific fix was applied and what changes
- `explainCreditExtension()` — details eligibility, factors, and approval requirements
- `checkBiasInRiskAssessment()` — detects potential systemic bias in scoring

### 5. HIGH: Bias Detection in Risk Engine (F-BF1)

**Modified:** `lib/fintech/risk-engine.ts`
- Added `checkBiasInRiskAssessment()` call after every risk assessment
- Logs fairness warnings when bias is detected (scale bias, default score penalties)
- Bias factors include: hotel scale penalties, ETA compliance default unfairness, payment history dominance

### 6. HIGH: AI Disclosure to Users (F-AE1)

**Modified:** `components/ai-assistant/workspace-chatbot.tsx`
- Added disclaimer: "AI-generated responses may contain errors. Verify critical information."

**Modified:** `components/ai-assistant/public-chatbot.tsx`
- Added same disclaimer above the "Powered by" footer

### 7. HIGH: Authority Matrix Bypass Restriction (F-HO4)

**Modified:** `lib/fintech/factoring-orchestrator.ts`
- `BYPASS_FOUR_EYES`: now only works in `NODE_ENV=development` or `NODE_ENV=test`
- `TREASURY_OVERRIDE`: now only works in development/test; warns if set in production
- Both overrides emit security warnings when activated

---

## Files Created

| File | Purpose |
|------|---------|
| `lib/ai/sanitization.ts` | Prompt injection defense utilities |
| `lib/ai/pii-scrubber.ts` | PII detection and masking for external LLM calls |
| `lib/ai/explainability.ts` | Human-readable explanations for AI decisions |

## Files Modified

| File | Change |
|------|--------|
| `app/api/v1/ai/assistant/route.ts` | Input sanitization, injection detection |
| `app/api/v1/ai/public/route.ts` | Input sanitization for public endpoint |
| `lib/ai/llm.ts` | PII scrubbing before Groq/xAI calls |
| `lib/fintech/smart-fix-executor.ts` | 5% threshold for credit extension approval |
| `lib/fintech/risk-engine.ts` | Bias detection logging after risk assessment |
| `lib/fintech/factoring-orchestrator.ts` | Dev-only restriction on bypass env vars |
| `components/ai-assistant/workspace-chatbot.tsx` | AI disclosure disclaimer |
| `components/ai-assistant/public-chatbot.tsx` | AI disclosure disclaimer |

---

## Remaining Recommendations (Not in Scope)

These items from the audit were not addressed in this round and should be tracked for future sprints:

- **F-DP2:** Full data anonymization layer (beyond PII scrubbing)
- **F-TE2:** Smart Fix explainability in UI (backend explainability added)
- **F-BF2:** Scale bias mitigation (bias detection added, mitigation pending)
- **F-BF3/F-BF4:** Supplier tier and seasonal bias (monitoring pending)
- **F-DP3:** Chat history retention policy (90-day TTL)
- **F-AE2:** Consent dialog for public chatbot
- **F-ARM1:** Fallback frequency monitoring
