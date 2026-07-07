#!/bin/bash
# Hostinger Git Deployment Script
# This runs automatically after git pull on Hostinger's server

set -e

echo "🚀 Starting deployment..."

# Navigate to project directory (Hostinger sets this automatically)
cd "$(dirname "$0")/.."

echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting PM2 process..."
if pm2 list | grep -q "hotelsvendors"; then
  pm2 reload ecosystem.config.js --env production
else
  pm2 start ecosystem.config.js --env production
fi

pm2 save

echo "✅ Deployment complete!"
echo "📋 PM2 status:"
pm2 status