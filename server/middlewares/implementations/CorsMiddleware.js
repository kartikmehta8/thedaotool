const cors = require('cors');
const IMiddleware = require('../IMiddleware');
require('dotenv').config();

class CorsMiddleware extends IMiddleware {
  constructor() {
    super();
    this.middleware = cors({
      origin: process.env.FRONTEND_URL,
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
