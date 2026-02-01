# Quick Start Guide

Get your SUNE Guardian Bot running in 5 minutes!

## Step 1: Create Your Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` to BotFather
3. Choose a name (e.g., "SUNE Guardian")
4. Choose a username (must end in 'bot', e.g., "sune_guardian_bot")
5. Copy the bot token BotFather gives you

## Step 2: Configure the Bot

1. Open the `.env` file in this project
2. Replace `your_bot_token_here` with your actual token:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

## Step 3: Start the Bot

```bash
npm start
```

You should see:
```
🌞 SUNE Guardian Bot is running!
Bot is ready to shine! ☀️
```

## Step 4: Test the Bot

1. Open Telegram and find your bot (search for the username you created)
2. Send `/start` to your bot
3. Try some commands:
   - `/price` - Check $SUNE price
   - `/contract` - View contract info
   - `/help` - See all commands

## Step 5: Set Yourself as Admin

First, you need to get your Telegram user ID:

1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. It will reply with your user ID (a number like `123456789`)

Then, add yourself as admin in the database:

You can do this by sending a message to your bot, then checking the `users` table in your Supabase dashboard and setting `is_admin` to `true` for your user.

Or use the SQL editor in Supabase:

```sql
UPDATE users SET is_admin = true WHERE id = YOUR_USER_ID;
```

Replace `YOUR_USER_ID` with your actual Telegram user ID.

## Step 6: Add Bot to Your Group

1. Create a Telegram group or use an existing one
2. Add your bot to the group (Add Members > search for your bot)
3. Make the bot an admin:
   - Group Settings > Administrators > Add Administrator
   - Select your bot
   - Enable permissions: Delete Messages, Ban Users, Invite Users

## Step 7: Test Admin Commands

In your group:

1. Create a test raid:
```
/createraid
Test Raid
https://x.com/thesunesolana/status/123
This is a test raid!
10
```

2. View the raid:
```
/raid
```

3. Try moderation (reply to a message):
```
/warn Testing the warning system
```

## Common Commands Reference

### For All Users
- `/price` - Current $SUNE price
- `/chart` - View charts
- `/raid` - Join active raids
- `/leaderboard` - Top earners
- `/mystats` - Your statistics
- `/gm` - Morning greeting
- `/spin` - Lucky spin (1hr cooldown)
- `/trivia` - Answer trivia for points

### For Admins
- `/createraid` - Create new raid
- `/approveraid` - Review submissions
- `/warn` - Warn user (reply to message)
- `/mute` - Mute user (reply to message)
- `/ban` - Ban user (reply to message)
- `/setadmin` - Make user admin (reply to message)
- `/raidmode` - Toggle raid protection

## Troubleshooting

### Bot doesn't respond
- Check that the bot token is correct in `.env`
- Make sure the bot is running (you should see the startup message)
- Verify you've sent `/start` to the bot first

### Commands don't work in group
- Make sure the bot is an admin in the group
- Check that the bot has the right permissions

### Database errors
- Verify Supabase is configured correctly
- Check the console for error messages

### Price command shows errors
- The bot uses DexScreener API which is free
- If it fails, it might be a network issue or API rate limit

## Next Steps

1. **Customize welcome message**: Edit `bot_config` table in Supabase
2. **Create your first real raid**: Use `/createraid` with a real Twitter link
3. **Set up more admins**: Use `/setadmin` (reply to their message)
4. **Promote the bot**: Let your community know about the new features!

## Need Help?

- Check the full README.md for detailed documentation
- Visit: https://t.me/SUNEsolana
- Twitter: https://x.com/thesunesolana

Keep shining! ☀️
