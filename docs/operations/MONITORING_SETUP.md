# Monitoring & Sentry Setup

**Status:** Ready for configuration

## Sentry Error Tracking

The project already has @sentry/nextjs installed. Configure:

1. Get your DSN from sentry.io
2. Set `SENTRY_DSN` in production environment
3. Set `SENTRY_AUTH_TOKEN` for source map upload
4. Configure alert channels (Slack, email, PagerDuty)

### Alert Thresholds
| Event | Threshold | Action |
|-------|-----------|--------|
| HTTP 5xx errors | >5 in 5 min | Notify engineering channel |
| Auth failures | >20 in 5 min | Security alert + rate limit check |
| Payment failures | Any | Immediate investigation |
| Performance degradation | p95 > 2s | Performance review |

## Uptime Monitoring

Recommended: BetterStack or UptimeRobot

### Endpoints to Monitor
- `https://hotelsvendors.com/api/health` (main app health)
- `https://invo.hotelsvendors.com/api/v1/invo/health` (INVO health)
- Database connectivity (TCP on PostgreSQL port)
- SSL certificate expiry (30-day warning)

## Log Management

Logs are stored at `/var/log/hotels-vendors/` via PM2.
Consider shipping logs to a central platform (BetterStack Logs, Logtail, or ELK).

## Performance Monitoring
- Vercel Analytics (if deployed on Vercel)
- Core Web Vitals tracking
- API route latency tracking
---
*Configure after Sentry DSN is obtained.*
