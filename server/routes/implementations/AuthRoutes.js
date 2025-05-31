const express = require('express');
const AuthController = require('../../controllers/authController');
const ValidationMiddleware = require('../../middlewares/implementations/ValidationMiddleware');
const authValidator = require('../../validators/authValidators');
const IRoute = require('../IRoute');

class AuthRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.post(
      '/login',
      ValidationMiddleware.use({ body: authValidator.loginSchema }),
      AuthController.loginUser
    );
    router.post(
      '/signup',
      ValidationMiddleware.use({ body: authValidator.signupSchema }),
      AuthController.signupUser
    );
    router.post(
      '/forgot-password',
      ValidationMiddleware.use({ body: authValidator.emailSchema }),
      AuthController.sendPasswordReset
    );
    router.post(
      '/reset-password',
      ValidationMiddleware.use({ body: authValidator.resetPasswordSchema }),
      AuthController.resetPassword
    );

    router.post(
      '/verify-email',
      ValidationMiddleware.use({ body: authValidator.emailSchema }),
      AuthController.sendEmailVerification
    );
    router.post(
      '/verify-token',
      ValidationMiddleware.use({ body: authValidator.verifyTokenSchema }),
      AuthController.verifyOTPToken
    );

    app.use('/api/auth', router);
  }
}

module.exports = AuthRoutes;
