const FirestoreService = require('@services/database/FirestoreService');

class AnalyticsService {
  async getOrganizationAnalytics(organizationId) {
    const bounties = await FirestoreService.queryDocuments(
      'bounties',
      'organizationId',
      '==',
      organizationId
    );

    const statusCounts = {
      open: 0,
      assigned: 0,
      submitted: 0,
      pending_payment: 0,
      closed: 0,
    };
    const monthlyCounts = {};
    const contributorCounts = {};

    bounties.forEach((bounty) => {
      if (statusCounts[bounty.status] !== undefined) {
        statusCounts[bounty.status] += 1;
      }

      const month = bounty.createdAt
        ? new Date(bounty.createdAt).toISOString().slice(0, 7)
        : 'unknown';
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;

      if (bounty.contributorId) {
        contributorCounts[bounty.contributorId] =
          (contributorCounts[bounty.contributorId] || 0) + 1;
      }
    });

    const topContributors = Object.entries(contributorCounts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { statusCounts, monthlyCounts, topContributors };
  }

  async getContributorAnalytics(contributorId) {
    const bounties = await FirestoreService.queryDocuments(
      'bounties',
      'contributorId',
      '==',
      contributorId
    );

    const statusCounts = {
      open: 0,
      assigned: 0,
      submitted: 0,
      pending_payment: 0,
      closed: 0,
    };
    const monthlyCounts = {};

    bounties.forEach((bounty) => {
      if (statusCounts[bounty.status] !== undefined) {
        statusCounts[bounty.status] += 1;
      }

      const month = bounty.createdAt
        ? new Date(bounty.createdAt).toISOString().slice(0, 7)
        : 'unknown';
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    return { statusCounts, monthlyCounts };
  }
}

module.exports = new AnalyticsService();
