import { API_URL } from '../../constants/constants';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const fetchDiscordProfile = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/organization/profile/${uid}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to load Discord profile');
  }
  const { profile } = await res.json();
  return profile;
};

export const fetchDiscordChannels = async (uid) => {
  const res = await fetchWithAuth(`${API_URL}/discord/channels/${uid}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch Discord channels');
  }
  const data = await res.json();
  return data.channels || [];
};

export const updateDiscordSettings = async (uid, updatedProfile) => {
  const res = await fetchWithAuth(`${API_URL}/organization/profile/${uid}`, {
    method: 'PUT',
    body: JSON.stringify(updatedProfile),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update Discord settings');
  }
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
  const res = await fetchWithAuth(`${API_URL}/discord/channel/${uid}`, {
    method: 'PUT',
    body: JSON.stringify({ channelId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to save Discord channel');
  }
  return true;
};

export const fetchDiscordOAuthUrl = async (uid) => {
  const res = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/discord/oauth?userId=${uid}`
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to get Discord OAuth URL');
  }
  const { redirectUrl } = await res.json();
  return redirectUrl;
};
