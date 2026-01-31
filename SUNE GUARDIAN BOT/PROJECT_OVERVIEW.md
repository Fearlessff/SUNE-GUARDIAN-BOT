# SUNE Guardian Bot - Project Overview

## What is This?

A production-ready Telegram bot built specifically for the $SUNE community on Solana. This bot combines raid coordination, moderation tools, crypto utilities, and community engagement features - all aligned with SUNE's values of positivity, honesty, and fun.

## Project Structure

```
sune-guardian-bot/
├── index.js              # Main bot initialization & command routing
├── config.js             # Configuration management
├── database.js           # Supabase database functions
├── raids.js              # Raid system & leaderboards
├── crypto.js             # Price, charts, contract info
├── moderation.js         # Anti-spam, warnings, bans
├── community.js          # Polls, games, trivia
├── package.json          # Dependencies & scripts
├── .env                  # Environment variables (secret)
├── .env.example          # Environment template
├── README.md             # Full documentation
├── QUICKSTART.md         # 5-minute setup guide
├── DEPLOYMENT.md         # Hosting & deployment options
├── FEATURES.md           # Complete feature list
└── supabase/             # Database migrations
    └── migrations/
        └── create_sune_bot_schema.sql
```

## Core Technologies

- **Runtime**: Node.js 18+
- **Bot Framework**: Telegraf 4.16
- **Database**: Supabase (PostgreSQL)
- **APIs**: DexScreener, Birdeye (optional)
- **Blockchain**: Solana

## Key Features at a Glance

### 1. Raid System
- Create Twitter/X raid campaigns
- Track user participation with proof submission
- Admin approval workflow
- Automatic points distribution
- Dual leaderboards (points & raid count)

### 2. Moderation
- Spam detection & auto-muting
- Scam keyword filtering
- Warning system with auto-ban
- User management (mute/unmute/ban)
- Raid mode for emergency lockdown
- Admin role management

### 3. Crypto Utilities
- Real-time $SUNE price from DexScreener
- Quick chart access (DexScreener, Birdeye)
- Contract verification links
- Direct buy links (Jupiter, Raydium)
- Holder count tracking

### 4. Community Engagement
- Sun Points reward system
- Interactive polls with live results
- Trivia game (15 points per correct answer)
- Lucky spin (hourly, 5-50 points)
- Morning greetings & encouragement
- Personal statistics tracking

## Database Schema

### Tables (8)
1. **users** - User profiles, points, stats
2. **raids** - Raid campaigns
3. **raid_participants** - Participation tracking
4. **warnings** - Moderation history
5. **polls** - Community polls
6. **poll_votes** - Poll voting records
7. **bot_config** - Dynamic configuration
8. **captcha_pending** - Future captcha system

### Security
- Row Level Security (RLS) enabled on all tables
- Public read for leaderboards, private write
- Service role for bot operations
- No direct user data modification

## Command Structure

### Public (16 commands)
- Info: `/start`, `/help`
- Crypto: `/price`, `/chart`, `/contract`, `/buy`, `/holders`
- Raids: `/raid`, `/leaderboard`, `/raidleaderboard`, `/mystats`
- Community: `/gm`, `/shine`, `/poll`, `/spin`, `/trivia`

### Admin (8 commands)
- Raids: `/createraid`, `/approveraid`
- Moderation: `/warn`, `/mute`, `/unmute`, `/ban`
- Admin: `/setadmin`, `/raidmode`

## Getting Started (Quick)

1. **Get Bot Token**: Message @BotFather on Telegram
2. **Configure**: Add token to `.env` file
3. **Install**: `npm install`
4. **Run**: `npm start`
5. **Test**: Send `/start` to your bot

Full setup guide: See `QUICKSTART.md`

## Deployment Options

- **Local**: Development & testing
- **VPS**: DigitalOcean, Linode, Vultr ($5/mo)
- **Railway**: Easy deploy with auto-scaling
- **Heroku**: Platform-as-a-service
- **Docker**: Containerized deployment

See `DEPLOYMENT.md` for detailed instructions.

## Environment Variables Required

```env
TELEGRAM_BOT_TOKEN=your_bot_token        # From @BotFather (REQUIRED)
SUPABASE_URL=your_supabase_url           # Pre-configured
SUPABASE_ANON_KEY=your_key               # Pre-configured
SUNE_CONTRACT_ADDRESS=7wv5...            # Pre-configured
SUNE_TWITTER=https://x.com/...           # Pre-configured
SUNE_TELEGRAM=https://t.me/...           # Pre-configured
```

## Architecture Highlights

### Modular Design
- Each feature in separate file
- Clean separation of concerns
- Easy to extend and maintain
- Reusable functions

### Error Handling
- Global error catcher
- Graceful degradation
- User-friendly messages
- Detailed logging

### Performance
- Efficient database queries
- Minimal API calls
- Session-based state
- Rate limiting built-in

### Security
- Input validation
- SQL injection prevention
- Admin permission checks
- Spam protection
- RLS on all tables

## Brand Alignment

The bot embodies SUNE's core values:

- **Positivity**: Encouraging messages, positive reinforcement
- **Honesty**: Transparent operations, verified information
- **Fun**: Games, trivia, interactive features
- **Community**: Rewards participation, builds engagement
- **Long-term**: Points system encourages loyalty

### Tone & Language
- Warm and friendly
- Sun-themed (☀️)
- Meme-friendly but professional
- No spam or aggressive tactics
- Encouraging and supportive

## Integration Points

### External APIs
- **DexScreener**: Price, volume, market cap (free)
- **Birdeye**: Holder count, token data (optional API key)
- **Telegram Bot API**: Core bot functionality
- **Supabase**: Database and real-time features

### Social Links
- Twitter/X for raids
- Telegram group management
- Solscan for contract verification
- DEX platforms for trading

## Development Workflow

### Adding New Features

1. **Plan**: Identify which module (raids, crypto, etc.)
2. **Database**: Add tables if needed in Supabase
3. **Functions**: Add to appropriate module file
4. **Commands**: Register in index.js
5. **Test**: Verify locally
6. **Deploy**: Push to production

### Code Style
- ES6 modules
- Async/await for promises
- Clear function names
- Comments for complex logic
- Error handling for all operations

## Testing Checklist

Before going live:

- [ ] Bot token configured
- [ ] Database connected
- [ ] Bot responds to `/start`
- [ ] Admin commands work (set yourself as admin first)
- [ ] Create a test raid
- [ ] Submit raid proof
- [ ] Approve raid proof
- [ ] Check leaderboard updates
- [ ] Test moderation (warn, mute)
- [ ] Verify price command
- [ ] Test community features (poll, spin, trivia)

## Maintenance

### Regular Tasks
- Monitor bot logs for errors
- Review raid submissions promptly
- Keep dependencies updated
- Check Supabase storage usage
- Monitor API rate limits

### Updates
- Pull latest code: `git pull`
- Install new deps: `npm install`
- Restart bot: `pm2 restart sune-bot`

## Support & Resources

### Documentation
- README.md - Comprehensive guide
- QUICKSTART.md - Fast setup
- DEPLOYMENT.md - Hosting options
- FEATURES.md - Feature details

### Community
- Telegram: https://t.me/SUNEsolana
- Twitter: https://x.com/thesunesolana

### Technical
- Telegraf Docs: https://telegraf.js.org
- Supabase Docs: https://supabase.com/docs
- Solana Docs: https://docs.solana.com

## Future Roadmap

Planned enhancements:
- Captcha verification for new members
- Wallet holder verification system
- Holder-exclusive perks and roles
- Automated scheduled raids
- Random holder giveaway system
- NFT integration
- Custom sticker pack
- Meme contest tracking
- Multi-language support
- Advanced analytics dashboard

## Success Metrics

Track these KPIs:
- Total users in database
- Active raiders (last 7 days)
- Sun Points distributed
- Raids created & completed
- Community engagement rate
- New member retention
- Admin response time

## License & Credits

Built for the $SUNE community with love and positivity.

**Contract**: 7wv5FcDApP7DMXMNGmRRfJXeCQYFU3eMJsmX4mkgpump
**Blockchain**: Solana
**Community**: https://t.me/SUNEsolana

---

Keep shining! ☀️
