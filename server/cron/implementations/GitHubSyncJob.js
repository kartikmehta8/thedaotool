const cron = require('node-cron');
const syncGitHubIssues = require('../functions/syncGitHubIssues');
const ICronJob = require('../ICronJob');

class GitHubSyncJob extends ICronJob {
  schedule() {
    // Schedule: every 20 seconds.
    cron.schedule('*/20 * * * * *', async () => {
      console.log('Running GitHub issue sync...');
      await syncGitHubIssues();
    });
  }
}

module.exports = GitHubSyncJob;
