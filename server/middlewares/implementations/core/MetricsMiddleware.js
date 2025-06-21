const IMiddleware = require('@middlewares/IMiddleware');
const { httpRequestDuration } = require('@utils/metrics');

class MetricsMiddleware extends IMiddleware {
  apply(app) {
    app.use((req, res, next) => {
      const end = httpRequestDuration.startTimer();
      res.on('finish', () => {
        const route = req.route?.path || req.path;
        end({ method: req.method, route, status_code: res.statusCode });
      });
      next();
    });
  }
}

module.exports = MetricsMiddleware;
