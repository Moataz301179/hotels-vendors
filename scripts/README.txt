HotelsVendors Self-Healing Deployment Package
==============================================

1. Copy these files to /var/www/hotelsvendors-v2/scripts/
2. chmod +x *.sh
3. Start monitor: nohup ./health-monitor.sh &
4. Check state: ./session-recovery.sh

The health monitor will:
- Auto-restart the app if PM2 shows it offline
- Rebuild if health endpoint returns non-200
- Log everything to /var/log/hv-health.log

The session recovery script shows current state
so any AI assistant can resume without repeating work.
