const express = require('express');
const router = express.Router();
const {
  handleCallback,
  initiateOAuth,
  listRepos,
  saveSelectedRepo,
} = require('../controllers/githubController');

router.get('/auth', initiateOAuth);
router.get('/callback', handleCallback);
router.get('/repos/:uid', listRepos);
router.post('/repo/:uid', saveSelectedRepo);

module.exports = router;
