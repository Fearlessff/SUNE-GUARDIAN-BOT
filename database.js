import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';

export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export async function getOrCreateUser(telegramUser) {
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', telegramUser.id)
    .maybeSingle();

  if (existingUser) {
    await supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('id', telegramUser.id);
    return existingUser;
  }

  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      id: telegramUser.id,
      username: telegramUser.username || null,
      first_name: telegramUser.first_name || 'User',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return newUser;
}

export async function addSunPoints(userId, points) {
  const { data, error } = await supabase.rpc('increment_sun_points', {
    user_id: userId,
    points_to_add: points,
  });

  if (error) {
    await supabase
      .from('users')
      .update({
        sun_points: supabase.raw(`sun_points + ${points}`)
      })
      .eq('id', userId);
  }
}

export async function getLeaderboard(type = 'points', limit = 10) {
  const orderBy = type === 'raids' ? 'raids_completed' : 'sun_points';

  const { data, error } = await supabase
    .from('users')
    .select('id, username, first_name, sun_points, raids_completed')
    .order(orderBy, { ascending: false })
    .limit(limit);

  return data || [];
}

export async function createRaid(title, url, description, createdBy, pointsReward = 10) {
  const { data, error } = await supabase
    .from('raids')
    .insert({
      title,
      url,
      description,
      points_reward: pointsReward,
      created_by: createdBy,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating raid:', error);
    return null;
  }

  return data;
}

export async function getActiveRaids() {
  const { data } = await supabase
    .from('raids')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return data || [];
}

export async function submitRaidProof(raidId, userId, proofUrl) {
  const { data, error } = await supabase
    .from('raid_participants')
    .insert({
      raid_id: raidId,
      user_id: userId,
      proof_url: proofUrl,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting raid proof:', error);
    return null;
  }

  return data;
}

export async function approveRaidParticipation(participationId, raidId, userId) {
  const { data: raid } = await supabase
    .from('raids')
    .select('points_reward')
    .eq('id', raidId)
    .single();

  await supabase
    .from('raid_participants')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', participationId);

  await supabase
    .from('users')
    .update({
      sun_points: supabase.raw(`sun_points + ${raid.points_reward}`),
      raids_completed: supabase.raw('raids_completed + 1'),
    })
    .eq('id', userId);

  return true;
}

export async function addWarning(userId, reason, issuedBy) {
  await supabase
    .from('warnings')
    .insert({
      user_id: userId,
      reason,
      issued_by: issuedBy,
    });

  const { data: user } = await supabase
    .from('users')
    .select('warning_count')
    .eq('id', userId)
    .single();

  const newCount = (user?.warning_count || 0) + 1;

  await supabase
    .from('users')
    .update({ warning_count: newCount })
    .eq('id', userId);

  return newCount;
}

export async function banUser(userId) {
  await supabase
    .from('users')
    .update({ is_banned: true })
    .eq('id', userId);
}

export async function muteUser(userId) {
  await supabase
    .from('users')
    .update({ is_muted: true })
    .eq('id', userId);
}

export async function unmuteUser(userId) {
  await supabase
    .from('users')
    .update({ is_muted: false })
    .eq('id', userId);
}

export async function isUserAdmin(userId) {
  const { data } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle();

  return data?.is_admin || false;
}

export async function isUserBanned(userId) {
  const { data } = await supabase
    .from('users')
    .select('is_banned')
    .eq('id', userId)
    .maybeSingle();

  return data?.is_banned || false;
}

export async function isUserMuted(userId) {
  const { data } = await supabase
    .from('users')
    .select('is_muted')
    .eq('id', userId)
    .maybeSingle();

  return data?.is_muted || false;
}

export async function createPoll(question, options, createdBy, endsAt) {
  const { data, error } = await supabase
    .from('polls')
    .insert({
      question,
      options: JSON.stringify(options),
      created_by: createdBy,
      ends_at: endsAt,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating poll:', error);
    return null;
  }

  return data;
}

export async function votePoll(pollId, userId, optionIndex) {
  const { data, error } = await supabase
    .from('poll_votes')
    .insert({
      poll_id: pollId,
      user_id: userId,
      option_index: optionIndex,
    })
    .select()
    .single();

  if (error) {
    console.error('Error voting on poll:', error);
    return null;
  }

  return data;
}
