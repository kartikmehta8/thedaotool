const express = require('express');
const {
  getApiKey,
  createPayee,
  sendPayment,
  getPaymanBalance,
} = require('../controllers/paymanController');

const router = express.Router();

router.get('/key/:uid', getApiKey);
router.post('/payee', createPayee);
router.post('/send', sendPayment);
router.get('/balance/:uid', getPaymanBalance);

module.exports = router;
