const CacheService = require('@services/misc/CacheService');

class CacheMiddleware {
  static use(ttl = 300, keyFn) {
    return async (req, res, next) => {
      const keyBase = keyFn ? keyFn(req) : req.originalUrl;
      const key = `${req.method}:${keyBase}`;
      try {
        const cached = await CacheService.get(key);
        if (cached) {
          return res.json(cached);
        }
      } catch (err) {
        console.error('Cache read failed:', err.message);
      }

      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        try {
          await CacheService.set(key, body, ttl);
        } catch (err) {
          console.error('Cache write failed:', err.message);
        }
        return originalJson(body);
      };

      next();
    };
  }
}

module.exports = CacheMiddleware;
