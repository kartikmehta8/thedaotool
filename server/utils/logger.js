const pino = require('pino');
const LokiTransport = require('pino-loki');
const config = require('../config/loggerConfig');

const streams = [];

if (config.logToFile) {
  streams.push({ stream: pino.destination(config.logFile) });
}

if (config.logToLoki && config.lokiUrl) {
  streams.push({ stream: new LokiTransport({ host: config.lokiUrl }) });
}

const logger = pino(
  {
    level: config.logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream(streams.length ? streams : [process.stdout])
);

module.exports = logger;
