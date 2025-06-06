const express = require('express');
const ContributorController = require('@controllers/contributorController');
const AuthMiddleware = require('@middlewares/implementations/auth/AuthMiddleware');
const ValidationMiddleware = require('@middlewares/implementations/validation/ValidationMiddleware');
const contributorValidator = require('@validators/contributorValidators');
const EmailVerifiedMiddleware = require('@middlewares/implementations/auth/EmailVerifiedMiddleware');
const OwnershipMiddleware = require('@middlewares/implementations/auth/OwnershipMiddleware');
const CacheMiddleware = require('@middlewares/implementations/cache/CacheMiddleware');
const catchAsync = require('@utils/catchAsync');
const IRoute = require('../IRoute');

class ContributorRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['contributor', 'organization']));

    router.post(
      '/apply',
      EmailVerifiedMiddleware.requireVerified,
      ValidationMiddleware.use(contributorValidator.applyToBountySchema),
      catchAsync(ContributorController.applyToBounty)
    );

    router.post(
      '/submit',
      EmailVerifiedMiddleware.requireVerified,
      ValidationMiddleware.use(contributorValidator.submitWorkSchema),
      catchAsync(ContributorController.submitWork)
    );

    router.get(
      '/bounties/:uid',
      ValidationMiddleware.use(contributorValidator.uidParamSchema),
      OwnershipMiddleware.verifyParamUid('uid'),
      CacheMiddleware.use(300),
      catchAsync(ContributorController.fetchBounties)
    );

    router.get(
      '/profile/:uid',
      ValidationMiddleware.use(contributorValidator.getProfileOrPaymentsSchema),
      OwnershipMiddleware.verifyParamUid('uid'),
      CacheMiddleware.use(300),
      catchAsync(ContributorController.getProfile)
    );

    router.put(
      '/profile/:uid',
      ValidationMiddleware.use(contributorValidator.saveProfileSchema),
      OwnershipMiddleware.verifyParamUid('uid'),
      catchAsync(ContributorController.saveProfile)
    );

    router.put(
      '/unassign',
      ValidationMiddleware.use(contributorValidator.unassignSelfSchema),
      catchAsync(ContributorController.unassignSelf)
    );

    router.get(
      '/payments/:uid',
      ValidationMiddleware.use(contributorValidator.getProfileOrPaymentsSchema),
      OwnershipMiddleware.verifyParamUid('uid'),
      CacheMiddleware.use(300),
      catchAsync(ContributorController.getContributorPayments)
    );

    router.get(
      '/analytics/:uid',
      ValidationMiddleware.use(contributorValidator.getProfileOrPaymentsSchema),
      OwnershipMiddleware.verifyParamUid('uid'),
      catchAsync(ContributorController.getContributorAnalytics)
    );

    app.use('/api/contributor', router);
  }
}

module.exports = ContributorRoutes;
