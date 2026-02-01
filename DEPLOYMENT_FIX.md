# Fix PM2 Deployment Issues

## The Problem

PM2 wasn't loading your environment variables from the `.env` file, causing the "supabaseUrl is required" error.

## Quick Fix (On Your Server)

Run these commands on your server:

```bash
# Stop the current PM2 process
pm2 stop sune-guardian-bot
pm2 delete sune-guardian-bot

# Make sure you're in the right directory
cd /root/SUNE-GUARDIAN-BOT

# Verify .env file exists and has correct values
cat .env

# If .env is missing or incorrect, create it:
cat > .env << 'EOF'
TELEGRAM_BOT_TOKEN=8241243148:AAGxcdjGw7Wj1T_wDA-1kfwD7H_88cZz6u0

SUPABASE_URL=https://xsgotahiplriqxzefjmw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ290YWhpcGxyaXF4emVmam13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4OTIwNTUsImV4cCI6MjA4NTQ2ODA1NX0.PtZRmLCoc8CGR_YFQdFsevR_fGQmmIDmM_IBv3v0mNM

SUNE_CONTRACT_ADDRESS=7wv5FcDApP7DMXMNGmRRfJXeCQYFU3eMJsmX4mkgpump
SUNE_TWITTER=https://x.com/thesunesolana
SUNE_TELEGRAM=https://t.me/SUNEsolana

MAX_WARNINGS=3
SPAM_THRESHOLD=5
CAPTCHA_TIMEOUT=300000
EOF

# Pull latest code with ecosystem config
git pull

# Start with the ecosystem config file
pm2 start ecosystem.config.cjs

# Save the PM2 process list
pm2 save

# Check if it's running
pm2 status

# View logs
pm2 logs sune-guardian-bot --lines 50
```

## Alternative: Start Without PM2 Ecosystem

If the above doesn't work, use this simpler method:

```bash
# Stop any running instances
pm2 delete all

# Start with inline environment variables
pm2 start index.js --name sune-guardian-bot \
  --cwd /root/SUNE-GUARDIAN-BOT \
  --env TELEGRAM_BOT_TOKEN=8241243148:AAGxcdjGw7Wj1T_wDA-1kfwD7H_88cZz6u0 \
  --env SUPABASE_URL=https://xsgotahiplriqxzefjmw.supabase.co \
  --env SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ290YWhpcGxyaXF4emVmam13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4OTIwNTUsImV4cCI6MjA4NTQ2ODA1NX0.PtZRmLCoc8CGR_YFQdFsevR_fGQmmIDmM_IBv3v0mNM \
  --env SUNE_CONTRACT_ADDRESS=7wv5FcDApP7DMXMNGmRRfJXeCQYFU3eMJsmX4mkgpump \
  --env SUNE_TWITTER=https://x.com/thesunesolana \
  --env SUNE_TELEGRAM=https://t.me/SUNEsolana

# Save it
pm2 save
```

## Alternative: Use Start Script

```bash
# Make start.sh executable
chmod +x start.sh

# Start with PM2 using the start script
pm2 start start.sh --name sune-guardian-bot --interpreter bash

# Save it
pm2 save
```

## Verify It's Working

```bash
# Check PM2 status
pm2 status

# Should show:
# ┌─────┬──────────────────────┬─────────┬─────────┐
# │ id  │ name                 │ status  │ restart │
# ├─────┼──────────────────────┼─────────┼─────────┤
# │ 0   │ sune-guardian-bot    │ online  │ 0       │
# └─────┴──────────────────────┴─────────┴─────────┘

# View real-time logs
pm2 logs sune-guardian-bot

# Should show:
# 🌞 SUNE Guardian Bot is running!
# Bot is ready to shine! ☀️
```

## Common Issues

### Issue: "Cannot find module 'dotenv'"

```bash
cd /root/SUNE-GUARDIAN-BOT
npm install
pm2 restart sune-guardian-bot
```

### Issue: Still getting "supabaseUrl is required"

Test if environment variables are loaded:

```bash
pm2 env 0  # Replace 0 with your app ID from pm2 status
```

Should show all your environment variables. If not, try the "Alternative" methods above.

### Issue: Bot connects but commands don't work

1. Make sure you've set yourself as admin in the database
2. Test the bot in private message first with `/start`
3. Then test in the group

### Test Connection Manually

```bash
cd /root/SUNE-GUARDIAN-BOT

# Test if the bot can connect
node -e "
import('./database.js').then(db =>
  db.supabase.from('bot_config').select('*').limit(1).then(r =>
    console.log('Connection:', r.error ? 'FAILED: ' + r.error.message : 'SUCCESS')
  )
)
"
```

Should print: `Connection: SUCCESS`

## Success Indicators

When working correctly, you should see:

```bash
pm2 logs sune-guardian-bot
```

Output:
```
🌞 SUNE Guardian Bot is running!
Bot is ready to shine! ☀️
```

No errors in the logs, and the bot responds to commands in Telegram.

## Need More Help?

1. Check full logs: `pm2 logs sune-guardian-bot --lines 100`
2. Check if .env file exists: `cat /root/SUNE-GUARDIAN-BOT/.env`
3. Verify Node.js version: `node --version` (should be 18+)
4. Restart server if nothing works: `reboot`

Keep shining! ☀️
