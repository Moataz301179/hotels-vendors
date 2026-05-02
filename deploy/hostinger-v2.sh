#!/bin/bash
# Hotels Vendors — Hostinger VPS Full Deployment Script v2
# Includes: Docker, Swarm, OpenClaw, Agent0, SSL, Cloudflare Tunnel

set -e

ENV=${1:-production}
DOMAIN="www.hotelsvendors.com"
APP_DIR="/var/www/hotelsvendors"
USER="ubuntu"

echo "═══════════════════════════════════════════════════"
echo "  Hotels Vendors — Hostinger VPS Deployment v2"
echo "  Environment: $ENV"
echo "  Domain: $DOMAIN"
echo "═══════════════════════════════════════════════════"

# ── 1. SYSTEM UPDATE ──
echo "[1/12] Updating system..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq

# ── 2. INSTALL DOCKER ──
echo "[2/12] Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker $USER
fi
sudo systemctl enable docker
sudo systemctl start docker

# ── 3. INSTALL DOCKER COMPOSE ──
echo "[3/12] Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

# ── 4. CREATE APP DIRECTORY ──
echo "[4/12] Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# ── 5. CLONE REPO ──
echo "[5/12] Cloning repository..."
if [ -d "$APP_DIR/.git" ]; then
  cd $APP_DIR && git pull origin main
else
  git clone https://github.com/Moataz301179/hotels-vendors.git $APP_DIR
fi

# ── 6. CREATE ENV FILE ──
echo "[6/12] Creating environment file..."
cat > $APP_DIR/.env << 'EOF'
# Database
DATABASE_URL=postgresql://hotels_vendors:CHANGE_ME@postgres:5432/hotels_vendors

# Redis
REDIS_URL=redis://redis:6379

# Session
SESSION_SECRET=CHANGE_ME_32_CHAR_MIN

# LLM APIs
KIMI_API_KEY=sk-your-kimi-key
XAI_API_KEY=xai-your-xai-key

# Internal Services
OPENCLAW_URL=http://openclaw:8000
AGENT0_URL=http://agent0:9000

# Email
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@hotelsvendors.com

# WhatsApp (optional)
WHATSAPP_API_KEY=your-twilio-key

# Cloudflare Tunnel (optional - if not using nginx SSL)
# CF_TUNNEL_TOKEN=your-token
EOF

echo "⚠️  IMPORTANT: Edit $APP_DIR/.env with your actual API keys before starting!"

# ── 7. BUILD AND START ──
echo "[7/12] Building and starting services..."
cd $APP_DIR
sudo docker-compose -f docker-compose.swarm.yml pull
sudo docker-compose -f docker-compose.swarm.yml build
sudo docker-compose -f docker-compose.swarm.yml up -d

# ── 8. RUN DATABASE MIGRATIONS ──
echo "[8/12] Running database migrations..."
sleep 10
sudo docker-compose -f docker-compose.swarm.yml exec -T app npx prisma migrate deploy || true

# ── 9. SETUP SSL (if domain is configured) ──
echo "[9/12] SSL setup..."
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

# ── 10. CLOUDFLARE TUNNEL (optional) ──
echo "[10/12] Cloudflare Tunnel setup (optional)..."
read -p "Do you want to setup Cloudflare Tunnel? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  read -p "Enter your Cloudflare Tunnel token: " CF_TOKEN
  sudo docker run -d \
    --name cloudflared \
    --restart unless-stopped \
    cloudflare/cloudflared:latest tunnel --no-autoupdate run --token $CF_TOKEN
fi

# ── 11. SETUP LOG ROTATION ──
echo "[11/12] Setting up log rotation..."
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

# ── 12. HEALTH CHECK ──
echo "[12/12] Health check..."
sleep 5
curl -sf http://localhost:3000/api/health && echo "✅ App is healthy" || echo "⚠️  App health check failed"
curl -sf http://localhost:8000/health && echo "✅ OpenClaw is healthy" || echo "⚠️  OpenClaw health check failed"
curl -sf http://localhost:9000/health && echo "✅ Agent0 is healthy" || echo "⚠️  Agent0 health check failed"

echo ""
echo "═══════════════════════════════════════════════════"
echo "  🚀 DEPLOYMENT COMPLETE"
echo "═══════════════════════════════════════════════════"
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
echo ""
echo "Swarm API:"
echo "  POST /api/v1/swarm/director/plan  → Trigger Director cycle"
echo "  GET  /api/v1/swarm/health         → Swarm health dashboard"
echo "  GET  /api/v1/swarm/agents         → List all agents"
echo "  GET  /api/v1/swarm/jobs           → List jobs"
echo ""
echo "Next steps:"
echo "  1. Edit $APP_DIR/.env with real API keys"
echo "  2. Restart: docker-compose -f docker-compose.swarm.yml restart"
echo "  3. Trigger first Director cycle via API"
echo ""
