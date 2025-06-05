const cron = require('node-cron');
const syncGitHubIssues = require('../functions/syncGitHubIssues');
const ICronJob = require('../ICronJob');

class GitHubSyncJob extends ICronJob {
  schedule() {
    // Schedule: every 10 minutes.
    cron.schedule('0 */10 * * * *', async () => {
      await syncGitHubIssues();
    });
  }
}

module.exports = GitHubSyncJob;
