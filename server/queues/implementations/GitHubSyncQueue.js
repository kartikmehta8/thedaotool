const IQueue = require('../IQueue');
const syncGitHubIssues = require('@cron/functions/syncGitHubIssues');

class GitHubSyncQueue extends IQueue {
  constructor() {
    super();
    this.name = 'githubSyncQueue';
  }

  initialize(queueService) {
    this.queue = queueService.getQueue('githubSync');
    queueService.process('githubSync', async () => {
      await syncGitHubIssues();
    });
  }
}

module.exports = GitHubSyncQueue;
