const axios = require('axios');
const FirestoreService = require('../services/FirestoreService');

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const postToDiscord = async (contract) => {
  try {
    const business = await FirestoreService.getDocument(
      'businesses',
      contract.businessId
    );

    if (!business) return;

    const { discordEnabled, discordChannel, discordSendMode } = business;

    if (!discordEnabled || !discordChannel) return;
    if (
      discordSendMode === 'own' &&
      contract.businessId !== contract.businessId
    )
      return;

    const message = {
      content: `📢 **New Contract Listed**\n\n**Title:** ${contract.name}\n**Amount:** $${contract.amount || 'N/A'}\n**Description:** ${contract.description?.slice(0, 180) || ''}...\n\n[View on Platform](${process.env.FRONTEND_URL}/dashboard)`,
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
    console.error('❌ Failed to post to Discord:', err.message);
  }
};

module.exports = postToDiscord;
