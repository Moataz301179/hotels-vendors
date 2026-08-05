# PM2 Production Reference

Quick reference for managing the hotels-vendors PM2 process on the Hostinger VPS.

## Key Facts

- **PM2 app name:** `hotels-vendors`
- **Project dir on VPS:** `/var/www/hotelsvendors-v2`
- **Config:** `ecosystem.config.js` (fork, 1 instance, 1.5GB cap, autorestart)
- **Port:** 3003 (Nginx in front), domain `https://www.hotelsvendors.com`
- **Health check:** `https://www.hotelsvendors.com/api/health` → `200`

## Commands (run on the VPS via SSH)

```bash
ssh <HOSTINGER_USER>@<HOSTINGER_IP> "cd /var/www/hotelsvendors-v2 && pm2 status"
ssh <HOSTINGER_USER>@<HOSTINGER_IP> "pm2 logs hotels-vendors --lines 100"
ssh <HOSTINGER_USER>@<HOSTINGER_IP> "pm2 reload hotels-vendors"
ssh <HOSTINGER_USER>@<HOSTINGER_IP> "pm2 monit"
```

## Security Note

`HOSTINGER_USER`, `HOSTINGER_IP`, and `HOSTINGER_SSH_KEY` live as GitHub Actions secrets (see `.github/workflows/deploy.yml`). If a secret is missing locally, do not invent credentials — ask the user for the SSH details before running any SSH command.
