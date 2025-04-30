const UserService = require('../services/UserService');
const ResponseHelper = require('../utils/ResponseHelper');

class AuthController {
  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const userProfile = await UserService.login(email, password);
      return ResponseHelper.success(res, 'Login successful', {
        user: userProfile,
        token: UserService.generateToken(userProfile),
      });
    } catch (error) {
      return ResponseHelper.error(res, error.message, 401);
    }
  }

  async signupUser(req, res) {
    const { email, password, role } = req.body;

    try {
      const userProfile = await UserService.signup(email, password, role);
      return ResponseHelper.created(res, 'Signup successful', {
        user: userProfile,
        token: UserService.generateToken(userProfile),
      });
    } catch (error) {
      return ResponseHelper.error(res, error.message, 400);
    }
  }
}

module.exports = new AuthController();
