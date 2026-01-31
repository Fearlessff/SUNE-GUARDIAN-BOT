import { Markup } from 'telegraf';
import {
  createRaid,
  getActiveRaids,
  submitRaidProof,
  approveRaidParticipation,
  getLeaderboard,
  isUserAdmin,
  supabase,
} from './database.js';

export function setupRaidCommands(bot) {
  bot.command('raid', async (ctx) => {
    try {
      const raids = await getActiveRaids();

      if (raids.length === 0) {
        return ctx.reply('No active raids at the moment! Check back soon. ☀️');
      }

      const raid = raids[0];
      const message = `
🚀 **ACTIVE RAID** 🚀

**${raid.title}**

${raid.description || 'Help us grow the SUNE community!'}

**Target:** ${raid.url}

**Reward:** ${raid.points_reward} Sun Points ☀️

**Instructions:**
1. Click "Join Raid" below
2. Go to the link and engage (like, retweet, comment)
3. Click "Submit Proof" and send screenshot or tweet URL
4. Earn your Sun Points!

Let's shine together! ☀️
      `.trim();

      await ctx.reply(message, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.url('Join Raid', raid.url)],
          [Markup.button.callback('Submit Proof', `submit_proof_${raid.id}`)],
        ]),
      });
    } catch (error) {
      console.error('Error in /raid command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('createraid', async (ctx) => {
    try {
      if (!(await isUserAdmin(ctx.from.id))) {
        return ctx.reply('Only admins can create raids.');
      }

      const args = ctx.message.text.split('\n').slice(1);
      if (args.length < 2) {
        return ctx.reply(
          'Usage:\n/createraid\nTitle\nURL\nDescription (optional)\nPoints (optional, default 10)'
        );
      }

      const title = args[0]?.trim();
      const url = args[1]?.trim();
      const description = args[2]?.trim() || '';
      const points = parseInt(args[3]) || 10;

      if (!title || !url) {
        return ctx.reply('Please provide at least a title and URL.');
      }

      const raid = await createRaid(title, url, description, ctx.from.id, points);

      if (raid) {
        ctx.reply(`✅ Raid created successfully!\n\n**${title}**\nReward: ${points} Sun Points ☀️`);
      } else {
        ctx.reply('Failed to create raid. Please try again.');
      }
    } catch (error) {
      console.error('Error in /createraid command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('leaderboard', async (ctx) => {
    try {
      const leaders = await getLeaderboard('points', 10);

      if (leaders.length === 0) {
        return ctx.reply('No leaderboard data yet. Start raiding to earn points! ☀️');
      }

      let message = '🏆 **SUN POINTS LEADERBOARD** ☀️\n\n';

      leaders.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const name = user.username ? `@${user.username}` : user.first_name;
        message += `${medal} ${name}: **${user.sun_points}** points\n`;
      });

      message += '\n_Keep shining, sun fam!_ ☀️';

      ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error in /leaderboard command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('raidleaderboard', async (ctx) => {
    try {
      const leaders = await getLeaderboard('raids', 10);

      if (leaders.length === 0) {
        return ctx.reply('No raid data yet. Be the first to raid! ☀️');
      }

      let message = '🚀 **RAID LEADERBOARD** 🚀\n\n';

      leaders.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const name = user.username ? `@${user.username}` : user.first_name;
        message += `${medal} ${name}: **${user.raids_completed}** raids\n`;
      });

      message += '\n_Keep raiding, sun warriors!_ ☀️';

      ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error in /raidleaderboard command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.action(/^submit_proof_(.+)$/, async (ctx) => {
    try {
      const raidId = ctx.match[1];
      ctx.session = ctx.session || {};
      ctx.session.awaitingProof = raidId;

      await ctx.answerCbQuery();
      await ctx.reply(
        'Great! Please send your proof (screenshot URL or tweet link) for this raid.\n\nSend it as a message now:'
      );
    } catch (error) {
      console.error('Error in submit_proof action:', error);
      ctx.answerCbQuery('An error occurred.');
    }
  });

  bot.command('approveraid', async (ctx) => {
    try {
      if (!(await isUserAdmin(ctx.from.id))) {
        return ctx.reply('Only admins can approve raids.');
      }

      const { data: pendingParticipations } = await supabase
        .from('raid_participants')
        .select('*, raids(*), users(*)')
        .eq('status', 'pending')
        .limit(10);

      if (!pendingParticipations || pendingParticipations.length === 0) {
        return ctx.reply('No pending raid submissions to review.');
      }

      for (const participation of pendingParticipations) {
        const user = participation.users;
        const raid = participation.raids;
        const userName = user.username ? `@${user.username}` : user.first_name;

        const message = `
**Raid Submission Review**

User: ${userName}
Raid: ${raid.title}
Proof: ${participation.proof_url || 'No proof provided'}
        `.trim();

        await ctx.reply(message, {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback('✅ Approve', `approve_${participation.id}_${raid.id}_${user.id}`),
              Markup.button.callback('❌ Reject', `reject_${participation.id}`),
            ],
          ]),
        });
      }
    } catch (error) {
      console.error('Error in /approveraid command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.action(/^approve_(.+)_(.+)_(.+)$/, async (ctx) => {
    try {
      if (!(await isUserAdmin(ctx.from.id))) {
        return ctx.answerCbQuery('Only admins can approve raids.');
      }

      const participationId = ctx.match[1];
      const raidId = ctx.match[2];
      const userId = ctx.match[3];

      await approveRaidParticipation(participationId, raidId, userId);

      await ctx.answerCbQuery('✅ Raid approved!');
      await ctx.editMessageText(ctx.callbackQuery.message.text + '\n\n✅ **APPROVED**', {
        parse_mode: 'Markdown',
      });

      try {
        await ctx.telegram.sendMessage(userId, '🎉 Your raid submission was approved! Sun Points have been added to your account. ☀️');
      } catch (err) {
        console.log('Could not notify user:', err.message);
      }
    } catch (error) {
      console.error('Error approving raid:', error);
      ctx.answerCbQuery('An error occurred.');
    }
  });

  bot.action(/^reject_(.+)$/, async (ctx) => {
    try {
      if (!(await isUserAdmin(ctx.from.id))) {
        return ctx.answerCbQuery('Only admins can reject raids.');
      }

      const participationId = ctx.match[1];

      await supabase
        .from('raid_participants')
        .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
        .eq('id', participationId);

      await ctx.answerCbQuery('❌ Raid rejected');
      await ctx.editMessageText(ctx.callbackQuery.message.text + '\n\n❌ **REJECTED**', {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Error rejecting raid:', error);
      ctx.answerCbQuery('An error occurred.');
    }
  });
}

export async function handleProofSubmission(ctx, raidId, proofUrl) {
  try {
    const submission = await submitRaidProof(raidId, ctx.from.id, proofUrl);

    if (submission) {
      await ctx.reply(
        '✅ Proof submitted successfully! An admin will review it soon.\n\nKeep shining! ☀️'
      );
    } else {
      await ctx.reply(
        '❌ Failed to submit proof. You may have already submitted for this raid.'
      );
    }
  } catch (error) {
    console.error('Error submitting proof:', error);
    ctx.reply('An error occurred. Please try again later.');
  }
}
