#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════
# Hotels Vendors — One-Command Production Deployment
# Run this on the VPS after pushing code to GitHub
# ═══════════════════════════════════════════════════════════════

REPO_DIR="/var/www/hotelsvendors"
COMPOSE_FILE="docker-compose.swarm.yml"
APP_CONTAINER="hv-app"
NGINX_CONTAINER="hv-nginx"
CERTBOT_CONTAINER="hv-certbot"
DOMAIN="www.hotelsvendors.com"
ALT_DOMAIN="hotelsvendors.com"

cd "$REPO_DIR"

echo "═══════════════════════════════════════════════════════════════"
echo "  Hotels Vendors — Production Deploy"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ── 1. Pull latest code ──
echo "[1/7] Pulling latest code..."
git pull origin main
echo ""

# ── 2. Build app Docker image ──
echo "[2/7] Building app Docker image..."
docker compose -f "$COMPOSE_FILE" build --no-cache app
echo ""

# ── 3. Check SSL certificates ──
echo "[3/7] Checking SSL certificates..."
CERT_PATH="/var/lib/docker/volumes/hotelsvendors_certbot_data/_data/live/$DOMAIN"
if [ -f "$CERT_PATH/fullchain.pem" ] && [ -f "$CERT_PATH/privkey.pem" ]; then
    echo "  ✓ SSL certificates found"
else
    echo "  ✗ SSL certificates NOT found — running certbot..."

    # Create certbot webroot dir
    mkdir -p "$REPO_DIR/deploy/certbot/www"

    # Ensure nginx is running with HTTP config so certbot can validate
    docker compose -f "$COMPOSE_FILE" up -d nginx

    # Run certbot standalone to get certs
    docker run --rm \
        -v hotelsvendors_certbot_data:/etc/letsencrypt \
        -v "$REPO_DIR/deploy/certbot/www:/var/www/certbot" \
        -p 80:80 \
        certbot/certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email admin@hotelsvendors.com \
        -d "$DOMAIN" \
        -d "$ALT_DOMAIN" \
        || {
            echo "  ⚠ Certbot failed — checking for existing certs..."
            # Fallback: try certbot with webroot via running nginx
            docker run --rm \
                -v hotelsvendors_certbot_data:/etc/letsencrypt \
                -v "$REPO_DIR/deploy/certbot/www:/var/www/certbot" \
                certbot/certbot certonly \
                --webroot \
                --webroot-path /var/www/certbot \
                --non-interactive \
                --agree-tos \
                --email admin@hotelsvendors.com \
                -d "$DOMAIN" \
                -d "$ALT_DOMAIN" \
                || true
        }

    if [ -f "$CERT_PATH/fullchain.pem" ]; then
        echo "  ✓ SSL certificates obtained"
    else
        echo "  ⚠ WARNING: Could not obtain SSL certs. HTTPS will fail."
        echo "    Check: docker logs $CERTBOT_CONTAINER"
    fi
fi
echo ""

# ── 4. Restart services ──
echo "[4/7] Restarting services..."
docker compose -f "$COMPOSE_FILE" up -d app nginx
echo ""

# ── 5. Health check ──
echo "[5/7] Health checks..."
sleep 5

APP_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$APP_CONTAINER" 2>/dev/null || echo "N/A")
NGINX_HEALTH=$(docker inspect --format='{{.State.Status}}' "$NGINX_CONTAINER" 2>/dev/null || echo "N/A")

echo "  App container:   $APP_HEALTH"
echo "  Nginx container: $NGINX_HEALTH"

# Test internal endpoints
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ || echo "000")
echo "  App port 3000:   HTTP $HTTP_CODE"

HTTP_CODE_NGINX=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: hotelsvendors.com" http://localhost/ || echo "000")
echo "  Nginx port 80:   HTTP $HTTP_CODE_NGINX"
echo ""

# ── 6. Verify content ──
echo "[6/7] Verifying deployed content..."
ABOUT_TITLE=$(curl -s -H "Host: hotelsvendors.com" http://localhost/about | grep -o '<title>[^<]*</title>' | head -1 || echo "NOT FOUND")
HELP_TITLE=$(curl -s -H "Host: hotelsvendors.com" http://localhost/help | grep -o '<title>[^<]*</title>' | head -1 || echo "NOT FOUND")
HOME_LINK=$(curl -s -H "Host: hotelsvendors.com" http://localhost/ | grep -o 'href="/about"[^>]*>[^<]*' | head -1 || echo "NOT FOUND")

echo "  /about title:    $ABOUT_TITLE"
echo "  /help title:     $HELP_TITLE"
echo "  Home About link: $HOME_LINK"
echo ""

# ── 7. Cleanup ──
echo "[7/7] Cleaning up old Docker images..."
docker image prune -f 2>/dev/null || true
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  Deploy Complete"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  App:     http://localhost:3000"
echo "  Nginx:   http://localhost  →  https://hotelsvendors.com"
echo ""
echo "  To check logs:"
echo "    docker logs -f $APP_CONTAINER"
echo "    docker logs -f $NGINX_CONTAINER"
echo ""
