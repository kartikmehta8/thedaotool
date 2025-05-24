const ContributorService = require('../services/user/ContributorService');
const ResponseHelper = require('../utils/ResponseHelper');

class ContributorController {
  async applyToBounty(req, res) {
    try {
      const { bountyId, userId } = req.body;
      await ContributorService.applyToBounty(bountyId, userId);
      return ResponseHelper.success(res, 'Applied successfully');
    } catch (err) {
      return ResponseHelper.error(res, 'Application failed');
    }
  }

  async submitWork(req, res) {
    try {
      const { bountyId, submittedLink } = req.body;
      await ContributorService.submitWork(bountyId, submittedLink);
      return ResponseHelper.success(res, 'Work submitted');
    } catch (err) {
      return ResponseHelper.error(res, 'Submission failed');
    }
  }

  async fetchBounties(req, res) {
    try {
      const bounties = await ContributorService.fetchBounties(req.params.uid);
      return ResponseHelper.success(res, 'Bounties fetched', { bounties });
    } catch (err) {
      return ResponseHelper.error(res, 'Fetch failed');
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await ContributorService.getProfile(req.params.uid);
      if (profile) {
        return ResponseHelper.success(res, 'Profile fetched', { profile });
      }
      return ResponseHelper.error(res, 'Profile not found', 404);
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to fetch profile');
    }
  }

  async saveProfile(req, res) {
    try {
      await ContributorService.saveProfile(req.params.uid, req.body);
      return ResponseHelper.success(res, 'Profile saved');
    } catch (err) {
      return ResponseHelper.error(res, 'Error saving profile');
    }
  }

  async unassignSelf(req, res) {
    const { bountyId } = req.body;

    if (!bountyId) {
      return ResponseHelper.error(res, 'Bounty ID is required', 400);
    }

    try {
      await ContributorService.unassignSelf(bountyId);
      return ResponseHelper.success(res, 'Contributor unassigned');
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to unassign contributor');
    }
  }

  async getContributorPayments(req, res) {
    try {
      const payments = await ContributorService.getContributorPayments(
        req.params.uid
      );
      return ResponseHelper.success(res, 'Payments fetched', { payments });
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to fetch payments');
    }
  }
}

module.exports = new ContributorController();
