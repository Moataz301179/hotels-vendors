# Loop Harness — Autonomous Agent

The Loop Harness is a continuous build/optimize/deploy/operate automation system.

## Architecture

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  BUILD   │ →  │ OPTIMIZE │ →  │  DEPLOY  │ →  │ OPERATE  │
│          │    │          │    │          │    │          │
│ npm ci   │    │ lint     │    │ pm2      │    │ health   │
│ tsc      │    │ deadcode │    │ curl 200 │    │ disk/mem │
│ next     │    │ colors   │    │ verify   │    │ logs     │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
       ↕              ↕              ↕               ↕
    git pull     quality gates    production      monitoring
```

## Usage

### Continuous Loop (runs forever):
```bash
./scripts/loop-harness.sh
```

### Cron Health Check (every 5 min):
```bash
*/5 * * * * cd /var/www/hotelsvendors-v2 && bash scripts/harness-health.sh
```

### Manual Deployment:
```bash
# Just build + deploy
git pull origin main && npm ci && npx next build && pm2 restart 0
```

## Phases

| Phase | What it does | Failure behavior |
|-------|-------------|------------------|
| BUILD | git pull, npm ci, tsc, lint, next build | Retries in 60s |
| OPTIMIZE | Dead code scan, color audit, console.log check | Warning, continues |
| DEPLOY | PM2 restart, HTTP health check, page verification | Retries in 60s |
| OPERATE | PM2 log check, disk/memory monitoring | Warning, continues |

## States

The harness maintains state in `.harness-state.json`:
```json
{
  "lastBuild": "2026-07-01T12:00:00Z",
  "lastDeploy": "2026-07-01T12:05:00Z",
  "buildStatus": "success",
  "deployStatus": "success",
  "cycleCount": 42
}
```

## Extending

Add new phases by creating `phase_<name>()` functions in `scripts/loop-harness.sh`
and calling them in the main loop.
