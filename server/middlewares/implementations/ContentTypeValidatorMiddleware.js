const IMiddleware = require('../IMiddleware');

class ContentTypeValidatorMiddleware extends IMiddleware {
  apply(app) {
    app.use((req, res, next) => {
      const acceptedTypes = ['application/json'];

      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const reqContentType = req.headers['content-type']?.split(';')[0];

        if (!acceptedTypes.includes(reqContentType)) {
          return res
            .status(415)
            .json({ success: false, message: 'Unsupported Content-Type' });
        }
      }

      next();
    });
  }
}

module.exports = ContentTypeValidatorMiddleware;
