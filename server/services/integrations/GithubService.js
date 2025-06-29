const axios = require('axios');
const FirestoreService = require('@services/database/FirestoreService');
const crypto = require('crypto');
const CacheService = require('@services/misc/CacheService');
const ApiError = require('@utils/ApiError');

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.SERVER_URL}/api/github/callback`;

class GithubService {
  generateStateToken() {
    return crypto.randomBytes(16).toString('hex');
  }

  async generateOAuthUrl(userId) {
    const state = this.generateStateToken();

    await FirestoreService.setDocument('oauth_states', state, {
      userId,
      createdAt: Date.now(),
      redirectUri: REDIRECT_URI,
    });

    return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=repo&state=${state}`;
  }

  async validateOAuthState(state) {
    const stored = await FirestoreService.getDocument('oauth_states', state);

    if (!stored) {
      throw new ApiError('Invalid or expired OAuth state', 401);
    }

    await FirestoreService.deleteDocument('oauth_states', state);
    return stored.userId;
  }

  async exchangeCodeForAccessToken(code, state) {
    const userId = await this.validateOAuthState(state);

    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      },
      {
        headers: { accept: 'application/json' },
      }
    );

    if (!response.data.access_token) {
      throw new ApiError('GitHub token exchange failed', 400);
    }

    return { accessToken: response.data.access_token, userId };
  }

  async saveAccessToken(uid, accessToken) {
    await FirestoreService.updateDocument('organizations', uid, {
      githubToken: accessToken,
    });
    await CacheService.del(`GET:/api/organization/profile/${uid}`);
  }

  async listRepos(uid) {
    const organizationData = await FirestoreService.getDocument(
      'organizations',
      uid
    );
    const { githubToken } = organizationData || {};

    if (!githubToken) {
      throw new ApiError('GitHub not authorized', 401);
    }

    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${githubToken}` },
    });

    return response.data.map((repo) => repo.full_name);
  }

  async validateAndSaveRepo(uid, repoName) {
    const organizationData = await FirestoreService.getDocument(
      'organizations',
      uid
    );
    const { githubToken } = organizationData || {};

    if (!githubToken) {
      throw new ApiError('GitHub not authorized', 401);
    }

    await axios.get(`https://api.github.com/repos/${repoName}`, {
      headers: { Authorization: `Bearer ${githubToken}` },
    });

    await FirestoreService.updateDocument('organizations', uid, {
      repo: repoName,
    });
    await CacheService.del(`GET:/api/organization/profile/${uid}`);
  }

  async fetchOpenIssues(repo, token) {
    const response = await axios.get(
      `https://api.github.com/repos/${repo}/issues`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { labels: 'dao', state: 'open' },
      }
    );
    return response.data;
  }

  prepareUpdatedLabels(labels) {
    return Array.from(
      new Set(
        labels
          .filter((l) => l.name.toLowerCase() !== 'dao')
          .map((l) => l.name)
          .concat('dao-platform')
      )
    ).filter((l) => typeof l === 'string' && l.trim() !== '');
  }

  async updateIssueLabels(repo, issueNumber, labels, token) {
    await axios.patch(
      `https://api.github.com/repos/${repo}/issues/${issueNumber}`,
      { labels },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );
  }
}

module.exports = new GithubService();
