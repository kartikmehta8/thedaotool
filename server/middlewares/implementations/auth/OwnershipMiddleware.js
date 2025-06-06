const ResponseHelper = require('@utils/ResponseHelper');

class OwnershipMiddleware {
  static verifyParamUid(paramName = 'uid') {
    return (req, res, next) => {
      if (req.params[paramName] !== req.user.uid) {
        return ResponseHelper.forbidden(res, 'Access denied');
      }
      next();
    };
  }

  static apply(app) {}
}

module.exports = OwnershipMiddleware;
