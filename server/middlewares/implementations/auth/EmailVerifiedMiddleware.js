const UserService = require('@services/user/UserService');
const ResponseHelper = require('@utils/ResponseHelper');

class EmailVerifiedMiddleware {
  static async requireVerified(req, res, next) {
    try {
      const user = await UserService.getUserData(req.user.uid);
      if (!user.emailVerified) {
        return ResponseHelper.forbidden(res, 'Email not verified');
      }
      next();
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to verify email');
    }
  }

  apply(app) {}
}

module.exports = EmailVerifiedMiddleware;
