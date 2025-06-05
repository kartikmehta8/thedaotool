const FirestoreService = require('../../services/database/FirestoreService');
const GithubService = require('../../services/integrations/GithubService');
const postToDiscord = require('../../utils/postToDiscord');

async function syncGitHubIssues() {
  try {
    const organizations = await FirestoreService.getCollection('organizations');

    for (const organization of organizations) {
      const { githubToken, repo } = organization;
      const organizationId = organization.id;

      if (!githubToken || !repo) continue;

      try {
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
        console.error(`Error syncing issues for repo ${repo}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Error during GitHub Issue Sync:', err.message);
  }
}

module.exports = syncGitHubIssues;
