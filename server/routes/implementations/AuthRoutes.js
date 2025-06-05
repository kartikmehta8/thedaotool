const express = require('express');
const AuthController = require('@controllers/authController');
const ValidationMiddleware = require('@middlewares/implementations/validation/ValidationMiddleware');
const authValidator = require('@validators/authValidators');
const catchAsync = require('@utils/catchAsync');
const IRoute = require('../IRoute');

class AuthRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.post(
      '/login',
      ValidationMiddleware.use({ body: authValidator.loginSchema }),
      catchAsync(AuthController.loginUser)
    );
    router.post(
      '/signup',
      ValidationMiddleware.use({ body: authValidator.signupSchema }),
      catchAsync(AuthController.signupUser)
    );
    router.post(
      '/forgot-password',
      ValidationMiddleware.use({ body: authValidator.emailSchema }),
      catchAsync(AuthController.sendPasswordReset)
    );
    router.post(
      '/reset-password',
      ValidationMiddleware.use({ body: authValidator.resetPasswordSchema }),
      catchAsync(AuthController.resetPassword)
    );

    router.post(
      '/verify-email',
      ValidationMiddleware.use({ body: authValidator.emailSchema }),
      catchAsync(AuthController.sendEmailVerification)
    );
    router.post(
      '/verify-token',
      ValidationMiddleware.use({ body: authValidator.verifyTokenSchema }),
      catchAsync(AuthController.verifyOTPToken)
    );

    app.use('/api/auth', router);
  }
}

module.exports = AuthRoutes;
