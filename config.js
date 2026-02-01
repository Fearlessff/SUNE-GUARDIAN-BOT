import dotenv from 'dotenv';
dotenv.config();

export const config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
  },
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY,
  },
  sune: {
    contractAddress: process.env.SUNE_CONTRACT_ADDRESS,
    twitter: process.env.SUNE_TWITTER,
    telegram: process.env.SUNE_TELEGRAM,
  },
  moderation: {
    maxWarnings: parseInt(process.env.MAX_WARNINGS) || 3,
    spamThreshold: parseInt(process.env.SPAM_THRESHOLD) || 5,
    captchaTimeout: parseInt(process.env.CAPTCHA_TIMEOUT) || 300000,
  },
};
