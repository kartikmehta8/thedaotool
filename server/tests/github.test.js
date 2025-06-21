const request = require('supertest');
const express = require('express');
require('module-alias/register');
const jwt = require('jsonwebtoken');

const GithubRoutes = require('../routes/implementations/GithubRoutes');
const GithubService = require('../services/integrations/GithubService');

jest.mock('../services/integrations/GithubService');

describe('GitHub Routes', () => {
  let app;
  let token;

  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
    process.env.FRONTEND_URL = 'http://frontend';
    token = jwt.sign({ uid: 'org1', role: 'organization' }, process.env.JWT_SECRET);
    app = express();
    app.use(express.json());
    new GithubRoutes().register(app);
  });

  test('GET /api/github/auth returns oauth url', async () => {
    GithubService.generateOAuthUrl.mockResolvedValue('http://github');
    const res = await request(app).get('/api/github/auth').query({ userId: 'org1' });

    expect(res.status).toBe(200);
    expect(res.body.redirectUrl).toBe('http://github');
    expect(GithubService.generateOAuthUrl).toHaveBeenCalledWith('org1');
  });

  test('GET /api/github/callback redirects after saving token', async () => {
    GithubService.exchangeCodeForAccessToken.mockResolvedValue({ accessToken: 't', userId: 'org1' });

    const res = await request(app).get('/api/github/callback').query({ code: 'c', state: 's' });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('http://frontend/profile/organization');
    expect(GithubService.exchangeCodeForAccessToken).toHaveBeenCalledWith('c', 's');
    expect(GithubService.saveAccessToken).toHaveBeenCalledWith('org1', 't');
  });

  test('GET /api/github/repos/:uid returns repo list', async () => {
    GithubService.listRepos.mockResolvedValue(['repo1', 'repo2']);

    const res = await request(app)
      .get('/api/github/repos/org1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.repos).toEqual(['repo1', 'repo2']);
    expect(GithubService.listRepos).toHaveBeenCalledWith('org1');
  });

  test('POST /api/github/repo/:uid saves repo', async () => {
    const res = await request(app)
      .post('/api/github/repo/org1')
      .set('Authorization', `Bearer ${token}`)
      .send({ repo: 'owner/repo' });

    expect(res.status).toBe(200);
    expect(GithubService.validateAndSaveRepo).toHaveBeenCalledWith('org1', 'owner/repo');
  });
});
