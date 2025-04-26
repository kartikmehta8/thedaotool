const express = require('express');
const DiscordController = require('../../controllers/discordController');
const IRoute = require('../IRoute');

class DiscordRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.get('/oauth', DiscordController.initiateOAuth);
    router.get('/callback', DiscordController.handleCallback);
    router.get('/channels/:uid', DiscordController.getDiscordChannels);
    router.put('/channel/:uid', DiscordController.saveDiscordChannel);

    app.use('/api/discord', router);
  }
}

module.exports = DiscordRoutes;
