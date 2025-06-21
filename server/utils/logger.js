const pino = require('pino');
const config = require('../config/loggerConfig');

let logger;

if (config.logToLoki && config.lokiUrl) {
  const transport = pino.transport({
    target: 'pino-loki',
    options: {
      host: config.lokiUrl,
      labels: { service: 'bizzy-backend' },
      batching: true,
      interval: 5,
      silenceErrors: false,
    },
  });

  logger = pino(
    {
      level: config.logLevel || 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport
  );
} else {
  logger = pino({
    level: config.logLevel || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

module.exports = logger;
