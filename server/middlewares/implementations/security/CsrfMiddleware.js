const IMiddleware = require('@middlewares/IMiddleware');
const ResponseHelper = require('@utils/ResponseHelper');

class CsrfMiddleware extends IMiddleware {
  apply(app) {
    app.use((req, res, next) => {
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
      }
      const token = req.headers['x-csrf-token'];
      if (!token || token !== process.env.CSRF_SECRET) {
        return ResponseHelper.forbidden(res, 'Invalid CSRF token');
      }
      return next();
    });
  }
}

module.exports = CsrfMiddleware;
