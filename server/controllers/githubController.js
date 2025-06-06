const GithubService = require('@services/integrations/GithubService');
const ResponseHelper = require('@utils/ResponseHelper');
const { githubSyncQueue } = require('@queues');

class GithubController {
  async initiateOAuth(req, res) {
    const { userId } = req.query;

    if (!userId) {
      return ResponseHelper.badRequest(res, 'Missing user ID');
    }

    const redirectUrl = await GithubService.generateOAuthUrl(userId);
    res.json({ redirectUrl });
  }

  async handleCallback(req, res) {
    const { code, state } = req.query;
    const { accessToken, userId } =
      await GithubService.exchangeCodeForAccessToken(code, state);
    await GithubService.saveAccessToken(userId, accessToken);
    res.redirect(`${process.env.FRONTEND_URL}/profile/organization`);
  }

  async listRepos(req, res) {
    const { uid } = req.params;
    const repos = await GithubService.listRepos(uid);
    return ResponseHelper.success(res, 'Repositories fetched', { repos });
  }

  async saveSelectedRepo(req, res) {
    const { uid } = req.params;
    const { repo } = req.body;

    if (!repo) {
      return ResponseHelper.badRequest(res, 'Repository name is required');
    }

    await GithubService.validateAndSaveRepo(uid, repo);
    await githubSyncQueue.add('githubSync', {});
    return ResponseHelper.success(res, 'Repository saved');
  }
}

module.exports = new GithubController();
