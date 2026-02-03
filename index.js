import { Telegraf, session } from 'telegraf';
import { config } from './config.js';
import { getOrCreateUser } from './database.js';
import { setupRaidCommands, handleProofSubmission } from './raids.js';
import { setupCryptoCommands } from './crypto.js';
import { setupModerationCommands, checkSpam, handleNewMember } from './moderation.js';
import { setupCommunityCommands } from './community.js';

// <-- NEW IMPORT -->
import { setupAutoRaids } from './autoRaid.js';

if (!config.telegram.botToken) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN is not set in .env file');
  console.error('Please add your Telegram bot token to the .env file:');
  console.error('TELEGRAM_BOT_TOKEN=your_bot_token_here');
  process.exit(1);
}

const bot = new Telegraf(config.telegram.botToken);

bot.use(session());

bot.use(async (ctx, next) => {
  if (ctx.from) {
    await getOrCreateUser(ctx.from);
  }
  return next();
});

bot.use(async (ctx, next) => {
  if (ctx.message?.text && !ctx.message.text.startsWith('/')) {
    return checkSpam(ctx, next);
  }
  return next();
});

bot.on('new_chat_members', handleNewMember);

bot.start((ctx) => {
  const message = `
👋 **Welcome to SUNE Guardian Bot!** ☀️

I'm here to help grow and protect the SUNE community with positivity and fun!

**📋 Available Commands:**

**Crypto & Info:**
/price - Check $SUNE price
/chart - View live charts
/contract - Get contract details
/buy - Buy $SUNE
/holders - View holder count

**Raids & Rewards:**
/raid - View active raids
/leaderboard - Sun Points leaderboard
/raidleaderboard - Raid completion leaderboard
/mystats - Your personal stats

**Community & Fun:**
/gm - Morning greeting
/shine - Get encouraged
/poll - Create a poll
/spin - Spin for Sun Points (1hr cooldown)
/trivia - Answer trivia for points

**Admin Commands:**
/createraid - Create a new raid
/approveraid - Review raid submissions
/warn - Warn a user
/mute - Mute a user
/unmute - Unmute a user
/ban - Ban a user
/setadmin - Set a user as admin
/raidmode - Toggle raid protection mode

**About $SUNE:**
Contract: \`${config.sune.contractAddress}\`
Twitter: ${config.sune.twitter}
Telegram: ${config.sune.telegram}

Let's keep it positive and shine together! ☀️
  `.trim();

  ctx.reply(message, { parse_mode: 'Markdown' });
});

bot.command('help', (ctx) => {
  const message = `
📋 **SUNE Guardian Bot Commands** ☀️

**Crypto & Info:**
/price - Check $SUNE price
/chart - View live charts
/contract - Get contract details
/buy - Buy $SUNE
/holders - View holder count

**Raids & Rewards:**
/raid - View active raids
/leaderboard - Sun Points leaderboard
/raidleaderboard - Raid completion leaderboard
/mystats - Your personal stats

**Community & Fun:**
/gm - Morning greeting
/shine - Get encouraged
/poll - Create a poll
/spin - Spin for Sun Points (1hr cooldown)
/trivia - Answer trivia for points

**Admin Commands:**
/createraid - Create a new raid
/approveraid - Review raid submissions
/warn - Warn a user (reply to message)
/mute - Mute a user (reply to message)
/unmute - Unmute a user (reply to message)
/ban - Ban a user (reply to message)
/setadmin - Set a user as admin (reply to message)
/raidmode - Toggle raid protection mode

Stay positive, stay shining! ☀️
  `.trim();

  ctx.reply(message, { parse_mode: 'Markdown' });
});

// SETUP ALL COMMAND MODULES
setupRaidCommands(bot);
setupCryptoCommands(bot);
setupModerationCommands(bot);
setupCommunityCommands(bot);

// <-- NEW AUTO-RAID INITIALIZATION -->
setupAutoRaids(bot);

bot.on('text', async (ctx, next) => {
  if (ctx.session?.awaitingProof) {
    const raidId = ctx.session.awaitingProof;
    const proofUrl = ctx.message.text;

    delete ctx.session.awaitingProof;

    await handleProofSubmission(ctx, raidId, proofUrl);
    return;
  }

  return next();
});

bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('An unexpected error occurred. Please try again later.');
});

bot.launch().then(() => {
  console.log('🌞 SUNE Guardian Bot is running!');
  console.log('Bot is ready to shine! ☀️');
}).catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

