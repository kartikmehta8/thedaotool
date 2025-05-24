const axios = require('axios');
const FirestoreService = require('../services/database/FirestoreService');

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const postToDiscord = async (bounty) => {
  try {
    const organization = await FirestoreService.getDocument(
      'organizations',
      bounty.organizationId
    );

    if (!organization) return;

    const { discordEnabled, discordChannel, discordSendMode } = organization;

    if (!discordEnabled || !discordChannel) return;
    if (
      discordSendMode === 'own' &&
      bounty.organizationId !== bounty.organizationId
    )
      return;

    const message = {
      content: `📢 **New Bounty Listed**\n\n**Title:** ${bounty.name}\n**Amount:** $${bounty.amount || 'N/A'}\n**Description:** ${bounty.description?.slice(0, 180) || ''}...\n\n[View on Platform](${process.env.FRONTEND_URL}/dashboard)`,
    };

    await axios.post(
      `https://discord.com/api/channels/${discordChannel}/messages`,
      message,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('Failed to post to Discord:', err.message);
  }
};

module.exports = postToDiscord;
