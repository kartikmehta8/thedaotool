const axios = require('axios');
const FirestoreService = require('@services/database/FirestoreService');
const crypto = require('crypto');
const CacheService = require('@services/misc/CacheService');
const ApiError = require('@utils/ApiError');

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.SERVER_URL}/api/discord/callback`;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DEFAULT_SCOPE = 'identify guilds bot';
const STATE_LENGTH = 32;

function generateRandomState() {
  return crypto.randomBytes(STATE_LENGTH).toString('hex');
}

class DiscordService {
  generateOAuthURL(userId) {
    const state = generateRandomState() + ':' + userId;
    return `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=${encodeURIComponent(DEFAULT_SCOPE)}&permissions=3072&state=${state}`;
  }

  validateRedirectUri(receivedUri) {
    return receivedUri === REDIRECT_URI;
  }

  extractUserIdFromState(state) {
    return state.split(':')[1] || null;
  }

  async exchangeCodeForToken(code, redirectUri) {
    if (!this.validateRedirectUri(redirectUri)) {
      throw new ApiError('Invalid redirect URI', 400);
    }

    const response = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data.access_token;
  }

  async saveAccessTokenToOrganization(uid, accessToken) {
    await FirestoreService.updateDocument('organizations', uid, {
      discordAccessToken: accessToken,
      discordEnabled: true,
    });
    await CacheService.del(`GET:/api/organization/profile/${uid}`);
  }

  async fetchMutualGuildChannels(uid) {
    const organizationData = await FirestoreService.getDocument(
      'organizations',
      uid
    );

    if (!organizationData?.discordAccessToken) {
      throw new ApiError('Unauthorized', 401);
    }

    const { discordAccessToken } = organizationData;

    const userGuilds = await axios.get(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: { Authorization: `Bearer ${discordAccessToken}` },
      }
    );

    const botGuilds = await axios.get(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
      }
    );

    const userGuildIds = new Set(userGuilds.data.map((g) => g.id));
    const mutualGuilds = botGuilds.data.filter((g) => userGuildIds.has(g.id));

    const channels = [];

    for (const guild of mutualGuilds) {
      try {
        const guildChannels = await axios.get(
          `https://discord.com/api/guilds/${guild.id}/channels`,
          {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
          }
        );

        const textChannels = guildChannels.data.filter((ch) => ch.type === 0);
        textChannels.forEach((ch) =>
          channels.push({ id: ch.id, name: ch.name })
        );
      } catch (err) {
        console.warn(`Could not fetch channels for guild ${guild.id}`);
      }
    }

    return channels;
  }

  async saveDiscordChannel(uid, channelId) {
    await FirestoreService.updateDocument('organizations', uid, {
      discordChannel: channelId,
    });
    await CacheService.del(`GET:/api/organization/profile/${uid}`);
  }
}

module.exports = new DiscordService();
