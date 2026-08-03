#!/bin/bash
# Hotels Vendors — Fixed Hostinger Deployment Script
# Simpler, more robust approach for deployment

set -e

ENV=${1:-staging}
DOMAIN="www.hotelsvendors.com"
STAGING_DOMAIN="staging.hotelsvendors.com"
DEPLOY_DOMAIN=$([ "$ENV" = "production" ] && echo "$DOMAIN" || echo "$STAGING_DOMAIN")
APP_DIR="/var/www/hotelsvendors"

# Simple, secure deployment

echo "═══════════════════════════════════════════════════"
echo "Hotels Vendors — Fixed Hostinger Deployment"
echo "Environment: $ENV"
echo "Domain: $DEPLOY_DOMAIN"
echo "═══════════════════════════════════════════════════"

# Validate environment
echo "Validating environment..."
if [[ "$ENV" != "staging" && "$ENV" != "production" ]]; then
  echo "Error: Environment must be 'staging' or 'production'"
  exit 1
fi

# Check if running as root or with sudo privileges
if [[ $EUID -eq 0 ]]; then
  echo "Running as root - proceeding with deployment..."
else
  echo "Warning: Running as non-root user. Some operations may fail."
fi

# Create application directory
mkdir -p $APP_DIR
chown $(whoami):$(whoami) $APP_DIR

# Copy application to server
echo "Copying application to server..."
cat /dev/stdin | tar -xz -C $APP_DIR

# Setup PM2
if command -v pm2 &> /dev/null; then
  echo "PM2 found, setting up..."
  cd $APP_DIR
  npm install --legacy-peer-deps 2>/dev/null || npm ci --legacy-peer-deps

  # Generate Prisma client if needed
  npx prisma generate 2>/dev/null || echo "Prisma client not needed or already generated"

  # Build the application
  echo "Building Next.js application..."
  npm run build

  # Setup ecosystem config
  cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'hotelsvendors-' + process.env.NODE_ENV,
    script: 'next',
    args: 'start',
    cwd: process.cwd(),
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: process.env.NODE_ENV || 'staging',
      PORT: 3000,
      HOSTINGER_ENV: process.env.NODE_ENV || 'staging'
    },
    error_file: '/var/log/hotelsvendors/error.log',
    out_file: '/var/log/hotelsvendors/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    max_memory_restart: '512M',
    restart_delay: 3000,
  }]
};
EOL

  # Setup system service
  if command -v systemctl &> /dev/null; then
    echo "Setting up systemd service..."
    cat > /etc/systemd/system/hotelsvendors.service << EOL
[Unit]
Description=Hotels Vendors Application
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=${ENV}
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOL

    systemctl daemon-reload
    systemctl enable hotelsvendors.service
    systemctl restart hotelsvendors.service

    echo "Application deployed and started via systemd"
  else
    echo "Systemd not available, attempting alternative startup method"
    pm2 start ecosystem.config.js --name hotelsvendors
    pm2 save
  fi
else
  echo "PM2 not found, installation required"
  echo "Please run: npm install -g pm2"
  exit 1
fi

echo "✓ Deployment completed successfully!"
echo "Application URL: https://${DEPLOY_DOMAIN}"
