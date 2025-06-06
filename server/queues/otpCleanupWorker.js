const QueueService = require('./QueueService');
const OTPTokenService = require('@services/misc/OTPTokenService');

QueueService.process('otpCleanup', async () => {
  await OTPTokenService.clearExpiredOTPs();
});

module.exports = QueueService.getQueue('otpCleanup');
