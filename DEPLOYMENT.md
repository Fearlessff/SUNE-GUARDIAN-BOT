# Deployment Guide

## Running Locally (Development)

Perfect for testing and development:

```bash
npm install
npm start
```

Keep your terminal open. Press `Ctrl+C` to stop the bot.

## Running on a Server

### Option 1: VPS (Recommended)

Deploy on any VPS provider (DigitalOcean, Linode, Vultr, AWS EC2, etc.)

**Requirements:**
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- At least 512MB RAM

**Steps:**

1. SSH into your server:
```bash
ssh user@your-server-ip
```

2. Install Node.js (if not already installed):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Clone or upload your bot code:
```bash
git clone your-repo-url
cd your-bot-directory
```

4. Install dependencies:
```bash
npm install
```

5. Configure environment:
```bash
nano .env
# Add your TELEGRAM_BOT_TOKEN
# Save with Ctrl+X, then Y, then Enter
```

6. Install PM2 (process manager):
```bash
sudo npm install -g pm2
```

7. Start the bot with PM2:
```bash
pm2 start index.js --name sune-bot
```

8. Make it auto-start on reboot:
```bash
pm2 startup
pm2 save
```

**Useful PM2 Commands:**
```bash
pm2 status          # Check bot status
pm2 logs sune-bot   # View logs
pm2 restart sune-bot # Restart bot
pm2 stop sune-bot   # Stop bot
```

### Option 2: Railway.app (Easy Deploy)

Railway offers free tier with simple deployment:

1. Create account at [Railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Connect your GitHub repository
4. Add environment variables in Railway dashboard:
   - `TELEGRAM_BOT_TOKEN`
   - Copy all Supabase variables from your `.env`
5. Railway will auto-deploy and keep bot running

### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create sune-bot`
4. Set environment variables:
```bash
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
```
5. Deploy:
```bash
git push heroku main
```

Add a `Procfile` first:
```
worker: node index.js
```

### Option 4: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["node", "index.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  sune-bot:
    build: .
    restart: always
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUNE_CONTRACT_ADDRESS=${SUNE_CONTRACT_ADDRESS}
      - SUNE_TWITTER=${SUNE_TWITTER}
      - SUNE_TELEGRAM=${SUNE_TELEGRAM}
```

Run with:
```bash
docker-compose up -d
```

## Keeping the Bot Running 24/7

### Using PM2 (Recommended)

PM2 automatically restarts your bot if it crashes:

```bash
pm2 start index.js --name sune-bot
pm2 startup  # Enable auto-start on server reboot
pm2 save     # Save current process list
```

### Using systemd (Linux)

Create `/etc/systemd/system/sune-bot.service`:

```ini
[Unit]
Description=SUNE Guardian Bot
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/your/bot
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable sune-bot
sudo systemctl start sune-bot
sudo systemctl status sune-bot
```

## Monitoring

### Check if bot is running

**With PM2:**
```bash
pm2 status
pm2 logs sune-bot
```

**With systemd:**
```bash
sudo systemctl status sune-bot
sudo journalctl -u sune-bot -f
```

### Set up alerts

Consider using:
- **UptimeRobot** - Free website monitoring (ping a health check endpoint)
- **PM2 Plus** - Advanced PM2 monitoring with alerts
- **Telegram Bot API** - Monitor via Telegram's webhook info

## Backup Strategy

Your bot data is stored in Supabase, which handles backups automatically.

For bot configuration:
1. Keep `.env` backed up securely (but not in git!)
2. Document any custom modifications
3. Use version control (git) for code

## Updating the Bot

### On VPS with PM2:

```bash
git pull  # or upload new files
npm install  # if dependencies changed
pm2 restart sune-bot
```

### On Railway/Heroku:

Just push to your git repository - auto-deploys!

```bash
git push origin main
```

## Troubleshooting

### Bot stops responding
```bash
pm2 restart sune-bot
# or
sudo systemctl restart sune-bot
```

### Check logs for errors
```bash
pm2 logs sune-bot --lines 100
```

### Database connection issues
- Verify Supabase credentials in `.env`
- Check if Supabase project is active
- Ensure network allows outbound HTTPS

### High memory usage
- Normal usage: 50-150MB
- If higher: Restart bot or check for memory leaks
```bash
pm2 restart sune-bot
```

## Security Best Practices

1. **Never commit `.env` to git**
2. **Regularly update dependencies**: `npm update`
3. **Keep Node.js updated**: Check with `node --version`
4. **Use firewall**: Only expose necessary ports
5. **Regular backups**: Your Supabase data is backed up automatically
6. **Monitor logs**: Watch for suspicious activity

## Cost Estimates

**Free Tier Options:**
- Railway: 500 hours/month free
- Heroku: No longer offers free tier
- VPS: $5-10/month (DigitalOcean, Vultr)
- Supabase: 500MB database free

**Recommended Setup:**
- VPS: $5/month (DigitalOcean Droplet)
- Supabase: Free tier (sufficient for most bots)
- **Total: $5/month**

## Support

Need help with deployment?
- Check the main README.md
- Visit: https://t.me/SUNEsolana
- Twitter: https://x.com/thesunesolana

Keep shining! ☀️
