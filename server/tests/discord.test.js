const request = require('supertest');
const express = require('express');
require('module-alias/register');
const jwt = require('jsonwebtoken');

const DiscordRoutes = require('../routes/implementations/DiscordRoutes');
const DiscordService = require('../services/integrations/DiscordService');

jest.mock('../services/integrations/DiscordService');

describe('Discord Routes', () => {
  let app;
  let token;

  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
    process.env.FRONTEND_URL = 'http://frontend';
    process.env.SERVER_URL = 'http://server';
    token = jwt.sign({ uid: 'org1', role: 'organization' }, process.env.JWT_SECRET);
    app = express();
    app.use(express.json());
    new DiscordRoutes().register(app);
  });

  test('GET /api/discord/oauth returns redirect url', async () => {
    DiscordService.generateOAuthURL.mockReturnValue('http://discord');
    const res = await request(app).get('/api/discord/oauth').query({ userId: 'org1' });

    expect(res.status).toBe(200);
    expect(res.body.redirectUrl).toBe('http://discord');
    expect(DiscordService.generateOAuthURL).toHaveBeenCalledWith('org1');
  });

  test('GET /api/discord/callback redirects', async () => {
    DiscordService.extractUserIdFromState.mockReturnValue('org1');
    DiscordService.exchangeCodeForToken.mockResolvedValue('token');

    const res = await request(app).get('/api/discord/callback').query({ code: 'c', state: 's' });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('http://frontend/profile/organization');
    expect(DiscordService.exchangeCodeForToken).toHaveBeenCalledWith('c', 'http://server/api/discord/callback');
    expect(DiscordService.saveAccessTokenToOrganization).toHaveBeenCalledWith('org1', 'token');
  });

  test('GET /api/discord/channels/:uid returns channels', async () => {
    DiscordService.fetchMutualGuildChannels.mockResolvedValue([]);
    const res = await request(app)
      .get('/api/discord/channels/org1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(DiscordService.fetchMutualGuildChannels).toHaveBeenCalledWith('org1');
  });

  test('PUT /api/discord/channel/:uid saves channel', async () => {
    const res = await request(app)
      .put('/api/discord/channel/org1')
      .set('Authorization', `Bearer ${token}`)
      .send({ channelId: '123' });

    expect(res.status).toBe(200);
    expect(DiscordService.saveDiscordChannel).toHaveBeenCalledWith('org1', '123');
  });
});
