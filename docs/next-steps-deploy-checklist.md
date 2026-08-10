# Next Steps: Deploy & Hardening Checklist

Run these commands locally or in CI as appropriate. Do NOT commit secrets.

1) Rotate any secrets that were in tracked `.env` — generate new `JWT_SECRET`, `NEXTAUTH_SECRET`, SMTP password, DB password.

2) Add GitHub repository secrets (Settings → Secrets):
   - `DATABASE_URL` (production)
   - `HOSTINGER_SSH_KEY`
   - `SENTRY_DSN` (optional)
   - `OLLAMA_*` if using Ollama in CI

3) Hostinger: place real `.env` on server in release deploy path (deploy script references `shared/.env`).

4) CI smoke tests (in GitHub Actions): ensure workflow runs `npm ci`, `npm run build`, and `npx vitest run` (optional). Add tests to fail early.

Commands to run locally for verification:

```bash
# Build and type-check
npm ci --legacy-peer-deps
npm run build
npx tsc --noEmit
npx vitest run
```

Health-check endpoints to add (suggested):
- `GET /api/v1/invo/health` — returns 200 with DB status and Redis connectivity.
- `GET /api/v1/health` — lightweight app health.

Quick rollback plan:
- Keep last successful commit hash documented.
- If deploy fails, SSH into VPS and `pm2 reload ecosystem.config.js --env production` with previous release.

If you want, I can:
- Create PRs with automatic RBAC inserts for mutation endpoints.
- Add Playwright e2e tests skeleton and CI job.
- Install and configure Husky + lint-staged for pre-commit formatting and tests.

Which of the above should I do next automatically? (I can open PRs or modify `main` directly; recommend PRs for risky changes.)
