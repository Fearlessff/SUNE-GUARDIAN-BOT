import dotenv from 'dotenv';
dotenv.config();

export const config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },
  sune: {
    contractAddress: process.env.SUNE_CONTRACT_ADDRESS,
    twitter: process.env.SUNE_TWITTER,
    telegram: process.env.SUNE_TELEGRAM,
  },
  moderation: {
    maxWarnings: 3,
    spamThreshold: 5,
    captchaTimeout: 300000,
  },
};
