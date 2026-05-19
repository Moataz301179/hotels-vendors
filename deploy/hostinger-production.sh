#!/bin/bash
###############################################################################
# HOTELS-VENDORS NEXT.JS PLATFORM - HOSTINGER VPS PRODUCTION DEPLOYMENT SCRIPT
###############################################################################
# Server: 187.77.181.3
# User: root
# Domain: hotelsvendors.com
# Environment: Production
###############################################################################

set -euo pipefail

# Script Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Server Configuration
SERVER_IP="187.77.181.3"
SERVER_USER="root"
APP_NAME="hotelsvendors"
APP_DIR="/var/www/${APP_NAME}"
DOMAIN="hotelsvendors.com"
WWW_DOMAIN="www.hotelsvendors.com"

# Application Configuration
NODE_VERSION="20"
PM2_INSTANCES="4"
PM2_MEMORY_LIMIT="4G"
PM2_LOG_DIR="/var/log/pm2"
APP_PORT="3000"

# Database Configuration
DB_NAME="hotelsvendors_prod"
DB_USER="hv_prod"
DB_PORT="5432"
REDIS_PORT="6379"
OLLAMA_PORT="11434"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Header
echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║     HOTELS-VENDORS PRODUCTION DEPLOYMENT - HOSTINGER VPS              ║"
echo "╠════════════════════════════════════════════════════════════════════════╣"
echo "║  Server: ${SERVER_IP}"
echo "║  Domain: ${DOMAIN}"
echo "║  User: ${SERVER_USER}"
echo "║  Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

###############################################################################
# STEP 1: PREREQUISITES CHECK
###############################################################################
log_info "Step 1/10: Checking Prerequisites..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version or install
if command_exists node; then
    NODE_CURRENT=$(node -v | grep -oE '[0-9]+' | head -1)
    if [ "$NODE_CURRENT" -ge "$NODE_VERSION" ]; then
        log_success "Node.js $(node -v) is installed"
    else
        log_warn "Node.js version is below $NODE_VERSION. Installing via n..."
        if ! command_exists n; then
            npm install -g n
        fi
        n $NODE_VERSION
        log_success "Node.js upgraded to $(node -v)"
 fi
else
    log_warn "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
    log_success "Node.js $(node -v) installed"
fi

# Check PM2
if command_exists pm2; then
    log_success "PM2 $(pm2 -v) is installed"
else
    log_warn "PM2 not found. Installing globally..."
    npm install -g pm2
    log_success "PM2 installed"
fi

# Check Nginx
if command_exists nginx; then
    log_success "Nginx is installed"
    if systemctl is-active --quiet nginx; then
        log_success "Nginx is running"
    else
        log_warn "Nginx not running. Starting..."
        systemctl start nginx
        systemctl enable nginx
        log_success "Nginx started and enabled"
    fi
else
    log_warn "Nginx not found. Installing..."
    apt-get update -qq
    apt-get install -y -qq nginx
    systemctl enable nginx
    log_success "Nginx installed and enabled"
fi

# Check Ollama
if command_exists ollama; then
    log_success "Ollama is installed"
    if systemctl is-active --quiet ollama; then
        log_success "Ollama service is running"
    else
        log_warn "Ollama service not running. Starting..."
        systemctl start ollama
        systemctl enable ollama
        log_success "Ollama service started"
    fi
else
    log_warn "Ollama not found. Installing..."
    curl -fsSL https://ollama.com/install.sh | sh
    systemctl enable ollama
    systemctl start ollama
    log_success "Ollama installed and started"
fi

echo ""

###############################################################################
# STEP 2: APPLICATION SETUP
###############################################################################
log_info "Step 2/10: Setting up Application..."

# Create application directory
mkdir -p $APP_DIR
log_info "Application directory: $APP_DIR"

# Clone or pull latest code from GitHub
REPO_URL="https://github.com/Moataz301179/hotels-vendors.git"
if [ -d "$APP_DIR/.git" ]; then
    log_info "Repository exists. Pulling latest changes..."
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/main
    git pull origin main
else
    log_info "Cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi
log_success "Source code updated"

# Install dependencies
log_info "Installing Node.js dependencies..."
cd $APP_DIR
npm ci --production
log_success "Dependencies installed"

# Generate Prisma client
log_info "Generating Prisma client..."
npx prisma generate
log_success "Prisma client generated"

# Set correct file permissions
log_info "Setting file permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
find $APP_DIR -type f -name "*.sh" -exec chmod +x {} \;
log_success "File permissions set"

echo ""

###############################################################################
# STEP 3: ENVIRONMENT CONFIGURATION
###############################################################################
log_info "Step 3/10: Configuring Environment..."

# Generate secure secrets
JWT_SECRET=$(openssl rand -base64 64)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 64)
FACTOR_WEBHOOK_SECRET=$(openssl rand -base64 64)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# Database password
DB_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)

# Create environment file
cat > $APP_DIR/.env << 'ENVEOF'
###############################################################################
# HOTELS-VENDORS PRODUCTION ENVIRONMENT CONFIGURATION
###############################################################################
NODE_ENV=production

###############################################################################
# DATABASE - PostgreSQL
###############################################################################
DATABASE_URL="postgresql://hv_prod:${DB_PASSWORD_ESCAPED}@localhost:5432/hotelsvendors_prod?schema=public&connection_limit=20&pool_timeout=30"

###############################################################################
# REDIS CACHE & SESSION STORE
###############################################################################
REDIS_URL="redis://:${REDIS_PASSWORD_ESCAPED}@localhost:6379"

###############################################################################
# AUTHENTICATION - NextAuth.js
###############################################################################
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="https://hotelsvendors.com"
SESSION_SECRET="${SESSION_SECRET}"

###############################################################################
# APPLICATION URLS
###############################################################################
NEXT_PUBLIC_APP_URL="https://hotelsvendors.com"
NEXT_PUBLIC_API_URL="https://hotelsvendors.com/api"

###############################################################################
# PAYMENT INTEGRATION - Stripe (Update with real keys)
###############################################################################
STRIPE_PUBLISHABLE_KEY="pk_live_placeholder_update_in_dashboard"
STRIPE_SECRET_KEY="sk_live_placeholder_update_in_dashboard"
STRIPE_WEBHOOK_SECRET="whsec_placeholder_update_in_dashboard"

###############################################################################
# PAYMENT INTEGRATION - Paymob (Update with real keys)
###############################################################################
PAYMOB_API_KEY="placeholder_update_in_paymob_dashboard"
PAYMOB_INTEGRATION_ID="placeholder_update_in_paymob_dashboard"
PAYMOB_IFRAME_ID="placeholder_update_in_paymob_dashboard"
PAYMOB_HMAC_SECRET="placeholder_update_in_paymob_dashboard"

###############################################################################
# FINTECH WEBHOOK SECRETS
###############################################################################
FACTOR_WEBHOOK_SECRET="${FACTOR_WEBHOOK_SECRET}"

###############################################################################
# EMAIL CONFIGURATION (Update with real SMTP credentials)
###############################################################################
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@hotelsvendors.com"
SMTP_PASS="placeholder_update_email_password"
FROM_EMAIL="noreply@hotelsvendors.com"
CONTACT_EMAIL="support@hotelsvendors.com"

###############################################################################
# ETA (Egypt Tax Authority) - Update with real credentials
###############################################################################
ETA_CLIENT_ID="placeholder_update_eta_client_id"
ETA_CLIENT_SECRET="placeholder_update_eta_secret"
ETA_API_URL="https://api.invoicing.eta.gov.eg"
ETA_CERTIFICATE_PATH="/etc/ssl/eta/certificate.pem"

###############################################################################
# OLLAMA LOCAL LLM CONFIGURATION
###############################################################################
OLLAMA_API_URL="http://localhost:11434"
OLLAMA_MODEL_DEFAULT="llama3"
OLLAMA_MODEL_FALLBACK="mistral"
LLM_PROVIDER="ollama"

###############################################################################
# KIMI AI API (Optional - for enhanced responses)
###############################################################################
KIMI_API_KEY="placeholder_update_kimi_key"
KIMI_API_URL="https://api.moonshot.cn/v1"

###############################################################################
# SECURITY & FEATURE FLAGS
###############################################################################
ENABLE_RATE_LIMITING=true
ENABLE_2FA=true
ENABLE_AUDIT_LOGGING=true
MAX_UPLOAD_SIZE="50MB"

###############################################################################
# MONITORING & LOGGING
###############################################################################
LOG_LEVEL="info"
LOG_FORMAT="json"
SENTRY_DSN="placeholder_update_sentry_dsn"

###############################################################################
# UPSTASH RATE LIMITING (Optional)
###############################################################################
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

###############################################################################
# VAULT CONFIGURATION
###############################################################################
VAULT_ADDR="https://vault.hotelsvendors.com:8200"
VAULT_TOKEN="placeholder_update_vault_token"
ENCRYPTION_KEY="${ENCRYPTION_KEY}"
ENVEOF

# Escape special characters for sed
DB_PASSWORD_ESCAPED=$(echo "$DB_PASSWORD" | sed 's/[&\/]/\\&/g')
REDIS_PASSWORD_ESCAPED=$(echo "$REDIS_PASSWORD" | sed 's/[&\/]/\\&/g')

# Replace placeholders in .env file
sed -i "s/\${DB_PASSWORD_ESCAPED}/$DB_PASSWORD_ESCAPED/g" $APP_DIR/.env
sed -i "s/\${REDIS_PASSWORD_ESCAPED}/$REDIS_PASSWORD_ESCAPED/g" $APP_DIR/.env
sed -i "s/\${JWT_SECRET}/$JWT_SECRET/g" $APP_DIR/.env
sed -i "s/\${NEXTAUTH_SECRET}/$NEXTAUTH_SECRET/g" $APP_DIR/.env
sed -i "s/\${SESSION_SECRET}/$SESSION_SECRET/g" $APP_DIR/.env
sed -i "s/\${FACTOR_WEBHOOK_SECRET}/$FACTOR_WEBHOOK_SECRET/g" $APP_DIR/.env
sed -i "s/\${ENCRYPTION_KEY}/$ENCRYPTION_KEY/g" $APP_DIR/.env

# Set permissions on .env
chmod 600 $APP_DIR/.env
chown www-data:www-data $APP_DIR/.env

log_success "Environment file created at $APP_DIR/.env"
log_warn "IMPORTANT: Update placeholder values for Stripe, Paymob, SMTP, and ETA credentials!"

echo ""

###############################################################################
# STEP 4: DATABASE SETUP
###############################################################################
log_info "Step 4/10: Setting up Database..."

# Install PostgreSQL if not present
if ! command_exists psql; then
    log_warn "PostgreSQL not found. Installing..."
    apt-get update -qq
    apt-get install -y -qq postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
    log_success "PostgreSQL installed"
fi

# Configure PostgreSQL
log_info "Configuring PostgreSQL..."
su - postgres -c "psql <<EOF
-- Create database if not exists
SELECT 'CREATE DATABASE hotelsvendors_prod' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hotelsvendors_prod')\gexec

-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'hv_prod') THEN
        CREATE USER hv_prod WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';
    ELSE
        ALTER USER hv_prod WITH PASSWORD '${DB_PASSWORD}';
    END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hotelsvendors_prod TO hv_prod;
ALTER DATABASE hotelsvendors_prod OWNER TO hv_prod;

-- Connect to database and grant schema privileges
\c hotelsvendors_prod
GRANT ALL ON SCHEMA public TO hv_prod;
ALTER SCHEMA public OWNER TO hv_prod;
EOF"

# Update pg_hba.conf for local connections
PG_HBA=$(find /etc/postgresql -name "pg_hba.conf" 2>/dev/null | head -1)
if [ -n "$PG_HBA" ]; then
    # Allow local connections with md5
    if ! grep -q "hotelsvendors_prod" "$PG_HBA"; then
        echo "local   hotelsvendors_prod   hv_prod                 md5" >> "$PG_HBA"
    fi
    systemctl restart postgresql
fi

log_success "Database configured"

# Run Prisma migrations
log_info "Running Prisma migrations..."
cd $APP_DIR
export DATABASE_URL="postgresql://hv_prod:${DB_PASSWORD}@localhost:5432/hotelsvendors_prod?schema=public"
npx prisma migrate deploy
log_success "Database migrations completed"

# Seed database with Egyptian market data
log_info "Seeding database with Egyptian market data..."
cd $APP_DIR
# Check if seed script exists
if [ -f "prisma/seed.ts" ]; then
    npx prisma db seed
    log_success "Database seeded"
else
    log_warn "Seed script not found, skipping seed step"
fi

echo ""

###############################################################################
# STEP 5: OLLAMA INTEGRATION
###############################################################################
log_info "Step 5/10: Configuring Ollama..."

# Configure Ollama service
cat > /etc/systemd/system/ollama.service << 'OLLAMAEOL'
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="HOME=/usr/share/ollama"
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_ORIGINS=https://hotelsvendors.com,https://www.hotelsvendors.com"

[Install]
WantedBy=default.target
OLLAMAEOL

# Create ollama user if not exists
if ! id "ollama" &>/dev/null; then
    useradd -r -s /bin/false -m -d /usr/share/ollama ollama
fi

# Reload systemd and restart Ollama
systemctl daemon-reload
systemctl enable ollama
systemctl restart ollama

# Wait for Ollama to be ready
log_info "Waiting for Ollama service to be ready..."
sleep 5
for i in {1..30}; do
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        log_success "Ollama is ready"
        break
    fi
    sleep 2
done

# Pull required models
log_info " Pulling Ollama models (this may take several minutes)..."
ollama pull llama3 || log_warn "Failed to pull llama3 model"
ollama pull mistral || log_warn "Failed to pull mistral model"

log_success "Ollama configured with models"

echo ""

###############################################################################
# STEP 6: PM2 CONFIGURATION
###############################################################################
log_info "Step 6/10: Configuring PM2..."

# Create log directory
mkdir -p $PM2_LOG_DIR
chown -R www-data:www-data $PM2_LOG_DIR

# Build Next.js application
log_info "Building Next.js application..."
cd $APP_DIR
npm run build
log_success "Next.js build completed"

# Create PM2 ecosystem configuration
cat > $APP_DIR/ecosystem.config.js << PM2EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '${APP_DIR}',
    instances: ${PM2_INSTANCES},
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: ${APP_PORT},
      NODE_OPTIONS: '--max-old-space-size=4096'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: ${APP_PORT}
    },
    // Memory and process management
    max_memory_restart: '${PM2_MEMORY_LIMIT}',
    restart_delay: 3000,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Auto-restart on failure
    autorestart: true,
    
    // Logging
    error_file: '${PM2_LOG_DIR}/${APP_NAME}-error.log',
    out_file: '${PM2_LOG_DIR}/${APP_NAME}-out.log',
    log_file: '${PM2_LOG_DIR}/${APP_NAME}-combined.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // PM2 monitoring
    pmx: true,
    
    // Source map support for debugging
    source_map_support: true
  }]
};
PM2EOF

chown www-data:www-data $APP_DIR/ecosystem.config.js
log_success "PM2 ecosystem configuration created"

echo ""

###############################################################################
# STEP 7: NGINX CONFIGURATION
###############################################################################
log_info "Step 7/10: Configuring Nginx..."

# Create Nginx server block
cat > /etc/nginx/sites-available/${APP_NAME} << 'NGINXEOL'
# Upstream for Next.js application
upstream hotelsvendors_backend {
    least_conn;
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    keepalive 64;
}

# Map to determine caching based on request method
map $request_method $no_cache {
    default 1;
    GET     $http_pragma;
}

server {
    listen 80;
    listen [::]:80;
    server_name hotelsvendors.com www.hotelsvendors.com;
    
    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name hotelsvendors.com www.hotelsvendors.com;
    
    # Root directory
    root /var/www/hotelsvendors/public;
    index index.html;
    
    # SSL Configuration (certificates added by certbot)
    ssl_certificate /etc/letsencrypt/live/hotelsvendors.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hotelsvendors.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/hotelsvendors.com/chain.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.gstatic.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: *.hotelsvendors.com; font-src 'self' *.gstatic.com; connect-src 'self' *.hotelsvendors.com ws: wss:; frame-ancestors 'self'; base-uri 'self';" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
    
    # Client body size (for uploads)
    client_max_body_size 50M;
    
    # Rate limiting zone (requires nginx-module-limit-req)
    # limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # Static assets - Next.js has versioned files
    location /_next/static {
        alias /var/www/hotelsvendors/.next/static;
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
    }
    
    # Public folder files
    location /static {
        alias /var/www/hotelsvendors/public;
        expires 1y;
        access_log off;
        add_header Cache-Control "public";
    }
    
    # WebSocket support for real-time features
    location /_next/webpack-hmr {
        proxy_pass http://hotelsvendors_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
    
    # SSE endpoint - no buffering
    location /api/v1/admin/pulse {
        proxy_pass http://hotelsvendors_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://hotelsvendors_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # API rate limiting
        # limit_req zone=api burst=20 nodelay;
    }
    
    # Main application - reverse proxy
    location / {
        proxy_pass http://hotelsvendors_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Cache HTML for short time
        proxy_cache_valid 200 5m;
    }
    
    # Health check endpoint
    location /api/health {
        proxy_pass http://hotelsvendors_backend;
        access_log off;
    }
    
    # Robots.txt
    location /robots.txt {
        alias /var/www/hotelsvendors/public/robots.txt;
        access_log off;
    }
    
    # Favicon
    location /favicon.ico {
        alias /var/www/hotelsvendors/public/favicon.ico;
        access_log off;
    }
}
NGINXEOL

# Enable site
ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/${APP_NAME}
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t && log_success "Nginx configuration valid" || (log_error "Nginx configuration failed"; exit 1)

echo ""

###############################################################################
# STEP 8: SSL CERTIFICATE
###############################################################################
log_info "Step 8/10: Configuring SSL Certificate..."

# Install Certbot if not present
if ! command_exists certbot; then
    log_warn "Certbot not found. Installing..."
    apt-get update -qq
    apt-get install -y -qq certbot python3-certbot-nginx
    log_success "Certbot installed"
fi

# Create webroot for certbot
mkdir -p /var/www/certbot

# Generate certificate
if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    log_info "Generating Let's Encrypt certificate for ${DOMAIN}..."
    certbot certonly --webroot -w /var/www/certbot -d ${DOMAIN} -d ${WWW_DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} || {
        log_warn "Certbot failed. Using self-signed certificate temporarily..."
        mkdir -p /etc/ssl/private
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/ssl/private/${APP_NAME}.key \
            -out /etc/ssl/certs/${APP_NAME}.crt \
            -subj "/C=EG/ST=Cairo/L=Cairo/O=HotelsVendors/CN=${DOMAIN}"
        
        # Update Nginx config with self-signed cert paths
        sed -i "s|/etc/letsencrypt/live/hotelsvendors.com/fullchain.pem|/etc/ssl/certs/${APP_NAME}.crt|g" /etc/nginx/sites-available/${APP_NAME}
        sed -i "s|/etc/letsencrypt/live/hotelsvendors.com/privkey.pem|/etc/ssl/private/${APP_NAME}.key|g" /etc/nginx/sites-available/${APP_NAME}
        sed -i "s|/etc/letsencrypt/live/hotelsvendors.com/chain.pem|/etc/ssl/certs/${APP_NAME}.crt|g" /etc/nginx/sites-available/${APP_NAME}
    }
else
    log_success "SSL certificate already exists"
fi

# Setup auto-renewal cron job
if [ ! -f "/etc/cron.d/certbot-renewal" ]; then
    echo "0 3 * * * root certbot renew --quiet && systemctl reload nginx" > /etc/cron.d/certbot-renewal
    chmod 644 /etc/cron.d/certbot-renewal
    log_success "SSL auto-renewal cron job configured"
fi

# Restart Nginx
systemctl restart nginx
log_success "Nginx restarted with SSL configuration"

echo ""

###############################################################################
# STEP 9: SERVICE MANAGEMENT
###############################################################################
log_info "Step 9/10: Managing Services..."

# Stop existing PM2 process if running
pm2 delete ${APP_NAME} >/dev/null 2>&1 || true

# Start application with PM2
cd $APP_DIR
export $(cat $APP_DIR/.env | xargs) 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

# Setup PM2 startup script
pm2 startup systemd -u www-data --hp /var/www >/dev/null 2>&1 || pm2 startup systemd
log_success "PM2 configured with startup script"

# Reload services
systemctl daemon-reload

# Start/Restart Redis
systemctl restart redis-server
systemctl enable redis-server
log_success "Redis service configured"

echo ""

###############################################################################
# STEP 10: HEALTH CHECKS
###############################################################################
log_info "Step 10/10: Running Health Checks..."

# Function to check service status
check_service() {
    if systemctl is-active --quiet "$1"; then
        log_success "$1 is running"
        return 0
    else
        log_error "$1 is not running"
        return 1
    fi
}

# Check services
check_service nginx
check_service postgresql
check_service redis-server
check_service ollama

# Check PM2 status
pm2_status=$(pm2 list | grep -c "online" || echo "0")
if [ "$pm2_status" -ge 1 ]; then
    log_success "PM2 processes are running"
else
    log_warn "PM2 processes may need attention"
fi

# Test API endpoints
log_info "Testing API endpoints..."

# Wait for app to start
sleep 5

# Test HTTP endpoint
if curl -s -o /dev/null -w "%{http_code}" http://localhost:${APP_PORT}/api/health 2>/dev/null | grep -q "200"; then
    log_success "Application API is responding"
else
    log_warn "Application API check failed - app may still be starting"
fi

# Test Ollama endpoint
if curl -s http://localhost:${OLLAMA_PORT}/api/tags >/dev/null 2>&1; then
    log_success "Ollama API is responding"
    # Display available models
    models=$(curl -s http://localhost:${OLLAMA_PORT}/api/tags 2>/dev/null | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | tr '\n' ', ')
    log_info "Available Ollama models: ${models%,}"
else
    log_warn "Ollama API check failed"
fi

# Test database connection
if su - postgres -c "psql -d ${DB_NAME} -c 'SELECT 1;'" >/dev/null 2>&1; then
    log_success "Database connection successful"
else
    log_warn "Database connection check had issues"
fi

# Test Redis connection
if redis-cli -a "${REDIS_PASSWORD}" ping 2>/dev/null | grep -q "PONG"; then
    log_success "Redis connection successful"
else
    log_warn "Redis connection check had issues (may need password)"
fi

# Test external HTTPS access
log_info "Testing external HTTPS access..."
if command_exists curl; then
    EXTERNAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://${DOMAIN}" 2>/dev/null || echo "000")
    if [ "$EXTERNAL_STATUS" = "200" ] || [ "$EXTERNAL_STATUS" = "301" ] || [ "$EXTERNAL_STATUS" = "302" ]; then
        log_success "External HTTPS access is working (Status: $EXTERNAL_STATUS)"
    else
        log_warn "External HTTPS check returned status: $EXTERNAL_STATUS (this is normal on first deploy)"
    fi
fi

echo ""

###############################################################################
# DEPLOYMENT COMPLETE
###############################################################################
echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║                     DEPLOYMENT COMPLETED SUCCESSFULLY!                 ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Application:${NC}     https://${DOMAIN}"
echo -e "${GREEN}Server IP:${NC}       ${SERVER_IP}"
echo -e "${GREEN}App Directory:${NC}   ${APP_DIR}"
echo -e "${GREEN}PM2 Processes:${NC}   ${PM2_INSTANCES} instances"
echo -e "${GREEN}Memory Limit:${NC}   ${PM2_MEMORY_LIMIT} per instance"
echo -e "${GREEN}Log Directory:${NC}  ${PM2_LOG_DIR}"
echo ""
echo -e "${YELLOW}IMPORTANT NEXT STEPS:${NC}"
echo "  1. Update Stripe keys in $APP_DIR/.env"
echo "  2. Update Paymob API credentials in $APP_DIR/.env"
echo "  3. Update SMTP credentials in $APP_DIR/.env"
echo "  4. Update ETA credentials in $APP_DIR/.env (for Egyptian market)"
echo "  5. Restart PM2 after updating env: pm2 restart ${APP_NAME}"
echo ""
echo -e "${YELLOW}USEFUL COMMANDS:${NC}"
echo "  pm2 status                    - View process status"
echo "  pm2 logs ${APP_NAME}          - View application logs"
echo "  pm2 restart ${APP_NAME}       - Restart application"
echo "  pm2 reload ${APP_NAME}        - Zero-downtime reload"
echo "  tail -f ${PM2_LOG_DIR}/*.log  - View all PM2 logs"
echo "  nginx -t                      - Test Nginx config"
echo "  systemctl restart nginx       - Restart Nginx"
echo "  ollama list                   - List AI models"
echo ""
echo -e "${YELLOW}DATABASE CREDENTIALS (SAVE THESE):${NC}"
echo "  Database: ${DB_NAME}"
echo "  User:     ${DB_USER}"
echo "  Password: ${DB_PASSWORD}"
echo ""
echo -e "${GREEN}Deployment completed at: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo ""
