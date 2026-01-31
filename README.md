# SUNE Guardian Bot

A comprehensive Telegram bot for the $SUNE community, featuring raid coordination, moderation tools, crypto utilities, and community engagement features.

## Features

### Raid & Growth Tools
- **Active Raid System**: Create and manage Twitter/X raid campaigns
- **Proof Submission**: Users submit proof of raid participation
- **Admin Review**: Admins approve/reject raid submissions
- **Leaderboards**: Track top raiders and Sun Points earners
- **Automatic Rewards**: Points awarded upon raid approval

### Moderation & Security
- **Captcha System**: Protect against bots (ready to implement)
- **Anti-Spam**: Automatic spam detection and muting
- **Keyword Blacklist**: Auto-detect and remove scam messages
- **Warning System**: Progressive warnings with auto-ban
- **Raid Mode**: Lock chat during attacks
- **Admin Controls**: Warn, mute, unmute, and ban users

### Crypto Utilities
- **/price**: Real-time $SUNE price from DexScreener
- **/chart**: Quick access to DexScreener and Birdeye charts
- **/contract**: Verified contract address and links
- **/buy**: Direct links to Jupiter and Raydium DEXs
- **/holders**: View total holder count

### Community Features
- **Sun Points System**: Earn points through raids, trivia, and games
- **Polls**: Create community polls with visual results
- **Trivia**: Answer questions to earn points
- **Lucky Spin**: Hourly spin for bonus points
- **Personal Stats**: Track your community engagement
- **Welcome Messages**: Auto-greet new members

## Setup

### 1. Get a Telegram Bot Token

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the instructions
3. Save the bot token provided

### 2. Configure Environment Variables

Open `.env` and add your bot token:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

The Supabase database is already configured and ready to use.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Bot

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Usage

### User Commands

**Crypto & Info:**
- `/price` - Check current $SUNE price
- `/chart` - View live charts (DexScreener, Birdeye)
- `/contract` - Get verified contract address
- `/buy` - Quick buy links
- `/holders` - View holder count

**Raids & Rewards:**
- `/raid` - View and join active raids
- `/leaderboard` - Top Sun Points earners
- `/raidleaderboard` - Top raiders
- `/mystats` - Your personal statistics

**Community & Fun:**
- `/gm` - Morning greeting
- `/shine` - Get encouragement
- `/poll` - Create a community poll
- `/spin` - Spin for Sun Points (1hr cooldown)
- `/trivia` - Answer trivia for 15 points

### Admin Commands

**Raid Management:**
```
/createraid
Title of the raid
https://x.com/thesunesolana/status/123456
Description (optional)
10 (points reward, optional)
```

- `/approveraid` - Review pending raid submissions

**Moderation:**
- `/warn` - Reply to a message to warn user
- `/mute` - Reply to a message to mute user
- `/unmute` - Reply to a message to unmute user
- `/ban` - Reply to a message to ban user
- `/setadmin` - Reply to a message to make user admin
- `/raidmode` - Toggle raid protection mode

### How Raids Work

1. **Admin creates a raid** using `/createraid`
2. **Users see the raid** with `/raid` command
3. **Users click "Join Raid"** to go to the target URL
4. **Users engage** (like, retweet, comment)
5. **Users click "Submit Proof"** and send screenshot/link
6. **Admin reviews** submissions with `/approveraid`
7. **Admin approves** - user gets Sun Points automatically

## Database Schema

The bot uses Supabase with the following tables:

- **users**: User profiles, points, stats
- **raids**: Raid campaigns
- **raid_participants**: Raid submission tracking
- **warnings**: Moderation history
- **polls**: Community polls
- **poll_votes**: Poll voting records
- **bot_config**: Bot configuration
- **captcha_pending**: Captcha verification (future)

## Brand Guidelines

SUNE is about:
- Positivity and encouragement
- Long-term community building
- Honest, transparent communication
- Fun and memes without spam
- People-first approach

The bot reflects these values through:
- Friendly, warm language
- Sun-themed messaging
- Rewards for participation
- Protection against negativity
- Community engagement tools

## Architecture

```
index.js          - Main bot initialization
config.js         - Configuration management
database.js       - Supabase database functions
raids.js          - Raid system commands
crypto.js         - Crypto utility commands
moderation.js     - Moderation features
community.js      - Community engagement features
```

## Extending the Bot

### Adding New Commands

Create your command in the appropriate module:

```javascript
export function setupMyCommands(bot) {
  bot.command('mycommand', async (ctx) => {
    // Your command logic
    ctx.reply('Hello!');
  });
}
```

Then import and call it in `index.js`:

```javascript
import { setupMyCommands } from './mymodule.js';
setupMyCommands(bot);
```

### Adding Database Functions

Add new functions to `database.js`:

```javascript
export async function myFunction() {
  const { data } = await supabase
    .from('table')
    .select('*');
  return data;
}
```

## Security Notes

- Never share your bot token
- Keep admin controls restricted
- Review raid submissions carefully
- Monitor for suspicious activity
- Use raid mode during attacks

## Support

For issues or questions:
- Twitter: https://x.com/thesunesolana
- Telegram: https://t.me/SUNEsolana

Keep shining! ☀️
