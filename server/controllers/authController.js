const UserService = require('../services/user/UserService');
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

  async sendPasswordReset(req, res) {
    const { email } = req.body;

    try {
      await UserService.sendOTP(email, 'passwordReset');
      return ResponseHelper.success(res, 'Reset OTP sent to email');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 400);
    }
  }

  async sendEmailVerification(req, res) {
    const { email } = req.body;

    try {
      await UserService.sendOTP(email, 'emailVerification');
      return ResponseHelper.success(res, 'Verification OTP sent to email');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 400);
    }
  }

  async verifyOTPToken(req, res) {
    const { email, token } = req.body;

    try {
      const status = await UserService.verifyOTP(email, token);
      return ResponseHelper.success(res, 'Token verified', {
        verified: status,
      });
    } catch (error) {
      return ResponseHelper.error(res, error.message, 400);
    }
  }

  async resetPassword(req, res) {
    const { email, token, newPassword } = req.body;

    try {
      await UserService.resetPassword(email, token, newPassword);
      return ResponseHelper.success(res, 'Password reset successful');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 400);
    }
  }
}

module.exports = new AuthController();
