#!/bin/bash
# Hotels Vendors — Swarm Deployment Script
# Run this on the VPS to deploy the latest swarm fixes

set -e

echo "🐝 Hotels Vendors Swarm Deployment"
echo "==================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.swarm.yml" ]; then
  echo "❌ Error: docker-compose.swarm.yml not found"
  echo "   Run this script from the hotels-vendors project root"
  exit 1
fi

# Pull latest code (if git repo)
if [ -d ".git" ]; then
  echo "📥 Pulling latest code..."
  git pull origin main || git pull origin master || echo "⚠️ Could not pull, using local files"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Build the app
echo "🔨 Building Next.js app..."
npm run build

# Deploy with Docker Compose
echo "🐳 Deploying swarm stack..."
docker compose -f docker-compose.swarm.yml down
docker compose -f docker-compose.swarm.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 15

# Check health
echo "🏥 Health check..."
curl -s http://localhost:3000/api/health || echo "⚠️ App health check failed"
curl -s http://localhost:3000/api/v1/swarm/health || echo "⚠️ Swarm health check failed"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Services:"
docker compose -f docker-compose.swarm.yml ps
echo ""
echo "To view logs:"
echo "  docker compose -f docker-compose.swarm.yml logs -f swarm-worker"
echo "  docker compose -f docker-compose.swarm.yml logs -f app"
echo ""
echo "To trigger a mission:"
echo "  curl -X POST http://localhost:3000/api/v1/swarm/orchestrate \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -H 'Cookie: session=YOUR_SESSION' \\"
echo "    -d '{\"task\":\"Build RFQ flow with Authority Matrix\"}'"
