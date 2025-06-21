const pino = require('pino');
const config = require('../config/loggerConfig');

const transport =
  config.logToLoki && config.lokiUrl
    ? pino.transport({
        target: 'pino-loki',
        options: {
          host: config.lokiUrl,
          batching: true,
          interval: 5,
          silenceErrors: false,
          labels: { service: 'bizzy-backend' },
        },
      })
    : undefined;

const logger = pino(
  {
    level: config.logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport || pino.destination(1)
);

module.exports = logger;
