const FirestoreService = require('../services/database/FirestoreService');
const GithubService = require('../services/integrations/GithubService');
const CacheService = require('../services/misc/CacheService');
const postToDiscord = require('../utils/postToDiscord');

jest.mock('../services/database/FirestoreService');
jest.mock('../services/integrations/GithubService');
jest.mock('../services/misc/CacheService');
jest.mock('../utils/postToDiscord');

const syncGitHubIssues = require('../cron/functions/syncGitHubIssues');

describe('syncGitHubIssues', () => {
  beforeEach(() => jest.clearAllMocks());

  test('processes issues for organizations', async () => {
    FirestoreService.getCollection.mockResolvedValue([
      { id: 'org1', githubToken: 'tok', repo: 'org/repo' }
    ]);
    GithubService.fetchOpenIssues.mockResolvedValue([
      { id: 1, title: 'a', body: 'b', html_url: 'u', number: 1, labels: [] }
    ]);
    GithubService.prepareUpdatedLabels.mockReturnValue(['dao-platform']);

    await syncGitHubIssues();

    expect(GithubService.fetchOpenIssues).toHaveBeenCalledWith('org/repo', 'tok');
    expect(FirestoreService.addDocumentsBatch).toHaveBeenCalled();
    expect(CacheService.del).toHaveBeenCalledWith('GET:*bounties*');
    expect(GithubService.updateIssueLabels).toHaveBeenCalledWith('org/repo', 1, ['dao-platform'], 'tok');
    expect(postToDiscord).toHaveBeenCalled();
  });
});
