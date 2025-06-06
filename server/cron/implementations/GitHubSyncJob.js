const cron = require('node-cron');
const { githubSyncQueue } = require('@queues');
const ICronJob = require('@cron/ICronJob');

class GitHubSyncJob extends ICronJob {
  schedule() {
    // Schedule: every 10 minutes.
    cron.schedule('0 */10 * * * *', async () => {
      await githubSyncQueue.add('githubSync', {});
    });
  }
}

module.exports = GitHubSyncJob;
