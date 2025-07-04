const axios = require('axios');
const FirestoreService = require('../services/database/FirestoreService');
const DiscordService = require('../services/integrations/DiscordService');
const GithubService = require('../services/integrations/GithubService');
const PrivyService = require('../services/integrations/PrivyService');

jest.mock('axios');
jest.mock('../services/database/FirestoreService');

beforeAll(() => {
  process.env.SERVER_URL = 'http://localhost';
  process.env.GITHUB_CLIENT_ID = 'cid';
});

describe('DiscordService', () => {
  test('extractUserIdFromState', () => {
    expect(DiscordService.extractUserIdFromState('rand:user1')).toBe('user1');
  });

  test('validateRedirectUri', () => {
    expect(DiscordService.validateRedirectUri('http://localhost/api/discord/callback')).toBe(true);
  });
});

describe('GithubService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('generateOAuthUrl stores state', async () => {
    jest.spyOn(GithubService, 'generateStateToken').mockReturnValue('state1');
    FirestoreService.setDocument.mockResolvedValue();
    const url = await GithubService.generateOAuthUrl('u1');
    expect(FirestoreService.setDocument).toHaveBeenCalledWith('oauth_states', 'state1', expect.objectContaining({ userId: 'u1' }));
    expect(url).toContain('client_id=cid');
    expect(url).toContain('state=state1');
  });

  test('prepareUpdatedLabels removes dao and deduplicates', () => {
    const labels = [{ name: 'dao' }, { name: 'bug' }, { name: 'dao-platform' }];
    expect(GithubService.prepareUpdatedLabels(labels)).toEqual(['bug', 'dao-platform']);
  });
});

describe('PrivyService', () => {
  test('createWallet calls wallet api', async () => {
    PrivyService.client.walletApi = { createWallet: jest.fn().mockResolvedValue('wallet') };
    const res = await PrivyService.createWallet();
    expect(res).toBe('wallet');
    expect(PrivyService.client.walletApi.createWallet).toHaveBeenCalledWith({ chainType: 'solana' });
  });
});
