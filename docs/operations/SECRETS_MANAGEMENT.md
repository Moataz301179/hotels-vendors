# Secrets Management

**Status:** Action Required

## Current State
⚠️ API keys for Kimi (Moonshot) and xAI (Grok) are stored in plaintext in .env files.

## Recommended Approach

### Option 1: Environment Variables (Production)
For VPS/PM2 deployment, set env vars in the system environment or PM2 ecosystem.config.js:
```
# /etc/environment or PM2 ecosystem
ETA_CLIENT_ID=your_value
ETA_CLIENT_SECRET=your_value
SENTRY_DSN=your_dsn
RESEND_API_KEY=your_key
```
Secure with: `chmod 600 /etc/environment`

### Option 2: Secrets Manager (Recommended)
Use a secrets management service:
- **Doppler**: Simple, team-friendly, free tier available
- **AWS Secrets Manager** or **GCP Secret Manager**: If deploying on cloud
- **Infisical**: Open-source, self-hostable

### Option 3: Encrypted .env
```bash
# Encrypt
gpg --symmetric --cipher-algo AES256 .env.production
# Decrypt for deployment
gpg --decrypt .env.production.gpg > .env
```

## Required Secrets for Production
| Secret | Source | Status |
|--------|--------|--------|
| DATABASE_URL | Supabase/Neon/Docker | Requires setup |
| SESSION_SECRET | Generate random string | Configured (dev value) |
| ETA_CLIENT_ID | ETA Portal | ⚪ EMPTY |
| ETA_CLIENT_SECRET | ETA Portal | ⚪ EMPTY |
| ETA_ENCRYPTION_KEY | Generate secure key | ⚪ EMPTY |
| PAYMOB_API_KEY | Paymob Dashboard | ⚪ EMPTY |
| RESEND_API_KEY | Resend Dashboard | ⚪ EMPTY |
| SENTRY_DSN | Sentry Dashboard | ⚪ EMPTY |
| CLOUDFLARE_R2_* | Cloudflare Dashboard | ⚪ EMPTY |

## Plaintext Key Remediation
Remove these from .env and use env vars only:
- `KIMI_API_KEY`
- `XAI_API_KEY` / `GROK_API_KEY`
---
*Action required: Remove plaintext API keys from .env files.*
