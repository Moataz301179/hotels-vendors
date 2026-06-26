# Skill Router — HotelsVendors

Maps every task to the right skill / tool / agent.agents must consult this before picking a skill.

## Skill Catalog

| Skill | Domain | Output |
|---|---|---|
| `high-end-visual-design` | Landing/marketing hero, premium UI direction | Design spec |
| `design-taste-frontend` | Landing page, portfolio, redesign (anti-slop) | UI spec + code |
| `stitch-design-taste` | Export spec for Google Stitch | DESIGN.md |
| `awesome-design-md` | Color palette, typography, layout reference | Reference |
| `minimalist-ui` | Clean editorial bento-grid interfaces | UI spec |
| `industrial-brutalist-ui` | Data-heavy dashboards, telemetry | UI spec |
| `imagegen-frontend-web` | Section-by-section landing page images | Images (1/section) |
| `imagegen-frontend-mobile` | Premium mobile screen mockups | Images only |
| `image-to-code` | Image -> HTML for key visuals | Visual code |
| `brandkit` | Logo, identity decks, brand world | Images |
| `full-output-enforcement` | Boss rule: ban placeholders, deliver fully | Process |
| `hotels-vendors-content-marketing` | Copy, brand voice, tone | Copy |
| `redesign-existing-projects` | Audit + fix existing pages | Code polish |
| `tool-scout` | Find GitHub tools | Research |
| `run-hotels-vendors` | Playwright screenshots | Screenshots |

## Routing Rules

### 1. Design & Images
- **Hero / landing page direction** → `high-end-visual-design` first for visual language, then `imagegen-frontend-web` to render section-by-section images
- **Mobile screens** → `imagegen-frontend-mobile`
- **Logo / brand identity** → `brandkit`
- **Dashboard / data-heavy UI** → `industrial-brutalist-ui`
- **Editorial / minimal landing** → `minimalist-ui`
- **Color / type reference** → `awesome-design-md`
- **Anti-slop landing redesign** → `design-taste-frontend`
- **Image to code** → `image-to-code`
- **Every visual task** → add `full-output-enforcement` (no placeholders)

### 2. Web / Marketing Pages
- New marketing page (platform/pricing/solutions/about/hotels/compliance) → `high-end-visual-design` + `design-taste-frontend` + `imagegen-frontend-web`
- Polish existing marketing page → `redesign-existing-projects`
- Chatbot / AI assistant → `hotels-vendors-content-marketing` (voice/tone)

### 3. Mobile / Driver / Logistics
- Driver PWA screens → `imagegen-frontend-mobile`
- Mobile layout → PWA (manifest + SW), follow `minimalist-ui` touch-target rules
- Logistics dashboard → `industrial-brutalist-ui`

### 4. Dashboards / Control Panels
- Default dashboard → dashboard-mockup.tsx already exists as premium reference
- Per-role dashboards → extend dashboard-mockup.tsx with role-aware panels (do NOT clone fully — each user type gets matching features)
- Dashboard data viz → `industrial-brutalist-ui` + recharts (already installed)

### 5. Infrastructure / DevOps
- Deployment → `vercel:deploy` workflow
- Schema / DB → Prisma MCP, `prisma:generate`
- Observability → Vercel MCP `get_runtime_logs`
- Tool scouting → `tool-scout`

### 6. Workflow / Backend
- RBAC / multi-tenant → always enforce via `lib/auth/RBAC`
- Financial transactions → add liability disclaimer
- LLM / AI chatbot → `ollama` (already installed, AI SDK)

## Task Routing Map (current)

| # | Task | Skill(s) | Agent |
|---|---|---|---|
| 1 | Fix Ollama chatbot to be contextual | `hotels-vendors-content-marketing` + `run-hotels-vendors` | backend |
| 2 | Stage registration wizard (email+phone first) | `design-taste-frontend` | frontend |
| 3 | Per-role dashboards (supplier vs hotel vs logistics vs factoring) | `industrial-brutalist-ui` | frontend |
| 4 | Remove dark/light themes, keep only ember + noir; fix logistics page | `redesign-existing-projects` | frontend |
| 5 | Apply Plus Jakarta Sans uniformly; ember accent yellow → brighter | `high-end-visual-design` + `awesome-design-md` | frontend |
| 6 | Hero title wider letter-spacing, less congested | `high-end-visual-design` | frontend |
| 7 | Generate promo video (lazy-load embed, no SEO penalty) | `imagegen-frontend-web` + higgsfield MCP | media |
| 8 | Driver PWA polish (if needed after phase 1) | `imagegen-frontend-mobile` | mobile |

## Hard Rules
- `full-output-enforcement` applies to ALL tasks (no `// ...`, no placeholders)
- Never clone Stripe/Linear exactly — synthesize from 2-3 refs
- All colors via CSS variables, never hardcoded hex (except in globals.css definitions)
- Mobile-first for driver PWA (already built)
- Every financial/transaction endpoint gets liability disclaimer
