const cors = require('cors');
const IMiddleware = require('../IMiddleware');
require('dotenv').config();

class CorsMiddleware extends IMiddleware {
  constructor() {
    super();
    this.allowedURLs = [
      'http://localhost:3000',
      'https://app.bizzynetwork.in',
      process.env.FRONTEND_URL,
    ];
    this.middleware = cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (this.allowedURLs.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }

  apply(app) {
    app.use(this.middleware);
  }
}

module.exports = CorsMiddleware;
