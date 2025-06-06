const OrganizationService = require('@services/user/OrganizationService');
const AnalyticsService = require('@services/misc/AnalyticsService');
const ResponseHelper = require('@utils/ResponseHelper');

class OrganizationController {
  async createBounty(req, res) {
    const { values, userId } = req.body;
    await OrganizationService.createBounty(values, userId);
    return ResponseHelper.success(res, 'Bounty created');
  }

  async deleteBounty(req, res) {
    await OrganizationService.deleteBounty(req.params.id);
    return ResponseHelper.success(res, 'Deleted');
  }

  async updateBounty(req, res) {
    await OrganizationService.updateBounty(req.params.id, req.body);
    return ResponseHelper.success(res, 'Updated');
  }

  async getBounties(req, res) {
    const bounties = await OrganizationService.getBounties(req.params.uid);
    return ResponseHelper.success(res, 'Bounties fetched', { bounties });
  }

  async getContributor(req, res) {
    const contributor = await OrganizationService.getContributor(req.params.id);

    if (contributor) {
      return ResponseHelper.success(res, 'Contributor fetched', {
        contributor,
      });
    }
    return ResponseHelper.error(res, 'Contributor not found', 404);
  }

  async updateContributor(req, res) {
    await OrganizationService.updateContributor(req.params.id, req.body);
    return ResponseHelper.success(res, 'Contributor updated');
  }

  async getProfile(req, res) {
    const profile = await OrganizationService.getProfile(req.params.uid);

    if (profile) {
      return ResponseHelper.success(res, 'Profile fetched', { profile });
    }
    return ResponseHelper.error(res, 'Profile not found', 404);
  }

  async saveProfile(req, res) {
    await OrganizationService.saveProfile(req.params.uid, req.body);
    return ResponseHelper.success(res, 'Profile saved');
  }

  async unassignContributor(req, res) {
    await OrganizationService.unassignContributor(req.params.bountyId);
    return ResponseHelper.success(res, 'Contributor unassigned');
  }

  async getOrganizationPayments(req, res) {
    const payments = await OrganizationService.getOrganizationPayments(
      req.params.uid
    );
    return ResponseHelper.success(res, 'Payments fetched', { payments });
  }

  async getOrganizationAnalytics(req, res) {
    const analytics = await AnalyticsService.getOrganizationAnalytics(
      req.params.uid
    );
    return ResponseHelper.success(res, 'Analytics fetched', { analytics });
  }
}

module.exports = new OrganizationController();
