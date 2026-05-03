#!/bin/bash
# Hotels Vendors — Hostinger VPS Full Deployment Script v3 (Ollama Primary)
# Includes: Docker, Ollama LLM, Swarm, OpenClaw, Agent0, SSL, Cloudflare Tunnel

set -e

ENV=${1:-production}
DOMAIN="www.hotelsvendors.com"
APP_DIR="/var/www/hotelsvendors"
USER="ubuntu"
OLLAMA_MODEL=${OLLAMA_MODEL:-llama3.2:3b}

echo "═══════════════════════════════════════════════════"
echo "  Hotels Vendors — Hostinger VPS Deployment v3"
echo "  Ollama Primary — Zero API Cost Swarm"
echo "  Environment: $ENV"
echo "  Domain: $DOMAIN"
echo "═══════════════════════════════════════════════════"

# ── 1. SYSTEM UPDATE ──
echo "[1/13] Updating system..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq

# ── 2. INSTALL DOCKER ──
echo "[2/13] Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker $USER
fi
sudo systemctl enable docker
sudo systemctl start docker

# ── 3. INSTALL DOCKER COMPOSE ──
echo "[3/13] Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

# ── 4. CREATE APP DIRECTORY ──
echo "[4/13] Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# ── 5. CLONE REPO ──
echo "[5/13] Cloning repository..."
if [ -d "$APP_DIR/.git" ]; then
  cd $APP_DIR && git pull origin main
else
  git clone https://github.com/Moataz301179/hotels-vendors.git $APP_DIR
fi

# ── 6. CREATE ENV FILE ──
echo "[6/13] Creating environment file..."
cat > $APP_DIR/.env << 'EOF'
# ═══════════════════════════════════════════════════════════════
# Hotels Vendors — Environment Variables (Swarm v3 — Ollama Primary)
# ═══════════════════════════════════════════════════════════════

# ── Database ──
DATABASE_URL=postgresql://hotels_vendors:CHANGE_ME@postgres:5432/hotels_vendors

# ── Redis ──
REDIS_URL=redis://redis:6379

# ── Session ──
SESSION_SECRET=CHANGE_ME_32_CHAR_MIN

# ═══════════════════════════════════════════════════════════════
# LLM PROVIDERS — Ollama is PRIMARY (zero cost, runs on VPS)
# ═══════════════════════════════════════════════════════════════

# Option A: OLLAMA (PRIMARY — local/VPS, no API key needed)
OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=llama3.1:8b

# Option B: GROQ (FREE TIER FALLBACK — 20 req/min, 1M tok/day)
# Get free key: https://console.groq.com (no credit card)
GROQ_API_KEY=

# Option C: OPENROUTER (UNIVERSAL FALLBACK — $5-10 credits)
OPENROUTER_API_KEY=

# Option D: KIMI via Moonshot (FUNDED FALLBACK)
KIMI_API_KEY=

# Option E: Grok via xAI (FUNDED FALLBACK)
XAI_API_KEY=

# ── Internal Services ──
OPENCLAW_URL=http://openclaw:8000
AGENT0_URL=http://agent0:9000

# ── Email (SendGrid recommended) ──
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=
EMAIL_FROM=noreply@hotelsvendors.com

# ── WhatsApp / Twilio ──
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# ── App URL ──
APP_URL=https://hotelsvendors.com
EOF

echo "⚠️  IMPORTANT: Edit $APP_DIR/.env before starting!"
echo "    - Change DATABASE_URL password"
echo "    - Change SESSION_SECRET"
echo "    - Add GROQ_API_KEY for free fallback (recommended)"

# ── 7. BUILD AND START INFRA ──
echo "[7/13] Building and starting infrastructure (postgres, redis, ollama)..."
cd $APP_DIR
sudo docker-compose -f docker-compose.swarm.yml pull
sudo docker-compose -f docker-compose.swarm.yml up -d postgres redis ollama

# ── 8. PULL OLLAMA MODEL ──
echo "[8/13] Pulling Ollama model ($OLLAMA_MODEL)..."
sleep 5
sudo docker-compose -f docker-compose.swarm.yml exec -T ollama ollama pull $OLLAMA_MODEL || {
  echo "⚠️  Ollama pull failed — will retry on first use"
}

# ── 9. BUILD APP ──
echo "[9/13] Building application..."
sudo docker-compose -f docker-compose.swarm.yml build app swarm-worker openclaw agent0

# ── 10. START ALL SERVICES ──
echo "[10/13] Starting all services..."
sudo docker-compose -f docker-compose.swarm.yml up -d

# ── 11. RUN DATABASE MIGRATIONS ──
echo "[11/13] Running database migrations..."
sleep 15
sudo docker-compose -f docker-compose.swarm.yml exec -T app npx prisma migrate deploy || true

# ── 12. SETUP SSL (if domain is configured) ──
echo "[12/13] SSL setup..."
read -p "Do you want to setup SSL with Let's Encrypt? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  sudo docker run -it --rm \
    -v $APP_DIR/deploy/certbot/www:/var/www/certbot \
    -v certbot_data:/etc/letsencrypt \
    certbot/certbot certonly \
    --webroot -w /var/www/certbot \
    -d $DOMAIN -d hotelsvendors.com \
    --agree-tos --no-eff-email
fi

# ── 13. CLOUDFLARE TUNNEL (optional) ──
echo "[13/13] Cloudflare Tunnel setup (optional)..."
read -p "Do you want to setup Cloudflare Tunnel? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  read -p "Enter your Cloudflare Tunnel token: " CF_TOKEN
  sudo docker run -d \
    --name cloudflared \
    --restart unless-stopped \
    cloudflare/cloudflared:latest tunnel --no-autoupdate run --token $CF_TOKEN
fi

# ── 14. SETUP LOG ROTATION ──
echo "[14/14] Setting up log rotation..."
sudo tee /etc/logrotate.d/hotels-vendors > /dev/null << 'EOF'
/var/www/hotelsvendors/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0644 ubuntu ubuntu
}
EOF

# ── 15. HEALTH CHECK ──
echo "═══════════════════════════════════════════════════"
echo "  🚀 DEPLOYMENT COMPLETE — Running Health Checks"
echo "═══════════════════════════════════════════════════"
sleep 5

curl -sf http://localhost:3000/api/health && echo "✅ App is healthy" || echo "⚠️  App health check failed"
curl -sf http://localhost:11434/api/tags && echo "✅ Ollama is healthy" || echo "⚠️  Ollama health check failed"
curl -sf http://localhost:8000/health && echo "✅ OpenClaw is healthy" || echo "⚠️  OpenClaw health check failed"
curl -sf http://localhost:9000/health && echo "✅ Agent0 is healthy" || echo "⚠️  Agent0 health check failed"

echo ""
echo "═══════════════════════════════════════════════════"
echo "  🧠 SWARM SERVICES"
echo "═══════════════════════════════════════════════════"
echo ""
echo "LLM Engine:"
echo "  Ollama:    http://localhost:11434 (PRIMARY — $OLLAMA_MODEL)"
echo ""
echo "Services:"
echo "  App:       http://localhost:3000"
echo "  OpenClaw:  http://localhost:8000"
echo "  Agent0:    http://localhost:9000"
echo "  Postgres:  localhost:5432"
echo "  Redis:     localhost:6379"
echo ""
echo "Management:"
echo "  docker-compose -f docker-compose.swarm.yml logs -f app"
echo "  docker-compose -f docker-compose.swarm.yml logs -f swarm-worker"
echo "  docker-compose -f docker-compose.swarm.yml logs -f ollama"
echo ""
echo "Swarm API:"
echo "  POST /api/v1/swarm/director/plan  → Trigger Director cycle"
echo "  GET  /api/v1/swarm/health         → Swarm health dashboard"
echo "  GET  /api/v1/swarm/agents         → List all agents"
echo "  GET  /api/v1/swarm/jobs           → List jobs"
echo ""
echo "Ollama Commands:"
echo "  docker-compose -f docker-compose.swarm.yml exec ollama ollama list"
echo "  docker-compose -f docker-compose.swarm.yml exec ollama ollama pull llama3.1:8b"
echo ""
echo "Next steps:"
echo "  1. Edit $APP_DIR/.env with real values"
echo "  2. Restart: docker-compose -f docker-compose.swarm.yml restart"
echo "  3. Trigger first Director cycle:"
echo "     curl -X POST http://localhost:3000/api/v1/swarm/director/plan"
echo ""
