# Hotels Vendors — Deployment Guide

## Overview

This directory contains everything needed to deploy Hotels Vendors to Hostinger VPS.

## Files

| File | Purpose |
|---|---|
| `hostinger-deploy.sh` | Full automated deployment script for Ubuntu 22.04+ |
| `docker-compose.yml` | Alternative Docker-based deployment |
| `.env.example` | Production environment variables template |
| `nginx.conf` | Nginx reverse proxy configuration |
| `pm2-config.json` | PM2 process manager configuration |

## Quick Start

### Option 1: Automated Script (Recommended)

```bash
# On your Hostinger VPS
ssh ubuntu@your-vps-ip
cd /var/www
git clone https://github.com/your-org/hotels-vendors.git
cd hotels-vendors
chmod +x deploy/hostinger-deploy.sh
sudo ./deploy/hostinger-deploy.sh production
```

### Option 2: Manual Steps

```bash
# 1. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PostgreSQL
sudo apt-get install -y postgresql-14
sudo -u postgres psql -c "CREATE DATABASE hotelsvendors;"
sudo -u postgres psql -c "CREATE USER hv WITH ENCRYPTED PASSWORD 'your-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hotelsvendors TO hv;"

# 3. Install Redis
sudo apt-get install -y redis-server

# 4. Install dependencies
npm ci --legacy-peer-deps

# 5. Setup environment
cp deploy/.env.example .env
# Edit .env with your production values

# 6. Run migrations
npx prisma migrate deploy

# 7. Build
npm run build

# 8. Start with PM2
pm2 start deploy/pm2-config.json
pm2 save
pm2 startup
```

## Environment Variables

Copy `deploy/.env.example` to `.env` and fill in:

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `SESSION_SECRET` | JWT signing secret (64+ chars) | Yes |
| `ETA_CLIENT_ID` | Egyptian Tax Authority OAuth client ID | Yes |
| `ETA_CLIENT_SECRET` | Egyptian Tax Authority OAuth secret | Yes |
| `ETA_API_URL` | ETA API base URL | Yes |
| `PAYMOB_API_KEY` | Paymob payment gateway API key | Yes |
| `EFG_HERMES_API_KEY` | EFG Hermes factoring API key | Yes |
| `CONTACT_FACTORS_API_KEY` | Contact Factoring API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Public app URL (https://www.hotelsvendors.com) | Yes |

## SSL Certificate

The deployment script automatically sets up Let's Encrypt via Certbot. To renew manually:

```bash
sudo certbot renew --dry-run
```

Auto-renewal is configured via cron.

## Monitoring

### PM2 Status
```bash
pm2 status
pm2 logs hotelsvendors-production
```

### Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Database
```bash
sudo -u postgres psql hotelsvendors
```

### Redis
```bash
redis-cli ping
```

## Troubleshooting

| Issue | Solution |
|---|---|
| Build fails with peer deps | Run `npm ci --legacy-peer-deps` |
| Prisma generate fails | Run `npx prisma generate` after install |
| 502 Bad Gateway | Check PM2 is running: `pm2 restart all` |
| ETA API errors | Verify credentials in `.env` |
| Redis connection refused | Check `redis-server` is running |

## Rollback

```bash
# Rollback to previous deployment
pm2 stop hotelsvendors-production
git checkout <previous-commit>
npm ci --legacy-peer-deps
npm run build
pm2 start deploy/pm2-config.json
```

## Support

For deployment issues, contact the Integration Lead or The Auditor.
