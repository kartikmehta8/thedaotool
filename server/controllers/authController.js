const UserService = require('../services/user/UserService');
const ResponseHelper = require('../utils/ResponseHelper');

class AuthController {
  async loginUser(req, res) {
    const { email, password } = req.body;

    const userProfile = await UserService.login(email, password);
    return ResponseHelper.success(res, 'Login successful', {
      user: userProfile,
      token: UserService.generateToken(userProfile),
    });
  }

  async signupUser(req, res) {
    const { email, password, role } = req.body;

    const userProfile = await UserService.signup(email, password, role);
    return ResponseHelper.created(res, 'Signup successful', {
      user: userProfile,
      token: UserService.generateToken(userProfile),
    });
  }

  async sendPasswordReset(req, res) {
    const { email } = req.body;

    await UserService.sendOTP(email, 'passwordReset');
    return ResponseHelper.success(res, 'Reset OTP sent to email');
  }

  async sendEmailVerification(req, res) {
    const { email } = req.body;

    await UserService.sendOTP(email, 'emailVerification');
    return ResponseHelper.success(res, 'Verification OTP sent to email');
  }

  async verifyOTPToken(req, res) {
    const { email, token } = req.body;

    const status = await UserService.verifyOTP(email, token);
    return ResponseHelper.success(res, 'Token verified', {
      verified: status,
    });
  }

  async resetPassword(req, res) {
    const { email, token, newPassword } = req.body;

    await UserService.resetPassword(email, token, newPassword);
    return ResponseHelper.success(res, 'Password reset successful');
  }
}

module.exports = new AuthController();
