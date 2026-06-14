/**
 * PM2 Production Ecosystem — HotelsVendors
 *
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 reload hotels-vendors      # zero-downtime reload
 *   pm2 logs hotels-vendors       # tail logs
 *   pm2 monit                     # CPU/memory dashboard
 *
 * Cluster mode: 1 worker per CPU core (adjust `instances` if needed).
 * Memory ceiling: 1.5 GB per worker — auto-restart if exceeded.
 */

module.exports = {
  apps: [
    {
      name: "hotelsvendors",
      script: "npm",
      args: "start",
      cwd: "/var/www/hotelsvendors-v2/current",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1500M",

      // Graceful shutdown — finish in-flight ETA callbacks before exit
      kill_timeout: 10000,
      listen_timeout: 8000,
      shutdown_with_message: true,

      // Production environment
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: "1",
      },

      // Logging
      log_file: "/var/log/hotels-vendors/combined.log",
      out_file: "/var/log/hotels-vendors/out.log",
      error_file: "/var/log/hotels-vendors/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // Restart strategy: exponential backoff
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
