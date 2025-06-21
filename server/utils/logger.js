const pino = require('pino');
const config = require('../config/loggerConfig');

const logger = pino({
  level: config.logLevel || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: 'pino-loki',
    options: {
      host: config.lokiUrl,
      batching: true,
      interval: 5,
      silenceErrors: false,
      labels: { service: 'bizzy-backend' },
    },
  },
});

module.exports = logger;
