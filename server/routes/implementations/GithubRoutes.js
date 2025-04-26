const express = require('express');
const GithubController = require('../../controllers/githubController');
const IRoute = require('../IRoute');

class GithubRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.get('/auth', GithubController.initiateOAuth);
    router.get('/callback', GithubController.handleCallback);
    router.get('/repos/:uid', GithubController.listRepos);
    router.post('/repo/:uid', GithubController.saveSelectedRepo);

    app.use('/api/github', router);
  }
}

module.exports = GithubRoutes;
