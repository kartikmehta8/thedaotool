const express = require('express');
const DiscordController = require('../../controllers/discordController');
const AuthMiddleware = require('../../middlewares/implementations/AuthMiddleware');
const ValidationMiddleware = require('../../middlewares/implementations/ValidationMiddleware');
const discordValidator = require('../../validators/discordValidators');
const catchAsync = require('../../utils/catchAsync');
const IRoute = require('../IRoute');

class DiscordRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.get(
      '/oauth',
      ValidationMiddleware.use(discordValidator.initiateOAuthSchema),
      catchAsync(DiscordController.initiateOAuth)
    );

    router.get(
      '/callback',
      ValidationMiddleware.use(discordValidator.callbackSchema),
      catchAsync(DiscordController.handleCallback)
    );

    router.get(
      '/channels/:uid',
      AuthMiddleware.authenticate(['organization']),
      ValidationMiddleware.use(discordValidator.uidParamSchema),
      catchAsync(DiscordController.getDiscordChannels)
    );
    router.put(
      '/channel/:uid',
      AuthMiddleware.authenticate(['organization']),
      ValidationMiddleware.use(discordValidator.saveChannelSchema),
      catchAsync(DiscordController.saveDiscordChannel)
    );

    app.use('/api/discord', router);
  }
}

module.exports = DiscordRoutes;
