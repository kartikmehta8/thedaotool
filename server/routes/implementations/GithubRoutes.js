const express = require('express');
const GithubController = require('../../controllers/githubController');
const AuthMiddleware = require('../../middlewares/implementations/AuthMiddleware');
const ValidationMiddleware = require('../../middlewares/implementations/ValidationMiddleware');
const githubValidator = require('../../validators/githubValidators');
const catchAsync = require('../../utils/catchAsync');
const IRoute = require('../IRoute');

class GithubRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.get(
      '/auth',
      ValidationMiddleware.use(githubValidator.initiateOAuthSchema),
      catchAsync(GithubController.initiateOAuth)
    );

    router.get(
      '/callback',
      ValidationMiddleware.use(githubValidator.callbackSchema),
      catchAsync(GithubController.handleCallback)
    );

    router.get(
      '/repos/:uid',
      AuthMiddleware.authenticate(['organization']),
      ValidationMiddleware.use(githubValidator.uidParamSchema),
      catchAsync(GithubController.listRepos)
    );
    router.post(
      '/repo/:uid',
      AuthMiddleware.authenticate(['organization']),
      ValidationMiddleware.use(githubValidator.saveRepoSchema),
      catchAsync(GithubController.saveSelectedRepo)
    );

    app.use('/api/github', router);
  }
}

module.exports = GithubRoutes;
