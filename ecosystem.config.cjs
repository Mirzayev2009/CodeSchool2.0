module.exports = {
  apps: [{
    name: 'codeschool',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Restart delay
    restart_delay: 4000,
    // Max restarts within 1 minute
    max_restarts: 10,
    min_uptime: '10s',
    // Exponential backoff restart delay
    exp_backoff_restart_delay: 100
  }]
};