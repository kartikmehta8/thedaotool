const express = require('express');
const WalletController = require('@controllers/walletController');
const AuthMiddleware = require('@middlewares/implementations/auth/AuthMiddleware');
const ValidationMiddleware = require('@middlewares/implementations/validation/ValidationMiddleware');
const walletValidator = require('@validators/walletValidators');
const catchAsync = require('@utils/catchAsync');
const IRoute = require('../IRoute');

class WalletRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['organization', 'contributor']));

    router.get('/balance', catchAsync(WalletController.getBalance));

    router.post(
      '/send',
      ValidationMiddleware.use(walletValidator.sendSchema),
      catchAsync(WalletController.send)
    );

    app.use('/api/wallet', router);
  }
}

module.exports = WalletRoutes;
