const request = require('supertest');
const express = require('express');
require('module-alias/register');
const jwt = require('jsonwebtoken');

const OrganizationRoutes = require('../routes/implementations/OrganizationRoutes');
const OrganizationService = require('../services/user/OrganizationService');
const UserService = require('../services/user/UserService');
const AnalyticsService = require('../services/misc/AnalyticsService');

jest.mock('../services/user/OrganizationService');
jest.mock('../services/user/UserService');
jest.mock('../services/misc/AnalyticsService');

describe('Organization Routes', () => {
  let app;
  let token;

  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
    token = jwt.sign({ uid: 'org1', role: 'organization' }, process.env.JWT_SECRET);
    app = express();
    app.use(express.json());
    new OrganizationRoutes().register(app);
  });

  beforeEach(() => {
    UserService.getUserData.mockResolvedValue({ emailVerified: true });
  });

  test('POST /api/organization/bounty creates bounty', async () => {
    OrganizationService.createBounty.mockResolvedValue({ id: 'b1' });

    const res = await request(app)
      .post('/api/organization/bounty')
      .set('Authorization', `Bearer ${token}`)
      .send({
        values: {
          name: 'Bug fix',
          description: 'Fix a bug',
          deadline: new Date().toISOString(),
          amount: 1,
          tags: 'bug'
        },
        userId: 'org1'
      });

    expect(res.status).toBe(200);
    expect(OrganizationService.createBounty).toHaveBeenCalled();
  });

  test('DELETE /api/organization/bounty/:id deletes bounty', async () => {
    const res = await request(app)
      .delete('/api/organization/bounty/b1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(OrganizationService.deleteBounty).toHaveBeenCalledWith('b1');
  });

  test('PUT /api/organization/bounty/:id updates bounty', async () => {
    const res = await request(app)
      .put('/api/organization/bounty/b1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated' });

    expect(res.status).toBe(200);
    expect(OrganizationService.updateBounty).toHaveBeenCalledWith('b1', { name: 'Updated' });
  });

  test('GET /api/organization/bounties/:uid returns bounties', async () => {
    OrganizationService.getBounties.mockResolvedValue([]);
    const res = await request(app)
      .get('/api/organization/bounties/org1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(OrganizationService.getBounties).toHaveBeenCalledWith('org1');
  });

  test('GET /api/organization/contributor/:id returns contributor', async () => {
    OrganizationService.getContributor.mockResolvedValue({ name: 'A' });
    const res = await request(app)
      .get('/api/organization/contributor/c1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.contributor).toEqual({ name: 'A' });
  });

  test('PUT /api/organization/contributor/:id updates contributor', async () => {
    const res = await request(app)
      .put('/api/organization/contributor/c1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'A' });

    expect(res.status).toBe(200);
    expect(OrganizationService.updateContributor).toHaveBeenCalledWith('c1', { name: 'A' });
  });

  test('PUT /api/organization/bounties/:bountyId/unassign unassigns contributor', async () => {
    const res = await request(app)
      .put('/api/organization/bounties/b1/unassign')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(OrganizationService.unassignContributor).toHaveBeenCalledWith('b1');
  });

  test('POST /api/organization/bounties/:id/pay processes payment', async () => {
    OrganizationService.payBounty.mockResolvedValue('hash123');

    const res = await request(app)
      .post('/api/organization/bounties/b123/pay')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.txHash).toBe('hash123');
    expect(OrganizationService.payBounty).toHaveBeenCalledWith('b123', 'org1');
  });

  test('GET /api/organization/profile/:uid returns profile', async () => {
    OrganizationService.getProfile.mockResolvedValue({ companyName: 'Org' });
    const res = await request(app)
      .get('/api/organization/profile/org1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.profile).toEqual({ companyName: 'Org' });
  });

  test('PUT /api/organization/profile/:uid saves profile', async () => {
    const res = await request(app)
      .put('/api/organization/profile/org1')
      .set('Authorization', `Bearer ${token}`)
      .send({ companyName: 'Org' });

    expect(res.status).toBe(200);
    expect(OrganizationService.saveProfile).toHaveBeenCalledWith('org1', { companyName: 'Org' });
  });

  test('GET /api/organization/payments/:uid returns payments', async () => {
    OrganizationService.getOrganizationPayments.mockResolvedValue([]);
    const res = await request(app)
      .get('/api/organization/payments/org1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(OrganizationService.getOrganizationPayments).toHaveBeenCalledWith('org1');
  });

  test('GET /api/organization/analytics/:uid returns analytics', async () => {
    AnalyticsService.getOrganizationAnalytics.mockResolvedValue({});
    const res = await request(app)
      .get('/api/organization/analytics/org1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(AnalyticsService.getOrganizationAnalytics).toHaveBeenCalledWith('org1');
  });
});
