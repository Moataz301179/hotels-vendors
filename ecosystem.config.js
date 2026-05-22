module.exports = {
  apps: [{
    name: 'hotelsvendors',
    script: './.next/standalone/hotelsvendors-v2/server.js',
    cwd: '/var/www/hotelsvendors-v2',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    error_file: '/var/log/hotelsvendors/error.log',
    out_file: '/var/log/hotelsvendors/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '512M',
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 3000,
    kill_timeout: 5000,
    listen_timeout: 10000,
    wait_ready: true,
    // Graceful shutdown
    shutdown_with_message: true,
    // Health monitoring
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
