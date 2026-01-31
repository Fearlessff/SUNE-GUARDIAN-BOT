import { Markup } from 'telegraf';
import { createPoll, votePoll, supabase, getOrCreateUser } from './database.js';

export function setupCommunityCommands(bot) {
  bot.command('gm', async (ctx) => {
    const greetings = [
      'gm sun fam! ☀️',
      'Good morning! Keep shining! ☀️',
      'gm! Ready to spread some positivity today? ☀️',
      'Rise and shine! ☀️',
      'Morning sunshine! ☀️',
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    ctx.reply(randomGreeting);
  });

  bot.command('shine', async (ctx) => {
    const messages = [
      '✨ You\'re shining bright today! Keep it up! ☀️',
      '🌟 Stay positive, stay shining! ☀️',
      '💫 You\'re a star in the SUNE community! ☀️',
      '⭐ Keep spreading that positive energy! ☀️',
      '🌞 Shine on, sun warrior! ☀️',
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    ctx.reply(randomMessage);
  });

  bot.command('mystats', async (ctx) => {
    try {
      const user = await getOrCreateUser(ctx.from);

      if (!user) {
        return ctx.reply('Unable to fetch your stats. Please try again later.');
      }

      const message = `
📊 **Your SUNE Stats** ☀️

**Sun Points:** ${user.sun_points} ☀️
**Raids Completed:** ${user.raids_completed}
**Warnings:** ${user.warning_count}
**Member Since:** ${new Date(user.joined_at).toLocaleDateString()}

Keep shining! ☀️
      `.trim();

      ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error in /mystats command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('poll', async (ctx) => {
    try {
      const args = ctx.message.text.split('\n').slice(1);

      if (args.length < 3) {
        return ctx.reply(
          'Usage:\n/poll\nYour question?\nOption 1\nOption 2\nOption 3 (optional)\n...'
        );
      }

      const question = args[0].trim();
      const options = args.slice(1).filter(opt => opt.trim());

      if (options.length < 2) {
        return ctx.reply('Please provide at least 2 options for the poll.');
      }

      const poll = await createPoll(question, options, ctx.from.id, null);

      if (!poll) {
        return ctx.reply('Failed to create poll. Please try again.');
      }

      let pollMessage = `📊 **POLL** ☀️\n\n**${question}**\n\n`;

      options.forEach((option, index) => {
        pollMessage += `${index + 1}. ${option}\n`;
      });

      pollMessage += '\nClick a button below to vote:';

      const buttons = options.map((option, index) => [
        Markup.button.callback(`${index + 1}. ${option.substring(0, 30)}`, `vote_${poll.id}_${index}`),
      ]);

      await ctx.reply(pollMessage, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons),
      });
    } catch (error) {
      console.error('Error in /poll command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.action(/^vote_(.+)_(.+)$/, async (ctx) => {
    try {
      const pollId = ctx.match[1];
      const optionIndex = parseInt(ctx.match[2]);

      const vote = await votePoll(pollId, ctx.from.id, optionIndex);

      if (!vote) {
        return ctx.answerCbQuery('You have already voted in this poll!');
      }

      await ctx.answerCbQuery('✅ Vote recorded!');

      const { data: poll } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .single();

      const { data: votes } = await supabase
        .from('poll_votes')
        .select('option_index')
        .eq('poll_id', pollId);

      const options = JSON.parse(poll.options);
      const voteCounts = new Array(options.length).fill(0);
      votes.forEach(v => voteCounts[v.option_index]++);

      const totalVotes = votes.length;

      let resultsMessage = `📊 **POLL RESULTS** ☀️\n\n**${poll.question}**\n\n`;

      options.forEach((option, index) => {
        const count = voteCounts[index];
        const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;
        const barLength = Math.round(percentage / 5);
        const bar = '▓'.repeat(barLength) + '░'.repeat(20 - barLength);

        resultsMessage += `${index + 1}. ${option}\n${bar} ${percentage}% (${count} votes)\n\n`;
      });

      resultsMessage += `Total votes: ${totalVotes}`;

      try {
        await ctx.editMessageText(resultsMessage, { parse_mode: 'Markdown' });
      } catch (error) {
        console.log('Could not update poll message');
      }
    } catch (error) {
      console.error('Error voting on poll:', error);
      ctx.answerCbQuery('An error occurred.');
    }
  });

  bot.command('spin', async (ctx) => {
    try {
      const outcomes = [
        { text: '🎉 You won 50 Sun Points!', points: 50, chance: 0.05 },
        { text: '⭐ You won 25 Sun Points!', points: 25, chance: 0.1 },
        { text: '✨ You won 10 Sun Points!', points: 10, chance: 0.2 },
        { text: '☀️ You won 5 Sun Points!', points: 5, chance: 0.3 },
        { text: '🌟 Better luck next time!', points: 0, chance: 0.35 },
      ];

      const lastSpin = ctx.session?.lastSpin || 0;
      const now = Date.now();
      const cooldown = 3600000;

      if (now - lastSpin < cooldown) {
        const remainingTime = Math.ceil((cooldown - (now - lastSpin)) / 60000);
        return ctx.reply(`You can spin again in ${remainingTime} minutes. ☀️`);
      }

      const random = Math.random();
      let cumulative = 0;
      let selectedOutcome = outcomes[outcomes.length - 1];

      for (const outcome of outcomes) {
        cumulative += outcome.chance;
        if (random <= cumulative) {
          selectedOutcome = outcome;
          break;
        }
      }

      ctx.session = ctx.session || {};
      ctx.session.lastSpin = now;

      if (selectedOutcome.points > 0) {
        await supabase
          .from('users')
          .update({
            sun_points: supabase.raw(`sun_points + ${selectedOutcome.points}`)
          })
          .eq('id', ctx.from.id);
      }

      await ctx.reply(`🎰 **SPINNING...** 🎰\n\n${selectedOutcome.text}`, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Error in /spin command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('trivia', async (ctx) => {
    try {
      const triviaQuestions = [
        {
          question: 'What blockchain is $SUNE built on?',
          options: ['Ethereum', 'Solana', 'Binance Smart Chain', 'Polygon'],
          correct: 1,
        },
        {
          question: 'What does SUNE stand for?',
          options: ['Sun Energy', 'Sunshine Network', 'It\'s just SUNE!', 'Solar Unity'],
          correct: 2,
        },
        {
          question: 'What is the core value of $SUNE?',
          options: ['Fast profits', 'Positivity and community', 'Complex tech', 'Trading only'],
          correct: 1,
        },
      ];

      const question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

      ctx.session = ctx.session || {};
      ctx.session.triviaAnswer = question.correct;

      const buttons = question.options.map((option, index) => [
        Markup.button.callback(option, `trivia_${index}`),
      ]);

      await ctx.reply(
        `🧠 **TRIVIA TIME** ☀️\n\n${question.question}`,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard(buttons),
        }
      );
    } catch (error) {
      console.error('Error in /trivia command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.action(/^trivia_(.+)$/, async (ctx) => {
    try {
      const selectedIndex = parseInt(ctx.match[1]);
      const correctAnswer = ctx.session?.triviaAnswer;

      if (correctAnswer === undefined) {
        return ctx.answerCbQuery('This trivia has expired. Start a new one with /trivia');
      }

      if (selectedIndex === correctAnswer) {
        const points = 15;
        await supabase
          .from('users')
          .update({
            sun_points: supabase.raw(`sun_points + ${points}`)
          })
          .eq('id', ctx.from.id);

        await ctx.answerCbQuery('🎉 Correct! +15 Sun Points!');
        await ctx.editMessageText(
          ctx.callbackQuery.message.text + '\n\n✅ **CORRECT!** +15 Sun Points ☀️',
          { parse_mode: 'Markdown' }
        );
      } else {
        await ctx.answerCbQuery('❌ Wrong answer! Better luck next time.');
        await ctx.editMessageText(
          ctx.callbackQuery.message.text + '\n\n❌ **INCORRECT!** Try again next time ☀️',
          { parse_mode: 'Markdown' }
        );
      }

      delete ctx.session.triviaAnswer;
    } catch (error) {
      console.error('Error in trivia answer:', error);
      ctx.answerCbQuery('An error occurred.');
    }
  });
}
