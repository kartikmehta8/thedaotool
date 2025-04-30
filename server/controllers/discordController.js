const DiscordService = require('../services/DiscordService');
const ResponseHelper = require('../utils/ResponseHelper');

class DiscordController {
  initiateOAuth(req, res) {
    const { userId } = req.query;
    const redirectURL = DiscordService.generateOAuthURL(userId);
    res.redirect(redirectURL);
  }

  async handleCallback(req, res) {
    const { code, state } = req.query;

    try {
      const accessToken = await DiscordService.exchangeCodeForToken(code);
      await DiscordService.saveAccessTokenToBusiness(state, accessToken);

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
        return ResponseHelper.error(res, 'Unauthorized', 401);
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
