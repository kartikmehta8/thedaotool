const pino = require('pino');
const config = require('../config/loggerConfig');

const transport = pino.transport({
  target: 'pino-loki',
  options: {
    host: config.lokiUrl,
    batching: true,
    interval: 5,
    labels: { service: 'bizzy-backend' },
    silenceErrors: false,
  },
});

const logger = pino(
  {
    level: config.logLevel || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

module.exports = logger;
