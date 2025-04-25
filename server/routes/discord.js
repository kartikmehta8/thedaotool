const express = require('express');
const router = express.Router();
const {
  initiateOAuth,
  handleCallback,
  getDiscordChannels,
  saveDiscordChannel,
} = require('../controllers/discordController');

router.get('/oauth', initiateOAuth);
router.get('/callback', handleCallback);
router.get('/channels/:uid', getDiscordChannels);
router.put('/channel/:uid', saveDiscordChannel);

module.exports = router;
