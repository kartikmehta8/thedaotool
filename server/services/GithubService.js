const axios = require('axios');
const FirestoreService = require('./FirestoreService');

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.SERVER_URL}/api/github/callback`;

class GithubService {
  generateOAuthUrl(userId) {
    return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${REDIRECT_URI}&state=${userId || ''}`;
  }

  async exchangeCodeForAccessToken(code) {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { accept: 'application/json' },
      }
    );

    return response.data.access_token;
  }

  async saveAccessToken(uid, accessToken) {
    await FirestoreService.updateDocument('businesses', uid, {
      githubToken: accessToken,
    });
  }

  async listRepos(uid) {
    const businessData = await FirestoreService.getDocument('businesses', uid);
    const { githubToken } = businessData || {};

    if (!githubToken) {
      throw new Error('GitHub not authorized');
    }

    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${githubToken}` },
    });

    return response.data.map((repo) => repo.full_name);
  }

  async validateAndSaveRepo(uid, repoName) {
    const businessData = await FirestoreService.getDocument('businesses', uid);
    const { githubToken } = businessData || {};

    if (!githubToken) {
      throw new Error('GitHub not authorized');
    }

    await axios.get(`https://api.github.com/repos/${repoName}`, {
      headers: { Authorization: `Bearer ${githubToken}` },
    });

    await FirestoreService.updateDocument('businesses', uid, {
      repo: repoName,
    });
  }
}

module.exports = new GithubService();
