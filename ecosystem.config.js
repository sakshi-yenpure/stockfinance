const isWindows = process.platform === 'win32';

module.exports = {
  apps: [
    {
      name: 'plutus-backend',
      script: 'manage.py',
      args: 'runserver 0.0.0.0:8000',
      cwd: './backend',
      interpreter: isWindows ? 'python' : 'python3',
      env: {
        NODE_ENV: 'development',
        DJANGO_SETTINGS_MODULE: 'backend.settings',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: './logs/backend-out.log',
      error_file: './logs/backend-error.log',
      combine_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'plutus-frontend',
      script: isWindows ? 'npm.cmd' : 'npm',
      args: 'start',
      cwd: './frontend',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: './logs/frontend-out.log',
      error_file: './logs/frontend-error.log',
      combine_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
