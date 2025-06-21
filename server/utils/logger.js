const pino = require('pino');
const config = require('../config/loggerConfig');

const targets = [
  {
    target: 'pino/file',
    level: config.logLevel,
    options: { destination: 1 },
  },
];

if (config.logToFile) {
  targets.push({
    target: 'pino/file',
    level: config.logLevel,
    options: { destination: config.logFile, mkdir: true },
  });
}

const logger = pino({
  level: config.logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: { targets },
});

module.exports = logger;
