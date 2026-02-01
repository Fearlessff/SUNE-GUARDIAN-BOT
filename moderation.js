import { Markup } from 'telegraf';
import {
  addWarning,
  banUser,
  muteUser,
  unmuteUser,
  isUserAdmin,
  isUserBanned,
  isUserMuted,
  supabase,
} from './database.js';
import { config } from './config.js';

const userMessageCount = new Map();
const scamKeywords = [
  'airdrop now',
  'claim your',
  'double your',
  'free tokens',
  'admin will never dm',
  'metamask support',
  'trust wallet support',
  'click here now',
  'urgent verify',
];

export function setupModerationCommands(bot) {
  bot.command('warn', async (ctx) => {
    try {
      if (!(await isUserAdmin(ctx.from.id))) {
        return ctx.reply('Only admins can issue warnings.');
      }

      const replyToMessage = ctx.message.reply_to_message;
      if (!replyToMessage) {
        return ctx.reply('Please reply to a message to warn the user.');
      }

      const targetUserId = replyToMessage.from.id;
      const reason = ctx.message.text.split(' ').slice(1).join(' ') || 'No reason provided';

      const warningCount = await addWarning(targetUserId, reason, ctx.from.id);

      let message = `⚠️ Warning issued to user.\n\nTotal warnings: ${warningCount}/${config.moderation.maxWarnings}`;

      if (warningCount >= config.moderation.maxWarnings) {
        await banUser(targetUserId);
        message += '\n\n🚫 User has been automatically banned for reaching the warning limit.';

        try {
          await ctx.banChatMember(targetUserId);
        } catch (error) {
          console.error('Error banning user from chat:', error);
        }
      }

      ctx.reply(message);

      try {
        await ctx.telegram.sendMessage(
          targetUserId,
          `⚠️ You have received a warning in ${ctx.chat.title}.\n\nReason: ${reason}\n\nWarnings: ${warningCount}/${config.moderation.maxWarnings}`
        );
      } catch (error) {
        console.log('Could not send warning DM to user');
      }
    } catch (error) {
      console.error('Error in /warn command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('mute', async (ctx) => {
    try {
      if (!(await isUserAdmin(ctx.from.id))) {
        return ctx.reply('Only admins can mute users.');
      }

      const replyToMessage = ctx.message.reply_to_message;
      if (!replyToMessage) {
        return ctx.reply('Please reply to a message to mute the user.');
      }

      const targetUserId = replyToMessage.from.id;
      await muteUser(targetUserId);

      try {
        await ctx.restrictChatMember(targetUserId, {
          permissions: {
            can_send_messages: false,
          },
        });
      } catch (error) {
        console.error('Error restricting chat member:', error);
      }

      ctx.reply('🔇 User has been muted.');
    } catch (error) {
      console.error('Error in /mute command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('unmute', async (ctx) => {
    try {
      if (!(await isUserAdmin(ctx.from.id))) {
        return ctx.reply('Only admins can unmute users.');
      }

      const replyToMessage = ctx.message.reply_to_message;
      if (!replyToMessage) {
        return ctx.reply('Please reply to a message to unmute the user.');
      }

      const targetUserId = replyToMessage.from.id;
      await unmuteUser(targetUserId);

      try {
        await ctx.restrictChatMember(targetUserId, {
          permissions: {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
          },
        });
      } catch (error) {
        console.error('Error unrestricting chat member:', error);
      }

      ctx.reply('🔊 User has been unmuted.');
    } catch (error) {
      console.error('Error in /unmute command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('ban', async (ctx) => {
    try {
      if (!(await isUserAdmin(ctx.from.id))) {
        return ctx.reply('Only admins can ban users.');
      }

      const replyToMessage = ctx.message.reply_to_message;
      if (!replyToMessage) {
        return ctx.reply('Please reply to a message to ban the user.');
      }

      const targetUserId = replyToMessage.from.id;
      await banUser(targetUserId);

      try {
        await ctx.banChatMember(targetUserId);
      } catch (error) {
        console.error('Error banning user from chat:', error);
      }

      ctx.reply('🚫 User has been banned.');
    } catch (error) {
      console.error('Error in /ban command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('raidmode', async (ctx) => {
    try {
      if (!(await isUserAdmin(ctx.from.id))) {
        return ctx.reply('Only admins can toggle raid mode.');
      }

      const { data: currentConfig } = await supabase
        .from('bot_config')
        .select('value')
        .eq('key', 'raid_mode')
        .single();

      const newValue = currentConfig.value === 'true' ? 'false' : 'true';

      await supabase
        .from('bot_config')
        .update({ value: newValue, updated_at: new Date().toISOString() })
        .eq('key', 'raid_mode');

      const status = newValue === 'true' ? 'enabled' : 'disabled';
      ctx.reply(`🛡️ Raid mode ${status}.\n\n${newValue === 'true' ? 'Chat is now locked for non-admins.' : 'Chat restrictions lifted.'}`);
    } catch (error) {
      console.error('Error in /raidmode command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('setadmin', async (ctx) => {
    try {
      if (!(await isUserAdmin(ctx.from.id))) {
        return ctx.reply('Only admins can set other admins.');
      }

      const replyToMessage = ctx.message.reply_to_message;
      if (!replyToMessage) {
        return ctx.reply('Please reply to a message to set the user as admin.');
      }

      const targetUserId = replyToMessage.from.id;
      await supabase
        .from('users')
        .update({ is_admin: true })
        .eq('id', targetUserId);

      ctx.reply('✅ User has been set as admin.');
    } catch (error) {
      console.error('Error in /setadmin command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });
}

export async function checkSpam(ctx, next) {
  try {
    const userId = ctx.from.id;
    const now = Date.now();
    const userMessages = userMessageCount.get(userId) || [];

    const recentMessages = userMessages.filter(timestamp => now - timestamp < 10000);
    recentMessages.push(now);
    userMessageCount.set(userId, recentMessages);

    if (recentMessages.length > config.moderation.spamThreshold) {
      if (!(await isUserAdmin(userId))) {
        await muteUser(userId);
        await ctx.deleteMessage();
        await ctx.reply('🚫 Spam detected. User has been muted.', {
          reply_to_message_id: ctx.message.message_id,
        });
        return;
      }
    }

    const messageText = ctx.message?.text?.toLowerCase() || '';
    const hasScamKeyword = scamKeywords.some(keyword => messageText.includes(keyword));

    if (hasScamKeyword && !(await isUserAdmin(userId))) {
      await ctx.deleteMessage();
      await addWarning(userId, 'Potential scam message detected', 0);
      return;
    }

    const banned = await isUserBanned(userId);
    if (banned) {
      try {
        await ctx.banChatMember(userId);
        await ctx.deleteMessage();
      } catch (error) {
        console.error('Error handling banned user:', error);
      }
      return;
    }

    const muted = await isUserMuted(userId);
    if (muted && !(await isUserAdmin(userId))) {
      try {
        await ctx.deleteMessage();
      } catch (error) {
        console.error('Error deleting muted user message:', error);
      }
      return;
    }

    return next();
  } catch (error) {
    console.error('Error in spam check:', error);
    return next();
  }
}

export async function handleNewMember(ctx) {
  try {
    const newMembers = ctx.message.new_chat_members;

    for (const member of newMembers) {
      if (member.is_bot) continue;

      const { data: config } = await supabase
        .from('bot_config')
        .select('value')
        .eq('key', 'welcome_message')
        .single();

      const welcomeMessage = config?.value || 'Welcome to the SUNE community! ☀️';

      const fullMessage = `
Welcome ${member.first_name}! ☀️

${welcomeMessage}

**About $SUNE:**
$SUNE is a community-driven token built on positivity, honesty, and fun. We're here for the long term!

**Get Started:**
/help - See all commands
/price - Check $SUNE price
/raid - Join active raids

Stay positive, stay shining! ☀️
      `.trim();

      await ctx.reply(fullMessage, { parse_mode: 'Markdown' });
    }
  } catch (error) {
    console.error('Error handling new member:', error);
  }
}
