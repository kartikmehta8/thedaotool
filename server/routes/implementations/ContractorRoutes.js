const express = require('express');
const ContractorController = require('../../controllers/contractorController');
const AuthMiddleware = require('../../middlewares/implementations/AuthMiddleware');
const ValidationMiddleware = require('../../middlewares/implementations/ValidationMiddleware');
const IRoute = require('../IRoute');

const {
  applyToContractSchema,
  submitWorkSchema,
  uidParamSchema,
  saveProfileSchema,
  getProfileOrPaymentsSchema,
  unassignSelfSchema,
} = require('../../validators/contractorValidators');

class ContractorRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['contractor', 'business']));

    router.post(
      '/apply',
      ValidationMiddleware.use(applyToContractSchema),
      ContractorController.applyToContract
    );

    router.post(
      '/submit',
      ValidationMiddleware.use(submitWorkSchema),
      ContractorController.submitWork
    );

    router.get(
      '/contracts/:uid',
      ValidationMiddleware.use(uidParamSchema),
      ContractorController.fetchContracts
    );

    router.get(
      '/profile/:uid',
      ValidationMiddleware.use(getProfileOrPaymentsSchema),
      ContractorController.getProfile
    );

    router.put(
      '/profile/:uid',
      ValidationMiddleware.use(saveProfileSchema),
      ContractorController.saveProfile
    );

    router.put(
      '/unassign',
      ValidationMiddleware.use(unassignSelfSchema),
      ContractorController.unassignSelf
    );

    router.get(
      '/payments/:uid',
      ValidationMiddleware.use(getProfileOrPaymentsSchema),
      ContractorController.getContractorPayments
    );

    app.use('/api/contractor', router);
  }
}

module.exports = ContractorRoutes;
