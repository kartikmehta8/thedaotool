const express = require('express');
const IRoute = require('../IRoute');
const { register } = require('@utils/metrics');

class MonitoringRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    router.get('/metrics', async (req, res) => {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    });

    app.use('/', router);
  }
}

module.exports = MonitoringRoutes;
