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

        for (const issue of issues) {
          await FirestoreService.addDocument('bounties', {
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
          });

          const updatedLabels = GithubService.prepareUpdatedLabels(
            issue.labels
          );

          await GithubService.updateIssueLabels(
            repo,
            issue.number,
            updatedLabels,
            githubToken
          );

          await postToDiscord({
            organizationId,
            name: issue.title,
            description: issue.body,
            amount: 'TBD',
          });

          console.log(`Synced issue #${issue.number} from ${repo}`);
        }
      } catch (err) {
        console.error(`Error syncing issues for repo ${repo}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Error during GitHub Issue Sync:', err.message);
  }
}

module.exports = syncGitHubIssues;
