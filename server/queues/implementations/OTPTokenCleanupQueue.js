const IQueue = require('../IQueue');
const OTPTokenService = require('@services/misc/OTPTokenService');

class OTPTokenCleanupQueue extends IQueue {
  constructor() {
    super();
    this.name = 'otpCleanupQueue';
  }

  initialize(queueService) {
    this.queue = queueService.getQueue('otpCleanup');
    queueService.process('otpCleanup', async () => {
      await OTPTokenService.clearExpiredOTPs();
    });
  }
}

module.exports = OTPTokenCleanupQueue;
