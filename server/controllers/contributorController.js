const ContributorService = require('@services/user/ContributorService');
const AnalyticsService = require('@services/misc/AnalyticsService');
const ResponseHelper = require('@utils/ResponseHelper');

class ContributorController {
  async applyToBounty(req, res) {
    const { bountyId } = req.body;
    await ContributorService.applyToBounty(bountyId, req.user.uid);
    return ResponseHelper.success(res, 'Applied successfully');
  }

  async submitWork(req, res) {
    const { bountyId, submittedLink } = req.body;
    await ContributorService.submitWork(bountyId, req.user.uid, submittedLink);
    return ResponseHelper.success(res, 'Work submitted');
  }

  async fetchBounties(req, res) {
    const bounties = await ContributorService.fetchBounties(req.params.uid);
    return ResponseHelper.success(res, 'Bounties fetched', { bounties });
  }

  async getProfile(req, res) {
    const profile = await ContributorService.getProfile(req.params.uid);
    if (profile) {
      return ResponseHelper.success(res, 'Profile fetched', { profile });
    }
    return ResponseHelper.error(res, 'Profile not found', 404);
  }

  async saveProfile(req, res) {
    await ContributorService.saveProfile(req.params.uid, req.body);
    return ResponseHelper.success(res, 'Profile saved');
  }

  async unassignSelf(req, res) {
    const { bountyId } = req.body;

    if (!bountyId) {
      return ResponseHelper.error(res, 'Bounty ID is required', 400);
    }

    await ContributorService.unassignSelf(bountyId, req.user.uid);
    return ResponseHelper.success(res, 'Contributor unassigned');
  }

  async getContributorPayments(req, res) {
    const payments = await ContributorService.getContributorPayments(
      req.params.uid
    );
    return ResponseHelper.success(res, 'Payments fetched', { payments });
  }

  async getContributorAnalytics(req, res) {
    const analytics = await AnalyticsService.getContributorAnalytics(
      req.params.uid
    );
    return ResponseHelper.success(res, 'Analytics fetched', { analytics });
  }
}

module.exports = new ContributorController();
