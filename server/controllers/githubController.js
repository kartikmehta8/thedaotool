const GithubService = require('../services/GithubService');
const ResponseHelper = require('../utils/ResponseHelper');

class GithubController {
  initiateOAuth(req, res) {
    try {
      const { userId } = req.query;
      const redirectUrl = GithubService.generateOAuthUrl(userId);
      res.redirect(redirectUrl);
    } catch (err) {
      console.error('Initiate OAuth Error:', err.message);
      return ResponseHelper.error(res, 'OAuth initiation failed');
    }
  }

  async handleCallback(req, res) {
    const { code, state } = req.query;
    try {
      const accessToken = await GithubService.exchangeCodeForAccessToken(code);
      await GithubService.saveAccessToken(state, accessToken);
      res.redirect(`${process.env.FRONTEND_URL}/profile/business`);
    } catch (err) {
      console.error('GitHub OAuth Callback Error:', err.message);
      res.status(500).send('GitHub authorization failed.');
    }
  }

  async listRepos(req, res) {
    try {
      const { uid } = req.params;
      const repos = await GithubService.listRepos(uid);
      return ResponseHelper.success(res, 'Repositories fetched', { repos });
    } catch (err) {
      if (err.message === 'GitHub not authorized') {
        return ResponseHelper.error(res, err.message, 401);
      }
      console.error('List Repos Error:', err.message);
      return ResponseHelper.error(res, 'Failed to fetch repositories');
    }
  }

  async saveSelectedRepo(req, res) {
    try {
      const { uid } = req.params;
      const { repo } = req.body;
      await GithubService.validateAndSaveRepo(uid, repo);
      return ResponseHelper.success(res, 'Repository saved');
    } catch (err) {
      if (err.message === 'GitHub not authorized') {
        return ResponseHelper.error(res, err.message, 401);
      }
      console.error('Save Repo Error:', err.message);
      return ResponseHelper.error(
        res,
        'Invalid repository or access denied',
        400
      );
    }
  }
}

module.exports = new GithubController();
