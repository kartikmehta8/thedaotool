const express = require('express');
const {
  handleCallback,
  initiateOAuth,
  listRepos,
  saveSelectedRepo,
} = require('../../controllers/githubController');
const IRoute = require('../IRoute');

class GithubRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.get('/auth', initiateOAuth);
    router.get('/callback', handleCallback);
    router.get('/repos/:uid', listRepos);
    router.post('/repo/:uid', saveSelectedRepo);

    app.use('/api/github', router);
  }
}

module.exports = GithubRoutes;
