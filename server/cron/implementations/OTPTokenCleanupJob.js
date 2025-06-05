const cron = require('node-cron');
const ICronJob = require('@cron/ICronJob');
const OTPTokenService = require('@services/misc/OTPTokenService');

class OTPTokenCleanupJob extends ICronJob {
  schedule() {
    // Schedule: every 10 minutes
    cron.schedule('0 */10 * * * *', async () => {
      await OTPTokenService.clearExpiredOTPs();
    });
  }
}

module.exports = OTPTokenCleanupJob;
