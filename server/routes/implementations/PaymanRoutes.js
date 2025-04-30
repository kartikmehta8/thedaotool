const express = require('express');
const PaymanController = require('../../controllers/paymanController');
const AuthMiddleware = require('../../middlewares/implementations/AuthMiddleware');
const IRoute = require('../IRoute');

class PaymanRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['business']));

    router.get('/key/:uid', PaymanController.getApiKey);
    router.post('/payee', PaymanController.createPayee);
    router.post('/send', PaymanController.sendPayment);
    router.get('/balance/:uid', PaymanController.getPaymanBalance);

    app.use('/api/payman', router);
  }
}

module.exports = PaymanRoutes;
