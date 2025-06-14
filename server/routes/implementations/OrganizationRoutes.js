const express = require('express');
const OrganizationController = require('@controllers/organizationController');
const AuthMiddleware = require('@middlewares/implementations/auth/AuthMiddleware');
const EmailVerifiedMiddleware = require('@middlewares/implementations/auth/EmailVerifiedMiddleware');
const OwnershipMiddleware = require('@middlewares/implementations/auth/OwnershipMiddleware');
const ValidationMiddleware = require('@middlewares/implementations/validation/ValidationMiddleware');
const organizationValidator = require('@validators/organizationValidators');
const CacheMiddleware = require('@middlewares/implementations/cache/CacheMiddleware');
const catchAsync = require('@utils/catchAsync');
const IRoute = require('../IRoute');

class OrganizationRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['organization']));

    router.post(
      '/bounty',
      EmailVerifiedMiddleware.requireVerified,
      ValidationMiddleware.use(organizationValidator.createBountySchema),
      catchAsync(OrganizationController.createBounty)
    );

    router.delete(
      '/bounty/:id',
      ValidationMiddleware.use(organizationValidator.contributorIdParamSchema),
      catchAsync(OrganizationController.deleteBounty)
    );

    router.put(
      '/bounty/:id',
      ValidationMiddleware.use(organizationValidator.updateBountySchema),
      catchAsync(OrganizationController.updateBounty)
    );

    router.get(
      '/bounties/:uid',
      ValidationMiddleware.use(organizationValidator.uidParamSchema),
      OwnershipMiddleware.verifyParamUid('uid'),
      CacheMiddleware.use(300),
      catchAsync(OrganizationController.getBounties)
    );

    router.get(
      '/contributor/:id',
      ValidationMiddleware.use(organizationValidator.contributorIdParamSchema),
      CacheMiddleware.use(300),
      catchAsync(OrganizationController.getContributor)
    );

    router.put(
      '/contributor/:id',
      ValidationMiddleware.use(organizationValidator.updateContributorSchema),
      catchAsync(OrganizationController.updateContributor)
    );

    router.put(
      '/bounties/:bountyId/unassign',
      ValidationMiddleware.use(organizationValidator.bountyIdParamSchema),
      catchAsync(OrganizationController.unassignContributor)
    );

    router.put(
      '/bounties/:bountyId/pay',
      ValidationMiddleware.use(organizationValidator.payBountySchema),
      catchAsync(OrganizationController.payBounty)
    );

    router.get(
      '/profile/:uid',
      ValidationMiddleware.use(organizationValidator.uidParamSchema),
      OwnershipMiddleware.verifyParamUid('uid'),
      CacheMiddleware.use(300),
      catchAsync(OrganizationController.getProfile)
    );

    router.put(
      '/profile/:uid',
      ValidationMiddleware.use(organizationValidator.uidAndBodySchema),
      OwnershipMiddleware.verifyParamUid('uid'),
      catchAsync(OrganizationController.saveProfile)
    );

    router.get(
      '/payments/:uid',
      ValidationMiddleware.use(organizationValidator.uidParamSchema),
      OwnershipMiddleware.verifyParamUid('uid'),
      CacheMiddleware.use(300),
      catchAsync(OrganizationController.getOrganizationPayments)
    );

    router.get(
      '/analytics/:uid',
      ValidationMiddleware.use(organizationValidator.uidParamSchema),
      OwnershipMiddleware.verifyParamUid('uid'),
      catchAsync(OrganizationController.getOrganizationAnalytics)
    );

    app.use('/api/organization', router);
  }
}

module.exports = OrganizationRoutes;
