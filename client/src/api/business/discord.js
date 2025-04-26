import { API_URL } from '../../constants/constants';

export const fetchDiscordProfile = async (uid) => {
  const res = await fetch(`${API_URL}/business/profile/${uid}`);
  if (!res.ok) throw new Error('Failed to load Discord profile');
  const { profile } = await res.json();
  return profile;
};

export const fetchDiscordChannels = async (uid) => {
  const res = await fetch(`${API_URL}/discord/channels/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch Discord channels');
  const data = await res.json();
  return data.channels || [];
};

export const updateDiscordSettings = async (uid, updatedProfile) => {
  const res = await fetch(`${API_URL}/business/profile/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProfile),
  });
  if (!res.ok) throw new Error('Failed to update Discord settings');
  return true;
};

export const disconnectDiscord = async (uid, profile) => {
  const changes = {
    discordAccessToken: '',
    discordChannel: '',
    discordGuild: '',
    discordEnabled: false,
    discordSendMode: '',
  };
  await updateDiscordSettings(uid, { ...profile, ...changes });
  return true;
};

export const saveDiscordChannel = async (uid, channelId) => {
  const res = await fetch(`${API_URL}/discord/channel/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channelId }),
  });
  if (!res.ok) throw new Error('Failed to save Discord channel');
  return true;
};
