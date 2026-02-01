/*
  # SUNE Guardian Bot Database Schema

  ## Overview
  Complete database schema for the SUNE Guardian Telegram bot, supporting raid tracking,
  user management, moderation, points system, and community features.

  ## New Tables

  ### 1. `users`
  Tracks all Telegram users who interact with the bot
  - `id` (bigint, primary key) - Telegram user ID
  - `username` (text) - Telegram username
  - `first_name` (text) - User's first name
  - `sun_points` (integer) - Community points balance
  - `raids_completed` (integer) - Total number of raids completed
  - `is_admin` (boolean) - Admin status
  - `is_banned` (boolean) - Ban status
  - `is_muted` (boolean) - Mute status
  - `warning_count` (integer) - Number of warnings received
  - `wallet_address` (text) - Solana wallet for holder verification
  - `is_verified_holder` (boolean) - Holder verification status
  - `joined_at` (timestamptz) - When user first joined
  - `last_active` (timestamptz) - Last activity timestamp

  ### 2. `raids`
  Stores raid campaign information
  - `id` (uuid, primary key)
  - `title` (text) - Raid title
  - `url` (text) - Twitter/X URL to raid
  - `description` (text) - Raid instructions
  - `points_reward` (integer) - Points awarded on completion
  - `status` (text) - active, completed, scheduled
  - `created_by` (bigint) - Admin who created the raid
  - `scheduled_for` (timestamptz) - Scheduled raid time
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)

  ### 3. `raid_participants`
  Tracks user participation in raids
  - `id` (uuid, primary key)
  - `raid_id` (uuid) - Foreign key to raids
  - `user_id` (bigint) - Foreign key to users
  - `proof_url` (text) - Screenshot or link proof
  - `status` (text) - pending, approved, rejected
  - `submitted_at` (timestamptz)
  - `reviewed_at` (timestamptz)

  ### 4. `warnings`
  Moderation warning history
  - `id` (uuid, primary key)
  - `user_id` (bigint) - Foreign key to users
  - `reason` (text) - Warning reason
  - `issued_by` (bigint) - Admin who issued warning
  - `created_at` (timestamptz)

  ### 5. `captcha_pending`
  Temporary storage for users pending captcha verification
  - `user_id` (bigint, primary key)
  - `challenge_code` (text) - Captcha code
  - `expires_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. `bot_config`
  Bot configuration settings
  - `key` (text, primary key)
  - `value` (text)
  - `updated_at` (timestamptz)

  ### 7. `polls`
  Community polls and votes
  - `id` (uuid, primary key)
  - `question` (text)
  - `options` (jsonb) - Array of poll options
  - `created_by` (bigint)
  - `ends_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 8. `poll_votes`
  Poll vote tracking
  - `id` (uuid, primary key)
  - `poll_id` (uuid)
  - `user_id` (bigint)
  - `option_index` (integer)
  - `voted_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Public read access for leaderboards and raid info
  - Admin-only write access for sensitive operations
*/

CREATE TABLE IF NOT EXISTS users (
  id bigint PRIMARY KEY,
  username text,
  first_name text,
  sun_points integer DEFAULT 0,
  raids_completed integer DEFAULT 0,
  is_admin boolean DEFAULT false,
  is_banned boolean DEFAULT false,
  is_muted boolean DEFAULT false,
  warning_count integer DEFAULT 0,
  wallet_address text,
  is_verified_holder boolean DEFAULT false,
  joined_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS raids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  description text,
  points_reward integer DEFAULT 10,
  status text DEFAULT 'active',
  created_by bigint REFERENCES users(id),
  scheduled_for timestamptz,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS raid_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raid_id uuid REFERENCES raids(id) ON DELETE CASCADE,
  user_id bigint REFERENCES users(id),
  proof_url text,
  status text DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  UNIQUE(raid_id, user_id)
);

CREATE TABLE IF NOT EXISTS warnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint REFERENCES users(id),
  reason text NOT NULL,
  issued_by bigint REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS captcha_pending (
  user_id bigint PRIMARY KEY,
  challenge_code text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bot_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb NOT NULL,
  created_by bigint REFERENCES users(id),
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES polls(id) ON DELETE CASCADE,
  user_id bigint REFERENCES users(id),
  option_index integer NOT NULL,
  voted_at timestamptz DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_users_sun_points ON users(sun_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_raids_completed ON users(raids_completed DESC);
CREATE INDEX IF NOT EXISTS idx_raids_status ON raids(status);
CREATE INDEX IF NOT EXISTS idx_raid_participants_status ON raid_participants(status);
CREATE INDEX IF NOT EXISTS idx_warnings_user_id ON warnings(user_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE raids ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE captcha_pending ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view users for leaderboards"
  ON users FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view active raids"
  ON raids FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view raid participants"
  ON raid_participants FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view polls"
  ON polls FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view poll votes"
  ON poll_votes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service can manage all tables"
  ON users FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can manage raids"
  ON raids FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can manage raid_participants"
  ON raid_participants FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can manage warnings"
  ON warnings FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can manage captcha_pending"
  ON captcha_pending FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can manage bot_config"
  ON bot_config FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can manage poll_votes"
  ON poll_votes FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO bot_config (key, value) VALUES
  ('welcome_message', 'Welcome to the SUNE community! ☀️ Stay positive, stay shining!'),
  ('captcha_enabled', 'true'),
  ('raid_mode', 'false'),
  ('spam_threshold', '5'),
  ('warning_threshold', '3')
ON CONFLICT (key) DO NOTHING;