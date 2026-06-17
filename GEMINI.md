# Hotels Vendors Project - GEMINI.md

This project is the implementation of the `www.hotelsvendors.com` platform, starting with its landing page and extending into a comprehensive B2B fintech and procurement ecosystem for the hotel industry.

## 🎯 Project Overview

The platform serves as a marketplace and financial toolset for hotels and their vendors. While the immediate focus may be the landing page, the codebase indicates a sophisticated backend involving:
- **Factoring & Matchmaking**: Connecting vendors with financing.
- **Procurement**: Streamlining hotel supply chains.
- **Risk Profiling**: Compliance and financial risk assessment.
- **AI Integration**: Utilizing LLMs (via Ollama and AI SDK) for intelligent automation.

## 🛠️ Tech Stack

### Frontend & Core
- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Sass
- **Animations**: Framer Motion & GSAP
- **UI Components**: Radix UI & Lucide React

### Backend & Data
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (via Supabase & Neon)
- **Authentication/SSR**: Supabase SSR
- **Queue/Caching**: BullMQ & Redis (ioredis)

### AI & Tooling
- **AI SDK**: Vercel AI SDK
- **Local LLM**: Ollama
- **Testing**: Vitest (Unit/Integration) & Playwright (E2E)
- **Deployment**: Vercel

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Database Management
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Production Build
```bash
npm run build
npm start
```

## 📁 Key Directory Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Core utility functions and shared logic.
- `prisma/`: Database schema and seed scripts.
- `public/`: Static assets.
- `styles/`: Global CSS and Sass definitions.
- `tests/`: Unit and integration tests.
- `docs/`: Project documentation.

## 📋 Strategic Context

This project is heavily documented. Refer to the following files for high-level guidance:
- `ROADMAP.md`: The long-term vision and milestone tracking.
- `PROJECT_STATE.md`: Current status of the implementation.
- `COO_STRATEGY.md`: Operational and business strategy.
- `AGENTS.md`: Documentation regarding AI agent implementations.
- `FINTECH_AUDIT.md`: Financial and compliance audit details.

## 🧪 Testing & Quality

- **Unit Testing**: Use `npm test` or Vitest directly.
- **E2E Testing**: Use Playwright for browser-based testing.
- **Linting**: `npm run lint` for static analysis.
