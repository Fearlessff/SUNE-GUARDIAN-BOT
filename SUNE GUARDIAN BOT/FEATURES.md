# SUNE Guardian Bot - Complete Feature List

## Raid System

### User Features
- **View Active Raids** (`/raid`)
  - Display current raid with title, description, target URL
  - Interactive buttons: "Join Raid" and "Submit Proof"
  - Shows points reward for completion

- **Submit Proof**
  - Click "Submit Proof" button after raiding
  - Bot prompts for screenshot URL or tweet link
  - Stores submission for admin review
  - Prevents duplicate submissions

- **Raid Leaderboards** (`/raidleaderboard`)
  - Top 10 raiders by completion count
  - Medal system (gold, silver, bronze)
  - Real-time ranking updates

### Admin Features
- **Create Raids** (`/createraid`)
  - Multi-line command format
  - Set title, URL, description, points reward
  - Automatic raid tracking and management

- **Review Submissions** (`/approveraid`)
  - See all pending raid proofs
  - View user info and proof links
  - Approve/Reject buttons for each submission
  - Automatic point distribution on approval
  - User notification on approval/rejection

### Tracking
- Database stores all raid participation
- Proof URLs for verification
- Submission timestamps
- Approval/rejection status
- Historical raid data

## Moderation System

### Anti-Spam
- **Message Rate Limiting**
  - Tracks messages per user per 10 seconds
  - Configurable threshold (default: 5 messages)
  - Automatic mute for spammers
  - Admin bypass for legitimate use

- **Scam Detection**
  - Keyword blacklist (airdrop scams, fake support, etc.)
  - Automatic message deletion
  - Automatic warning issuance
  - Protects community from common scams

### Warning System
- **Warn Users** (`/warn`)
  - Reply to message to warn user
  - Add custom reason
  - Tracks warning count in database
  - DM notification to warned user
  - Progressive discipline system

- **Auto-Ban on Threshold**
  - Configurable warning limit (default: 3)
  - Automatic ban when limit reached
  - Both database and Telegram ban
  - Clear notification to admins

### User Management
- **Mute** (`/mute`)
  - Reply to message to mute user
  - Removes all messaging permissions
  - Tracked in database
  - Can be reversed with unmute

- **Unmute** (`/unmute`)
  - Reply to message to unmute user
  - Restores all messaging permissions
  - Updates database status

- **Ban** (`/ban`)
  - Reply to message to ban user
  - Permanent removal from group
  - Database tracking for records
  - Cannot rejoin without unban

- **Set Admin** (`/setadmin`)
  - Reply to message to promote user
  - Grants access to all admin commands
  - Database flag for permission checking

### Raid Protection
- **Raid Mode** (`/raidmode`)
  - Toggle chat lockdown
  - Restricts non-admin messages
  - Quick response to attacks
  - Easy to enable/disable

### New Member Welcome
- Automatic greeting for new members
- Displays SUNE values and info
- Lists helpful commands
- Customizable welcome message

## Crypto Utilities

### Price Information
- **Current Price** (`/price`)
  - Real-time data from DexScreener
  - Shows price in USD
  - Market cap display
  - 24h volume
  - 24h price change percentage
  - Encouraging message based on performance

### Charts & Trading
- **View Charts** (`/chart`)
  - Direct links to DexScreener
  - Direct links to Birdeye
  - Interactive buttons for quick access

- **Buy Links** (`/buy`)
  - Pre-configured Jupiter swap link
  - Pre-configured Raydium swap link
  - One-click trading access

### Token Information
- **Contract Details** (`/contract`)
  - Verified contract address
  - Copy-paste friendly format
  - Blockchain information
  - Official social links
  - Links to Solscan and Birdeye explorers

- **Holder Count** (`/holders`)
  - Total holder statistics
  - Fetched from Birdeye API
  - Community growth metric

## Community Features

### Points System (Sun Points)
- **Earning Methods:**
  - Raid completion (10+ points)
  - Trivia answers (15 points)
  - Lucky spin (5-50 points)
  - Admin can award manually

- **Leaderboard** (`/leaderboard`)
  - Top 10 by Sun Points
  - Medal rankings
  - Username display
  - Real-time updates

- **Personal Stats** (`/mystats`)
  - Total Sun Points
  - Raids completed
  - Warning count
  - Join date
  - Personalized message

### Interactive Features

#### Polls
- **Create Polls** (`/poll`)
  - Multi-line format
  - Support for 2-10 options
  - Interactive voting buttons
  - Real-time results display
  - Visual progress bars
  - Percentage and vote count
  - Prevents duplicate votes

#### Games
- **Lucky Spin** (`/spin`)
  - Random point rewards (5-50)
  - 1-hour cooldown
  - Different rarity tiers
  - Cooldown tracking per user
  - Fun engagement tool

- **Trivia** (`/trivia`)
  - SUNE-related questions
  - Multiple choice format
  - 15 points for correct answer
  - Interactive button selection
  - Educational and fun

### Social Features
- **Morning Greeting** (`/gm`)
  - Random positive greetings
  - Community vibe building
  - Quick engagement

- **Encouragement** (`/shine`)
  - Random motivational messages
  - Positive reinforcement
  - Community morale boost

## Database Features

### User Management
- Automatic user creation on first interaction
- Tracks username, first name
- Sun Points balance
- Raid completion count
- Admin status
- Ban/mute status
- Warning count
- Wallet address (for future holder verification)
- Join date and last activity

### Data Persistence
- All user data stored in Supabase
- Raid history and participation
- Poll votes and results
- Warning history
- Bot configuration
- Leaderboard data

### Configuration
- **Dynamic Settings:**
  - Welcome message
  - Captcha status
  - Raid mode status
  - Spam threshold
  - Warning threshold

## Technical Features

### Error Handling
- Global error catcher
- User-friendly error messages
- Detailed console logging
- Graceful degradation
- Prevents bot crashes

### Performance
- Efficient database queries
- Minimal API calls
- Session management
- Proper async/await usage
- Memory-efficient tracking

### Scalability
- Modular code structure
- Easy to extend
- Clean separation of concerns
- Well-documented functions
- Reusable components

### Security
- RLS enabled on all tables
- Input validation
- SQL injection prevention
- Rate limiting
- Spam protection
- Admin-only command checks

## Planned Features (Future)

- Captcha verification for new members
- Wallet holder verification
- Holder-exclusive perks
- Automated scheduled raids
- Giveaway system
- NFT integration
- Sticker and meme commands
- Contest tracking
- XP system alongside Sun Points
- Multi-language support

## Brand Alignment

### SUNE Values Implementation
- **Positivity**: Encouraging messages throughout
- **Honesty**: Transparent operations and verified info
- **Fun**: Games, emojis, engaging interactions
- **Community**: Rewards participation and engagement
- **Long-term**: Points system rewards loyalty

### Tone Consistency
- Warm and friendly language
- Sun-themed messaging (☀️)
- No aggressive or spammy vibes
- Professional yet approachable
- Meme-friendly but tasteful

## Command Summary

### Public Commands (20)
`/start`, `/help`, `/price`, `/chart`, `/contract`, `/buy`, `/holders`, `/raid`, `/leaderboard`, `/raidleaderboard`, `/mystats`, `/gm`, `/shine`, `/poll`, `/spin`, `/trivia`

### Admin Commands (7)
`/createraid`, `/approveraid`, `/warn`, `/mute`, `/unmute`, `/ban`, `/setadmin`, `/raidmode`

**Total: 27 Commands**

## Integration Points

### External APIs
- DexScreener (price data)
- Birdeye (holder count, optional)
- Telegram Bot API
- Supabase (database)

### Social Links
- Twitter/X integration
- Telegram group management
- Contract verification links
- Trading platform links

---

This bot represents a complete community management solution built specifically for $SUNE's values and long-term vision. Keep shining! ☀️
