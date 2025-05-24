const OrganizationService = require('../services/user/OrganizationService');
const ResponseHelper = require('../utils/ResponseHelper');

class OrganizationController {
  async createBounty(req, res) {
    try {
      const { values, userId } = req.body;
      await OrganizationService.createBounty(values, userId);
      return ResponseHelper.success(res, 'Bounty created');
    } catch (err) {
      return ResponseHelper.error(res, 'Creation failed');
    }
  }

  async deleteBounty(req, res) {
    try {
      await OrganizationService.deleteBounty(req.params.id);
      return ResponseHelper.success(res, 'Deleted');
    } catch (err) {
      return ResponseHelper.error(res, 'Delete failed');
    }
  }

  async updateBounty(req, res) {
    try {
      await OrganizationService.updateBounty(req.params.id, req.body);
      return ResponseHelper.success(res, 'Updated');
    } catch (err) {
      return ResponseHelper.error(res, 'Update failed');
    }
  }

  async getBounties(req, res) {
    try {
      const bounties = await OrganizationService.getBounties(req.params.uid);
      return ResponseHelper.success(res, 'Bounties fetched', { bounties });
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to fetch bounties');
    }
  }

  async getContributor(req, res) {
    try {
      const contributor = await OrganizationService.getContributor(
        req.params.id
      );

      if (contributor) {
        return ResponseHelper.success(res, 'Contributor fetched', {
          contributor,
        });
      }
      return ResponseHelper.error(res, 'Contributor not found', 404);
    } catch (err) {
      return ResponseHelper.error(res, 'Error fetching contributor');
    }
  }

  async updateContributor(req, res) {
    try {
      await OrganizationService.updateContributor(req.params.id, req.body);
      return ResponseHelper.success(res, 'Contributor updated');
    } catch (err) {
      return ResponseHelper.error(res, 'Error updating contributor');
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await OrganizationService.getProfile(req.params.uid);

      if (profile) {
        return ResponseHelper.success(res, 'Profile fetched', { profile });
      }
      return ResponseHelper.error(res, 'Profile not found', 404);
    } catch (err) {
      return ResponseHelper.error(res, 'Error fetching profile');
    }
  }

  async saveProfile(req, res) {
    try {
      await OrganizationService.saveProfile(req.params.uid, req.body);
      return ResponseHelper.success(res, 'Profile saved');
    } catch (err) {
      return ResponseHelper.error(res, 'Error saving profile');
    }
  }

  async unassignContributor(req, res) {
    try {
      await OrganizationService.unassignContributor(req.params.bountyId);
      return ResponseHelper.success(res, 'Contributor unassigned');
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to unassign contributor');
    }
  }

  async getOrganizationPayments(req, res) {
    try {
      const payments = await OrganizationService.getOrganizationPayments(
        req.params.uid
      );
      return ResponseHelper.success(res, 'Payments fetched', { payments });
    } catch (err) {
      return ResponseHelper.error(res, 'Failed to fetch payments');
    }
  }
}

module.exports = new OrganizationController();
