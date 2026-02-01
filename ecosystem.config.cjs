const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

module.exports = {
  apps: [{
    name: 'sune-guardian-bot',
    script: './index.js',
    interpreter: 'node',
    cwd: '/root/SUNE-GUARDIAN-BOT',
    env: {
      NODE_ENV: 'production',
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      SUNE_CONTRACT_ADDRESS: process.env.SUNE_CONTRACT_ADDRESS,
      SUNE_TWITTER: process.env.SUNE_TWITTER,
      SUNE_TELEGRAM: process.env.SUNE_TELEGRAM,
      MAX_WARNINGS: process.env.MAX_WARNINGS || '3',
      SPAM_THRESHOLD: process.env.SPAM_THRESHOLD || '5',
      CAPTCHA_TIMEOUT: process.env.CAPTCHA_TIMEOUT || '300000',
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
