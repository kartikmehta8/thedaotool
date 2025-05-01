const DiscordService = require('../services/DiscordService');
const ResponseHelper = require('../utils/ResponseHelper');

class DiscordController {
  initiateOAuth(req, res) {
    const { userId } = req.query;
    if (!userId) {
      return ResponseHelper.badRequest(res, 'Missing user ID');
    }
    const redirectURL = DiscordService.generateOAuthURL(userId);
    return res.json({ redirectUrl: redirectURL });
  }

  async handleCallback(req, res) {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).send('Missing OAuth parameters.');
    }

    try {
      const userId = DiscordService.extractUserIdFromState(state);
      if (!userId) {
        return res.status(400).send('Invalid state parameter.');
      }

      const accessToken = await DiscordService.exchangeCodeForToken(
        code,
        process.env.SERVER_URL + '/api/discord/callback'
      );
      await DiscordService.saveAccessTokenToBusiness(userId, accessToken);
      res.redirect(`${process.env.FRONTEND_URL}/profile/business`);
    } catch (err) {
      res.status(500).send('Discord authorization failed.');
    }
  }

  async getDiscordChannels(req, res) {
    try {
      const channels = await DiscordService.fetchMutualGuildChannels(
        req.params.uid
      );
      return ResponseHelper.success(res, 'Channels fetched', { channels });
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return ResponseHelper.unauthorized(res);
      }
      return ResponseHelper.error(res, 'Failed to fetch channels');
    }
  }

  async saveDiscordChannel(req, res) {
    const { uid } = req.params;
    const { channelId } = req.body;

    try {
      await DiscordService.saveDiscordChannel(uid, channelId);
      return ResponseHelper.success(res, 'Channel saved');
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to save channel');
    }
  }
}

module.exports = new DiscordController();
