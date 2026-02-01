import axios from 'axios';
import { config } from './config.js';

export function setupCryptoCommands(bot) {
  bot.command('price', async (ctx) => {
    try {
      const price = await getSunePrice();

      if (!price) {
        return ctx.reply('Unable to fetch price at the moment. Please try again later.');
      }

      const message = `
💰 **$SUNE Price** ☀️

**Price:** $${price.priceUsd}
**Market Cap:** $${price.marketCap}
**24h Volume:** $${price.volume24h}
**24h Change:** ${price.priceChange24h}%

${price.priceChange24h > 0 ? '📈 Keep shining!' : '📊 Stay positive!'}
      `.trim();

      ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error fetching price:', error);
      ctx.reply('Unable to fetch price at the moment. Please try again later.');
    }
  });

  bot.command('chart', async (ctx) => {
    try {
      const dexscreenerUrl = `https://dexscreener.com/solana/${config.sune.contractAddress}`;
      const birdeyeUrl = `https://birdeye.so/token/${config.sune.contractAddress}?chain=solana`;

      const message = `
📊 **$SUNE Charts** ☀️

View live charts on:
      `.trim();

      ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📈 DexScreener', url: dexscreenerUrl }],
            [{ text: '🦅 Birdeye', url: birdeyeUrl }],
          ],
        },
      });
    } catch (error) {
      console.error('Error in /chart command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('contract', async (ctx) => {
    try {
      const message = `
📜 **$SUNE Contract Information** ☀️

**Contract Address:**
\`${config.sune.contractAddress}\`

**Network:** Solana
**Token:** $SUNE

**Official Links:**
🐦 Twitter: ${config.sune.twitter}
💬 Telegram: ${config.sune.telegram}

_Always verify the contract address before trading!_
      `.trim();

      ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔍 View on Solscan', url: `https://solscan.io/token/${config.sune.contractAddress}` }],
            [{ text: '🦅 View on Birdeye', url: `https://birdeye.so/token/${config.sune.contractAddress}?chain=solana` }],
          ],
        },
      });
    } catch (error) {
      console.error('Error in /contract command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('buy', async (ctx) => {
    try {
      const jupiterUrl = `https://jup.ag/swap/SOL-${config.sune.contractAddress}`;
      const raydiumUrl = `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${config.sune.contractAddress}`;

      const message = `
🛒 **Buy $SUNE** ☀️

Get your $SUNE tokens on these platforms:
      `.trim();

      ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🪐 Jupiter', url: jupiterUrl }],
            [{ text: '⚡ Raydium', url: raydiumUrl }],
          ],
        },
      });
    } catch (error) {
      console.error('Error in /buy command:', error);
      ctx.reply('An error occurred. Please try again later.');
    }
  });

  bot.command('holders', async (ctx) => {
    try {
      const holderData = await getHolderCount();

      if (!holderData) {
        return ctx.reply('Unable to fetch holder data at the moment. Please try again later.');
      }

      const message = `
👥 **$SUNE Holders** ☀️

**Total Holders:** ${holderData.holders}

Join the sun fam! ☀️
      `.trim();

      ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error fetching holders:', error);
      ctx.reply('Unable to fetch holder data at the moment. Please try again later.');
    }
  });
}

async function getSunePrice() {
  try {
    const response = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${config.sune.contractAddress}`
    );

    if (response.data && response.data.pairs && response.data.pairs.length > 0) {
      const pair = response.data.pairs[0];
      return {
        priceUsd: parseFloat(pair.priceUsd).toFixed(8),
        marketCap: formatNumber(pair.fdv || pair.marketCap),
        volume24h: formatNumber(pair.volume?.h24),
        priceChange24h: parseFloat(pair.priceChange?.h24 || 0).toFixed(2),
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching SUNE price:', error);
    return null;
  }
}

async function getHolderCount() {
  try {
    const response = await axios.get(
      `https://public-api.birdeye.so/defi/token_overview?address=${config.sune.contractAddress}`,
      {
        headers: {
          'X-API-KEY': process.env.BIRDEYE_API_KEY || '',
        },
      }
    );

    if (response.data && response.data.data) {
      return {
        holders: response.data.data.holder || 'N/A',
      };
    }

    return { holders: 'N/A' };
  } catch (error) {
    console.error('Error fetching holder count:', error);
    return { holders: 'N/A' };
  }
}

function formatNumber(num) {
  if (!num) return 'N/A';
  const number = parseFloat(num);
  if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2) + 'K';
  }
  return number.toFixed(2);
}
