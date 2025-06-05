const express = require('express');
const PaymanController = require('../../controllers/paymanController');
const AuthMiddleware = require('../../middlewares/implementations/AuthMiddleware');
const catchAsync = require('../../utils/catchAsync');
const IRoute = require('../IRoute');

class PaymanRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['organization']));

    router.get('/key/:uid', catchAsync(PaymanController.getApiKey));
    router.post('/payee', catchAsync(PaymanController.createPayee));
    router.post('/send', catchAsync(PaymanController.sendPayment));
    router.get('/balance/:uid', catchAsync(PaymanController.getPaymanBalance));

    app.use('/api/payman', router);
  }
}

module.exports = PaymanRoutes;
