const FirestoreService = require('@services/database/FirestoreService');
const GithubService = require('@services/integrations/GithubService');
const postToDiscord = require('@utils/postToDiscord');
const CacheService = require('@services/misc/CacheService');
const logger = require('@utils/logger');

async function syncGitHubIssues() {
  try {
    logger.info({ action: 'github_sync_start' }, 'Starting GitHub issue sync');
    const organizations = await FirestoreService.getCollection('organizations');

    for (const organization of organizations) {
      const { githubToken, repo } = organization;
      const organizationId = organization.id;

      if (!githubToken || !repo) continue;

      try {
        logger.info(
          { action: 'github_sync_repo', organizationId, repo },
          'Syncing GitHub issues'
        );
        const issues = await GithubService.fetchOpenIssues(repo, githubToken);

        const bountyDocs = issues.map((issue) => ({
          name: issue.title,
          description: issue.body,
          githubIssueId: issue.id,
          deadline: '',
          organizationId,
          issueLink: issue.html_url,
          status: 'open',
          createdAt: new Date().toISOString(),
          github: true,
          submittedLink: '',
          tags: issue.labels.map((l) => l.name),
        }));

        await FirestoreService.addDocumentsBatch('bounties', bountyDocs);
        await CacheService.del('GET:*bounties*');

        await Promise.all(
          issues.map((issue) => {
            const updatedLabels = GithubService.prepareUpdatedLabels(
              issue.labels
            );

            return GithubService.updateIssueLabels(
              repo,
              issue.number,
              updatedLabels,
              githubToken
            );
          })
        );

        await Promise.all(
          issues.map((issue) =>
            postToDiscord({
              organizationId,
              name: issue.title,
              description: issue.body,
              amount: 'TBD',
            })
          )
        );
      } catch (err) {
        logger.error(
          { action: 'github_sync_error', repo, err: err.message },
          'Error syncing issues'
        );
      }
    }
    logger.info(
      { action: 'github_sync_complete' },
      'GitHub issue sync completed'
    );
  } catch (err) {
    logger.error(
      { action: 'github_sync_failed', err: err.message },
      'GitHub issue sync failed'
    );
  }
}

module.exports = syncGitHubIssues;
