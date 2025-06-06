const cron = require('node-cron');
const ICronJob = require('@cron/ICronJob');
const { otpCleanupQueue } = require('@queues');

class OTPTokenCleanupJob extends ICronJob {
  schedule() {
    // Schedule: every 10 minutes
    cron.schedule('0 */10 * * * *', async () => {
      await otpCleanupQueue.add('otpCleanup', {});
    });
  }
}

module.exports = OTPTokenCleanupJob;
