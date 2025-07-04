const request = require('supertest');
const express = require('express');
require('module-alias/register');
const jwt = require('jsonwebtoken');

const ContributorRoutes = require('../routes/implementations/ContributorRoutes');
const ContributorService = require('../services/user/ContributorService');
const UserService = require('../services/user/UserService');
const AnalyticsService = require('../services/misc/AnalyticsService');

jest.mock('../services/user/ContributorService');
jest.mock('../services/user/UserService');
jest.mock('../services/misc/AnalyticsService');

describe('Contributor Routes', () => {
  let app;
  let token;

  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
    token = jwt.sign({ uid: 'contrib1', role: 'contributor' }, process.env.JWT_SECRET);
    app = express();
    app.use(express.json());
    new ContributorRoutes().register(app);
  });

  beforeEach(() => {
    UserService.getUserData.mockResolvedValue({ emailVerified: true });
  });

  test('POST /api/contributor/apply', async () => {
    const res = await request(app)
      .post('/api/contributor/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({ bountyId: 'b1' });

    expect(res.status).toBe(200);
    expect(ContributorService.applyToBounty).toHaveBeenCalledWith('b1', 'contrib1');
  });

  test('POST /api/contributor/submit', async () => {
    const res = await request(app)
      .post('/api/contributor/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ bountyId: 'b1', submittedLink: 'https://example.com' });

    expect(res.status).toBe(200);
    expect(ContributorService.submitWork).toHaveBeenCalledWith('b1', 'contrib1', 'https://example.com');
  });

  test('GET /api/contributor/bounties/:uid', async () => {
    ContributorService.fetchBounties.mockResolvedValue([]);
    const res = await request(app)
      .get('/api/contributor/bounties/contrib1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(ContributorService.fetchBounties).toHaveBeenCalledWith('contrib1');
  });

  test('GET /api/contributor/profile/:uid', async () => {
    ContributorService.getProfile.mockResolvedValue({ name: 'Alice' });
    const res = await request(app)
      .get('/api/contributor/profile/contrib1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.profile).toEqual({ name: 'Alice' });
  });

  test('PUT /api/contributor/profile/:uid', async () => {
    const res = await request(app)
      .put('/api/contributor/profile/contrib1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Alice' });

    expect(res.status).toBe(200);
    expect(ContributorService.saveProfile).toHaveBeenCalledWith('contrib1', { name: 'Alice' });
  });

  test('PUT /api/contributor/unassign', async () => {
    const res = await request(app)
      .put('/api/contributor/unassign')
      .set('Authorization', `Bearer ${token}`)
      .send({ bountyId: 'b1' });

    expect(res.status).toBe(200);
    expect(ContributorService.unassignSelf).toHaveBeenCalledWith('b1', 'contrib1');
  });

  test('GET /api/contributor/payments/:uid', async () => {
    ContributorService.getContributorPayments.mockResolvedValue([]);
    const res = await request(app)
      .get('/api/contributor/payments/contrib1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(ContributorService.getContributorPayments).toHaveBeenCalledWith('contrib1');
  });

  test('GET /api/contributor/analytics/:uid', async () => {
    AnalyticsService.getContributorAnalytics.mockResolvedValue({});
    const res = await request(app)
      .get('/api/contributor/analytics/contrib1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(AnalyticsService.getContributorAnalytics).toHaveBeenCalledWith('contrib1');
  });
});

