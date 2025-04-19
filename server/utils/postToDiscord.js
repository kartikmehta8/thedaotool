const axios = require('axios');
const { db } = require('./firebase');
const { doc, getDoc } = require('firebase/firestore');

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const postToDiscord = async (contract) => {
  try {
    const businessRef = doc(db, 'businesses', contract.businessId);
    const snap = await getDoc(businessRef);

    if (!snap.exists()) return;

    const business = snap.data();
    if (!business.discordEnabled || !business.discordChannel) return;

    if (business.discordSendMode === 'own' && contract.businessId !== snap.id)
      return;

    const message = {
      content: `📢 **New Contract Listed**\n\n**Title:** ${contract.name}\n**Amount:** $${contract.amount || 'N/A'}\n**Description:** ${contract.description?.slice(0, 180)}...\n\n[View on Platform](${process.env.FRONTEND_URL}/dashboard)`,
    };

    await axios.post(
      `https://discord.com/api/channels/${business.discordChannel}/messages`,
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
