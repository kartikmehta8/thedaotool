const GithubService = require('../services/GithubService');
const ResponseHelper = require('../utils/ResponseHelper');

class GithubController {
  async initiateOAuth(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return ResponseHelper.badRequest(res, 'Missing user ID');
      }

      const redirectUrl = await GithubService.generateOAuthUrl(userId);
      console.log('Redirect URL:', redirectUrl);
      res.json({ redirectUrl });
    } catch (err) {
      return ResponseHelper.internalError(res, 'OAuth initiation failed');
    }
  }

  async handleCallback(req, res) {
    const { code, state } = req.query;
    try {
      const { accessToken, userId } =
        await GithubService.exchangeCodeForAccessToken(code, state);
      await GithubService.saveAccessToken(userId, accessToken);
      res.redirect(`${process.env.FRONTEND_URL}/profile/business`);
    } catch (err) {
      return res.status(500).send('GitHub authorization failed.');
    }
  }

  async listRepos(req, res) {
    try {
      const { uid } = req.params;
      const repos = await GithubService.listRepos(uid);
      return ResponseHelper.success(res, 'Repositories fetched', { repos });
    } catch (err) {
      if (err.message === 'GitHub not authorized') {
        return ResponseHelper.unauthorized(res, err.message);
      }
      return ResponseHelper.internalError(res, 'Failed to fetch repositories');
    }
  }

  async saveSelectedRepo(req, res) {
    try {
      const { uid } = req.params;
      const { repo } = req.body;

      if (!repo) {
        return ResponseHelper.badRequest(res, 'Repository name is required');
      }

      await GithubService.validateAndSaveRepo(uid, repo);
      return ResponseHelper.success(res, 'Repository saved');
    } catch (err) {
      return ResponseHelper.badRequest(
        res,
        'Invalid repository or access denied'
      );
    }
  }
}

module.exports = new GithubController();
