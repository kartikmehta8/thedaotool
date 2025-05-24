const express = require('express');
const BusinessController = require('../../controllers/businessController');
const AuthMiddleware = require('../../middlewares/implementations/AuthMiddleware');
const ValidationMiddleware = require('../../middlewares/implementations/ValidationMiddleware');
const businessValidator = require('../../validators/businessValidators');
const IRoute = require('../IRoute');

class BusinessRoutes extends IRoute {
  register(app) {
    const router = express.Router();

    router.use(AuthMiddleware.authenticate(['business']));

    router.post(
      '/contract',
      ValidationMiddleware.use(businessValidator.createContractSchema),
      BusinessController.createContract
    );

    router.delete(
      '/contract/:id',
      ValidationMiddleware.use(businessValidator.contractorIdParamSchema),
      BusinessController.deleteContract
    );

    router.put(
      '/contract/:id',
      ValidationMiddleware.use(businessValidator.updateContractSchema),
      BusinessController.updateContract
    );

    router.get(
      '/contracts/:uid',
      ValidationMiddleware.use(businessValidator.uidParamSchema),
      BusinessController.getContracts
    );

    router.get(
      '/contractor/:id',
      ValidationMiddleware.use(businessValidator.contractorIdParamSchema),
      BusinessController.getContractor
    );

    router.put(
      '/contractor/:id',
      ValidationMiddleware.use(businessValidator.updateContractorSchema),
      BusinessController.updateContractor
    );

    router.put(
      '/contracts/:contractId/unassign',
      ValidationMiddleware.use(businessValidator.contractIdParamSchema),
      BusinessController.unassignContractor
    );

    router.get(
      '/profile/:uid',
      ValidationMiddleware.use(businessValidator.uidParamSchema),
      BusinessController.getProfile
    );

    router.put(
      '/profile/:uid',
      ValidationMiddleware.use(businessValidator.uidAndBodySchema),
      BusinessController.saveProfile
    );

    router.get(
      '/payments/:uid',
      ValidationMiddleware.use(businessValidator.uidParamSchema),
      BusinessController.getBusinessPayments
    );

    app.use('/api/business', router);
  }
}

module.exports = BusinessRoutes;
