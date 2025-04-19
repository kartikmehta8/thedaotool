const axios = require('axios');
const { db } = require('../utils/firebase');
const { doc, updateDoc, getDoc } = require('firebase/firestore');

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.SERVER_URL}/api/discord/callback`;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const initiateOAuth = (req, res) => {
  const { userId } = req.query;
  const redirect = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=identify+guilds+bot&permissions=3072&state=${userId}`;
  res.redirect(redirect);
};

const handleCallback = async (req, res) => {
  const { code, state } = req.query;

  try {
    const tokenRes = await axios.post(
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

    const { access_token } = tokenRes.data;

    await updateDoc(doc(db, 'businesses', state), {
      discordAccessToken: access_token,
      discordEnabled: true,
    });

    res.redirect(`${process.env.FRONTEND_URL}/profile/business`);
  } catch (err) {
    console.error('Discord OAuth Error:', err.message);
    res.status(500).send('Discord authorization failed.');
  }
};

const getDiscordChannels = async (req, res) => {
  const { uid } = req.params;

  try {
    const businessSnap = await getDoc(doc(db, 'businesses', uid));
    const { discordAccessToken } = businessSnap.data();
    if (!discordAccessToken)
      return res.status(401).json({ error: 'Unauthorized' });

    const guildsRes = await axios.get(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: { Authorization: `Bearer ${discordAccessToken}` },
      }
    );

    const botGuildsRes = await axios.get(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
      }
    );

    const userGuildIds = new Set(guildsRes.data.map((g) => g.id));
    const mutualGuilds = botGuildsRes.data.filter((g) =>
      userGuildIds.has(g.id)
    );

    const channels = [];
    for (const guild of mutualGuilds) {
      try {
        const chRes = await axios.get(
          `https://discord.com/api/guilds/${guild.id}/channels`,
          {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
          }
        );

        const textChannels = chRes.data.filter((ch) => ch.type === 0);
        textChannels.forEach((ch) =>
          channels.push({ id: ch.id, name: ch.name })
        );
      } catch (err) {
        console.warn(`Could not fetch channels for guild ${guild.id}`);
      }
    }

    res.json({ channels });
  } catch (err) {
    console.error('Failed to fetch Discord channels:', err.message);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
};

const saveDiscordChannel = async (req, res) => {
  const { uid } = req.params;
  const { channelId } = req.body;

  try {
    await updateDoc(doc(db, 'businesses', uid), { discordChannel: channelId });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to save Discord channel:', err.message);
    res.status(500).json({ error: 'Failed to save channel' });
  }
};

module.exports = {
  initiateOAuth,
  handleCallback,
  getDiscordChannels,
  saveDiscordChannel,
};
