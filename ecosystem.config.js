module.exports = {
  apps: [
    {
      name: 'restaurant-app',
      script: 'server.js',
      cwd: './.next/standalone',
      instances: 2,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: 'localhost'
      },
      error_file: '../../logs/pm2-error.log',
      out_file: '../../logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      kill_timeout: 5000
    }
  ]
};
