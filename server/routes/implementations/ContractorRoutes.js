const express = require('express');
const ContractorController = require('../../controllers/contractorController');
const AuthMiddleware = require('../../middlewares/implementations/AuthMiddleware');
const ValidationMiddleware = require('../../middlewares/implementations/ValidationMiddleware');
const contractorValidator = require('../../validators/contractorValidators');
const IRoute = require('../IRoute');

class ContractorRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['contractor', 'business']));

    router.post(
      '/apply',
      ValidationMiddleware.use(contractorValidator.applyToContractSchema),
      ContractorController.applyToContract
    );

    router.post(
      '/submit',
      ValidationMiddleware.use(contractorValidator.submitWorkSchema),
      ContractorController.submitWork
    );

    router.get(
      '/contracts/:uid',
      ValidationMiddleware.use(contractorValidator.uidParamSchema),
      ContractorController.fetchContracts
    );

    router.get(
      '/profile/:uid',
      ValidationMiddleware.use(contractorValidator.getProfileOrPaymentsSchema),
      ContractorController.getProfile
    );

    router.put(
      '/profile/:uid',
      ValidationMiddleware.use(contractorValidator.saveProfileSchema),
      ContractorController.saveProfile
    );

    router.put(
      '/unassign',
      ValidationMiddleware.use(contractorValidator.unassignSelfSchema),
      ContractorController.unassignSelf
    );

    router.get(
      '/payments/:uid',
      ValidationMiddleware.use(contractorValidator.getProfileOrPaymentsSchema),
      ContractorController.getContractorPayments
    );

    app.use('/api/contractor', router);
  }
}

module.exports = ContractorRoutes;
