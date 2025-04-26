const express = require('express');
const {
  getApiKey,
  createPayee,
  sendPayment,
  getPaymanBalance,
} = require('../../controllers/paymanController');
const IRoute = require('../IRoute');

class PaymanRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.get('/key/:uid', getApiKey);
    router.post('/payee', createPayee);
    router.post('/send', sendPayment);
    router.get('/balance/:uid', getPaymanBalance);

    app.use('/api/payman', router);
  }
}

module.exports = PaymanRoutes;
