const cron = require('node-cron');
const ICronJob = require('../ICronJob');
const RealtimeDatabaseService = require('../../services/RealtimeDatabaseService');

class LoginAttemptCleanupJob extends ICronJob {
  schedule() {
    // Schedule: every 60 seconds.
    cron.schedule('* * * * *', async () => {
      console.log('Running login attempt cleanup...');
      await RealtimeDatabaseService.removeData('loginAttempts');
    });
  }
}

module.exports = LoginAttemptCleanupJob;
