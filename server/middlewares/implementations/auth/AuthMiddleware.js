const jwt = require('jsonwebtoken');
const ResponseHelper = require('@utils/ResponseHelper');

class AuthMiddleware {
  static authenticate(allowedRoles = []) {
    return (req, res, next) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ResponseHelper.unauthorized(res, 'Missing or invalid token');
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
          return ResponseHelper.forbidden(res, 'Access denied for this role');
        }

        next();
      } catch (err) {
        return ResponseHelper.unauthorized(res, 'Invalid or expired token');
      }
    };
  }

  apply(app) {}
}

module.exports = AuthMiddleware;
