const QueueService = require('./QueueService');
const syncGitHubIssues = require('@cron/functions/syncGitHubIssues');

QueueService.process('githubSync', async () => {
  await syncGitHubIssues();
});

module.exports = QueueService.getQueue('githubSync');
