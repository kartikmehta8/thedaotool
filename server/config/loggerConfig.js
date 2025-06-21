module.exports = {
  logLevel: process.env.LOG_LEVEL || 'info',
  logToFile: process.env.LOG_TO_FILE === 'true',
  logFile: process.env.LOG_FILE || 'logs/app.log',
};
