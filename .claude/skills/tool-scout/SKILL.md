---
name: tool-scout
description: Search GitHub for production-ready tools, skills, and libraries to upgrade the hotels-vendors web app, landing page, dashboards, AI agents, and sales/marketing engines. Scans every candidate for malware, suspicious patterns, and supply-chain risk before recommending or installing. Use when the user asks to find new tools, upgrade capabilities, add features, or scout the ecosystem for ready-made solutions.
argument-hint: 'tool-scout marketing automation | tool-scout AI agent orchestration | tool-scout leads generation | tool-scout dashboard analytics | tool-scout landing page conversion'
allowed-tools: Bash, Read, Write, WebSearch, WebFetch
---

# tool-scout — Safe GitHub Tool Discovery & Install

Search GitHub for production-ready tools relevant to the hotels-vendors platform. **Never install without passing the security scan.**

## Hotels Vendors — context

- Next.js 16 App Router + Turbopack, React 18, TypeScript strict, Tailwind v4, Prisma 7.
- No external UI libraries (no shadcn, no MUI). No worktrees. Single repo on `main`.
- Product: B2B procurement marketplace for coastal Egyptian hotels. Fixed-price catalogs, embedded factoring, ETA e-invoicing compliance, Shark-Breaker logistics.
- Users: Hotel buyers, suppliers, factoring companies, shipping/logistics, admins.

## Scoutable domains

| Domain | What to look for | Keywords |
|---|---|---|
| Marketing & media generation | Headless CMS, email automation, social scheduling, content generation, SEO tools | `headless-cms`, `email-automation`, `seo-tool`, `content-generation`, `social-scheduler` |
| Leads generation | Lead capture, form builders, enrichment, prospecting, CRM embeds | `lead-capture`, `form-builder`, `prospecting`, `crm-widget`, `enrichment` |
| Sales revenue engine | Pricing pages, billing embeds, subscription management, affiliate widgets | `billing-embed`, `pricing-page`, `subscription-widget`, `affiliate-embed`, `revenue-dashboard` |
| Database enhancer | Prisma extensions, query builders, caching, sync, migration tools | `prisma-extension`, `query-builder`, `db-cache`, `data-sync`, `migration-tool` |
| Performance | Image optimization, edge caching, bundle analysis, monitoring, Core Web Vitals | `image-optimization`, `edge-cache`, `bundle-analyzer`, `web-vitals`, `performance-monitor` |
| AI agentic actions | Agent frameworks, tool-calling, LLM orchestration, embeddings, RAG | `ai-agent`, `llm-orchestration`, `tool-calling`, `embedding`, `rag-framework` |
| Orchestrator capabilities | Workflow engines, cron queues, event buses, job schedulers | `workflow-engine`, `job-scheduler`, `event-bus`, `cron-manager`, `queue-system` |
| Dashboards | Analytics embeds, charting, data visualization, admin panels | `analytics-embed`, `chart-library`, `admin-dashboard`, `data-visualization` |
| Landing page | A/B testing, heatmaps, conversion optimization, animation libraries | `ab-testing`, `heatmap`, `conversion-optimize`, `landing-animation`, `form-conversion` |
| Value proposition | Social proof widgets, testimonial embeds, trust badges, pricing calculators | `social-proof`, `testimonial-widget`, `trust-badge`, `pricing-calculator` |

## Process

### 1. Search

Use GitHub CLI to search for relevant repositories. Always sort by stars and filter by recent activity.

```bash
# Search for repos
gh search repos "<keywords>" --language=TypeScript --sort=stars --limit=20 --json name,owner,url,stargazerCount,updatedAt,description,licenseInfo 2>/dev/null

# Search for skills in awesome-list repos
gh search repos "claude skill <topic>" --sort=stars --limit=10 --json name,owner,url 2>/dev/null

# Check a specific repo
gh api repos/<owner>/<repo> --jq '{name, full_name, description, stargazers_count, forks_count, open_issues_count, language, license: .license.spdx_id, created_at, updated_at, pushed_at, size, topics, default_branch}' 2>/dev/null
```

### 2. Security scan (MANDATORY — never skip)

For every candidate repo, run ALL of these checks. **Any single failure = reject.**

#### 2.1 Metadata red flags

```bash
gh api repos/<owner>/<repo> --jq '{name, stargazers_count, forks_count, open_issues_count, created_at, updated_at, pushed_at, license: .license.spdx_id, size, default_branch}' 2>/dev/null
```

Reject if:
- Created less than 30 days ago (too new, unverified).
- Fewer than 100 stars (unless it's a niche tool with clear provenance).
- No license or license is missing/null.
- No commits in the last 90 days (abandoned).
- Repository size > 50MB (likely bundles binaries — supply-chain risk).

#### 2.2 Code scan for malicious patterns

```bash
# Clone to temp and scan
cd /tmp && rm -rf tool-scan && mkdir tool-scan && cd tool-scan
gh repo clone --depth=1 https://github.com/<owner>/<repo>.git . 2>/dev/null

# Scan for suspicious patterns
grep -rn --include="*.ts" --include="*.js" --include="*.json" --include="*.mjs" --include="*.cjs" \
  -e "eval(" -e "exec(" -e "child_process" -e "fs.writeFile" -e "http.request" \
  -e "fetch(" -e "XMLHttpRequest" -e "WebSocket(" -e "process.env" \
  -e "exfiltrate" -e "steal" -e "secret" -e "password" -e "token" \
  -e "curl " -e "wget " -e "socket" \
  -e "postinstall" -e "preinstall" -e "prepublish" \
  -e "npm pack" -e "npm publish" \
  . 2>/dev/null | grep -v node_modules | grep -v ".git/" | head -50
```

Reject if:
- Any `eval(` or `exec(` in install scripts or entry points.
- `postinstall` / `preinstall` / `prepublish` scripts that run network commands.
- Hardcoded URLs to unknown domains (not npmjs.com, github.com, or well-known CDNs).
- Any reference to `exfiltrate`, `steal`, credential harvesting.
- Obfuscated code (long base64 strings, packed/minified single-line blobs in source).

#### 2.3 Dependency audit

```bash
cd /tmp/tool-scan
cat package.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d.get('dependencies',{}),indent=2))" 2>/dev/null
```

Reject if:
- Depends on packages you've never heard of with < 10k weekly downloads (check via `npm info <pkg> downloads`).
- Depends on `node-gyp` native modules from unknown authors.
- Has > 200 direct dependencies (dependency-bloat attack surface).

#### 2.4 Author trust

```bash
gh api users/<owner> --jq '{login, name, company, blog, location, bio, public_repos, followers, created_at}' 2>/dev/null
```

Reject if:
- Account created < 6 months ago.
- No bio, no company, no social links.
- Account only has this one repo (throwaway).
- Account matches known malicious patterns (random username like `asdf1234`, no avatar).

#### 2.5 Community signals

```bash
# Check issues for security complaints
gh issue list --repo <owner>/<repo> --search "security OR malware OR vulnerability OR suspicious" --limit 5 --json title,url 2>/dev/null

# Check forks — high fork-to-star ratio can signal abuse
gh api repos/<owner>/<repo> --jq '{forks_count, stargazers_count, subscribers_count, open_issues_count}' 2>/dev/null
```

Reject if:
- Open issues mentioning security concerns with no maintainer response.
- Fork count > star count (star inflation).
- Zero watchers/subscribers despite high stars (fake stars).

### 3. Compatibility check

Before recommending, verify:
- TypeScript support (has `types` field or `@types/<pkg>`).
- ESM or CJS compatible with Next.js 16.
- No peer dependency conflicts with React 18, Tailwind v4, Prisma 7.
- Tree-shakeable (not a single monolithic bundle).
- Works in server components (no `use client` requirement unless it's a UI widget).

### 4. Recommendation format

For each candidate that passes, present:

```
### <repo-name> by <owner>
- **URL**: https://github.com/<owner>/<repo>
- **Stars**: X | **License**: MIT | **Updated**: YYYY-MM-DD
- **What it does**: 1 sentence
- **Why it fits hotels-vendors**: 1 sentence
- **Security**: PASSED (X checks clean)
- **Install**: `npm install <pkg>` or skill install steps
- **Risk level**: LOW / MEDIUM
```

### 5. Install (only after user approval)

After the user picks a tool:

```bash
# For npm packages
npm install <pkg> --save-exact 2>&1 | tail -5

# For skills from GitHub
gh api repos/<owner>/<repo>/contents/<path-to-skill> --jq '.content' | base64 -d > ~/.claude/skills/<skill-name>/SKILL.md

# Post-install scan
npm audit --audit-level=high 2>&1 | tail -10
```

After install:
1. Run `npm audit` — zero high/critical.
2. Run `npx tsc --noEmit` — no new type errors.
3. Run `npx vitest run` — no regressions.
4. Commit only if all three pass.

## Output

Always end with a summary table:

| Tool | Domain | Stars | Risk | Status |
|---|---|---|---|---|
| X | Marketing | 1.2k | LOW | RECOMMENDED |
| Y | AI agents | 800 | LOW | RECOMMENDED |
| Z | Leads | 300 | MEDIUM | NEEDS_REVIEW |
| W | Dashboard | 50 | HIGH | REJECTED |

## Red flags — immediate reject

- Repository is a fork with no original commits.
- README is empty or clearly AI-generated spam.
- Package name is a typo of a popular package (`ract`, `next-js`, `tailwind-cs`).
- Repository was recently transferred between owners.
- Any mention of "hacking", "cracking", "bypass" in README or issues.
- Maintainer account has no activity outside this one repo.
- GitHub Actions workflows that run on `pull_request_target` without safeguards.
