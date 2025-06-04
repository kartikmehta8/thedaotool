const express = require('express');
const ContributorController = require('../../controllers/contributorController');
const AuthMiddleware = require('../../middlewares/implementations/AuthMiddleware');
const ValidationMiddleware = require('../../middlewares/implementations/ValidationMiddleware');
const contributorValidator = require('../../validators/contributorValidators');
const EmailVerifiedMiddleware = require('../../middlewares/implementations/EmailVerifiedMiddleware');
const IRoute = require('../IRoute');

class ContributorRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['contributor', 'organization']));

    router.post(
      '/apply',
      EmailVerifiedMiddleware.requireVerified,
      ValidationMiddleware.use(contributorValidator.applyToBountySchema),
      ContributorController.applyToBounty
    );

    router.post(
      '/submit',
      EmailVerifiedMiddleware.requireVerified,
      ValidationMiddleware.use(contributorValidator.submitWorkSchema),
      ContributorController.submitWork
    );

    router.get(
      '/bounties/:uid',
      ValidationMiddleware.use(contributorValidator.uidParamSchema),
      ContributorController.fetchBounties
    );

    router.get(
      '/profile/:uid',
      ValidationMiddleware.use(contributorValidator.getProfileOrPaymentsSchema),
      ContributorController.getProfile
    );

    router.put(
      '/profile/:uid',
      ValidationMiddleware.use(contributorValidator.saveProfileSchema),
      ContributorController.saveProfile
    );

    router.put(
      '/unassign',
      ValidationMiddleware.use(contributorValidator.unassignSelfSchema),
      ContributorController.unassignSelf
    );

    router.get(
      '/payments/:uid',
      ValidationMiddleware.use(contributorValidator.getProfileOrPaymentsSchema),
      ContributorController.getContributorPayments
    );

    app.use('/api/contributor', router);
  }
}

module.exports = ContributorRoutes;
