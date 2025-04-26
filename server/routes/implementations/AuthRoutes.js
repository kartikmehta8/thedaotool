const express = require('express');
const AuthController = require('../../controllers/authController');
const IRoute = require('../IRoute');

class AuthRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.post('/login', AuthController.loginUser);
    router.post('/signup', AuthController.signupUser);

    app.use('/api/auth', router);
  }
}

module.exports = AuthRoutes;
