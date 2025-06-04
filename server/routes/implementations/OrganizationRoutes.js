const express = require('express');
const OrganizationController = require('../../controllers/organizationController');
const AuthMiddleware = require('../../middlewares/implementations/AuthMiddleware');
const EmailVerifiedMiddleware = require('../../middlewares/implementations/EmailVerifiedMiddleware');
const ValidationMiddleware = require('../../middlewares/implementations/ValidationMiddleware');
const organizationValidator = require('../../validators/organizationValidators');
const IRoute = require('../IRoute');

class OrganizationRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['organization']));

    router.post(
      '/bounty',
      EmailVerifiedMiddleware.requireVerified,
      ValidationMiddleware.use(organizationValidator.createBountySchema),
      OrganizationController.createBounty
    );

    router.delete(
      '/bounty/:id',
      ValidationMiddleware.use(organizationValidator.contributorIdParamSchema),
      OrganizationController.deleteBounty
    );

    router.put(
      '/bounty/:id',
      ValidationMiddleware.use(organizationValidator.updateBountySchema),
      OrganizationController.updateBounty
    );

    router.get(
      '/bounties/:uid',
      ValidationMiddleware.use(organizationValidator.uidParamSchema),
      OrganizationController.getBounties
    );

    router.get(
      '/contributor/:id',
      ValidationMiddleware.use(organizationValidator.contributorIdParamSchema),
      OrganizationController.getContributor
    );

    router.put(
      '/contributor/:id',
      ValidationMiddleware.use(organizationValidator.updateContributorSchema),
      OrganizationController.updateContributor
    );

    router.put(
      '/bounties/:bountyId/unassign',
      ValidationMiddleware.use(organizationValidator.bountyIdParamSchema),
      OrganizationController.unassignContributor
    );

    router.get(
      '/profile/:uid',
      ValidationMiddleware.use(organizationValidator.uidParamSchema),
      OrganizationController.getProfile
    );

    router.put(
      '/profile/:uid',
      ValidationMiddleware.use(organizationValidator.uidAndBodySchema),
      OrganizationController.saveProfile
    );

    router.get(
      '/payments/:uid',
      ValidationMiddleware.use(organizationValidator.uidParamSchema),
      OrganizationController.getOrganizationPayments
    );

    app.use('/api/organization', router);
  }
}

module.exports = OrganizationRoutes;
