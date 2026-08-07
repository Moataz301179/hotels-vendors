module.exports = {
  apps: [
    {
      name: "hotels-vendors",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/hotelsvendors-v2",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3003
      },
      error_file: "/var/log/hotelsvendors/error.log",
      out_file: "/var/log/hotelsvendors/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      max_memory_restart: "512M",
      restart_delay: 3000,
      max_restarts: 5,
      min_uptime: "10s",
      watch: false,
      kill_timeout: 5000,
      listen_timeout: 10000
    }
  ]
};
