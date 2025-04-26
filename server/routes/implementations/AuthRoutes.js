const express = require('express');
const { loginUser, signupUser } = require('../../controllers/authController');
const IRoute = require('../IRoute');

class AuthRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.post('/login', loginUser);
    router.post('/signup', signupUser);

    app.use('/api/auth', router);
  }
}

module.exports = AuthRoutes;
