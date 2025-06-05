const cron = require('node-cron');
const ICronJob = require('@cron/ICronJob');
const RealtimeDatabaseService = require('@services/database/RealtimeDatabaseService');

class LoginAttemptCleanupJob extends ICronJob {
  schedule() {
    // Schedule: every 60 seconds.
    cron.schedule('* * * * *', async () => {
      await RealtimeDatabaseService.removeData('loginAttempts');
    });
  }
}

module.exports = LoginAttemptCleanupJob;
