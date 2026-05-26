# HotelsVendors 24/7 Autonomous Operation — Complete Setup

## Problem
Hermes sessions timeout after ~10 minutes. For true 24/7 operation, you need durable execution patterns that survive disconnects.

## Solution — 4 Parallel Systems

---

## 1. CRON JOBS (Recurring Tasks)

Already partially configured. Two jobs running:

| Job | Schedule | Purpose |
|-----|----------|---------|
| hv-autosave | */5 * * * * | Auto-commit code changes every 5 min |
| hv-health-check | */10 * * * * | Health check + disk/memory monitoring |

### To add more cron jobs:

```bash
# Inside container: docker exec -it hermes-agent-son5-hermes-agent-1 bash

# Place script in ~/.hermes/scripts/ (which is /opt/data/.hermes/scripts/)
cp /opt/data/scripts/hv-health-check.sh /opt/data/.hermes/scripts/

# The CLI has a validation bug with --no-agent + skills. Use direct DB insert instead:
python3 << 'PYEOF'
import sqlite3, json, uuid
from datetime import datetime, timezone

DB_PATH = '/opt/data/.hermes/cron.db'
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# Ensure table exists
c.execute('''
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY, name TEXT, schedule TEXT NOT NULL, prompt TEXT,
    skills TEXT, script TEXT, no_agent INTEGER DEFAULT 0, deliver TEXT DEFAULT 'origin',
    repeat INTEGER, created_at TEXT, updated_at TEXT, last_run_at TEXT,
    next_run_at TEXT, run_count INTEGER DEFAULT 0, enabled INTEGER DEFAULT 1, workdir TEXT
)
''')

job_id = str(uuid.uuid4()).replace('-','')[:16]
now = datetime.now(timezone.utc).isoformat()

c.execute('''
INSERT INTO jobs (id, name, schedule, prompt, skills, script, no_agent, deliver, created_at, updated_at, next_run_at, enabled)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', (job_id, 'hv-health-check', '*/10 * * * *',
      'Run HotelsVendors health check and auto-commit',
      json.dumps(['hotelsvendors-cto']), 'hv-health-check.sh', 1, 'origin',
      now, now, now, 1))

conn.commit()
conn.close()
print(f'Created cron job: {job_id}')
PYEOF
```

---

## 2. BACKGROUND WORKER (Long-Running Tasks)

### Worker Script: `/opt/data/scripts/hv-worker.sh`

Already deployed. Starts a loop that checks for tasks every 30 seconds.

### Start the worker:

```bash
# Inside container
tmux new-session -d -s hv-worker 'bash /opt/data/scripts/hv-worker.sh'

# Verify it's running
tmux ls
tmux capture-pane -t hv-worker -p | tail -20
```

### Queue a task:

```bash
bash /opt/data/scripts/hv-queue-task.sh "Build the Pre-Spend Gatekeeper module"
```

The worker will pick it up within 30 seconds and execute via `hermes chat -q`.

### To make worker auto-start on container boot, add to config:

```bash
# On VPS host (not inside container)
cat > /etc/systemd/system/hermes-worker.service << 'EOF'
[Unit]
Description=Hermes Background Worker
After=docker.service
Requires=docker.service

[Service]
Type=simple
Restart=always
RestartSec=10
ExecStart=/usr/bin/docker exec hermes-agent-son5-hermes-agent-1 bash /opt/data/scripts/hv-worker.sh
ExecStop=/usr/bin/docker exec hermes-agent-son5-hermes-agent-1 pkill -f hv-worker.sh

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now hermes-worker
```

---

## 3. GATEWAY MODE (Always-On Bot)

Gateway is already running inside the container. For 24/7 access via messaging:

### Option A: Telegram Bot (Recommended)

```bash
# Inside container
hermes config set gateway.telegram.token "YOUR_BOT_TOKEN"
hermes config set telegram.allowed_chats "YOUR_TELEGRAM_USER_ID"
hermes gateway restart
```

Then message your bot anytime — it responds even when you're offline.

### Option B: Discord Bot

```bash
hermes config set gateway.discord.token "YOUR_DISCORD_BOT_TOKEN"
hermes gateway restart
```

### Make gateway auto-restart on host reboot:

```bash
# On VPS host
cat > /etc/systemd/system/hermes-gateway.service << 'EOF'
[Unit]
Description=Hermes Agent Gateway
After=docker.service
Requires=docker.service

[Service]
Type=simple
Restart=always
RestartSec=10
ExecStart=/usr/bin/docker start -a hermes-agent-son5-hermes-agent-1
ExecStop=/usr/bin/docker stop -t 30 hermes-agent-son5-hermes-agent-1

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now hermes-gateway
```

---

## 4. KANBAN BOARD (Multi-Agent Work Queue)

Already initialized. Board name: `hotelsvendors`

### Add tasks:

```bash
hermes kanban create --board hotelsvendors "Build Pre-Spend Gatekeeper API"
hermes kanban create --board hotelsvendors "Integrate Oliv factoring"
hermes kanban create --board hotelsvendors "Cashflow Planner frontend"
```

### List tasks:

```bash
hermes kanban list --board hotelsvendors
```

### Assign and complete:

```bash
hermes kanban assign --board hotelsvendors --task TASK_ID --profile hermes
hermes kanban complete --board hotelsvendors --task TASK_ID
```

---

## Quick Reference — All Commands

```bash
# SSH into VPS
sshpass -p 'Moziagent.3011' ssh root@187.77.181.3

# Enter Hermes container
docker exec -it hermes-agent-son5-hermes-agent-1 bash

# Start background worker
tmux new-session -d -s hv-worker 'bash /opt/data/scripts/hv-worker.sh'

# Queue a task
bash /opt/data/scripts/hv-queue-task.sh "Your task here"

# Check worker logs
tail -f /opt/data/logs/hv-worker-$(date +%Y%m%d).log

# List cron jobs
hermes cron list

# List kanban tasks
hermes kanban list --board hotelsvendors

# Gateway status
hermes gateway status
```

---

## Files Deployed on VPS

| File | Path | Purpose |
|------|------|---------|
| Health check script | `/opt/data/.hermes/scripts/hv-health-check.sh` | Cron job — health monitoring |
| Worker script | `/opt/data/scripts/hv-worker.sh` | Background task processor |
| Queue helper | `/opt/data/scripts/hv-queue-task.sh` | CLI to submit tasks |
| Cron DB | `/opt/data/.hermes/cron.db` | SQLite store for scheduled jobs |
| Worker logs | `/opt/data/logs/hv-worker-YYYYMMDD.log` | Background worker output |
| Health logs | `/opt/data/logs/hv-health-YYYYMMDD.log` | Health check output |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VPS: 187.77.181.3                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      Docker: hermes-agent-son5-hermes-agent-1      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │  Cron Jobs  │  │   Worker    │  │   Gateway   │ │   │
│  │  │  (every 5m) │  │  (tmux)     │  │ (Telegram)  │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  │  ┌─────────────┐                                   │   │
│  │  │   Kanban    │  ← Multi-agent task queue         │   │
│  │  │   Board     │                                   │   │
│  │  └─────────────┘                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ↑
    You (anywhere, anytime)
    Telegram / Discord / SSH
```

---

## Next Steps

1. **Start the background worker now:**
   ```bash
   docker exec hermes-agent-son5-hermes-agent-1 bash -c "tmux new-session -d -s hv-worker 'bash /opt/data/scripts/hv-worker.sh'"
   ```

2. **Queue your first task:**
   ```bash
   docker exec hermes-agent-son5-hermes-agent-1 bash /opt/data/scripts/hv-queue-task.sh "Build Pre-Spend Gatekeeper API routes"
   ```

3. **Set up Telegram gateway** (optional but recommended for mobile access):
   - Create bot via @BotFather
   - Get token and your user ID
   - Configure inside container

4. **Enable systemd services on host** for auto-restart on reboot.

All artifacts are deployed. The system is ready for 24/7 operation.
