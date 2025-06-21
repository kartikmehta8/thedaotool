const OrganizationService = require('@services/user/OrganizationService');
const AnalyticsService = require('@services/misc/AnalyticsService');
const ResponseHelper = require('@utils/ResponseHelper');
const logger = require('@utils/logger');

class OrganizationController {
  async createBounty(req, res) {
    const { values, userId } = req.body;
    const bounty = await OrganizationService.createBounty(values, userId);
    logger.info(
      {
        action: 'contract_create',
        user: req.user?.uid,
        ip: req.ip,
        bountyId: bounty.id,
      },
      'Bounty created'
    );
    return ResponseHelper.success(res, 'Bounty created');
  }

  async deleteBounty(req, res) {
    await OrganizationService.deleteBounty(req.params.id);
    logger.info(
      {
        action: 'contract_delete',
        user: req.user?.uid,
        ip: req.ip,
        bountyId: req.params.id,
      },
      'Bounty deleted'
    );
    return ResponseHelper.success(res, 'Deleted');
  }

  async updateBounty(req, res) {
    await OrganizationService.updateBounty(req.params.id, req.body);
    logger.info(
      {
        action: 'contract_edit',
        user: req.user?.uid,
        ip: req.ip,
        bountyId: req.params.id,
      },
      'Bounty updated'
    );
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
    logger.info(
      {
        action: 'admin_override',
        user: req.user?.uid,
        ip: req.ip,
        targetUid: req.params.uid,
      },
      'Organization profile updated'
    );
    return ResponseHelper.success(res, 'Profile saved');
  }

  async unassignContributor(req, res) {
    await OrganizationService.unassignContributor(req.params.bountyId);
    logger.info(
      {
        action: 'contract_edit',
        user: req.user?.uid,
        ip: req.ip,
        bountyId: req.params.bountyId,
      },
      'Contributor unassigned'
    );
    return ResponseHelper.success(res, 'Contributor unassigned');
  }

  async payBounty(req, res) {
    const txHash = await OrganizationService.payBounty(
      req.params.bountyId,
      req.user.uid
    );
    logger.info(
      {
        action: 'payment',
        user: req.user?.uid,
        ip: req.ip,
        bountyId: req.params.bountyId,
        txHash,
      },
      'Bounty payment sent'
    );
    return ResponseHelper.success(res, 'Payment sent', { txHash });
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
