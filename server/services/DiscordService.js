const axios = require('axios');
const FirestoreService = require('./FirestoreService');

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.SERVER_URL}/api/discord/callback`;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

class DiscordService {
  generateOAuthURL(userId) {
    return `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=identify+guilds+bot&permissions=3072&state=${userId}`;
  }

  async exchangeCodeForToken(code) {
    const response = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data.access_token;
  }

  async saveAccessTokenToBusiness(uid, accessToken) {
    return FirestoreService.updateDocument('businesses', uid, {
      discordAccessToken: accessToken,
      discordEnabled: true,
    });
  }

  async fetchMutualGuildChannels(uid) {
    const businessData = await FirestoreService.getDocument('businesses', uid);

    if (!businessData?.discordAccessToken) {
      throw new Error('Unauthorized');
    }

    const { discordAccessToken } = businessData;

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
    return FirestoreService.updateDocument('businesses', uid, {
      discordChannel: channelId,
    });
  }
}

module.exports = new DiscordService();
